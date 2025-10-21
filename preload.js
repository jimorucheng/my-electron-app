const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  ping: () => console.log("Electron preload ready"),
  webviewReady: () => ipcRenderer.send("webview-ready"),
});