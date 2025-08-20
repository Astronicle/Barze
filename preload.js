const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  changeBarMode: (msg) => ipcRenderer.send("changeBarMode", msg),
  onBarModeChanged: (callback) => ipcRenderer.on("barModeChanged", (event, msg) => callback(msg))
});
