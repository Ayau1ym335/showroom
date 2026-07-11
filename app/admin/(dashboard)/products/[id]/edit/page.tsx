import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProductEditForm } from '@/components/admin/ProductEditForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: product },
    { data: brands },
    { data: categories },
  ] = await Promise.all([
    supabase
      .from('products')
      .select('*, sizes:product_sizes(*), media:product_media(*)')
      .eq('id', id)
      .single(),
    supabase.from('brands').select('*').order('name'),
    supabase.from('categories').select('*').order('sort_order'),
  ]);

  if (!product) notFound();

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-serif text-3xl font-medium">Редактировать товар</h1>
        <p className="mt-1 text-sm text-muted">{product.title}</p>
      </div>
      <ProductEditForm
        product={product}
        brands={brands ?? []}
        categories={categories ?? []}
      />
    </div>
  );
}
