import type { Product } from "../types";

export function effectivePrice(p: Pick<Product, "normal_price" | "discount_price" | "is_on_sale">) {
  return p.is_on_sale && p.discount_price ? p.discount_price : p.normal_price;
}

export function discountPct(p: Pick<Product, "normal_price" | "discount_price" | "is_on_sale">) {
  if (!p.is_on_sale || !p.discount_price) return 0;
  return Math.round((1 - p.discount_price / p.normal_price) * 100);
}

export function money(n: number) {
  return `Bs. ${n.toLocaleString("es-BO")}`;
}

export function buildWhatsAppLink(phoneNumber: string, product: Product) {
  const price = effectivePrice(product);
  const message = `Hola, estoy interesado en el producto ${product.name}, publicado a ${money(
    price
  )}.`;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
