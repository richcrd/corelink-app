import type { Category } from "@/src/features/cart/types/Category";
import type { Product } from "@/src/features/cart/types/Product";

export const mockCategories: Category[] = [
  { id: "c1", name: "Frutas y Verduras" },
  { id: "c2", name: "Lácteos" },
  { id: "c3", name: "Bebidas" },
  { id: "c4", name: "Snacks" },
];

export const mockProducts: Product[] = [
  { id: "p1", name: "Banano", price: 0.25, categoryId: "c1", unit: "unidad" },
  { id: "p2", name: "Manzana", price: 0.35, categoryId: "c1", unit: "unidad" },
  { id: "p3", name: "Leche Entera", price: 1.15, categoryId: "c2", unit: "litro" },
  { id: "p4", name: "Queso", price: 2.75, categoryId: "c2", unit: "paq" },
  { id: "p5", name: "Agua", price: 0.55, categoryId: "c3", unit: "botella" },
  { id: "p6", name: "Gaseosa", price: 1.25, categoryId: "c3", unit: "botella" },
  { id: "p7", name: "Papas", price: 1.05, categoryId: "c4", unit: "bolsa" },
  { id: "p8", name: "Galletas", price: 0.95, categoryId: "c4", unit: "paq" },
];
