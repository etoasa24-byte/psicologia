import { useState, useEffect } from 'react';
import { Gamepad2, Play, CheckCircle, Wind, Brain, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, PsychologyGame } from '../../lib/supabase';
import { BreathingExercise } from '../Games/BreathingExercise';
import { GratitudeJournal } from '../Games/GratitudeJournal';
import { CognitiveReframe } from '../Games/CognitiveReframe';
import { BodyScan } from '../Games/BodyScan';
import { EmotionWheel } from '../Games/EmotionWheel';
import { MindfulnessTimer } from '../Games/MindfulnessTimer';

export function Games() {
  const { profile } = useAuth();
  const [games, setGames] = useState<PsychologyGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<PsychologyGame | null>(null);
  const [completedGames, setCompletedGames] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
    loadProgress();
  }, [profile]);

  const loadGames = async () => {
    try {
      const { data, error } = await supabase
        .from('psychology_games')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('game_id')
        .eq('user_id', profile.id)
        .eq('completed', true);

      if (error) throw error;

      const completed = new Set(data?.map((p) => p.game_id) || []);
      setCompletedGames(completed);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleCompleteGame = async (gameId: string, score: number = 100) => {
    if (!profile) return;

    try {
      const { error } = await supabase.from('user_progress').insert([
        {
          user_id: profile.id,
          game_id: gameId,
          completed: true,
          score,
          completed_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setCompletedGames(new Set([...completedGames, gameId]));
      setSelectedGame(null);
    } catch (error) {
      console.error('Error completing game:', error);
    }
  };

  const renderGameComponent = () => {
    if (!selectedGame) return null;

    switch (selectedGame.name) {
      case 'Respiración Consciente':
      case 'Técnica Somática':
        return (
          <BreathingExercise
            game={selectedGame}
            onComplete={() => handleCompleteGame(selectedGame.id)}
            onClose={() => setSelectedGame(null)}
          />
        );
      case 'Gratitud Diaria':
        return (
          <GratitudeJournal
            game={selectedGame}
            onComplete={() => handleCompleteGame(selectedGame.id)}
            onClose={() => setSelectedGame(null)}
          />
        );
      case 'Desafío Cognitivo':
      case 'Debate de Pensamientos':
      case 'Conversación Interna':
        return (
          <CognitiveReframe
            game={selectedGame}
            onComplete={() => handleCompleteGame(selectedGame.id)}
            onClose={() => setSelectedGame(null)}
          />
        );
      case 'Cuerpo de Exploración':
      case 'Escaneo Corporal':
        return (
          <BodyScan
            game={selectedGame}
            onComplete={() => handleCompleteGame(selectedGame.id)}
            onClose={() => setSelectedGame(null)}
          />
        );
      case 'Rueda de Emociones':
        return (
          <EmotionWheel
            game={selectedGame}
            onComplete={() => handleCompleteGame(selectedGame.id)}
            onClose={() => setSelectedGame(null)}
          />
        );
      case 'Meditación Diaria':
      case 'Visualización Guiada':
        return (
          <MindfulnessTimer
            game={selectedGame}
            onComplete={() => handleCompleteGame(selectedGame.id)}
            onClose={() => setSelectedGame(null)}
          />
        );
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {selectedGame.name}
          </h2>
          <div className="bg-teal-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Instrucciones:</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {selectedGame.instructions}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => handleCompleteGame(selectedGame.id)}
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md"
            >
              Marcar como Completado
            </button>
            <button
              onClick={() => setSelectedGame(null)}
              className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'breathing':
        return Wind;
      case 'cognitive':
        return Brain;
      case 'mindfulness':
      case 'meditation':
        return Sparkles;
      default:
        return Gamepad2;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Moderado';
      case 'hard':
        return 'Avanzado';
      default:
        return difficulty;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando ejercicios...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Ejercicios de Bienestar
          </h2>
          <p className="text-gray-600">
            Practica técnicas respaldadas por la ciencia para mejorar tu salud mental
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const IconComponent = getCategoryIcon(game.category);
            const isCompleted = completedGames.has(game.id);

            return (
              <div
                key={game.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all"
              >
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-6 text-white relative">
                  {isCompleted && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4">
                    <IconComponent className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        game.difficulty
                      )}`}
                    >
                      {getDifficultyLabel(game.difficulty)}
                    </span>
                    <span className="px-2 py-1 bg-teal-700 rounded-full text-xs font-medium capitalize">
                      {game.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4">{game.description}</p>

                  <button
                    onClick={() => setSelectedGame(game)}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Comenzar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedGame && renderGameComponent()}
    </>
  );
}
