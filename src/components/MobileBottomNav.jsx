import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpenCheck, Trophy, User, LogOut, HelpCircle, Lock, Eye, EyeOff, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const MobileBottomNav = () => {
  const { user, token, API_BASE, logout } = useAuth();
  const navigate = useNavigate();

  // Change Password Modal States
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;
    if (showModal) {
      mainElement.style.overflow = 'hidden';
    } else {
      mainElement.style.overflow = '';
    }
    return () => {
      mainElement.style.overflow = '';
    };
  }, [showModal]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleHelpClick = () => {
    toast('Yordam uchun: @edutest_support Telegram guruhiga murojaat qiling', {
      icon: '💬',
      duration: 4000
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Yangi parollar mos kelmadi!");
      return;
    }
    if (newPassword.length < 4) {
      toast.error("Parol kamida 4 ta belgidan iborat bo'lishi kerak!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Parolni o'zgartirishda xatolik");
      }

      toast.success("Parolingiz muvaffaqiyatli o'zgartirildi!");
      setShowModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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

        {/* Tab 3: Center Elevated Profile Button */}
        <div className="relative w-16 h-16 flex items-center justify-center -mt-6">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `w-14 h-14 rounded-full border-2 bg-[#0b1120] flex items-center justify-center shadow-lg transition-all duration-300 focus:outline-none cursor-pointer ${
                isActive
                  ? 'border-emerald-400 text-emerald-400 shadow-emerald-500/30'
                  : 'border-blue-500/50 text-blue-400 shadow-blue-500/30 hover:border-blue-400'
              }`
            }
          >
            <User className="w-6 h-6" />
          </NavLink>
          <span className="absolute bottom-[-14px] text-[9px] font-semibold text-blue-400">Profil</span>
        </div>

        {/* Tab 4: Help */}
        <button
          onClick={handleHelpClick}
          className="flex flex-col items-center justify-center w-12 h-12 text-gray-400 hover:text-gray-200 transition-all duration-300 focus:outline-none cursor-pointer"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-medium">Yordam</span>
        </button>

        {/* Tab 5: Chiqish */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center w-12 h-12 text-red-400/80 hover:text-red-400 transition-all duration-300 focus:outline-none cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-medium">Chiqish</span>
        </button>
      </div>

      {/* Change Password Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090b14]/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-blue-500/20 shadow-[0_10px_50px_rgba(59,130,246,0.2)] animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Parolni O'zgartirish</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Joriy Parol
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Hozirgi parolingiz..."
                    className="w-full pl-4 pr-12 py-3 bg-gray-900 border border-blue-500/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-400 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Yangi Parol
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Yangi parol..."
                    className="w-full pl-4 pr-12 py-3 bg-gray-900 border border-blue-500/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-400 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Yangi Parolni Tasdiqlang
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Yangi parolni takroran kiriting..."
                    className="w-full pl-4 pr-12 py-3 bg-gray-900 border border-blue-500/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-400 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-bold rounded-2xl transition-all duration-300 cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold rounded-2xl shadow-[0_4px_15px_rgba(59,130,246,0.3)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default MobileBottomNav;
