'use client';

import { useState, useTransition } from 'react';
import { addBanner, toggleBanner, deleteBanner, uploadBannerImage } from './actions';

interface Banner {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export function BannersClient({ banners: initialBanners }: { banners: Banner[] }) {
  const [banners, setBanners] = useState(initialBanners);
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.set('file', file);
    const url = await uploadBannerImage(fd);
    if (url) setImageUrl(url);
    setUploading(false);
  }

  function handleAdd() {
    if (!imageUrl) return;
    const fd = new FormData();
    fd.set('image_url', imageUrl);
    fd.set('title', title);
    fd.set('subtitle', subtitle);
    fd.set('link_url', linkUrl);
    startTransition(async () => {
      await addBanner(fd);
      setImageUrl(''); setTitle(''); setSubtitle(''); setLinkUrl(''); setShowForm(false);
    });
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(() => toggleBanner(id, !current));
    setBanners((prev) => prev.map((b) => b.id === id ? { ...b, is_active: !current } : b));
  }

  function handleDelete(id: string) {
    if (!confirm('Удалить баннер?')) return;
    startTransition(() => deleteBanner(id));
    setBanners((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className={isPending ? 'opacity-60 pointer-events-none' : ''}>
      {/* Список баннеров */}
      <div className="mb-6 space-y-4">
        {banners.length === 0 && (
          <div className="rounded-card border border-line bg-card p-8 text-center text-sm text-muted">
            Баннеров пока нет. Добавьте первый ниже.
          </div>
        )}
        {banners.map((banner) => (
          <div key={banner.id} className="flex gap-5 rounded-card border border-line bg-card p-5">
            {/* Превью */}
            <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-[#EDE8DC]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={banner.image_url} alt="" className="h-full w-full object-cover" />
            </div>

            {/* Инфо */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{banner.title || <span className="text-muted italic">Без заголовка</span>}</div>
              {banner.subtitle && <div className="mt-0.5 text-xs text-muted truncate">{banner.subtitle}</div>}
              {banner.link_url && (
                <div className="mt-1 text-xs text-taupe truncate">{banner.link_url}</div>
              )}
            </div>

            {/* Действия */}
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => handleToggle(banner.id, banner.is_active)}
                className={`rounded-pill px-3.5 py-1.5 text-xs transition-colors ${
                  banner.is_active ? 'bg-ink text-paper hover:bg-[#2b2622]' : 'border border-line hover:border-taupe-soft'
                }`}
              >
                {banner.is_active ? 'Активен' : 'Выкл'}
              </button>
              <button onClick={() => handleDelete(banner.id)} className="text-xs text-danger hover:underline">
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Форма добавления */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-pill border border-line px-5.5 py-3 text-sm hover:border-taupe-soft transition-colors"
        >
          ＋ Добавить баннер
        </button>
      ) : (
        <div className="rounded-card border border-line bg-card p-6">
          <div className="mb-4.5 text-sm font-medium">Новый баннер</div>

          {/* Загрузка изображения */}
          <label className="mb-4 block cursor-pointer rounded-xl border-2 border-dashed border-line p-6 text-center hover:border-taupe-soft transition-colors">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="preview" className="mx-auto max-h-40 rounded-lg object-cover" />
            ) : (
              <>
                <div className="mb-1 text-2xl text-taupe-soft">⇧</div>
                <p className="text-sm text-muted">{uploading ? 'Загружаем…' : 'Нажмите, чтобы загрузить изображение'}</p>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>

          <div className="mb-3">
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Заголовок</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Новая коллекция" className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm focus:border-taupe focus:outline-none" />
          </div>
          <div className="mb-3">
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Подзаголовок</label>
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Осень–Зима 2025" className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm focus:border-taupe focus:outline-none" />
          </div>
          <div className="mb-5">
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Ссылка (необязательно)</label>
            <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="/catalog?gender=female" className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm focus:border-taupe focus:outline-none" />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={!imageUrl}
              className="flex-1 rounded-pill bg-ink py-3 text-sm text-paper disabled:opacity-40 hover:bg-[#2b2622] transition-colors"
            >
              Сохранить
            </button>
            <button onClick={() => { setShowForm(false); setImageUrl(''); }} className="flex-1 rounded-pill border border-line py-3 text-sm hover:border-taupe-soft transition-colors">
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
