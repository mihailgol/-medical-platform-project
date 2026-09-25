import React, { useState } from 'react';
import { Material, Discipline } from '../types';
import { 
  BookOpen, FileText, Download, Lock, CheckCircle2, Search, 
  Sparkles 
} from 'lucide-react';

interface MaterialsViewProps {
  materials: Material[];
  disciplines: Discipline[];
  onOpenPurchase: (mat: Material) => void;
  purchasedMaterialIds: string[];
  setCurrentTab: (tab: string) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  disciplines,
  onOpenPurchase,
  purchasedMaterialIds,
  setCurrentTab
}) => {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingMaterial, setReadingMaterial] = useState<Material | null>(null);

  const filteredMaterials = materials.filter(m => {
    const matchesDisc = selectedDisciplineId === 'all' || m.disciplineId === selectedDisciplineId;
    const matchesType = selectedType === 'all' || m.type === selectedType;
    const matchesPrice = priceFilter === 'all' || (priceFilter === 'free' ? !m.isPremium : m.isPremium);
    const matchesSearch = !searchQuery || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.topic.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDisc && matchesType && matchesPrice && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title Header */}
      <div className="border-b-2 border-[#1A1A1A] pb-3 space-y-1">
        <span className="font-mono text-xs uppercase tracking-widest text-[#F25C05] font-bold">База знаний</span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
          Каталог учебных материалов
        </h1>
        <p className="text-xs sm:text-sm text-[#1A1A1A]/80">
          Лекции, краткие конспекты, PDF методички и слайды презентаций по всем предметам.
        </p>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-4 sm:p-5 space-y-4 text-[#1A1A1A]">
        {/* Search Input */}
        <div className="relative font-mono text-xs">
          <Search className="w-4 h-4 text-[#1A1A1A] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию лекции, теме или автору..."
            className="w-full bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#F25C05] placeholder-[#EAE8E4]/50 font-sans"
          />
        </div>

        {/* Filter Selectors Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          {/* Discipline Selector */}
          <div>
            <label className="block text-[10px] text-[#1A1A1A] mb-1 font-bold uppercase tracking-wider">Дисциплина:</label>
            <select
              value={selectedDisciplineId}
              onChange={(e) => setSelectedDisciplineId(e.target.value)}
              className="w-full bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] px-3 py-2 focus:outline-none focus:border-[#F25C05]"
            >
              <option value="all">Все 8 дисциплин</option>
              {disciplines.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Type Selector */}
          <div>
            <label className="block text-[10px] text-[#1A1A1A] mb-1 font-bold uppercase tracking-wider">Формат контента:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] px-3 py-2 focus:outline-none focus:border-[#F25C05]"
            >
              <option value="all">Все форматы</option>
              <option value="lecture">Текстовая лекция</option>
              <option value="summary">Краткий конспект</option>
              <option value="pdf">PDF методичка</option>
              <option value="docx">Документ DOCX</option>
              <option value="pptx">Презентация PPTX</option>
            </select>
          </div>

          {/* Access Filter */}
          <div>
            <label className="block text-[10px] text-[#1A1A1A] mb-1 font-bold uppercase tracking-wider">Доступ:</label>
            <div className="grid grid-cols-3 gap-1 bg-[#1A1A1A] p-1 border border-[#1A1A1A] text-center font-bold">
              <button
                onClick={() => setPriceFilter('all')}
                className={`py-1 ${priceFilter === 'all' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'text-[#EAE8E4]'}`}
              >
                Все
              </button>
              <button
                onClick={() => setPriceFilter('free')}
                className={`py-1 ${priceFilter === 'free' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'text-[#EAE8E4]'}`}
              >
                Бесплатно
              </button>
              <button
                onClick={() => setPriceFilter('paid')}
                className={`py-1 ${priceFilter === 'paid' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'text-[#EAE8E4]'}`}
              >
                Премиум
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="space-y-4">
        <div className="text-xs font-mono uppercase font-bold text-[#1A1A1A]">
          Найдено материалов: {filteredMaterials.length}
        </div>

        {filteredMaterials.length === 0 ? (
          <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-12 text-center text-[#1A1A1A]/80 space-y-2">
            <p className="text-sm font-sans">Материалы по заданным фильтрам не найдены.</p>
            <button
              onClick={() => {
                setSelectedDisciplineId('all');
                setSelectedType('all');
                setPriceFilter('all');
                setSearchQuery('');
              }}
              className="text-xs font-mono uppercase font-bold text-[#F25C05] underline"
            >
              Сбросить все фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map(mat => {
              const isOwned = purchasedMaterialIds.includes(mat.id) || !mat.isPremium;

              return (
                <div
                  key={mat.id}
                  className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-5 text-[#1A1A1A] flex flex-col justify-between space-y-4 transition-colors hover:border-[#F25C05]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#1A1A1A] bg-[#1A1A1A]/10 px-2 py-0.5 border border-[#1A1A1A] truncate">
                        {mat.disciplineName}
                      </span>
                      {mat.isPremium ? (
                        <span className="text-xs font-mono font-bold text-[#1A1A1A] bg-[#F25C05] px-2 py-0.5 shrink-0">
                          {mat.price} ₽
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-[#1A1A1A] bg-[#EAE8E4] border border-[#1A1A1A] px-2 py-0.5 shrink-0">
                          Бесплатно
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-[#F25C05] tracking-wider block">
                        Тема: {mat.topic}
                      </span>
                      <h3 className="font-serif font-bold text-base text-[#1A1A1A] line-clamp-2 mt-0.5">
                        {mat.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#1A1A1A]/80 line-clamp-3 leading-relaxed font-sans">
                      {mat.description}
                    </p>

                    {mat.fileName && (
                      <div className="bg-[#1A1A1A] text-[#EAE8E4] px-3 py-1.5 border border-[#1A1A1A] text-[11px] font-mono flex items-center justify-between">
                        <span className="truncate">{mat.fileName}</span>
                        <span className="text-[#F25C05] font-bold text-[10px]">{mat.fileSize}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#1A1A1A] font-mono text-xs uppercase tracking-wider flex items-center justify-between gap-2">
                    {isOwned ? (
                      <button
                        onClick={() => setReadingMaterial(mat)}
                        className="w-full py-2 bg-[#1A1A1A] text-[#EAE8E4] hover:bg-[#F25C05] hover:text-[#1A1A1A] font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#F25C05]" />
                        <span>Открыть материал</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenPurchase(mat)}
                        className="w-full py-2 bg-[#F25C05] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#EAE8E4] font-bold flex items-center justify-center gap-1.5 transition-colors"
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
                    <Download className="w-4 h-4" /> Скачать оригинал файла
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#1A1A1A] text-[#EAE8E4] border-t-2 border-[#1A1A1A] flex items-center justify-between font-mono text-xs uppercase font-bold">
              <span className="text-[#EAE8E4]/70">Связано с экзаменами СЗГМУ</span>
              <button
                onClick={() => {
                  setReadingMaterial(null);
                  setCurrentTab('tickets');
                }}
                className="text-[#F25C05] hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Билеты по теме</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

