import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    navigate("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-5">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-line p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-ink">
            <LogIn size={16} className="text-cream" />
          </div>
          <span className="text-lg font-heading font-bold text-ink">
            Baby <span className="text-sagedark font-medium">Bodega</span> Admin
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-inksoft block mb-1">Correo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-line outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-inksoft block mb-1">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-line outline-none text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-sm font-semibold bg-ink text-cream disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <Link to="/" className="block text-center text-xs text-inksoft mt-5">
          Volver al sitio
        </Link>
      </div>
    </div>
  );
}
