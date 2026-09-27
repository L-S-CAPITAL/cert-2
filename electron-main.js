const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const { createUrlGuard } = require('./electron-navigation');

/** @type {import('electron').BrowserWindow | null} */
let mainWindow = null;

const DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

const IS_DEV = Boolean(DEV_SERVER_URL) && !app.isPackaged;

/**
 * CSP for the Vite dev server only. Vite dev needs inline scripts, eval and
 * the ws://localhost:5173 HMR socket, and it is served over http, so the
 * policy is set as a response header.
 *
 * The packaged app loads dist/index.html over file:// with loadFile, where
 * webRequest.onHeadersReceived does not run. Its (strict) policy ships as a
 * <meta http-equiv="Content-Security-Policy"> tag that vite.config.mts injects
 * into production builds only.
 */
function devContentSecurityPolicy() {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "connect-src 'self' ws://localhost:5173 http://localhost:5173 ws://127.0.0.1:5173 http://127.0.0.1:5173",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

function distIndexPath() {
  return path.join(__dirname, 'dist', 'index.html');
}

const isAllowedUrl = createUrlGuard({
  devServerUrl: DEV_SERVER_URL,
  isPackaged: app.isPackaged,
  appDir: __dirname,
});

/** Block any navigation or redirect that leaves the allow-list. */
function guardNavigation(event) {
  if (!isAllowedUrl(event.url)) {
    event.preventDefault();
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    title: 'ElectroTech Terminal',
    frame: true,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'icon.png'),
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  mainWindow.webContents.on('will-navigate', guardNavigation);
  mainWindow.webContents.on('will-redirect', guardNavigation);

  if (IS_DEV) {
    mainWindow.loadURL(DEV_SERVER_URL);
    if (process.env.ELECTRON_OPEN_DEVTOOLS === '1') {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  } else {
    mainWindow.loadFile(distIndexPath());
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  app.whenReady().then(() => {
    // The app needs no browser permissions (camera, notifications,
    // clipboard, geolocation, ...): deny every request and check.
    session.defaultSession.setPermissionRequestHandler(
      (_webContents, _permission, callback) => callback(false),
    );
    session.defaultSession.setPermissionCheckHandler(() => false);

    if (IS_DEV) {
      session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            'Content-Security-Policy': [devContentSecurityPolicy()],
          },
        });
      });
    }

    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
