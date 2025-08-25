const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs"); // for file management
const path = require("path");

let mainWindow = null;
let barWindow = null;
let selectedMdFilePath = null; // Global variable to hold the selected Markdown file path
const SETTINGS_PATH = path.join(app.getPath("userData"), "settings.json"); //app.getPath("userData") gives a suitable directory for storing app data and we append settings.json to it.

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // In dev mode, load from Vite's server
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    // In production, load the built React files
    mainWindow.loadFile(path.join(__dirname, "dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (barWindow) {
      barWindow.close();
      barWindow = null;
    }
  });
}

function createBarWindow() {
  barWindow = new BrowserWindow({
    width: 675,      // Match max-w-2xl (Tailwind: 2xl = 672px)
    height: 100,      // Match h-24 (Tailwind: 24 = 6rem = 96px)
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
    frame: false,
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    x: 0,
    y: 0,
  });

  if (process.env.NODE_ENV === "development") {
    barWindow.loadURL("http://localhost:5173/bar");
  } else {
    barWindow.loadFile(path.join(__dirname, "dist/bar.html"), {
      hash: "bar",
    });
  }

  barWindow.on("closed", () => {
    barWindow = null;
  });
}

function saveSettings() {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify({ mdFilePath: selectedMdFilePath || "" }, null, 2)); //creates or overwrites the settings file with the current mdFilePath 
}

function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const data = fs.readFileSync(SETTINGS_PATH, "utf-8");
      const settings = JSON.parse(data);
      selectedMdFilePath = settings.mdFilePath || null;
    }
  } catch (err) {
    selectedMdFilePath = null;
  }
}

// Load settings on startup
app.whenReady().then(() => {
  loadSettings();
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
  }
  createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("changeBarMode", (event, msg) => {
  if (barWindow) {
    barWindow.close();
    barWindow = null;

    if (mainWindow) {
      mainWindow.show();
      mainWindow.webContents.send("barModeChanged", false); // notify main
    } else {
      createMainWindow();
    }
  } else if (mainWindow) {
    mainWindow.hide();
    if (!barWindow) {
      createBarWindow();
    }
    if (barWindow) {
      barWindow.once("ready-to-show", () => {
        barWindow.webContents.send("barModeChanged", true); // notify bar
      });
    }
  }
});

ipcMain.handle("select-md-file", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Markdown Files", extensions: ["md"] }],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  selectedMdFilePath = result.filePaths[0]; // storing the selected file path
  saveSettings(); // persist to disk
  return selectedMdFilePath;
});

ipcMain.handle("get-md-file-path", async () => {
  return selectedMdFilePath; // return the stored file path to the renderer
});

ipcMain.handle("append-to-md-file", async (event, filePath, text) => {
  try {
    fs.appendFileSync(filePath, text + "\n");
    return true;
  } catch (err) {
    return false;
  }
});