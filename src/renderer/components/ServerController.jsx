/* eslint no-console: "off" */
import { useEffect, useState } from 'react';

// move controller
const ServerController = () => {
  const [status, setStatus] = useState('Offline');

  const GameCheck = async () => {
    const res = await window.electron.ipcRenderer.invoke('checkServer');
    setStatus(res.toString() === 'Online' ? 'Online' : 'Offline');
    return res;
  };
  const Controller = (arg) => {
    window.electron.ipcRenderer.sendMessage('executeServer', arg);

    setTimeout(async () => {
      try {
        const res = await GameCheck();
        const statusString = res.toString();
        setStatus(statusString === 'Online' ? 'Online' : 'Offline');
      } catch (err) {
        console.error(err);
      }
    }, 1000);
  };

  useEffect(() => {
    GameCheck();

    const timer = setInterval(async () => {
      const res = await GameCheck();
      const statusString = res.toString();
      setStatus(statusString === 'Online' ? 'Online' : 'Offline');
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-row items-center justify-between ">
      <h1 className="text-3xl text-white font-bold">BeamMP Manager</h1>
      <div className="flex flex-col gap-2 border-2 border-black rounded-lg p-2 bg-gray-400">
        <span
          className={
            status === 'Online'
              ? 'text-green-500 self-center'
              : 'text-red-500 self-center'
          }
        >
          {status}
        </span>
        <div className="flex gap-2 ">
          <button
            type="button"
            className="bg-white w-24 h-8 border-2 border-black rounded-lg"
            onClick={() => Controller('start')}
          >
            Start
          </button>
          <button
            type="button"
            className="bg-white w-24 h-8 border-2 border-black rounded-lg"
            onClick={() => Controller('stop')}
          >
            Stop
          </button>
          <button
            type="button"
            className="bg-white w-24 h-8 border-2 border-black rounded-lg"
            onClick={() => Controller('restart')}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerController;
