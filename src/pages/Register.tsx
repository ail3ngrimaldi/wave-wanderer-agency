import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isInvitedUser, setIsInvitedUser] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

 // Detectar el tipo de flujo
  useEffect(() => {
    // Parsear el hash de la URL para detectar tokens
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (accessToken && (type === 'invite' || type === 'recovery' || type === 'magiclink')) {
      // El usuario viene de un link de invitación o recuperación
      setIsInvitedUser(true);
      setFlowType(type); // Nuevo estado para saber el tipo
      
      // Supabase debería haber procesado el token automáticamente
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setFormData(prev => ({ ...prev, email: session.user.email || '' }));
        }
      });
    }
  }, []);


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    // Validación básica
    if (formData.password.length < 8) {
      setErrorMsg("La contraseña debe tener al menos 8 caracteres.");
      setLoading(false);
      return;
    }

    try {
      if (isInvitedUser) {
        // Usuario invitado: solo necesita establecer contraseña
        const { error } = await supabase.auth.updateUser({ 
          password: formData.password 
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        // Redirigir al dashboard
        navigate("/admin");
      } else {
        // Usuario nuevo: registro completo
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/crear-cuenta`
          }
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          navigate("/admin");
        } else {
          setErrorMsg("Revisa tu correo para confirmar la cuenta antes de entrar.");
          setLoading(false);
        }
      }
    } catch (err) {
      setErrorMsg("Ocurrió un error inesperado. Intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {isInvitedUser ? "Establece tu contraseña" : "Crear cuenta de acceso"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isInvitedUser 
              ? "Ingresa una contraseña segura para completar tu registro."
              : "Ingresa tus datos para registrarte en el panel."
            }
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="text-sm text-red-700 font-medium">{errorMsg}</div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            {/* Campo de email - deshabilitado si es usuario invitado */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  required
                  disabled={isInvitedUser}
                  value={formData.email}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Campo de contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Mínimo 8 caracteres"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 transition-colors"
          >
            {loading 
              ? "Procesando..." 
              : (isInvitedUser ? "Establecer contraseña" : "Registrarse e Ingresar")
            }
          </button>
          
          <div className="text-center text-sm">
            <Link to="/admin" className="font-medium text-blue-600 hover:text-blue-500">
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
