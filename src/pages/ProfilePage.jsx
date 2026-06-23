import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  User, Phone, Edit2, CalendarCheck, BookOpen,
  Send, LogOut, ChevronRight, Lock, Eye, EyeOff, X
} from 'lucide-react';


import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { user, token, API_BASE, logout } = useAuth();
  const navigate = useNavigate();

  // Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
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
      if (!response.ok) throw new Error(data.message || "Parolni o'zgartirishda xatolik");
      toast.success("Parolingiz muvaffaqiyatli o'zgartirildi!");
      setShowPasswordModal(false);
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setShowCurrent(false); setShowNew(false); setShowConfirm(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpClick = () => {
    toast('Yordam uchun: @edutest_support Telegram guruhiga murojaat qiling', {
      icon: '💬',
      duration: 4000
    });
  };

  const menuItems = [
    {
      icon: <CalendarCheck className="w-5 h-5 text-blue-400" />,
      label: "Mening buyurtmalarim",
      bg: "bg-blue-500/15",
      border: "border-blue-500/20",
      badge: null,
      onClick: () => toast('Tez orada mavjud bo\'ladi!', { icon: '📋' })
    },
    {
      icon: <BookOpen className="w-5 h-5 text-blue-400" />,
      label: "Ilovadan foydalanish darsliklari",
      bg: "bg-blue-500/15",
      border: "border-blue-500/20",
      badge: null,
      onClick: () => toast('Darsliklar tez orada!', { icon: '📚' })
    },
  ];


  const contactItems = [
    {
      icon: <Send className="w-5 h-5 text-blue-400" />,
      bg: "bg-blue-500/15",
      border: "border-blue-500/20",
      label: "O'QITUVCHI TELEGRAM",
      value: "@Khikoyat_english_97",
      onClick: () => window.open('https://t.me/Khikoyat_english_97', '_blank')
    },
    {
      icon: <Phone className="w-5 h-5 text-blue-400" />,
      bg: "bg-blue-500/15",
      border: "border-blue-500/20",
      label: "O'QITUVCHI TELEFON",
      value: "+998 93 108 17 97",
      onClick: () => window.open('tel:+998931081797', '_blank')
    },
  ];

  return (
    <>
      <div className="max-w-lg mx-auto px-0 pb-8 animate-fadeIn">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-center text-white mb-6 tracking-wide">
          Shaxsiy Kabinet
        </h1>

        {/* User Info Card */}
        <div
          className="rounded-2xl border border-blue-500/20 mb-4 p-4 flex items-center gap-4 relative"
          style={{ background: 'rgba(11, 17, 32, 0.85)', backdropFilter: 'blur(12px)' }}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-2 border-blue-400/60 shadow-lg shadow-blue-500/20 overflow-hidden">
              <User className="w-9 h-9 text-white" />
            </div>
            {/* Online indicator */}
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-blue-400 rounded-full border-2 border-[#0b1120]"></span>
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-white truncate">
              {user?.username || 'Foydalanuvchi'}
            </p>
            <p className="text-sm text-gray-400 truncate">
              @{user?.username || '—'}
            </p>
            <div className="mt-1.5">
              <span className="inline-block text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-blue-500/40 text-blue-400 bg-blue-500/10">
                {user?.role === 'admin' ? 'ADMIN' : 'MIJOZ'}
              </span>
              {user?.group && (
                <span className="ml-2 inline-block text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-blue-500/40 text-blue-400 bg-blue-500/10">
                  {user.group}
                </span>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setShowPasswordModal(true)}
            className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
            title="Parolni o'zgartirish"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Items */}
        <div
          className="rounded-2xl border border-blue-500/15 mb-4 overflow-hidden"
          style={{ background: 'rgba(11, 17, 32, 0.85)', backdropFilter: 'blur(12px)' }}
        >
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-blue-500/5 transition-all duration-200 cursor-pointer group border-b border-blue-500/10 last:border-b-0"
            >
              <div className={`w-10 h-10 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center flex-shrink-0`}>
                {item.icon}
              </div>
              <span className="flex-1 text-left text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                {item.label}
              </span>
              {item.badge && (
                <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-0.5 transition-all duration-200" />
            </button>
          ))}
        </div>

        {/* Contact Items */}
        <div
          className="rounded-2xl border border-blue-500/15 mb-4 overflow-hidden"
          style={{ background: 'rgba(11, 17, 32, 0.85)', backdropFilter: 'blur(12px)' }}
        >
          {contactItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-blue-500/5 transition-all duration-200 cursor-pointer group border-b border-blue-500/10 last:border-b-0"
            >
              <div className={`w-10 h-10 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center flex-shrink-0`}>
                {item.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                  {item.value}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-0.5 transition-all duration-200" />
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-bold text-sm flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
          Tizimdan chiqish
        </button>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && createPortal(
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
                onClick={() => setShowPasswordModal(false)}
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

              {/* Submit / Cancel */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
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

export default ProfilePage;
