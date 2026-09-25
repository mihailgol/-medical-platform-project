import React, { useState } from 'react';
import { Material, PurchaseReceipt } from '../types';
import { X, ShieldCheck, CreditCard, Lock, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

interface PurchaseModalProps {
  material: Material | null;
  onClose: () => void;
  onSuccess: (receipt: PurchaseReceipt) => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  material,
  onClose,
  onSuccess
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sbp'>('card');
  const [generatedReceipt, setGeneratedReceipt] = useState<PurchaseReceipt | null>(null);

  if (!material) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const receipt: PurchaseReceipt = {
        id: `rec-${Date.now()}`,
        materialId: material.id,
        materialTitle: material.title,
        amount: material.price,
        currency: 'RUB',
        purchasedAt: new Date().toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        receiptNumber: `ЧЕК-НПД-${Math.floor(100000 + Math.random() * 900000)}`,
        taxStatus: 'Сформирован в приложения «Мой налог» (НПД)',
        paymentMethod: paymentMethod === 'card' ? 'Банковская карта (МИР/Visa/MasterCard)' : 'Система Быстрых Платежей (СБП)'
      };

      setGeneratedReceipt(receipt);
      setIsProcessing(false);
      setIsCompleted(true);
      onSuccess(receipt);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] max-w-md w-full overflow-hidden text-[#1A1A1A]">
        {/* Header */}
        <div className="bg-[#1A1A1A] text-[#EAE8E4] px-6 py-4 flex items-center justify-between border-b-2 border-[#1A1A1A]">
          <div className="flex items-center gap-2 font-mono text-xs uppercase font-bold">
            <Lock className="w-4 h-4 text-[#F25C05]" />
            <span>Безопасная оплата</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#EAE8E4] hover:text-[#F25C05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!isCompleted ? (
            <form onSubmit={handlePay} className="space-y-5">
              {/* Material Details */}
              <div className="bg-[#1A1A1A] text-[#EAE8E4] p-4 border border-[#1A1A1A]">
                <span className="text-[10px] font-mono uppercase font-bold text-[#1A1A1A] bg-[#F25C05] px-2 py-0.5 inline-block mb-1">
                  {material.disciplineName}
                </span>
                <h4 className="font-serif font-bold text-sm text-[#EAE8E4] line-clamp-2 mb-2">
                  {material.title}
                </h4>
                <div className="flex items-baseline justify-between pt-2 border-t border-[#EAE8E4]/20 font-mono">
                  <span className="text-xs text-[#EAE8E4]/70">К оплате:</span>
                  <span className="text-2xl font-serif font-bold text-[#F25C05]">{material.price} ₽</span>
                </div>
              </div>

              {/* Legal Notice Self-Employed */}
              <div className="bg-[#1A1A1A] text-[#EAE8E4] p-3 text-xs flex items-start gap-2 border border-[#1A1A1A]">
                <ShieldCheck className="w-4 h-4 text-[#F25C05] shrink-0 mt-0.5" />
                <div className="font-sans">
                  <div className="font-mono font-bold text-[#F25C05] uppercase text-[10px]">Продавец: Самозанятый (НПД)</div>
                  <div className="text-[11px] text-[#EAE8E4]/80 leading-normal">
                    Электронный чек формируется автоматически в приложении «Мой налог» и высылается в личный кабинет сразу после оплаты.
                  </div>
                </div>
              </div>

              {/* Payment Method Picker */}
              <div className="font-mono text-xs">
                <label className="block font-bold uppercase text-[#1A1A1A] mb-2">Выберите способ оплаты:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 border font-bold flex flex-col items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'card'
                        ? 'bg-[#F25C05] text-[#1A1A1A] border-[#1A1A1A]'
                        : 'bg-[#1A1A1A] text-[#EAE8E4] border-[#1A1A1A] hover:border-[#F25C05]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Карта МИР / Visa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('sbp')}
                    className={`p-3 border font-bold flex flex-col items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'sbp'
                        ? 'bg-[#F25C05] text-[#1A1A1A] border-[#1A1A1A]'
                        : 'bg-[#1A1A1A] text-[#EAE8E4] border-[#1A1A1A] hover:border-[#F25C05]'
                    }`}
                  >
                    <div className="font-serif font-bold text-base">СБП</div>
                    <span>Быстрые Платежи</span>
                  </button>
                </div>
              </div>

              {/* Form Input fields */}
              <div className="space-y-3 font-mono text-xs">
                {paymentMethod === 'card' ? (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1 uppercase">Номер карты</label>
                      <input
                        type="text"
                        required
                        placeholder="2200 0000 0000 0000"
                        defaultValue="2202 0000 1234 5678"
                        className="w-full bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] p-2 focus:outline-none focus:border-[#F25C05]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1 uppercase">Срок действия</label>
                        <input
                          type="text"
                          required
                          placeholder="12/28"
                          defaultValue="12/28"
                          className="w-full bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] p-2 focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1 uppercase">CVC / CVC2</label>
                        <input
                          type="password"
                          required
                          placeholder="•••"
                          defaultValue="777"
                          className="w-full bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] p-2 focus:outline-none focus:border-[#F25C05]"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-[#1A1A1A] text-[#EAE8E4] p-4 border border-[#1A1A1A] text-center space-y-2 font-sans">
                    <p className="text-xs">После нажатия кнопки сканируйте QR-код в приложении вашего банка.</p>
                  </div>
                )}
              </div>

              {/* Pay Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-[#F25C05] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#EAE8E4] font-mono text-xs uppercase font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div>
                    <span>Проведение платежа...</span>
                  </>
                ) : (
                  <>
                    <span>Оплатить {material.price} ₽</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Success State */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-[#F25C05] text-[#1A1A1A] border-2 border-[#1A1A1A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">Оплата прошла успешно!</h3>
                <p className="text-xs text-[#1A1A1A]/80 mt-1 font-sans">
                  Доступ к материалу «{material.title}» разблокирован в вашем личном кабинете.
                </p>
              </div>

              {generatedReceipt && (
                <div className="bg-[#1A1A1A] text-[#EAE8E4] border border-[#1A1A1A] p-4 text-left text-xs space-y-2 font-mono">
                  <div className="flex items-center justify-between font-bold text-[#F25C05] border-b border-[#EAE8E4]/20 pb-2">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" /> Электронный чек
                    </span>
                    <span>{generatedReceipt.amount} ₽</span>
                  </div>
                  <div className="text-[#EAE8E4]/80 space-y-1 text-[11px]">
                    <div><strong>Номер чека:</strong> {generatedReceipt.receiptNumber}</div>
                    <div><strong>Статус НПД:</strong> {generatedReceipt.taxStatus}</div>
                    <div><strong>Способ:</strong> {generatedReceipt.paymentMethod}</div>
                    <div><strong>Дата:</strong> {generatedReceipt.purchasedAt}</div>
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-[#1A1A1A] text-[#EAE8E4] hover:bg-[#F25C05] hover:text-[#1A1A1A] font-mono text-xs uppercase font-bold transition-colors"
              >
                Перейти к изучению
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
