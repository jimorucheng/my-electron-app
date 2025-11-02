const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  ping: () => console.log("Electron preload ready"),
  webviewReady: () => ipcRenderer.send("webview-ready"),
  send:(channel,data) => {
    // 限制允许的频道，提高安全性
    if(channel === 'close-app') {
      ipcRenderer.sendToHost(channel,data) // 发送到webview容器
    }
  },
  closeWindow: () => ipcRenderer.send("close-window"), // ✅ 给主页面暴露退出函数
});
