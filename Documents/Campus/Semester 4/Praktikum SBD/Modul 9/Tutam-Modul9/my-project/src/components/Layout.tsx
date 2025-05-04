import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      {isMobile && (
        <button 
          className="fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:inset-auto`}
      >
        <Sidebar closeSidebar={() => isMobile && setIsSidebarOpen(false)} />
      </div>

      {/* Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className={`flex-1 overflow-y-auto pb-12 transition-all duration-300 ${isSidebarOpen && !isMobile ? 'ml-64' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}