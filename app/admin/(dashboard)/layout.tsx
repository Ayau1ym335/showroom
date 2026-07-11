import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const NAV_ITEMS = [
  { href: '/admin', label: 'Дашборд', icon: '◇' },
  { href: '/admin/products', label: 'Товары', icon: '▤' },
  { href: '/admin/products/new', label: 'Добавить товар', icon: '＋' },
  { href: '/admin/categories', label: 'Категории и бренды', icon: '◈' },
  { href: '/admin/banners', label: 'Баннеры', icon: '⊞' },
  { href: '/admin/lookbook', label: 'Lookbook-видео', icon: '▶' },
  { href: '/admin/reviews', label: 'Отзывы', icon: '★' },
  { href: '/admin/settings', label: 'Настройки сайта', icon: '⚙' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  async function logout() {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/admin/login');
  }

  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr]">
      <aside className="flex flex-col bg-ink p-5 text-paper">
        <div className="mb-10 px-2 font-serif text-2xl">Dori</div>
        <nav className="flex flex-1 flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#C9C2B4] transition-colors hover:bg-[#221f1b] hover:text-paper"
            >
              <span className="w-[18px] text-center text-sm">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logout}>
          <button className="px-3 py-2.5 text-left text-sm text-[#C9C2B4] hover:text-paper">← Выйти</button>
        </form>
      </aside>
      <main className="overflow-y-auto bg-paper p-9">{children}</main>
    </div>
  );
}
