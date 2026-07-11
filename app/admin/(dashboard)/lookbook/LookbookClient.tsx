'use client';

import { useState, useTransition } from 'react';
import { addLookbookVideo, toggleLookbookVideo, deleteLookbookVideo, uploadLookbookFile } from './actions';

interface Video {
  id: string;
  video_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  sort_order: number;
  is_active: boolean;
}

export function LookbookClient({ videos: initialVideos }: { videos: Video[] }) {
  const [videos, setVideos] = useState(initialVideos);
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [caption, setCaption] = useState('');

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('files', file);
    const result = await uploadLookbookFile(fd);
    if (result) setVideoUrl(result.url);
    setUploading(false);
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('files', file);
    const result = await uploadLookbookFile(fd);
    if (result) setThumbnailUrl(result.url);
    setUploading(false);
  }

  function handleAdd() {
    if (!videoUrl) return;
    const fd = new FormData();
    fd.set('video_url', videoUrl);
    fd.set('thumbnail_url', thumbnailUrl);
    fd.set('caption', caption);
    startTransition(async () => {
      await addLookbookVideo(fd);
      setVideoUrl(''); setThumbnailUrl(''); setCaption(''); setShowForm(false);
    });
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(() => toggleLookbookVideo(id, !current));
    setVideos((prev) => prev.map((v) => v.id === id ? { ...v, is_active: !current } : v));
  }

  function handleDelete(id: string) {
    if (!confirm('Удалить видео из Lookbook?')) return;
    startTransition(() => deleteLookbookVideo(id));
    setVideos((prev) => prev.filter((v) => v.id !== id));
  }

  return (
    <div className={isPending ? 'opacity-60 pointer-events-none' : ''}>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {videos.length === 0 && (
          <div className="col-span-2 rounded-card border border-line bg-card p-8 text-center text-sm text-muted">
            Видео пока нет. Добавьте первое ниже.
          </div>
        )}
        {videos.map((video) => (
          <div key={video.id} className="flex gap-4 rounded-card border border-line bg-card p-4">
            {/* Превью */}
            <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-[#1c1a17] flex items-center justify-center">
              {video.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={video.thumbnail_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-paper text-2xl">▶</span>
              )}
            </div>

            <div className="flex flex-1 min-w-0 flex-col justify-between">
              <div>
                {video.caption && <div className="text-sm font-medium truncate">{video.caption}</div>}
                <div className="mt-0.5 text-xs text-muted truncate">{video.video_url}</div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => handleToggle(video.id, video.is_active)}
                  className={`rounded-pill px-3 py-1 text-xs transition-colors ${
                    video.is_active ? 'bg-ink text-paper hover:bg-[#2b2622]' : 'border border-line hover:border-taupe-soft'
                  }`}
                >
                  {video.is_active ? 'Активно' : 'Выкл'}
                </button>
                <button onClick={() => handleDelete(video.id)} className="text-xs text-danger hover:underline">
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-pill border border-line px-5.5 py-3 text-sm hover:border-taupe-soft transition-colors"
        >
          ＋ Добавить видео
        </button>
      ) : (
        <div className="rounded-card border border-line bg-card p-6">
          <div className="mb-4.5 text-sm font-medium">Новое видео</div>

          {/* Загрузка видео */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Видеофайл *</label>
            <label className="block cursor-pointer rounded-xl border-2 border-dashed border-line p-5 text-center hover:border-taupe-soft transition-colors">
              {videoUrl ? (
                <span className="text-sm text-taupe">✓ Видео загружено</span>
              ) : (
                <span className="text-sm text-muted">{uploading ? 'Загружаем…' : 'Нажмите, чтобы загрузить видео'}</span>
              )}
              <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
            </label>
          </div>

          {/* Загрузка превью */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Превью (обложка, необязательно)</label>
            <label className="block cursor-pointer rounded-xl border-2 border-dashed border-line p-5 text-center hover:border-taupe-soft transition-colors">
              {thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbnailUrl} alt="thumb" className="mx-auto max-h-24 rounded object-cover" />
              ) : (
                <span className="text-sm text-muted">{uploading ? 'Загружаем…' : 'Загрузить обложку'}</span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
            </label>
          </div>

          <div className="mb-5">
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Подпись (необязательно)</label>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Летняя коллекция"
              className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm focus:border-taupe focus:outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={!videoUrl}
              className="flex-1 rounded-pill bg-ink py-3 text-sm text-paper disabled:opacity-40 hover:bg-[#2b2622] transition-colors"
            >
              Сохранить
            </button>
            <button onClick={() => { setShowForm(false); setVideoUrl(''); setThumbnailUrl(''); }} className="flex-1 rounded-pill border border-line py-3 text-sm hover:border-taupe-soft transition-colors">
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
