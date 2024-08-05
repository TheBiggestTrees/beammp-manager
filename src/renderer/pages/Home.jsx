import GeneralServerSettings from 'renderer/components/GeneralServerSettings';
import LinkButton from 'renderer/components/LinkButton';
import ServerController from 'renderer/components/ServerController';

function Home() {
  return (
    <div className="flex flex-col h-[100vh] bg-gray-500 px-4 py-4">
      <div className="flex flex-row gap-2">
        <LinkButton to="settings" text="Settings" />
        <LinkButton to="maps" text="Maps" />
      </div>

      <ServerController />
      <GeneralServerSettings />
    </div>
  );
}

export default Home;
