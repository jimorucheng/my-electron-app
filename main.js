const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");

app.name = "院内矫形系统";

// ✅ 防止重复打开多个实例
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // 如果已有实例在运行，则直接退出当前进程
  app.quit();
} else {
  let win;

  function createWindow() {
    win = new BrowserWindow({
      width: 1920,
      height: 1080,
      show: false,
      icon: path.join(__dirname, "assets", "icon.png"),
      autoHideMenuBar: true,
      backgroundColor: "#ffffff",
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        nodeIntegration: false,
        contextIsolation: true,
        webviewTag: true,
        devTools: false,
      },
    });

    win.loadFile("index.html");

    ipcMain.on("webview-ready", () => {
      if (win && !win.isVisible()) {
        win.show();
        win.setFullScreen(true);
      }
    });

    ipcMain.on("exit-app", () => {
      console.log("🔚 收到退出指令，准备退出应用...");
      if (process.platform === "darwin") {
        app.exit(0);
      } else {
        app.quit();
      }
    });
  }

  app.whenReady().then(() => {
    createWindow();
    console.log(`应用名称: ${app.name}`);

    Menu.setApplicationMenu(null);

    app.on("activate", function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  // ✅ 如果用户尝试再次打开程序，聚焦已有窗口
  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
  });
}
