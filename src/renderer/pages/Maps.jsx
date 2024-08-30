/* eslint no-console: "off" */


function Maps(props) {
  const {
    setMaps,
    setSelectedMap,
    maps,
    selectedMap,
    layout,
  } = props;

  const defaultMaps = [
    'gridmap',
    'gridmap_v2',
    'automation_test_track',
    'east_coast_usa',
    'hirochi_raceway',
    'italy',
    'industrial',
    'small_island',
    'smallgrid',
    'utah',
    'west_coast_usa',
    'driver_training',
    'derby',
    'jungle_rock_island',
    'johnson_valley',
  ];

  const SelectMap = (map) => {
    window.electron.ipcRenderer.selectMap(map);
    setSelectedMap(map);
    RefreshMapList();
  };



  const RefreshMapList = () => {
    setTimeout(() => {
      window.electron.ipcRenderer.getMaps().then((res) => {
        const result = [...defaultMaps, ...res];
        result.sort((a, b) => a.localeCompare(b));
        setMaps(result);
      });
    }, 500);
  };

  return (
    <div
      className={`flex flex-col overflow-hidden no-scrollbar ${
        layout === 'default'
          ? 'mx-4'
          : 'w-full'
      } h-[calc(100%-115px)]`}
    >
      {layout === 'default' && <div className="bg-black rounded-lg h-[2px]" />}
      {layout === 'alternate' && (
        <h1 className="text-lg text-white font-bold">Maps</h1>
      )}
      <span className="font-bold text-white my-2">
        Total: {maps.length}
      </span>
      {selectedMap && <div className="flex items-center justify-center text-white bg-green-600/50 border-2 border-black rounded-lg mb-2">
        {selectedMap}
      </div>}
      <div className="flex flex-col gap-2 overflow-auto no-scrollbar">
        {maps.map((map) => {
          if (map !== selectedMap) {
            return (
              <button
                key={map}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  SelectMap(map);
                }}
                className="border-2 border-black rounded-lg bg-white hover:bg-opacity-50 transition-all duration-200 ease-in-out"
              >
                {map}
              </button>
            );
          }
        })}
      </div>
    </div>
  );
}

export default Maps;
