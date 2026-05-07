# Logica reciclada desde backend-roma

Referencia: `https://github.com/Maneyrao-Studio/backend-roma`

La app IG Detail mantiene Supabase como backend directo, pero toma estas reglas de negocio
del backend de Roma:

1. Los productos tienen `stock` y `status`.
2. El catalogo publico solo muestra productos/kits activos.
3. El checkout valida stock antes de crear la orden.
4. El stock no se descuenta al crear la orden, porque el pago manual todavia esta pendiente.
5. El descuento real de stock ocurre cuando el admin marca la orden como pagada.
6. La transicion a pagado usa la funcion SQL `mark_order_paid(order_id)`, que valida stock y descuenta dentro de una transaccion.
7. Si la orden contiene un kit, el descuento se hace sobre los productos componentes del kit.

Pendiente para una segunda etapa:

- Variantes de producto (`product_variants`).
- Media avanzada por producto (`product_media` + Supabase Storage).
- Categorias administrables desde DB.
- Roles admin mas estrictos por perfil.
