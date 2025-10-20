// main.js
const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

// 判断是否是开发环境
const isDev = process.env.NODE_ENV === "development" || process.defaultApp;

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: path.join(__dirname, "assets", "icon.png"),
    autoHideMenuBar: true, // Windows/Linux 自动隐藏菜单栏
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
    },
  });

  // 加载本地文件或开发服务器
  if (isDev) {
    win.loadURL("http://localhost:3000"); // 你的开发服务器地址
    win.webContents.openDevTools({ mode: "detach" }); // 开发模式打开 DevTools
  } else {
    win.loadFile("index.html");
  }

  // ✅ 彻底移除菜单栏（Windows/Linux/macOS）
  Menu.setApplicationMenu(null);
}

// macOS 上点击 Dock 图标重新创建窗口
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Electron ready 后创建窗口
app.whenReady().then(() => {
  // 开发模式下也彻底隐藏菜单
  Menu.setApplicationMenu(null);

  createWindow();

  // 避免 macOS 全局菜单残留
  app.on("browser-window-created", (event, window) => {
    Menu.setApplicationMenu(null);
  });
});

// 关闭窗口时退出（macOS 除外）
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});