import { NavLink } from 'react-router-dom';
import { BookOpenCheck, Trophy } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 glass-panel hidden md:flex flex-col h-screen fixed z-20 border-r border-white/10">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 tracking-wider">
          EduTest Pro
        </h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink
          to="/test"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? 'bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`
          }
        >
          <BookOpenCheck className="w-5 h-5 mr-3" />
          Test Ishlash
        </NavLink>

        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? 'bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`
          }
        >
          <Trophy className="w-5 h-5 mr-3" />
          Reyting
        </NavLink>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 text-white text-center shadow-lg border border-blue-500/30">
          <p className="text-sm font-medium mb-2">Pro Versiyaga o'tish</p>
          <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/10">
            Batafsil
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
