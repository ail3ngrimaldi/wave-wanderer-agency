import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verifyingSession, setVerifyingSession] = useState(true); // Nuevo estado de carga inicial
  const [showPassword, setShowPassword] = useState(false);
  
  // Leemos el hash INMEDIATAMENTE al inicializar el estado
  const getInitialFlowType = () => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    if (type === 'invite') return 'invite';
    if (type === 'recovery') return 'recovery';
    return null; // Si es null, no debería estar aquí
  };

  const [flowType, setFlowType] = useState<"invite" | "recovery" | null>(getInitialFlowType());
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        // 1. Verificar sesión actual
        const { data: { session } } = await supabase.auth.getSession();
        
        // 2. Si no hay sesión, esperamos al evento de cambio de estado (Supabase procesando el hash)
        if (!session) {
          // Escuchar si Supabase logra loguear al usuario con el token de la URL
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') {
              if (session) {
                setFormData(prev => ({ ...prev, email: session.user.email || '' }));
                
                // Si recuperamos la sesión pero no sabíamos el tipo (ej: magic link puro), asumimos recovery
                if (!flowType) setFlowType('recovery');
                setVerifyingSession(false);
              }
            }
          });
          
          // Si pasan 2 segundos y no hay sesión, es que el link es inválido o expiró
          setTimeout(() => {
             // Chequeamos una ultima vez
             supabase.auth.getSession().then(({ data: { session: finalSession } }) => {
                if (!finalSession) {
                    setErrorMsg("El enlace es inválido o ha expirado.");
                    setVerifyingSession(false);
                }
             });
          }, 2000);

          return () => subscription.unsubscribe();
        } else {
          // Ya hay sesión activa
          setFormData(prev => ({ ...prev, email: session.user.email || '' }));
          if (!flowType) setFlowType('recovery'); // Default a recovery si ya estaba logueado
          setVerifyingSession(false);
        }

      } catch (error) {
        console.error("Error verificando sesión:", error);
        setVerifyingSession(false);
      }
    };

    checkSession();
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
      // AQUÍ ESTÁ LA CLAVE: SIEMPRE ES updateUser
      // Porque el usuario ya existe (sea invitado o recuperando)
      const { error } = await supabase.auth.updateUser({ 
        password: formData.password 
      });

      if (error) throw error;

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña se ha establecido correctamente.",
      });

      navigate("/admin");

    } catch (err: any) {
      setErrorMsg(err.message || "Error al actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  // Renderizado de carga inicial
  if (verifyingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-500">Verificando enlace...</p>
        </div>
      </div>
    );
  }

  // Si terminó de cargar y NO detectó un flujo válido (alguien entró directo a la URL)
  if (!formData.email && !flowType) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Enlace no válido</h2>
                <p className="text-gray-600 mb-6">No hemos detectado una solicitud válida de recuperación o invitación.</p>
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
            {flowType === 'invite' ? "Bienvenido" : "Nueva Contraseña"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {flowType === 'invite' 
              ? "Crea tu contraseña para activar tu cuenta."
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
