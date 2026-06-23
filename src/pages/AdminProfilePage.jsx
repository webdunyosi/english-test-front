import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  User, Phone, Edit2, Code2, Shield, Settings,
  Send, LogOut, ChevronRight, Lock, Eye, EyeOff, X,
  Users, FileQuestion, BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const AdminProfilePage = () => {
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

  const menuItems = [
    {
      icon: <Users className="w-5 h-5 text-purple-400" />,
      label: "O'quvchilarni boshqarish",
      bg: "bg-purple-500/15",
      border: "border-purple-500/20",
      onClick: () => navigate('/admin/users')
    },
    {
      icon: <FileQuestion className="w-5 h-5 text-violet-400" />,
      label: "Testlar va savollar",
      bg: "bg-violet-500/15",
      border: "border-violet-500/20",
      onClick: () => navigate('/admin/questions')
    },
    {
      icon: <Settings className="w-5 h-5 text-indigo-400" />,
      label: "Tizim sozlamalari",
      bg: "bg-indigo-500/15",
      border: "border-indigo-500/20",
      onClick: () => toast('Tez orada mavjud bo\'ladi!', { icon: '⚙️' })
    },
  ];

  const contactItems = [
    {
      icon: <Send className="w-5 h-5 text-sky-400" />,
      bg: "bg-sky-500/15",
      border: "border-sky-500/20",
      label: "DASTURCHI TELEGRAM",
      value: "@AlimardonToshpulatov",
      onClick: () => window.open('https://t.me/AlimardonToshpulatov', '_blank')
    },
    {
      icon: <Phone className="w-5 h-5 text-purple-400" />,
      bg: "bg-purple-500/15",
      border: "border-purple-500/20",
      label: "DASTURCHI TELEFON",
      value: "+998 50 950 95 45",
      onClick: () => window.open('tel:+998509509545', '_blank')
    },
  ];

  return (
    <>
      <div className="max-w-lg mx-auto px-0 pb-8 animate-fadeIn">

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-center mb-1 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
          Admin Kabinet
        </h1>
        <p className="text-center text-xs text-purple-400/60 font-semibold tracking-widest uppercase mb-6">
          Boshqaruv Paneli
        </p>

        {/* Admin Info Card */}
        <div
          className="rounded-2xl border border-purple-500/20 mb-4 p-4 flex items-center gap-4 relative"
          style={{ background: 'rgba(30, 10, 60, 0.7)', backdropFilter: 'blur(12px)' }}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center border-2 border-purple-400/60 shadow-lg shadow-purple-500/30 overflow-hidden">
              <Shield className="w-9 h-9 text-white" />
            </div>
            {/* Active indicator */}
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-purple-400 rounded-full border-2 border-[#090514]"></span>
          </div>

          {/* Admin Details */}
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-white truncate">
              {user?.username || 'Admin'}
            </p>
            <p className="text-sm text-purple-300/60 truncate">
              @{user?.username || '—'}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <span className="inline-block text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-purple-500/40 text-purple-400 bg-purple-500/10">
                ADMIN
              </span>
              <span className="inline-block text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-pink-500/40 text-pink-400 bg-pink-500/10">
                SUPER USER
              </span>
            </div>
          </div>

          {/* Edit / Change Password Button */}
          <button
            onClick={() => setShowPasswordModal(true)}
            className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 hover:text-white hover:bg-purple-500/20 hover:border-purple-400/40 transition-all duration-200 cursor-pointer"
            title="Parolni o'zgartirish"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "O'quvchilar", value: "—", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
            { label: "Testlar", value: "—", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
            { label: "Natijalar", value: "—", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`rounded-2xl border ${stat.border} ${stat.bg} p-3 text-center`}
              style={{ backdropFilter: 'blur(12px)' }}
            >
              <p className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Menu Items */}
        <div
          className="rounded-2xl border border-purple-500/20 mb-4 overflow-hidden"
          style={{ background: 'rgba(30, 10, 60, 0.7)', backdropFilter: 'blur(12px)' }}
        >
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-purple-500/5 transition-all duration-200 cursor-pointer group border-b border-purple-500/10 last:border-b-0"
            >
              <div className={`w-10 h-10 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center flex-shrink-0`}>
                {item.icon}
              </div>
              <span className="flex-1 text-left text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                {item.label}
              </span>
              <ChevronRight className="w-4 h-4 text-purple-500/50 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all duration-200" />
            </button>
          ))}
        </div>

        {/* Developer Contact Items */}
        <div
          className="rounded-2xl border border-purple-500/20 mb-4 overflow-hidden"
          style={{ background: 'rgba(30, 10, 60, 0.7)', backdropFilter: 'blur(12px)' }}
        >
          {/* Section label */}
          <div className="px-4 pt-3 pb-1">
            <div className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-purple-400/60" />
              <span className="text-[10px] font-bold tracking-widest text-purple-400/60 uppercase">
                Dasturchi aloqa
              </span>
            </div>
          </div>
          {contactItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-purple-500/5 transition-all duration-200 cursor-pointer group border-b border-purple-500/10 last:border-b-0"
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
              <ChevronRight className="w-4 h-4 text-purple-500/50 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all duration-200" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090514]/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full p-8 rounded-3xl border border-purple-500/20 shadow-[0_10px_50px_rgba(168,85,247,0.2)] animate-fadeIn"
            style={{ background: 'rgba(20, 5, 45, 0.95)', backdropFilter: 'blur(20px)' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
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
              {[
                { label: "Joriy Parol", value: currentPassword, onChange: setCurrentPassword, show: showCurrent, setShow: setShowCurrent, placeholder: "Hozirgi parolingiz..." },
                { label: "Yangi Parol", value: newPassword, onChange: setNewPassword, show: showNew, setShow: setShowNew, placeholder: "Yangi parol..." },
                { label: "Yangi Parolni Tasdiqlang", value: confirmPassword, onChange: setConfirmPassword, show: showConfirm, setShow: setShowConfirm, placeholder: "Yangi parolni takroran kiriting..." },
              ].map((field, i) => (
                <div key={i} className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type={field.show ? "text" : "password"}
                      required
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full pl-4 pr-12 py-3 bg-gray-900/80 border border-purple-500/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => field.setShow(!field.show)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-purple-400 transition-colors focus:outline-none cursor-pointer"
                    >
                      {field.show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ))}

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

export default AdminProfilePage;
