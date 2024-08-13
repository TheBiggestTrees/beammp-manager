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
  const [selectedPage, setSelectedPage] = useState('home');
  const [layout, setLayout] = useState('default');

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
      window.electron.ipcRenderer.getLayout().then((res) => setLayout(res));
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
                stylings={
                  selectedPage === 'home'
                    ? `text-3xl font-bold text-orange-500`
                    : `text-3xl font-bold text-white`
                }
                onClick={() => setSelectedPage('home')}
              />
              {layout === 'default' && (
                <>
                  {' '}
                  <LinkButton
                    to="maps"
                    text="Maps"
                    stylings={
                      selectedPage === 'maps'
                        ? `text-3xl font-bold text-orange-500`
                        : `text-3xl font-bold text-white`
                    }
                    onClick={() => setSelectedPage('maps')}
                  />
                  <LinkButton
                    to="mods"
                    text="Mods"
                    stylings={
                      selectedPage === 'mods'
                        ? `text-3xl font-bold text-orange-500`
                        : `text-3xl font-bold text-white`
                    }
                    onClick={() => setSelectedPage('mods')}
                  />
                </>
              )}
              <LinkButton
                to="settings"
                text="Settings"
                stylings={
                  selectedPage === 'settings'
                    ? `text-3xl font-bold text-orange-500`
                    : `text-3xl font-bold text-white`
                }
                onClick={() => setSelectedPage('settings')}
              />
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
                  setMaps={setMaps}
                  setSelectedMap={setSelectedMap}
                  maps={maps}
                  selectedMap={selectedMap}
                  layout={layout}
                />
              }
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
                  layout={layout}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <Settings
                  folder={folder}
                  setFolder={setFolder}
                  layout={layout}
                  setLayout={setLayout}
                />
              }
            />

            <Route path="/mods" element={<Mods layout={layout} />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}
