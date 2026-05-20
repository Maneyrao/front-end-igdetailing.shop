# Logica reciclada desde v0-admin-dashboard-refactor

Referencia: `https://github.com/Maneyrao/v0-admin-dashboard-refactor`

La app IG Detail no migra a Next.js, pero toma del panel de Roma estas ideas:

1. Vista separada de inventario.
2. Alertas rapidas de productos sin stock y stock bajo.
3. Tabla ordenada por stock ascendente para resolver primero los faltantes.
4. Ajuste rapido de stock con botones `+` y `-`.
5. Busqueda por nombre, descripcion o categoria.

Adaptacion realizada:

- Nueva ruta `/admin/inventory`.
- Nuevo item "Inventario" en el sidebar.
- La vista usa Supabase directo y los estilos actuales del panel de IG Detail.

Pendiente para otra etapa:

- Variantes de producto como en `product-variants-form`.
- Imagenes multiples por producto con `product_media`.
- Filtros de ordenes en componentes separados.
- Badges de estado reutilizables en todo el admin.
