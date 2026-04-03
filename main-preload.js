const { contextBridge, ipcRenderer } = require('electron')

// 主窗口 preload - 暴露 API 给 index.html
contextBridge.exposeInMainWorld('electronAPI', {
    closeWindow: () => ipcRenderer.send('close-window')
})