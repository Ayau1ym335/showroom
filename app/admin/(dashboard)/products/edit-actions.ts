'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CreateProductInput } from './actions';

export async function updateProduct(productId: string, input: CreateProductInput) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('products')
    .update({
      title: input.title,
      description: input.description || null,
      price: input.price,
      discount_price: (input.discountPrice != null && input.discountPrice > 0) ? input.discountPrice : null,
      brand_id: input.brandId || null,
      category_id: input.categoryId || null,
      gender: input.gender,
      age_group: input.ageGroup,
      is_new: input.isNew,
      is_published: input.isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId);

  if (error) throw new Error(error.message);

  // Обновляем размеры: удаляем старые и вставляем новые
  await supabase.from('product_sizes').delete().eq('product_id', productId);
  if (input.sizes.length > 0) {
    await supabase.from('product_sizes').insert(
      input.sizes.map((s, i) => ({
        product_id: productId,
        size_label: s.label,
        in_stock: s.inStock,
        sort_order: i,
      }))
    );
  }

  // Новые медиа добавляем к существующим (не удаляем старые)
  if (input.mediaUrls.length > 0) {
    const { data: existing } = await supabase
      .from('product_media')
      .select('sort_order')
      .eq('product_id', productId)
      .order('sort_order', { ascending: false })
      .limit(1);

    const offset = existing?.[0]?.sort_order != null ? existing[0].sort_order + 1 : 0;

    await supabase.from('product_media').insert(
      input.mediaUrls.map((m, i) => ({
        product_id: productId,
        media_type: m.type,
        url: m.url,
        sort_order: offset + i,
      }))
    );
  }

  revalidatePath('/admin/products');
  revalidatePath('/catalog');
  revalidatePath('/');
  redirect('/admin/products');
}

export async function deleteProductMedia(mediaId: string, productId: string) {
  const supabase = await createClient();
  await supabase.from('product_media').delete().eq('id', mediaId);
  revalidatePath(`/admin/products/${productId}/edit`);
}
