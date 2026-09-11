import { Baby, CarFront, UtensilsCrossed, ShieldCheck, Bike, LayoutGrid, type LucideIcon } from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "coches-paseo": Baby,
  "coches-completos": ShieldCheck,
  "sillas-comer": UtensilsCrossed,
  "sillas-auto": CarFront,
  bicicletas: Bike,
};

export const DEFAULT_CATEGORY_ICON = LayoutGrid;
