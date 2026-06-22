import { useState, useEffect } from 'react';

const TestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/questions');
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
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">English Proficiency Test</h1>
          <p className="text-lg text-gray-600">Answer the following questions to test your English skills.</p>
        </div>

        {questions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-500">
            No questions available. Please add some questions from the backend.
          </div>
        ) : (
          <div className="space-y-8">
            {questions.map((q, index) => (
              <div key={q._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  <span className="text-blue-500 mr-2">{index + 1}.</span>
                  {q.question}
                </h3>
                <div className="space-y-3">
                  {q.options.map((option, optIndex) => (
                    <label 
                      key={optIndex} 
                      className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors duration-200 ${
                        userAnswers[q._id] === option 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q._id}`}
                        value={option}
                        checked={userAnswers[q._id] === option}
                        onChange={() => handleOptionSelect(q._id, option)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        disabled={score !== null}
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
                {score !== null && (
                  <div className="mt-6 p-4 rounded-xl text-sm font-medium">
                    {userAnswers[q._id] === q.correctAnswer ? (
                      <div className="text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                        ✅ Correct!
                      </div>
                    ) : (
                      <div className="text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
                        ❌ Incorrect. The correct answer is: <span className="font-bold">{q.correctAnswer}</span>
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
              className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-lg font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              Submit Answers
            </button>
          </div>
        )}

        {score !== null && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 text-center border-t-4 border-blue-500 transform transition-all">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Complete!</h2>
            <p className="text-xl text-gray-600">
              Your score: <span className="font-extrabold text-blue-600">{score}</span> out of {questions.length}
            </p>
            <button
              onClick={() => {
                setScore(null);
                setUserAnswers({});
              }}
              className="mt-6 inline-flex justify-center py-2 px-6 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              Retake Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
