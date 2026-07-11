import { createClient } from '@/lib/supabase/server';
import { BannersClient } from './BannersClient';

export default async function AdminBannersPage() {
  const supabase = await createClient();
  const { data: banners } = await supabase.from('banners').select('*').order('sort_order');

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-serif text-3xl font-medium">Баннеры</h1>
        <p className="mt-1 text-sm text-muted">Управляйте главными баннерами сайта</p>
      </div>
      <BannersClient banners={banners ?? []} />
    </div>
  );
}
