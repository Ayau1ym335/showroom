'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function addBanner(formData: FormData) {
  const image_url = String(formData.get('image_url') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim() || null;
  const subtitle = String(formData.get('subtitle') ?? '').trim() || null;
  const link_url = String(formData.get('link_url') ?? '').trim() || null;
  if (!image_url) return;

  const supabase = await createClient();
  await supabase.from('banners').insert({ image_url, title, subtitle, link_url, sort_order: 0, is_active: true });
  revalidatePath('/admin/banners');
  revalidatePath('/');
}

export async function toggleBanner(id: string, is_active: boolean) {
  const supabase = await createClient();
  await supabase.from('banners').update({ is_active }).eq('id', id);
  revalidatePath('/admin/banners');
  revalidatePath('/');
}

export async function deleteBanner(id: string) {
  const supabase = await createClient();
  await supabase.from('banners').delete().eq('id', id);
  revalidatePath('/admin/banners');
  revalidatePath('/');
}

export async function uploadBannerImage(formData: FormData): Promise<string | null> {
  const supabase = await createClient();
  const file = formData.get('file') as File | null;
  if (!file) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `banner-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${file.name.split('.').pop()}`;

  const { error } = await supabase.storage.from('banners').upload(fileName, buffer, { contentType: file.type });
  if (error) return null;

  const { data } = supabase.storage.from('banners').getPublicUrl(fileName);
  return data.publicUrl;
}
