import { createClient } from '@/lib/supabase/server';
import { LookbookClient } from './LookbookClient';

export default async function AdminLookbookPage() {
  const supabase = await createClient();
  const { data: videos } = await supabase.from('lookbook_videos').select('*').order('sort_order');

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-serif text-3xl font-medium">Lookbook-видео</h1>
        <p className="mt-1 text-sm text-muted">Видео отображаются на главной странице в секции Lookbook</p>
      </div>
      <LookbookClient videos={videos ?? []} />
    </div>
  );
}
