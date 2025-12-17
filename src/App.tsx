import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Navigation } from './components/Layout/Navigation';
import { Home } from './components/Views/Home';
import { Profile } from './components/Views/Profile';
import { Questions } from './components/Views/Questions';
import { Recommendations } from './components/Views/Recommendations';
import { Games } from './components/Views/Games';

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'profile':
        return <Profile />;
      case 'questions':
        return <Questions />;
      case 'recommendations':
        return <Recommendations />;
      case 'games':
        return <Games />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <Navigation currentView={currentView} onNavigate={setCurrentView} />
      <main>{renderView()}</main>
    </div>
  );
}

export default App;
