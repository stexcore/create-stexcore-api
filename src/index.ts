#!/usr/bin/env node
import inquirer from "inquirer";
import path, { dirname } from "path";
import fs from "fs";
import "colors";
import { exec } from "child_process";
import { promisify } from "util";
import ora from "ora";
import { fileURLToPath } from "url";
import Joi from "joi";

interface ISchemaInsert {
    file: string,
    inserts: {
        position: string
        search: string
        content: string
    }[]
}

interface ISchemaDependencies {
    dependencies: string[],
    devDependencies: string[]
}

const cmd = promisify(exec);

// Make filename and dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
    const values = await inquirer.prompt([
        {
            type: "list",
            message: "What template do you prefer to use for development?",
            name: "template",
            choices: [
                { value: "Api-Engine Stexcore + Tree mode" },
                { value: "Api-Engine Stexcore + Compact mode" },
                { value: "Express Vanilla" }
            ]
        },
        {
            type: "input",
            required: true,
            message: "Enter the project directory:",
            default: "./",
            name: "proyect_dir",
            filter: (value) => {
                return String(value).trim();
            }
        },
        {
            type: "list",
            message: "What technology do you prefer to use for development?",
            name: "technology",
            choices: [
                { value: "TypeScript" },
                { value: "JavaScript" }
            ]
        },
        {
            type: "confirm",
            message: "Would you like to include 'sequelize' to manage a database?",
            name: "sequelize",
            default: false
        },
        {
            type: "list",
            message: "Select the database type to configure your Sequelize connection credentials:",
            name: "db_type",
            choices: [
                { value: "sqlite" },
                { value: "mysql" },
                { value: "mariadb" },
                { value: "msql" },
                { value: "postgres" },
                { value: "mssql" },
                { value: "I prefer to configure it myself later." }
            ],
            when: (values) => {
                return values.sequelize == "Yes";
            }
        },
        {
            type: "input",
            message: "Please specify the file path where the SQLite database will be stored:",
            name: "db_path",
            default: ".data/database.sqlite",
            when: (values) => {
                return values.db_type == "sqlite";
            }
        },
        {
            type: "input",
            message: "Please enter the hostname or IP address of the database server:",
            name: "db_host",
            default: "localhost",
            when: isDBConnection
        },
        {
            type: "number",
            message: "Enter the port number for connecting to the database",
            name: "db_port",
            default: (values) => {
                switch (values.db_type) {
                    case "mariadb":
                    case "mysql":
                        return 3306;

                    case "postgres":
                        return 5432;

                        case "mssql":
                        return 1433;
                }
            },
            when: isDBConnection
        },
        {
            type: "input",
            message: "Please enter the username for connecting to the database:",
            name: "db_user",
            default: "root",
            when: isDBConnection
        },
        {
            type: "password",
            message: "Please enter the password for the database user:",
            name: "db_pass",
            mask: true,
            when: isDBConnection
        },
        {
            type: "input",
            name: "db_database",
            message: "Please enter the database:",
            default: "optional",
            when: isDBConnection
        },
        {
            type: "confirm",
            message: "Would you like to initialize the project using git?",
            name: "init_git",
            default: true
        }
    ]);

    let template: string;

    // Get template
    switch (values.template) {
        case "Express Vanilla":
            template = "@express.vanilla";
            break;
        
        case "Api-Engine Stexcore + Tree mode":
            template = "@stexcore.api-engine-tree";
            break;

        case "Api-Engine Stexcore + Compact mode":
            template = "@stexcore.api-engine-compact";
            break;

        default:
            throw new Error("Unknown template '" + values.template + "'");
    }

    const template_dir = path.join(__dirname, "../template", template);
    const directory_base = path.join(template_dir, "base");
    const directory = path.join(template_dir, values.technology === "JavaScript" ? "javascript" : "typescript");
    const directory_template_base = path.join(directory, "base");
    const directory_template_sequelize = path.join(directory, "sequelize");
    const destination = path.join(process.cwd(), values.proyect_dir);

    if (!fs.existsSync(destination)) {
        const spinner = CreateLoading("Creating directory: " + destination);
        fs.mkdirSync(destination);
        spinner.succeed("Directory '" + destination + "' created!");
    }

    // List files to copy
    const filesToCopy: { from: string, to: string, onCopied?: () => void }[] = [];

    // Copy files base
    filesToCopy.push({ from: directory_base, to: destination });
    filesToCopy.push({ from: directory_template_base, to: destination });

    if (values.sequelize) {
        // Copy sequelize connection
        filesToCopy.push({ 
            from: directory_template_sequelize, 
            to: destination,
            onCopied: () => {
                // Append .env content
                fs.appendFileSync(path.join(destination, ".env"),
                    "\n\n" +
                    "# Database Config\n" +
                    "DB_TYPE=" + JSON.stringify(values.db_type) + "\n" +
                    (values.db_type == "sqlite" ? (
                        "DB_STORAGE=" + JSON.stringify(values.db_path)
                    ) : (
                        (
                            values.db_database === "optional" ? "" :
                                ("DB_DATABASE=" + JSON.stringify(values.db_database ?? null))
                        ) +
                        "DB_USER=" + JSON.stringify(values.db_user) + "\n" +
                        "DB_PASSWORD=" + JSON.stringify(values.db_pass) + "\n" +
                        "DB_HOST=" + JSON.stringify(values.db_host)
                    ))
                );

                switch(values.db_type) {
                    case "sqlite":
                        dependencies.push("sqlite3");
                        break;

                    case "mysql":
                        dependencies.push("mysql2");
                        break;

                    case "mariadb":
                        dependencies.push("mariadb");
                        break;

                    case "msql":
                        dependencies.push("tedious");
                        break;

                    default:
                        console.log("Database connection manager dependencies were not appended!");
                }
            }
        });
    }

    // Dependencies to load
    const dependencies: string[] = [];
    const devDependencies: string[] = [];

    // Copy files
    for (const copyItem of filesToCopy) {
        const result = CopyFiles(copyItem.from, copyItem.to);

        // Append dependencies founded!
        dependencies.push(...result.dependencies);
        devDependencies.push(...result.devDependencies);

        if (copyItem.onCopied) copyItem.onCopied();
    }

    // Update package.json
    const spinner = CreateLoading("Updating package.json!");
    const packageJsonDir = path.join(destination, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonDir).toString());
    const proyect_name = path.basename(destination);

    fs.writeFileSync(packageJsonDir, JSON.stringify({
        name: proyect_name,
        version: "1.0.0",
        description: "Api Express to manage incoming HTTP requests",
        ...packageJson,
    }, null, 2));

    spinner.succeed("Package.json updated!");

    if (dependencies.length) {
        console.log("Installing dependencies using:");

        const depSpinner = CreateLoading("npm install " + dependencies.join(" "));

        await cmd("npm install " + dependencies.join(" "), { cwd: destination });

        depSpinner.succeed("Dependencies " + dependencies.join(", ") + " installed!");
    }
    if (devDependencies.length) {
        console.log("Installing devDependencies using:");

        const devDepSpinner = CreateLoading("npm install --save-dev " + devDependencies.join(" "));

        await cmd("npm install --save-dev " + devDependencies.join(" "), { cwd: destination });

        devDepSpinner.succeed("DevDependencies " + devDependencies.join(", ") + " installed!");
    }

    if (values.init_git) {
        const gitSpinner = CreateLoading("Initializing git repository...");
        await cmd("git init", { cwd: destination });
        gitSpinner.succeed("Git repository initialized!");
    }

    console.log(`
👉 To get started with your new project:

1. Navigate to the project directory:

   ${`cd ${destination}`.cyan}

2. Start the server in development mode:

   ${"npm run dev".cyan}

All set! 🚀 Start building something amazing!
`);

})()
    .catch((err) => {
        console.log(err instanceof Error ? err.message : "CLI Exited");
        process.exit(-1);
    });

const schemaInserts = Joi.array<ISchemaInsert[]>().items(
    Joi.object({
        "file": Joi.string().required(),
        "inserts": Joi.array().items(
            Joi.object({
                "position": Joi.string().required(),
                "search": Joi.string().required(),
                "content": Joi.string().required()
            })
        )
    })
);

const schemaDependencies = Joi.object<ISchemaDependencies>({
    dependencies: Joi.array().items(
        Joi.string()
    ),
    devDependencies: Joi.array().items(
        Joi.string()
    )
});

function CopyFiles(from_dir: string, to_dir: string): { dependencies: string[], devDependencies: string[] } {
    const dependencies: string[] = [];
    const devDependencies: string[] = [];
    
    if (!fs.existsSync(to_dir)) {
        fs.mkdirSync(to_dir, { recursive: true }); // Asegurar que el destino existe
    }

    const items = fs.readdirSync(from_dir);
    const inserts: { root: string, insert_file: string }[] = [];

    for (const item of items) {
        const fromPath = path.join(from_dir, item);
        const toPath = path.join(to_dir, item);

        const stats = fs.statSync(fromPath);

        if (item == "@insert.json") {
            inserts.push({ root: to_dir, insert_file: fromPath });
        }
        else if(item == "@dependencies.json") {
            const data = JSON.parse(
                fs.readFileSync(fromPath).toString()
            );

            const result = schemaDependencies.validate(data);

            if(result.error) {
                throw new Error(result.error.message);
            }
            else {
                dependencies.push(...result.value.dependencies);
                devDependencies.push(...result.value.devDependencies);
            }
        }
        else if (stats.isDirectory()) {
            // Si es una carpeta, entrar recursivamente en ella
            CopyFiles(fromPath, toPath);
        } else {
            // Si es un archivo, solo copiar si no existe
            const spinner = CreateLoading(`Copying '${item}' to '${toPath}'`);
            if (!fs.existsSync(toPath)) {
                fs.copyFileSync(fromPath, toPath);
                spinner.succeed(`File '${item}' copied!`);
            } else {
                fs.copyFileSync(fromPath, toPath);
                spinner.succeed(`File '${item}' replaced!`);
            }
        }
    }

    for (const insertFile of inserts) {
        const data = JSON.parse(
            fs.readFileSync(insertFile.insert_file).toString()
        );

        const validation = schemaInserts.validate(data);

        if (validation.error) {
            throw validation.error;
        }
        else {
            const fileInserting = insertFile.insert_file.replace(path.join(__dirname, ".."), "")
            const spinner = CreateLoading(`Inserting data using '${fileInserting}' directive`);
            try {
                for (const operationInsert of validation.value) {
                    const dirFile = path.join(insertFile.root, operationInsert.file);
                    let dataFile = fs.readFileSync(dirFile).toString();

                    for (const insert of operationInsert.inserts) {
                        let padding = "";
                        const index = dataFile.indexOf(insert.search);

                        if (index !== -1) {

                            switch (insert.position) {
                                case "after": {
                                    let indexEnd = dataFile.indexOf("\n", index);
                                    const spaces = ["\t", " "];
                                    for (let i = index - 1; i >= 0 && spaces.includes(dataFile[i]); i--) {
                                        padding += dataFile[i];
                                    }

                                    if (indexEnd === -1) indexEnd = dataFile.length;

                                    dataFile =
                                        dataFile.substring(0, indexEnd) + "\n" +
                                        padding + insert.content.replace(/\n/g, "\n" + padding) +
                                        dataFile.substring(indexEnd, dataFile.length);
                                } break;

                                case "before": {
                                    let indexStart = index;
                                    const spaces = ["\t", " "];
                                    let padding = "";

                                    while (indexStart > 0 && dataFile[indexStart - 1] !== "\n") {
                                        indexStart--;
                                    }

                                    for (let i = indexStart; i < index && spaces.includes(dataFile[i]); i++) {
                                        padding += dataFile[i];
                                    }

                                    dataFile =
                                        dataFile.substring(0, indexStart) +
                                        padding + insert.content.replace(/\n/g, "\n" + padding) + "\n" +
                                        dataFile.substring(indexStart, dataFile.length);
                                } break;

                                default:
                                    throw new Error("Position to insert '" + insert.position + "' invalid!");
                            }

                        }
                        else throw new Error("Search '" + insert.search + "' is'nt matched in file '" + dirFile + "'!");
                    }

                    fs.writeFileSync(dirFile, dataFile);
                }
                spinner.succeed(`Inserted data using '${fileInserting}' directive`)
            }
            catch (err) {
                spinner.fail(`Failed to insert data using '${fileInserting}' directive`)
                throw err;
            }
        }
    }

    return { dependencies, devDependencies };
}

function isDBConnection({ db_type }: { db_type?: string }) {
    return [
        "mysql",
        "mariadb",
        "msql",
        "postgres",
        "mssql",
    ].includes(String(db_type));
}

function CreateLoading(text: string) {
    return ora({
        text: text,
        color: 'cyan',
        spinner: 'dots'
    }).start();
}