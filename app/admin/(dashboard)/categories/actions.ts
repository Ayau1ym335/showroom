'use server';

import { revalidatePath } from 'next/cache';
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
    .concat('-', Math.random().toString(36).slice(2, 6));
}

export async function addSubcategory(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const parentId = String(formData.get('parent_id') ?? '').trim();
  if (!name || !parentId) return;

  const supabase = await createClient();
  await supabase.from('categories').insert({
    name,
    slug: slugify(name),
    parent_id: parentId,
    sort_order: 99,
  });
  revalidatePath('/admin/categories');
  revalidatePath('/catalog');
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient();
  await supabase.from('categories').delete().eq('id', categoryId);
  revalidatePath('/admin/categories');
  revalidatePath('/catalog');
}

export async function addBrand(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  if (!name) return;

  const supabase = await createClient();
  await supabase.from('brands').insert({ name, slug: slugify(name) });
  revalidatePath('/admin/categories');
}

export async function deleteBrand(brandId: string) {
  const supabase = await createClient();
  await supabase.from('brands').delete().eq('id', brandId);
  revalidatePath('/admin/categories');
}
