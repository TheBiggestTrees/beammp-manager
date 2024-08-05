import { useEffect, useState } from 'react';
import SettingTextBox from './SettingTextBox';

function GeneralServerSettings() {
  const [serverSettings, setServerSettings] = useState({
    General: {},
    Misc: {},
  });

  useEffect(() => {
    window.electron.ipcRenderer
      .getServerSettings()
      .then((res) => {
        return setServerSettings(res);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between my-2">
        <h2 className="text-2xl text-white font-bold mb-2">
          General Server Settings
        </h2>
        <button
          className="bg-white w-24 h-8 border-2 border-black rounded-lg"
          type="button"
          onClick={() => {
            window.electron.ipcRenderer.setServerSettings(serverSettings);
          }}
        >
          Save
        </button>
      </div>
      <div className="bg-black rounded-lg h-[2px]" />
      {serverSettings !== { General: {}, Misc: {} } && (
        <div className="flex flex-col gap-2 mt-2">
          <SettingTextBox
            setServerSettings={setServerSettings}
            text="Name"
            value={serverSettings.General.Name}
            generalValue="Name"
            type="text"
          />
          <SettingTextBox
            text="Description"
            setServerSettings={setServerSettings}
            value={serverSettings.General.Description}
            generalValue="Description"
            type="textarea"
          />

          <SettingTextBox
            setServerSettings={setServerSettings}
            text="Port"
            value={serverSettings.General.Port}
            generalValue="Port"
            type="text"
            width="w-16"
          />
          <SettingTextBox
            setServerSettings={setServerSettings}
            text="Max Players"
            value={serverSettings.General.MaxPlayers}
            generalValue="MaxPlayers"
            type="number"
            width="w-16"
          />
          <SettingTextBox
            setServerSettings={setServerSettings}
            text="Max Cars"
            value={serverSettings.General.MaxCars}
            generalValue="MaxCars"
            type="number"
            width="w-16"
          />
          <SettingTextBox
            setServerSettings={setServerSettings}
            text="Auth Key"
            value={serverSettings.General.AuthKey}
            generalValue="AuthKey"
            type="text"
            width="w-80"
          />
        </div>
      )}
    </div>
  );
}

export default GeneralServerSettings;
