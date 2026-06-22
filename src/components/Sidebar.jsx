import { NavLink } from 'react-router-dom';
import { BookOpenCheck, Trophy } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col h-screen fixed">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-blue-600 tracking-wider">EduTest Pro</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink
          to="/test"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <BookOpenCheck className="w-5 h-5 mr-3" />
          Test Ishlash
        </NavLink>

        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <Trophy className="w-5 h-5 mr-3" />
          Reyting
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white text-center shadow-md">
          <p className="text-sm font-medium mb-2">Pro Versiyaga o'tish</p>
          <button className="w-full py-2 bg-white text-blue-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">
            Batafsil
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
