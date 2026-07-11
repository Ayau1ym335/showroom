'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function slugify(text: string): string {
  const translit: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
    и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
    с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
    ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  };
  return text
    .toLowerCase()
    .split('')
    .map((char) => translit[char] ?? char)
    .join('')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .concat('-', Math.random().toString(36).slice(2, 7)); // суффикс на случай совпадения названий
}

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  discountPrice: number | null;
  brandId: string;
  categoryId: string;
  gender: 'female' | 'male' | 'kids';
  ageGroup: string | null;
  isNew: boolean;
  isPublished: boolean;
  sizes: { label: string; inStock: boolean }[];
  mediaUrls: { url: string; type: 'image' | 'video' }[];
}

export async function createProduct(input: CreateProductInput) {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      title: input.title,
      slug: slugify(input.title),
      description: input.description || null,
      price: input.price,
      discount_price: (input.discountPrice != null && input.discountPrice > 0) ? input.discountPrice : null,
      brand_id: input.brandId || null,
      category_id: input.categoryId || null,
      gender: input.gender,
      age_group: input.ageGroup,
      is_new: input.isNew,
      is_published: input.isPublished,
    })
    .select()
    .single();

  if (error || !product) {
    throw new Error(error?.message ?? 'Не удалось создать товар');
  }

  if (input.sizes.length > 0) {
    await supabase.from('product_sizes').insert(
      input.sizes.map((s, i) => ({
        product_id: product.id,
        size_label: s.label,
        in_stock: s.inStock,
        sort_order: i,
      }))
    );
  }

  if (input.mediaUrls.length > 0) {
    await supabase.from('product_media').insert(
      input.mediaUrls.map((m, i) => ({
        product_id: product.id,
        media_type: m.type,
        url: m.url,
        sort_order: i,
      }))
    );
  }

  revalidatePath('/admin/products');
  revalidatePath('/catalog');
  revalidatePath('/');
  redirect('/admin/products');
}

export async function updateSizeStock(sizeId: string, inStock: boolean) {
  const supabase = await createClient();
  await supabase.from('product_sizes').update({ in_stock: inStock }).eq('id', sizeId);
  revalidatePath('/admin/products');
  revalidatePath('/catalog');
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  await supabase.from('products').delete().eq('id', productId);
  revalidatePath('/admin/products');
  revalidatePath('/catalog');
  revalidatePath('/');
}

export async function togglePublished(productId: string, isPublished: boolean) {
  const supabase = await createClient();
  await supabase.from('products').update({ is_published: isPublished }).eq('id', productId);
  revalidatePath('/admin/products');
  revalidatePath('/catalog');
}
