'use client';

import { useState, useTransition } from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

interface Props {
  initialProducts: Product[];
  total: number;
  currentPage: number;
  searchParamsString: string;
}

export function CatalogLoadMore({ initialProducts, total, searchParamsString }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const pageSize = 12;
  const hasMore = products.length < total;

  async function loadMore() {
    const nextPage = page + 1;
    const params = new URLSearchParams(searchParamsString);
    params.set('page', String(nextPage));

    startTransition(async () => {
      const res = await fetch(`/api/catalog?${params.toString()}`);
      if (!res.ok) return;
      const data: { products: Product[] } = await res.json();
      setProducts((prev) => [...prev, ...data.products]);
      setPage(nextPage);
    });
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-7 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="rounded-pill border border-line px-10 py-3.5 text-sm transition-colors hover:border-taupe-soft disabled:opacity-50"
          >
            {isPending ? 'Загружаем…' : `Показать ещё (${total - products.length})`}
          </button>
        </div>
      )}
    </>
  );
}
