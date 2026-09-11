import { Link } from "react-router-dom";
import { PublicLayout } from "../components/layout/PublicLayout";

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="text-center py-24">
        <h1 className="text-2xl font-heading font-semibold text-ink mb-3">Página no encontrada</h1>
        <Link to="/" className="text-sagedark text-sm font-medium">
          Volver al inicio
        </Link>
      </div>
    </PublicLayout>
  );
}
