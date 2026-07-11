'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { ProductSize } from '@/types';
import { buildWhatsAppLink } from '@/lib/utils';

export function SizeSelector({
  sizes,
  productTitle,
  whatsappNumber,
}: {
  sizes: ProductSize[];
  productTitle: string;
  whatsappNumber: string;
}) {
  const [selected, setSelected] = useState<ProductSize | null>(null);

  const sortedSizes = [...sizes].sort((a, b) => a.sort_order - b.sort_order);

  function handleWhatsApp() {
    if (!selected) return;
    const message = `Здравствуйте! Интересует товар: ${productTitle}, размер ${selected.size_label}.`;
    window.open(buildWhatsAppLink(whatsappNumber, message), '_blank');
  }

  return (
    <div>
      <div className="mb-5 border-b border-line pb-7">
        <span className="mb-3.5 block text-xs uppercase tracking-wide text-muted">Размер</span>
        <div className="mb-3.5 flex flex-wrap gap-2.5">
          {sortedSizes.map((size) => (
            <button
              key={size.id}
              onClick={() => setSelected(size)}
              className={`flex h-11 min-w-[52px] items-center justify-center rounded-xl border px-4 text-sm transition-colors ${
                selected?.id === size.id
                  ? 'border-ink bg-ink text-paper'
                  : 'border-line bg-card hover:border-taupe-soft'
              }`}
            >
              {size.size_label}
            </button>
          ))}
        </div>

        <div className="flex min-h-[20px] items-center gap-2 text-sm">
          {selected && (
            <>
              <span
                className={`h-1.5 w-1.5 rounded-full ${selected.in_stock ? 'bg-taupe' : 'bg-danger'}`}
              />
              <span className={selected.in_stock ? 'text-muted' : 'text-danger'}>
                {selected.in_stock ? 'В наличии' : 'Нет в наличии'}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="mb-7">
        <button
          onClick={handleWhatsApp}
          disabled={!selected || !selected.in_stock}
          className="flex w-full items-center justify-center gap-2.5 rounded-pill bg-ink py-4 text-xs uppercase tracking-wide text-paper transition-colors hover:bg-[#2b2622] disabled:cursor-not-allowed disabled:bg-taupe-soft"
        >
          <MessageCircle size={18} strokeWidth={1.8} />
          {!selected
            ? 'Выберите размер'
            : selected.in_stock
              ? 'Написать в WhatsApp'
              : 'Размер недоступен'}
        </button>
        <p className="mt-2.5 text-center text-xs text-muted">
          Заказ оформляется через WhatsApp напрямую с шоурумом
        </p>
      </div>
    </div>
  );
}
