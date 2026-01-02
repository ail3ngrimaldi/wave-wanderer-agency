import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados para controlar el flujo
  const [flowType, setFlowType] = useState<"signup" | "invite" | "recovery">("signup");
  const [emailLocked, setEmailLocked] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // 1. Detectar parámetros en el hash (Supabase envía tokens aquí)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type'); // 'invite', 'recovery', 'magiclink'
    const accessToken = hashParams.get('access_token');

    // 2. Verificar si hay una sesión activa (Supabase procesa el hash automáticamente)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Si hay sesión, es porque entró con link válido (Invite o Recovery)
        setFormData(prev => ({ ...prev, email: session.user.email || '' }));
        setEmailLocked(true);

        // Si el hash dice qué tipo es, lo usamos. Si no, inferimos por la sesión.
        if (type === 'invite') {
          setFlowType('invite');
        } else if (type === 'recovery') {
          setFlowType('recovery');
        } else {
           // Si hay sesión pero no hay type explícito (a veces pasa al recargar), 
           // asumimos que es gestión de cuenta existente.
           // Opcional: Podrías chequear metadatos del usuario aquí.
           setFlowType('recovery'); 
        }
      }
    });

    // Escuchar cambios en el estado de autenticación (por si el token se procesa después del montaje)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setFlowType('recovery');
        if (session?.user.email) {
            setFormData(prev => ({ ...prev, email: session.user.email! }));
            setEmailLocked(true);
        }
      }
    });

    return () => subscription.unsubscribe();
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
      // CASO 1: Usuario Invitado o Recuperación de Contraseña
      // En ambos casos el usuario YA EXISTE y YA TIENE SESIÓN (por el link).
      // Solo necesitamos actualizar su contraseña.
      if (flowType === 'invite' || flowType === 'recovery') {
        const { error } = await supabase.auth.updateUser({ 
          password: formData.password 
        });

        if (error) throw error;

        // Si es invite, tal vez quieras actualizar metadatos para decir que ya aceptó
        // await supabase.from('profiles').update({ status: 'active' })... 

        navigate("/admin");
      } 
      
      // CASO 2: Registro de Usuario Nuevo (Sign Up)
      else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            // Asegúrate que esta URL esté en "Redirect URLs" en Supabase Dashboard
            emailRedirectTo: `${window.location.origin}/crear-cuenta`
          }
        });

        if (error) throw error;

        if (data.session) {
          navigate("/admin");
        } else {
          // Caso: Confirmación de email requerida
          setErrorMsg("Revisa tu correo para confirmar la cuenta antes de entrar.");
          setLoading(false); // No navegamos, dejamos que lea el mensaje
          return;
        }
      }

    } catch (err: any) {
      // Manejo de error específico de "User already registered"
      // A veces pasa si intentan registrarse normal en vez de usar el link
      if (err.message.includes("already registered")) {
        setErrorMsg("Este usuario ya existe. Por favor intenta iniciar sesión o recuperar contraseña.");
      } else {
        setErrorMsg(err.message || "Ocurrió un error inesperado.");
      }
      setLoading(false);
    }
  };

  // Textos dinámicos según el flujo
  const getTitle = () => {
    if (flowType === 'invite') return "Acepta tu invitación";
    if (flowType === 'recovery') return "Restablecer contraseña";
    return "Crear cuenta de acceso";
  };

  const getButtonText = () => {
    if (loading) return "Procesando...";
    if (flowType === 'invite') return "Activar cuenta";
    if (flowType === 'recovery') return "Cambiar contraseña";
    return "Registrarse";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {getTitle()}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {flowType === 'signup' 
              ? "Ingresa tus datos para registrarte en el panel."
              : "Ingresa una nueva contraseña segura."
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
            {/* Campo de email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  required
                  disabled={emailLocked} 
                  value={formData.email}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Campo de contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {flowType === 'signup' ? "Contraseña" : "Nueva Contraseña"}
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
            {getButtonText()}
          </button>
          
          <div className="text-center text-sm">
            <Link to="/admin" className="font-medium text-blue-600 hover:text-blue-500">
              {flowType === 'signup' ? "¿Ya tienes cuenta? Inicia sesión" : "Volver al login"}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
