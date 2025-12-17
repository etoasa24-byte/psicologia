import { useState, useEffect } from 'react';
import { Lightbulb, Heart, Brain, Wind, Shield, Coffee, BookHeart, MessageCircle, Moon, HeartPulse, Users, Anchor } from 'lucide-react';
import { supabase, Recommendation } from '../../lib/supabase';

const iconMap: Record<string, React.ElementType> = {
  wind: Wind,
  anchor: Anchor,
  shield: Shield,
  coffee: Coffee,
  'book-heart': BookHeart,
  'message-circle': MessageCircle,
  moon: Moon,
  'heart-pulse': HeartPulse,
  users: Users,
  brain: Brain,
  heart: Heart,
  lightbulb: Lightbulb,
};

export function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecommendations(data || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'Todas', color: 'from-gray-500 to-slate-600' },
    { id: 'ansiedad', label: 'Ansiedad', color: 'from-yellow-500 to-orange-600' },
    { id: 'estres', label: 'Estrés', color: 'from-red-500 to-rose-600' },
    { id: 'autoestima', label: 'Autoestima', color: 'from-blue-500 to-cyan-600' },
    { id: 'bienestar', label: 'Bienestar', color: 'from-green-500 to-emerald-600' },
    { id: 'mindfulness', label: 'Mindfulness', color: 'from-purple-500 to-pink-600' },
  ];

  const filteredRecommendations =
    selectedCategory === 'all'
      ? recommendations
      : recommendations.filter((r) => r.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando recomendaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Recomendaciones para tu Bienestar
        </h2>
        <p className="text-gray-600">
          Consejos personalizados basados en evidencia científica
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === category.id
                ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecommendations.map((recommendation) => {
          const IconComponent = iconMap[recommendation.icon] || Lightbulb;
          const isExpanded = expandedId === recommendation.id;

          return (
            <div
              key={recommendation.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all"
            >
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-6 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-teal-100 uppercase tracking-wide mb-1">
                      {recommendation.category}
                    </div>
                    <h3 className="text-lg font-bold">{recommendation.title}</h3>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">{recommendation.description}</p>

                {isExpanded && (
                  <div className="mb-4 p-4 bg-teal-50 rounded-lg border border-teal-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {recommendation.content}
                    </p>
                  </div>
                )}

                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : recommendation.id)
                  }
                  className="text-teal-600 font-semibold hover:text-teal-700 transition-colors flex items-center space-x-1"
                >
                  <span>{isExpanded ? 'Ver menos' : 'Leer más'}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRecommendations.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No hay recomendaciones en esta categoría
          </p>
        </div>
      )}
    </div>
  );
}
