export const PRODUCT_CATEGORIES = [
  {
    slug: 'wash',
    name: 'Lavado',
    shortName: 'Lavado',
    description: 'Shampoo, descontaminado y mantenimiento seguro',
  },
  {
    slug: 'interior',
    name: 'Interior',
    shortName: 'Interior',
    description: 'Limpieza de plásticos, telas, cuero y aromas',
  },
  {
    slug: 'protection',
    name: 'Protección y brillo',
    shortName: 'Protección',
    description: 'Ceras, selladores y acabados para pintura',
  },
  {
    slug: 'accessories',
    name: 'Accesorios y herramientas',
    shortName: 'Accesorios',
    description: 'Microfibras, aplicadores y herramientas de trabajo',
  },
  {
    slug: 'kits',
    name: 'Kits completos',
    shortName: 'Kits',
    description: 'Combos armados para comprar sin vueltas',
    featured: true,
  },
] as const;

export type ProductCategorySlug = (typeof PRODUCT_CATEGORIES)[number]['slug'];

export const CATEGORY_LABELS = PRODUCT_CATEGORIES.reduce<Record<string, string>>((labels, category) => {
  labels[category.slug] = category.shortName;
  return labels;
}, {});

export const CATEGORY_INFO = PRODUCT_CATEGORIES.reduce<Record<string, { title: string; description: string }>>(
  (info, category) => {
    info[category.slug] = {
      title: category.name,
      description: category.description,
    };
    return info;
  },
  {}
);
