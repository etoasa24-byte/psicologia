import { useState } from 'react';
import { User, Mail, Calendar, Edit2, Check, X, Shield, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Profile() {
  const { profile, user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (fullName.trim()) {
      setSaving(true);
      try {
        await updateProfile({ full_name: fullName });
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleCancel = () => {
    setFullName(profile?.full_name || '');
    setIsEditing(false);
  };

  const userInitials = fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Desconocido';

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-8 py-12">
            <div className="flex items-end space-x-6">
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold bg-gradient-to-br from-teal-500 to-cyan-600 bg-clip-text text-transparent">
                  {userInitials || 'U'}
                </span>
              </div>
              <div className="pb-2">
                <h1 className="text-4xl font-bold text-white mb-1">
                  {profile?.full_name || 'Usuario'}
                </h1>
                <p className="text-teal-100">Miembro desde {joinDate}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nombre Completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-gray-900"
                    placeholder="Tu nombre completo"
                    autoFocus
                  />
                ) : (
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-lg text-gray-900 font-medium">
                      {profile?.full_name || 'No especificado'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Correo Electrónico
                </label>
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-lg text-gray-900 font-medium">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-5 h-5" />
                    <span>Guardar Cambios</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancelar</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                  <span>Editar Perfil</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Privacidad y Seguridad</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Tu datos están protegidos con encriptación de extremo a extremo.
            </p>
            <button className="text-teal-600 font-semibold hover:text-teal-700 transition-colors text-sm">
              Gestionar configuración de privacidad →
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Notificaciones</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Recibe recordatorios diarios para mantener tu práctica de bienestar.
            </p>
            <button className="text-teal-600 font-semibold hover:text-teal-700 transition-colors text-sm">
              Configurar notificaciones →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Acerca de Psynara</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            Psynara es tu plataforma integral de bienestar mental, diseñada para ayudarte a
            explorar tu salud emocional, recibir recomendaciones personalizadas basadas en
            evidencia científica, y practicar ejercicios terapéuticos que te ayudarán a
            mantener un equilibrio mental saludable.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Versión</p>
              <p className="font-semibold text-gray-900">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Última actualización</p>
              <p className="font-semibold text-gray-900">Diciembre 2024</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Desarrollador</p>
              <p className="font-semibold text-gray-900">Psynara Team</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
          <p className="text-xs text-gray-500">
            © 2025 Psynara. Todos los derechos reservados. |{' '}
            <span className="hover:underline cursor-pointer">Términos de Servicio</span> |{' '}
            <span className="hover:underline cursor-pointer">Política de Privacidad</span>
          </p>
        </div>
      </div>
    </div>
  );
}
