import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const { API_BASE } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/results`);
        if (!response.ok) {
          throw new Error('Reytingni yuklab bo\'lmadi');
        }
        const data = await response.json();
        setResults(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchResults();
  }, [API_BASE]);

  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.15)] text-yellow-500'; // Gold
      case 1:
        return 'bg-gradient-to-r from-gray-300/20 to-gray-400/10 border-gray-300/50 shadow-[0_0_15px_rgba(209,213,219,0.1)] text-gray-300'; // Silver
      case 2:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/50 shadow-[0_0_15px_rgba(217,119,6,0.1)] text-amber-500'; // Bronze
      default:
        return 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300 text-gray-400';
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1: return <Medal className="w-6 h-6 text-gray-300" />;
      case 2: return <Award className="w-6 h-6 text-amber-500" />;
      default: return <span className="font-bold text-lg w-6 text-center">{index + 1}</span>;
    }
  };

  if (error) {
    return (
      <div className="bg-white/5 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
          <Trophy className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Reyting
        </h2>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div 
                key={n} 
                className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md animate-pulse"
              >
                <div className="flex items-center space-x-6">
                  <div className="h-6 w-6 bg-white/10 rounded-md"></div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/5"></div>
                    <div className="h-5 bg-white/10 rounded-lg w-32"></div>
                  </div>
                </div>
                <div className="h-8 bg-white/10 rounded-lg w-16"></div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-2xl">
            <p className="text-gray-400">Hali hech kim test ishlamagan</p>
          </div>
        ) : (
          results.map((result, index) => (
            <div 
              key={result._id} 
              className={`flex items-center justify-between p-4 rounded-2xl border backdrop-blur-md ${getRankStyle(index)}`}
            >
              <div className="flex items-center space-x-6">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(index)}
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/5 overflow-hidden">
                    <User className="w-5 h-5 text-gray-300" />
                  </div>
                  <span className="font-semibold text-lg text-white">
                    {result.userName}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-white">{result.score}</span>
                <span className="text-sm font-medium opacity-80 mt-1">Ball</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
