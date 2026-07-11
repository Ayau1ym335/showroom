'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { uploadProductMedia } from '@/app/admin/(dashboard)/products/upload-actions';

export async function addLookbookVideo(formData: FormData) {
  const video_url = String(formData.get('video_url') ?? '').trim();
  const thumbnail_url = String(formData.get('thumbnail_url') ?? '').trim() || null;
  const caption = String(formData.get('caption') ?? '').trim() || null;
  if (!video_url) return;

  const supabase = await createClient();
  await supabase.from('lookbook_videos').insert({ video_url, thumbnail_url, caption, sort_order: 99, is_active: true });
  revalidatePath('/admin/lookbook');
  revalidatePath('/');
}

export async function toggleLookbookVideo(id: string, is_active: boolean) {
  const supabase = await createClient();
  await supabase.from('lookbook_videos').update({ is_active }).eq('id', id);
  revalidatePath('/admin/lookbook');
  revalidatePath('/');
}

export async function deleteLookbookVideo(id: string) {
  const supabase = await createClient();
  await supabase.from('lookbook_videos').delete().eq('id', id);
  revalidatePath('/admin/lookbook');
  revalidatePath('/');
}

export async function uploadLookbookFile(formData: FormData): Promise<{ url: string; type: 'image' | 'video' } | null> {
  const results = await uploadProductMedia(formData);
  return results[0] ?? null;
}
