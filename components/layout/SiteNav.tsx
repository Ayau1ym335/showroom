import Link from 'next/link';

export function SiteNav({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <nav className="sticky top-0 z-[100] flex items-center justify-between border-b border-line bg-paper/90 px-6 py-4 backdrop-blur-md md:px-14">
      <Link href="/" className="font-serif text-2xl">
        Dori
      </Link>
      <div className="hidden gap-8 text-sm md:flex">
        <Link href="/catalog">Каталог</Link>
        <Link href="/#lookbook">Lookbook</Link>
        <Link href="/#reviews">Отзывы</Link>
        <Link href="/#contacts">Контакты</Link>
      </div>
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-pill bg-ink px-5 py-2.5 text-xs uppercase tracking-wide text-paper"
      >
        WhatsApp
      </a>
    </nav>
  );
}
