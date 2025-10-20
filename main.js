const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

app.name = "院内力学矫正系统";

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: path.join(__dirname, "assets", "icon.png"), // 👈 添加这一行
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false, // 推荐安全默认
      contextIsolation: true, // 保持隔离
      webviewTag: true, // ✅ 启用 webview
    },
  });

  win.loadFile("index.html");

  // ✅ 彻底移除菜单栏（包括 macOS 菜单内容）
  Menu.setApplicationMenu(null);
}

// function setAppMenu() {
//   // macOS 左上角菜单栏自定义
//   const template = [
//     {
//       label: "院内力学矫正系统", // 👈 左上角主菜单名
//       submenu: [
//         { role: "about", label: "关于 院内力学矫正系统" },
//         { type: "separator" },
//         { role: "quit", label: "退出" },
//       ],
//     },
//     {
//       label: "编辑",
//       submenu: [
//         { role: "undo", label: "撤销" },
//         { role: "redo", label: "重做" },
//         { type: "separator" },
//         { role: "cut", label: "剪切" },
//         { role: "copy", label: "复制" },
//         { role: "paste", label: "粘贴" },
//         { role: "selectAll", label: "全选" },
//       ],
//     },
//     {
//       label: "视图",
//       submenu: [
//         { role: "reload", label: "重新加载" },
//         { role: "togglefullscreen", label: "切换全屏" },
//         { role: "toggleDevTools", label: "开发者工具" },
//       ],
//     },
//     {
//       label: "窗口",
//       submenu: [{ role: "minimize", label: "最小化" }, { role: "close", label: "关闭窗口" }],
//     },
//     {
//       label: "帮助",
//       submenu: [
//         {
//           label: "官网",
//           click: async () => {
//             const { shell } = require("electron");
//             await shell.openExternal("https://your-website.example.com");
//           },
//         },
//       ],
//     },
//   ];

//   const menu = Menu.buildFromTemplate(template);
//   Menu.setApplicationMenu(menu);
// }

app.whenReady().then(() => {
  createWindow();
  // const menu = Menu.buildFromTemplate([
  //   {
  //     label: app.name, // ✅ 菜单栏显示的应用名
  //     submenu: [
  //       { label: `关于 ${app.name}`, role: "about" },
  //       { type: "separator" },
  //       { label: "退出", role: "quit" },
  //     ],
  //   },
  // ]);
  // Menu.setApplicationMenu(menu);

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
