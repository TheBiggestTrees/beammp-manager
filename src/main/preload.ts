import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'executeServer';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: Channels, func: (...args: unknown[]) => void) {
      return ipcRenderer.invoke(channel, func);
    },
    selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),
    Directory: () => ipcRenderer.invoke('Directory'),
    SetFolder: (res) => ipcRenderer.send('SetFolder', res),
    getBackground: () => ipcRenderer.invoke('getBackground'),
    setBackground: (arg) => ipcRenderer.send('setBackground', arg),
    getMaps: () => ipcRenderer.invoke('getMaps'),
    selectMap: (arg) => ipcRenderer.send('selectMap', arg),
    getSelectedMap: () => ipcRenderer.invoke('getSelectedMap'),
    getServerSettings: () => ipcRenderer.invoke('getServerSettings'),
    setServerSettings: (arg) => ipcRenderer.send('setServerSettings', arg),
    getModList: () => ipcRenderer.invoke('getModList'),
    activateMod: (arg) => ipcRenderer.send('activateMod', arg),
    deactivateMod: (arg) => ipcRenderer.send('deactivateMod', arg),
    GetModPictures: () => ipcRenderer.invoke('getModPictures'),
    setLayout: (arg) => ipcRenderer.send('setLayout', arg),
    getLayout: () => ipcRenderer.invoke('getLayout'),
  },
});
