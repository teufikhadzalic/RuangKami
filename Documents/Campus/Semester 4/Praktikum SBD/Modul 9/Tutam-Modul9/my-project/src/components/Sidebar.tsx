import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, FolderPlus, Tag, PlusCircle, Search, Folder } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  closeSidebar: () => void;
}

export default function Sidebar({ closeSidebar }: SidebarProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [foldersOpen, setFoldersOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(true);

  // Mock folders and tags - in a real app these would come from the database
  const folders = [
    { id: '1', name: 'Personal' },
    { id: '2', name: 'Work' },
    { id: '3', name: 'Projects' }
  ];

  const tags = [
    { id: '1', name: 'Important' },
    { id: '2', name: 'Ideas' },
    { id: '3', name: 'To-Do' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2" onClick={closeSidebar}>
          <div className="bg-gray-900 text-white p-1 rounded">
            <Home size={18} />
          </div>
          <span className="font-semibold text-xl">Note</span>
        </Link>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          <li>
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-md ${isActive('/') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={closeSidebar}
            >
              <Home size={18} className="mr-3" />
              <span>Home</span>
            </Link>
          </li>
          
          <li className="mt-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <button 
                className="flex items-center text-gray-500 font-medium text-sm"
                onClick={() => setFoldersOpen(!foldersOpen)}
              >
                <span className="mr-1">{foldersOpen ? '▼' : '►'}</span>
                <span>FOLDERS</span>
              </button>
              <button className="text-gray-500 hover:text-gray-900">
                <FolderPlus size={16} />
              </button>
            </div>
            
            {foldersOpen && (
              <ul className="ml-2 space-y-1">
                {folders.map(folder => (
                  <li key={folder.id}>
                    <Link
                      to={`/?folder=${folder.id}`}
                      className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      <Folder size={16} className="mr-3 text-gray-500" />
                      <span>{folder.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="mt-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <button 
                className="flex items-center text-gray-500 font-medium text-sm"
                onClick={() => setTagsOpen(!tagsOpen)}
              >
                <span className="mr-1">{tagsOpen ? '▼' : '►'}</span>
                <span>TAGS</span>
              </button>
              <button className="text-gray-500 hover:text-gray-900">
                <Tag size={16} />
              </button>
            </div>
            
            {tagsOpen && (
              <ul className="ml-2 space-y-1">
                {tags.map(tag => (
                  <li key={tag.id}>
                    <Link
                      to={`/?tag=${tag.id}`}
                      className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                      <span>{tag.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Link
          to="/notes/new"
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-150"
          onClick={closeSidebar}
        >
          <PlusCircle size={18} className="mr-2" />
          <span>New Note</span>
        </Link>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Link
          to="/settings"
          className={`flex items-center px-3 py-2 rounded-md ${isActive('/settings') ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={closeSidebar}
        >
          <Settings size={18} className="mr-3" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}