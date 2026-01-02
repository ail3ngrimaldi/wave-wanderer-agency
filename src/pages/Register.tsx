import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom"; // Link ya no es estrictamente necesario si manejamos todo con estados
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verifyingSession, setVerifyingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [flowType, setFlowType] = useState<"invite" | "recovery" | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let mounted = true;

    const checkSessionAndUrl = async () => {
      // 1. Analizar URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);
      
      const errorDescription = hashParams.get('error_description') || queryParams.get('error_description');
      const type = hashParams.get('type') || queryParams.get('type');
      const hasToken = hashParams.get('access_token') || queryParams.get('code');

      // Si hay error explícito en la URL
      if (errorDescription) {
        setErrorMsg(errorDescription.replace(/\+/g, ' '));
        setVerifyingSession(false);
        return;
      }

      // Detectar tipo
      if (type === 'invite') setFlowType('invite');
      else if (type === 'recovery') setFlowType('recovery');

      // 2. Intentar obtener sesión inmediatamente
      const { data: { session } } = await supabase.auth.getSession();

      if (session && mounted) {
        // ¡Éxito inmediato!
        setFormData(prev => ({ ...prev, email: session.user.email || '' }));
        if (!type && !flowType) setFlowType('recovery'); 
        setVerifyingSession(false);
        return;
      }

      // 3. Si NO hay sesión pero SÍ hay token, iniciamos estrategia de reintentos (Polling)
      if (hasToken && !session) {
        console.log("Token detectado. Iniciando espera activa de sesión...");
        
        let attempts = 0;
        const maxAttempts = 10; // Intentar por 5 segundos (10 * 500ms)

        intervalId = setInterval(async () => {
          attempts++;
          console.log(`Intento de verificación ${attempts}/${maxAttempts}`);
          
          const { data: { session: newSession } } = await supabase.auth.getSession();
          
          if (newSession && mounted) {
            console.log("Sesión establecida exitosamente.");
            setFormData(prev => ({ ...prev, email: newSession.user.email || '' }));
            if (!type && !flowType) setFlowType('recovery');
            setVerifyingSession(false);
            clearInterval(intervalId);
          } else if (attempts >= maxAttempts && mounted) {
            console.log("Tiempo de espera agotado.");
            setErrorMsg("No se pudo establecer la sesión. El enlace podría haber expirado.");
            setVerifyingSession(false);
            clearInterval(intervalId);
          }
        }, 500); // Chequear cada medio segundo
      } else {
        // No hay token ni sesión
        if (mounted) {
           setErrorMsg("Enlace no válido o falta de credenciales.");
           setVerifyingSession(false);
        }
      }
    };

    checkSessionAndUrl();

    // También mantenemos el listener por si acaso el evento llega limpio
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && mounted) {
        // Si el listener gana la carrera al intervalo, limpiamos y establecemos
        if (intervalId) clearInterval(intervalId);
        setFormData(prev => ({ ...prev, email: session.user.email || '' }));
        setVerifyingSession(false);
      }
    });

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
      subscription.unsubscribe();
    };
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
      const { error } = await supabase.auth.updateUser({ 
        password: formData.password 
      });

      if (error) throw error;

      toast({
        title: "Contraseña actualizada",
        description: "Ya puedes ingresar con tu nueva clave.",
      });

      navigate("/admin");

    } catch (err: any) {
      setErrorMsg(err.message || "Error al actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  if (verifyingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Validando enlace de seguridad...</p>
      </div>
    );
  }

  if (errorMsg && !formData.email) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg text-center border border-red-100">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-red-100 rounded-full">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No se pudo verificar</h2>
                <p className="text-gray-600 mb-6">{errorMsg}</p>
                <button 
                  onClick={() => navigate("/admin")}
                  className="text-blue-600 font-medium hover:underline"
                >
                    Volver al inicio de sesión
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {flowType === 'invite' ? "Bienvenido" : "Nueva Contraseña"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {flowType === 'invite' 
              ? `Configura el acceso para ${formData.email}`
              : "Ingresa tu nueva contraseña para recuperar el acceso."
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
