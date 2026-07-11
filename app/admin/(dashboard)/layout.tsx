import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  async function logout() {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[240px_1fr]">
      <AdminSidebar logoutAction={logout} />
      <main className="flex-1 overflow-y-auto bg-paper p-5 lg:p-9">{children}</main>
    </div>
  );
}
