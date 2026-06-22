import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Trash2, Shield, Calendar, Users, CheckCircle, Search, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminUsers = () => {
  const { token, API_BASE } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and tabs states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'
  const [groupInputs, setGroupInputs] = useState({}); // Stores group text input per user ID

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('O\'quvchilar ro\'yxatini yuklab bo\'lmadi');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleApprove = async (userId) => {
    const groupName = groupInputs[userId]?.trim() || '';
    if (!groupName) {
      toast.error("Iltimos, tasdiqlashdan oldin guruh nomini kiriting (masalan: IELTS 7.0, Intermediate)!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/admin/users/${userId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ group: groupName })
      });

      if (!response.ok) {
        throw new Error('Tasdiqlashda xatolik yuz berdi');
      }

      // Refresh list
      fetchUsers();
      toast.success("O'quvchi muvaffaqiyatli tasdiqlandi va guruhga qo'shildi!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (userId, username) => {
    if (!confirm(`${username} o'quvchini butunlay o'chirib tashlamoqchimisiz?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'O\'chirishda xatolik yuz berdi');
      }

      fetchUsers();
      toast.success("O'quvchi muvaffaqiyatli o'chirildi!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGroupInputChange = (userId, value) => {
    setGroupInputs(prev => ({
      ...prev,
      [userId]: value
    }));
  };

  // Filter users based on search term and active tab
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (u.group && u.group.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Ignore main admin
    if (u.username.toLowerCase() === 'admin') return false;

    if (activeTab === 'pending') {
      return matchesSearch && !u.isApproved;
    } else {
      return matchesSearch && u.isApproved;
    }
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
            O'quvchilar Boshqaruvi
          </h1>
          <p className="text-gray-400 text-sm mt-1">Yangi o'quvchilarni tasdiqlang, guruhlarga ajrating va hisoblarni boshqaring.</p>
        </div>

        <button 
          onClick={fetchUsers}
          className="inline-flex items-center space-x-2 self-start py-2.5 px-4 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 rounded-xl transition-all duration-300 text-purple-300"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Yangilash</span>
        </button>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-purple-950/5 p-3 rounded-2xl border border-purple-500/10 backdrop-blur-md">
        {/* Tab Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center space-x-2 ${
              activeTab === 'pending'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Kutilayotganlar</span>
            <span className="bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-md text-xs">
              {users.filter(u => !u.isApproved && u.username.toLowerCase() !== 'admin').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center space-x-2 ${
              activeTab === 'approved'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Tasdiqlanganlar</span>
            <span className="bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-md text-xs">
              {users.filter(u => u.isApproved && u.username.toLowerCase() !== 'admin').length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="O'quvchi yoki guruh bo'yicha qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-purple-500/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm"
          />
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-24 rounded-2xl bg-purple-950/5 border border-purple-500/10 animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center">
          {error}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-purple-950/5 border border-purple-500/10 rounded-3xl backdrop-blur-md">
          <p className="text-gray-400 text-lg">Bu bo'limda foydalanuvchilar topilmadi</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((u) => (
            <div 
              key={u._id}
              className="flex flex-col lg:flex-row lg:items-center justify-between p-6 bg-purple-950/5 rounded-2xl border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300 backdrop-blur-md gap-4"
            >
              {/* User details */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-extrabold text-lg">
                  {u.username[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <span>{u.username}</span>
                    {u.role === 'admin' && (
                      <span className="bg-purple-500/20 text-purple-300 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-purple-500/30">
                        Admin
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span>Ro'yxatdan o'tdi: {new Date(u.createdAt).toLocaleDateString()}</span>
                    </span>
                    {u.isApproved && (
                      <span className="flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-purple-300 font-semibold">Guruh: {u.group || 'Guruhsiz'}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
                {/* Approval / Group assignment form for pending */}
                {!u.isApproved && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Guruh nomi (masalan: IELTS 7.0)"
                      value={groupInputs[u._id] || ''}
                      onChange={(e) => handleGroupInputChange(u._id, e.target.value)}
                      className="px-3.5 py-2.5 bg-gray-900/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm w-full sm:w-56"
                    />
                    <button
                      onClick={() => handleApprove(u._id)}
                      className="inline-flex items-center space-x-1.5 py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Tasdiqlash</span>
                    </button>
                  </div>
                )}

                {/* Approved badge / status indicator */}
                {u.isApproved && (
                  <div className="inline-flex items-center space-x-1 text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl text-sm font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    <span>Faol</span>
                  </div>
                )}

                {/* Delete / Reject button */}
                <button
                  onClick={() => handleDelete(u._id, u.username)}
                  className="p-2.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 text-red-400 rounded-xl transition-all duration-300"
                  title="O'chirish"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
