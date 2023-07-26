const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const { executeScript, loadScripts, getScripts } = require("./utils/scriptManager.js");

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1224,
		height: 1000,
		webPreferences: {
			nodeIntegration: true,
			worldSafeExecuteJavaScript: true,
			// contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')

		}
	});
	mainWindow.loadURL(`file://${__dirname}/lib/index.html`);
	mainWindow.webContents.openDevTools();
	mainWindow.on('closed', function () {
		mainWindow = null;
	});
	loadScripts();
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
});


async function callScript(event, script, content) {
	return executeScript(script, content);
}

async function getScriptOptions(event, script, content) {
	return getScripts(script, content);
}


app.whenReady().then(() => {
  ipcMain.handle('dialog:execScript', callScript)
  ipcMain.handle('dialog:getScriptOptions', getScriptOptions)
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

