#!/usr/bin/env node
import inquirer from "inquirer";
import path, { dirname } from "path";
import fs from "fs";
import "colors";
import { exec } from "child_process";
import { promisify } from "util";
import ora from "ora";
import { fileURLToPath } from "url";

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
                { value: "Express Vanilla" },
                { value: "Api-Engine Stexcore" }
            ]
        },
        {
            type: "input",
            required: true,
            message: "Enter the project name:",
            name: "proyect_name",
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
            type: "list",
            message: "Would you like to include 'sequelize' to manage a database?",
            name: "sequelize",
            choices: [
                { value: "Yes" },
                { value: "No" }
            ]
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
            default: "data/database.sqlite",
            when: (values) => {
                return values.db_type == "sqlite"
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
                switch(values.db_type) {
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
        }
    ]);

    let template: string;

    // Get template
    switch(values.template) {
        case "Express Vanilla":
            template = "@express.vanilla";
            break;

        case "Api-Engine Stexcore":
            template = "@stexcore.api-engine";
            break;

        default:
            throw new Error("Unknow template '" + values.template + "'");
    }
    
    const template_dir = path.join(__dirname, "../template", template);
    const directory_base = path.join(template_dir, "base");
    const directory = path.join(template_dir, values.technology === "JavaScript" ? "javascript" : "typescript");
    const directory_template_base = path.join(directory, "base");
    const directory_template_sequelize = path.join(directory, "sequelize");
    const destination = process.cwd();
    const destination_src = path.join(destination, "src");

    // console.log("Generating package.json");

    // // Execute npm initialization
    // const { stdout, stderr } = await promisify(exec)(`npm init -y --name "${values.proyect_name}" --version "1.0.0"`);
    
    // console.log(stderr);
    // console.log(stdout);
    
    // Copy files base
    CopyFiles(directory_base, destination);
    CopyFiles(directory_template_base, destination);

    if(values.sequelize == "Yes") {
        // Copy sequelize connection
        CopyFiles(directory_template_sequelize, destination_src);

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
    }

    const spinner = ora({
        text: "Updating package.json!",
        color: 'cyan',
        spinner: 'dots'
    }).start();

    const packageJsonDir = path.join(destination, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonDir).toString());
    
    fs.writeFileSync(packageJsonDir, JSON.stringify({
        name: values.proyect_name,
        version: "1.0.0",
        description: "Api Express to manage incomming request HTTP",
        ...packageJson,
    }, null, 2));

    spinner.succeed("Package.json updated!");

    const dependenciesDir = path.join(template_dir, "dependencies.json");
    const { devDependencies, dependencies } = JSON.parse(fs.readFileSync(dependenciesDir).toString());

    const dependenciesTemplateDir = path.join(directory, "dependencies.json");

    // Validate existent dependencies
    if(fs.existsSync(dependenciesTemplateDir)) {
        const { devDependencies: devTemplateDependencies, dependencies: templatesDependencies } = JSON.parse(fs.readFileSync(dependenciesTemplateDir).toString());
    
        // Append dependencies
        dependencies.push(...templatesDependencies);
        devDependencies.push(...devTemplateDependencies);
    }
    
    if(dependencies.length) { 
        console.log("Installing dependencies using:");

        const spinner = ora({
            text: "npm install " + dependencies.join(" "),
            color: 'cyan',
            spinner: 'dots'
        }).start();

        await cmd("npm install " + dependencies.join(" "), { cwd: destination });

        spinner.succeed('Dependencies ' + dependencies.join(", ") + ' installed!');
    }
    if(devDependencies.length) {
        console.log("Installing devDependencies using:");

        const spinner = ora({
            text: "npm install --save-dev " + devDependencies.join(" "),
            color: 'cyan',
            spinner: 'dots'
        }).start();

        await cmd("npm install --save-dev " + devDependencies.join(" "), { cwd: destination });

        spinner.succeed('devDependencies ' + devDependencies.join(", ") + ' installed!');
    }
    
})()
    .catch((err) => {
        console.log(err instanceof Error ? err.message : "CLI Exited");
    });

function CopyFiles(from_dir: string, to_dir: string) {
    const files = fs.readdirSync(from_dir);

    for(const fileItem of files) {
        const spinner = ora({
            text: `Creating file into '${path.join(to_dir, fileItem)}'`,
            color: 'cyan',
            spinner: 'dots'
        }).start();

        fs.cpSync(path.join(from_dir, fileItem), path.join(to_dir, fileItem), { recursive: true });
        spinner.succeed(`File '${path.join(to_dir, fileItem)}' created!`)
    }
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