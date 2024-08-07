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
    <div className="flex flex-col mx-4 my-4 w-full ">
      <div className="text-3xl font-bold text-white">Mods</div>
      <div className="bg-black rounded-lg w-full mt-2 h-[2px]" />
      <div className="mt-2 flex flex-row gap-2 border-2 border-black rounded-lg p-4 bg-gray-400">
        <div className="flex flex-col w-full">
          <h1 className="text-lg text-white font-bold">Activated</h1>
          <span className="font-bold">
            Total:{' '}
            <span className="text-white">
              {modList && modList.activated.length - 1}
            </span>
          </span>
          <div className="flex flex-col gap-2 h-[45vh] no-scrollbar overflow-auto">
            {modList &&
              modList.activated.map((mod) => {
                if (mod === 'deactivated_mods') return null;
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
        </div>
        <div className="flex flex-col w-full">
          <h1 className="text-lg text-white font-bold">Deactivated</h1>
          <span className="font-bold">
            Total:{' '}
            <span className="text-white">
              {modList && modList.deactivated.length}
            </span>
          </span>
          <div className="flex flex-col gap-2 h-[45vh] no-scrollbar overflow-auto">
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
    </div>
  );
}

export default Mods;
