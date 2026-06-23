import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate } from 'react-router-dom';
import { Users, FilePlus, User, LogOut, HelpCircle, Lock, Eye, EyeOff, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const AdminMobileBottomNav = () => {
  const { token, API_BASE, logout } = useAuth();
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
    toast('Admin qo\'llab-quvvatlash tizimi faol', {
      icon: '🛡️',
      duration: 3000
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#090514]/90 backdrop-blur-xl border-t border-purple-500/20 z-30 flex items-center justify-around px-2">
        {/* Tab 1: O'quvchilar */}
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 h-12 transition-all duration-300 ${
              isActive ? 'text-purple-400 scale-105' : 'text-gray-400'
            }`
          }
        >
          <Users className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-medium">O'quvchilar</span>
        </NavLink>

        {/* Tab 2: Testlar */}
        <NavLink
          to="/admin/questions"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 h-12 transition-all duration-300 ${
              isActive ? 'text-purple-400 scale-105' : 'text-gray-400'
            }`
          }
        >
          <FilePlus className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-medium">Testlar</span>
        </NavLink>

        {/* Tab 3: Center Elevated Profile Button */}
        <div className="relative w-16 h-16 flex items-center justify-center -mt-6">
          <button
            onClick={() => setShowModal(true)}
            className="w-14 h-14 rounded-full border-2 border-purple-500/50 bg-[#090514] text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:border-purple-400 transition-all duration-300 focus:outline-none cursor-pointer"
          >
            <User className="w-6 h-6" />
          </button>
          <span className="absolute bottom-[-14px] text-[9px] font-semibold text-purple-400">Profil</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090514]/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-purple-500/20 shadow-[0_10px_50px_rgba(168,85,247,0.2)] animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
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
                    className="w-full pl-4 pr-12 py-3 bg-gray-900 border border-purple-500/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-purple-400 transition-colors focus:outline-none cursor-pointer"
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
                    className="w-full pl-4 pr-12 py-3 bg-gray-900 border border-purple-500/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-purple-400 transition-colors focus:outline-none cursor-pointer"
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
                    className="w-full pl-4 pr-12 py-3 bg-gray-900 border border-purple-500/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-purple-400 transition-colors focus:outline-none cursor-pointer"
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
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold rounded-2xl shadow-[0_4px_15px_rgba(168,85,247,0.3)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
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

export default AdminMobileBottomNav;
