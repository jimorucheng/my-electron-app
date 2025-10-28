const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  ping: () => console.log("Electron preload ready"),
  webviewReady: () => ipcRenderer.send("webview-ready"),
  exitApp: () => ipcRenderer.send("exit-app"), // ✅ 给主页面暴露退出函数
});
