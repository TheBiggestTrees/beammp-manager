import { useEffect, useState } from 'react';

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
          <div className="flex">
            <span className="text-white mr-2">Name: </span>
            <input
              className="bg-white border-2 border-black rounded-lg"
              value={serverSettings.General.Name}
              onChange={(e) => {
                return setServerSettings((prev) => ({
                  ...prev,
                  General: { ...prev.General, Name: e.target.value },
                }));
              }}
            />
          </div>
          <div className="flex">
            <span className="text-white mr-2">Description: </span>
            <textarea
              className="bg-white border-2 border-black rounded-lg w-60 h-16 "
              value={serverSettings.General.Description}
              onChange={(e) => {
                return setServerSettings((prev) => ({
                  ...prev,
                  General: { ...prev.General, Description: e.target.value },
                }));
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneralServerSettings;
