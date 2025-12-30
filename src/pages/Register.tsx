import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom"; // O "next/navigation" si usas Next.js

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    secretCode: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const ACCESS_CODE = "v14s0l26"; 

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    // 1. Verificar código de seguridad
    if (formData.secretCode !== ACCESS_CODE) {
      setErrorMsg("Código de acceso incorrecto.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    // 2. Crear usuario en Supabase
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      // 3. Login exitoso -> Redirigir al admin
      // Si "Confirm Email" está desactivado, entra directo.
      // Si está activado, data.session será null y deberás avisarles que revisen su correo.
      if (data.session) {
        navigate("/admin");
      } else {
        alert("Usuario creado. Por favor confirma tu correo electrónico antes de ingresar.");
        navigate("/login"); // O donde prefieras
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Crear Cuenta Administrativa
        </h2>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Código de Acceso</label>
            <input
              type="text"
              required
              placeholder="Pide el código al administrador"
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({ ...formData, secretCode: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Creando usuario..." : "Registrar y Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
