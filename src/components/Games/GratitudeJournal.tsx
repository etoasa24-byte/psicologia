import { useState } from 'react';
import { X, Plus, Trash2, CheckCircle } from 'lucide-react';
import { PsychologyGame } from '../../lib/supabase';

type GratitudeJournalProps = {
  game: PsychologyGame;
  onComplete: () => void;
  onClose: () => void;
};

export function GratitudeJournal({ game, onComplete, onClose }: GratitudeJournalProps) {
  const [items, setItems] = useState<string[]>(['', '', '']);
  const [completed, setCompleted] = useState(false);

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, '']);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const handleSubmit = () => {
    const filledItems = items.filter((item) => item.trim() !== '');
    if (filledItems.length >= 3) {
      setCompleted(true);
    }
  };

  const filledCount = items.filter((item) => item.trim() !== '').length;

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
          <p className="text-gray-600 text-lg mb-8">
            Practicar la gratitud diariamente puede mejorar significativamente tu bienestar
            emocional. Continúa con esta práctica cada día.
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
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-cyan-600 p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">{game.name}</h2>
            <p className="text-teal-100">
              {filledCount} de 3 elementos completados
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
          <div className="bg-teal-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Instrucciones:</h3>
            <p className="text-gray-700 leading-relaxed">
              {game.instructions}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {items.map((item, index) => (
              <div key={index} className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {index + 1}. ¿Por qué estás agradecido?
                  </label>
                  <textarea
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                    rows={2}
                    placeholder="Escribe algo por lo que te sientas agradecido hoy..."
                  />
                </div>
                {items.length > 1 && (
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="mt-7 w-10 h-10 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleAddItem}
            className="w-full border-2 border-dashed border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:border-teal-500 hover:text-teal-600 transition-all flex items-center justify-center space-x-2 mb-6"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar otro elemento</span>
          </button>

          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              disabled={filledCount < 3}
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guardar y Completar
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
