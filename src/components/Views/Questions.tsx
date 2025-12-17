import { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle, Brain, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, PsychologyQuestion } from '../../lib/supabase';

export function Questions() {
  const { profile } = useAuth();
  const [questions, setQuestions] = useState<PsychologyQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [categoryScores, setCategoryScores] = useState<Record<string, { score: number; total: number }>>({});

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('psychology_questions')
        .select('*')
        .order('order_num');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (value: number) => {
    const currentQuestion = questions[currentIndex];
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      await submitAnswers();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const submitAnswers = async () => {
    if (!profile) return;

    try {
      const answersToInsert = questions.map((q) => ({
        user_id: profile.id,
        question_id: q.id,
        answer: answers[q.id]?.toString() || '0',
        score: answers[q.id] || 0,
      }));

      const { error } = await supabase
        .from('user_answers')
        .insert(answersToInsert);

      if (error) throw error;

      calculateResults();
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  const calculateResults = () => {
    const scores: Record<string, { score: number; total: number }> = {};

    questions.forEach((q) => {
      if (!scores[q.category]) {
        scores[q.category] = { score: 0, total: 0 };
      }
      scores[q.category].score += answers[q.id] || 0;
      scores[q.category].total += q.options.max;
    });

    setCategoryScores(scores);
  };

  const getScoreLevel = (percentage: number) => {
    if (percentage >= 80) return { level: 'Excelente', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (percentage >= 60) return { level: 'Bueno', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (percentage >= 40) return { level: 'Moderado', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Necesita Atención', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Evaluación Completada</h2>
              <p className="text-gray-600">Aquí están tus resultados</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {Object.entries(categoryScores).map(([category, { score, total }]) => {
              const percentage = (score / total) * 100;
              const { level, color, bgColor } = getScoreLevel(percentage);

              return (
                <div key={category} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 capitalize">
                      {category}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${color}`}>
                      {level}
                    </span>
                  </div>
                  <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-cyan-600 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Puntuación: {score} / {total} ({percentage.toFixed(0)}%)
                  </p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              setShowResults(false);
              setCurrentIndex(0);
              setAnswers({});
            }}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md"
          >
            Realizar Nueva Evaluación
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentAnswer = answers[currentQuestion?.id];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6">
          <div className="flex items-center justify-between text-white mb-2">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6" />
              <span className="font-semibold">Evaluación Psicológica</span>
            </div>
            <span className="text-sm">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full h-2 bg-teal-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <div className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4 capitalize">
              {currentQuestion?.category}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {currentQuestion?.question}
            </h3>
          </div>

          <div className="space-y-3 mb-8">
            {currentQuestion?.options.labels.map((label: string, index: number) => {
              const value = index + 1;
              const isSelected = currentAnswer === value;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(value)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50 shadow-md'
                      : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{label}</span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-teal-500 bg-teal-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              disabled={!currentAnswer}
              className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>{currentIndex === questions.length - 1 ? 'Finalizar' : 'Siguiente'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
