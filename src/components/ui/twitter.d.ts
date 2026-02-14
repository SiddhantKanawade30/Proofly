
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
      events?: {
        bind: (event: string, callback: () => void) => void;
      };
    };
  }
}

export {};