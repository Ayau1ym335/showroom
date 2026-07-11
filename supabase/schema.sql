-- =========================================================
-- DORI SHOP — SUPABASE SCHEMA
-- Выполнить в Supabase SQL Editor целиком, одним запуском
-- =========================================================

create extension if not exists "uuid-ossp";

-- ========== КАТЕГОРИИ ==========
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  parent_id uuid references categories(id) on delete cascade,
  gender text check (gender in ('female', 'male', 'kids')), -- null для дочерних категорий, обязателен для корневых
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ========== БРЕНДЫ ==========
create table brands (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  logo_url text,
  created_at timestamptz not null default now()
);

-- ========== ТОВАРЫ ==========
create table products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  category_id uuid references categories(id) on delete set null,
  brand_id uuid references brands(id) on delete set null,
  gender text not null check (gender in ('female', 'male', 'kids')),
  age_group text, -- только для kids: "3 года", "128см"
  price numeric(12,2) not null,
  discount_price numeric(12,2),
  is_new boolean not null default false,     -- флаг "новая коллекция"
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on products(category_id);
create index products_brand_idx on products(brand_id);
create index products_gender_idx on products(gender);
create index products_is_new_idx on products(is_new) where is_new = true;
create index products_is_published_idx on products(is_published) where is_published = true;
-- полнотекстовый поиск по названию и описанию
create index products_search_idx on products using gin (to_tsvector('russian', title || ' ' || coalesce(description, '')));

-- ========== РАЗМЕРЫ ТОВАРА (бинарное наличие) ==========
create table product_sizes (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  size_label text not null,      -- "S", "42", "128см"
  in_stock boolean not null default true,
  sort_order int not null default 0
);

create index product_sizes_product_idx on product_sizes(product_id);

-- ========== МЕДИА ТОВАРА ==========
create table product_media (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video')),
  url text not null,
  thumbnail_url text,
  sort_order int not null default 0
);

create index product_media_product_idx on product_media(product_id);

-- ========== ОТЗЫВЫ ==========
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  author_name text not null,
  author_photo_url text,
  rating int not null check (rating between 1 and 5),
  text text not null,
  is_published boolean not null default false, -- по умолчанию на модерации
  created_at timestamptz not null default now()
);

-- ========== ВИДЕО ЛУКБУКА ==========
create table lookbook_videos (
  id uuid primary key default uuid_generate_v4(),
  video_url text not null,
  thumbnail_url text,
  caption text,
  sort_order int not null default 0,
  is_active boolean not null default true
);

-- ========== БАННЕРЫ ==========
create table banners (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  title text,
  subtitle text,
  link_url text,
  sort_order int not null default 0,
  is_active boolean not null default true
);

-- ========== INSTAGRAM-СЕТКА ==========
create table instagram_posts (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  post_url text,
  sort_order int not null default 0
);

-- ========== НАСТРОЙКИ САЙТА (singleton) ==========
create table site_settings (
  id int primary key default 1,
  whatsapp_number text not null default '77017772419',
  instagram_url text not null default 'https://www.instagram.com/dori__fashionstore/',
  phone text,
  work_hours text,
  constraint single_row check (id = 1)
);

insert into site_settings (id) values (1);

-- =========================================================
-- ROW LEVEL SECURITY
-- Публичные посетители: только чтение опубликованного
-- Запись: только для авторизованных пользователей (админы)
-- =========================================================

alter table categories enable row level security;
alter table brands enable row level security;
alter table products enable row level security;
alter table product_sizes enable row level security;
alter table product_media enable row level security;
alter table reviews enable row level security;
alter table lookbook_videos enable row level security;
alter table banners enable row level security;
alter table instagram_posts enable row level security;
alter table site_settings enable row level security;

-- Публичное чтение
create policy "public read categories" on categories for select using (true);
create policy "public read brands" on brands for select using (true);
create policy "public read published products" on products for select using (is_published = true);
create policy "public read product_sizes" on product_sizes for select using (true);
create policy "public read product_media" on product_media for select using (true);
create policy "public read published reviews" on reviews for select using (is_published = true);
create policy "public read active lookbook" on lookbook_videos for select using (is_active = true);
create policy "public read active banners" on banners for select using (is_active = true);
create policy "public read instagram_posts" on instagram_posts for select using (true);
create policy "public read site_settings" on site_settings for select using (true);

-- Полный доступ для авторизованных (админ) пользователей
create policy "admin full access categories" on categories for all using (auth.role() = 'authenticated');
create policy "admin full access brands" on brands for all using (auth.role() = 'authenticated');
create policy "admin full access products" on products for all using (auth.role() = 'authenticated');
create policy "admin full access product_sizes" on product_sizes for all using (auth.role() = 'authenticated');
create policy "admin full access product_media" on product_media for all using (auth.role() = 'authenticated');
create policy "admin full access reviews" on reviews for all using (auth.role() = 'authenticated');
create policy "admin full access lookbook" on lookbook_videos for all using (auth.role() = 'authenticated');
create policy "admin full access banners" on banners for all using (auth.role() = 'authenticated');
create policy "admin full access instagram_posts" on instagram_posts for all using (auth.role() = 'authenticated');
create policy "admin full access site_settings" on site_settings for all using (auth.role() = 'authenticated');

-- =========================================================
-- STORAGE BUCKETS
-- Выполнить отдельно или через Supabase Dashboard → Storage
-- =========================================================
insert into storage.buckets (id, name, public) values ('product-media', 'product-media', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('banners', 'banners', true)
  on conflict (id) do nothing;

create policy "public read product-media" on storage.objects for select using (bucket_id = 'product-media');
create policy "admin write product-media" on storage.objects for insert with check (bucket_id = 'product-media' and auth.role() = 'authenticated');
create policy "admin update product-media" on storage.objects for update using (bucket_id = 'product-media' and auth.role() = 'authenticated');
create policy "admin delete product-media" on storage.objects for delete using (bucket_id = 'product-media' and auth.role() = 'authenticated');

create policy "public read banners" on storage.objects for select using (bucket_id = 'banners');
create policy "admin write banners" on storage.objects for insert with check (bucket_id = 'banners' and auth.role() = 'authenticated');

-- =========================================================
-- СТАРТОВЫЕ КАТЕГОРИИ (соответствуют структуре из ТЗ)
-- =========================================================
insert into categories (name, slug, gender, sort_order) values
  ('Женское', 'zhenskoe', 'female', 1),
  ('Мужское', 'muzhskoe', 'male', 2),
  ('Детское', 'detskoe', 'kids', 3);

-- Подкатегории внутри "Женское"
insert into categories (name, slug, parent_id, sort_order)
  select 'Верхняя одежда', 'zhenskoe-verhnyaya-odezhda', id, 1 from categories where slug = 'zhenskoe'
  union all
  select 'Платья', 'zhenskoe-platya', id, 2 from categories where slug = 'zhenskoe'
  union all
  select 'Футболки и лонгсливы', 'zhenskoe-futbolki', id, 3 from categories where slug = 'zhenskoe'
  union all
  select 'Обувь', 'zhenskoe-obuv', id, 4 from categories where slug = 'zhenskoe'
  union all
  select 'Аксессуары', 'zhenskoe-aksessuary', id, 5 from categories where slug = 'zhenskoe';

-- Подкатегории внутри "Мужское"
insert into categories (name, slug, parent_id, sort_order)
  select 'Верхняя одежда', 'muzhskoe-verhnyaya-odezhda', id, 1 from categories where slug = 'muzhskoe'
  union all
  select 'Обувь', 'muzhskoe-obuv', id, 2 from categories where slug = 'muzhskoe';

-- Подкатегории внутри "Детское"
insert into categories (name, slug, parent_id, sort_order)
  select 'Одежда', 'detskoe-odezhda', id, 1 from categories where slug = 'detskoe'
  union all
  select 'Обувь', 'detskoe-obuv', id, 2 from categories where slug = 'detskoe';
