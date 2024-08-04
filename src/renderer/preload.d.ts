import { Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(channel: string, func: (...args: unknown[]) => void): void;
        once(channel: string, func: (...args: unknown[]) => void): void;
        invoke(channel: string, func: (...args: unknown[]) => void): void;
        selectFolder(): Promise<string>;
        SetFolder(): void;
        Directory(): void;
        getBackground(): Promise<boolean>;
        setBackground(): void;
      };
    };
  }
}

export {};
