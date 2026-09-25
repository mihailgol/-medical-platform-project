import React from 'react';
import { BookOpen, ShieldCheck, CreditCard, FileText, Mail, MapPin, RefreshCw, Lock } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  onOpenLegalTab?: (subtab: 'offer' | 'refund' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, onOpenLegalTab }) => {
  const handleLegalClick = (subtab: 'offer' | 'refund' | 'privacy') => {
    if (onOpenLegalTab) {
      onOpenLegalTab(subtab);
    } else {
      setCurrentTab('offer');
    }
  };

  return (
    <footer className="bg-[#1A1A1A] text-[#EAE8E4] border-t-2 border-[#1A1A1A] text-sm mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Platform Overview */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 text-[#EAE8E4] font-serif font-bold text-lg">
              <div className="w-8 h-8 bg-[#F25C05] text-[#1A1A1A] flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <span>Лекции, материалы</span>
            </div>
            <p className="text-xs text-[#EAE8E4]/80 leading-relaxed">
              Образовательная веб-платформа для подготовки к зачетам, экзаменам и аттестациям студентов.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#EAE8E4] bg-[#EAE8E4]/10 border border-[#EAE8E4]/20 p-2.5 font-mono">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#F25C05]" />
              <span>Статус Самозанятого (НПД). Автоматические чеки «Мой налог».</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-[#F25C05] font-mono font-bold mb-3 text-xs uppercase tracking-wider">Разделы сайта</h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <button onClick={() => setCurrentTab('disciplines')} className="hover:text-[#F25C05] transition-colors">
                  Каталог дисциплин (8)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('materials')} className="hover:text-[#F25C05] transition-colors">
                  Лекции и методички
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('tests')} className="hover:text-[#F25C05] transition-colors">
                  Тестирование онлайн
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('tickets')} className="hover:text-[#F25C05] transition-colors">
                  Генератор билетов & AI
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('cabinet')} className="hover:text-[#F25C05] transition-colors">
                  Личный кабинет
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Payment Safety */}
          <div>
            <h4 className="text-[#F25C05] font-mono font-bold mb-3 text-xs uppercase tracking-wider">Правовая информация</h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <button onClick={() => handleLegalClick('offer')} className="hover:text-[#F25C05] transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#F25C05]" />
                  <span>Публичная оферта</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleLegalClick('refund')} className="hover:text-[#F25C05] transition-colors flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-[#F25C05]" />
                  <span>Порядок возврата средств</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleLegalClick('privacy')} className="hover:text-[#F25C05] transition-colors flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#F25C05]" />
                  <span>Персональные данные (152-ФЗ)</span>
                </button>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-[#EAE8E4]/10 flex items-center gap-2 text-[#EAE8E4]/70 font-mono text-[11px]">
              <CreditCard className="w-4 h-4 text-[#F25C05]" />
              <span>Оплата картой / СБП</span>
            </div>
          </div>

          {/* Col 4: Contacts & University */}
          <div>
            <h4 className="text-[#F25C05] font-mono font-bold mb-3 text-xs uppercase tracking-wider">Контакты</h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F25C05] shrink-0 mt-0.5" />
                <span>г. Санкт-Петербург</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F25C05] shrink-0" />
                <span>support@med-materials.ru</span>
              </div>
            </div>
            <p className="text-[11px] text-[#EAE8E4]/70 mt-4 leading-normal font-sans">
              Проект создан для удобства подготовки студентов. Все материалы и критерии AI согласованы с учебной программой.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-[#EAE8E4]/10 text-center font-mono text-xs text-[#EAE8E4]/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} «Лекции, материалы». Все права защищены.
          </div>
          <div>
            Самозанятый • Налог на профессиональный доход (НПД)
          </div>
        </div>
      </div>
    </footer>
  );
};
