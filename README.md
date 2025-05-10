
# Create Stexcore API CLI 🚀

[![NPM Version](https://img.shields.io/npm/v/create-stexcore-api?style=flat-square)](https://www.npmjs.com/package/create-stexcore-api) [![License](https://img.shields.io/github/license/stexcore/create-stexcore-api.svg)](./LICENSE) [![TypeScript](https://img.shields.io/badge/TypeScript-%5E5.8.2-blue?style=flat-square)](https://www.typescriptlang.org/)

Create Stexcore API CLI is a powerful command line tool designed to streamline the initialization of API projects in Node.js. Leveraging Express and a scalable project structure, this CLI allows you to interactively configure your backend environment. You can choose between TypeScript and JavaScript, and optionally integrate Sequelize for hassle-free database management.

---

## Features 🌟

- **API Project Initialization:**  
  Quickly generate API projects based on **Express** with a scalable, modular structure.
  
- **Language Support:**  
  Choose between **TypeScript** and **JavaScript** to suit your development preferences.

- **Optional Sequelize Integration:**  
  Enable Sequelize for easy database management.  
  - Supports various databases: SQLite, MySQL, MariaDB, PostgreSQL, MSSQL, and more.
  - Dynamically generates a `.env` file from your input during the interactive setup.

- **Automated File Copying and Customization:**  
  - Recursively copies files and directories from pre-built templates.
  - Uses special directives like `@insert.json` to automatically insert code snippets into target files.
  - Configures additional dependencies via `@dependencies.json`.

- **Interactive Experience with Visual Feedback:**  
  Uses spinners (powered by [ora](https://www.npmjs.com/package/ora)) to indicate progress and provide a dynamic, user-friendly setup.

---

## Installation ⚙️

You can install the CLI globally via npm:

```bash
npm install -g create-stexcore-api
```

**Alternatively, you can also use the npm initializer:**

```bash
npm init stexcore-api
```

Requirements:
- [Node.js](https://nodejs.org/) (preferably the LTS version)
- npm (bundled with Node.js)

---

## Usage 💻

Launch the CLI using either of these commands:

```bash
create-stexcore-api
```

**Or**

```bash
npm init stexcore-api
```

The CLI will prompt you interactively through the following steps:

1. **Template Selection**  
   Choose between options such as:
   - **Express Vanilla**
   - **Api-Engine Stexcore**

2. **Project Configuration**  
   - Specify the project directory.
   - Select your preferred language: **JavaScript** or **TypeScript**.

3. **Database Integration (Optional)**  
   - Enable Sequelize integration.
   - Select the type of database (SQLite, MySQL, MariaDB, PostgreSQL, MSSQL, etc.).
   - Enter the required database connection parameters:
     - For SQLite: specify the file path for the database.
     - For other databases: configure the host, port, username, password, and optionally, the database name.

4. **File Generation and Dependency Installation**  
   - Generates base files and project-specific templates.
   - Automatically updates your `package.json` with project metadata.
   - Installs the necessary dependencies and devDependencies based on your choices.

---

## Example Walkthrough 🌱

Below is an example of the CLI in action:

```bash
$ npm init stexcore-api

? What template do you prefer to use for development? (Use arrow keys)
  Express Vanilla
  Api-Engine Stexcore

? Enter the project directory: ./my-api-project

? What technology do you prefer to use for development? TypeScript

? Would you like to include 'Sequelize' to manage a database? Yes

? Select the database type for your Sequelize configuration: Postgres

? Please enter the hostname or IP address of the database server: localhost

? Enter the port number for connecting to the database: 5432

? Please enter the username for connecting to the database: root

? Please enter the password for the database user: [hidden]

? Please enter the database: my_database
```

**Outcome:**
- The project structure is generated in the specified directory.
- A `.env` file is created and populated with your database configuration.
- Template files are copied and customized using insertion directives.
- All necessary dependencies and devDependencies are installed automatically.

After the process completes, you’ll see a message like:

```bash
✅ Project successfully generated!

👉 To get started with your new project:

1. Navigate to your project directory:
   cd ./my-api-project

2. Start the development server:
   npm run dev
```

---

## Internal Architecture & Workflow 🛠️

The CLI is organized into modular components, ensuring a robust and flexible setup process:

- **File Copying & Customization:**  
  The `CopyFiles` function recursively copies directories and files from template sources to the target directory. It checks for file existence to avoid overwrites and handles special directives:
    - **@insert.json:** Inserts code snippets into specified locations within files using keywords and relative positioning.
    - **@dependencies.json:** Automatically configures additional dependencies.

- **Validation:**  
  Utilizes the [Joi](https://joi.dev/) library to validate the structure of custom directives before they’re applied, ensuring a smooth and error-free customization process.

- **Visual Feedback:**  
  The `CreateLoading` function uses spinners to provide real-time progress updates, enhancing the overall interactive experience.

This modular design ensures all the components of the CLI work together seamlessly, offering a fast, flexible, and secure project setup.

---

## Development & Contribution 🤝

### Development

If you're interested in working on the project, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/stexcore/create-stexcore-api.git
    cd create-stexcore-api
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Run tests:

    ```bash
    npm run test
    ```

### Contribution

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and ensure all tests pass.
4. Submit a pull request describing your improvements and changes.

---

## Limitations & Future Improvements 🧪

- Some features, such as advanced file insertion and dependency configuration directives, are experimental and may evolve in future releases.
- Currently supports major databases for Sequelize integration; future versions may expand support to additional systems and configurations.
- Continuous improvements will focus on enhanced error handling and further refining the interactive experience.

---

## License 📜

This project is distributed under the **MIT License**. For more details, refer to the [LICENSE](./LICENSE) file.

---

## Authors ❤️

- **Stexcore**: Passionate about building tools that empower developers and simplify backend setups.
- Thanks to the open-source community and contributors who help improve and expand this project.

---

We hope Create Stexcore API CLI accelerates and streamlines your API development process. For feedback, suggestions, or bug reports, please open an [issue](https://github.com/stexcore/create-stexcore-api/issues).

Happy coding! 🚀