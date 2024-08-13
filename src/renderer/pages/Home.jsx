import { useEffect, useState } from 'react';
import GeneralServerSettings from 'renderer/components/GeneralServerSettings';
import Mods from './Mods';

function Home(props) {
  const { mapCache, setMapCache, setMaps, setSelectedMap, maps, selectedMap } =
    props;
  const [serverSettings, setServerSettings] = useState(null);

  useEffect(() => {
    window.electron.ipcRenderer
      .getServerSettings()
      .then((res) => {
        return setServerSettings(res);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {serverSettings !== null ? (
        <>
          <div className="bg-black rounded-lg h-[2px] mr-4" />
          <div className="flex flex-row gap-2">
            <div className="flex ml-4 w-full">
              <GeneralServerSettings
                serverSettings={serverSettings}
                setServerSettings={setServerSettings}
                mapCache={mapCache}
                setMapCache={setMapCache}
                setMaps={setMaps}
                setSelectedMap={setSelectedMap}
                maps={maps}
                selectedMap={selectedMap}
              />
            </div>
            <Mods />
          </div>
        </>
      ) : (
        <div>
          <p className="text-white text-xl font-bold">
            Check your server location in{' '}
            <span className="text-yellow-200">Settings</span>
          </p>
        </div>
      )}
    </>
  );
}

export default Home;
