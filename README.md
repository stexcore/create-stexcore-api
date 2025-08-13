# Create Stexcore API CLI 🚀

[![NPM Version](https://img.shields.io/npm/v/create-stexcore-api?style=flat-square)](https://www.npmjs.com/package/create-stexcore-api)  
[![License](https://img.shields.io/github/license/stexcore/create-stexcore-api.svg)](./LICENSE)  
[![TypeScript](https://img.shields.io/badge/TypeScript-%5E5.8.2-blue?style=flat-square)](https://www.typescriptlang.org/)

**Create Stexcore API CLI** is a command-line tool that helps you quickly scaffold API projects in Node.js. It supports both TypeScript and JavaScript, and optionally integrates Sequelize for database setup. The CLI guides you through an interactive setup and generates a clean, scalable project structure.

---

## 🌟 Features

- **Interactive API Project Initialization**
- **Support for TypeScript and JavaScript**
- **Optional Sequelize Integration**
- **Automatic `.env` generation**
- **Dependency installation and project setup**

---

## ⚙️ Installation

Install globally via npm:

```bash
npm install -g create-stexcore-api
```

Or use the npm initializer:

```bash
npm init stexcore-api
```

**Requirements:**
- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (bundled with Node.js)

---

## 💻 Usage

Run the CLI with either command:

```bash
create-stexcore-api
```

or

```bash
npm init stexcore-api
```

You’ll be prompted to configure your project:

1. **Template Selection**  
   Choose between:
   - Express Vanilla  
   - Api-Engine Stexcore

2. **Project Directory**  
   Specify where the project should be created.

3. **Language Preference**  
   Select either JavaScript or TypeScript.

4. **Database Setup (Optional)**  
   Enable Sequelize and choose your database type:
   - SQLite, MySQL, MariaDB, PostgreSQL, MSSQL, etc.
   - Provide connection details (host, port, user, password, database name)

---

## 🌱 Example Walkthrough

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

**Result:**
- Project structure created in `./my-api-project`
- `.env` file with database configuration
- Template files copied and customized
- Dependencies installed automatically

Final message:

```bash
✅ Project successfully generated!

👉 To get started:

1. cd ./my-api-project
2. npm run dev
```

---

## 🤝 Contributing

1. Fork the repository  
2. Create a branch: `git checkout -b feature/my-feature`  
3. Make your changes and test  
4. Submit a pull request

---

## 📜 License

Distributed under the **MIT License**. See [LICENSE](./LICENSE).

---

## ❤️ Author

- **StexCore** — Building tools that simplify backend development and empower developers.

For feedback or issues, open an [issue](https://github.com/stexcore/create-stexcore-api/issues).

Happy coding! 🚀