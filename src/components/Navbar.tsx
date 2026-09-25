import React from 'react';
import { BookOpen, Shield, User, Sparkles, GraduationCap, LogIn } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  purchasedCount: number;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  setUser,
  purchasedCount,
  onOpenAuthModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#EAE8E4] border-b-2 border-[#1A1A1A] text-[#1A1A1A]">
      {/* Top Banner with University Name */}
      <div className="bg-[#1A1A1A] text-[#EAE8E4] px-4 py-1.5 text-xs font-mono flex flex-wrap items-center justify-between gap-2 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-2 tracking-wide">
          <GraduationCap className="w-4 h-4 text-[#F25C05]" />
          <span className="font-bold uppercase tracking-wider">СЗГМУ им. И. И. Мечникова</span>
          <span className="hidden sm:inline text-[#EAE8E4]/40">•</span>
          <span className="hidden sm:inline text-[#EAE8E4]/80 font-sans">Платформа подготовки к экзаменам</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#EAE8E4]/60 hidden md:inline">Аккаунт:</span>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              user.role === 'admin'
                ? 'bg-[#F25C05] text-[#1A1A1A]'
                : 'bg-[#EAE8E4] text-[#1A1A1A]'
            }`}>
              <Shield className="w-3 h-3" />
              {user.role === 'admin' ? 'Администратор' : user.name}
            </span>
            <button
              onClick={onOpenAuthModal}
              className="px-2 py-0.5 bg-[#EAE8E4]/20 hover:bg-[#F25C05] hover:text-[#1A1A1A] text-[#EAE8E4] font-bold text-[10px] uppercase transition-colors flex items-center gap-1"
            >
              <LogIn className="w-3 h-3" />
              <span>Войти</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentTab('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#1A1A1A] text-[#F25C05] flex items-center justify-center font-bold shadow-sm group-hover:bg-[#F25C05] group-hover:text-[#1A1A1A] transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif font-bold text-lg leading-tight tracking-tight text-[#1A1A1A] flex items-center gap-1.5">
                <span>Лекции, <span className="italic text-[#F25C05]">материалы</span></span>
              </div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-[#1A1A1A]/70 font-semibold">
                Образовательный портал
              </div>
            </div>
          </div>

          {/* Nav Links Desktop */}
          <nav className="hidden lg:flex items-center gap-1 font-mono text-xs uppercase tracking-wider">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-2 font-bold transition-all ${
                currentTab === 'home'
                  ? 'bg-[#1A1A1A] text-[#EAE8E4]'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
              }`}
            >
              Главная
            </button>
            <button
              onClick={() => setCurrentTab('disciplines')}
              className={`px-3 py-2 font-bold transition-all ${
                currentTab === 'disciplines'
                  ? 'bg-[#1A1A1A] text-[#EAE8E4]'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
              }`}
            >
              Дисциплины (8)
            </button>
            <button
              onClick={() => setCurrentTab('materials')}
              className={`px-3 py-2 font-bold transition-all ${
                currentTab === 'materials'
                  ? 'bg-[#1A1A1A] text-[#EAE8E4]'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
              }`}
            >
              Материалы
            </button>
            <button
              onClick={() => setCurrentTab('tests')}
              className={`px-3 py-2 font-bold transition-all ${
                currentTab === 'tests'
                  ? 'bg-[#1A1A1A] text-[#EAE8E4]'
                  : 'text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
              }`}
            >
              Тесты
            </button>
            <button
              onClick={() => setCurrentTab('tickets')}
              className={`px-3.5 py-2 font-bold transition-all flex items-center gap-1.5 border border-[#1A1A1A] ${
                currentTab === 'tickets'
                  ? 'bg-[#F25C05] text-[#1A1A1A]'
                  : 'bg-transparent text-[#1A1A1A] hover:bg-[#F25C05] hover:text-[#1A1A1A]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Билеты и задачи</span>
            </button>
          </nav>

          {/* Action Area Right */}
          <div className="flex items-center gap-2 font-mono text-xs">

            <button
              onClick={() => setCurrentTab('cabinet')}
              className={`px-3 py-2 border border-[#1A1A1A] font-bold transition-all flex items-center gap-2 ${
                currentTab === 'cabinet'
                  ? 'bg-[#1A1A1A] text-[#EAE8E4]'
                  : 'bg-transparent text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#EAE8E4]'
              }`}
            >
              <User className="w-4 h-4 text-[#F25C05]" />
              <span className="hidden sm:inline uppercase">Кабинет</span>
              {purchasedCount > 0 && (
                <span className="bg-[#F25C05] text-[#1A1A1A] font-bold text-[10px] px-1.5 py-0.2">
                  {purchasedCount}
                </span>
              )}
            </button>

            {user.role === 'admin' ? (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`px-3 py-2 font-bold transition-all flex items-center gap-1.5 border border-[#1A1A1A] ${
                  currentTab === 'admin'
                    ? 'bg-[#F25C05] text-[#1A1A1A]'
                    : 'bg-[#1A1A1A] text-[#EAE8E4] hover:bg-[#F25C05] hover:text-[#1A1A1A]'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline uppercase">Админка</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3 py-2 font-bold transition-all flex items-center gap-1.5 border border-[#1A1A1A] bg-[#1A1A1A] text-[#EAE8E4] hover:bg-[#F25C05] hover:text-[#1A1A1A]"
              >
                <LogIn className="w-4 h-4 text-[#F25C05]" />
                <span className="hidden sm:inline uppercase">Вход</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Secondary Sub-Bar */}
      <div className="lg:hidden bg-[#1A1A1A] border-t border-[#1A1A1A] px-2 py-2 overflow-x-auto flex items-center gap-2 no-scrollbar text-xs font-mono uppercase">
        <button
          onClick={() => setCurrentTab('home')}
          className={`px-3 py-1 whitespace-nowrap font-bold ${
            currentTab === 'home' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'text-[#EAE8E4] hover:bg-[#EAE8E4]/10'
          }`}
        >
          Главная
        </button>
        <button
          onClick={() => setCurrentTab('disciplines')}
          className={`px-3 py-1 whitespace-nowrap font-bold ${
            currentTab === 'disciplines' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'text-[#EAE8E4] hover:bg-[#EAE8E4]/10'
          }`}
        >
          Дисциплины
        </button>
        <button
          onClick={() => setCurrentTab('materials')}
          className={`px-3 py-1 whitespace-nowrap font-bold ${
            currentTab === 'materials' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'text-[#EAE8E4] hover:bg-[#EAE8E4]/10'
          }`}
        >
          Материалы
        </button>
        <button
          onClick={() => setCurrentTab('tests')}
          className={`px-3 py-1 whitespace-nowrap font-bold ${
            currentTab === 'tests' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'text-[#EAE8E4] hover:bg-[#EAE8E4]/10'
          }`}
        >
          Тесты
        </button>
        <button
          onClick={() => setCurrentTab('tickets')}
          className={`px-3 py-1 whitespace-nowrap font-bold flex items-center gap-1 border border-[#F25C05] ${
            currentTab === 'tickets' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'text-[#F25C05]'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          Билеты
        </button>
        <button
          onClick={onOpenAuthModal}
          className="px-3 py-1 whitespace-nowrap text-[#F25C05] font-bold"
        >
          Вход
        </button>
      </div>
    </header>
  );
};
