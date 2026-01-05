import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import logoViasol from "@/assets/logo-viasol.svg";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Escuchar cambios de autenticación (incluye cuando Supabase procesa el token del hash)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      
      if (event === 'PASSWORD_RECOVERY') {
        // El usuario viene del link de recuperación
        setUserEmail(session?.user?.email || "");
        setCheckingSession(false);
      } else if (event === 'SIGNED_IN' && session) {
        // Ya tiene sesión activa
        setUserEmail(session.user.email || "");
        setCheckingSession(false);
      }
    });

    // También verificar si ya hay una sesión (por si el token ya fue procesado)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserEmail(session.user.email || "");
        setCheckingSession(false);
      }
    });

    // Timeout de seguridad: si después de 3 segundos no hay sesión, mostrar error
    const timeout = setTimeout(() => {
      setCheckingSession(prev => {
        if (prev) {
          setErrorMsg("El enlace de recuperación ha expirado o es inválido. Solicita uno nuevo.");
          return false;
        }
        return prev;
      });
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validaciones
    if (password.length < 8) {
      setErrorMsg("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate("/admin"), 2000);
  };

  // Pantalla de carga mientras verifica sesión
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
           style={{ background: 'linear-gradient(180deg, hsl(185 40% 96%) 0%, hsl(185 50% 90%) 100%)' }}>
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Pantalla de éxito
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
           style={{ background: 'linear-gradient(180deg, hsl(185 40% 96%) 0%, hsl(185 50% 90%) 100%)' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-navy">¡Contraseña actualizada!</h2>
          <p className="text-muted-foreground mt-2">Redirigiendo al panel...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(180deg, hsl(185 40% 96%) 0%, hsl(185 50% 90%) 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="flex justify-center mb-6">
            <img src={logoViasol} alt="Via Sol" className="w-24 h-24 object-contain" />
          </div>

          <h1 className="text-2xl font-bold text-navy text-center mb-2">
            Restablecer contraseña
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            {userEmail ? `Ingresa una nueva contraseña para ${userEmail}` : "Ingresa tu nueva contraseña"}
          </p>

          {errorMsg && !userEmail && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive mb-6">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p>{errorMsg}</p>
                <a href="/admin" className="underline text-sm mt-2 block">
                  Volver al login para solicitar nuevo enlace
                </a>
              </div>
            </div>
          )}

          {userEmail && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* Nueva contraseña */}
              <div>
                <label className="label-text flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="input-field pr-10"
                    required
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label className="label-text flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                  className="input-field"
                  required
                />
              </div>

              {errorMsg && userEmail && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errorMsg}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-cta w-full disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Actualizar contraseña"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
