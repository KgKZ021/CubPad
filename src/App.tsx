import React from 'react';
import { Sidebar } from './components/Sidebar';
import { CanvasArea } from './components/CanvasArea';

export const App: React.FC = () => {
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

