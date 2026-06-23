import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, TestTube2, UserCheck, ArrowLeft, RefreshCw, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY = 'notif_seen_ids';

const NotificationsPage = () => {
  const { token, API_BASE } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getSeenIds = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    if (!API_BASE || !token) return;
    if (isRefresh) setRefreshing(true);
    try {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const res = await fetch(`${API_BASE}/api/notifications?since=${since}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data);

      // Auto-mark all as read when page is opened
      const allIds = data.map(n => n.id);
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set([...existing, ...allIds])]));
    } catch (err) {
      console.error('Notification fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [API_BASE, token]);


  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllRead = () => {
    const allIds = notifications.map(n => n.id);
    const existing = getSeenIds();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set([...existing, ...allIds])]));
    // Force re-render
    setNotifications(prev => [...prev]);
  };

  const seenIds = getSeenIds();
  const unreadCount = notifications.filter(n => !seenIds.includes(n.id)).length;

  const formatTime = (isoStr) => {
    try {
      const d = new Date(isoStr);
      const now = new Date();
      const diffMs = now - d;
      const diffMin = Math.floor(diffMs / 60000);
      const diffHr = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHr / 24);

      if (diffMin < 1) return 'Hozir';
      if (diffMin < 60) return `${diffMin} daqiqa oldin`;
      if (diffHr < 24) return `${diffHr} soat oldin`;
      if (diffDay < 7) return `${diffDay} kun oldin`;
      return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: '2-digit' });
    } catch { return ''; }
  };

  return (
    <div className="min-h-full flex flex-col animate-fadeIn">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer md:hidden"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Bildirishnomalar</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-blue-400/80 mt-0.5">
                {unreadCount} ta yangi xabar
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh */}
          <button
            onClick={() => fetchNotifications(true)}
            disabled={refreshing}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer disabled:opacity-50"
            title="Yangilash"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Mark all read */}
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 text-xs font-semibold transition-all duration-200 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Barchasini o'qildi
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        /* Skeleton loader */
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 animate-pulse">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-white/10 rounded-lg w-2/3" />
                <div className="h-3 bg-white/10 rounded-lg w-1/2" />
                <div className="h-2.5 bg-white/5 rounded-lg w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Bell className="w-9 h-9 text-blue-400/40" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold mb-1">Bildirishnomalar yo'q</p>
            <p className="text-sm text-gray-500">Yangi test yoki o'quvchi qo'shilganda bu yerda ko'rinadi</p>
          </div>
        </div>
      ) : (
        /* Notification list */
        <div className="space-y-2">
          {/* Unread section */}
          {notifications.some(n => !seenIds.includes(n.id)) && (
            <>
              <p className="text-[10px] font-bold tracking-widest text-blue-400/60 uppercase px-1 mb-3">
                Yangi xabarlar
              </p>
              {notifications.filter(n => !seenIds.includes(n.id)).map(notif => (
                <NotifCard key={notif.id} notif={notif} isUnread={true} formatTime={formatTime} />
              ))}
            </>
          )}

          {/* Read section */}
          {notifications.some(n => seenIds.includes(n.id)) && (
            <>
              <p className="text-[10px] font-bold tracking-widest text-gray-600 uppercase px-1 mt-5 mb-3">
                O'qilgan xabarlar
              </p>
              {notifications.filter(n => seenIds.includes(n.id)).map(notif => (
                <NotifCard key={notif.id} notif={notif} isUnread={false} formatTime={formatTime} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const NotifCard = ({ notif, isUnread, formatTime }) => (
  <div
    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 ${
      isUnread
        ? 'bg-blue-500/8 border-blue-500/20 shadow-[0_2px_12px_rgba(59,130,246,0.08)]'
        : 'bg-white/3 border-white/5'
    }`}
  >
    {/* Icon */}
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
      notif.type === 'test'
        ? 'bg-blue-500/15 border border-blue-500/25'
        : 'bg-indigo-500/15 border border-indigo-500/25'
    }`}>
      {notif.type === 'test'
        ? <TestTube2 className="w-5 h-5 text-blue-400" />
        : <UserCheck className="w-5 h-5 text-indigo-400" />
      }
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-bold ${isUnread ? 'text-white' : 'text-gray-400'}`}>
        {notif.title}
      </p>
      <p className={`text-sm mt-0.5 truncate ${isUnread ? 'text-gray-300' : 'text-gray-500'}`}>
        {notif.body}
      </p>
      <p className="text-[11px] text-gray-600 mt-1.5">{formatTime(notif.time)}</p>
    </div>

    {/* Unread dot */}
    {isUnread && (
      <div className="w-2.5 h-2.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
    )}
  </div>
);

export default NotificationsPage;
