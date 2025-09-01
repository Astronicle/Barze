# Barze

A multipurpose note-taking tool built with Electron, React, and Vite.

## Features

- **Markdown Support:** Create and manage your notes in Markdown format.
- **Bar Mode:** A minimalistic, always-on-top window for quick note-taking. Toggle between the main window and Bar Mode with `Ctrl+B`.
- **File Management:** Select and save the location of your notes file.
- **Simple User Interface:** An intuitive and easy-to-use interface.

## Technologies Used

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/barze.git
    cd barze
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Usage

### Development Mode

To run the application in development mode with hot-reloading, use the following command:

```bash
npm run dev
```

This will start the Vite development server and launch the Electron application.

### Production Mode

To build the application for production, use the following command:

```bash
npm run build
```

This will create a `dist` folder with the optimized and minified assets.

To package the application for distribution, use the following command:

```bash
npm run dist
```

This will create a distributable installer for your operating system in the `dist` folder.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
