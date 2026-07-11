'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProductMedia } from '@/types';

export function ProductGallery({ media }: { media: ProductMedia[] }) {
  const sorted = [...media].sort((a, b) => a.sort_order - b.sort_order);
  const [active, setActive] = useState(sorted[0]);

  if (sorted.length === 0) {
    return <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-[#EDE8DC] to-[#DED5C3]" />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-gradient-to-br from-[#EDE8DC] to-[#DED5C3]">
        {active.media_type === 'image' ? (
          <Image src={active.url} alt="" fill className="object-cover" priority />
        ) : (
          <video src={active.url} controls className="h-full w-full object-cover" />
        )}
      </div>
      <div className="grid grid-cols-4 gap-2.5">
        {sorted.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item)}
            className={`relative aspect-[3/4] overflow-hidden rounded-xl border-2 bg-gradient-to-br from-[#E9E3D6] to-[#D5C9B2] transition-colors ${
              active.id === item.id ? 'border-ink' : 'border-transparent'
            }`}
          >
            {item.media_type === 'video' ? (
              <span className="flex h-full w-full items-center justify-center bg-[#1c1a17] text-sm text-paper">
                ▶
              </span>
            ) : (
              <Image src={item.thumbnail_url ?? item.url} alt="" fill className="object-cover" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
