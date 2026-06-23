import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, LogOut, User, Lock, Eye, EyeOff, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Header = () => {
  const { user, token, API_BASE, logout } = useAuth();

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

  const handleProfileClick = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setShowModal(true);
  };

  return (
    <header className="hidden md:flex h-16 glass-panel flex items-center justify-end px-8 sticky top-0 z-10 border-b border-white/10">
      <div className="flex items-center space-x-6">
        <button className="text-gray-400 hover:text-blue-400 transition-colors relative cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
        </button>
        
        <div className="h-6 w-px bg-white/10"></div>
 
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleProfileClick}
            className="flex items-center space-x-2 hover:bg-white/5 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-white/10 cursor-pointer"
            title="Parolni o'zgartirish"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-gray-300 hidden sm:block">
              {user ? user.username : 'Profilim'}
            </span>
          </button>
          
          <button 
            className="flex items-center space-x-2 text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-red-500/20 cursor-pointer"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:block">Chiqish</span>
          </button>
        </div>
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

    </header>
  );
};

export default Header;
