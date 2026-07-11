'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Category, Brand } from '@/types';

const GENDER_TABS = [
  { value: '', label: 'Все' },
  { value: 'female', label: 'Женское' },
  { value: 'male', label: 'Мужское' },
  { value: 'kids', label: 'Детское' },
];

export function GenderTabs({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setGender(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('gender', value);
    else params.delete('gender');
    params.delete('page'); // сброс пагинации при смене раздела
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-2 flex gap-2.5 overflow-x-auto">
      {GENDER_TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setGender(tab.value)}
          className={`whitespace-nowrap rounded-pill border px-5.5 py-2.5 text-sm transition-colors ${
            current === tab.value
              ? 'border-ink bg-ink text-paper'
              : 'border-line bg-card hover:border-taupe-soft'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function CatalogFilterPanel({
  categories,
  brands,
  currentGender,
}: {
  categories: Category[];
  brands: Brand[];
  currentGender: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const subcategories = categories.filter((c) => {
    if (!c.parent_id) return false;
    const parent = categories.find((p) => p.id === c.parent_id);
    return currentGender ? parent?.gender === currentGender : true;
  });

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleBrand(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get('brands')?.split(',').filter(Boolean) ?? [];
    const next = current.includes(slug) ? current.filter((b) => b !== slug) : [...current, slug];
    if (next.length > 0) params.set('brands', next.join(','));
    else params.delete('brands');
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  const selectedBrands = searchParams.get('brands')?.split(',').filter(Boolean) ?? [];
  const selectedCategory = searchParams.get('category') ?? '';
  const inStockOnly = searchParams.get('inStock') !== 'false'; // по умолчанию включено

  function resetFilters() {
    router.push(pathname);
  }

  return (
    <aside className="sticky top-24 h-fit rounded-card border border-line bg-card p-6">
      <div className="mb-5.5 border-b border-line pb-5.5">
        <span className="mb-3.5 block text-xs uppercase tracking-wide text-muted">Категория</span>
        {subcategories.map((cat) => (
          <label key={cat.id} className="mb-3 flex cursor-pointer items-center gap-2.5 text-sm last:mb-0">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === cat.slug}
              onChange={() => updateParam('category', cat.slug)}
              className="h-3.5 w-3.5 accent-ink"
            />
            {cat.name}
          </label>
        ))}
      </div>

      <div className="mb-5.5 border-b border-line pb-5.5">
        <span className="mb-3.5 block text-xs uppercase tracking-wide text-muted">Бренд</span>
        {brands.map((brand) => (
          <label key={brand.id} className="mb-3 flex cursor-pointer items-center gap-2.5 text-sm last:mb-0">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand.slug)}
              onChange={() => toggleBrand(brand.slug)}
              className="h-3.5 w-3.5 accent-ink"
            />
            {brand.name}
          </label>
        ))}
      </div>

      <div className="mb-5.5 border-b border-line pb-5.5">
        <span className="mb-3.5 block text-xs uppercase tracking-wide text-muted">Цена, ₸</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="От"
            defaultValue={searchParams.get('minPrice') ?? ''}
            onBlur={(e) => updateParam('minPrice', e.target.value || null)}
            className="w-full rounded-lg border border-line px-2.5 py-2 text-sm"
          />
          <span className="text-xs text-taupe-soft">—</span>
          <input
            type="number"
            placeholder="До"
            defaultValue={searchParams.get('maxPrice') ?? ''}
            onBlur={(e) => updateParam('maxPrice', e.target.value || null)}
            className="w-full rounded-lg border border-line px-2.5 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mb-4.5">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => updateParam('inStock', e.target.checked ? null : 'false')}
            className="h-3.5 w-3.5 accent-ink"
          />
          Только в наличии
        </label>
      </div>

      <button onClick={resetFilters} className="text-xs text-muted underline underline-offset-2">
        Сбросить фильтры
      </button>
    </aside>
  );
}

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      defaultValue={searchParams.get('sort') ?? 'newest'}
      onChange={(e) => setSort(e.target.value)}
      className="cursor-pointer rounded-pill border border-line bg-card px-4 py-2.5 text-sm"
    >
      <option value="newest">Сначала новые</option>
      <option value="price_asc">Сначала дешевле</option>
      <option value="price_desc">Сначала дороже</option>
    </select>
  );
}
