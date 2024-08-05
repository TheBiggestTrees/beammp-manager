import { useEffect, useState } from 'react';
import LinkButton from './LinkButton';

function Maps() {
  const [maps, setMaps] = useState([]);

  useEffect(() => {
    window.electron.ipcRenderer
      .getMaps()
      .then((res) => setMaps(res))
      .catch((err) => console.error(err));
  }, []);

  const SelectMap = (map) => {
    window.electron.ipcRenderer
      .selectMap(map)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex flex-col h-[100vh] bg-gray-500 px-4 py-4">
      <div className="flex flex-row gap-2">
        <LinkButton to="" text="Home" />
        <LinkButton to="settings" text="Settings" />
      </div>

      <h1 className="text-3xl text-white font-bold mb-2">Maps</h1>
      <div className="flex flex-col gap-2">
        {maps.map((map) => (
          <div
            className="flex items-center justify-center bg-white border-2 border-black rounded-lg"
            onClick={() => SelectMap(map)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                SelectMap(map);
              }
            }}
            role="button"
            tabIndex={0}
            key={map}
          >
            {map}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Maps;
