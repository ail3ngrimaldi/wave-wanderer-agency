import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';
import logoViasol from "@/assets/logo-viasol.svg";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (!authLoading && isAuthenticated && isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Ingresa tu correo electrónico primero");
      return;
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/crear-cuenta`, // Reutilizamos la misma ruta
    });
    
    if (error) {
      setError(error.message);
    } else {
      toast({ title: "Email enviado", description: "Revisa tu correo para restablecer tu contraseña" });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error: loginError } = await login(email, password);
    
    if (loginError) {
      setError(getErrorMessage(loginError));
      setIsLoading(false);
      return;
    }

    // Wait a moment for role check to complete
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getErrorMessage = (error: string): string => {
    if (error.includes("Invalid login credentials")) {
      return "Correo o contraseña incorrectos";
    }
    if (error.includes("Email not confirmed")) {
      return "Por favor confirma tu correo electrónico";
    }
    return "Error al iniciar sesión. Intenta de nuevo.";
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, hsl(185 40% 96%) 0%, hsl(185 50% 90%) 100%)' }}>
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(180deg, hsl(185 40% 96%) 0%, hsl(185 50% 90%) 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={logoViasol}
              alt="Via Sol"
              className="w-24 h-24 object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold text-navy text-center mb-2">
            Panel de Administración
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="label-text flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@viasol.com"
                className="input-field"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="label-text flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="input-field"
                required
                minLength={6}
              />
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-cta w-full disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </span>
            </button>
            <p className="text-center mt-4 text-sm">
            <button 
              type="button"
              onClick={handleForgotPassword}
              className="text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </p>
          </form>

          {/* Back link */}
          <p className="text-center mt-6">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Volver al inicio
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
