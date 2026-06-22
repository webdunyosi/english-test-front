import { Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 glass-panel flex items-center justify-end px-8 sticky top-0 z-10 border-b border-white/10">
      <div className="flex items-center space-x-6">
        <button className="text-gray-400 hover:text-blue-400 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
        </button>
        
        <div className="h-6 w-px bg-white/10"></div>
 
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 hover:bg-white/5 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-white/10">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-gray-300 hidden sm:block">
              {user ? user.username : 'Profilim'}
            </span>
          </div>
          
          <button 
            className="flex items-center space-x-2 text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:block">Chiqish</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
