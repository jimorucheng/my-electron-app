const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");

// 将 HTTP 地址视为安全源，允许使用 getUserMedia
app.commandLine.appendSwitch('unsafely-treat-insecure-origin-as-secure', 'http://111.206.118.14:30081');

app.name = "院内矫形系统";

// ✅ 防止重复打开多个实例
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // 如果已有实例在运行，则直接退出当前进程
  app.quit();
} else {
  let mainWindow;

  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      frame: false,
      fullscreen: true,
      webPreferences: {
        // 注意：无需开启nodeIntegration和contextIsolation（更安全）
        preload: path.join(__dirname, "preload.js"), // 新增preload脚本
        nodeIntegration: false,
        contextIsolation: true,
        webviewTag: true,
      },
    });

    mainWindow.loadFile("index.html");

    // 处理主窗口的媒体设备权限请求
    mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
      const allowedPermissions = ['media', 'camera', 'microphone'];
      if (allowedPermissions.includes(permission)) {
        callback(true);
      } else {
        callback(false);
      }
    });

    // 处理 webview（partition="nopersist"）的媒体设备权限请求
    const webviewSession = session.fromPartition('nopersist');
    webviewSession.setPermissionRequestHandler((webContents, permission, callback) => {
      const allowedPermissions = ['media', 'camera', 'microphone'];
      if (allowedPermissions.includes(permission)) {
        callback(true); // 允许摄像头和麦克风权限
      } else {
        callback(false);
      }
    });

    // mainWindow.webContents.openDevTools(); // 打开主页面调试工具

    // 监听关闭窗口的指令
    ipcMain.on("close-window", () => {
      mainWindow.close();
    });

    mainWindow.on("closed", () => {
      mainWindow = null;
    });
  }
  app.whenReady().then(createWindow);
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}
