import { useRef, useState } from "react";
import { Upload, X, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import type { ProductImage } from "../../types";

export function ImageUploader({
  productId,
  images,
  onChange,
}: {
  productId: string;
  images: ProductImage[];
  onChange: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${productId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file);
      if (uploadError) {
        setError(uploadError.message);
        continue;
      }

      const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(path);
      const nextOrder = images.length;

      await supabase.from("product_images").insert({
        product_id: productId,
        storage_path: path,
        image_url: publicUrl.publicUrl,
        sort_order: nextOrder,
      });
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    onChange();
  }

  async function handleDelete(image: ProductImage) {
    await supabase.storage.from("product-images").remove([image.storage_path]);
    await supabase.from("product_images").delete().eq("id", image.id);
    onChange();
  }

  async function handleReorder(image: ProductImage, direction: "up" | "down") {
    const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((i) => i.id === image.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx];
    const b = sorted[swapIdx];
    await supabase.from("product_images").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from("product_images").update({ sort_order: a.sort_order }).eq("id", b.id);
    onChange();
  }

  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-3">
        {sorted.map((img, i) => (
          <div key={img.id} className="relative rounded-xl overflow-hidden border border-line aspect-square group bg-creamsoft">
            <img src={img.image_url} alt="" className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => handleReorder(img, "up")}
                disabled={i === 0}
                className="p-1.5 bg-white rounded-full disabled:opacity-40"
              >
                <ArrowUp size={12} />
              </button>
              <button
                type="button"
                onClick={() => handleReorder(img, "down")}
                disabled={i === sorted.length - 1}
                className="p-1.5 bg-white rounded-full disabled:opacity-40"
              >
                <ArrowDown size={12} />
              </button>
              <button type="button" onClick={() => handleDelete(img)} className="p-1.5 bg-white rounded-full">
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
        <label className="aspect-square rounded-xl border-2 border-dashed border-line flex flex-col items-center justify-center gap-1 cursor-pointer text-inksoft hover:bg-creamsoft">
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          <span className="text-xs">{uploading ? "Subiendo..." : "Agregar foto"}</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <p className="text-xs text-inksoft">Recomendado: 2 a 4 fotos por producto. Se guardan automáticamente.</p>
    </div>
  );
}
