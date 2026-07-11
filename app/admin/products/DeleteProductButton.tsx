'use client';

import { deleteProduct } from './actions';

export function DeleteProductButton({ productId }: { productId: string }) {
  async function handleDelete() {
    if (!confirm('Удалить товар без возможности восстановления?')) return;
    await deleteProduct(productId);
  }

  return (
    <button
      onClick={handleDelete}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line hover:border-danger hover:text-danger"
    >
      🗑
    </button>
  );
}
