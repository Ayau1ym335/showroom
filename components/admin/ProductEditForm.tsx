'use client';

import { useState } from 'react';
import { Brand, Category, Product } from '@/types';
import { updateProduct } from '@/app/admin/(dashboard)/products/edit-actions';
import { deleteProductMedia } from '@/app/admin/(dashboard)/products/edit-actions';
import { uploadProductMedia } from '@/app/admin/(dashboard)/products/upload-actions';

const DEFAULT_SIZES: Record<string, string[]> = {
  female: ['XS', 'S', 'M', 'L', 'XL'],
  male: ['S', 'M', 'L', 'XL', 'XXL'],
  kids: ['1 год', '2 года', '3 года', '4 года', '5 лет', '6 лет'],
};

interface Props {
  product: Product & { sizes?: { id: string; size_label: string; in_stock: boolean; sort_order: number }[]; media?: { id: string; url: string; media_type: string }[] };
  brands: Brand[];
  categories: Category[];
}

export function ProductEditForm({ product, brands, categories }: Props) {
  const [gender, setGender] = useState<'female' | 'male' | 'kids'>(product.gender);
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(String(product.price));
  const [discountPrice, setDiscountPrice] = useState(
    product.discount_price != null && product.discount_price > 0 ? String(product.discount_price) : ''
  );
  const [brandId, setBrandId] = useState(product.brand_id ?? '');
  const [categoryId, setCategoryId] = useState(product.category_id ?? '');
  const [description, setDescription] = useState(product.description ?? '');
  const [isNew, setIsNew] = useState(product.is_new);
  const [isPublished, setIsPublished] = useState(product.is_published);

  const existingSizes = product.sizes ?? [];
  const inStockLabels = new Set(existingSizes.filter((s) => s.in_stock).map((s) => s.size_label));
  const [activeSizes, setActiveSizes] = useState<Set<string>>(inStockLabels);

  const [existingMedia, setExistingMedia] = useState(product.media ?? []);
  const [newMedia, setNewMedia] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const subcategories = categories.filter((c) => {
    if (!c.parent_id) return false;
    const parent = categories.find((p) => p.id === c.parent_id);
    return parent?.gender === gender;
  });

  function toggleSize(size: string) {
    setActiveSizes((prev) => {
      const next = new Set(prev);
      if (next.has(size)) next.delete(size);
      else next.add(size);
      return next;
    });
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append('files', f));
    try {
      const results = await uploadProductMedia(formData);
      setNewMedia((prev) => [...prev, ...results]);
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteExistingMedia(mediaId: string) {
    await deleteProductMedia(mediaId, product.id);
    setExistingMedia((prev) => prev.filter((m) => m.id !== mediaId));
  }

  async function handleSubmit() {
    if (!title || !price) {
      alert('Заполните название и цену');
      return;
    }
    setSaving(true);
    try {
      await updateProduct(product.id, {
        title,
        description,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        brandId,
        categoryId,
        gender,
        ageGroup: gender === 'kids' ? title : null,
        isNew,
        isPublished,
        sizes: DEFAULT_SIZES[gender].map((label) => ({ label, inStock: activeSizes.has(label) })),
        mediaUrls: newMedia,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1fr_340px]">
      <div>
        {/* Существующие медиа */}
        {existingMedia.length > 0 && (
          <div className="mb-5">
            <p className="mb-2.5 text-xs uppercase tracking-wide text-muted">Текущие фото/видео</p>
            <div className="grid grid-cols-5 gap-2.5">
              {existingMedia.map((media) => (
                <div key={media.id} className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br from-[#EDE8DC] to-[#DED5C3]">
                  {media.media_type === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={media.url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-[#1c1a17] text-paper">▶</span>
                  )}
                  <button
                    onClick={() => handleDeleteExistingMedia(media.id)}
                    className="absolute right-1 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-black/70 text-[10px] text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Добавить новые медиа */}
        <label className="mb-5 block cursor-pointer rounded-card border-2 border-dashed border-line bg-card p-9 text-center transition-colors hover:border-taupe-soft">
          <div className="mb-2.5 text-2xl text-taupe-soft">⇧</div>
          <p className="text-sm text-muted">{uploading ? 'Загружаем…' : 'Добавить фото или видео'}</p>
          <p className="mt-1 text-xs text-taupe-soft">Нажмите, чтобы выбрать файлы</p>
          <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileSelect} />
        </label>

        {newMedia.length > 0 && (
          <div className="mb-6 grid grid-cols-5 gap-2.5">
            {newMedia.map((media, i) => (
              <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br from-[#EDE8DC] to-[#DED5C3]">
                {media.type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={media.url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-[#1c1a17] text-paper">▶</span>
                )}
                <button
                  onClick={() => setNewMedia((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute right-1 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-black/70 text-[10px] text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <Field label="Название товара">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Цена, ₸">
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input" />
          </Field>
          <Field label="Цена со скидкой">
            <input type="number" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} placeholder="—" className="input" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Бренд">
            <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="input">
              <option value="">Выберите бренд</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Раздел">
            <select
              value={gender}
              onChange={(e) => {
                setGender(e.target.value as 'female' | 'male' | 'kids');
                setActiveSizes(new Set(DEFAULT_SIZES[e.target.value as 'female' | 'male' | 'kids'].slice(0, 4)));
              }}
              className="input"
            >
              <option value="female">Женское</option>
              <option value="male">Мужское</option>
              <option value="kids">Детское</option>
            </select>
          </Field>
        </div>

        <Field label="Категория">
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input">
            <option value="">Выберите категорию</option>
            {subcategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Описание">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="input resize-none" />
        </Field>

        <Field label="Размеры и наличие">
          <div className="flex flex-wrap gap-2">
            {DEFAULT_SIZES[gender].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`flex h-10 min-w-[46px] items-center justify-center rounded-lg border px-3 text-sm transition-colors ${
                  activeSizes.has(size) ? 'border-ink bg-ink text-paper' : 'border-line bg-card'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <p className="mt-2.5 text-xs text-muted">Нажмите на размер, чтобы отметить его в наличии</p>
        </Field>
      </div>

      <div>
        <div className="mb-5 rounded-card border border-line bg-card p-5.5">
          <ToggleRow label="Новая коллекция" sub="Покажется в блоке на главной" checked={isNew} onChange={setIsNew} />
          <ToggleRow label="Опубликован" sub="Виден в каталоге сайта" checked={isPublished} onChange={setIsPublished} />
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full rounded-pill bg-ink py-3.5 text-sm text-paper transition-colors hover:bg-[#2b2622] disabled:opacity-60"
        >
          {saving ? 'Сохраняем…' : 'Сохранить изменения'}
        </button>
        <button
          onClick={() => window.history.back()}
          className="mt-3 w-full rounded-pill border border-line py-3.5 text-sm transition-colors hover:border-taupe-soft"
        >
          ← Назад
        </button>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid #e7e2d8;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 14px;
          background: #fff;
        }
        .input:focus {
          outline: none;
          border-color: #8b7355;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-xs uppercase tracking-wide text-muted">{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted">{sub}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-10.5 flex-shrink-0 rounded-pill transition-colors ${checked ? 'bg-ink' : 'bg-line'}`}
      >
        <span className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}
