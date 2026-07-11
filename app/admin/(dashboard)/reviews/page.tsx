import { createClient } from '@/lib/supabase/server';
import { ReviewRow } from './ReviewRow';

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-serif text-3xl font-medium">Отзывы</h1>
        <p className="mt-1 text-sm text-muted">Управляйте отзывами, которые видны на сайте</p>
      </div>

      <div className="rounded-card border border-line bg-card p-6">
        {(reviews ?? []).length === 0 && <p className="text-sm text-muted">Отзывов пока нет</p>}
        {(reviews ?? []).map((review) => (
          <ReviewRow key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
