import { useEffect, useState } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import LinkButton from './components/LinkButton';
import ServerController from './components/ServerController';
import Home from './pages/Home';
import Settings from './pages/Settings';
import AppProvider from './providers/app';

export default function App() {
  const [mapCache, setMapCache] = useState(null);
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState('');

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

  const refreshMaps = () => {
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
    console.log(mapCache);
  };

  useEffect(() => {
    refreshMaps();
  }, []);

  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center px-4">
            <div className="flex gap-2">
              <LinkButton to="" text="Home" />
              <LinkButton to="settings" text="Settings" />
            </div>
            <ServerController />
          </div>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  mapCache={mapCache}
                  setMapCache={setMapCache}
                  maps={maps}
                  selectedMap={selectedMap}
                  setSelectedMap={setSelectedMap}
                  setMaps={setMaps}
                />
              }
            />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}
