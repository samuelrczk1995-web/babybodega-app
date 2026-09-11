import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Tags, Award, Users, Settings, LogOut } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useProfile } from "../../hooks/useProfile";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/productos", label: "Productos", icon: Package },
  { to: "/admin/categorias", label: "Categorías", icon: Tags },
  { to: "/admin/marcas", label: "Marcas", icon: Award },
  { to: "/admin/usuarios", label: "Usuarios", icon: Users, adminOnly: true },
  { to: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { profile } = useProfile();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="w-56 flex-shrink-0 bg-white border-r border-line hidden md:flex flex-col">
        <div className="px-5 py-5 border-b border-line">
          <span className="text-base font-heading font-bold text-ink">
            Baby <span className="text-sagedark font-medium">Bodega</span>
          </span>
          <div className="text-xs text-inksoft mt-1">Panel administrativo</div>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
          {NAV_ITEMS.filter((item) => !item.adminOnly || profile?.role === "admin").map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? "bg-ink text-cream" : "text-inksoft hover:bg-creamsoft"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-line">
          <div className="text-xs text-inksoft px-3 mb-2">{profile?.full_name || "Usuario"} · {profile?.role}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-inksoft hover:bg-creamsoft w-full"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-line px-4 py-3 flex items-center justify-between">
        <span className="text-base font-heading font-bold text-ink">
          Baby <span className="text-sagedark font-medium">Bodega</span> Admin
        </span>
        <button onClick={handleLogout} className="text-xs text-inksoft flex items-center gap-1">
          <LogOut size={14} /> Salir
        </button>
      </div>

      <div className="flex-1 flex flex-col md:pt-0 pt-14">
        <div className="md:hidden flex overflow-x-auto gap-2 px-4 py-2 bg-creamsoft border-b border-line">
          {NAV_ITEMS.filter((item) => !item.adminOnly || profile?.role === "admin").map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  isActive ? "bg-ink text-cream" : "bg-white text-inksoft border border-line"
                }`
              }
            >
              <item.icon size={13} />
              {item.label}
            </NavLink>
          ))}
        </div>
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
