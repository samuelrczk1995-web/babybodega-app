import { useEffect, useState, type FormEvent } from "react";
import { UserPlus } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { supabase, supabaseNoSession } from "../../lib/supabaseClient";
import type { Profile, Role } from "../../types";

export default function Users() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>("staff");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: true });
    setProfiles((data as Profile[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setCreating(true);

    // Usamos un cliente SIN sesión persistente para que este signUp no reemplace
    // la sesión del administrador que está usando el panel ahora mismo.
    const { data, error: signUpError } = await supabaseNoSession.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (signUpError || !data.user) {
      setCreating(false);
      setError(signUpError?.message || "No se pudo crear el usuario.");
      return;
    }

    // El trigger de la base de datos ya creó la fila en "profiles" con role='client'.
    // Ahora, como administrador, actualizamos el rol y el nombre con el cliente CON sesión.
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role, full_name: fullName })
      .eq("id", data.user.id);

    setCreating(false);

    if (updateError) {
      setError(
        "El usuario se creó, pero no se pudo asignar el rol automáticamente. Puedes editarlo abajo cuando la lista se actualice."
      );
    } else {
      setSuccess(`Usuario ${email} creado con rol "${role}".`);
    }

    setEmail("");
    setPassword("");
    setFullName("");
    setRole("staff");
    load();
  }

  async function handleRoleChange(id: string, newRole: Role) {
    await supabase.from("profiles").update({ role: newRole }).eq("id", id);
    load();
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-heading font-semibold text-ink mb-6">Usuarios</h1>

      <div className="bg-white rounded-2xl border border-line p-6 max-w-lg mb-8">
        <h2 className="text-base font-heading font-semibold text-ink mb-4 flex items-center gap-2">
          <UserPlus size={18} />
          Crear nuevo usuario
        </h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <input
            required
            type="text"
            placeholder="Nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-line outline-none text-sm"
          />
          <input
            required
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-line outline-none text-sm"
          />
          <input
            required
            type="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-line outline-none text-sm"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="px-4 py-2.5 rounded-xl border border-line outline-none text-sm bg-white"
          >
            <option value="staff">Staff (empleado)</option>
            <option value="admin">Admin</option>
          </select>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-sagedark">{success}</p>}
          <button
            type="submit"
            disabled={creating}
            className="self-start px-5 py-2.5 rounded-full text-sm font-semibold bg-ink text-cream disabled:opacity-60"
          >
            {creating ? "Creando..." : "Crear usuario"}
          </button>
        </form>
      </div>

      <h2 className="text-base font-heading font-semibold text-ink mb-3">Usuarios existentes</h2>
      {loading ? (
        <div className="text-sm text-inksoft">Cargando...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-line divide-y divide-line max-w-lg">
          {profiles.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-sm text-ink font-medium">{p.full_name || "(sin nombre)"}</div>
                <div className="text-xs text-inksoft">{p.id}</div>
              </div>
              <select
                value={p.role}
                onChange={(e) => handleRoleChange(p.id, e.target.value as Role)}
                className="text-xs px-2 py-1.5 rounded-lg border border-line bg-white"
              >
                <option value="client">Client</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
