import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useBrands } from "../../hooks/useBrands";
import { useCategories } from "../../hooks/useCategories";
import type { Product } from "../../types";
import { ImageUploader } from "./ImageUploader";

export function ProductForm({ product, onSaved }: { product?: Product; onSaved?: () => void }) {
  const { brands } = useBrands();
  const { categories } = useCategories();
  const navigate = useNavigate();

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [brandId, setBrandId] = useState(product?.brand_id || "");
  const [categoryId, setCategoryId] = useState(product?.category_id || "");
  const [normalPrice, setNormalPrice] = useState(product?.normal_price?.toString() || "");
  const [discountPrice, setDiscountPrice] = useState(product?.discount_price?.toString() || "");
  const [isOnSale, setIsOnSale] = useState(product?.is_on_sale || false);
  const [isAvailable, setIsAvailable] = useState(product?.is_available ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured || false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState(product?.product_images || []);

  async function refreshImages(productId: string) {
    const { data } = await supabase.from("product_images").select("*").eq("product_id", productId);
    setImages(data || []);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!brandId || !categoryId) {
      setError("Selecciona una marca y una categoría.");
      return;
    }

    setSaving(true);
    const payload = {
      name,
      description,
      brand_id: brandId,
      category_id: categoryId,
      normal_price: parseFloat(normalPrice),
      discount_price: isOnSale && discountPrice ? parseFloat(discountPrice) : null,
      is_on_sale: isOnSale,
      is_available: isAvailable,
      is_featured: isFeatured,
    };

    if (product) {
      const { error: updateError } = await supabase.from("products").update(payload).eq("id", product.id);
      setSaving(false);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      onSaved?.();
    } else {
      const { data, error: insertError } = await supabase.from("products").insert(payload).select().single();
      setSaving(false);
      if (insertError) {
        setError(insertError.message);
        return;
      }
      navigate(`/admin/productos/${data.id}/editar`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      <div>
        <label className="text-sm font-medium text-inksoft block mb-1">Nombre del producto</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-line outline-none text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-inksoft block mb-1">Descripción</label>
        <textarea
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Edad recomendada, características, colores, dimensiones, materiales..."
          className="w-full px-4 py-2.5 rounded-xl border border-line outline-none text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-inksoft block mb-1">Marca</label>
          <select
            required
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-line outline-none text-sm bg-white"
          >
            <option value="">Selecciona...</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-inksoft block mb-1">Categoría</label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-line outline-none text-sm bg-white"
          >
            <option value="">Selecciona...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-inksoft block mb-1">Precio normal (Bs.)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={normalPrice}
            onChange={(e) => setNormalPrice(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-line outline-none text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-inksoft block mb-1">Precio con descuento (Bs.)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            disabled={!isOnSale}
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-line outline-none text-sm disabled:bg-creamsoft disabled:text-inksoft"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={isOnSale} onChange={(e) => setIsOnSale(e.target.checked)} />
          En oferta
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
          Disponible
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
          Destacado
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="self-start px-6 py-3 rounded-full text-sm font-semibold bg-ink text-cream disabled:opacity-60"
      >
        {saving ? "Guardando..." : product ? "Guardar cambios" : "Crear producto"}
      </button>

      {product && (
        <div className="pt-4 border-t border-line">
          <label className="text-sm font-medium text-inksoft block mb-2">Fotografías</label>
          <ImageUploader productId={product.id} images={images} onChange={() => refreshImages(product.id)} />
        </div>
      )}
      {!product && (
        <p className="text-xs text-inksoft">
          Guarda el producto primero; después de crearlo podrás subir sus fotografías.
        </p>
      )}
    </form>
  );
}
