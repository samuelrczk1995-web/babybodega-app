import { AdminLayout } from "../../components/admin/AdminLayout";
import { ProductForm } from "../../components/admin/ProductForm";

export default function ProductNew() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-heading font-semibold text-ink mb-6">Nuevo producto</h1>
      <ProductForm />
    </AdminLayout>
  );
}
