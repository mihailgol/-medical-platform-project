import React, { useState } from 'react';
import { Discipline, Material, Test, TestQuestion, ExamTicket, PurchaseReceipt, DraftQuestionFromAI, DraftTicketFromAI } from '../types';
import { 
  Shield, Upload, Sparkles, Plus, Trash2, Edit3, CheckCircle2, 
  XCircle, FileText, Layers, BarChart2, DollarSign, Brain, RefreshCw, Eye 
} from 'lucide-react';

interface AdminViewProps {
  disciplines: Discipline[];
  materials: Material[];
  tests: Test[];
  questions: TestQuestion[];
  tickets: ExamTicket[];
  receipts: PurchaseReceipt[];
  onAddMaterial: (mat: Material) => void;
  onAddTest: (test: Test, questions: TestQuestion[]) => void;
  onAddTicket: (ticket: ExamTicket) => void;
  onResetData?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  disciplines,
  materials,
  tests,
  questions,
  tickets,
  receipts,
  onAddMaterial,
  onAddTest,
  onAddTicket,
  onResetData
}) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'tests' | 'tickets' | 'ai_parser' | 'analytics'>('materials');

  // AI Document Extraction State
  const [extractedText, setExtractedText] = useState<string>('');
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>(disciplines[0]?.id || 'anatomy');
  const [selectedTopic, setSelectedTopic] = useState<string>('Центральная нервная система');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [aiDrafts, setAiDrafts] = useState<{ summary: string; questions: DraftQuestionFromAI[]; tickets: DraftTicketFromAI[] } | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  // Material Creation Form State
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatDesc, setNewMatDesc] = useState('');
  const [newMatType, setNewMatType] = useState<'lecture' | 'summary' | 'pdf' | 'docx' | 'pptx'>('lecture');
  const [newMatIsPremium, setNewMatIsPremium] = useState(false);
  const [newMatPrice, setNewMatPrice] = useState(290);
  const [newMatContent, setNewMatContent] = useState('');

  const currentDiscObj = disciplines.find(d => d.id === selectedDisciplineId) || disciplines[0];

  const handleExtractFromText = async () => {
    if (!extractedText || extractedText.trim().length < 30) {
      setParseError('Вставьте достаточный текст лекции или пособия (не менее 30 символов).');
      return;
    }

    setIsParsing(true);
    setParseError(null);

    try {
      const response = await fetch('/api/gemini/extract-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: extractedText,
          disciplineName: currentDiscObj.name,
          topic: selectedTopic
        })
      });

      const data = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.message || 'Не удалось разобрать документ.');
      }

      setAiDrafts(data.data);
    } catch (err: any) {
      console.error('AI document parsing failed:', err);
      setParseError(err.message || 'Ошибка обработки текста модуля AI.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleApproveDraftQuestions = () => {
    if (!aiDrafts || aiDrafts.questions.length === 0) return;

    const newTestId = `test-ai-${Date.now()}`;
    const newTest: Test = {
      id: newTestId,
      title: `AI Тест: ${selectedTopic}`,
      disciplineId: currentDiscObj.id,
      disciplineName: currentDiscObj.name,
      topic: selectedTopic,
      description: `Сгенерировано из лекционного материала: ${aiDrafts.summary}`,
      questionsCount: aiDrafts.questions.length,
      isPublished: true
    };

    const newQuestionsList: TestQuestion[] = aiDrafts.questions.map((q, idx) => ({
      id: `q-ai-${Date.now()}-${idx}`,
      testId: newTestId,
      questionText: q.questionText,
      isMultipleChoice: q.isMultipleChoice,
      options: q.options.map((opt, oIdx) => ({
        id: `opt-${Date.now()}-${idx}-${oIdx}`,
        text: opt.text,
        isCorrect: opt.isCorrect
      })),
      explanation: q.explanation
    }));

    onAddTest(newTest, newQuestionsList);
    alert('Тест успешно создан из черновика AI и опубликован!');
  };

  const handleApproveDraftTickets = () => {
    if (!aiDrafts || aiDrafts.tickets.length === 0) return;

    aiDrafts.tickets.forEach((t, idx) => {
      const newTicket: ExamTicket = {
        id: `tick-ai-${Date.now()}-${idx}`,
        ticketNumber: tickets.length + idx + 1,
        disciplineId: currentDiscObj.id,
        disciplineName: currentDiscObj.name,
        topic: selectedTopic,
        questionTitle: t.questionTitle,
        caseDescription: t.caseDescription,
        modelAnswer: t.modelAnswer,
        gradingCriteria: t.gradingCriteria,
        isPublished: true
      };
      onAddTicket(newTicket);
    });

    alert('Билеты успешно созданы из черновика AI и опубликованы!');
  };

  const handleCreateMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatTitle.trim()) return;

    const newMat: Material = {
      id: `mat-${Date.now()}`,
      title: newMatTitle,
      disciplineId: currentDiscObj.id,
      disciplineName: currentDiscObj.name,
      topic: selectedTopic,
      type: newMatType,
      description: newMatDesc,
      contentHtml: newMatContent || `<p>${newMatDesc}</p>`,
      isPremium: newMatIsPremium,
      price: newMatIsPremium ? newMatPrice : 0,
      isPublished: true,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    onAddMaterial(newMat);
    setNewMatTitle('');
    setNewMatDesc('');
    setNewMatContent('');
    alert('Новый материал успешно создан!');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Admin Header */}
      <div className="bg-[#1A1A1A] text-[#EAE8E4] border-2 border-[#1A1A1A] p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#F25C05] text-[#1A1A1A] font-bold flex items-center justify-center border border-[#1A1A1A]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#EAE8E4]">Панель администратора</h1>
              <p className="text-xs font-mono text-[#EAE8E4]/70">Управление дисциплинами, файлами, автоизвлечением вопросов и оплатами</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase text-[#1A1A1A] bg-[#F25C05] px-3 py-1">
            Единая роль Админа
          </span>
        </div>

        {/* Admin Navigation Subtabs */}
        <div className="pt-3 border-t border-[#EAE8E4]/20 flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs uppercase font-bold">
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'materials' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'bg-[#EAE8E4]/10 text-[#EAE8E4] hover:bg-[#EAE8E4]/20'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Материалы ({materials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`px-4 py-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tests' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'bg-[#EAE8E4]/10 text-[#EAE8E4] hover:bg-[#EAE8E4]/20'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Тесты ({tests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_parser')}
            className={`px-4 py-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ai_parser' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'bg-[#EAE8E4]/10 text-[#EAE8E4] hover:bg-[#EAE8E4]/20'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Генератор вопросов и билетов</span>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tickets' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'bg-[#EAE8E4]/10 text-[#EAE8E4] hover:bg-[#EAE8E4]/20'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Билеты ({tickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'analytics' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'bg-[#EAE8E4]/10 text-[#EAE8E4] hover:bg-[#EAE8E4]/20'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Оплаты и Лимиты AI</span>
          </button>
        </div>
      </div>

      {/* Tab 1: AI Parser from Uploaded Text/Files */}
      {activeTab === 'ai_parser' && (
        <div className="space-y-6">
          <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 sm:p-8 text-[#1A1A1A] space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F25C05] text-[#1A1A1A] font-mono text-[10px] uppercase font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Автоматизация наполнения контентом</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#1A1A1A] mt-1">
                Загрузка лекции & Автоматическая генерация тестов и билетов
              </h2>
              <p className="text-xs text-[#1A1A1A]/80 font-sans">
                Вставьте текст конспекта или методички — система проанализирует тему и сформирует черновик вопросов и ситуационных билетов.
              </p>
            </div>

            {/* Select Discipline & Topic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block text-[#1A1A1A] mb-1 font-bold uppercase">Дисциплина:</label>
                <select
                  value={selectedDisciplineId}
                  onChange={(e) => {
                    setSelectedDisciplineId(e.target.value);
                    const disc = disciplines.find(d => d.id === e.target.value);
                    if (disc && disc.topics[0]) setSelectedTopic(disc.topics[0]);
                  }}
                  className="w-full bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] px-3 py-2.5 font-bold focus:outline-none focus:border-[#F25C05]"
                >
                  {disciplines.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#1A1A1A] mb-1 font-bold uppercase">Тематический раздел:</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] px-3 py-2.5 font-bold focus:outline-none focus:border-[#F25C05]"
                >
                  {currentDiscObj.topics.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Text Input Area */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase text-[#1A1A1A]">
                Текст учебного документа (PDF/DOCX/PPTX):
              </label>
              <textarea
                rows={8}
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder="Вставьте фрагмент лекции, глав книги или методического пособия кафедрального преподавателя..."
                className="w-full bg-[#1A1A1A] text-[#EAE8E4] border-2 border-[#1A1A1A] p-4 text-xs placeholder-[#EAE8E4]/50 focus:outline-none focus:border-[#F25C05] leading-relaxed font-sans"
              />
            </div>

            {parseError && (
              <div className="p-3 bg-red-900 border border-red-700 text-xs text-[#EAE8E4] font-sans">
                {parseError}
              </div>
            )}

            <button
              onClick={handleExtractFromText}
              disabled={isParsing}
              className="w-full py-3 bg-[#F25C05] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#EAE8E4] font-mono text-xs uppercase font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isParsing ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div>
                  <span>AI извлекает тестовые вопросы и билеты...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Сформировать черновик вопросов и билетов</span>
                </>
              )}
            </button>
          </div>

          {/* AI Draft Review Panel */}
          {aiDrafts && (
            <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 sm:p-8 text-[#1A1A1A] space-y-6">
              <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[#F25C05] uppercase tracking-wider">Черновик от AI-методиста</span>
                  <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">Просмотр и утверждение контента</h3>
                </div>
                <div className="flex gap-2 font-mono text-xs uppercase font-bold">
                  <button
                    onClick={handleApproveDraftQuestions}
                    className="px-3.5 py-2 bg-[#1A1A1A] text-[#EAE8E4] hover:bg-[#F25C05] hover:text-[#1A1A1A] transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#F25C05]" /> Опубликовать тесты
                  </button>
                  <button
                    onClick={handleApproveDraftTickets}
                    className="px-3.5 py-2 bg-[#F25C05] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#EAE8E4] transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Опубликовать билеты
                  </button>
                </div>
              </div>

              <div className="bg-[#1A1A1A] text-[#EAE8E4] p-3 border border-[#1A1A1A] text-xs font-sans">
                <strong className="text-[#F25C05] font-mono">Резюме файла:</strong> {aiDrafts.summary}
              </div>

              {/* Draft Questions List */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">Сгенерированные тестовые вопросы ({aiDrafts.questions.length}):</h4>
                {aiDrafts.questions.map((q, qIdx) => (
                  <div key={qIdx} className="bg-[#1A1A1A] text-[#EAE8E4] p-4 border border-[#1A1A1A] text-xs space-y-2 font-sans">
                    <div className="font-bold text-[#EAE8E4]">{qIdx + 1}. {q.questionText}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#EAE8E4]/80">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className={`p-2 border ${opt.isCorrect ? 'border-emerald-500 bg-emerald-950 text-emerald-200' : 'border-[#EAE8E4]/20 bg-[#1A1A1A]'}`}>
                          {opt.text} {opt.isCorrect && '✓'}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Draft Tickets List */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">Сгенерированные экзаменационные билеты ({aiDrafts.tickets.length}):</h4>
                {aiDrafts.tickets.map((t, tIdx) => (
                  <div key={tIdx} className="bg-[#1A1A1A] text-[#EAE8E4] p-4 border border-[#1A1A1A] text-xs space-y-2 font-sans">
                    <div className="font-bold text-[#F25C05] font-serif">{t.questionTitle}</div>
                    <div className="text-[#EAE8E4]/90">{t.caseDescription}</div>
                    <div className="text-[#EAE8E4]/80 bg-[#1A1A1A] p-2 border border-[#EAE8E4]/20">
                      <strong className="text-[#F25C05] font-mono">Эталонный ответ:</strong> {t.modelAnswer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Create / Manage Materials */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          {/* Create Material Form */}
          <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 sm:p-8 text-[#1A1A1A] space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#F25C05]" />
              <span>Создать новый учебный материал</span>
            </h2>

            <form onSubmit={handleCreateMaterialSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1A1A1A] mb-1 font-bold uppercase">Название материала:</label>
                  <input
                    type="text"
                    required
                    value={newMatTitle}
                    onChange={(e) => setNewMatTitle(e.target.value)}
                    placeholder="например: Конспект по остеологии черепа"
                    className="w-full bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] px-3 py-2 font-sans focus:outline-none focus:border-[#F25C05]"
                  />
                </div>

                <div>
                  <label className="block text-[#1A1A1A] mb-1 font-bold uppercase">Дисциплина:</label>
                  <select
                    value={selectedDisciplineId}
                    onChange={(e) => setSelectedDisciplineId(e.target.value)}
                    className="w-full bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] px-3 py-2 focus:outline-none focus:border-[#F25C05]"
                  >
                    {disciplines.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#1A1A1A] mb-1 font-bold uppercase">Тип материала:</label>
                  <select
                    value={newMatType}
                    onChange={(e: any) => setNewMatType(e.target.value)}
                    className="w-full bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] px-3 py-2 focus:outline-none focus:border-[#F25C05]"
                  >
                    <option value="lecture">Текстовая лекция</option>
                    <option value="summary">Краткий конспект</option>
                    <option value="pdf">PDF документ</option>
                    <option value="docx">DOCX файл</option>
                    <option value="pptx">PPTX презентация</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1A1A1A] mb-1 font-bold uppercase">Режим монетизации:</label>
                  <div className="flex items-center gap-4 py-2 font-bold">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="isPremium"
                        checked={!newMatIsPremium}
                        onChange={() => setNewMatIsPremium(false)}
                      />
                      <span>Бесплатно</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="isPremium"
                        checked={newMatIsPremium}
                        onChange={() => setNewMatIsPremium(true)}
                      />
                      <span className="text-[#F25C05]">Премиум</span>
                    </label>
                  </div>
                </div>

                {newMatIsPremium && (
                  <div>
                    <label className="block text-[#1A1A1A] mb-1 font-bold uppercase">Стоимость (руб):</label>
                    <input
                      type="number"
                      value={newMatPrice}
                      onChange={(e) => setNewMatPrice(Number(e.target.value))}
                      className="w-full bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] px-3 py-2 font-bold focus:outline-none focus:border-[#F25C05]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#1A1A1A] mb-1 font-bold uppercase">Краткое описание:</label>
                <input
                  type="text"
                  required
                  value={newMatDesc}
                  onChange={(e) => setNewMatDesc(e.target.value)}
                  placeholder="О чем этот материал..."
                  className="w-full bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] px-3 py-2 font-sans focus:outline-none focus:border-[#F25C05]"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 bg-[#F25C05] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#EAE8E4] font-bold uppercase transition-colors"
              >
                Опубликовать материал
              </button>
            </form>
          </div>

          {/* Existing Materials Table */}
          <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 text-[#1A1A1A] space-y-4 font-mono text-xs">
            <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Все доступные материалы ({materials.length})</h3>
            <div className="space-y-2">
              {materials.map(mat => (
                <div key={mat.id} className="bg-[#1A1A1A] text-[#EAE8E4] p-3 border border-[#1A1A1A] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#EAE8E4]">{mat.title}</span>
                    <span className="text-[#EAE8E4]/60 ml-2">({mat.disciplineName})</span>
                  </div>
                  <div>
                    {mat.isPremium ? <span className="font-bold text-[#F25C05]">{mat.price} ₽</span> : <span className="text-emerald-400 font-bold">Бесплатно</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Sales Analytics & AI Budget Monitor */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[#1A1A1A]">
            <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 space-y-2">
              <div className="text-xs uppercase font-bold text-[#1A1A1A]/70">Всего продаж</div>
              <div className="text-3xl font-serif font-bold text-[#1A1A1A]">{receipts.length}</div>
              <div className="text-[11px] text-[#1A1A1A]/60 font-sans">Чек в «Мой налог» по каждой покупке</div>
            </div>

            <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 space-y-2">
              <div className="text-xs uppercase font-bold text-[#1A1A1A]/70">Общая выручка НПД</div>
              <div className="text-3xl font-serif font-bold text-[#F25C05]">
                {receipts.reduce((acc, r) => acc + r.amount, 0)} ₽
              </div>
              <div className="text-[11px] text-[#1A1A1A]/60 font-sans">Налог 4% формируется автоматически</div>
            </div>

            <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 space-y-2">
              <div className="text-xs uppercase font-bold text-[#1A1A1A]/70">Режим работы</div>
              <div className="text-3xl font-serif font-bold text-emerald-600">Автономный</div>
              <div className="text-[11px] text-[#1A1A1A]/60 font-sans">Без сторонних облачных API</div>
            </div>
          </div>

          {/* Sales Receipts Log */}
          <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 text-[#1A1A1A] space-y-4">
            <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Журнал фискальных чеков (Самозанятый НПД)</h3>
            {receipts.length === 0 ? (
              <p className="text-xs text-[#1A1A1A]/70 font-sans">Покупок еще не совершалось.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {receipts.map(rec => (
                  <div key={rec.id} className="bg-[#1A1A1A] text-[#EAE8E4] p-3 border border-[#1A1A1A] flex items-center justify-between">
                    <div>
                      <div className="font-serif font-bold text-[#EAE8E4]">{rec.materialTitle}</div>
                      <div className="text-[#EAE8E4]/60 text-[11px]">{rec.receiptNumber} • {rec.purchasedAt}</div>
                    </div>
                    <div className="text-right font-bold text-[#F25C05]">
                      +{rec.amount} ₽
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Storage & Reset Section */}
          {onResetData && (
            <div className="bg-[#1A1A1A] text-[#EAE8E4] border-2 border-[#1A1A1A] p-6 space-y-4">
              <div>
                <h3 className="font-serif font-bold text-base text-[#EAE8E4]">Локальное хранилище данных</h3>
                <p className="text-xs text-[#EAE8E4]/70 font-sans mt-1">
                  Все материалы, сгенерированные AI билеты, результаты тестирования и чеки сохраняются в браузере (LocalStorage).
                </p>
              </div>
              <button
                onClick={onResetData}
                className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white font-mono text-xs uppercase font-bold flex items-center gap-2 transition-colors border border-red-500"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Сбросить данные к исходным</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
