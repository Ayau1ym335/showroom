import { createClient } from '@/lib/supabase/server';
import { CatalogFilters, Product, Review, LookbookVideo, Banner, InstagramPost, SiteSettings, Category, Brand } from '@/types';

const PRODUCT_SELECT = `
  *,
  brand:brands(*),
  category:categories(*),
  sizes:product_sizes(*),
  media:product_media(*)
`;

export async function getNewCollection(limit = 4): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_published', true)
    .eq('is_new', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data as Product[]) ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  return data as Product | null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_published', true)
    .eq('category_id', product.category_id ?? '')
    .neq('id', product.id)
    .limit(limit);

  return (data as Product[]) ?? [];
}

export async function getCatalogProducts(filters: CatalogFilters, pageSize = 12) {
  const supabase = await createClient();

  // Если фильтр "только в наличии" — сначала получаем ID товаров у которых есть размер in_stock
  let inStockProductIds: string[] | null = null;
  if (filters.inStockOnly) {
    const { data: stockRows } = await supabase
      .from('product_sizes')
      .select('product_id')
      .eq('in_stock', true);
    inStockProductIds = [...new Set((stockRows ?? []).map((r) => r.product_id))];
  }

  let query = supabase.from('products').select(PRODUCT_SELECT, { count: 'exact' }).eq('is_published', true);

  if (inStockProductIds !== null) {
    if (inStockProductIds.length === 0) return { products: [], total: 0 };
    query = query.in('id', inStockProductIds);
  }

  if (filters.gender) query = query.eq('gender', filters.gender);

  if (filters.category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', filters.category).single();
    if (cat) query = query.eq('category_id', cat.id);
  }

  if (filters.brands && filters.brands.length > 0) {
    const { data: brandRows } = await supabase.from('brands').select('id').in('slug', filters.brands);
    const ids = (brandRows ?? []).map((b) => b.id);
    if (ids.length > 0) query = query.in('brand_id', ids);
  }

  if (filters.minPrice !== undefined) query = query.gte('price', filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte('price', filters.maxPrice);

  switch (filters.sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const page = filters.page ?? 1;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count } = await query;
  return { products: (data as Product[]) ?? [], total: count ?? 0 };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('*').order('sort_order');
  return (data as Category[]) ?? [];
}

export async function getBrands(): Promise<Brand[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('brands').select('*').order('name');
  return (data as Brand[]) ?? [];
}

export async function getPublishedReviews(): Promise<Review[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6);

  return (data as Review[]) ?? [];
}

export async function getLookbookVideos(): Promise<LookbookVideo[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lookbook_videos')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .limit(4);

  return (data as LookbookVideo[]) ?? [];
}

export async function getActiveBanner(): Promise<Banner | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .limit(1)
    .single();

  return data as Banner | null;
}

export async function getInstagramPosts(): Promise<InstagramPost[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('instagram_posts').select('*').order('sort_order').limit(6);
  return (data as InstagramPost[]) ?? [];
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();
  return (
    (data as SiteSettings) ?? {
      id: 1,
      whatsapp_number: '77017772419',
      instagram_url: 'https://www.instagram.com/dori__fashionstore/',
      phone: null,
      work_hours: null,
    }
  );
}
