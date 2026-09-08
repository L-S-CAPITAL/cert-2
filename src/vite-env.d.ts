/// <reference types="vite/client" />

interface ElectroTechAPI {
  platform: string;
  versions: {
    chrome: string;
    electron: string;
    node: string;
  };
}

interface Window {
  electrotech?: ElectroTechAPI;
}
