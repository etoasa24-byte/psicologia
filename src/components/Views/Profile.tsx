import { useState } from 'react';
import { User, Mail, Calendar, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Profile() {
  const { profile, user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ full_name: fullName });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(profile?.full_name || '');
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-white to-teal-50 rounded-2xl shadow-xl overflow-hidden border border-teal-100">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-teal-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Mi Perfil</h2>
              <p className="text-teal-100">Información de tu cuenta</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <User className="w-5 h-5 text-teal-600" />
                <span>Nombre Completo</span>
              </label>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1 text-teal-600 hover:text-teal-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Editar</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Guardar</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-sm font-medium">Cancelar</span>
                  </button>
                </div>
              )}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="Tu nombre completo"
              />
            ) : (
              <p className="text-lg text-gray-800 font-medium">
                {profile?.full_name || 'No especificado'}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-5 h-5 text-teal-600" />
              <span>Email</span>
            </label>
            <p className="text-lg text-gray-800">
              {user?.email}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span>Miembro desde</span>
            </label>
            <p className="text-lg text-gray-800">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Desconocido'}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 border-t border-teal-100">
          <h3 className="font-semibold text-gray-800 mb-2">Sobre Psynara</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Psynara es tu espacio personal de bienestar mental. Aquí puedes explorar tu salud
            emocional, recibir recomendaciones personalizadas y practicar ejercicios que te
            ayudarán a mantener un equilibrio mental saludable.
          </p>
        </div>
      </div>
    </div>
  );
}
