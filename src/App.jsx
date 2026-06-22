import { useState } from 'react';
import TestPage from './pages/TestPage';
import Leaderboard from './pages/Leaderboard';

const App = () => {
  const [currentTab, setCurrentTab] = useState('test');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 h-16">
            <button
              onClick={() => setCurrentTab('test')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                currentTab === 'test'
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Test Ishlash
            </button>
            <button
              onClick={() => setCurrentTab('leaderboard')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                currentTab === 'leaderboard'
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reyting
            </button>
          </div>
        </div>
      </nav>

      <main>
        {currentTab === 'test' ? <TestPage /> : <Leaderboard />}
      </main>
    </div>
  )
}

export default App;