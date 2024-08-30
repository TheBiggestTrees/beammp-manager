import { useEffect, useState } from "react";

export default function Mods(props) {
  const { layout } = props;
  const [modList, setModList] = useState(null);

  useEffect(() => {
    window.electron.ipcRenderer
      .getModList()
      .then((res) => {
        console.log('res', res);
        return setModList(res);
      })
      .catch((err) => console.error(err));
  }, []);

  const renderModSection = (title, mods, action) => (
    <div className="flex flex-col w-full h-full">
      <h1 className="text-lg text-white font-bold">{title}</h1>
      <span className="font-bold">
        Total: <span className="text-white">{mods?.length || 0}</span>
      </span>
      <div className="flex flex-row flex-wrap h-[calc(100%-60px)] gap-2 no-scrollbar overflow-auto">
        {mods &&
          mods.map((mod) => {
            if (mod.name === 'deactivated_mods') return null;
            return (
              <button
                key={mod.name}
                type="button"
                className={`w-44 h-44 text-black px-2 ${
                  title === 'Deactivated'
                    ? 'bg-red-500'
                    : 'bg-white'
                } border-2 border-black rounded-lg mb-2 flex flex-col items-center justify-between py-2 overflow-hidden transition-all duration-200 ease-in-out hover:bg-opacity-50 hover:shadow-md`}
                onClick={() => {
                  window.electron.ipcRenderer[action](mod.name);
                  window.electron.ipcRenderer
                    .getModList()
                    .then((res) => setModList(res))
                    .catch((err) => console.error(err));
                }}
              >
                <img
                  src={mod.image}
                  alt={mod.name}
                  className="w-28 h-28 object-cover"
                />
                <div className="text-black w-full text-center text-md font-semibold leading-tight line-clamp-2 overflow-ellipsis">
                  {mod.name}
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );

  return (
    <>
      {layout === 'alternate' && (
        <h1 className="text-lg text-white font-bold mt-2">Mods</h1>
      )}
      {layout === 'default' && (
        <div className="bg-black h-[2px] rounded-lg"></div>
      )}
      <div
        className={`flex flex-col my-2 bg-gray-900/40 border-2 border-black rounded-lg overflow-hidden no-scrollbar ${
          layout === 'alternate' ? 'w-full' : 'mx-4'
        } h-[calc(100vh-115px)]`}
      >
        <div className="flex flex-row gap-2 p-4 h-full">
          {renderModSection('Activated', modList?.activated, 'deactivateMod')}
          {renderModSection('Deactivated', modList?.deactivated, 'activateMod')}
        </div>
      </div>
    </>
  );
}
