import React, { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { CanvasArea } from './components/CanvasArea';
import { useNoteZustandStore } from './stores/useNoteZustandStore';

export const App: React.FC = () => {
  const hydrateFromDisk = useNoteZustandStore((state) => state.hydrateFromDisk);

  useEffect(() => {
    hydrateFromDisk();
  }, [hydrateFromDisk]);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-theme-primary font-ui">
      {/* Sidebar (Desktop Persistent & Mobile Drawer) */}
      <Sidebar />

      {/* Main Note Canvas Desk Area */}
      <CanvasArea />
    </div>
  );
};

export default App;
