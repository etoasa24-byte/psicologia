import { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { PsychologyGame } from '../../lib/supabase';

type CognitiveReframeProps = {
  game: PsychologyGame;
  onComplete: () => void;
  onClose: () => void;
};

const scenarios = [
  {
    situation: 'Tu amigo no respondió tu mensaje desde hace dos días',
    negativeThought: 'Está enojado conmigo, probablemente ya no quiere ser mi amigo',
    distortions: ['Lectura de mente', 'Catastrofización'],
    hints: [
      'Considera otras explicaciones posibles',
      'Pregúntate: ¿Qué evidencia tengo?',
      'Piensa en explicaciones alternativas más realistas',
    ],
  },
  {
    situation: 'Cometiste un error en una presentación de trabajo',
    negativeThought: 'Soy un fracaso total, nunca hago nada bien',
    distortions: ['Pensamiento todo-o-nada', 'Sobregeneralización'],
    hints: [
      'Un error no define tu valor completo',
      '¿Es realmente cierto que "nunca" haces nada bien?',
      'Piensa en tus logros anteriores',
    ],
  },
  {
    situation: 'No fuiste invitado a una reunión social',
    negativeThought: 'Nadie me quiere, siempre soy excluido',
    distortions: ['Sobregeneralización', 'Personalización'],
    hints: [
      'Puede haber muchas razones no relacionadas contigo',
      'Recuerda otras veces que sí fuiste incluido',
      'Evita asumir que todo es personal',
    ],
  },
];

export function CognitiveReframe({ game, onComplete, onClose }: CognitiveReframeProps) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [reframedThought, setReframedThought] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [completed, setCompleted] = useState(false);

  const scenario = scenarios[currentScenario];

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setReframedThought('');
      setShowHints(false);
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
            ¡Excelente trabajo!
          </h2>
          <p className="text-gray-600 text-lg mb-4">
            Has completado el ejercicio de reestructuración cognitiva.
          </p>
          <p className="text-gray-600 mb-8">
            La práctica regular de identificar y desafiar pensamientos negativos automáticos
            puede reducir significativamente la ansiedad y mejorar tu bienestar emocional.
            Continúa aplicando estas técnicas en tu vida diaria.
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
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <span className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm mr-2">
                1
              </span>
              Situación
            </h3>
            <p className="text-gray-700 ml-10">{scenario.situation}</p>
          </div>

          <div className="bg-red-50 rounded-xl p-6 mb-6 border border-red-200">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Pensamiento Negativo Automático
            </h3>
            <p className="text-gray-700 italic">"{scenario.negativeThought}"</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {scenario.distortions.map((distortion, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium"
                >
                  {distortion}
                </span>
              ))}
            </div>
          </div>

          {showHints && (
            <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">Pistas para reformular:</h3>
              <ul className="space-y-2">
                {scenario.hints.map((hint, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-6">
            <label className="block font-semibold text-gray-800 mb-2">
              Reformula el pensamiento de manera más equilibrada y realista:
            </label>
            <textarea
              value={reframedThought}
              onChange={(e) => setReframedThought(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
              rows={4}
              placeholder="Escribe una forma más equilibrada y realista de pensar sobre esta situación..."
            />
          </div>

          <div className="flex space-x-3 mb-6">
            {!showHints && (
              <button
                onClick={() => setShowHints(true)}
                className="flex-1 border-2 border-teal-500 text-teal-600 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-all"
              >
                Ver Pistas
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={reframedThought.trim().length < 10}
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentScenario < scenarios.length - 1 ? 'Siguiente' : 'Finalizar'}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full text-gray-600 hover:text-gray-800 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
