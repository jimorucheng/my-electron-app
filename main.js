const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");
const fs = require("fs");

// 读取外部配置文件
function loadConfig() {
  let configPaths = [];

  // 判断是开发环境还是生产环境
  if (app.isPackaged) {
    // 生产环境：按优先级查找配置文件
    // 1. 应用可执行文件同级目录（最高优先级，方便部署时修改）
    configPaths.push(path.join(path.dirname(app.getPath("exe")), "config.json"));
    // 2. resources 目录（打包时自动复制）
    configPaths.push(path.join(process.resourcesPath, "config.json"));
  } else {
    // 开发环境：配置文件在项目根目录
    configPaths.push(path.join(__dirname, "config.json"));
  }

  for (const configPath of configPaths) {
    try {
      if (fs.existsSync(configPath)) {
        const configData = fs.readFileSync(configPath, "utf-8");
        console.log("加载配置文件:", configPath);
        return JSON.parse(configData);
      }
    } catch (error) {
      console.error("读取配置文件失败:", configPath, error.message);
    }
  }

  // 没有找到配置文件，使用默认配置
  console.error("未找到配置文件，使用默认配置");
  return {
    baseUrl: "http://192.168.31.80",
    webViewUrlPath: "/orthopedic/home",
    xRayUploadUrlPath: "/e-xray-upload/home",
  };
}

// 加载配置
const appConfig = loadConfig();

// 将 HTTP 地址视为安全源，允许使用 getUserMedia
app.commandLine.appendSwitch(
  "unsafely-treat-insecure-origin-as-secure",
  appConfig.baseUrl,
);

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
        preload: path.join(__dirname, "main-preload.js"), // 主窗口 preload
        nodeIntegration: false,
        contextIsolation: true,
        webviewTag: true,
      },
    });

    mainWindow.loadFile("index.html");

    // 加载完成后注入配置
    mainWindow.webContents.on("did-finish-load", () => {
      const webviewUrl = appConfig.baseUrl + appConfig.webViewUrlPath;
      mainWindow.webContents.executeJavaScript(`
        const webview = document.querySelector("webview");
        if (webview && "${webviewUrl}") {
          webview.src = "${webviewUrl}";
          console.log("webview src 已设置为:", "${webviewUrl}");
        }
      `);
    });

    // 处理主窗口的媒体设备权限请求
    mainWindow.webContents.session.setPermissionRequestHandler(
      (webContents, permission, callback) => {
        const allowedPermissions = ["media", "camera", "microphone"];
        if (allowedPermissions.includes(permission)) {
          callback(true);
        } else {
          callback(false);
        }
      },
    );

    // 处理 webview（partition="nopersist"）的媒体设备权限请求
    const webviewSession = session.fromPartition("nopersist");
    webviewSession.setPermissionRequestHandler(
      (webContents, permission, callback) => {
        const allowedPermissions = ["media", "camera", "microphone"];
        if (allowedPermissions.includes(permission)) {
          callback(true); // 允许摄像头和麦克风权限
        } else {
          callback(false);
        }
      },
    );

    // 监听关闭窗口的指令
    ipcMain.on("close-window", () => {
      mainWindow.close();
    });

    // 返回配置给渲染进程
    ipcMain.handle("get-config", () => {
      return {
        ...appConfig,
        webviewUrl: appConfig.baseUrl + appConfig.webViewUrlPath,
        xRayUploadUrl: appConfig.baseUrl + appConfig.xRayUploadUrlPath,
      };
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
