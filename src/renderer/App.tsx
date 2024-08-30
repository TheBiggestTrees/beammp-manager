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
    Promise.all([
      window.electron.ipcRenderer.getMaps(),
      window.electron.ipcRenderer.getSelectedMap(),
      window.electron.ipcRenderer.getLayout()
    ])
      .then(([mapsRes, selectedMapRes, layoutRes]) => {
        const result = [...defaultMaps, ...mapsRes];
        result.sort((a, b) => a.localeCompare(b));
        setMaps(result);
        setSelectedMap(selectedMapRes);
        setLayout(layoutRes);
      })
      .catch((err) => console.error('Error refreshing maps:', err));
  };

  useEffect(() => {
    RefreshMaps();
  }, []);

  return (
    <AppProvider>
      <Router>
        <>
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

                  setMaps={setMaps}
                  setSelectedMap={setSelectedMap}
                  maps={maps}
                  selectedMap={selectedMap}
                  RefreshMaps={RefreshMaps}
                  layout={layout}
                />
              }
            />
            <Route
              path="/maps"
              element={
                <Maps

                  setMaps={setMaps}
                  setSelectedMap={setSelectedMap}
                  maps={maps}
                  selectedMap={selectedMap}
                  RefreshMaps={RefreshMaps}
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
        </>
      </Router>
    </AppProvider>
  );
}
