import { MessageCircle } from 'lucide-react';

export function WhatsAppFloat({ phoneNumber }: { phoneNumber: string }) {
  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Написать в WhatsApp"
      className="fixed bottom-6 right-6 z-[200] flex h-14 w-14 items-center justify-center rounded-full bg-[#1E1B18] text-paper shadow-[0_10px_28px_rgba(20,18,16,0.28)] transition-transform hover:scale-[1.07]"
    >
      <MessageCircle size={26} strokeWidth={1.8} />
    </a>
  );
}
