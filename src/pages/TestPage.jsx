import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { BookOpen, ArrowLeft, ClipboardList, HelpCircle, Check, Loader2, Lock, Eye, EyeOff } from 'lucide-react';

const TestPage = () => {
  const { user, API_BASE } = useAuth();
  
  // Test selection states
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loadingTests, setLoadingTests] = useState(true);
  const [activeTab, setActiveTab] = useState('standard'); // 'standard' or 'olympiad'

  // Password modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [testToAccess, setTestToAccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Questions and taking test states
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Fetch unique test collections
  const fetchTests = async () => {
    setLoadingTests(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/tests`);
      if (!response.ok) {
        throw new Error('Testlar to\'plamini yuklab bo\'lmadi');
      }
      const data = await response.json();
      setTests(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoadingTests(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [API_BASE]);

  // Load questions for a selected test
  const handleStartTest = async (testName, pass = '') => {
    setLoadingQuestions(true);
    setError(null);
    setSelectedTest(testName);
    setScore(null);
    setUserAnswers({});
    setIsSaved(false);

    try {
      const passParam = pass ? `&password=${encodeURIComponent(pass)}` : '';
      const response = await fetch(`${API_BASE}/api/questions?testName=${encodeURIComponent(testName)}${passParam}`);
      
      if (response.status === 401) {
        const data = await response.json();
        throw new Error(data.message || 'Noto\'g\'ri parol!');
      }
      
      if (!response.ok) {
        throw new Error('Test savollarini yuklab bo\'lmadi');
      }
      const data = await response.json();
      setQuestions(data);
      setShowPasswordModal(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setSelectedTest(null);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleOptionSelect = (questionId, option) => {
    if (score !== null) return; // Prevent changing answers after submission
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async () => {
    let calculatedScore = 0;
    questions.forEach((q) => {
      if (userAnswers[q._id] === q.correctAnswer) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);

    if (!user) {
      toast.error("Natijani saqlash uchun tizimga kiring!");
      return;
    }
    if (!selectedTest) return;

    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE}/api/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: user.username,
          testName: selectedTest,
          score: calculatedScore,
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

  const handleGoBack = () => {
    setSelectedTest(null);
    setQuestions([]);
    setScore(null);
    setUserAnswers({});
    setIsSaved(false);
    fetchTests();
  };

  const handleTestClick = (test) => {
    if (test.isOlympiad && test.hasPassword) {
      setTestToAccess(test);
      setPasswordInput('');
      setShowPassword(false);
      setShowPasswordModal(true);
    } else {
      handleStartTest(test.name);
    }
  };

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white/5 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-center max-w-lg mx-auto mt-10">
          <strong className="font-bold">Xatolik: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <div className="text-center mt-6">
          <button 
            onClick={handleGoBack}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all duration-300 text-sm font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ortga Qaytish</span>
          </button>
        </div>
      </div>
    );
  }

  // Filter tests by standard vs olympiad
  const filteredTests = tests.filter(test => {
    if (activeTab === 'olympiad') return !!test.isOlympiad;
    return !test.isOlympiad;
  });

  // SCREEN 1: List of all tests to choose from
  if (!selectedTest) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 relative">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 mb-4 tracking-tight drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
            Ingliz Tili Testlar To'plami
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            O'zingizga ma'qul bo'lgan test to'plamini tanlang va ingliz tili darajangizni sinab ko'ring.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex space-x-1">
            <button
              onClick={() => setActiveTab('standard')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'standard'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Oddiy Testlar
            </button>
            <button
              onClick={() => setActiveTab('olympiad')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'olympiad'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🏆 Olimpiada Testlari
            </button>
          </div>
        </div>

        {loadingTests ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-panel rounded-3xl p-6 border border-white/5 animate-pulse h-48">
                <div className="h-6 bg-white/10 rounded-lg w-3/4 mb-4"></div>
                <div className="h-4 bg-white/10 rounded-lg w-1/2 mb-8"></div>
                <div className="h-10 bg-white/10 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center text-gray-400 max-w-lg mx-auto">
            <ClipboardList className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-lg font-medium">Hozircha hech qanday test mavjud emas.</p>
            <p className="text-sm text-gray-500 mt-1">Iltimos, admin tomonidan test savollari qo'shilishini kuting.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <div 
                key={test.name}
                className={`glass-panel rounded-3xl p-6 border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between ${
                  test.isOlympiad 
                    ? 'hover:border-purple-500/30 hover:shadow-[0_10px_30px_rgba(168,85,247,0.1)]' 
                    : 'hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)]'
                }`}
              >
                <div>
                  <div className={`p-3 border rounded-2xl w-fit mb-4 ${
                    test.isOlympiad 
                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
                      : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  }`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex items-start gap-2 flex-wrap mb-2">
                    <h3 className="text-xl font-bold text-white tracking-tight line-clamp-2">
                      {test.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-6">
                    Savollar soni: <span className={`${test.isOlympiad ? 'text-purple-400' : 'text-blue-400'} font-semibold`}>{test.questionCount} ta</span>
                  </p>
                </div>
                <button
                  onClick={() => handleTestClick(test)}
                  className={`w-full inline-flex justify-center items-center py-3 px-6 text-sm font-bold rounded-2xl text-white transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
                    test.isOlympiad
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 shadow-[0_4px_15px_rgba(168,85,247,0.2)]'
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-[0_4px_15px_rgba(37,99,235,0.2)]'
                  }`}
                >
                  {test.isOlympiad && test.hasPassword && <Lock className="w-4 h-4 mr-2" />}
                  <span>Testni Boshlash</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Password Verification Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090514]/80 backdrop-blur-md animate-fadeIn">
            <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-purple-500/20 shadow-[0_10px_50px_rgba(168,85,247,0.2)] animate-fadeIn">
              <h3 className="text-xl font-bold text-white mb-2">Olimpiada Testi</h3>
              <p className="text-sm text-gray-400 mb-6">
                "<span className="text-purple-400 font-semibold">{testToAccess?.name}</span>" testiga kirish uchun parolni kiriting:
              </p>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStartTest(testToAccess.name, passwordInput);
                }}
                className="space-y-4"
              >
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Parolni kiriting..."
                    className="w-full pl-4 pr-12 py-3 bg-gray-900 border border-purple-500/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-purple-400 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 py-3 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-bold rounded-2xl transition-all duration-300 cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold rounded-2xl shadow-[0_4px_15px_rgba(168,85,247,0.3)] transition-all duration-300 cursor-pointer"
                  >
                    Kirish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // SCREEN 2: Loading screen for question fetching
  if (loadingQuestions) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-gray-400 font-medium">Test savollari yuklanmoqda...</p>
      </div>
    );
  }

  // SCREEN 3: Taking the test
  const isOlympiadActive = tests.find(t => t.name === selectedTest)?.isOlympiad;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Back button and test title */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={handleGoBack}
          className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl transition-all duration-300 cursor-pointer"
          title="Testlar ro'yxatiga qaytish"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className={`text-xs uppercase font-extrabold tracking-widest ${isOlympiadActive ? 'text-purple-400' : 'text-blue-400'}`}>
            {isOlympiadActive ? 'OLIMPIADA REJIMI 🏆' : 'TEST REJIMI'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {selectedTest}
          </h1>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="glass-panel rounded-3xl p-8 text-center text-gray-400">
          Ushbu test to'plamida savollar mavjud emas.
        </div>
      ) : (
        <div className="space-y-8">
          {questions.map((q, index) => (
            <div key={q._id} className="glass-panel rounded-3xl p-8 border border-white/5 transition-all duration-300 hover:border-white/10">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-6">
                <span className={`mr-2 font-black ${isOlympiadActive ? 'text-purple-400' : 'text-blue-400'}`}>{index + 1}.</span>
                {q.question}
              </h3>
              <div className="space-y-3">
                {q.options.map((option, optIndex) => (
                  <label 
                    key={optIndex} 
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                      userAnswers[q._id] === option 
                        ? isOlympiadActive
                          ? 'border-purple-500 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                          : 'border-blue-500 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                        : 'border-white/10 hover:bg-white/5 hover:border-white/20'
                    } ${score !== null ? 'pointer-events-none' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`question-${q._id}`}
                      value={option}
                      checked={userAnswers[q._id] === option}
                      onChange={() => handleOptionSelect(q._id, option)}
                      className={`h-4 w-4 focus:ring-opacity-50 border-gray-600 bg-gray-800 cursor-pointer ${
                        isOlympiadActive ? 'text-purple-500 focus:ring-purple-500' : 'text-blue-500 focus:ring-blue-500'
                      }`}
                      disabled={score !== null}
                    />
                    <span className="ml-3 text-gray-300 font-medium">{option}</span>
                  </label>
                ))}
              </div>
              {score !== null && (
                <div className="mt-6">
                  {userAnswers[q._id] === q.correctAnswer ? (
                    <div className="text-green-400 bg-green-500/10 p-3.5 rounded-xl border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)] font-semibold text-sm">
                      ✅ To'g'ri javob!
                    </div>
                  ) : (
                    <div className="text-red-400 bg-red-500/10 p-3.5 rounded-xl border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)] text-sm">
                      ❌ Noto'g'ri. To'g'ri javob: <span className="font-bold text-red-300">{q.correctAnswer}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit button */}
      {questions.length > 0 && score === null && (
        <div className="mt-12 text-center">
          <button
            onClick={handleSubmit}
            className={`inline-flex justify-center py-3.5 px-10 border border-transparent text-lg font-bold rounded-2xl text-white transition-all duration-300 transform hover:scale-105 cursor-pointer ${
              isOlympiadActive
                ? 'shadow-[0_4px_20px_rgba(168,85,247,0.4)] bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400'
                : 'shadow-[0_4px_20px_rgba(37,99,235,0.4)] bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400'
            }`}
          >
            Javoblarni Yakunlash
          </button>
        </div>
      )}

      {/* Result Display & Save Result Box */}
      {score !== null && (
        <div className={`mt-12 glass-panel rounded-3xl p-8 text-center border-t-4 transform transition-all shadow-xl animate-fadeIn ${
          isOlympiadActive ? 'border-purple-500 shadow-purple-500/5' : 'border-blue-500 shadow-blue-500/5'
        }`}>
          <h2 className="text-3xl font-extrabold text-white mb-2 drop-shadow-md">Test Yakunlandi!</h2>
          <p className="text-xl text-gray-300 mb-6 font-medium">
            Sizning natijangiz: <span className={`font-black text-3xl ${isOlympiadActive ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`}>{score}</span> / {questions.length}
          </p>
          
          {isSaving ? (
            <div className="text-blue-400 font-bold mb-6 bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 text-base animate-pulse">
              Natija reytingga saqlanmoqda...
            </div>
          ) : isSaved ? (
            <div className="text-green-400 font-bold mb-6 bg-green-500/10 p-4 rounded-2xl border border-green-500/20 text-base">
              ✅ Natijangiz reytingga muvaffaqiyatli saqlandi!
            </div>
          ) : (
            <div className="text-red-400 font-bold mb-6 bg-red-500/10 p-4 rounded-2xl border border-red-500/20 text-base">
              ❌ Natijani saqlashda xatolik yuz berdi.
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <button
              onClick={() => {
                setScore(null);
                setUserAnswers({});
                setIsSaved(false);
              }}
              className="inline-flex justify-center items-center py-2.5 px-6 border border-white/20 shadow-sm text-sm font-bold rounded-2xl text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 focus:outline-none transition-all duration-300 cursor-pointer"
            >
              Qayta ishlash
            </button>
            <button
              onClick={handleGoBack}
              className="inline-flex justify-center items-center py-2.5 px-6 border border-blue-500/20 shadow-sm text-sm font-bold rounded-2xl text-blue-400 hover:text-blue-300 bg-blue-500/5 hover:bg-blue-500/10 focus:outline-none transition-all duration-300 cursor-pointer"
            >
              Boshqa test tanlash
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;
