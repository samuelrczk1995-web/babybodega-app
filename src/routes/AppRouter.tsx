import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Catalog from "../pages/Catalog";
import ProductDetail from "../pages/ProductDetail";
import CategoryPage from "../pages/CategoryPage";
import Offers from "../pages/Offers";
import Featured from "../pages/Featured";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

import Dashboard from "../pages/admin/Dashboard";
import ProductsList from "../pages/admin/ProductsList";
import ProductNew from "../pages/admin/ProductNew";
import ProductEdit from "../pages/admin/ProductEdit";
import Categories from "../pages/admin/Categories";
import Brands from "../pages/admin/Brands";
import Users from "../pages/admin/Users";
import SettingsPage from "../pages/admin/SettingsPage";

import { RequireAuth } from "./RequireAuth";
import { RequireRole } from "./RequireRole";

export default function AppRouter() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Catalog />} />
      <Route path="/productos/:id" element={<ProductDetail />} />
      <Route path="/categoria/:slug" element={<CategoryPage />} />
      <Route path="/ofertas" element={<Offers />} />
      <Route path="/destacados" element={<Featured />} />
      <Route path="/login" element={<Login />} />

      {/* Administrativas */}
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/productos"
        element={
          <RequireAuth>
            <ProductsList />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/productos/nuevo"
        element={
          <RequireAuth>
            <ProductNew />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/productos/:id/editar"
        element={
          <RequireAuth>
            <ProductEdit />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/categorias"
        element={
          <RequireAuth>
            <Categories />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/marcas"
        element={
          <RequireAuth>
            <Brands />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <RequireAuth>
            <RequireRole roles={["admin"]}>
              <Users />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/configuracion"
        element={
          <RequireAuth>
            <SettingsPage />
          </RequireAuth>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
