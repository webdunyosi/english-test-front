import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Trash2, Shield, Calendar, Users, CheckCircle, Search, RefreshCw, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminUsers = () => {
  const { token, API_BASE } = useAuth();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and tabs states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', or 'groups'
  const [groupInputs, setGroupInputs] = useState({}); // Stores group select input per user ID
  
  // Group creation & editing states
  const [newGroupName, setNewGroupName] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editGroupValue, setEditGroupValue] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

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

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/groups`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Guruhlarni yuklab bo\'lmadi');
      }
      const data = await response.json();
      setGroups(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, [token]);

  const handleRefreshAll = () => {
    fetchUsers();
    fetchGroups();
  };

  const handleApprove = async (userId) => {
    const groupName = groupInputs[userId]?.trim() || '';
    if (!groupName) {
      toast.error("Iltimos, tasdiqlashdan oldin guruhni tanlang!");
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

  const handleSaveGroupChange = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/users/${userId}/group`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ group: editGroupValue })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Guruhni o\'zgartirishda xatolik yuz berdi');
      }
      toast.success('O\'quvchi guruhi muvaffaqiyatli yangilandi!');
      setEditingUserId(null);
      fetchUsers();
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

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      toast.error('Guruh nomini kiriting');
      return;
    }
    setIsCreatingGroup(true);
    try {
      const response = await fetch(`${API_BASE}/api/admin/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newGroupName.trim() })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Guruh yaratishda xatolik yuz berdi');
      }
      toast.success('Guruh muvaffaqiyatli yaratildi!');
      setNewGroupName('');
      fetchGroups();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleDeleteGroup = async (groupId, name) => {
    if (!confirm(`"${name}" guruhini o'chirib tashlamoqchimisiz? Ushbu guruhdagi barcha o'quvchilar guruhsiz bo'lib qoladi.`)) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/api/admin/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Guruhni o\'chirishda xatolik yuz berdi');
      }
      toast.success('Guruh muvaffaqiyatli o\'chirildi!');
      fetchGroups();
      fetchUsers();
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
          onClick={handleRefreshAll}
          className="inline-flex items-center space-x-2 self-start py-2.5 px-4 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 rounded-xl transition-all duration-300 text-purple-300"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Yangilash</span>
        </button>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-purple-950/5 p-3 rounded-2xl border border-purple-500/10 backdrop-blur-md">
        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2">
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
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center space-x-2 ${
              activeTab === 'groups'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Guruhlar Boshqaruvi</span>
            <span className="bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-md text-xs">
              {groups.length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        {activeTab !== 'groups' && (
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
        )}
      </div>

      {/* Content */}
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
      ) : activeTab === 'groups' ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Create Group Form */}
          <form onSubmit={handleCreateGroup} className="flex gap-2 max-w-md bg-purple-950/5 p-4 rounded-2xl border border-purple-500/10 backdrop-blur-md">
            <input
              type="text"
              placeholder="Yangi guruh nomi..."
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="block w-full px-4 py-2.5 bg-gray-900/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              disabled={isCreatingGroup}
            />
            <button
              type="submit"
              disabled={isCreatingGroup}
              className="inline-flex items-center space-x-1.5 py-2.5 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0 disabled:opacity-50"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Yaratish</span>
            </button>
          </form>

          {/* Groups list */}
          {groups.length === 0 ? (
            <div className="text-center py-12 bg-purple-950/5 border border-purple-500/10 rounded-2xl">
              <p className="text-gray-400 text-sm">Hali hech qanday guruh yaratilmagan</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {groups.map((g) => {
                const memberCount = users.filter(u => u.isApproved && u.group === g.name).length;
                return (
                  <div 
                    key={g._id}
                    className="flex items-center justify-between p-5 bg-purple-950/5 rounded-2xl border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300 backdrop-blur-md"
                  >
                    <div>
                      <h4 className="font-bold text-white text-base">{g.name}</h4>
                      <p className="text-xs text-gray-400 mt-1">{memberCount} ta o'quvchi</p>
                    </div>
                    <button
                      onClick={() => handleDeleteGroup(g._id, g.name)}
                      className="p-2.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 text-red-400 rounded-xl transition-all duration-300"
                      title="Guruhni o'chirish"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-purple-950/5 border border-purple-500/10 rounded-3xl backdrop-blur-md">
          <p className="text-gray-400 text-lg">Bu bo'limda foydalanuvchilar topilmadi</p>
        </div>
      ) : (
        <div className="grid gap-4 animate-fadeIn">
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
                    {groups.length === 0 ? (
                      <span className="text-xs text-yellow-500/80 bg-yellow-500/10 border border-yellow-500/20 px-3 py-2.5 rounded-xl">
                        Avval guruh yarating!
                      </span>
                    ) : (
                      <select
                        value={groupInputs[u._id] || ''}
                        onChange={(e) => handleGroupInputChange(u._id, e.target.value)}
                        className="px-3.5 py-2.5 bg-gray-900/50 border border-purple-500/20 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm w-full sm:w-56 cursor-pointer"
                      >
                        <option value="" className="bg-gray-900 text-gray-500">Guruhni tanlang...</option>
                        {groups.map(g => (
                          <option key={g._id} value={g.name} className="bg-gray-900 text-white">{g.name}</option>
                        ))}
                      </select>
                    )}
                    <button
                      onClick={() => handleApprove(u._id)}
                      disabled={groups.length === 0}
                      className="inline-flex items-center space-x-1.5 py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0 disabled:opacity-50"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Tasdiqlash</span>
                    </button>
                  </div>
                )}

                {/* Approved badge / status indicator and group changer */}
                {u.isApproved && (
                  <div className="flex flex-wrap items-center gap-2">
                    {editingUserId === u._id ? (
                      <div className="flex items-center gap-1.5">
                        <select
                          value={editGroupValue}
                          onChange={(e) => setEditGroupValue(e.target.value)}
                          className="px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
                        >
                          <option value="">Guruhsiz (Chiqarish)</option>
                          {groups.map(g => (
                            <option key={g._id} value={g.name}>{g.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleSaveGroupChange(u._id)}
                          className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                        >
                          Saqlash
                        </button>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="px-3 py-2 bg-gray-800 border border-white/10 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-medium transition-all"
                        >
                          Bekor qilish
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="inline-flex items-center space-x-1 text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl text-sm font-semibold">
                          <CheckCircle className="w-4 h-4" />
                          <span>Faol</span>
                        </div>
                        <button
                          onClick={() => {
                            setEditingUserId(u._id);
                            setEditGroupValue(u.group || '');
                          }}
                          className="py-1.5 px-3 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 text-purple-300 rounded-xl text-xs font-bold transition-all duration-300"
                        >
                          Guruhni o'zgartirish
                        </button>
                      </>
                    )}
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
