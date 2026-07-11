import Link from 'next/link';
import { getCatalogProducts, getCategories, getBrands, getSiteSettings } from '@/lib/data';
import { SiteNav } from '@/components/layout/SiteNav';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { GenderTabs, CatalogFilterPanel, SortSelect } from '@/components/catalog/CatalogFilters';
import { CatalogLoadMore } from '@/components/catalog/CatalogLoadMore';
import { Gender, CatalogFilters as CatalogFiltersType } from '@/types';

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function CatalogPage({ searchParams }: Props) {
  const params = await searchParams;

  const filters: CatalogFiltersType = {
    gender: params.gender as Gender | undefined,
    category: params.category,
    brands: params.brands?.split(',').filter(Boolean),
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    inStockOnly: params.inStock !== 'false',
    sort: (params.sort as CatalogFiltersType['sort']) ?? 'newest',
    page: 1,
  };

  const [{ products, total }, categories, brands, settings] = await Promise.all([
    getCatalogProducts(filters),
    getCategories(),
    getBrands(),
    getSiteSettings(),
  ]);

  // Собираем строку query-параметров для клиентского компонента (без page)
  const searchParamsString = new URLSearchParams(
    Object.entries(params).filter(([k, v]) => k !== 'page' && v !== undefined) as [string, string][]
  ).toString();

  return (
    <>
      <SiteNav whatsappNumber={settings.whatsapp_number} />

      <div className="px-6 pt-10 md:px-14">
        <div className="mb-3.5 text-xs text-muted">
          <Link href="/">Главная</Link> / Каталог
        </div>
        <h1 className="mb-6 font-serif text-4xl font-medium">Каталог</h1>
        <GenderTabs current={filters.gender ?? ''} />
      </div>

      <div className="grid grid-cols-1 gap-10 px-6 pb-24 pt-8 md:grid-cols-[260px_1fr] md:px-14">
        <CatalogFilterPanel categories={categories} brands={brands} currentGender={filters.gender ?? ''} />

        <main>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted">{total} товаров</span>
            <SortSelect />
          </div>

          {products.length === 0 ? (
            <p className="py-16 text-center text-muted">По выбранным фильтрам товаров не найдено.</p>
          ) : (
            <CatalogLoadMore
              initialProducts={products}
              total={total}
              currentPage={1}
              searchParamsString={searchParamsString}
            />
          )}
        </main>
      </div>

      <WhatsAppFloat phoneNumber={settings.whatsapp_number} />
    </>
  );
}
