/* eslint no-console: "off" */
import { useEffect, useState } from 'react';

function Mods(props) {
  const { layout } = props;
  const [modList, setModList] = useState(null);
  const [modImages, setModImages] = useState(null);

  useEffect(() => {
    window.electron.ipcRenderer
      .getModList()
      .then((res) => {
        console.log('res', res);
        return setModList(res);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {layout === 'alternate' && (
        <h1 className="text-lg text-white font-bold mt-2">Mods</h1>
      )}
      {layout === 'default' && (
        <div className="bg-black h-[2px] rounded-lg"></div>
      )}
      <div
        className={`flex h-[calc(100vh-100px)] flex-col my-2 bg-gray-400 border-2 border-black rounded-lg overflow-hidden no-scrollbar ${
          layout === 'alternate' ? 'w-full' : 'mx-4'
        }`}
      >
        <div className="flex flex-row gap-2  p-4 ">
          <div className="flex flex-col w-full">
            <h1 className="text-lg text-white font-bold">Activated</h1>
            <span className="font-bold">
              Total:{' '}
              <span className="text-white">
                {modList && modList.activated.length}
              </span>
            </span>
            <div className="flex flex-row flex-wrap  h-[calc(100vh-180px)] gap-2 no-scrollbar overflow-auto">
              {modList &&
                modList.activated.map((mod) => {
                  if (mod.name === 'deactivated_mods') return null;
                  return (
                    <button
                      key={mod.name}
                      type="button"
                      className="w-44 h-44 text-black px-2 bg-white border-2 border-black rounded-lg mb-2 flex flex-col items-center justify-center gap-2 py-4 overflow-hidden"
                      onClick={() => {
                        window.electron.ipcRenderer.deactivateMod(mod.name);
                        window.electron.ipcRenderer
                          .getModList()
                          .then((res) => {
                            console.log(res);
                            return setModList(res);
                          })
                          .catch((err) => console.error(err));
                      }}
                    >
                      <img
                        src={mod.image}
                        alt={mod.name}
                        className="w-32 h-32"
                      />
                      <div className="text-black w-40 text-center flex items-center justify-center">
                        {mod.name}
                      </div>
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
            <div className="flex flex-row flex-wrap  h-[calc(100vh-120px)] gap-2 no-scrollbar overflow-auto">
              {modList &&
                modList.deactivated.map((mod) => {
                  return (
                    <button
                      key={mod.name}
                      type="button"
                      className="w-44 h-44 text-white px-2 bg-red-500 border-2 border-black rounded-lg mb-2 flex flex-col items-center justify-center gap-2 py-4 overflow-hidden"
                      onClick={() => {
                        window.electron.ipcRenderer.activateMod(mod.name);
                        window.electron.ipcRenderer
                          .getModList()
                          .then((res) => {
                            return setModList(res);
                          })
                          .catch((err) => console.error(err));
                      }}
                    >
                      <img
                        src={mod.image}
                        alt={mod.name}
                        className="w-32 h-32"
                      />
                      <div className="text-white w-40 text-center flex items-center justify-center">
                        {mod.name}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Mods;
