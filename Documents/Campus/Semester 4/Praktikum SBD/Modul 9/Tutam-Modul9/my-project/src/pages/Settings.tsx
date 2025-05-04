import { useState } from 'react';
import { Save, Moon, Sun } from 'lucide-react';

export default function Settings() {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    
    // Simulate saving settings
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Appearance</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <div className="flex space-x-4">
                  <button
                    className={`flex items-center px-4 py-2 rounded-md ${
                      theme === 'light'
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                        : 'bg-gray-100 text-gray-800 border-2 border-transparent'
                    }`}
                    onClick={() => setTheme('light')}
                  >
                    <Sun size={18} className="mr-2" />
                    <span>Light</span>
                  </button>
                  <button
                    className={`flex items-center px-4 py-2 rounded-md ${
                      theme === 'dark'
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                        : 'bg-gray-100 text-gray-800 border-2 border-transparent'
                    }`}
                    onClick={() => setTheme('dark')}
                  >
                    <Moon size={18} className="mr-2" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <select
                  id="fontSize"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Account</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="your.email@example.com"
                  disabled
                />
              </div>
              
              <div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-5 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                saving
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <Save size={18} className="mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}