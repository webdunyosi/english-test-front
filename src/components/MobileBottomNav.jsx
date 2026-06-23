import { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpenCheck, Trophy, User, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY = 'notif_seen_ids';

const MobileBottomNav = () => {
  const { token, API_BASE, logout } = useAuth();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    if (!API_BASE || !token) return;
    try {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const res = await fetch(`${API_BASE}/api/notifications?since=${since}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const all = await res.json();
      const seenIds = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setUnreadCount(all.filter(n => !seenIds.includes(n.id)).length);
    } catch (err) {
      console.error('Notification count fetch error:', err);
    }
  }, [API_BASE, token]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0b1120]/90 backdrop-blur-xl border-t border-white/10 z-30 flex items-center justify-around px-2">

      {/* Tab 1: Testlar */}
      <NavLink
        to="/test"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center w-12 h-12 transition-all duration-300 ${
            isActive ? 'text-blue-400 scale-105' : 'text-gray-400'
          }`
        }
      >
        <BookOpenCheck className="w-5 h-5" />
        <span className="text-[9px] mt-0.5 font-medium">Testlar</span>
      </NavLink>

      {/* Tab 2: Reyting */}
      <NavLink
        to="/leaderboard"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center w-12 h-12 transition-all duration-300 ${
            isActive ? 'text-blue-400 scale-105' : 'text-gray-400'
          }`
        }
      >
        <Trophy className="w-5 h-5" />
        <span className="text-[9px] mt-0.5 font-medium">Reyting</span>
      </NavLink>

      {/* Tab 3: Center Elevated Profile */}
      <div className="relative w-16 h-16 flex items-center justify-center -mt-6">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `w-14 h-14 rounded-full border-2 bg-[#0b1120] flex items-center justify-center shadow-lg transition-all duration-300 focus:outline-none cursor-pointer ${
              isActive
                ? 'border-blue-400 text-blue-300 shadow-blue-500/40'
                : 'border-blue-500/50 text-blue-400 shadow-blue-500/30 hover:border-blue-400'
            }`
          }
        >
          <User className="w-6 h-6" />
        </NavLink>
        <span className="absolute bottom-[-14px] text-[9px] font-semibold text-blue-400">Profil</span>
      </div>

      {/* Tab 4: Xabarnomalar — full page NavLink */}
      <NavLink
        to="/notifications"
        className={({ isActive }) =>
          `relative flex flex-col items-center justify-center w-12 h-12 transition-all duration-300 ${
            isActive ? 'text-blue-400 scale-105' : 'text-gray-400 hover:text-blue-400'
          }`
        }
      >
        <div className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <span className="text-[9px] mt-0.5 font-medium">Xabarnoma</span>
      </NavLink>

      {/* Tab 5: Chiqish */}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center justify-center w-12 h-12 text-red-400/80 hover:text-red-400 transition-all duration-300 focus:outline-none cursor-pointer"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-[9px] mt-0.5 font-medium">Chiqish</span>
      </button>
    </div>
  );
};

export default MobileBottomNav;
