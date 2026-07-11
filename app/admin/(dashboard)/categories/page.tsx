import { createClient } from '@/lib/supabase/server';
import { CategoriesClient } from './CategoriesClient';

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: brands }] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order'),
    supabase.from('brands').select('*, products(count)').order('name'),
  ]);

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-serif text-3xl font-medium">Категории и бренды</h1>
        <p className="mt-1 text-sm text-muted">Управляйте разделами каталога и списком брендов</p>
      </div>
      <CategoriesClient categories={categories ?? []} brands={brands ?? []} />
    </div>
  );
}
