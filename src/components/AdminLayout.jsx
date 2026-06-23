import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, FilePlus, LogOut, ArrowLeft, ShieldAlert } from 'lucide-react';
import AdminHeader from './AdminHeader';
import AdminMobileBottomNav from './AdminMobileBottomNav';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen bg-[#090514] text-gray-100 flex relative overflow-hidden font-sans">
      {/* Background Neon Blobs for Admin Purple Theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>

      {/* Admin Sidebar */}
      <aside className="w-64 bg-purple-950/10 backdrop-blur-xl border-r border-purple-500/20 p-6 flex flex-col justify-between hidden md:flex h-full shrink-0 z-20">
        <div className="space-y-8">
          {/* Logo / Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-purple-500/20 rounded-xl border border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300 tracking-wider">
                EduTest Admin
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400">
                Boshqaruv Paneli
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <Link
              to="/admin/users"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                isActive('/admin/users')
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>O'quvchilar</span>
            </Link>

            <Link
              to="/admin/questions"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                isActive('/admin/questions')
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <FilePlus className="w-5 h-5" />
              <span>Testlar Qo'shish</span>
            </Link>
          </nav>
        </div>


      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Admin Header (Desktop Only) */}
        <AdminHeader />

        {/* Mobile Header */}
        <header className="h-16 bg-[#090514]/80 backdrop-blur-xl border-b border-purple-500/10 flex items-center justify-between px-6 md:hidden sticky top-0 z-20">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-purple-400" />
            <span className="font-extrabold text-white tracking-wider">EduTest Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/admin/users" className={`text-sm ${isActive('/admin/users') ? 'text-purple-400 font-bold' : 'text-gray-400'}`}>O'quvchilar</Link>
            <Link to="/admin/questions" className={`text-sm ${isActive('/admin/questions') ? 'text-purple-400 font-bold' : 'text-gray-400'}`}>Testlar</Link>
            <button onClick={handleLogout} className="text-red-400"><LogOut className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Inner Content Grid */}
        <main className="flex-1 p-6 md:p-10 pb-24 md:pb-10 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
        <AdminMobileBottomNav />
      </div>
    </div>

  );
};

export default AdminLayout;
