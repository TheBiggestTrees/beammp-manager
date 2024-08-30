/* eslint no-console: "off" */
import { PlayArrow, Refresh, Stop } from '@mui/icons-material';
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

  const StartStopFunction = () => {
    if (status === 'Online') {
      console.log(status, 'Server Stopping...');
      Controller('stop');
    } else {
      console.log(status, 'Server Starting...');
      Controller('start');
    }
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
    <div className="flex flex-row items-center gap-2 p-2 bg-gray-400 rounded-lg border-2 border-black">
      <span
        className={
          status === 'Online'
            ? 'text-green-700 font-bold self-center'
            : 'text-red-600 font-bold self-center'
        }
      >
        {status}
      </span>
      <button
        type="button"
        className={
          status === 'Online'
            ? 'bg-white text-red-500 w-8 h-8 border-2 border-black rounded-lg hover:bg-opacity-50 transition-all duration-150 ease-in-out'
            : 'bg-white text-green-600 w-8 h-8 border-2 border-black rounded-lg hover:bg-opacity-50 transition-all duration-150 ease-in-out'
        }
        onClick={() => StartStopFunction()}
      >
        {status === 'Online' ? <Stop /> : <PlayArrow />}
      </button>
      {status === 'Online' && (
        <button
          type="button"
          className="bg-white text-blue-600 w-8 h-8 border-2 border-black rounded-lg hover:bg-opacity-50 transition-all duration-150 ease-in-out"
          onClick={() => Controller('restart')}
          disabled={status !== 'Online'}
        >
          <Refresh />
        </button>
      )}
    </div>
  );
};

export default ServerController;
