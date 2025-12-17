import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { PsychologyGame } from '../../lib/supabase';

type BodyScanProps = {
  game: PsychologyGame;
  onComplete: () => void;
  onClose: () => void;
};

const bodyParts = [
  { name: 'Dedos de los pies', color: 'from-blue-400 to-blue-600' },
  { name: 'Pies', color: 'from-blue-500 to-blue-700' },
  { name: 'Pantorrillas', color: 'from-indigo-400 to-indigo-600' },
  { name: 'Muslos', color: 'from-indigo-500 to-indigo-700' },
  { name: 'Glúteos', color: 'from-purple-400 to-purple-600' },
  { name: 'Abdomen', color: 'from-purple-500 to-purple-700' },
  { name: 'Pecho', color: 'from-pink-400 to-pink-600' },
  { name: 'Espalda', color: 'from-pink-500 to-pink-700' },
  { name: 'Brazos', color: 'from-rose-400 to-rose-600' },
  { name: 'Manos', color: 'from-rose-500 to-rose-700' },
  { name: 'Cuello', color: 'from-orange-400 to-orange-600' },
  { name: 'Cara', color: 'from-orange-500 to-orange-700' },
];

export function BodyScan({ game, onComplete, onClose }: BodyScanProps) {
  const [currentPart, setCurrentPart] = useState(0);
  const [sensations, setSensations] = useState<Record<number, string>>({});
  const [isScanning, setIsScanning] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!isScanning) return;

    const timer = setTimeout(() => {
      if (currentPart < bodyParts.length - 1) {
        setCurrentPart(currentPart + 1);
      } else {
        setIsScanning(false);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [isScanning, currentPart]);

  const handleSensation = (sensation: string) => {
    setSensations({
      ...sensations,
      [currentPart]: sensation,
    });
  };

  const handleNext = () => {
    if (currentPart < bodyParts.length - 1) {
      setCurrentPart(currentPart + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  const progress = ((currentPart + 1) / bodyParts.length) * 100;
  const part = bodyParts[currentPart];
  const sensation = sensations[currentPart];

  if (completed) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Escaneo Corporal Completado
          </h2>
          <p className="text-gray-600 mb-6">
            Excelente trabajo trayendo conciencia a tu cuerpo. Este ejercicio ayuda a:
          </p>
          <ul className="text-left space-y-2 text-gray-700 mb-8">
            <li>✓ Identificar y liberar tensión acumulada</li>
            <li>✓ Conectar mente y cuerpo</li>
            <li>✓ Reducir ansiedad y estrés</li>
            <li>✓ Mejorar la conciencia corporal</li>
          </ul>
          <button
            onClick={handleFinish}
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
        <p className="text-teal-100 mb-6">
          Parte {currentPart + 1} de {bodyParts.length}
        </p>

        <div className="w-full h-2 bg-white bg-opacity-30 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className={`bg-gradient-to-br ${part.color} rounded-3xl p-12 mb-6 text-white shadow-2xl`}>
          <div className="text-6xl font-bold mb-4">{currentPart + 1}</div>
          <h3 className="text-3xl font-bold">{part.name}</h3>
          {isScanning && (
            <p className="text-white text-opacity-80 mt-2">Escaneando...</p>
          )}
        </div>

        <div className="bg-white bg-opacity-20 rounded-2xl p-6 mb-6 text-white">
          <p className="text-sm text-white text-opacity-90 mb-4">
            ¿Qué sensaciones notas? (Puedes seleccionar múltiples)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {['Tensión', 'Relajación', 'Hormigueo', 'Calor', 'Frío', 'Entumecimiento'].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => handleSensation(s)}
                  className={`py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                    sensation === s
                      ? 'bg-white text-teal-600 shadow-lg'
                      : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                  }`}
                >
                  {s}
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setIsScanning(!isScanning)}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${
              isScanning
                ? 'bg-white text-teal-600 hover:bg-opacity-90'
                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
            }`}
          >
            {isScanning ? 'Pausar' : 'Auto'}
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-white text-teal-600 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2"
          >
            <span>{currentPart === bodyParts.length - 1 ? 'Finalizar' : 'Siguiente'}</span>
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
