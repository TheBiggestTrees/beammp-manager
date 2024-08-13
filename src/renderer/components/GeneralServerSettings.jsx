import { useState } from 'react';
import SettingTextBox from './SettingTextBox';

function GeneralServerSettings(props) {
  const { serverSettings, setServerSettings } = props;

  const [settingsChanged, setSettingsChanged] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <div className="bg-black rounded-lg h-[2px]" />

      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-between items-start">
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
                width="w-16"
                setSettingsChanged={setSettingsChanged}
              />
              <SettingTextBox
                setServerSettings={setServerSettings}
                text="Max Cars"
                value={serverSettings.General.MaxCars}
                generalValue="MaxCars"
                type="number"
                width="w-16"
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
                setSettingsChanged={setSettingsChanged}
              />
              <SettingTextBox
                setServerSettings={setServerSettings}
                text="Log Chat"
                value={serverSettings.General.LogChat}
                generalValue="LogChat"
                type="button"
                width="w-16 h-7"
                setSettingsChanged={setSettingsChanged}
              />
            </div>
            <div className="flex flex-col gap-2">
              <SettingTextBox
                setServerSettings={setServerSettings}
                text="Private"
                value={serverSettings.General.Private}
                generalValue="Private"
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
            </div>
            <div className="flex flex-col gap-2">
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
            </div>
            <div className="flex flex-col gap-2">
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
      </div>
    </div>
  );
}

export default GeneralServerSettings;
