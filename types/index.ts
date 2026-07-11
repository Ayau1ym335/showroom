export type Gender = 'female' | 'male' | 'kids';
export type MediaType = 'image' | 'video';

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  gender: Gender | null;
  sort_order: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

export interface ProductSize {
  id: string;
  product_id: string;
  size_label: string;
  in_stock: boolean;
  sort_order: number;
}

export interface ProductMedia {
  id: string;
  product_id: string;
  media_type: MediaType;
  url: string;
  thumbnail_url: string | null;
  sort_order: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  brand_id: string | null;
  gender: Gender;
  age_group: string | null;
  price: number;
  discount_price: number | null;
  is_new: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  // связанные данные (через join)
  brand?: Brand | null;
  category?: Category | null;
  sizes?: ProductSize[];
  media?: ProductMedia[];
}

export interface Review {
  id: string;
  author_name: string;
  author_photo_url: string | null;
  rating: number;
  text: string;
  is_published: boolean;
  created_at: string;
}

export interface LookbookVideo {
  id: string;
  video_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Banner {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface InstagramPost {
  id: string;
  image_url: string;
  post_url: string | null;
  sort_order: number;
}

export interface SiteSettings {
  id: number;
  whatsapp_number: string;
  instagram_url: string;
  phone: string | null;
  work_hours: string | null;
}

// Параметры фильтра каталога — все живут в URL query params
export interface CatalogFilters {
  gender?: Gender;
  category?: string; // slug подкатегории
  brands?: string[]; // slugs
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc';
  page?: number;
}
