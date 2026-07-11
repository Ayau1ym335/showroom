import { getCatalogProducts } from '@/lib/data';
import { CatalogFilters } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filters: CatalogFilters = {
    gender: searchParams.get('gender') as CatalogFilters['gender'] ?? undefined,
    category: searchParams.get('category') ?? undefined,
    brands: searchParams.get('brands')?.split(',').filter(Boolean),
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    inStockOnly: searchParams.get('inStock') !== 'false',
    sort: (searchParams.get('sort') as CatalogFilters['sort']) ?? 'newest',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
  };

  const { products, total } = await getCatalogProducts(filters);
  return NextResponse.json({ products, total });
}
