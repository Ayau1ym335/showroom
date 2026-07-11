'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

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

export function AdminSidebar({
  logoutAction,
}: {
  logoutAction: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Topbar */}
      <div className="flex items-center justify-between bg-ink p-4 text-paper lg:hidden">
        <div className="font-serif text-xl">Dori Admin</div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-1">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col bg-ink p-5 text-paper transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-10 hidden px-2 font-serif text-2xl lg:block">Dori</div>
        <nav className="flex flex-1 flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-[#221f1b] hover:text-paper ${
                pathname === item.href ? 'bg-[#221f1b] text-paper' : 'text-[#C9C2B4]'
              }`}
            >
              <span className="w-[18px] text-center text-sm">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction}>
          <button className="px-3 py-2.5 text-left text-sm text-[#C9C2B4] hover:text-paper">
            ← Выйти
          </button>
        </form>
      </aside>
    </>
  );
}
