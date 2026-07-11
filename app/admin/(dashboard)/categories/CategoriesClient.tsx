'use client';

import { useState, useTransition } from 'react';
import { addSubcategory, deleteCategory, addBrand, deleteBrand } from './actions';

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  gender: string | null;
  sort_order: number;
}

interface Brand {
  id: string;
  name: string;
  products?: { count: number }[];
}

export function CategoriesClient({ categories, brands }: { categories: Category[]; brands: Brand[] }) {
  const [isPending, startTransition] = useTransition();
  const [expandedParent, setExpandedParent] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [showBrandForm, setShowBrandForm] = useState(false);

  const rootCategories = categories.filter((c) => !c.parent_id);

  function handleAddSubcategory(parentId: string) {
    if (!newSubName.trim()) return;
    const formData = new FormData();
    formData.set('name', newSubName.trim());
    formData.set('parent_id', parentId);
    startTransition(async () => {
      await addSubcategory(formData);
      setNewSubName('');
      setExpandedParent(null);
    });
  }

  function handleDeleteCategory(id: string) {
    if (!confirm('Удалить категорию? Все товары потеряют эту категорию.')) return;
    startTransition(() => deleteCategory(id));
  }

  function handleAddBrand() {
    if (!newBrandName.trim()) return;
    const formData = new FormData();
    formData.set('name', newBrandName.trim());
    startTransition(async () => {
      await addBrand(formData);
      setNewBrandName('');
      setShowBrandForm(false);
    });
  }

  function handleDeleteBrand(id: string) {
    if (!confirm('Удалить бренд?')) return;
    startTransition(() => deleteBrand(id));
  }

  return (
    <div className={isPending ? 'opacity-60 pointer-events-none' : ''}>
      {/* Категории */}
      <div className="mb-6 rounded-card border border-line bg-card p-6">
        <div className="mb-4.5 text-sm font-medium">Разделы и подкатегории</div>
        {rootCategories.map((root) => {
          const children = categories.filter((c) => c.parent_id === root.id);
          const isExpanded = expandedParent === root.id;
          return (
            <div key={root.id} className="border-b border-line py-4 last:border-none">
              {/* Корневая категория */}
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-sm">{root.name}</span>
                <button
                  onClick={() => setExpandedParent(isExpanded ? null : root.id)}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs hover:border-taupe-soft transition-colors"
                >
                  {isExpanded ? '✕ Закрыть' : '＋ Добавить подкатегорию'}
                </button>
              </div>

              {/* Дочерние категории */}
              <div className="flex flex-wrap gap-2 mb-2">
                {children.map((child) => (
                  <span
                    key={child.id}
                    className="group flex items-center gap-1.5 rounded-pill bg-[#F5F2EA] px-3 py-1 text-xs text-taupe"
                  >
                    {child.name}
                    <button
                      onClick={() => handleDeleteCategory(child.id)}
                      className="hidden group-hover:inline text-danger text-[10px] leading-none"
                      title="Удалить"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {children.length === 0 && (
                  <span className="text-xs text-muted italic">нет подкатегорий</span>
                )}
              </div>

              {/* Форма добавления подкатегории */}
              {isExpanded && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubcategory(root.id)}
                    placeholder="Название подкатегории"
                    autoFocus
                    className="flex-1 rounded-xl border border-line px-3.5 py-2.5 text-sm focus:border-taupe focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddSubcategory(root.id)}
                    disabled={!newSubName.trim()}
                    className="rounded-xl bg-ink px-4 py-2.5 text-xs text-paper disabled:opacity-40 hover:bg-[#2b2622] transition-colors"
                  >
                    Добавить
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Бренды */}
      <div className="rounded-card border border-line bg-card p-6">
        <div className="mb-4.5 flex items-center justify-between">
          <span className="text-sm font-medium">Бренды</span>
          <button
            onClick={() => setShowBrandForm((v) => !v)}
            className="rounded-lg border border-line px-3 py-1.5 text-xs hover:border-taupe-soft transition-colors"
          >
            {showBrandForm ? '✕ Закрыть' : '＋ Добавить бренд'}
          </button>
        </div>

        {showBrandForm && (
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBrand()}
              placeholder="Название бренда"
              autoFocus
              className="flex-1 rounded-xl border border-line px-3.5 py-2.5 text-sm focus:border-taupe focus:outline-none"
            />
            <button
              onClick={handleAddBrand}
              disabled={!newBrandName.trim()}
              className="rounded-xl bg-ink px-4 py-2.5 text-xs text-paper disabled:opacity-40 hover:bg-[#2b2622] transition-colors"
            >
              Добавить
            </button>
          </div>
        )}

        {brands.map((brand) => (
          <div key={brand.id} className="group flex items-center justify-between border-b border-line py-3 text-sm last:border-none">
            <span className="font-medium">{brand.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-muted">{brand.products?.[0]?.count ?? 0} товаров</span>
              <button
                onClick={() => handleDeleteBrand(brand.id)}
                className="hidden group-hover:inline text-xs text-danger hover:underline"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
