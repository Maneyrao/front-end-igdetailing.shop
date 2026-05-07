-- IG DETAIL - Initial catalog seed
-- Run after schema.sql if you want to load the current mock catalog into Supabase.

begin;

insert into products (
  name,
  slug,
  category,
  price,
  stock,
  status,
  image,
  short_description,
  description,
  what_is_it_for,
  how_to_use,
  related_products,
  is_best_seller,
  is_active
) values
(
  'Shampoo pH Neutro',
  'ph-neutral-car-shampoo',
  'wash',
  24990,
  30,
  'active',
  'https://images.unsplash.com/photo-1697273245326-1a3736f6f428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzaGFtcG9vJTIwYm90dGxlJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzY0NDE0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'Lavado seguro sin marcas para todo tipo de pintura',
  'Fórmula pH neutro de alta lubricación que remueve suciedad sin barrer ceras ni selladores. Espuma abundante para lavado seguro.',
  'Lavado de mantenimiento semanal sin dañar pintura, cera o coating. Seguro para terminaciones brillantes, mate o ploteadas.',
  '1. Diluir en balde con agua. 2. Lavar con guante o microfibra en líneas rectas. 3. Enjuagar bien. 4. Secar con toalla limpia.',
  array['wash-mitt', 'drying-towel', 'wheel-cleaner'],
  true,
  true
),
(
  'Set de Microfibras Premium',
  'premium-microfiber-towel-set',
  'accessories',
  34990,
  25,
  'active',
  'https://images.unsplash.com/photo-1714058948946-8fc9c3fa6a67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtaWNyb2ZpYmVyJTIwdG93ZWwlMjBjbGVhbmluZ3xlbnwxfHx8fDE3NzY0NDE0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'Toallas profesionales ultra suaves 800 GSM (pack x6)',
  'Microfibras de calidad profesional separadas por color para cada tarea. No rayan, no dejan pelusa y tienen alta absorción.',
  'Secado, buffing y limpieza interior sin rayar. Los colores ayudan a evitar contaminación cruzada entre tareas.',
  'Usar colores por tarea: una para secado, otra para retiro de cera y otra para interior. Doblar en cuartos y lavar sin suavizante.',
  array['premium-shampoo', 'interior-detailer', 'ceramic-wax'],
  true,
  true
),
(
  'Cera Cerámica en Spray',
  'ceramic-spray-wax',
  'protection',
  39990,
  18,
  'active',
  'https://images.unsplash.com/photo-1678383407784-41d006e088c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3YXglMjBwb2xpc2glMjBib3R0bGV8ZW58MXx8fHwxNzc2NDQxNDA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'Protección en spray fácil de aplicar, hasta 3 meses',
  'Fórmula híbrida SiO2 con brillo inmediato, protección UV y efecto hidrofóbico. Ideal para mantener la pintura protegida.',
  'Agregar una capa protectora que repele agua, facilita futuros lavados y mejora el brillo. Puede usarse como ayuda de secado o sellador.',
  '1. Aplicar sobre pintura limpia, húmeda o seca. 2. Trabajar panel por panel. 3. Esparcir con microfibra. 4. Repasar hasta lograr brillo.',
  array['premium-shampoo', 'microfiber-set', 'paint-polish'],
  true,
  true
),
(
  'Limpiador y Acondicionador de Cuero',
  'leather-cleaner-conditioner',
  'interior',
  29990,
  14,
  'active',
  'https://images.unsplash.com/photo-1590456744036-1467d08b88a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBpbnRlcmlvciUyMGNsZWFuJTIwbGVhdGhlcnxlbnwxfHx8fDE3NzY0NDE0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'Limpieza suave y acondicionador para butacas de cuero',
  'Fórmula balanceada que limpia y acondiciona en un paso. Remueve suciedad y grasitud mientras ayuda a prevenir resequedad.',
  'Mantener butacas, volantes y paneles de cuero. Ayuda a conservar la suavidad y prevenir envejecimiento prematuro.',
  '1. Aspirar primero. 2. Aplicar en paño o aplicador. 3. Trabajar suavemente. 4. Retirar con microfibra limpia. 5. Dejar terminación seca.',
  array['interior-detailer', 'microfiber-set', 'interior-kit'],
  false,
  true
),
(
  'Quick Detailer Interior',
  'interior-quick-detailer',
  'interior',
  19990,
  20,
  'active',
  'https://images.unsplash.com/photo-1590456744036-1467d08b88a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBpbnRlcmlvciUyMGNsZWFuJTIwbGVhdGhlcnxlbnwxfHx8fDE3NzY0NDE0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'Limpieza rápida para tablero, consola y plásticos',
  'Spray no graso para plásticos y vinilos interiores. Fórmula antiestática con terminación natural, sin brillo artificial.',
  'Limpieza rápida y protección ligera de tablero, paneles, consola y superficies plásticas entre limpiezas profundas.',
  '1. Rociar sobre microfibra, no directo en la superficie. 2. Pasar sobre plásticos. 3. Repasar con lado limpio. Usar con cuidado en pantallas.',
  array['leather-cleaner', 'microfiber-set', 'interior-kit'],
  false,
  true
),
(
  'Limpiador de Llantas y Cubiertas',
  'tire-wheel-cleaner',
  'accessories',
  22990,
  22,
  'active',
  'https://images.unsplash.com/photo-1697273245326-1a3736f6f428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzaGFtcG9vJTIwYm90dGxlJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzY0NDE0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'Fórmula descontaminante para llantas y cubiertas',
  'Fórmula que cambia de color al disolver polvo de freno. Libre de ácido y segura para terminaciones de llantas.',
  'Limpieza profunda de polvo de freno, suciedad de calle y residuos en llantas y cubiertas.',
  '1. Aplicar en llantas frías. 2. Dejar actuar 3 a 5 minutos. 3. Cepillar si hace falta. 4. Enjuagar muy bien sin dejar secar.',
  array['premium-shampoo', 'wheel-brush', 'tire-dressing'],
  false,
  true
),
(
  'Kit Clay Bar Descontaminante',
  'clay-bar-kit',
  'accessories',
  27990,
  12,
  'active',
  'https://images.unsplash.com/photo-1620584898989-d39f7f9ed1b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXRhaWxpbmclMjBraXQlMjBwcm9kdWN0cyUyMHRvb2xzfGVufDF8fHx8MTc3NjQ0MTQwNnww&ixlib=rb-4.1.0&q=80&w=1080',
  'Remueve contaminantes adheridos y deja la pintura suave',
  'Clay bar de grado medio con lubricante para remover savia, overspray, polvo ferroviario y contaminación adherida.',
  'Descontaminar pintura antes de pulir o proteger. Remueve lo que un lavado común no logra retirar.',
  '1. Lavar y secar el auto. 2. Lubricar una zona chica. 3. Pasar clay con poca presión. 4. Retirar residuos. 5. Amasar la clay al ensuciarse.',
  array['paint-polish', 'ceramic-wax', 'shine-kit'],
  false,
  true
),
(
  'Pulidor One-Step',
  'one-step-paint-polish',
  'protection',
  32990,
  10,
  'active',
  'https://images.unsplash.com/photo-1723659081228-94b14d1e61d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBkZXRhaWwlMjBzaGluZXxlbnwxfHx8fDE3NzYzODI1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'Corrige marcas leves y recupera profundidad de brillo',
  'Pulidor todo en uno para marcas leves, swirls y oxidación ligera. Puede aplicarse a mano o con máquina.',
  'Corregir imperfecciones menores y recuperar claridad en pinturas opacas o con micro-rayas.',
  '1. Trabajar a la sombra con pintura fría. 2. Aplicar poca cantidad. 3. Pulir por secciones. 4. Retirar con microfibra limpia.',
  array['clay-bar', 'ceramic-wax', 'microfiber-set'],
  false,
  true
)
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  price = excluded.price,
  stock = excluded.stock,
  status = excluded.status,
  image = excluded.image,
  short_description = excluded.short_description,
  description = excluded.description,
  what_is_it_for = excluded.what_is_it_for,
  how_to_use = excluded.how_to_use,
  related_products = excluded.related_products,
  is_best_seller = excluded.is_best_seller,
  is_active = excluded.is_active;

insert into kits (
  name,
  slug,
  price,
  stock,
  status,
  image,
  description,
  short_description,
  is_best_seller,
  is_active,
  items
) values
(
  'Kit Principiante',
  'kit-principiante',
  89990,
  0,
  'active',
  'https://images.unsplash.com/photo-1620584898989-d39f7f9ed1b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'Kit completo con shampoo pH neutro, toallas de microfibra, limpiador de llantas y spray de interior. Ideal para quien empieza.',
  'Todo lo que necesitás para empezar a detallar',
  true,
  true,
  jsonb_build_array(
    jsonb_build_object('product_id', (select id::text from products where slug = 'ph-neutral-car-shampoo'), 'quantity', 1),
    jsonb_build_object('product_id', (select id::text from products where slug = 'premium-microfiber-towel-set'), 'quantity', 1),
    jsonb_build_object('product_id', (select id::text from products where slug = 'tire-wheel-cleaner'), 'quantity', 1),
    jsonb_build_object('product_id', (select id::text from products where slug = 'interior-quick-detailer'), 'quantity', 1)
  )
),
(
  'Kit Interior Completo',
  'kit-interior-completo',
  79990,
  0,
  'active',
  'https://images.unsplash.com/photo-1590456744036-1467d08b88a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'Limpiador y acondicionador de cuero, detailer de interior y microfibras especializadas. Para tapizados, tablero y consola.',
  'Limpieza y protección profunda del interior',
  true,
  true,
  jsonb_build_array(
    jsonb_build_object('product_id', (select id::text from products where slug = 'leather-cleaner-conditioner'), 'quantity', 1),
    jsonb_build_object('product_id', (select id::text from products where slug = 'interior-quick-detailer'), 'quantity', 1),
    jsonb_build_object('product_id', (select id::text from products where slug = 'premium-microfiber-towel-set'), 'quantity', 1)
  )
),
(
  'Kit Brillo Total',
  'kit-brillo-total',
  129990,
  0,
  'active',
  'https://images.unsplash.com/photo-1723659081228-94b14d1e61d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'Sistema de corrección y protección premium. Incluye arcilla descontaminante, pulidor, cera cerámica y aplicadores.',
  'Máximo brillo y protección para obsesionados con la pintura',
  true,
  true,
  jsonb_build_array(
    jsonb_build_object('product_id', (select id::text from products where slug = 'clay-bar-kit'), 'quantity', 1),
    jsonb_build_object('product_id', (select id::text from products where slug = 'one-step-paint-polish'), 'quantity', 1),
    jsonb_build_object('product_id', (select id::text from products where slug = 'ceramic-spray-wax'), 'quantity', 1),
    jsonb_build_object('product_id', (select id::text from products where slug = 'premium-microfiber-towel-set'), 'quantity', 1)
  )
)
on conflict (slug) do update set
  name = excluded.name,
  price = excluded.price,
  stock = excluded.stock,
  status = excluded.status,
  image = excluded.image,
  description = excluded.description,
  short_description = excluded.short_description,
  is_best_seller = excluded.is_best_seller,
  is_active = excluded.is_active,
  items = excluded.items;

commit;
