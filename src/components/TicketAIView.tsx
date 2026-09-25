import React, { useState } from 'react';
import { ExamTicket, Discipline, StudentTicketAttempt, AIEvaluationResult } from '../types';
import { 
  Sparkles, RefreshCw, Send, CheckCircle2, AlertTriangle, XCircle, 
  BookOpen, Brain, Award, HelpCircle, FileText, ArrowRight, CornerDownRight 
} from 'lucide-react';

interface TicketAIViewProps {
  tickets: ExamTicket[];
  disciplines: Discipline[];
  onSaveAttempt: (attempt: StudentTicketAttempt) => void;
}

export const TicketAIView: React.FC<TicketAIViewProps> = ({
  tickets,
  disciplines,
  onSaveAttempt
}) => {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>('all');
  const [currentTicket, setCurrentTicket] = useState<ExamTicket | null>(tickets[0] || null);
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<AIEvaluationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredTickets = tickets.filter(t => selectedDisciplineId === 'all' || t.disciplineId === selectedDisciplineId);

  const handleGenerateRandomTicket = () => {
    if (filteredTickets.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredTickets.length);
    setCurrentTicket(filteredTickets[randomIndex]);
    setStudentAnswer('');
    setEvaluationResult(null);
    setErrorMessage(null);
  };

  const handleEvaluateAnswer = async () => {
    if (!currentTicket) return;
    if (!studentAnswer.trim() || studentAnswer.trim().length < 15) {
      setErrorMessage('Пожалуйста, напишите более развернутый ответ на вопрос билета (не менее 15 символов).');
      return;
    }

    setIsEvaluating(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/gemini/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disciplineName: currentTicket.disciplineName,
          topic: currentTicket.topic,
          questionTitle: currentTicket.questionTitle,
          caseDescription: currentTicket.caseDescription,
          modelAnswer: currentTicket.modelAnswer,
          gradingCriteria: currentTicket.gradingCriteria,
          studentAnswer: studentAnswer
        })
      });

      const data = await response.json();

      if (!data.success || !data.result) {
        throw new Error(data.message || 'Ошибка сервера при вызове модуля AI.');
      }

      const result: AIEvaluationResult = data.result;
      setEvaluationResult(result);

      // Save attempt to student profile history
      onSaveAttempt({
        id: `att-${Date.now()}`,
        ticketId: currentTicket.id,
        ticketNumber: currentTicket.ticketNumber,
        disciplineName: currentTicket.disciplineName,
        topic: currentTicket.topic,
        questionTitle: currentTicket.questionTitle,
        studentAnswer: studentAnswer,
        evaluation: result,
        createdAt: new Date().toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });

    } catch (err: any) {
      console.error('AI evaluation failed:', err);
      setErrorMessage(err.message || 'Не удалось провести AI-проверку. Проверьте интернет-соединение или повторите попытку.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Introduction */}
      <div className="border-b-2 border-[#1A1A1A] pb-3 space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F25C05] text-[#1A1A1A] font-mono text-[10px] uppercase font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Модуль AI-проверки ответов по критериям кафедр</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-2">
          Генератор билетов & AI-экзаменатор
        </h1>
        <p className="text-xs sm:text-sm text-[#1A1A1A]/80">
          Сгенерируйте случайный экзаменационный билет, введите ваш ответ и нейросеть моментально оценит его с разбором ошибок.
        </p>
      </div>

      {/* Ticket Generator Bar */}
      <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-4 sm:p-6 text-[#1A1A1A] space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto font-mono text-xs">
            <span className="font-bold uppercase text-[#1A1A1A] shrink-0">Дисциплина:</span>
            <select
              value={selectedDisciplineId}
              onChange={(e) => {
                setSelectedDisciplineId(e.target.value);
                setEvaluationResult(null);
              }}
              className="w-full sm:w-64 bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] px-3 py-2 font-bold focus:outline-none focus:border-[#F25C05]"
            >
              <option value="all">Все предметы ({tickets.length} билетов)</option>
              {disciplines.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerateRandomTicket}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#F25C05] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#EAE8E4] font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 transition-colors shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Сгенерировать билет</span>
          </button>
        </div>
      </div>

      {/* Active Exam Ticket Card */}
      {currentTicket ? (
        <div className="space-y-6">
          <div className="bg-[#1A1A1A] text-[#EAE8E4] border-2 border-[#1A1A1A] p-6 sm:p-8 space-y-5">
            {/* Ticket Header Badge */}
            <div className="flex items-center justify-between border-b border-[#EAE8E4]/20 pb-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1A1A1A] bg-[#F25C05] px-3 py-1 uppercase">
                  Билет №{currentTicket.ticketNumber}
                </span>
                <span className="font-bold text-[#EAE8E4] bg-[#EAE8E4]/10 border border-[#EAE8E4]/20 px-2.5 py-1">
                  {currentTicket.disciplineName}
                </span>
              </div>
              <span className="text-[#EAE8E4]/70 font-sans">Тема: {currentTicket.topic}</span>
            </div>

            {/* Question Title & Case Description */}
            <div className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-[#EAE8E4]">
                {currentTicket.questionTitle}
              </h2>
              <div className="bg-[#EAE8E4] text-[#1A1A1A] p-4 border border-[#1A1A1A] text-xs leading-relaxed space-y-1 font-sans">
                <div className="font-mono font-bold text-[#F25C05] uppercase text-[10px]">Ситуационная задача / Экзаменационный вопрос:</div>
                <p>{currentTicket.caseDescription}</p>
              </div>
            </div>

            {/* Student Answer Text Area */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase text-[#EAE8E4]">
                Ваш экзаменационный ответ (пишите развернуто):
              </label>
              <textarea
                rows={7}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Впишите ваше решение билета, механизмы, латинские термины, классификацию или клинику..."
                className="w-full bg-[#EAE8E4] text-[#1A1A1A] border-2 border-[#1A1A1A] p-4 text-xs placeholder-[#1A1A1A]/50 focus:outline-none focus:border-[#F25C05] leading-relaxed font-sans"
              />
              <div className="flex items-center justify-between text-[11px] font-mono text-[#EAE8E4]/70">
                <span>Длина ответа: {studentAnswer.length} символов</span>
                <span>Проверка производится нейросетью Gemini</span>
              </div>
            </div>

            {errorMessage && (
              <div className="bg-red-900 border border-red-700 p-3 text-xs text-[#EAE8E4] flex items-center gap-2 font-sans">
                <AlertTriangle className="w-4 h-4 text-[#F25C05] shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Submit to AI Button */}
            <button
              onClick={handleEvaluateAnswer}
              disabled={isEvaluating}
              className="w-full py-3.5 bg-[#F25C05] text-[#1A1A1A] hover:bg-[#EAE8E4] font-mono text-xs uppercase font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div>
                  <span>Профессорский AI анализирует ваш ответ...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Отправить ответ на AI-проверку</span>
                </>
              )}
            </button>
          </div>

          {/* AI Evaluation Results Breakdown Card */}
          {evaluationResult && (
            <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 sm:p-8 text-[#1A1A1A] space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#F25C05] text-[#1A1A1A] flex items-center justify-center font-serif font-bold text-2xl border border-[#1A1A1A]">
                    {evaluationResult.grade}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">
                      Оценка: {evaluationResult.gradeText} ({evaluationResult.score}%)
                    </h3>
                    <p className="text-xs text-[#1A1A1A]/80 font-sans">
                      Результаты проверки по канонам кафедры
                    </p>
                  </div>
                </div>

                <div className="text-xs font-mono text-[#1A1A1A]/70">
                  Проверено: {new Date(evaluationResult.checkedAt).toLocaleTimeString('ru-RU')}
                </div>
              </div>

              {/* Summary Commentary */}
              <div className="bg-[#1A1A1A] text-[#EAE8E4] p-4 border border-[#1A1A1A] space-y-1 font-sans">
                <div className="font-mono font-bold text-xs text-[#F25C05] uppercase flex items-center gap-1.5">
                  <Brain className="w-4 h-4" /> Заключение AI-экзаменатора:
                </div>
                <p className="text-xs text-[#EAE8E4]/90 leading-relaxed">
                  {evaluationResult.summary}
                </p>
              </div>

              {/* Strengths & Missing Points Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                {/* Strengths */}
                <div className="bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] p-4 space-y-2">
                  <div className="font-mono font-bold text-xs text-emerald-400 uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Сильные стороны ответа:
                  </div>
                  <ul className="space-y-1 text-[#EAE8E4]/90 list-disc list-inside">
                    {evaluationResult.strengths.map((s, idx) => (
                      <li key={idx} className="leading-relaxed">{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Missing Points */}
                <div className="bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] p-4 space-y-2">
                  <div className="font-mono font-bold text-xs text-[#F25C05] uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Упущенные тезисы / термины:
                  </div>
                  <ul className="space-y-1 text-[#EAE8E4]/90 list-disc list-inside">
                    {evaluationResult.missingPoints.map((m, idx) => (
                      <li key={idx} className="leading-relaxed">{m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Errors if any */}
              {evaluationResult.errors && evaluationResult.errors.length > 0 && (
                <div className="bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] p-4 space-y-2 text-xs font-sans">
                  <div className="font-mono font-bold text-xs text-red-400 uppercase flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> Зафиксированные ошибки:
                  </div>
                  <ul className="space-y-1 text-[#EAE8E4]/90 list-disc list-inside">
                    {evaluationResult.errors.map((e, idx) => (
                      <li key={idx} className="leading-relaxed">{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              <div className="bg-[#1A1A1A] text-[#EAE8E4] p-4 border border-[#1A1A1A] space-y-2 text-xs font-sans">
                <div className="font-mono font-bold text-xs text-[#F25C05] uppercase flex items-center gap-1.5">
                  <CornerDownRight className="w-4 h-4" /> Рекомендации преподавателя:
                </div>
                <ul className="space-y-1 text-[#EAE8E4]/90 list-disc list-inside">
                  {evaluationResult.recommendations.map((r, idx) => (
                    <li key={idx} className="leading-relaxed">{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-12 text-center text-[#1A1A1A]/80 space-y-2">
          <p className="font-sans">Билеты не найдены. Нажмите «Сгенерировать случайный билет» выше.</p>
        </div>
      )}
    </div>
  );
};
