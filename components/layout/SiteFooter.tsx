import Link from 'next/link';
import { SiteSettings } from '@/types';

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <>
      <footer className="flex flex-wrap items-center justify-between gap-5 border-t border-line px-6 py-10 md:px-14">
        <div className="font-serif text-xl">Dori</div>
        <div className="flex gap-7 text-sm text-muted">
          <Link href="/catalog">Каталог</Link>
          <Link href="/#lookbook">Lookbook</Link>
          <Link href="/#reviews">Отзывы</Link>
          <Link href="/#contacts">Контакты</Link>
        </div>
        <div className="flex gap-4">
          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line"
          >
            ◎
          </a>
          <a
            href={`https://wa.me/${settings.whatsapp_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line"
          >
            ✆
          </a>
        </div>
      </footer>
      <p className="pb-8 text-center text-xs text-taupe-soft">© {new Date().getFullYear()} Dori Fashion Store</p>
    </>
  );
}
