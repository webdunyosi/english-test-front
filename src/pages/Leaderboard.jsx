import { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/results');
        if (!response.ok) {
          throw new Error('Reytingni yuklab bo\'lmadi');
        }
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-medium">
        Xatolik yuz berdi: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">🏆 Kuchlilar Reytingi</h2>
        <p className="mt-2 text-lg text-gray-600">Eng yuqori ball to'plagan ishtirokchilar</p>
      </div>

      {results.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm">
          Hali hech kim test ishlamadi. Birinchi bo'ling!
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">O'rin</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ishtirokchi</th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Natija</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Sana</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result, index) => (
                <tr key={result._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-gray-200 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{result.userName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-bold text-blue-600">
                      {result.score} <span className="text-gray-400 font-normal">/ {result.totalQuestions}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    {new Date(result.date).toLocaleDateString('uz-UZ', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
