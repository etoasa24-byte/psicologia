import { Home, HelpCircle, Lightbulb, Gamepad2, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type NavigationProps = {
  currentView: string;
  onNavigate: (view: string) => void;
};

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  const { signOut, profile } = useAuth();

  const navItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'questions', icon: HelpCircle, label: 'Evaluación' },
    { id: 'recommendations', icon: Lightbulb, label: 'Recomendaciones' },
    { id: 'games', icon: Gamepad2, label: 'Ejercicios' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Psynara</h1>
              {profile && (
                <p className="text-xs text-gray-500">Hola, {profile.full_name}</p>
              )}
            </div>
          </div>

          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentView === item.id
                      ? 'bg-teal-100 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={signOut}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Salir</span>
          </button>
        </div>

        <nav className="md:hidden flex justify-around pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-lg transition-all ${
                  currentView === item.id
                    ? 'text-teal-600'
                    : 'text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
