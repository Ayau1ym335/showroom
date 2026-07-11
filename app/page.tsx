import Image from 'next/image';
import Link from 'next/link';
import {
  getNewCollection,
  getPublishedReviews,
  getLookbookVideos,
  getActiveBanner,
  getInstagramPosts,
  getSiteSettings,
} from '@/lib/data';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { ProductCard } from '@/components/catalog/ProductCard';
import { buildWhatsAppLink } from '@/lib/utils';

const CATEGORY_TILES = [
  { label: 'Женская одежда', gender: 'female' },
  { label: 'Мужская одежда', gender: 'male' },
  { label: 'Детская одежда', gender: 'kids' },
  { label: 'Обувь', gender: undefined, category: 'obuv' },
];

const WHY_US = [
  { icon: '✓', title: 'Качественные материалы', text: 'Только оригинальные вещи из натуральных и премиальных тканей, без подделок.' },
  { icon: '◆', title: 'Проверенные поставщики', text: 'Работаем напрямую с брендами и официальными шоурумами в Европе, США, Корее и Японии.' },
  { icon: '↻', title: 'Регулярные поступления', text: 'Ассортимент обновляется каждую неделю — следите в Instagram, чтобы не пропустить новинки.' },
  { icon: '✎', title: 'Помощь в подборе размера', text: 'Перед покупкой поможем сверить размер по параметрам — просто напишите в WhatsApp.' },
];

const ORDER_STEPS = [
  { num: '01', title: 'Выберите товар', text: 'Просмотрите каталог и найдите то, что вам понравилось.' },
  { num: '02', title: 'Напишите в WhatsApp', text: 'Нажмите кнопку на странице товара — сообщение с артикулом заполнится само.' },
  { num: '03', title: 'Уточните размер', text: 'Мы поможем подобрать размер и подтвердим наличие товара.' },
  { num: '04', title: 'Заберите заказ', text: 'Оформим доставку по Казахстану или встретим в шоуруме.' },
];

export default async function HomePage() {
  const [newCollection, reviews, lookbook, banner, instagramPosts, settings] = await Promise.all([
    getNewCollection(4),
    getPublishedReviews(),
    getLookbookVideos(),
    getActiveBanner(),
    getInstagramPosts(),
    getSiteSettings(),
  ]);

  const contactMessage = 'Здравствуйте! Хочу узнать подробнее об ассортименте Dori.';

  return (
    <>
      <SiteNav whatsappNumber={settings.whatsapp_number} />

      {/* ===== HERO ===== */}
      <section className="grid gap-14 px-6 py-16 md:grid-cols-2 md:items-center md:px-14 md:py-22">
        <div>
          <span className="mb-6 inline-block rounded-pill border border-taupe-soft px-3.5 py-1.5 text-xs uppercase tracking-wide text-taupe">
            Новая коллекция уже в шоуруме
          </span>
          <h1 className="mb-5 font-serif text-4xl font-medium leading-[1.08] md:text-6xl">
            Оригинальные вещи
            <br />
            <em className="text-taupe not-italic italic">для всей семьи</em>
          </h1>
          <p className="mb-8 max-w-md text-base leading-relaxed text-muted">
            Мультибрендовый шоурум Dori — женская, мужская и детская одежда и обувь от проверенных
            брендов из Европы, США, Кореи и Японии.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Link
              href="/catalog"
              className="rounded-pill bg-ink px-7 py-4 text-xs uppercase tracking-wide text-paper transition-colors hover:bg-[#2b2622]"
            >
              Смотреть каталог →
            </Link>
            <a
              href={buildWhatsAppLink(settings.whatsapp_number, contactMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-pill border border-ink px-7 py-4 text-xs uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
            >
              Написать в WhatsApp
            </a>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-[#E9E3D6] via-[#D9D0BE] to-[#C9BEA8]">
          {banner?.image_url && (
            <Image src={banner.image_url} alt={banner.title ?? 'Dori'} fill className="object-cover" priority />
          )}
          <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 rounded-pill bg-white/94 px-4.5 py-2.5 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-taupe" />
            Новинка недели
          </div>
        </div>
      </section>

      {/* ===== 1. НОВАЯ КОЛЛЕКЦИЯ ===== */}
      <section className="px-6 py-16 md:px-14 md:py-20">
        <div className="mb-11">
          <span className="mb-2.5 block text-xs uppercase tracking-wide text-taupe">Только что привезли</span>
          <h2 className="font-serif text-3xl font-medium md:text-4xl">Новая коллекция</h2>
        </div>
        <div className="grid grid-cols-2 gap-7 md:grid-cols-4">
          {newCollection.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/catalog"
            className="inline-block rounded-pill border border-ink px-7 py-3.5 text-xs uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
          >
            Смотреть весь каталог →
          </Link>
        </div>
      </section>

      {/* ===== 2. КАТЕГОРИИ ===== */}
      <section className="px-6 pb-16 md:px-14 md:pb-20">
        <div className="mb-11">
          <span className="mb-2.5 block text-xs uppercase tracking-wide text-taupe">Разделы</span>
          <h2 className="font-serif text-3xl font-medium md:text-4xl">Что вы ищете</h2>
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {CATEGORY_TILES.map((tile) => (
            <Link
              key={tile.label}
              href={tile.gender ? `/catalog?gender=${tile.gender}` : `/catalog?category=${tile.category}`}
              className="group relative flex aspect-[3/4] items-end overflow-hidden rounded-3xl bg-gradient-to-br from-[#E4DCCB] to-[#C7BBA1] p-6"
            >
              <span className="relative z-10 font-serif text-2xl transition-transform group-hover:translate-x-1.5">
                {tile.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 3. ПОЧЕМУ ВЫБИРАЮТ НАС ===== */}
      <section className="border-y border-line bg-card px-6 py-16 md:px-14 md:py-20">
        <div className="mb-11">
          <span className="mb-2.5 block text-xs uppercase tracking-wide text-taupe">Почему Dori</span>
          <h2 className="font-serif text-3xl font-medium md:text-4xl">Нам доверяют выбор гардероба</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_US.map((item) => (
            <div key={item.title} className="rounded-card border border-line bg-card p-7">
              <div className="mb-4.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#F1ECE0] text-lg text-taupe">
                {item.icon}
              </div>
              <h4 className="mb-2 text-sm font-medium">{item.title}</h4>
              <p className="text-[13px] leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 4. ВИДЕО-ГАЛЕРЕЯ / LOOKBOOK ===== */}
      <section id="lookbook" className="px-6 py-16 md:px-14 md:py-20">
        <div className="mb-11">
          <span className="mb-2.5 block text-xs uppercase tracking-wide text-taupe">Lookbook</span>
          <h2 className="font-serif text-3xl font-medium md:text-4xl">Видео-галерея</h2>
        </div>
        <div className="grid grid-cols-2 gap-4.5 md:grid-cols-4">
          {lookbook.map((video) => (
            <a
              key={video.id}
              href={video.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-[9/16] overflow-hidden rounded-2xl bg-gradient-to-br from-[#EAE3D5] to-[#C9BEA8]"
            >
              {video.thumbnail_url && (
                <Image src={video.thumbnail_url} alt={video.caption ?? ''} fill className="object-cover" />
              )}
              {video.caption && (
                <span className="absolute left-4 top-4 z-10 rounded-pill bg-white/85 px-3 py-1 text-[11px]">
                  {video.caption}
                </span>
              )}
              <div className="absolute bottom-4 left-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xs">
                ▶
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ===== 5. ОТЗЫВЫ ===== */}
      <section id="reviews" className="px-6 py-16 md:px-14 md:py-20">
        <div className="mb-11">
          <span className="mb-2.5 block text-xs uppercase tracking-wide text-taupe">Отзывы</span>
          <h2 className="font-serif text-3xl font-medium md:text-4xl">Что говорят клиенты</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-card border border-line bg-card p-7">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#E4DCCB] to-[#C2B79E]">
                  {review.author_photo_url && (
                    <Image src={review.author_photo_url} alt={review.author_name} width={44} height={44} className="h-full w-full object-cover" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium">{review.author_name}</div>
                  <div className="text-xs tracking-widest text-taupe">{'★'.repeat(review.rating)}</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted">{review.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 6. INSTAGRAM ===== */}
      <section className="border-y border-line bg-card px-6 py-16 md:px-14 md:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="mb-2.5 block text-xs uppercase tracking-wide text-taupe">@dori__fashionstore</span>
            <h2 className="font-serif text-3xl font-medium md:text-4xl">Мы в Instagram</h2>
          </div>
          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-pill border border-ink px-6 py-3 text-xs uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
          >
            Перейти в Instagram →
          </a>
        </div>
        <div className="grid grid-cols-3 gap-2.5 md:grid-cols-6">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={post.post_url ?? settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-[#ECE5D8] to-[#D5C9B2]"
            >
              <Image src={post.image_url} alt="" fill className="object-cover transition-transform group-hover:scale-105" />
            </a>
          ))}
        </div>
      </section>

      {/* ===== 7. КАК ЗАКАЗАТЬ ===== */}
      <section className="px-6 py-16 md:px-14 md:py-20">
        <div className="mb-11">
          <span className="mb-2.5 block text-xs uppercase tracking-wide text-taupe">Процесс</span>
          <h2 className="font-serif text-3xl font-medium md:text-4xl">Как заказать</h2>
        </div>
        <div className="grid grid-cols-2 gap-7 md:grid-cols-4">
          {ORDER_STEPS.map((step) => (
            <div key={step.num}>
              <span className="mb-3.5 block font-serif text-4xl text-taupe-soft">{step.num}</span>
              <h4 className="mb-2 text-sm font-medium">{step.title}</h4>
              <p className="text-[13px] leading-relaxed text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 8. КОНТАКТЫ ===== */}
      <section id="contacts" className="px-6 py-16 md:px-14 md:py-20">
        <div className="grid gap-12 rounded-3xl bg-ink p-8 text-paper md:grid-cols-2 md:p-14">
          <div>
            <span className="mb-4.5 block text-xs uppercase tracking-wide text-[#C9A876]">Свяжитесь с нами</span>
            <h2 className="mb-4.5 font-serif text-3xl font-medium">Мы на связи каждый день</h2>
            <p className="mb-7 max-w-sm text-sm leading-relaxed text-[#C9C2B4]">
              Ответим на любые вопросы по товару, размеру и доставке. Быстрее всего — через WhatsApp.
            </p>
            <a
              href={buildWhatsAppLink(settings.whatsapp_number, contactMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-pill border border-[#3a352f] px-7 py-3.5 text-xs uppercase tracking-wide text-paper"
            >
              Написать в WhatsApp
            </a>
          </div>
          <div className="flex flex-col gap-4.5">
            <ContactRow icon="✆" label="WhatsApp" value={`wa.me/${settings.whatsapp_number}`} />
            {settings.phone && <ContactRow icon="☎" label="Телефон" value={settings.phone} />}
            <ContactRow icon="◎" label="Instagram" value="@dori__fashionstore" />
            {settings.work_hours && <ContactRow icon="⏱" label="График работы" value={settings.work_hours} />}
          </div>
        </div>
      </section>

      <SiteFooter settings={settings} />
      <WhatsAppFloat phoneNumber={settings.whatsapp_number} />
    </>
  );
}

function ContactRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3.5 border-b border-[#2b2622] pb-4.5 text-sm last:border-none last:pb-0">
      <div className="flex h-9.5 w-9.5 flex-shrink-0 items-center justify-center rounded-full bg-[#221f1b] text-[15px]">
        {icon}
      </div>
      <div>
        <span className="mb-0.5 block text-[11px] uppercase tracking-wide text-[#A9A192]">{label}</span>
        {value}
      </div>
    </div>
  );
}
