import { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';
import { PsychologyGame } from '../../lib/supabase';

type MindfulnessTimerProps = {
  game: PsychologyGame;
  onComplete: () => void;
  onClose: () => void;
};

export function MindfulnessTimer({ game, onComplete, onClose }: MindfulnessTimerProps) {
  const [duration, setDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (!isRunning || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  const quotes = [
    'Respira. Estás exactamente donde necesitas estar.',
    'Tu mente está quieta. Tu corazón está en paz.',
    'Este momento es suficiente.',
    'Soy la testigo de mis pensamientos, no mis pensamientos.',
    'La paz viene del interior.',
  ];

  if (completed) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Meditación Completada
          </h2>
          <p className="text-gray-600 text-lg mb-4">
            Completaste {duration} minutos de mindfulness.
          </p>
          <p className="text-gray-600 mb-8">
            La meditación regular mejora la concentración, reduce el estrés y aumenta la
            inteligencia emocional. Cada sesión te acerca más a la paz mental.
          </p>
          <button
            onClick={onComplete}
            className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md"
          >
            Completar Ejercicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center z-50 p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all"
      >
        <X className="w-6 h-6 text-gray-600" />
      </button>

      <div className="text-center text-white w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2">{game.name}</h2>

        <div className="bg-white bg-opacity-10 rounded-3xl p-12 mb-8 backdrop-blur-sm">
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="90"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
              />
              <circle
                cx="96"
                cy="96"
                r="90"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeDasharray={`${(percentage / 100) * 565.48} 565.48`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                <div className="text-sm text-white text-opacity-80 mt-2">
                  de {duration}:00 minutos
                </div>
              </div>
            </div>
          </div>

          <p className="text-lg italic text-white text-opacity-90">
            "{quotes[Math.floor(Math.random() * quotes.length)]}"
          </p>
        </div>

        {!isRunning && timeLeft === duration * 60 && (
          <div className="mb-8">
            <label className="block text-white mb-4 font-semibold">
              Elige duración (minutos):
            </label>
            <div className="flex justify-center space-x-4">
              {[3, 5, 10, 15, 20].map((min) => (
                <button
                  key={min}
                  onClick={() => setDuration(min)}
                  disabled={isRunning}
                  className={`w-12 h-12 rounded-full font-bold transition-all ${
                    duration === min
                      ? 'bg-white text-teal-600 shadow-lg'
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }`}
                >
                  {min}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 bg-white text-teal-600 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2 shadow-lg"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Comenzar</span>
              </>
            )}
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(duration * 60);
            }}
            className="w-12 h-12 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-all flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
