import { createClient } from '@/lib/supabase/server';

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: brands }] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order'),
    supabase.from('brands').select('*, products(count)').order('name'),
  ]);

  const rootCategories = (categories ?? []).filter((c) => !c.parent_id);

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-serif text-3xl font-medium">Категории и бренды</h1>
        <p className="mt-1 text-sm text-muted">Управляйте разделами каталога и списком брендов</p>
      </div>

      <div className="mb-6 rounded-card border border-line bg-card p-6">
        <div className="mb-4.5 text-sm font-medium">Разделы и подкатегории</div>
        {rootCategories.map((root) => {
          const children = (categories ?? []).filter((c) => c.parent_id === root.id);
          return (
            <div key={root.id} className="flex items-center justify-between border-b border-line py-3 text-sm last:border-none">
              <span className="font-medium">{root.name}</span>
              <span className="text-muted">{children.map((c) => c.name).join(', ')}</span>
            </div>
          );
        })}
      </div>

      <div className="rounded-card border border-line bg-card p-6">
        <div className="mb-4.5 text-sm font-medium">Бренды</div>
        {(brands ?? []).map((brand) => (
          <div key={brand.id} className="flex items-center justify-between border-b border-line py-3 text-sm last:border-none">
            <span className="font-medium">{brand.name}</span>
            <span className="text-muted">{brand.products?.[0]?.count ?? 0} товаров</span>
          </div>
        ))}
        <button className="mt-3.5 rounded-pill border border-line px-5 py-2.5 text-sm hover:border-taupe-soft">
          ＋ Добавить бренд
        </button>
      </div>
    </div>
  );
}
