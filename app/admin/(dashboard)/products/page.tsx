import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import { DeleteProductButton } from './DeleteProductButton';

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products, count } = await supabase
    .from('products')
    .select('*, brand:brands(name), sizes:product_sizes(*)', { count: 'exact' })
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium">Товары</h1>
          <p className="mt-1 text-sm text-muted">{count ?? 0} товаров опубликовано</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-pill bg-ink px-5.5 py-3 text-sm text-paper transition-colors hover:bg-[#2b2622]"
        >
          ＋ Добавить товар
        </Link>
      </div>

      <div className="overflow-hidden rounded-card border border-line bg-card">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F2EA] text-left text-[11px] uppercase tracking-wide text-muted">
              <th className="px-4.5 py-3.5 font-medium">Товар</th>
              <th className="px-4.5 py-3.5 font-medium">Бренд</th>
              <th className="px-4.5 py-3.5 font-medium">Цена</th>
              <th className="px-4.5 py-3.5 font-medium">Наличие</th>
              <th className="px-4.5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((product) => {
              const inStockCount = product.sizes?.filter((s: { in_stock: boolean }) => s.in_stock).length ?? 0;
              const totalSizes = product.sizes?.length ?? 0;
              return (
                <tr key={product.id} className="border-t border-line text-sm">
                  <td className="px-4.5 py-3.5">{product.title}</td>
                  <td className="px-4.5 py-3.5">{product.brand?.name ?? '—'}</td>
                  <td className="px-4.5 py-3.5">{formatPrice(product.price)}</td>
                  <td className="px-4.5 py-3.5">
                    <span className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${inStockCount > 0 ? 'bg-success' : 'bg-danger'}`} />
                      {inStockCount > 0 ? `${inStockCount} из ${totalSizes} размеров` : 'Нет в наличии'}
                    </span>
                  </td>
                  <td className="px-4.5 py-3.5">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line hover:border-taupe-soft"
                      >
                        ✎
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
