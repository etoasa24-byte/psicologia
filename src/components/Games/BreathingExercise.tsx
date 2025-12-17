import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { PsychologyGame } from '../../lib/supabase';

type BreathingExerciseProps = {
  game: PsychologyGame;
  onComplete: () => void;
  onClose: () => void;
};

export function BreathingExercise({ game, onComplete, onClose }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const totalCycles = 5;

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          if (phase === 'inhale') {
            setPhase('hold');
            return 4;
          } else if (phase === 'hold') {
            setPhase('exhale');
            return 4;
          } else {
            setCycles((prev) => prev + 1);
            setPhase('inhale');
            return 4;
          }
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase]);

  useEffect(() => {
    if (cycles >= totalCycles && isActive) {
      setIsActive(false);
    }
  }, [cycles, isActive]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Inhala profundamente';
      case 'hold':
        return 'Mantén el aire';
      case 'exhale':
        return 'Exhala lentamente';
    }
  };

  const getCircleSize = () => {
    if (phase === 'inhale') return 'scale-150';
    if (phase === 'hold') return 'scale-150';
    return 'scale-100';
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center z-50 p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all"
      >
        <X className="w-6 h-6 text-gray-600" />
      </button>

      <div className="text-center text-white">
        <h2 className="text-4xl font-bold mb-2">{game.name}</h2>
        <p className="text-teal-100 mb-8">
          Ciclo {cycles} de {totalCycles}
        </p>

        <div className="relative w-64 h-64 mx-auto mb-12">
          <div
            className={`absolute inset-0 bg-white bg-opacity-30 rounded-full transition-all duration-[4000ms] ease-in-out ${getCircleSize()}`}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-7xl font-bold mb-4">{count}</div>
              <div className="text-xl font-semibold">{getPhaseText()}</div>
            </div>
          </div>
        </div>

        {!isActive && cycles < totalCycles && (
          <button
            onClick={() => setIsActive(true)}
            className="bg-white text-teal-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-opacity-90 transition-all shadow-lg"
          >
            {cycles === 0 ? 'Comenzar' : 'Continuar'}
          </button>
        )}

        {cycles >= totalCycles && (
          <div className="space-y-4">
            <div className="text-2xl font-bold mb-4">
              ¡Excelente trabajo! Has completado el ejercicio
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setCycles(0);
                  setPhase('inhale');
                  setCount(4);
                }}
                className="bg-white text-teal-600 px-6 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg"
              >
                Repetir
              </button>
              <button
                onClick={onComplete}
                className="bg-teal-700 text-white px-6 py-3 rounded-full font-bold hover:bg-teal-800 transition-all shadow-lg"
              >
                Completar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
