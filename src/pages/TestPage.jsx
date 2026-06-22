import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const TestPage = () => {
  const { user, API_BASE } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/questions`);
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [API_BASE]);

  const handleOptionSelect = (questionId, option) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach((q) => {
      if (userAnswers[q._id] === q.correctAnswer) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
  };

  const saveResult = async () => {
    if (!user) {
      toast.error("Natijani saqlash uchun tizimga kiring!");
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE}/api/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: user.username,
          score,
          totalQuestions: questions.length,
        }),
      });

      if (!response.ok) {
        throw new Error("Natijani saqlashda xatolik yuz berdi");
      }

      setIsSaved(true);
      toast.success("Natijangiz muvaffaqiyatli saqlandi!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <div className="bg-white/5 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-center max-w-lg mx-auto mt-10">
        <strong className="font-bold">Xatolik: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 mb-4 tracking-tight drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
          English Proficiency Test
        </h1>
        <p className="text-lg text-gray-400">Answer the following questions to test your English skills.</p>
      </div>

      {loading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel rounded-2xl p-8 border border-white/5 animate-pulse">
              <div className="h-7 bg-white/10 rounded-lg w-3/4 mb-6"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((o) => (
                  <div key={o} className="h-14 bg-white/5 border border-white/10 rounded-xl flex items-center px-4">
                    <div className="h-4 w-4 bg-white/10 rounded-full mr-3"></div>
                    <div className="h-4 bg-white/10 rounded-lg w-1/3"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="glass-panel rounded-2xl p-8 text-center text-gray-400">
          No questions available. Please add some questions from the backend.
        </div>
      ) : (
        <div className="space-y-8">
          {questions.map((q, index) => (
            <div key={q._id} className="glass-panel rounded-2xl p-8 transition-all duration-300 hover:border-white/20">
              <h3 className="text-xl font-semibold text-white mb-6">
                <span className="text-blue-400 mr-2 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">{index + 1}.</span>
                {q.question}
              </h3>
              <div className="space-y-3">
                {q.options.map((option, optIndex) => (
                  <label 
                    key={optIndex} 
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                      userAnswers[q._id] === option 
                        ? 'border-blue-500 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                        : 'border-white/10 hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${q._id}`}
                      value={option}
                      checked={userAnswers[q._id] === option}
                      onChange={() => handleOptionSelect(q._id, option)}
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 bg-gray-800"
                      disabled={score !== null}
                    />
                    <span className="ml-3 text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
              {score !== null && (
                <div className="mt-6 p-4 rounded-xl text-sm font-medium">
                  {userAnswers[q._id] === q.correctAnswer ? (
                    <div className="text-green-400 bg-green-500/10 p-3 rounded-lg border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                      ✅ Correct!
                    </div>
                  ) : (
                    <div className="text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                      ❌ Incorrect. The correct answer is: <span className="font-bold text-red-300">{q.correctAnswer}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {questions.length > 0 && score === null && (
        <div className="mt-12 text-center">
          <button
            onClick={handleSubmit}
            className="inline-flex justify-center py-3 px-8 border border-transparent shadow-[0_0_20px_rgba(37,99,235,0.4)] text-lg font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 focus:outline-none transition-all duration-300 transform hover:scale-105"
          >
            Submit Answers
          </button>
        </div>
      )}

      {score !== null && (
        <div className="mt-12 glass-panel rounded-2xl p-8 text-center border-t-4 border-blue-500 transform transition-all shadow-[0_0_30px_rgba(59,130,246,0.15)]">
          <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">Test Yakunlandi!</h2>
          <p className="text-xl text-gray-300 mb-6">
            Sizning natijangiz: <span className="font-extrabold text-blue-400 text-2xl drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">{score}</span> / {questions.length}
          </p>
          
          {!isSaved ? (
            <div className="max-w-sm mx-auto space-y-4">
              <p className="text-gray-400 text-sm">
                Natijangizni <span className="font-semibold text-blue-400">{user?.username}</span> nomi bilan reytingga qo'shasizmi?
              </p>
              <button
                onClick={saveResult}
                disabled={isSaving}
                className="w-full inline-flex justify-center py-3 px-6 shadow-[0_0_15px_rgba(34,197,94,0.3)] text-base font-bold rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 focus:outline-none disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-1"
              >
                {isSaving ? "Saqlanmoqda..." : "Ha, Reytingga Qo'shish"}
              </button>
            </div>
          ) : (
            <div className="text-green-400 font-medium mb-6 bg-green-500/10 p-4 rounded-xl border border-green-500/20">
              ✅ Natijangiz muvaffaqiyatli saqlandi!
            </div>
          )}

          <button
            onClick={() => {
              setScore(null);
              setUserAnswers({});
              setIsSaved(false);
            }}
            className="mt-6 inline-flex justify-center py-2 px-6 border border-white/20 shadow-sm text-base font-medium rounded-xl text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 focus:outline-none transition-all duration-300"
          >
            Qayta ishlash
          </button>
        </div>
      )}
    </div>
  );
};

export default TestPage;
