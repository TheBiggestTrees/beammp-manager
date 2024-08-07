import { useState } from 'react';
import SettingTextBox from './SettingTextBox';

function GeneralServerSettings(props) {
  const { serverSettings, setServerSettings } = props;

  const [settingsChanged, setSettingsChanged] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl text-white font-bold mt-4 mb-2">Home</h2>
        {settingsChanged && (
          <button
            className="bg-green-400 w-24 h-8 border-2 border-black rounded-lg"
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
      <div className="bg-black rounded-lg h-[2px]" />

      <div className="flex flex-col gap-2 mt-2">
        <SettingTextBox
          setServerSettings={setServerSettings}
          text="Name"
          value={serverSettings.General.Name}
          generalValue="Name"
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

        <SettingTextBox
          setServerSettings={setServerSettings}
          text="Log Chat"
          value={serverSettings.General.LogChat}
          generalValue="LogChat"
          type="button"
          setSettingsChanged={setSettingsChanged}
        />
        <SettingTextBox
          setServerSettings={setServerSettings}
          text="Private"
          value={serverSettings.General.Private}
          generalValue="Private"
          type="button"
          setSettingsChanged={setSettingsChanged}
        />

        <SettingTextBox
          setServerSettings={setServerSettings}
          text="Debug"
          value={serverSettings.General.Debug}
          generalValue="Debug"
          type="button"
          setSettingsChanged={setSettingsChanged}
        />
        <SettingTextBox
          setServerSettings={setServerSettings}
          text={`I'm Scared Of Updates`}
          value={serverSettings.Misc.ImScaredOfUpdates}
          generalValue="ImScaredOfUpdates"
          misc
          type="button"
          setSettingsChanged={setSettingsChanged}
        />
        <SettingTextBox
          setServerSettings={setServerSettings}
          text="Send Errors Show Message"
          value={serverSettings.Misc.SendErrorsShowMessage}
          generalValue="SendErrorsShowMessage"
          misc
          type="button"
          setSettingsChanged={setSettingsChanged}
        />
        <SettingTextBox
          setServerSettings={setServerSettings}
          text="Send Errors"
          value={serverSettings.Misc.SendErrors}
          generalValue="SendErrors"
          misc
          type="button"
          setSettingsChanged={setSettingsChanged}
        />
      </div>
    </div>
  );
}

export default GeneralServerSettings;
