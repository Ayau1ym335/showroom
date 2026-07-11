import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ count: publishedCount }, { data: outOfStockSizes }, { count: newCount }, { count: pendingReviews }] =
    await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('product_sizes').select('product_id').eq('in_stock', false),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_new', true),
      supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_published', false),
    ]);

  const outOfStockProducts = new Set((outOfStockSizes ?? []).map((s) => s.product_id)).size;

  const { data: recentProducts } = await supabase
    .from('products')
    .select('id, title, is_new, updated_at')
    .order('updated_at', { ascending: false })
    .limit(5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-medium">Добро пожаловать</h1>
        <p className="mt-1 text-sm text-muted">Обзор шоурума на сегодня</p>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
        <Metric label="Товаров опубликовано" value={publishedCount ?? 0} />
        <Metric label="С размерами не в наличии" value={outOfStockProducts} danger />
        <Metric label="В новой коллекции" value={newCount ?? 0} />
        <Metric label="Отзывов на модерации" value={pendingReviews ?? 0} />
      </div>

      <div className="rounded-card border border-line bg-card p-6">
        <div className="mb-4.5 text-sm font-medium">Недавно изменённые товары</div>
        {(recentProducts ?? []).map((p) => (
          <div key={p.id} className="flex items-center justify-between border-b border-line py-3 text-sm last:border-none">
            <span className="font-medium">{p.title}</span>
            <span className="text-muted">{new Date(p.updated_at).toLocaleDateString('ru-RU')}</span>
            {p.is_new && <span className="rounded-pill bg-[#F1ECE0] px-2.5 py-1 text-[11px] text-taupe">Новинка</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, danger }: { label: string; value: number; danger?: boolean }) {
  return (
    <div className="rounded-card border border-line bg-card p-5.5">
      <div className="mb-2.5 text-xs text-muted">{label}</div>
      <div className={`font-serif text-3xl font-semibold ${danger ? 'text-danger' : ''}`}>{value}</div>
    </div>
  );
}
