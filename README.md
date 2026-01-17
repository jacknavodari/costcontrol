# Cost Control Agent (Ollama)

![App Logo](assets/icon.png)

**A specialized AI assistant for construction cost management, tailored for the Romanian market.**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Version: 1.0.0](https://img.shields.io/badge/Version-1.0.0-blue.svg)]()

This desktop application provides a private and secure way to analyze construction-related financial documents, leveraging the power of local AI models through Ollama.

## Features
- **Specialized AI Prompts**: Pre-configured to analyze estimates, budgets, risks, and performance indexes (CPI/SPI) in the context of Romanian construction standards.
- **Ollama Integration**: Utilizes local large language models, ensuring your data remains completely private.
- **Premium Design**: A modern, intuitive interface with a dark mode for comfortable use.
- **Portable & Installable**: Choose between a standard installer or a portable version that runs from any location.

## Installation and Usage
1.  **Install Ollama**: Download and install [Ollama](https://ollama.com/) on your computer.
2.  **Download AI Models**: Open your terminal or command prompt and run a command like `ollama run llama3` to download a model. We recommend `llama3`, `mistral`, or `qwen2`.
3.  **Install the Application**:
    *   Run `dist/Cost Control Agent Setup 1.0.0.exe` to install the application on your system.
    *   Alternatively, use the portable version from the `dist/win-unpacked` folder if you don't want to install it.

## For Developers
This project is built with [Electron](https://www.electronjs.org/).

### Getting Started
1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the application in development mode:**
    ```bash
    npm start
    ```
4.  **Build the application for Windows:**
    This will generate installers (NSIS, MSI) and a portable version in the `dist/` directory.
    ```bash
    npm run build
    ```

## Technologies Used
- [Electron](https://www.electronjs.org/)
- [Ollama](https://ollama.com/)
- [Electron Builder](https://www.electron.build/)

## License
This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

---
Created especially for **Ionel Jupanu**.