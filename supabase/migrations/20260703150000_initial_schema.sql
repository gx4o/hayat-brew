-- Hayat Brew — initial schema
-- Equipment (V60, coffee machine) is separate from recipes so one piece of
-- equipment can host many recipes in the future (custom recipe builder).

create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  subtitle_ar text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.serving_units (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  quantity_question_ar text,
  volume_ml numeric not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  equipment_id uuid not null references public.equipment (id) on delete cascade,
  style text not null check (style in ('hot', 'iced')),
  name_ar text not null,
  description_ar text,
  ratio_label text,
  -- All ingredient amounts are defined per one serving of this volume;
  -- the TypeScript engine scales them by (unit volume / reference volume) x quantity.
  reference_volume_ml numeric not null default 200,
  temp_min_c numeric,
  temp_max_c numeric,
  light_roast_note_ar text,
  grind_note_ar text,
  serving_ice_note_ar text,
  -- Bloom water = coffee grams x multiplier (V60 recipes only).
  bloom_water_multiplier numeric,
  bloom_seconds_min integer,
  bloom_seconds_max integer,
  estimated_brew_seconds integer,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  -- Open-ended slug (coffee, water, server_ice, ... milk, honey later).
  ingredient_slug text not null,
  name_ar text not null,
  unit text not null check (unit in ('g', 'ml')),
  amount_per_serving numeric not null,
  sort_order integer not null default 0,
  unique (recipe_id, ingredient_slug)
);

create table public.recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  step_number integer not null,
  title_ar text not null,
  -- May contain placeholders like {coffee_g} resolved by the engine.
  instruction_ar text not null,
  timer_seconds integer,
  -- For pour steps: cumulative share of total brew water (0..1).
  cumulative_water_fraction numeric,
  unique (recipe_id, step_number)
);

-- Row Level Security: the app reads recipe data with the publishable key.
-- No insert/update/delete policies exist, so writes are denied by default.
alter table public.equipment enable row level security;
alter table public.serving_units enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.recipe_steps enable row level security;

create policy "public read equipment"
  on public.equipment for select to anon, authenticated using (true);

create policy "public read serving_units"
  on public.serving_units for select to anon, authenticated using (true);

create policy "public read recipes"
  on public.recipes for select to anon, authenticated using (true);

create policy "public read recipe_ingredients"
  on public.recipe_ingredients for select to anon, authenticated using (true);

create policy "public read recipe_steps"
  on public.recipe_steps for select to anon, authenticated using (true);
