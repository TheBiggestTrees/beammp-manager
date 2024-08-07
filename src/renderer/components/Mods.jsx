import { useEffect, useState } from 'react';

function Mods() {
  const [modList, setModList] = useState(null);

  useEffect(() => {
    window.electron.ipcRenderer
      .getModList()
      .then((res) => {
        console.log(res);
        return setModList(res);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex flex-col mx-4 my-2">
      <div className="text-3xl font-bold text-white">Mods</div>
      <div className="bg-black rounded-lg w-full mt-2 h-[2px]" />
      <div className="mt-2 flex flex-row gap-2">
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-lg text-white font-bold">Activated</h1>
          {modList &&
            modList.activated.map((mod) => {
              return (
                <button
                  key={mod}
                  type="button"
                  className="text-black px-2 bg-white border-2 border-black rounded-lg mb-2"
                  onClick={() => {
                    window.electron.ipcRenderer.deactivateMod(mod);
                    window.electron.ipcRenderer
                      .getModList()
                      .then((res) => {
                        console.log(res);
                        return setModList(res);
                      })
                      .catch((err) => console.error(err));
                  }}
                >
                  {mod}
                </button>
              );
            })}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-lg text-white font-bold">Deactivated</h1>
          {modList &&
            modList.deactivated.map((mod) => {
              return (
                <button
                  key={mod}
                  type="button"
                  className="text-white px-2 bg-red-500 border-2 border-black rounded-lg mb-2"
                  onClick={() => {
                    window.electron.ipcRenderer.activateMod(mod);
                    window.electron.ipcRenderer
                      .getModList()
                      .then((res) => {
                        console.log(res);
                        return setModList(res);
                      })
                      .catch((err) => console.error(err));
                  }}
                >
                  {mod}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Mods;
