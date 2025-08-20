const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow = null;
let barWindow = null;

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
    width: 1000,
    height: 60,
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

app.whenReady().then(() => {
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
        barWindow.webContents.send("barModeChanged", true); // ✅ notify bar
      });
    }
  }
});