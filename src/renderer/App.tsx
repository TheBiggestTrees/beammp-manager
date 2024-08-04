import { useEffect, useState } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AppProvider from './providers/app';

const GameCheck = async () => {
  const res = await window.electron.ipcRenderer.invoke('checkServer');
  return res;
};

const ServerControl = () => {
  const [status, setStatus] = useState('Offline');
  const [folder, setFolder] = useState('');
  const [background, setBackground] = useState(false);

  const ServerController = (arg) => {
    window.electron.ipcRenderer.sendMessage('executeServer', arg);

    setTimeout(async () => {
      try {
        const res = await GameCheck();
        const statusString = res.toString();
        setStatus(statusString === 'Online' ? 'Online' : 'Offline');
      } catch (err) {
        console.log(err);
      }
    }, 1000);
  };

  const Check = async () => {
    const res = await GameCheck();
    const statusString = res.toString();
    setStatus(statusString === 'Online' ? 'Online' : 'Offline');
  };

  useEffect(() => {
    Check();

    window.electron.ipcRenderer
      .Directory()
      .then((res) => setFolder(res))
      .catch((err) => console.log(err));

    window.electron.ipcRenderer
      .getBackground()
      .then((res) => setBackground(res))
      .catch((err) => console.log(err));

    const timer = setInterval(async () => {
      const res = await GameCheck();
      const statusString = res.toString();
      setStatus(statusString === 'Online' ? 'Online' : 'Offline');
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const SelectFolder = async () => {
    window.electron.ipcRenderer
      .selectFolder()
      .then((res) => {
        window.electron.ipcRenderer.SetFolder(res);
        setFolder(res);
        return res;
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-col h-[100vh] bg-gray-500">
      <span className={status === 'Online' ? 'text-green-500' : 'text-red-500'}>
        {status}
      </span>
      <span>Folder: {folder}</span>
      <span>Run in background: {background ? 'Yes' : 'No'}</span>
      <button
        className="bg-white w-24 h-8 border-2 border-black rounded-lg"
        onClick={() => {
          window.electron.ipcRenderer.setBackground(!background);
          setBackground(!background);
        }}
        type="button"
      >
        Background
      </button>
      <button
        type="button"
        className="bg-white w-24 h-8 border-2 border-black rounded-lg"
        onClick={() => ServerController('start')}
      >
        Start
      </button>
      <button
        type="button"
        className="bg-white w-24 h-8 border-2 border-black rounded-lg"
        onClick={() => ServerController('stop')}
      >
        Stop
      </button>
      <button
        type="button"
        className="bg-white w-24 h-8 border-2 border-black rounded-lg"
        onClick={() => ServerController('restart')}
      >
        Restart
      </button>
      <button
        type="button"
        className="bg-white w-24 h-8 border-2 border-black rounded-lg"
        onClick={() => SelectFolder()}
      >
        Select Folder
      </button>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ServerControl />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
