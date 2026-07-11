'use client';

import { useTransition } from 'react';
import { Review } from '@/types';
import { togglePublishReview, deleteReview } from './actions';

export function ReviewRow({ review }: { review: Review }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className={`flex items-center justify-between border-b border-line py-3.5 text-sm last:border-none ${isPending ? 'opacity-50' : ''}`}>
      <div>
        <span className="font-medium">{review.author_name}</span>
        <span className="ml-2 text-taupe">{'★'.repeat(review.rating)}</span>
        <p className="mt-1 max-w-lg text-xs text-muted">{review.text}</p>
      </div>
      <div className="flex items-center gap-2.5">
        <span className={`rounded-pill px-2.5 py-1 text-[11px] ${review.is_published ? 'bg-[#EAF0EA] text-success' : 'bg-[#F1ECE0] text-taupe'}`}>
          {review.is_published ? 'Опубликован' : 'На модерации'}
        </span>
        <button
          onClick={() => startTransition(() => togglePublishReview(review.id, !review.is_published))}
          disabled={isPending}
          className="rounded-lg border border-line px-2.5 py-1.5 text-xs hover:border-taupe-soft disabled:opacity-50"
        >
          {review.is_published ? 'Скрыть' : 'Опубликовать'}
        </button>
        <button
          onClick={() => {
            if (confirm('Удалить отзыв?')) startTransition(() => deleteReview(review.id));
          }}
          disabled={isPending}
          className="rounded-lg border border-line px-2.5 py-1.5 text-xs hover:border-danger hover:text-danger disabled:opacity-50"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}
