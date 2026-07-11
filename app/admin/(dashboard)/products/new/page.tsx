import { createClient } from '@/lib/supabase/server';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  const supabase = await createClient();
  const [{ data: brands }, { data: categories }] = await Promise.all([
    supabase.from('brands').select('*').order('name'),
    supabase.from('categories').select('*').order('sort_order'),
  ]);

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-serif text-3xl font-medium">Новый товар</h1>
        <p className="mt-1 text-sm text-muted">Заполните основные поля — остальное можно изменить позже</p>
      </div>
      <ProductForm brands={brands ?? []} categories={categories ?? []} />
    </div>
  );
}
