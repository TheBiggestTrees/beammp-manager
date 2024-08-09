import { useEffect, useState } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import LinkButton from './components/LinkButton';
import ServerController from './components/ServerController';
import Home from './pages/Home';
import Maps from './pages/Maps';
import Mods from './pages/Mods';
import Settings from './pages/Settings';
import AppProvider from './providers/app';

export default function App() {
  const [mapCache, setMapCache] = useState(null);
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState('');
  const [folder, setFolder] = useState('');

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

  const RefreshMaps = () => {
    if (!mapCache) {
      window.electron.ipcRenderer
        .getMaps()
        .then((res) => {
          const result = [...defaultMaps, ...res];
          setMapCache(result);
          return setMaps(result);
        })
        .catch((err) => console.error(err));
      window.electron.ipcRenderer
        .getSelectedMap()
        .then((res) => setSelectedMap(res))
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    RefreshMaps();
  }, [folder]);

  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-end m-4">
            <div className="flex flex-row gap-4">
              <LinkButton
                to=""
                text="Home"
                stylings="text-3xl text-white font-bold"
              />
              <LinkButton
                to="maps"
                text="Maps"
                stylings="text-3xl text-white font-bold"
              />
              <LinkButton
                to="mods"
                text="Mods"
                stylings="text-3xl text-white font-bold"
              />
              <LinkButton
                to="settings"
                text="Settings"
                stylings="text-3xl text-white font-bold"
              />
            </div>
            <ServerController />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/settings"
              element={<Settings folder={folder} setFolder={setFolder} />}
            />
            <Route
              path="/maps"
              element={
                <Maps
                  mapCache={mapCache}
                  setMapCache={setMapCache}
                  setMaps={setMaps}
                  setSelectedMap={setSelectedMap}
                  maps={maps}
                  selectedMap={selectedMap}
                />
              }
            />
            <Route path="/mods" element={<Mods />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}
