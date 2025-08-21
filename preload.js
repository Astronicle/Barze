const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  changeBarMode: (msg) => ipcRenderer.send("changeBarMode", msg),
  onBarModeChanged: (callback) => ipcRenderer.on("barModeChanged", (event, msg) => callback(msg)),
  selectMdFile: () => ipcRenderer.invoke("select-md-file"),  //for file management
  appendToMdFile: (filePath, text) => ipcRenderer.invoke("append-to-md-file", filePath, text), // for appending the text to selected file
  getMdFilePath: () => ipcRenderer.invoke("get-md-file-path"), // to get the path of the selected Markdown file
});
