import { getSiteSettings } from '@/lib/data';
import { updateSiteSettings } from './actions';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-serif text-3xl font-medium">Настройки сайта</h1>
        <p className="mt-1 text-sm text-muted">Контакты и ссылки, которые видны на всех страницах</p>
      </div>

      <form action={updateSiteSettings} className="max-w-md rounded-card border border-line bg-card p-6">
        <FormField label="Номер WhatsApp" name="whatsapp_number" defaultValue={settings.whatsapp_number} />
        <FormField label="Instagram" name="instagram_url" defaultValue={settings.instagram_url} />
        <FormField label="Телефон" name="phone" defaultValue={settings.phone ?? ''} />
        <FormField label="График работы" name="work_hours" defaultValue={settings.work_hours ?? ''} />
        <button
          type="submit"
          className="mt-2 rounded-pill bg-ink px-6 py-3 text-sm text-paper transition-colors hover:bg-[#2b2622]"
        >
          Сохранить
        </button>
      </form>
    </div>
  );
}

function FormField({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-xs uppercase tracking-wide text-muted">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-line px-3.5 py-2.5 text-sm focus:border-taupe focus:outline-none"
      />
    </div>
  );
}
