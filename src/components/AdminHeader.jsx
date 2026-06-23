import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="hidden md:flex h-16 bg-purple-950/10 backdrop-blur-xl border-b border-purple-500/20 items-center justify-end px-8 sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        {/* User Info */}
        <div className="flex items-center space-x-2 hover:bg-purple-500/10 px-3 py-2 rounded-xl transition-all duration-300 border border-transparent hover:border-purple-500/20">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-sm font-semibold text-white block">
              {user ? user.username : 'Admin'}
            </span>
            <span className="text-[10px] text-purple-400 font-bold uppercase block -mt-1">
              Admin
            </span>
          </div>
        </div>
        
        {/* Vertical divider */}
        <div className="h-6 w-px bg-purple-500/20"></div>
        
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-xl transition-all duration-300 border border-transparent hover:border-red-500/20 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-semibold hidden sm:block">Chiqish</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
