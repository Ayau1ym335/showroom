'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient();

  await supabase
    .from('site_settings')
    .update({
      whatsapp_number: formData.get('whatsapp_number') as string,
      instagram_url: formData.get('instagram_url') as string,
      phone: (formData.get('phone') as string) || null,
      work_hours: (formData.get('work_hours') as string) || null,
    })
    .eq('id', 1);

  revalidatePath('/', 'layout');
}
