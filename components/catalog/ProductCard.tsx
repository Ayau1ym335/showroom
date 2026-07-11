import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  const mainImage = product.media?.find((m) => m.media_type === 'image');
  const hoverImage = product.media?.filter((m) => m.media_type === 'image')[1];
  const hasStock = product.sizes?.some((s) => s.in_stock) ?? true;
  const availableSizes = product.sizes?.filter((s) => s.in_stock).slice(0, 3) ?? [];

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative mb-3.5 aspect-[3/4] overflow-hidden rounded-card bg-gradient-to-br from-[#EDE8DC] to-[#DED5C3]">
        <div
          className={`absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[10px] uppercase tracking-wide ${
            hasStock ? 'bg-white/95 text-ink' : 'bg-white/95 text-danger'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${hasStock ? 'bg-taupe' : 'bg-danger'}`} />
          {hasStock ? 'В наличии' : 'Нет в наличии'}
        </div>

        {mainImage && (
          <Image
            src={mainImage.url}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
        {hoverImage && (
          <Image
            src={hoverImage.url}
            alt=""
            fill
            className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
      </div>

      {product.brand && (
        <div className="mb-1 text-[11px] uppercase tracking-wide text-taupe">
          {product.brand.name}
        </div>
      )}
      <div className="mb-1.5 text-sm font-medium">{product.title}</div>

      {availableSizes.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {availableSizes.map((s) => (
            <span key={s.id} className="rounded-md border border-line px-1.5 py-0.5 text-[11px] text-muted">
              {s.size_label}
            </span>
          ))}
        </div>
      )}

      <div className="text-sm">
        {product.discount_price ? (
          <>
            <span className="mr-2 text-xs text-taupe-soft line-through">{formatPrice(product.price)}</span>
            <span>{formatPrice(product.discount_price)}</span>
          </>
        ) : (
          formatPrice(product.price)
        )}
      </div>
    </Link>
  );
}
