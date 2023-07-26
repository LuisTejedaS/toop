const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
  execScript: (script, content) => ipcRenderer.invoke('dialog:execScript', script, content),
  getScriptOptions: () => ipcRenderer.invoke('dialog:getScriptOptions')
})