const { contextBridge, ipcRenderer } = require('electron')

// 向渲染进程暴露安全的API
contextBridge.exposeInMainWorld('electronAPI', {
    send: (channel, data) => {
        // 限制允许的频道，提高安全性
        if (channel === 'close-app') {
            ipcRenderer.sendToHost(channel, data) // 发送到webview容器
        }
    },
    closeWindow: () => ipcRenderer.send('close-window')
})
