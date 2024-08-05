function SettingTextBox(props) {
  const { setServerSettings, text, value, generalValue, type, width } = props;

  if (type === 'textarea') {
    return (
      <div className="flex">
        <span className="text-white mr-2">{text}: </span>
        <textarea
          className="bg-white border-2 border-black rounded-lg w-60 h-16 "
          value={value}
          onChange={(e) => {
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
