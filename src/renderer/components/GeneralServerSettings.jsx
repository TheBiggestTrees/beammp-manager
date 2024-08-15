import { Folder } from '@mui/icons-material';
import { useState } from 'react';
import Maps from 'renderer/pages/Maps';
import SettingTextBox from './SettingTextBox';

function GeneralServerSettings(props) {
  const {
    serverSettings,
    setServerSettings,
    mapCache,
    setMapCache,
    setMaps,
    setSelectedMap,
    maps,
    layout,
    selectedMap,
  } = props;

  const [settingsChanged, setSettingsChanged] = useState(false);

  const handleClick = (action) => {
    switch (action) {
      case 'openModsFolder':
        window.electron.ipcRenderer.openModsFolder();
        break;
      case 'openMapsFolder':
        window.electron.ipcRenderer.openMapsFolder();
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col">
        <div className="flex flex-col gap-2 mt-4 ">
          <div className="flex justify-around items-center">
            <button
              type="button"
              className="bg-white font-bold text-lg border-2 border-black p-2 flex items-center justify-center rounded-lg"
              onClick={() => handleClick('openModsFolder')}
            >
              <Folder className="text-gray-600" /> Open Mods Folder
            </button>
            <button
              type="button"
              className="bg-white font-bold text-lg border-2 border-black p-2 flex items-center justify-center rounded-lg"
              onClick={() => handleClick('openMapsFolder')}
            >
              <Folder className="text-gray-600" /> Open Maps Folder
            </button>
            {settingsChanged && (
              <button
                className="bg-green-400 w-24 h-8 border-2 mr-8 border-black rounded-lg "
                type="button"
                onClick={() => {
                  window.electron.ipcRenderer.setServerSettings(serverSettings);
                  setSettingsChanged(false);
                }}
              >
                Save
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2">
              <SettingTextBox
                setServerSettings={setServerSettings}
                text="Name"
                value={serverSettings.General.Name}
                generalValue="Name"
                width="w-80"
                type="text"
                setSettingsChanged={setSettingsChanged}
              />
              <SettingTextBox
                setServerSettings={setServerSettings}
                text="Auth Key"
                value={serverSettings.General.AuthKey}
                generalValue="AuthKey"
                type="text"
                width="w-80"
                setSettingsChanged={setSettingsChanged}
              />
            </div>
            <div className="flex flex-col gap-2">
              <SettingTextBox
                setServerSettings={setServerSettings}
                text="Max Players"
                value={serverSettings.General.MaxPlayers}
                generalValue="MaxPlayers"
                type="number"
                width="w-16 "
                wrapper="number:items-center justify-center"
                setSettingsChanged={setSettingsChanged}
              />
              <SettingTextBox
                setServerSettings={setServerSettings}
                text="Max Cars"
                value={serverSettings.General.MaxCars}
                generalValue="MaxCars"
                type="number"
                width="w-16"
                wrapper="number:items-center justify-center"
                setSettingsChanged={setSettingsChanged}
              />
            </div>
            <div className="flex flex-col gap-2">
              <SettingTextBox
                setServerSettings={setServerSettings}
                text="Port"
                value={serverSettings.General.Port}
                generalValue="Port"
                type="number"
                width="w-16"
                wrapper="number:items-center justify-center"
                setSettingsChanged={setSettingsChanged}
              />
              <SettingTextBox
                setServerSettings={setServerSettings}
                text="Private"
                value={serverSettings.General.Private}
                generalValue="Private"
                type="button"
                width="w-16 h-7"
                wrapper="number:items-center justify-center text-center"
                setSettingsChanged={setSettingsChanged}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 ">
            <div className="flex flex-row gap-2">
              <div className="flex flex-col gap-2">
                <SettingTextBox
                  text="Description"
                  setServerSettings={setServerSettings}
                  value={serverSettings.General.Description}
                  generalValue="Description"
                  type="textarea"
                  setSettingsChanged={setSettingsChanged}
                />
                <SettingTextBox
                  setServerSettings={setServerSettings}
                  text="Tags"
                  value={serverSettings.General.Tags}
                  generalValue="Tags"
                  type="textarea"
                  setSettingsChanged={setSettingsChanged}
                />
              </div>
              <div className="flex flex-col gap-2">
                <SettingTextBox
                  setServerSettings={setServerSettings}
                  text="Log Chat"
                  value={serverSettings.General.LogChat}
                  generalValue="LogChat"
                  type="button"
                  width="w-16 h-7"
                  setSettingsChanged={setSettingsChanged}
                />

                <SettingTextBox
                  setServerSettings={setServerSettings}
                  text="Debug"
                  value={serverSettings.General.Debug}
                  generalValue="Debug"
                  type="button"
                  width="w-16 h-7"
                  setSettingsChanged={setSettingsChanged}
                />
                <SettingTextBox
                  setServerSettings={setServerSettings}
                  text="Send Errors"
                  value={serverSettings.Misc.SendErrors}
                  generalValue="SendErrors"
                  misc
                  type="button"
                  width="w-16 h-7"
                  setSettingsChanged={setSettingsChanged}
                />
              </div>
            </div>
            {/* <div className="flex flex-row gap-2">
              <SettingTextBox
                setServerSettings={setServerSettings}
                text={`I'm Scared Of Updates`}
                value={serverSettings.Misc.ImScaredOfUpdates}
                generalValue="ImScaredOfUpdates"
                misc
                type="button"
                width="w-16 h-7"
                setSettingsChanged={setSettingsChanged}
              />
              <SettingTextBox
                setServerSettings={setServerSettings}
                text="Send Errors Show Message"
                value={serverSettings.Misc.SendErrorsShowMessage}
                generalValue="SendErrorsShowMessage"
                misc
                type="button"
                width="w-16 h-7"
                setSettingsChanged={setSettingsChanged}
              />
            </div> */}
          </div>
        </div>
      </div>
      {layout === 'alternate' && (
        <Maps
          mapCache={mapCache}
          setMapCache={setMapCache}
          setMaps={setMaps}
          setSelectedMap={setSelectedMap}
          maps={maps}
          selectedMap={selectedMap}
        />
      )}
    </div>
  );
}

export default GeneralServerSettings;
