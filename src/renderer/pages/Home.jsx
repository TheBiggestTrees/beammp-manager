import LinkButton from 'renderer/components/LinkButton';
import ServerController from 'renderer/components/ServerController';

function Home() {
  return (
    <div className="flex flex-col h-[100vh] bg-gray-500 px-4 py-4">
      <LinkButton to="settings" text="Settings" />
      <h1 className="text-3xl text-white font-bold">BeamMP Manager</h1>
      <ServerController />
    </div>
  );
}

export default Home;
