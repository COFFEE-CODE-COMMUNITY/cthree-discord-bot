## 🚀 Cthree Discord Bot

Brief description of my project.

---

### 📋 Table of Contents

- [Prerequisites]()
- [🚀 Getting Started (Setup App)]()
    - [Installation]()
    - [Configuration]()
    - [Running the Application]()
- [🛠️ Project Standardization]()
    - [Branching Strategy]()
    - [Commit Conventions]()
    - [ESLint Rules]()
- [🏗️ Application Architecture Overview]()
    - [Overview]()
    - [Project Structure]()
    - [Key Components]()
- [📜 License]()

---

### Prerequisites

List any software, tools, or accounts needed before a developer can start working on the project.

- Node.js (v22.x or higher)
- npm / yarn / pnpm
- Docker

---

### 🚀 Getting Started (Setup App)

<strong>Installation</strong>
Provide step-by-step instructions on how to get the development environment running.

```bash
# Clone the repository
git clone https://github.com/ToufiqSenpai/ourtransfer.git

# Navigate to the project use-cases
cd ourtransfer

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

<strong>Configuration</strong>
The application uses .env files for secrets and environment-specific variables, and app-config.json for non-secret configurations.

To set up your local environment, copy the .env.example file in the project root then replace the placeholder value to your secret value.


**Application Configuration**

General application configuration is managed in app-config.json. You can override these settings for specific environments by creating a corresponding file, such as `app-config.production.json`.

For example, the logger configuration is defined in app-config.json:

```json
{
  "logger": {
    "level": "debug",
    "file": {
      "enabled": false,
      "outputPath": "logs/app.log"
    }
  }
}
```

Then in production mode you can create `app-config.production.json` with the config like this:

```json
{
  "logger": {
    "level": "info",
    "file": {
      "enabled": true
    }
  }
}
```

<strong>Running The Application</strong>

You can run the application in either development or production mode.

**Development Mode**

To run the application in development mode with hot-reloading, use the following command. This will watch for file changes and automatically restart the server.

```bash
# Using npm
npm run dev
```

**Production Mode**

For production, you should first build the application and then run the compiled JavaScript.

```bash
# 1. Build the application
npm run build

# 2. Start the application
npm start
```

**Using Docker**

You can also run the application using Docker.

```bash
# 1. Build the Docker image
docker build -t cthree-discord-bot .

# 2. Run the container using your .env file
docker run --env-file .env -d --name cthree-bot cthree-discord-bot
```

### 🛠️ Project Standardization
<strong>Branching Strategy</strong>

This project follows a Gitflow-inspired branching strategy:

-   **`main`**: This branch represents the production-ready code. All development code is merged into `main` after thorough testing and review in PR.
-   **`develop`**: This is the primary development branch where all feature branches are merged. It represents the latest delivered development changes for the next release.

Branch Naming Conventions:
*   **`feature/*`**: For new features (e.g., `feature/user-authentication`).
*   **`bugfix/*`**: For fixing bugs in released versions (e.g., `bugfix/login-issue`). These are typically branched from `main` and merged back into both `main` and `develop`.
*   **`hotfix/*`**: For critical production bugs that need immediate fixing (e.g., `hotfix/critical-payment-bug`). These are branched from `main` and merged back into both `main` and `develop`.
*   **`docs/*`**: For changes related to documentation (e.g., `docs/update-readme`).
*   **`chore/*`**: For routine tasks, maintenance, or updates to the build process, tooling, etc., that don't directly affect the application's functionality (e.g., `chore/update-dependencies`).
*   **`refactor/*`**: For code refactoring that doesn't change external behavior (e.g., `refactor/optimize-database-queries`).

<strong>Commit Conventions</strong>

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This leads to more readable messages that are easy to follow when looking through the project history.

Each commit message consists of a **header**, a **body**, and a **footer**.

```text
<type>[optional scope]: <description></description></type>

[optional body]

[optional footer(s)]
```

**Type**:
Must be one of the following:
*   **`feat`**: A new feature
*   **`fix`**: A bug fix
*   **`docs`**: Documentation only changes
*   **`style`**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
*   **`refactor`**: A code change that neither fixes a bug nor adds a feature
*   **`perf`**: A code change that improves performance
*   **`test`**: Adding missing tests or correcting existing tests
*   **`build`**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
*   **`ci`**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
*   **`chore`**: Other changes that don't modify `src` or `test` files
*   **`revert`**: Reverts a previous commit

**Scope** (optional):
The scope could be anything specifying the place of the commit change. For example `feat(parser): add ability to parse arrays`.

**Description**:
Contains a succinct description of the change:
*   use the imperative, present tense: "change" not "changed" nor "changes"
*   don't capitalize the first letter
*   no dot (.) at the end

**Body** (optional):
Just as in the **description**, use the imperative, present tense. The body should include the motivation for the change and contrast this with previous behavior.

**Footer** (optional):
The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

**Breaking Change**:
A commit that has a footer beginning with `BREAKING CHANGE:` introduces a breaking API change. A BREAKING CHANGE can be part of commits of any type.

Example:
feat: allow provided config object to extend other configs

BREAKING CHANGE: extends key in config file is now used for extending other config files

<strong>ESLint Rules</strong>
