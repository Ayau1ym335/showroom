'use server';

import sharp from 'sharp';
import { createClient } from '@/lib/supabase/server';

export async function uploadProductMedia(formData: FormData): Promise<{ url: string; type: 'image' | 'video' }[]> {
  const supabase = await createClient();
  const files = formData.getAll('files') as File[];
  const results: { url: string; type: 'image' | 'video' }[] = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const isVideo = file.type.startsWith('video/');
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    if (isVideo) {
      const path = `videos/${fileName}.mp4`;
      const { error } = await supabase.storage.from('product-media').upload(path, buffer, {
        contentType: file.type,
      });
      if (error) continue;

      const { data } = supabase.storage.from('product-media').getPublicUrl(path);
      results.push({ url: data.publicUrl, type: 'video' });
    } else {
      // Оптимизация: сжимаем и конвертируем в WebP, ~1200px по широкой стороне —
      // этого достаточно для galleries и карточек каталога
      const optimized = await sharp(buffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();

      const path = `images/${fileName}.webp`;
      const { error } = await supabase.storage.from('product-media').upload(path, optimized, {
        contentType: 'image/webp',
      });
      if (error) continue;

      const { data } = supabase.storage.from('product-media').getPublicUrl(path);
      results.push({ url: data.publicUrl, type: 'image' });
    }
  }

  return results;
}
