'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brand, Category } from '@/types';
import { createProduct } from './actions';
import { uploadProductMedia } from './upload-actions';

const DEFAULT_SIZES: Record<string, string[]> = {
  female: ['XS', 'S', 'M', 'L', 'XL'],
  male: ['S', 'M', 'L', 'XL', 'XXL'],
  kids: ['1 год', '2 года', '3 года', '4 года', '5 лет', '6 лет'],
};

export function ProductForm({ brands, categories }: { brands: Brand[]; categories: Category[] }) {
  const router = useRouter();
  const [gender, setGender] = useState<'female' | 'male' | 'kids'>('female');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [brandId, setBrandId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [isNew, setIsNew] = useState(true);
  const [isPublished, setIsPublished] = useState(true);
  const [activeSizes, setActiveSizes] = useState<Set<string>>(new Set(DEFAULT_SIZES.female.slice(0, 4)));
  const [uploadedMedia, setUploadedMedia] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
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
      setUploadedMedia((prev) => [...prev, ...results]);
    } finally {
      setUploading(false);
    }
  }

  function removeMedia(index: number) {
    setUploadedMedia((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(publish: boolean) {
    if (!title || !price) {
      alert('Заполните название и цену');
      return;
    }

    setSaving(true);
    try {
      await createProduct({
        title,
        description,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        brandId,
        categoryId,
        gender,
        ageGroup: gender === 'kids' ? title : null, // при необходимости выносится в отдельное поле
        isNew,
        isPublished: publish,
        sizes: DEFAULT_SIZES[gender].map((label) => ({ label, inStock: activeSizes.has(label) })),
        mediaUrls: uploadedMedia,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1fr_340px]">
      <div>
        {/* Загрузка медиа */}
        <label className="mb-5 block cursor-pointer rounded-card border-2 border-dashed border-line bg-card p-9 text-center transition-colors hover:border-taupe-soft">
          <div className="mb-2.5 text-2xl text-taupe-soft">⇧</div>
          <p className="text-sm text-muted">{uploading ? 'Загружаем…' : 'Перетащите фото или видео сюда'}</p>
          <p className="mt-1 text-xs text-taupe-soft">Или нажмите, чтобы выбрать файлы</p>
          <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileSelect} />
        </label>

        {uploadedMedia.length > 0 && (
          <div className="mb-6 grid grid-cols-5 gap-2.5">
            {uploadedMedia.map((media, i) => (
              <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br from-[#EDE8DC] to-[#DED5C3]">
                {media.type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={media.url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-[#1c1a17] text-paper">▶</span>
                )}
                <button
                  onClick={() => removeMedia(i)}
                  className="absolute right-1 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-black/70 text-[10px] text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Основные поля */}
        <Field label="Название товара">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например, шерстяное пальто оверсайз"
            className="input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Цена, ₸">
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="89000" className="input" />
          </Field>
          <Field label="Цена со скидкой (необязательно)">
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
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Коротко опишите материал, крой, особенности"
            className="input resize-none"
          />
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
          <ToggleRow
            label="Новая коллекция"
            sub="Покажется в блоке на главной"
            checked={isNew}
            onChange={setIsNew}
          />
          <ToggleRow
            label="Опубликован"
            sub="Виден в каталоге сайта"
            checked={isPublished}
            onChange={setIsPublished}
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="flex-1 rounded-pill border border-line py-3.5 text-sm transition-colors hover:border-taupe-soft disabled:opacity-60"
          >
            Сохранить черновик
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="flex-1 rounded-pill bg-ink py-3.5 text-sm text-paper transition-colors hover:bg-[#2b2622] disabled:opacity-60"
          >
            {saving ? 'Сохраняем…' : 'Опубликовать'}
          </button>
        </div>
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

function ToggleRow({
  label,
  sub,
  checked,
  onChange,
}: {
  label: string;
  sub: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
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
        <span
          className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
