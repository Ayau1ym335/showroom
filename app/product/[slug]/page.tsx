import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts, getSiteSettings } from '@/lib/data';
import { SiteNav } from '@/components/layout/SiteNav';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductGallery } from '@/components/product/ProductGallery';
import { SizeSelector } from '@/components/product/SizeSelector';
import { formatPrice } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProductBySlug(slug), getSiteSettings()]);

  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  return (
    <>
      <SiteNav whatsappNumber={settings.whatsapp_number} />

      <div className="px-6 pt-6 text-xs text-muted md:px-14">
        <Link href="/">Главная</Link> / <Link href={`/catalog?gender=${product.gender}`}>{product.category?.name ?? 'Каталог'}</Link>
      </div>

      <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-14 px-6 py-6 md:grid-cols-[1.15fr_1fr] md:px-14 md:py-8">
        <ProductGallery media={product.media ?? []} />

        <div>
          {product.brand && (
            <span className="mb-4.5 inline-block rounded-pill bg-[#F1ECE0] px-3.5 py-1.5 text-[11px] uppercase tracking-wide text-taupe">
              {product.brand.name}
            </span>
          )}
          <h1 className="mb-4 max-w-md font-serif text-3xl font-medium leading-tight">{product.title}</h1>
          <div className="mb-7 flex items-baseline gap-3">
            {product.discount_price ? (
              <>
                <span className="font-serif text-2xl font-medium">{formatPrice(product.discount_price)}</span>
                <span className="text-base text-taupe-soft line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="font-serif text-2xl font-medium">{formatPrice(product.price)}</span>
            )}
          </div>

          <SizeSelector
            sizes={product.sizes ?? []}
            productTitle={`${product.title}, ${product.brand?.name ?? ''}`}
            whatsappNumber={settings.whatsapp_number}
          />

          {product.description && (
            <div className="mb-7 border-b border-line pb-7">
              <span className="mb-3.5 block text-xs uppercase tracking-wide text-muted">Описание</span>
              <p className="text-sm leading-relaxed text-[#2a2622]">{product.description}</p>
            </div>
          )}

          <div className="rounded-xl border-l-[3px] border-taupe bg-[#F1ECE0] px-4 py-3.5 text-xs leading-relaxed text-muted">
            Обмен и возврат по данной категории товаров не предусмотрены. Уточняйте размер перед
            заказом — поможем подобрать его в WhatsApp.
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1360px] px-6 pb-24 md:px-14">
          <h2 className="mb-8 font-serif text-2xl font-medium">Похожие товары</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <WhatsAppFloat phoneNumber={settings.whatsapp_number} />
    </>
  );
}
