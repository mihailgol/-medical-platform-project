import React from 'react';
import { Discipline, Material } from '../types';
import { 
  GraduationCap, Sparkles, BookOpen, FileCheck2, ArrowRight, ShieldCheck, 
  Brain, CheckCircle2, Lock, Download, Award, Activity, Microscope, 
  Dna, HeartPulse, FlaskConical, Binary, Languages, ShieldAlert 
} from 'lucide-react';

interface HomeViewProps {
  disciplines: Discipline[];
  materials: Material[];
  setCurrentTab: (tab: string) => void;
  setSelectedDisciplineId: (id: string) => void;
  onOpenPurchase: (mat: Material) => void;
  purchasedMaterialIds: string[];
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Activity,
  Microscope,
  Dna,
  HeartPulse,
  FlaskConical,
  Binary,
  Languages,
  ShieldAlert
};

export const HomeView: React.FC<HomeViewProps> = ({
  disciplines,
  materials,
  setCurrentTab,
  setSelectedDisciplineId,
  onOpenPurchase,
  purchasedMaterialIds
}) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section - Artistic Flair Dark Editorial Frame */}
      <section className="relative overflow-hidden bg-[#1A1A1A] text-[#EAE8E4] border-2 border-[#1A1A1A] p-6 sm:p-10 lg:p-12 shadow-md">
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F25C05] text-[#1A1A1A] font-mono text-xs font-bold uppercase tracking-widest">
            <GraduationCap className="w-4 h-4" />
            <span>Официальный формат подготовки</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight leading-tight text-[#EAE8E4]">
            Единая платформа подготовки к <span className="italic text-[#F25C05]">экзаменам и зачетам</span>
          </h1>

          <p className="text-[#EAE8E4]/80 text-base sm:text-lg leading-relaxed max-w-2xl font-sans">
            Структурированные лекции, краткие конспекты, интерактивное тестирование, случайные экзаменационные билеты и <strong className="text-[#F25C05] font-semibold underline underline-offset-4 decoration-[#F25C05]">автоматическая проверка письменных ответов</strong> по эталонам кафедры.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-[#EAE8E4]/20 font-mono">
            <div className="border-r border-[#EAE8E4]/20 pr-2">
              <div className="text-3xl font-serif font-bold text-[#F25C05]">8</div>
              <div className="text-[11px] uppercase tracking-wider text-[#EAE8E4]/70 mt-1">Дисциплин вуза</div>
            </div>
            <div className="border-r border-[#EAE8E4]/20 pr-2">
              <div className="text-3xl font-serif font-bold text-[#EAE8E4]">100%</div>
              <div className="text-[11px] uppercase tracking-wider text-[#EAE8E4]/70 mt-1">Соответствие ФГОС</div>
            </div>
            <div className="border-r border-[#EAE8E4]/20 pr-2">
              <div className="text-3xl font-serif font-bold text-[#F25C05]">Эталон</div>
              <div className="text-[11px] uppercase tracking-wider text-[#EAE8E4]/70 mt-1">Критерии кафедры</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-[#EAE8E4]">НПД</div>
              <div className="text-[11px] uppercase tracking-wider text-[#EAE8E4]/70 mt-1">Чек «Мой налог»</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs uppercase tracking-wider">
            <button
              onClick={() => setCurrentTab('tickets')}
              className="px-6 py-3.5 bg-[#F25C05] hover:bg-[#F25C05]/90 text-[#1A1A1A] font-bold transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Генератор билетов</span>
            </button>

            <button
              onClick={() => setCurrentTab('disciplines')}
              className="px-6 py-3.5 bg-transparent hover:bg-[#EAE8E4] hover:text-[#1A1A1A] text-[#EAE8E4] border border-[#EAE8E4] font-bold transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#F25C05]" />
              <span>Выбрать дисциплину</span>
            </button>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="space-y-6">
        <div className="border-b-2 border-[#1A1A1A] pb-3 flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#F25C05] font-bold">Особенности</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              Всё для высокой оценки на экзамене
            </h2>
          </div>
          <p className="text-xs text-[#1A1A1A]/70 max-w-md font-sans">
            Платформа проектировалась специально под учебную программу и критерии медицинских кафедр.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 space-y-3 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#EAE8E4] transition-all group">
            <div className="w-10 h-10 bg-[#1A1A1A] text-[#F25C05] group-hover:bg-[#F25C05] group-hover:text-[#1A1A1A] flex items-center justify-center font-bold transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg">Учебные лекции и методички</h3>
            <p className="text-xs leading-relaxed opacity-80">
              Структурированные лекции, конспекты, файлы PDF/DOCX/PPTX. Часть материалов доступна бесплатно, эксклюзивные сборники — по доступной разовой цене.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 space-y-3 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#EAE8E4] transition-all group">
            <div className="w-10 h-10 bg-[#1A1A1A] text-[#F25C05] group-hover:bg-[#F25C05] group-hover:text-[#1A1A1A] flex items-center justify-center font-bold transition-colors">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg">Тестирование по темам</h3>
            <p className="text-xs leading-relaxed opacity-80">
              Банк вопросов с автоматической выборкой, разбором правильных и ошибочных вариантов ответов, сохранением результатов в личном кабинете.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 space-y-3 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#EAE8E4] transition-all group">
            <div className="w-10 h-10 bg-[#1A1A1A] text-[#F25C05] group-hover:bg-[#F25C05] group-hover:text-[#1A1A1A] flex items-center justify-center font-bold transition-colors">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg">AI-проверка ответа на билет</h3>
            <p className="text-xs leading-relaxed opacity-80">
              Сгенерируйте случайный билет, напишите развернутый ответ от руки или на клавиатуре — нейросеть проверит ответ по эталону кафедры и поставит балл.
            </p>
          </div>
        </div>
      </section>

      {/* 8 Disciplines Catalog Grid */}
      <section className="space-y-6">
        <div className="border-b-2 border-[#1A1A1A] pb-3 flex items-center justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#F25C05] font-bold">Каталог</span>
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">
              Все 8 дисциплин
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('disciplines')}
            className="font-mono text-xs uppercase tracking-wider font-bold text-[#1A1A1A] hover:text-[#F25C05] flex items-center gap-1 transition-colors"
          >
            <span>Перейти к дисциплинам</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {disciplines.map(disc => {
            const IconComponent = ICON_MAP[disc.iconName] || Activity;
            return (
              <div
                key={disc.id}
                onClick={() => {
                  setSelectedDisciplineId(disc.id);
                  setCurrentTab('disciplines');
                }}
                className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-5 cursor-pointer transition-all hover:bg-[#1A1A1A] hover:text-[#EAE8E4] group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-[#1A1A1A] text-[#F25C05] group-hover:bg-[#F25C05] group-hover:text-[#1A1A1A] flex items-center justify-center font-bold transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base group-hover:text-[#F25C05] transition-colors">
                      {disc.name}
                    </h3>
                    <p className="text-xs opacity-75 line-clamp-2 mt-1 font-sans">
                      {disc.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1A1A1A]/30 group-hover:border-[#EAE8E4]/30 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider font-semibold">
                  <span>{disc.materialsCount} мат.</span>
                  <span>{disc.testsCount} тест.</span>
                  <span>{disc.ticketsCount} билетов</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Materials Section */}
      <section className="space-y-6">
        <div className="border-b-2 border-[#1A1A1A] pb-3 flex items-center justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#F25C05] font-bold">Библиотека</span>
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">
              Популярные материалы
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('materials')}
            className="font-mono text-xs uppercase tracking-wider font-bold text-[#1A1A1A] hover:text-[#F25C05] flex items-center gap-1 transition-colors"
          >
            <span>Все материалы</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.slice(0, 3).map(mat => {
            const isOwned = purchasedMaterialIds.includes(mat.id) || !mat.isPremium;

            return (
              <div
                key={mat.id}
                className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-5 flex flex-col justify-between space-y-4 hover:border-[#F25C05] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#1A1A1A] bg-[#1A1A1A]/10 px-2 py-0.5 border border-[#1A1A1A]">
                      {mat.disciplineName}
                    </span>
                    {mat.isPremium ? (
                      <span className="text-xs font-mono font-bold text-[#1A1A1A] bg-[#F25C05] px-2.5 py-0.5">
                        {mat.price} ₽
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-[#1A1A1A] bg-[#EAE8E4] border border-[#1A1A1A] px-2 py-0.5">
                        Бесплатно
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#1A1A1A] line-clamp-2">
                    {mat.title}
                  </h3>

                  <p className="text-xs text-[#1A1A1A]/80 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1A1A1A] font-mono text-xs uppercase tracking-wider">
                  {isOwned ? (
                    <button
                      onClick={() => setCurrentTab('materials')}
                      className="w-full py-2 bg-[#1A1A1A] text-[#EAE8E4] font-bold flex items-center justify-center gap-1.5 hover:bg-[#F25C05] hover:text-[#1A1A1A] transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#F25C05]" />
                      <span>Читать доступно</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenPurchase(mat)}
                      className="w-full py-2 bg-[#F25C05] text-[#1A1A1A] font-bold flex items-center justify-center gap-1.5 hover:bg-[#1A1A1A] hover:text-[#EAE8E4] transition-colors"
                    >
                      <span>Купить за {mat.price} ₽</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ticket Showcase Banner */}
      <section className="bg-[#1A1A1A] border-2 border-[#1A1A1A] p-6 sm:p-8 text-[#EAE8E4] space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F25C05] text-[#1A1A1A] font-mono text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Экзаменационный тренажёр</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#EAE8E4]">
              Напиши ответ на билет — сверься с эталоном кафедры
            </h3>
            <p className="text-xs sm:text-sm text-[#EAE8E4]/80 leading-relaxed font-sans">
              Система сопоставляет ответ студента с эталонными тезисами и критериями кафедры. Показывает оценку (2-5), соответствие критериям и рекомендации.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('tickets')}
            className="px-6 py-3.5 bg-[#F25C05] text-[#1A1A1A] hover:bg-[#EAE8E4] font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0"
          >
            <span>Проверить ответ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Trust & Self-Employed Compliance */}
      <section className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 text-[#1A1A1A] grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-[#F25C05] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif font-bold text-base">Статус Самозанятого</h4>
            <p className="text-xs text-[#1A1A1A]/80 mt-1 leading-relaxed">
              Официальный налог на профессиональный доход (НПД). Автоматическая выдача чеков через «Мой налог».
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Lock className="w-6 h-6 text-[#F25C05] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif font-bold text-base">Мгновенный доступ</h4>
            <p className="text-xs text-[#1A1A1A]/80 mt-1 leading-relaxed">
              Все купленные материалы и наборы автоматически сохраняются в вашем личном кабинете.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Award className="w-6 h-6 text-[#F25C05] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif font-bold text-base">Медицинская специализация</h4>
            <p className="text-xs text-[#1A1A1A]/80 mt-1 leading-relaxed">
              Контент и критерии AI создаются с учетом требований преподавателей кафедр вуза.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

