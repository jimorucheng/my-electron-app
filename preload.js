const { contextBridge, ipcRenderer } = require('electron')

// 配置变量
const config = {
    VITE_X_RAY_UPLOAD_URL: 'https://test.cwdata.com/e-xray-upload/home'
}

// 向渲染进程暴露安全的API
contextBridge.exposeInMainWorld('electronAPI', {
    send: (channel, data) => {
        // 限制允许的频道，提高安全性
        if (channel === 'close-app') {
            ipcRenderer.sendToHost(channel, data) // 发送到webview容器
        }
    },
    closeWindow: () => ipcRenderer.send('close-window'),
    // 获取配置变量
    getConfig: (key) => config[key],
    // 获取所有配置
    getAllConfig: () => ({ ...config })
})
