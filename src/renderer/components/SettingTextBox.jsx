function SettingTextBox(props) {
  const {
    setServerSettings,
    text,
    value,
    generalValue,
    type,
    width,
    misc,
    setSettingsChanged,
  } = props;

  if (misc) {
    return (
      <div className="flex">
        <span className="text-white mr-2">{text}: </span>
        <button
          type="button"
          className="bg-white w-24 h-8 border-2 border-black rounded-lg"
          onClick={() => {
            setSettingsChanged(true);
            return setServerSettings((prev) => ({
              ...prev,
              Misc: { ...prev.Misc, [generalValue]: !value },
            }));
          }}
        >
          {value ? 'Yes' : 'No'}
        </button>
      </div>
    );
  }
  if (type === 'button') {
    return (
      <div className="flex">
        <span className="text-white mr-2">{text}: </span>
        <button
          type="button"
          className="bg-white w-24 h-8 border-2 border-black rounded-lg"
          onClick={() => {
            setSettingsChanged(true);
            return setServerSettings((prev) => ({
              ...prev,
              General: { ...prev.General, [generalValue]: !value },
            }));
          }}
        >
          {value ? 'Yes' : 'No'}
        </button>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="flex">
        <span className="text-white mr-2">{text}: </span>
        <textarea
          className="bg-white border-2 border-black rounded-lg w-60 h-16 "
          value={value}
          onChange={(e) => {
            setSettingsChanged(true);
            return setServerSettings((prev) => ({
              ...prev,
              General: { ...prev.General, [generalValue]: e.target.value },
            }));
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex">
      <span className="text-white mr-2">{text}: </span>
      <input
        type={type}
        className={`bg-white border-2 border-black rounded-lg ${width}`}
        value={value}
        onChange={(e) => {
          setSettingsChanged(true);
          return setServerSettings((prev) => ({
            ...prev,
            General: { ...prev.General, [generalValue]: e.target.value },
          }));
        }}
      />
    </div>
  );
}

export default SettingTextBox;
