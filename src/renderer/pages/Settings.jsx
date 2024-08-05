/* eslint no-console: "off" */
import { useEffect, useState } from 'react';

function Settings() {
  const [background, setBackground] = useState(false);
  const [folder, setFolder] = useState('');

  useEffect(() => {
    window.electron.ipcRenderer
      .getBackground()
      .then((res) => setBackground(res))
      .catch((err) => console.error(err));

    window.electron.ipcRenderer
      .Directory()
      .then((res) => setFolder(res))
      .catch((err) => console.error(err));
  }, []);

  const toggleBackground = () => {
    window.electron.ipcRenderer.setBackground(!background);
    setBackground(!background);
  };

  const SelectFolder = async () => {
    window.electron.ipcRenderer
      .selectFolder()
      .then((res) => {
        window.electron.ipcRenderer.SetFolder(res);
        setFolder(res);
        return res;
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex flex-col px-4 py-4">
      <span className="text-white text-3xl font-bold">Settings</span>
      <div className="flex gap-2 items-center">
        <span>Run in background: </span>
        <button
          className="bg-white w-24 h-8 border-2 border-black rounded-lg"
          onClick={(e) => {
            e.preventDefault();
            toggleBackground();
          }}
          type="button"
        >
          {background ? 'Yes' : 'No'}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span>Server Location: </span>
        <button
          type="button"
          className="bg-white w-auto px-2 h-8 border-2 border-black rounded-lg"
          onClick={(e) => {
            e.preventDefault();
            SelectFolder();
          }}
        >
          {folder || 'No Folder Selected'}
        </button>
      </div>
    </div>
  );
}

export default Settings;
