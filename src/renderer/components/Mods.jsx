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
      <div className="mt-2">
        <p className="text-white text-xl font-bold">Coming Soon!</p>
      </div>
    </div>
  );
}

export default Mods;
