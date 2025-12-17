import { useState, useEffect } from 'react';
import { Heart, TrendingUp, Award, Smile } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const moodEmojis = {
  excelente: { emoji: '😄', color: 'from-green-500 to-emerald-600', label: 'Excelente' },
  bien: { emoji: '😊', color: 'from-blue-500 to-cyan-600', label: 'Bien' },
  neutral: { emoji: '😐', color: 'from-gray-500 to-slate-600', label: 'Neutral' },
  bajo: { emoji: '😔', color: 'from-yellow-500 to-orange-600', label: 'Bajo' },
  mal: { emoji: '😢', color: 'from-red-500 to-rose-600', label: 'Mal' },
};

export function Home() {
  const { profile, updateProfile } = useAuth();
  const [stats, setStats] = useState({
    completedGames: 0,
    answeredQuestions: 0,
    daysActive: 1,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    if (!profile) return;

    const [gamesResult, questionsResult] = await Promise.all([
      supabase
        .from('user_progress')
        .select('*', { count: 'exact' })
        .eq('user_id', profile.id)
        .eq('completed', true),
      supabase
        .from('user_answers')
        .select('*', { count: 'exact' })
        .eq('user_id', profile.id),
    ]);

    setStats({
      completedGames: gamesResult.count || 0,
      answeredQuestions: questionsResult.count || 0,
      daysActive: Math.ceil(
        (Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)
      ),
    });
  };

  const handleMoodChange = async (mood: string) => {
    try {
      await updateProfile({ mood });
    } catch (error) {
      console.error('Error updating mood:', error);
    }
  };

  const currentMood = profile?.mood || 'neutral';
  const moodData = moodEmojis[currentMood as keyof typeof moodEmojis];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Bienvenido de vuelta, {profile?.full_name || 'Usuario'}
        </h2>
        <p className="text-gray-600">
          Tu viaje hacia el bienestar mental continúa aquí
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white to-teal-50 rounded-2xl shadow-lg p-6 border border-teal-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              ¿Cómo te sientes hoy?
            </h3>
            <Smile className="w-6 h-6 text-teal-600" />
          </div>
          <div className="flex justify-center mb-6">
            <div className={`w-24 h-24 bg-gradient-to-br ${moodData.color} rounded-full flex items-center justify-center text-5xl shadow-lg`}>
              {moodData.emoji}
            </div>
          </div>
          <p className="text-center text-gray-600 mb-4 font-medium">
            {moodData.label}
          </p>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(moodEmojis).map(([key, data]) => (
              <button
                key={key}
                onClick={() => handleMoodChange(key)}
                className={`p-3 rounded-xl transition-all hover:scale-110 ${
                  currentMood === key
                    ? 'bg-teal-100 ring-2 ring-teal-500'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title={data.label}
              >
                <span className="text-2xl">{data.emoji}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl shadow-lg p-6 border border-cyan-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Tu Progreso
            </h3>
            <TrendingUp className="w-6 h-6 text-cyan-600" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ejercicios Completados</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.completedGames}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Preguntas Respondidas</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.answeredQuestions}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Días Activo</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.daysActive}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl shadow-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-3">
          Consejo del Día
        </h3>
        <p className="text-lg text-teal-50 leading-relaxed">
          La salud mental es tan importante como la salud física. Dedica al menos 10 minutos
          al día para practicar mindfulness o meditación. Tu mente te lo agradecerá.
        </p>
      </div>
    </div>
  );
}
