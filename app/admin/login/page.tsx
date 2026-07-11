'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    // Владелец — единственный пользователь в Supabase Auth, email фиксирован заранее
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'owner@dori.shop',
      password,
    });

    if (authError) {
      setError('Неверный пароль');
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm">
        <div className="mb-2 text-center font-serif text-3xl">Dori</div>
        <p className="mb-9 text-center text-sm text-muted">Вход в панель управления</p>

        <div className="mb-4">
          <label className="mb-2 block text-xs uppercase tracking-wide text-muted">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
            className="w-full rounded-xl border border-line bg-card px-3.5 py-3 text-sm focus:border-taupe focus:outline-none"
          />
        </div>

        {error && <p className="mb-4 text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-pill bg-ink py-3.5 text-xs uppercase tracking-wide text-paper transition-colors hover:bg-[#2b2622] disabled:opacity-60"
        >
          {loading ? 'Входим…' : 'Войти'}
        </button>

        <p className="mt-5 text-center text-xs text-taupe-soft">Доступ только для владельца шоурума</p>
      </form>
    </div>
  );
}
