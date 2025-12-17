import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { PsychologyGame } from '../../lib/supabase';

type EmotionWheelProps = {
  game: PsychologyGame;
  onComplete: () => void;
  onClose: () => void;
};

const scenarios = [
  {
    emotion: 'Ansiedad',
    possibleRoot: ['Incertidumbre', 'Falta de control', 'Amenaza percibida'],
    healthyResponse: [
      'Enfocarse en lo que SÍ puedo controlar',
      'Buscar información para reducir incertidumbre',
      'Practicar técnicas de calma',
    ],
  },
  {
    emotion: 'Tristeza',
    possibleRoot: ['Pérdida', 'Decepción', 'Soledad'],
    healthyResponse: [
      'Permitirte sentir sin juzgarte',
      'Buscar apoyo emocional',
      'Recordar que es temporal',
    ],
  },
  {
    emotion: 'Ira',
    possibleRoot: ['Límites violados', 'Injusticia', 'Frustración'],
    healthyResponse: [
      'Expresar de forma asertiva, no agresiva',
      'Establecer límites claros',
      'Canalizar en acción constructiva',
    ],
  },
  {
    emotion: 'Culpa',
    possibleRoot: ['Creencia de haber actuado mal', 'Arrepentimiento', 'Responsabilidad'],
    healthyResponse: [
      'Evaluar si tu acción fue realmente inapropiada',
      'Disculparte genuinamente si es necesario',
      'Perdonarte a ti mismo y aprender',
    ],
  },
  {
    emotion: 'Miedo',
    possibleRoot: ['Peligro potencial', 'Lo desconocido', 'Vulnerabilidad'],
    healthyResponse: [
      'Evaluar si el miedo es proporcional a la amenaza real',
      'Buscar información y preparación',
      'Confiar en tu capacidad de enfrentar',
    ],
  },
];

export function EmotionWheel({ game, onComplete, onClose }: EmotionWheelProps) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedRoot, setSelectedRoot] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const scenario = scenarios[currentScenario];

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedRoot(null);
      setSelectedResponse(null);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Has Aprendido sobre tus Emociones
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Comprender la raíz de tus emociones te permite responder de forma más sabia y
            constructiva. Las emociones son mensajes, no enemigos. Seguiremos practicando esto.
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-cyan-600 p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">{game.name}</h2>
            <p className="text-teal-100">
              Escenario {currentScenario + 1} de {scenarios.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-8 mb-6 text-white">
            <h3 className="text-3xl font-bold">{scenario.emotion}</h3>
            <p className="text-pink-100 mt-2">¿Cuáles pueden ser las raíces de esta emoción?</p>
          </div>

          <div className="mb-6">
            <label className="block font-semibold text-gray-800 mb-3">
              1. Identifica la raíz probable (selecciona todas las que apliquen):
            </label>
            <div className="grid grid-cols-1 gap-2">
              {scenario.possibleRoot.map((root) => (
                <button
                  key={root}
                  onClick={() =>
                    setSelectedRoot(selectedRoot === root ? null : root)
                  }
                  className={`p-4 rounded-lg border-2 font-medium transition-all text-left ${
                    selectedRoot === root
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedRoot === root
                          ? 'border-teal-500 bg-teal-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedRoot === root && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </div>
                    <span>{root}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-semibold text-gray-800 mb-3">
              2. Respuesta Saludable (elige una estrategia):
            </label>
            <div className="space-y-2">
              {scenario.healthyResponse.map((response) => (
                <button
                  key={response}
                  onClick={() =>
                    setSelectedResponse(selectedResponse === response ? null : response)
                  }
                  className={`w-full p-4 rounded-lg border-2 font-medium transition-all text-left ${
                    selectedResponse === response
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedResponse === response
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedResponse === response && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </div>
                    <span>{response}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleNext}
              disabled={!selectedRoot || !selectedResponse}
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentScenario < scenarios.length - 1 ? 'Siguiente' : 'Finalizar'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
