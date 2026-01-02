import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verifyingSession, setVerifyingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Estado para saber qué tipo de flujo es
  const [flowType, setFlowType] = useState<"invite" | "recovery" | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Función para procesar parámetros de URL (Hash o Query)
    const handleUrlParams = async () => {
      // Obtenemos parámetros tanto del hash (#) como del query (?)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);
      
      // 1. Detección de errores explícitos de Supabase (ej: Link expirado o inválido)
      const errorDescription = hashParams.get('error_description') || queryParams.get('error_description');
      const error = hashParams.get('error') || queryParams.get('error');

      if (error || errorDescription) {
        setErrorMsg(errorDescription?.replace(/\+/g, ' ') || "Error en el enlace de verificación.");
        setVerifyingSession(false);
        return;
      }

      // 2. Detección de tipo de flujo (Invite vs Recovery)
      // A veces viene en el hash 'type', a veces lo inferimos
      const type = hashParams.get('type') || queryParams.get('type');
      if (type === 'invite') setFlowType('invite');
      else if (type === 'recovery') setFlowType('recovery');

      // 3. Verificar si ya existe una sesión activa
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // ÉXITO: Tenemos sesión
        setFormData(prev => ({ ...prev, email: session.user.email || '' }));
        // Si no detectamos el tipo por URL, asumimos recovery por defecto si ya está logueado en esta pág
        if (!type && !flowType) setFlowType('recovery');
        setVerifyingSession(false);
      } else {
        // 4. NO hay sesión aún. ¿Hay indicadores de que estamos procesando un login?
        const hasAccessToken = hashParams.get('access_token');
        const hasCode = queryParams.get('code'); // PKCE flow usa 'code'

        if (hasAccessToken || hasCode) {
          // Si hay tokens en la URL, NO mostramos error aún. Esperamos a onAuthStateChange.
          // Supabase está intercambiando el token por la sesión en background.
          console.log("Token detectado, esperando sesión...");
        } else {
          // Si no hay sesión Y no hay tokens en la URL -> Alguien entró directo
          setErrorMsg("No se detectó un enlace de validación activo.");
          setVerifyingSession(false);
        }
      }
    };

    handleUrlParams();

    // Escuchar cambios de estado (Login exitoso tras procesar el token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Event:", event);
      
      if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY' || event === 'TOKEN_REFRESHED') {
        if (session) {
          setFormData(prev => ({ ...prev, email: session.user.email || '' }));
          
          // Si es un evento de recovery explícito, actualizamos el flow
          if (event === 'PASSWORD_RECOVERY') setFlowType('recovery');
          // Si es invite, a veces entra como SIGNED_IN normal, pero ya seteamos invite arriba si venía en URL
          
          setVerifyingSession(false);
          setErrorMsg(""); // Limpiar errores si logueó exitosamente
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (formData.password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      // Siempre updateUser porque el usuario ya existe
      const { error } = await supabase.auth.updateUser({ 
        password: formData.password 
      });

      if (error) throw error;

      toast({
        title: "Cuenta actualizada",
        description: "Bienvenido al panel de administración.",
      });

      navigate("/admin");

    } catch (err: any) {
      setErrorMsg(err.message || "Error al actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  // Renderizado de carga
  if (verifyingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Verificando credenciales...</p>
      </div>
    );
  }

  // Renderizado de Error Fatal (Link inválido/expirado)
  if (!formData.email && errorMsg) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg text-center border border-red-100">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-red-100 rounded-full">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Enlace no válido</h2>
                <p className="text-gray-600 mb-6">{errorMsg}</p>
                <Link to="/admin" className="text-blue-600 font-medium hover:underline">
                    Volver al inicio de sesión
                </Link>
            </div>
        </div>
      );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {flowType === 'invite' ? "Te damos la bienvenida" : "Nueva Contraseña"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {flowType === 'invite' 
              ? `Hola ${formData.email}. Define tu contraseña para activar la cuenta.`
              : "Ingresa una nueva contraseña para recuperar el acceso."
            }
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="text-sm text-red-700 font-medium">{errorMsg}</div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleUpdatePassword}>
          <div className="space-y-4">
            {/* Campo de email (Solo lectura) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed shadow-sm sm:text-sm"
                />
              </div>
            </div>

            {/* Campo de contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nueva Contraseña
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Mínimo 6 caracteres"
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
            {loading ? "Actualizando..." : "Guardar contraseña e Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
