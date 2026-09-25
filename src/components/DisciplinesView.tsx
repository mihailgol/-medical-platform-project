import React, { useState } from 'react';
import { Discipline, Material, Test, ExamTicket } from '../types';
import { 
  BookOpen, FileCheck2, Sparkles, Search, ArrowLeft, ArrowRight, 
  CheckCircle2, Lock, Download, Activity, Microscope, 
  Dna, HeartPulse, FlaskConical, Binary, Languages, ShieldAlert 
} from 'lucide-react';

interface DisciplinesViewProps {
  disciplines: Discipline[];
  materials: Material[];
  tests: Test[];
  tickets: ExamTicket[];
  selectedDisciplineId: string | null;
  setSelectedDisciplineId: (id: string | null) => void;
  setCurrentTab: (tab: string) => void;
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

export const DisciplinesView: React.FC<DisciplinesViewProps> = ({
  disciplines,
  materials,
  tests,
  tickets,
  selectedDisciplineId,
  setSelectedDisciplineId,
  setCurrentTab,
  onOpenPurchase,
  purchasedMaterialIds
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [readingMaterial, setReadingMaterial] = useState<Material | null>(null);

  const activeDiscipline = disciplines.find(d => d.id === selectedDisciplineId);

  // Filter materials for current active discipline or search
  const filteredMaterials = materials.filter(m => {
    const matchesDisc = !selectedDisciplineId || m.disciplineId === selectedDisciplineId;
    const matchesTopic = !selectedTopic || m.topic === selectedTopic;
    const matchesSearch = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDisc && matchesTopic && matchesSearch;
  });

  const filteredTests = tests.filter(t => !selectedDisciplineId || t.disciplineId === selectedDisciplineId);
  const filteredTickets = tickets.filter(t => !selectedDisciplineId || t.disciplineId === selectedDisciplineId);

  return (
    <div className="space-y-8 pb-12">
      {/* If a specific discipline is selected */}
      {activeDiscipline ? (
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={() => {
              setSelectedDisciplineId(null);
              setSelectedTopic(null);
            }}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase font-bold text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#EAE8E4] border border-[#1A1A1A] px-3 py-1.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#F25C05]" />
            <span>Вернуться в список всех дисциплин</span>
          </button>

          {/* Discipline Header Banner - Dark Artistic Frame */}
          <div className="p-6 sm:p-8 bg-[#1A1A1A] text-[#EAE8E4] border-2 border-[#1A1A1A] space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#F25C05] text-[#1A1A1A] flex items-center justify-center font-bold">
                {React.createElement(ICON_MAP[activeDiscipline.iconName] || Activity, { className: "w-6 h-6" })}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#1A1A1A] bg-[#F25C05] px-2 py-0.5">
                  Кафедральный курс
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#EAE8E4] mt-1">
                  {activeDiscipline.name}
                </h1>
              </div>
            </div>

            <p className="text-sm text-[#EAE8E4]/80 max-w-3xl leading-relaxed font-sans">
              {activeDiscipline.shortDescription}
            </p>

            {/* Topic Filter Pills */}
            <div className="pt-3 border-t border-[#EAE8E4]/20 flex flex-wrap gap-2 items-center text-xs font-mono uppercase tracking-wider">
              <span className="font-bold text-[#F25C05] mr-1">Темы:</span>
              <button
                onClick={() => setSelectedTopic(null)}
                className={`px-3 py-1 font-bold transition-all ${
                  selectedTopic === null ? 'bg-[#F25C05] text-[#1A1A1A]' : 'bg-[#EAE8E4]/10 text-[#EAE8E4] hover:bg-[#EAE8E4]/20'
                }`}
              >
                Все темы ({activeDiscipline.topics.length})
              </button>
              {activeDiscipline.topics.map(topic => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic === selectedTopic ? null : topic)}
                  className={`px-3 py-1 font-bold transition-all ${
                    selectedTopic === topic ? 'bg-[#F25C05] text-[#1A1A1A]' : 'bg-[#EAE8E4]/10 text-[#EAE8E4] hover:bg-[#EAE8E4]/20'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Discipline Content Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Materials */}
            <div className="lg:col-span-2 space-y-4">
              <div className="border-b-2 border-[#1A1A1A] pb-2">
                <h2 className="text-xl font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#F25C05]" />
                  <span>Учебные материалы ({filteredMaterials.length})</span>
                </h2>
              </div>

              {filteredMaterials.length === 0 ? (
                <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-8 text-center text-[#1A1A1A]/70 space-y-2">
                  <p className="text-sm">По выбранным критериям материалы не найдены.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMaterials.map(mat => {
                    const isOwned = purchasedMaterialIds.includes(mat.id) || !mat.isPremium;

                    return (
                      <div
                        key={mat.id}
                        className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-5 text-[#1A1A1A] space-y-3 transition-colors hover:border-[#F25C05]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono uppercase font-bold text-[#1A1A1A] bg-[#1A1A1A]/10 px-2 py-0.5 border border-[#1A1A1A] inline-block mb-1">
                              {mat.topic}
                            </span>
                            <h3 className="font-serif font-bold text-base text-[#1A1A1A]">
                              {mat.title}
                            </h3>
                          </div>
                          {mat.isPremium ? (
                            <span className="text-xs font-mono font-bold text-[#1A1A1A] bg-[#F25C05] px-2.5 py-1 shrink-0">
                              {mat.price} ₽
                            </span>
                          ) : (
                            <span className="text-xs font-mono font-bold text-[#1A1A1A] bg-[#EAE8E4] border border-[#1A1A1A] px-2.5 py-1 shrink-0">
                              Бесплатно
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-sans">
                          {mat.description}
                        </p>

                        <div className="pt-3 border-t border-[#1A1A1A] font-mono text-xs uppercase tracking-wider flex items-center justify-between gap-2">
                          {isOwned ? (
                            <button
                              onClick={() => setReadingMaterial(mat)}
                              className="px-4 py-2 bg-[#1A1A1A] text-[#EAE8E4] hover:bg-[#F25C05] hover:text-[#1A1A1A] font-bold flex items-center gap-1.5 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#F25C05]" />
                              <span>Открыть и изучить</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onOpenPurchase(mat)}
                              className="px-4 py-2 bg-[#F25C05] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#EAE8E4] font-bold flex items-center gap-1.5 transition-colors"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>Купить доступ за {mat.price} ₽</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Col: Tests & Tickets Links for this discipline */}
            <div className="space-y-6">
              {/* Related Tests */}
              <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-5 space-y-4">
                <h3 className="font-serif font-bold text-base text-[#1A1A1A] flex items-center gap-2 border-b-2 border-[#1A1A1A] pb-2">
                  <FileCheck2 className="w-5 h-5 text-[#F25C05]" />
                  <span>Тесты по предмету ({filteredTests.length})</span>
                </h3>

                {filteredTests.length === 0 ? (
                  <p className="text-xs text-[#1A1A1A]/70">Тесты в процессе загрузки администратором.</p>
                ) : (
                  <div className="space-y-3">
                    {filteredTests.map(t => (
                      <div key={t.id} className="bg-[#1A1A1A] text-[#EAE8E4] p-3 border border-[#1A1A1A] space-y-2">
                        <div className="font-serif font-bold text-xs text-[#EAE8E4]">{t.title}</div>
                        <div className="text-[11px] text-[#EAE8E4]/70 font-sans">{t.description}</div>
                        <button
                          onClick={() => setCurrentTab('tests')}
                          className="w-full py-1.5 bg-[#F25C05] text-[#1A1A1A] hover:bg-[#EAE8E4] font-mono text-xs uppercase font-bold transition-colors"
                        >
                          Пройти тест ({t.questionsCount} вопр.)
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Related AI Exam Tickets */}
              <div className="bg-[#1A1A1A] text-[#EAE8E4] border-2 border-[#1A1A1A] p-5 space-y-4">
                <div className="flex items-center gap-2 font-serif font-bold text-base border-b border-[#EAE8E4]/20 pb-2">
                  <Sparkles className="w-5 h-5 text-[#F25C05]" />
                  <span>Экзаменационные билеты</span>
                </div>

                <p className="text-xs text-[#EAE8E4]/80 leading-relaxed font-sans">
                  По этой дисциплине доступно {filteredTickets.length} билетов с автоматической AI-проверкой ответа по критериям кафедры СЗГМУ.
                </p>

                <button
                  onClick={() => setCurrentTab('tickets')}
                  className="w-full py-2.5 bg-[#F25C05] text-[#1A1A1A] hover:bg-[#EAE8E4] font-mono text-xs uppercase font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Сгенерировать билет</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Overview of All 8 Disciplines */
        <div className="space-y-6">
          <div className="border-b-2 border-[#1A1A1A] pb-3 space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[#F25C05] font-bold">Дисциплины вуза</span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              Каталог дисциплин СЗГМУ им. И. И. Мечникова
            </h1>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/80">
              Выберите предмет для доступа к структурированным лекциям, тестам и билетам с AI-проверкой.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {disciplines.map(disc => {
              const IconComponent = ICON_MAP[disc.iconName] || Activity;

              return (
                <div
                  key={disc.id}
                  onClick={() => setSelectedDisciplineId(disc.id)}
                  className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 text-[#1A1A1A] cursor-pointer transition-all hover:bg-[#1A1A1A] hover:text-[#EAE8E4] group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-[#1A1A1A] text-[#F25C05] group-hover:bg-[#F25C05] group-hover:text-[#1A1A1A] flex items-center justify-center font-bold transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-lg group-hover:text-[#F25C05] transition-colors">
                        {disc.name}
                      </h3>
                      <p className="text-xs opacity-75 line-clamp-2 mt-1 font-sans">
                        {disc.shortDescription}
                      </p>
                    </div>

                    {/* Topics badges */}
                    <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px]">
                      {disc.topics.slice(0, 3).map(t => (
                        <span key={t} className="bg-[#1A1A1A]/10 text-[#1A1A1A] group-hover:bg-[#EAE8E4]/20 group-hover:text-[#EAE8E4] border border-[#1A1A1A]/20 px-2 py-0.5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1A1A1A]/30 group-hover:border-[#EAE8E4]/30 flex items-center justify-between text-xs font-mono uppercase tracking-wider font-bold group-hover:text-[#F25C05]">
                    <span>Открыть материалы</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reader Modal */}
      {readingMaterial && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden text-[#1A1A1A] shadow-2xl">
            <div className="bg-[#1A1A1A] text-[#EAE8E4] px-6 py-4 flex items-center justify-between border-b-2 border-[#1A1A1A]">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#F25C05]">{readingMaterial.disciplineName}</span>
                <h3 className="font-serif font-bold text-base text-[#EAE8E4]">{readingMaterial.title}</h3>
              </div>
              <button
                onClick={() => setReadingMaterial(null)}
                className="text-[#1A1A1A] bg-[#F25C05] font-mono text-xs uppercase font-bold px-3 py-1 hover:bg-[#EAE8E4] transition-colors"
              >
                Закрыть
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#1A1A1A] leading-relaxed font-sans">
              {readingMaterial.contentHtml ? (
                <div 
                  className="prose prose-neutral max-w-none text-[#1A1A1A]"
                  dangerouslySetInnerHTML={{ __html: readingMaterial.contentHtml }}
                />
              ) : (
                <div className="bg-[#1A1A1A] text-[#EAE8E4] p-6 border-2 border-[#1A1A1A] text-center space-y-3 font-sans">
                  <p>Вложенный файл: <strong>{readingMaterial.fileName || 'Документ.pdf'}</strong> ({readingMaterial.fileSize || '10 MB'})</p>
                  <button className="px-4 py-2 bg-[#F25C05] text-[#1A1A1A] font-mono text-xs uppercase font-bold inline-flex items-center gap-2 hover:bg-[#EAE8E4]">
                    <Download className="w-4 h-4" /> Скачать вложение
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

