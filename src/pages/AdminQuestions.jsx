import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { FilePlus, Trash2, HelpCircle, Check, Plus, AlertCircle, RefreshCw, ChevronDown, Lock, Eye, EyeOff, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminQuestions = () => {
  const { token, API_BASE } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [existingTests, setExistingTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [testName, setTestName] = useState('');
  const [isOlympiad, setIsOlympiad] = useState(false);
  const [password, setPassword] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Accordion expanded state per test name
  const [expandedTests, setExpandedTests] = useState({});

  // Settings modal states
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsTestName, setSettingsTestName] = useState('');
  const [settingsIsOlympiad, setSettingsIsOlympiad] = useState(false);
  const [settingsPassword, setSettingsPassword] = useState('');
  const [showSettingsPassword, setShowSettingsPassword] = useState(false);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  const openSettingsModal = (name, isOlympiadVal, passwordVal) => {
    setSettingsTestName(name);
    setSettingsIsOlympiad(!!isOlympiadVal);
    setSettingsPassword(passwordVal || '');
    setShowSettingsPassword(false);
    setShowSettingsModal(true);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (settingsIsOlympiad && !settingsPassword.trim()) {
      toast.error("Olimpiada testi uchun parol kiritilishi shart!");
      return;
    }

    setIsUpdatingSettings(true);
    try {
      const response = await fetch(`${API_BASE}/api/admin/tests/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          testName: settingsTestName,
          isOlympiad: settingsIsOlympiad,
          password: settingsIsOlympiad ? settingsPassword.trim() : ''
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Test sozlamalarini saqlashda xatolik yuz berdi");
      }

      toast.success("Test sozlamalari muvaffaqiyatli saqlandi!");
      setShowSettingsModal(false);
      fetchQuestions();
      fetchTests();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const fetchTests = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/tests`);
      if (response.ok) {
        const data = await response.json();
        setExistingTests(data.map(t => t.name));
      }
    } catch (err) {
      console.error("Error fetching test list:", err);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/questions`);
      if (!response.ok) {
        throw new Error('Savollarni yuklab bo\'lmadi');
      }
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchTests();
  }, []);

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;
    if (showSettingsModal) {
      mainElement.style.overflow = 'hidden';
    } else {
      mainElement.style.overflow = '';
    }
    return () => {
      mainElement.style.overflow = '';
    };
  }, [showSettingsModal]);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!testName.trim()) {
      setFormError('Test nomini kiriting!');
      return;
    }
    if (isOlympiad && !password.trim()) {
      setFormError('Olimpiada testi uchun kirish parolini kiriting!');
      return;
    }
    if (!questionText.trim()) {
      setFormError('Savol matnini kiriting!');
      return;
    }
    if (options.some(opt => !opt.trim())) {
      setFormError('Barcha javob variantlarini to\'ldiring!');
      return;
    }
    if (!correctAnswer) {
      setFormError('To\'g\'ri javobni tanlang!');
      return;
    }
    if (!options.includes(correctAnswer)) {
      setFormError('To\'g\'ri javob kiritilgan variantlardan biri bo\'lishi kerak!');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          testName: testName.trim(),
          isOlympiad,
          password: isOlympiad ? password.trim() : '',
          question: questionText.trim(),
          options: options.map(o => o.trim()),
          correctAnswer: correctAnswer.trim()
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Savol qo\'shishda xatolik yuz berdi');
      }

      // Reset form (except test name, as we want to add questions to the same test category sequentially)
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
      
      // Refresh list & test names
      fetchQuestions();
      fetchTests();
      toast.success('Savol muvaffaqiyatli qo\'shildi!');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!confirm('Ushbu savolni butunlay o\'chirib tashlamoqchimisiz?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/questions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Savolni o\'chirishda xatolik yuz berdi');
      }

      fetchQuestions();
      fetchTests();
      toast.success('Savol muvaffaqiyatli o\'chirildi!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleTestExpand = (name) => {
    setExpandedTests(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Group questions by testName dynamically
  const groupedQuestions = {};
  questions.forEach(q => {
    const name = q.testName || 'General Test';
    if (!groupedQuestions[name]) {
      groupedQuestions[name] = [];
    }
    groupedQuestions[name].push(q);
  });

  const groupedNames = Object.keys(groupedQuestions).sort();

  const getLatestDate = (qList) => {
    if (!qList || qList.length === 0) return '';
    const dates = qList.map(q => new Date(q.createdAt || q.updatedAt || Date.now()));
    const latest = new Date(Math.max(...dates));
    return latest.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
            Testlar Boshqaruvi
          </h1>
          <p className="text-gray-400 text-sm mt-1">Yangi ingliz tili savollarini qo'shing va mavjud savollar ro'yxatini boshqaring.</p>
        </div>

        <button 
          onClick={() => { fetchQuestions(); fetchTests(); }}
          className="inline-flex items-center space-x-2 self-start py-2.5 px-4 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 rounded-xl transition-all duration-300 text-purple-300"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Yangilash</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form panel */}
        <div className="lg:col-span-1 glass-panel p-8 rounded-3xl border border-purple-500/10 backdrop-blur-md h-fit">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 bg-purple-500/15 rounded-xl border border-purple-500/25 text-purple-400">
              <FilePlus className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Savol Qo'shish</h2>
          </div>

          {formError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-sm mb-6 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleAddQuestion} className="space-y-5">
            {/* Test Name (Category) */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Test Nomi (Turi)
              </label>
              <input
                type="text"
                required
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Masalan: Unit 1 Test, Intermediate Test"
                className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm"
              />
            </div>

            {/* Olympiad Test Toggle */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isOlympiad}
                  onChange={(e) => {
                    setIsOlympiad(e.target.checked);
                    if (!e.target.checked) setPassword('');
                  }}
                  className="h-4.5 w-4.5 text-purple-600 focus:ring-purple-500 border-purple-500/30 rounded bg-gray-900 cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-300">Olimpiada Testi</span>
              </label>

              {isOlympiad && (
                <div className="animate-fadeIn">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Testga Kirish Paroli
                  </label>
                  <input
                    type="text"
                    required={isOlympiad}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parolni kiriting (masalan: olimpiada123)"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm"
                  />
                </div>
              )}
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Savol matni
              </label>
              <textarea
                required
                rows="3"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Savolni kiriting... (masalan: What is the past tense of 'go'?)"
                className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 resize-none text-sm"
              />
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Javob variantlari
              </label>
              
              {options.map((opt, index) => (
                <div key={index} className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-400 font-bold text-sm">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <input
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Variant ${String.fromCharCode(65 + index)}`}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-purple-500/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm"
                  />
                </div>
              ))}
            </div>

            {/* Correct Answer Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                To'g'ri javobni tanlang
              </label>
              <select
                required
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-purple-500/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm cursor-pointer"
              >
                <option value="">-- Tanlang --</option>
                {options.map((opt, index) => (
                  opt.trim() && (
                    <option key={index} value={opt}>
                      {String.fromCharCode(65 + index)}: {opt}
                    </option>
                  )
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>{isSubmitting ? 'Qo\'shilmoqda...' : 'Savolni Qo\'shish'}</span>
            </button>
          </form>
        </div>

        {/* Questions List panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Mavjud Testlar To'plami ({groupedNames.length})</h2>
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-20 rounded-2xl bg-purple-950/5 border border-purple-500/10"></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center">
              {error}
            </div>
          ) : groupedNames.length === 0 ? (
            <div className="text-center py-16 bg-purple-950/5 border border-purple-500/10 rounded-3xl backdrop-blur-md">
              <p className="text-gray-400 text-lg">Hozircha hech qanday savol qo'shilmagan.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              {groupedNames.map((name) => {
                const qList = groupedQuestions[name];
                const isExpanded = !!expandedTests[name];
                const latestDate = getLatestDate(qList);
                const isTestOlympiad = qList[0]?.isOlympiad;

                return (
                  <div key={name} className="space-y-2">
                    {/* Collapsible Header */}
                    <div 
                      onClick={() => toggleTestExpand(name)}
                      className="glass-panel p-5 rounded-2xl border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300 backdrop-blur-md flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
                          <HelpCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-white leading-tight">{name}</h3>
                            {isTestOlympiad && (
                              <span className="text-[10px] px-2 py-0.5 bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 rounded-full font-bold uppercase tracking-wider">
                                🏆 Olimpiada
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Yangilandi: <span className="text-gray-300 font-semibold">{latestDate}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-xs px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full font-bold">
                          {qList.length} ta savol
                        </span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 transform ${isExpanded ? 'rotate-180 text-purple-400' : ''}`} />
                      </div>
                    </div>

                    {/* Collapsible Content */}
                    {isExpanded && (
                      <div className="pl-4 space-y-3 py-1 animate-fadeIn">
                        {/* Test settings panel */}
                        <div className="bg-purple-950/10 border border-purple-500/10 p-4 rounded-2xl mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-semibold text-gray-300">Test turi:</span>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                              isTestOlympiad 
                                ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400' 
                                : 'bg-gray-500/10 border border-gray-500/20 text-gray-400'
                            }`}>
                              {isTestOlympiad ? '🏆 Olimpiada' : 'Oddiy Test'}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => openSettingsModal(name, isTestOlympiad, qList[0]?.password || '')}
                            className="py-2 px-4 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 text-purple-300 hover:text-white rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer"
                          >
                            Sozlamalar & Parolni o'zgartirish
                          </button>
                        </div>

                        {qList.map((q, idx) => (
                          <div 
                            key={q._id} 
                            className="bg-purple-950/5 border border-purple-500/5 hover:border-purple-500/15 p-5 rounded-2xl backdrop-blur-md flex justify-between items-start gap-4 transition-all duration-300 animate-fadeIn"
                          >
                            <div className="space-y-4 flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-purple-400 font-bold text-base">{idx + 1}.</span>
                              </div>
                              <h4 className="text-base font-bold text-white">
                                {q.question}
                              </h4>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {q.options.map((opt, oIdx) => {
                                  const isCorrect = opt === q.correctAnswer;
                                  return (
                                    <div 
                                      key={oIdx}
                                      className={`flex items-center p-3 rounded-xl border text-xs ${
                                        isCorrect 
                                          ? 'bg-purple-500/15 border-purple-500/30 text-purple-300 font-semibold' 
                                          : 'bg-white/5 border-white/5 text-gray-400'
                                      }`}
                                    >
                                      <span className="font-bold mr-2 text-[10px]">{String.fromCharCode(65 + oIdx)}.</span>
                                      <span className="flex-1 truncate">{opt}</span>
                                      {isCorrect && <Check className="w-4 h-4 text-purple-400 shrink-0 ml-2" />}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteQuestion(q._id)}
                              className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 text-red-400 rounded-xl transition-all duration-300 mt-1 shrink-0 cursor-pointer"
                              title="Savolni o'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Test Settings Modal */}
      {showSettingsModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090514]/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-purple-500/20 shadow-[0_10px_50px_rgba(168,85,247,0.2)] animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Test Sozlamalari</h3>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Test Nomi
                </label>
                <input
                  type="text"
                  disabled
                  value={settingsTestName}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-white/5 rounded-2xl text-gray-400 text-sm cursor-not-allowed"
                />
              </div>

              {/* Olympiad Test Toggle */}
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settingsIsOlympiad}
                    onChange={(e) => {
                      setSettingsIsOlympiad(e.target.checked);
                      if (!e.target.checked) setSettingsPassword('');
                    }}
                    className="h-4.5 w-4.5 text-purple-600 focus:ring-purple-500 border-purple-500/30 rounded bg-gray-900 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-gray-300">Olimpiada Testi</span>
                </label>

                {settingsIsOlympiad && (
                  <div className="animate-fadeIn">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Testga Kirish Paroli
                    </label>
                    <div className="relative">
                      <input
                        type={showSettingsPassword ? "text" : "password"}
                        required={settingsIsOlympiad}
                        value={settingsPassword}
                        onChange={(e) => setSettingsPassword(e.target.value)}
                        placeholder="Parolni kiriting..."
                        className="w-full pl-4 pr-12 py-3 bg-gray-900 border border-purple-500/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowSettingsPassword(!showSettingsPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-purple-400 transition-colors focus:outline-none cursor-pointer"
                      >
                        {showSettingsPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 py-3 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-bold rounded-2xl transition-all duration-300 cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingSettings}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold rounded-2xl shadow-[0_4px_15px_rgba(168,85,247,0.3)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
                >
                  {isUpdatingSettings ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default AdminQuestions;

