const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

app.name = "院内矫形系统";

function createWindow() {
  const win = new BrowserWindow({
    width: 1920, // 可以先设置个默认宽高
    height: 1080,
    show: false, // 👈 初始隐藏窗口，等内容加载完再显示
    icon: path.join(__dirname, "assets", "icon.png"), // 👈 添加这一行
    autoHideMenuBar: true, // Windows/Linux 自动隐藏菜单栏
    fullscreen: true, // ✅ 启动即全屏显示
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false, // 推荐安全默认
      contextIsolation: true, // 保持隔离
      webviewTag: true, // ✅ 启用 webview
    },
  });

  win.loadFile("index.html");

  // ✅ 等待 WebView 加载完再显示窗口
  win.once("ready-to-show", () => {
    win.show();
  });
}

app.whenReady().then(() => {
  createWindow();
  console.log(`应用名称: ${app.name}`); // ✅ 输出应用名称
  const menu = Menu.buildFromTemplate([
    {
      label: app.name, // ✅ 菜单栏显示的应用名
      submenu: [
        { label: `关于 ${app.name}`, role: "about" },
        { type: "separator" },
        { label: "退出", role: "quit" },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
