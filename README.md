# Create Stexcore API CLI 🚀

![NPM Version](https://img.shields.io/npm/v/create-stexcore-api?style=flat-square) ![License](https://img.shields.io/github/license/stexcore/create-stexcore-api.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-%5E5.8.2-blue?style=flat-square)

A powerful CLI tool designed to streamline the initialization of API projects in Node.js. It leverages Express and follows a common, scalable project structure, enabling developers to kick-start their backend setups efficiently.

---

## Features 🌟
- Initialize API projects using **Express**.
- Choose your preferred development technology (**TypeScript** or **JavaScript**).
- Optional integration with **Sequelize** for database management.
- Interactive configuration for database credentials:
  - Supports SQLite, MySQL, MariaDB, PostgreSQL, MSSQL, and more.
  - Generates `.env` files dynamically based on user input.
- Automatically generates project files and structures for a seamless development experience.

---

## Installation ⚙️
To use the CLI, first install it globally:
```bash
npm install -g create-stexcore-api
```

---

## Usage 💻

Run the CLI with the following command:
```bash
create-stexcore-api
```

Follow the interactive prompts to configure your project:
- **Project name**: Enter the name of your API project.
- **Technology**: Select **JavaScript** or **TypeScript** for your setup.
- **Database management**: Enable Sequelize and configure database credentials.

Once complete, the CLI will:
1. Generate the project structure.
2. Create and populate your `.env` file (if using Sequelize).
3. Initialize the required dependencies (optional).

---

## Example 🌱

```bash
create-stexcore-api
```

- **Prompt:** Enter the project name:
  - Input: `my-api-project`
- **Prompt:** What technology do you prefer to use for development?
  - Input: `TypeScript`
- **Prompt:** Would you like to include 'Sequelize' to manage a database?
  - Input: `Yes`
- **Prompt:** Select the database type:
  - Input: `Postgres`
- **Prompt:** Please enter the hostname for the database:
  - Input: `localhost`
- **Prompt:** Enter the port number for the database:
  - Input: `5432`
- **Prompt:** Enter the username and password for the database:
  - Input: `root` / `password`

Result:
- Project files generated in the current directory.
- `.env` file populated with the database configuration.

---

## Development 🛠️

To build the project, use:
```bash
npm run build
```

For testing purposes:
```bash
npm run test
```

---

## Limitations 🧪
- Certain features are experimental and may change in future releases.
- Currently, only SQLite and major database types are supported for Sequelize integration.

---

## Contributions 🤝
We welcome feedback and contributions from the developer community! To contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Submit a pull request.

---

## License 📜
This project is licensed under the **MIT License**.

---

## Authors ❤️
- **Stexcore**: Passionate about creating tools for developers and simplifying backend setups.