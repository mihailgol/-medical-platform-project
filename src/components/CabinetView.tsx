import React, { useState } from 'react';
import { UserProfile, Material, StudentTestResult, StudentTicketAttempt, PurchaseReceipt } from '../types';
import { 
  User, BookOpen, CheckCircle2, Download, FileText, Sparkles, 
  Award, CreditCard, ShieldCheck, Clock 
} from 'lucide-react';

interface CabinetViewProps {
  user: UserProfile;
  materials: Material[];
  testResults: StudentTestResult[];
  ticketAttempts: StudentTicketAttempt[];
  receipts: PurchaseReceipt[];
  setCurrentTab: (tab: string) => void;
}

export const CabinetView: React.FC<CabinetViewProps> = ({
  user,
  materials,
  testResults,
  ticketAttempts,
  receipts,
  setCurrentTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'purchased' | 'tests' | 'ai_tickets' | 'receipts'>('purchased');

  const purchasedMaterials = materials.filter(m => user.purchasedMaterialIds.includes(m.id));

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Header Card */}
      <div className="bg-[#1A1A1A] text-[#EAE8E4] border-2 border-[#1A1A1A] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#F25C05] text-[#1A1A1A] font-serif font-bold text-2xl flex items-center justify-center border border-[#1A1A1A]">
              {user.name.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#EAE8E4]">{user.name}</h1>
                <span className="text-[10px] font-mono font-bold uppercase text-[#1A1A1A] bg-[#F25C05] px-2 py-0.5">
                  Студент
                </span>
              </div>
              <div className="text-xs font-mono text-[#EAE8E4]/70 mt-1 flex flex-wrap items-center gap-3">
                <span>Группа: <strong className="text-[#EAE8E4]">{user.universityGroup}</strong></span>
                <span>•</span>
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#EAE8E4] text-[#1A1A1A] p-3 border border-[#1A1A1A] text-xs font-mono space-y-1 sm:text-right shrink-0">
            <div>Приобретено материалов: <strong className="text-[#F25C05]">{purchasedMaterials.length}</strong></div>
            <div>Пройдено билетов: <strong className="text-[#F25C05]">{ticketAttempts.length}</strong></div>
          </div>
        </div>

        {/* Subtabs Bar */}
        <div className="pt-4 border-t border-[#EAE8E4]/20 flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs uppercase font-bold">
          <button
            onClick={() => setActiveSubTab('purchased')}
            className={`px-4 py-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'purchased' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'bg-[#EAE8E4]/10 text-[#EAE8E4] hover:bg-[#EAE8E4]/20'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Купленные материалы ({purchasedMaterials.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ai_tickets')}
            className={`px-4 py-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'ai_tickets' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'bg-[#EAE8E4]/10 text-[#EAE8E4] hover:bg-[#EAE8E4]/20'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>История билетов ({ticketAttempts.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tests')}
            className={`px-4 py-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'tests' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'bg-[#EAE8E4]/10 text-[#EAE8E4] hover:bg-[#EAE8E4]/20'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>История тестов ({testResults.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('receipts')}
            className={`px-4 py-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'receipts' ? 'bg-[#F25C05] text-[#1A1A1A]' : 'bg-[#EAE8E4]/10 text-[#EAE8E4] hover:bg-[#EAE8E4]/20'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Чеки и оплаты ({receipts.length})</span>
          </button>
        </div>
      </div>

      {/* Subtab Content */}
      <div className="space-y-6">
        {/* Subtab 1: Purchased Materials */}
        {activeSubTab === 'purchased' && (
          <div className="space-y-4">
            {purchasedMaterials.length === 0 ? (
              <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-12 text-center text-[#1A1A1A]/80 space-y-3 font-sans">
                <p className="text-sm">У вас пока нет купленных премиум-материалов.</p>
                <button
                  onClick={() => setCurrentTab('materials')}
                  className="px-4 py-2 bg-[#F25C05] text-[#1A1A1A] font-mono text-xs uppercase font-bold inline-block"
                >
                  Перейти в каталог материалов
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedMaterials.map(mat => (
                  <div key={mat.id} className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-5 text-[#1A1A1A] space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#1A1A1A] bg-[#1A1A1A]/10 px-2 py-0.5 border border-[#1A1A1A]">
                        {mat.disciplineName}
                      </span>
                      <h3 className="font-serif font-bold text-base text-[#1A1A1A]">{mat.title}</h3>
                      <p className="text-xs text-[#1A1A1A]/80 line-clamp-2 font-sans">{mat.description}</p>
                    </div>

                    <button
                      onClick={() => setCurrentTab('materials')}
                      className="w-full py-2 bg-[#1A1A1A] text-[#EAE8E4] hover:bg-[#F25C05] hover:text-[#1A1A1A] font-mono text-xs uppercase font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#F25C05]" />
                      <span>Читать материал</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subtab 2: Ticket Attempts History */}
        {activeSubTab === 'ai_tickets' && (
          <div className="space-y-4">
            {ticketAttempts.length === 0 ? (
              <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-12 text-center text-[#1A1A1A]/80 space-y-3 font-sans">
                <p className="text-sm">Вы еще не проходили проверку ответов по экзаменационным билетам.</p>
                <button
                  onClick={() => setCurrentTab('tickets')}
                  className="px-4 py-2 bg-[#F25C05] text-[#1A1A1A] font-mono text-xs uppercase font-bold inline-block"
                >
                  Перейти к билетам
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {ticketAttempts.map(att => (
                  <div key={att.id} className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-5 text-[#1A1A1A] space-y-3">
                    <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2 font-mono text-xs">
                      <span className="font-bold text-[#1A1A1A]">{att.disciplineName} • Билет №{att.ticketNumber}</span>
                      <span className="font-bold px-2.5 py-0.5 bg-[#F25C05] text-[#1A1A1A]">
                        Оценка: {att.evaluation.gradeText} ({att.evaluation.score}%)
                      </span>
                    </div>

                    <div className="font-serif font-bold text-sm text-[#1A1A1A]">{att.questionTitle}</div>

                    <div className="bg-[#1A1A1A] text-[#EAE8E4] p-3 border border-[#1A1A1A] text-xs space-y-1 font-sans">
                      <div className="text-[10px] font-mono font-bold text-[#F25C05] uppercase">Ваш ответ:</div>
                      <p className="line-clamp-3 italic">{att.studentAnswer}</p>
                    </div>

                    <div className="bg-[#1A1A1A] text-[#EAE8E4] p-3 border border-[#1A1A1A] text-xs font-sans">
                      <strong className="text-[#F25C05] font-mono">Заключение:</strong> {att.evaluation.summary}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subtab 3: Test Scores History */}
        {activeSubTab === 'tests' && (
          <div className="space-y-4">
            {testResults.length === 0 ? (
              <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-12 text-center text-[#1A1A1A]/80 space-y-3 font-sans">
                <p className="text-sm">История прохождения тестов пока пуста.</p>
                <button
                  onClick={() => setCurrentTab('tests')}
                  className="px-4 py-2 bg-[#F25C05] text-[#1A1A1A] font-mono text-xs uppercase font-bold inline-block"
                >
                  Пройти первый тест
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {testResults.map(res => (
                  <div key={res.id} className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-4 text-[#1A1A1A] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-serif font-bold text-sm text-[#1A1A1A]">{res.testTitle}</div>
                      <div className="text-[#1A1A1A]/70 font-mono text-[11px]">{res.disciplineName} • {res.completedAt}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-base text-[#F25C05]">{res.scorePercentage}%</div>
                      <div className="text-[#1A1A1A]/70 text-[11px]">{res.correctAnswersCount} из {res.totalQuestionsCount} верно</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subtab 4: Payment Receipts Self-Employed */}
        {activeSubTab === 'receipts' && (
          <div className="space-y-4">
            {receipts.length === 0 ? (
              <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-12 text-center text-[#1A1A1A]/80 font-sans">
                <p className="text-sm">История оплат пуста.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {receipts.map(rec => (
                  <div key={rec.id} className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-5 text-[#1A1A1A] space-y-2 text-xs">
                    <div className="flex items-center justify-between font-mono font-bold text-sm border-b-2 border-[#1A1A1A] pb-2">
                      <span className="text-[#1A1A1A] flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#F25C05]" /> {rec.receiptNumber}
                      </span>
                      <span className="text-[#F25C05]">{rec.amount} ₽</span>
                    </div>

                    <div className="font-serif font-bold text-sm text-[#1A1A1A]">{rec.materialTitle}</div>

                    <div className="text-[#1A1A1A]/80 font-mono text-[11px] space-y-0.5">
                      <div>Статус: {rec.taxStatus}</div>
                      <div>Оплачено через: {rec.paymentMethod}</div>
                      <div>Дата: {rec.purchasedAt}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
