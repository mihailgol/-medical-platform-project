import React, { useState } from 'react';
import { Test, TestQuestion, Discipline, StudentTestResult } from '../types';
import { 
  FileCheck2, CheckCircle2, XCircle, HelpCircle, RefreshCw, 
  ArrowRight, Award, BarChart2, CheckSquare, Square 
} from 'lucide-react';

interface TestsViewProps {
  tests: Test[];
  questions: TestQuestion[];
  disciplines: Discipline[];
  onSaveTestResult: (result: StudentTestResult) => void;
}

export const TestsView: React.FC<TestsViewProps> = ({
  tests,
  questions,
  disciplines,
  onSaveTestResult
}) => {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>('all');
  const [activeTest, setActiveTest] = useState<Test | null>(null);

  // Active testing state
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({}); // questionId -> selectedOptionIds
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [currentScore, setCurrentScore] = useState<{ correct: number; total: number; percentage: number } | null>(null);

  const filteredTests = tests.filter(t => selectedDisciplineId === 'all' || t.disciplineId === selectedDisciplineId);

  const activeQuestions = activeTest ? questions.filter(q => q.testId === activeTest.id) : [];

  const handleStartTest = (test: Test) => {
    setActiveTest(test);
    setUserAnswers({});
    setIsSubmitted(false);
    setCurrentScore(null);
  };

  const handleToggleOption = (questionId: string, optionId: string, isMultiple: boolean) => {
    if (isSubmitted) return;

    setUserAnswers(prev => {
      const current = prev[questionId] || [];
      if (isMultiple) {
        if (current.includes(optionId)) {
          return { ...prev, [questionId]: current.filter(id => id !== optionId) };
        } else {
          return { ...prev, [questionId]: [...current, optionId] };
        }
      } else {
        return { ...prev, [questionId]: [optionId] };
      }
    });
  };

  const handleSubmitTest = () => {
    let correctCount = 0;

    activeQuestions.forEach(q => {
      const selected = userAnswers[q.id] || [];
      const correctOptionIds = q.options.filter(o => o.isCorrect).map(o => o.id);

      const isCorrect = 
        selected.length === correctOptionIds.length &&
        selected.every(id => correctOptionIds.includes(id));

      if (isCorrect) correctCount++;
    });

    const percentage = Math.round((correctCount / (activeQuestions.length || 1)) * 100);

    setCurrentScore({
      correct: correctCount,
      total: activeQuestions.length,
      percentage
    });

    setIsSubmitted(true);

    if (activeTest) {
      onSaveTestResult({
        id: `res-${Date.now()}`,
        testId: activeTest.id,
        testTitle: activeTest.title,
        disciplineName: activeTest.disciplineName,
        scorePercentage: percentage,
        correctAnswersCount: correctCount,
        totalQuestionsCount: activeQuestions.length,
        completedAt: new Date().toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b-2 border-[#1A1A1A] pb-3 space-y-1">
        <span className="font-mono text-xs uppercase tracking-widest text-[#F25C05] font-bold">Контроль знаний</span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
          Раздел тестирования
        </h1>
        <p className="text-xs sm:text-sm text-[#1A1A1A]/80">
          Проверьте ваши знания по темам предметов СЗГМУ с моментальным подробным разбором ответов.
        </p>
      </div>

      {!activeTest ? (
        /* Test Selector */
        <div className="space-y-6">
          {/* Discipline Selector Filter */}
          <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#1A1A1A]">
            <span className="font-bold uppercase">Фильтр по дисциплине:</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setSelectedDisciplineId('all')}
                className={`px-3 py-1.5 font-bold transition-all ${
                  selectedDisciplineId === 'all' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'bg-[#1A1A1A] text-[#EAE8E4] hover:bg-[#F25C05] hover:text-[#1A1A1A]'
                }`}
              >
                Все дисциплины ({tests.length})
              </button>
              {disciplines.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDisciplineId(d.id)}
                  className={`px-3 py-1.5 font-bold transition-all ${
                    selectedDisciplineId === d.id ? 'bg-[#F25C05] text-[#1A1A1A]' : 'bg-[#1A1A1A] text-[#EAE8E4] hover:bg-[#F25C05] hover:text-[#1A1A1A]'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tests List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTests.map(test => (
              <div
                key={test.id}
                className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 text-[#1A1A1A] space-y-4 transition-colors hover:border-[#F25C05] flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#1A1A1A] bg-[#1A1A1A]/10 px-2 py-0.5 border border-[#1A1A1A] inline-block">
                    {test.disciplineName}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
                    {test.title}
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/80 font-sans">
                    {test.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1A1A1A] flex items-center justify-between font-mono text-xs uppercase font-bold">
                  <span className="text-[#1A1A1A]/70">
                    {test.questionsCount} вопросов в банке
                  </span>
                  <button
                    onClick={() => handleStartTest(test)}
                    className="px-4 py-2 bg-[#1A1A1A] text-[#EAE8E4] hover:bg-[#F25C05] hover:text-[#1A1A1A] transition-colors flex items-center gap-1.5"
                  >
                    <span>Начать тест</span>
                    <ArrowRight className="w-4 h-4 text-[#F25C05]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Active Test Runner */
        <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 sm:p-8 text-[#1A1A1A] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#F25C05]">{activeTest.disciplineName}</span>
              <h2 className="text-xl font-serif font-bold text-[#1A1A1A]">{activeTest.title}</h2>
            </div>
            <button
              onClick={() => setActiveTest(null)}
              className="font-mono text-xs uppercase font-bold text-[#1A1A1A] bg-[#EAE8E4] border border-[#1A1A1A] px-3 py-1.5 hover:bg-[#1A1A1A] hover:text-[#EAE8E4] transition-colors"
            >
              Выйти из теста
            </button>
          </div>

          {/* Results Card if Submitted */}
          {isSubmitted && currentScore && (
            <div className={`p-6 border-2 border-[#1A1A1A] ${
              currentScore.percentage >= 70 ? 'bg-emerald-900 text-[#EAE8E4]' : 'bg-[#1A1A1A] text-[#EAE8E4]'
            } space-y-3 font-sans`}>
              <div className="flex items-center justify-between border-b border-[#EAE8E4]/20 pb-3">
                <div className="flex items-center gap-2 font-serif font-bold text-lg">
                  <Award className="w-6 h-6 text-[#F25C05]" />
                  <span>Результат тестирования: {currentScore.percentage}%</span>
                </div>
                <span className="font-mono text-xs font-bold px-3 py-1 bg-[#F25C05] text-[#1A1A1A]">
                  {currentScore.correct} из {currentScore.total} верно
                </span>
              </div>
              <p className="text-xs leading-relaxed">
                {currentScore.percentage >= 70 
                  ? 'Отличный результат! Вы продемонстрировали глубокое знание материала по этой теме.' 
                  : 'Тест завершен. Рекомендуем повторить лекции и методические пособия по этой теме.'}
              </p>
              <div className="text-xs text-[#EAE8E4]/70 font-mono">
                Результат автоматически сохранен в вашем личном кабинете.
              </div>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-8">
            {activeQuestions.map((q, qIndex) => {
              const selectedOpts = userAnswers[q.id] || [];

              return (
                <div key={q.id} className="bg-[#1A1A1A] text-[#EAE8E4] p-6 border-2 border-[#1A1A1A] space-y-4">
                  <div className="flex items-start justify-between gap-2 border-b border-[#EAE8E4]/20 pb-3">
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#EAE8E4]">
                      Вопрос {qIndex + 1}: {q.questionText}
                    </h3>
                    <span className="text-[10px] text-[#1A1A1A] bg-[#F25C05] font-mono font-bold uppercase px-2 py-0.5 shrink-0">
                      {q.isMultipleChoice ? 'Множественный выбор' : 'Один ответ'}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 font-sans text-xs">
                    {q.options.map(opt => {
                      const isSelected = selectedOpts.includes(opt.id);

                      let optionStyle = "border-[#EAE8E4]/20 bg-[#1A1A1A] hover:border-[#F25C05] text-[#EAE8E4]";

                      if (isSubmitted) {
                        if (opt.isCorrect) {
                          optionStyle = "border-emerald-500 bg-emerald-950 text-emerald-200 font-semibold";
                        } else if (isSelected && !opt.isCorrect) {
                          optionStyle = "border-red-500 bg-red-950 text-red-200";
                        }
                      } else if (isSelected) {
                        optionStyle = "border-[#F25C05] bg-[#F25C05] text-[#1A1A1A] font-bold";
                      }

                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleToggleOption(q.id, opt.id, q.isMultipleChoice)}
                          className={`p-3.5 border text-xs cursor-pointer transition-all flex items-center justify-between ${optionStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            {q.isMultipleChoice ? (
                              isSelected ? <CheckSquare className="w-4 h-4 shrink-0" /> : <Square className="w-4 h-4 shrink-0 opacity-50" />
                            ) : (
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#1A1A1A] bg-[#1A1A1A]' : 'border-[#EAE8E4]/50'}`}>
                                {isSelected && <div className="w-1.5 h-1.5 bg-[#F25C05] rounded-full"></div>}
                              </div>
                            )}
                            <span>{opt.text}</span>
                          </div>

                          {isSubmitted && opt.isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {isSubmitted && isSelected && !opt.isCorrect && (
                            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Question Explanation after submission */}
                  {isSubmitted && (
                    <div className="bg-[#EAE8E4] text-[#1A1A1A] p-4 border border-[#1A1A1A] text-xs font-sans space-y-1">
                      <div className="font-mono font-bold text-[#F25C05] uppercase text-[10px] flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" /> Пояснение преподавателя:
                      </div>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Test Submit / Reset Controls */}
          <div className="pt-4 border-t-2 border-[#1A1A1A] flex items-center justify-between font-mono text-xs uppercase font-bold">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitTest}
                className="w-full py-3 bg-[#F25C05] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#EAE8E4] transition-colors"
              >
                Завершить тест и проверить результаты
              </button>
            ) : (
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => {
                    setUserAnswers({});
                    setIsSubmitted(false);
                    setCurrentScore(null);
                  }}
                  className="px-4 py-2.5 bg-[#1A1A1A] text-[#EAE8E4] hover:bg-[#F25C05] hover:text-[#1A1A1A] transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 text-[#F25C05]" /> Пересдать этот тест
                </button>
                <button
                  onClick={() => setActiveTest(null)}
                  className="px-4 py-2.5 bg-[#F25C05] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#EAE8E4] transition-colors"
                >
                  Вернуться к списку тестов
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
