import React, { useState } from 'react';
import { FileText, ShieldCheck, CreditCard, Mail, MapPin, RefreshCw, Lock, HelpCircle, CheckCircle2 } from 'lucide-react';

interface OfferLegalViewProps {
  initialTab?: 'offer' | 'refund' | 'privacy';
}

export const OfferLegalView: React.FC<OfferLegalViewProps> = ({ initialTab = 'offer' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'offer' | 'refund' | 'privacy'>(initialTab);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 text-[#1A1A1A]">
      {/* Header Banner */}
      <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 sm:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F25C05] text-[#1A1A1A] font-mono text-[10px] uppercase font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Юридические документы • Статус Самозанятого (НПД)</span>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
            Правовая информация и правила сервиса
          </h1>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/80 font-sans mt-1">
            Условия предоставления образовательных материалов, порядок возврата средств и политика обработки персональных данных в соответствии с законодательством РФ.
          </p>
        </div>

        {/* Subtabs Navigation */}
        <div className="pt-3 border-t border-[#1A1A1A]/20 flex flex-wrap items-center gap-2 font-mono text-xs uppercase font-bold">
          <button
            onClick={() => setActiveSubTab('offer')}
            className={`px-4 py-2 transition-all flex items-center gap-1.5 ${
              activeSubTab === 'offer'
                ? 'bg-[#1A1A1A] text-[#EAE8E4]'
                : 'bg-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-[#1A1A1A]/20'
            }`}
          >
            <FileText className="w-4 h-4 text-[#F25C05]" />
            <span>Публичная оферта</span>
          </button>

          <button
            onClick={() => setActiveSubTab('refund')}
            className={`px-4 py-2 transition-all flex items-center gap-1.5 ${
              activeSubTab === 'refund'
                ? 'bg-[#1A1A1A] text-[#EAE8E4]'
                : 'bg-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-[#1A1A1A]/20'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-[#F25C05]" />
            <span>Порядок возврата средств</span>
          </button>

          <button
            onClick={() => setActiveSubTab('privacy')}
            className={`px-4 py-2 transition-all flex items-center gap-1.5 ${
              activeSubTab === 'privacy'
                ? 'bg-[#1A1A1A] text-[#EAE8E4]'
                : 'bg-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-[#1A1A1A]/20'
            }`}
          >
            <Lock className="w-4 h-4 text-[#F25C05]" />
            <span>Персональные данные (152-ФЗ)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Public Offer */}
      {activeSubTab === 'offer' && (
        <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 sm:p-8 text-[#1A1A1A] text-xs leading-relaxed space-y-6 font-sans">
          <div className="border-b-2 border-[#1A1A1A] pb-3 flex items-center justify-between font-mono text-xs font-bold text-[#F25C05] uppercase">
            <span>Договор публичной оферты</span>
            <span>Редакция от 2026 г.</span>
          </div>

          <section className="space-y-2">
            <h2 className="font-mono font-bold text-xs uppercase text-[#F25C05] tracking-wider">1. Общие положения</h2>
            <p>
              1.1. Настоящий документ является официальным предложением (Публичной офертой) Физического лица, зарегистрированного в качестве налогоплательщика налога на профессиональный доход (Самозанятого) в соответствии с ФЗ № 422-ФЗ, и содержит все существенные условия предоставления доступа к электронным учебным материалам и сервису AI-проверки билетов по дисциплинам.
            </p>
            <p>
              1.2. В соответствии с пункт 2 статьи 437 Гражданского Кодекса Российской Федерации (ГК РФ), в случае принятия изложенных ниже условий и оплаты услуг, физическое лицо, производящее акцепт этой оферты, становится Покупателем.
            </p>
            <p>
              1.3. Полным и безоговорочным акцептом настоящей оферты является совершение Покупателем оплаты цифровых учебных материалов или регистрация в сервисе «Лекции, материалы».
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-mono font-bold text-xs uppercase text-[#F25C05] tracking-wider">2. Предмет оферты и порядок расчетов</h2>
            <p>
              2.1. Продавец предоставляет Покупателю цифровой доступ к выбранным информационным учебным материалам (лекциям, конспектам, методичкам в форматах PDF, DOCX, PPTX) и онлайн-сервису тестирования и AI-оценки ответов.
            </p>
            <p>
              2.2. Стоимость учебных материалов указана в каталоге платформы и не облагается НДС в связи с применением специального налогового режима НПД (ФЗ № 422-ФЗ).
            </p>
            <p>
              2.3. Расчеты производятся через авторизованные платежные сервисы (банк-эквайер, СБП). В момент проведения оплаты Покупателю высылается фискальный чек, автоматически сформированный через сервис ФНС России «Мой налог».
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-mono font-bold text-xs uppercase text-[#F25C05] tracking-wider">3. Права и обязанности сторон</h2>
            <p>
              3.1. Покупатель обязуется использовать полученные материалы исключительно в личных образовательных целях для подготовки к занятиям и экзаменам.
            </p>
            <p>
              3.2. Передача, публикация или перепродажа учебных материалов третьим лицам без письменного согласия Автора запрещена.
            </p>
          </section>

          <div className="bg-[#1A1A1A] text-[#EAE8E4] p-4 border border-[#1A1A1A] space-y-2 text-[11px] font-mono">
            <div className="font-bold text-[#F25C05] uppercase">Реквизиты Продавца (Самозанятого):</div>
            <div>Статус: Плательщик налога на профессиональный доход (НПД)</div>
            <div>Основание: Федеральный закон № 422-ФЗ</div>
            <div>Регион: Санкт-Петербург</div>
            <div>Электронная почта поддержки: support@med-materials.ru</div>
          </div>
        </div>
      )}

      {/* Tab 2: Refund Policy */}
      {activeSubTab === 'refund' && (
        <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 sm:p-8 text-[#1A1A1A] text-xs leading-relaxed space-y-6 font-sans">
          <div className="border-b-2 border-[#1A1A1A] pb-3 flex items-center justify-between font-mono text-xs font-bold text-[#F25C05] uppercase">
            <span>Регламент и порядок возврата денежных средств</span>
            <span>Защита прав потребителей (ЗоЗПП РФ)</span>
          </div>

          <section className="space-y-2">
            <h2 className="font-mono font-bold text-xs uppercase text-[#F25C05] tracking-wider">1. Особенности цифровых учебных материалов</h2>
            <p>
              1.1. В соответствии со ст. 26.1 Закона РФ «О защите прав потребителей» и Постановлением Правительства РФ № 2463, цифровые учебные файлы (лекции, PDF, конспекты, доступ к базам тестов и AI-проверке) относятся к категории товаров с индивидуально-определенными свойствами, имеющих цифровой формат.
            </p>
            <p>
              1.2. После фактического предоставления доступа к файлам в личном кабинете Покупателя услуга считается оказанной в полном объеме.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-mono font-bold text-xs uppercase text-[#F25C05] tracking-wider">2. Основания для осуществления возврата</h2>
            <p>Возврат денежных средств производится в следующих случаях:</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#1A1A1A]/90">
              <li>Совершение ошибочного или дублирующего платежа за один и тот же материал;</li>
              <li>Возникновение подтвержденных технических сбоев на стороне сервера, не позволивших открывать или скачать оплаченные файлы в течение более чем 24 часов;</li>
              <li>Несоответствие содержимого оплаченного файла заявленной теме дисциплины.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-mono font-bold text-xs uppercase text-[#F25C05] tracking-wider">3. Порядок и сроки подачи заявления на возврат</h2>
            <p>
              3.1. Для оформления возврата Покупатель отправляет заявление в свободной форме на e-mail службы поддержки: <strong className="font-mono text-[#F25C05]">support@med-materials.ru</strong>.
            </p>
            <p>
              3.2. В заявлении необходимо указать: ФИО, e-mail аккаунта, название оплаченного материала, дату оплаты, номер чека из приложения «Мой налог» и причину возврата.
            </p>
            <p>
              3.3. Заявление рассматривается в течение <strong className="font-mono">10 (десяти) календарных дней</strong> с момента получения.
            </p>
            <p>
              3.4. При одобрении возврата денежные средства перечисляются на ту же банковскую карту или через СБП на счет, с которого была произведена оплата. Срок зачисления зависит от банка-эмитента (обычно от 1 до 3 рабочих дней).
            </p>
          </section>

          <div className="bg-[#1A1A1A] text-[#EAE8E4] p-4 border border-[#1A1A1A] space-y-2 text-[11px] font-mono">
            <div className="font-bold text-[#F25C05] uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#F25C05]" />
              <span>Гарантия безопасности платежей:</span>
            </div>
            <div>Оплата происходит через защищенный шлюз с поддержкой 3D-Secure. По всем вопросам возврата обращайтесь по адресу support@med-materials.ru</div>
          </div>
        </div>
      )}

      {/* Tab 3: Personal Data Privacy Policy */}
      {activeSubTab === 'privacy' && (
        <div className="bg-[#EAE8E4] border-2 border-[#1A1A1A] p-6 sm:p-8 text-[#1A1A1A] text-xs leading-relaxed space-y-6 font-sans">
          <div className="border-b-2 border-[#1A1A1A] pb-3 flex items-center justify-between font-mono text-xs font-bold text-[#F25C05] uppercase">
            <span>Политика обработки персональных данных</span>
            <span>Федеральный закон № 152-ФЗ</span>
          </div>

          <section className="space-y-2">
            <h2 className="font-mono font-bold text-xs uppercase text-[#F25C05] tracking-wider">1. Основные понятия и цели обработки</h2>
            <p>
              1.1. Настоящая Политика определяет порядок обработки и защиты персональных данных пользователей веб-платформы «Лекции, материалы» в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных».
            </p>
            <p>
              1.2. Обработка персональных данных осуществляется в следующих целях:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#1A1A1A]/90">
              <li>Предоставление доступа к Личному кабинету студента и учебным материалам;</li>
              <li>Аутентификация пользователя и сохранение результатов тестирования и AI-билетов;</li>
              <li>Формирование и отправка электронных кассовых чеков через сервис ФНС «Мой налог»;</li>
              <li>Обработка обращений в службу поддержки платформы.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-mono font-bold text-xs uppercase text-[#F25C05] tracking-wider">2. Состав обрабатываемых данных</h2>
            <p>Платформа обрабатывает только следующие минимально необходимые данные:</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#1A1A1A]/90">
              <li>Имя и фамилия студента;</li>
              <li>Адрес электронной почты (e-mail);</li>
              <li>Наименование учебной группы и факультета;</li>
              <li>История покупок материалов и прохождения тестов.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-mono font-bold text-xs uppercase text-[#F25C05] tracking-wider">3. Защита, хранение и удаление данных</h2>
            <p>
              3.1. Персональные данные хранятся на защищенных серверах, расположенных на территории Российской Федерации (в соответствии с требованиями 242-ФЗ).
            </p>
            <p>
              3.2. Передача данных третьим лицам категорически запрещена, за исключением случаев, предусмотренных законодательством РФ (например, формирование чеков в ФНС РФ).
            </p>
            <p>
              3.3. Пользователь имеет право в любой момент отозвать согласие на обработку персональных данных и запросить удаление своего аккаунта, направив письмо на <strong className="font-mono text-[#F25C05]">support@med-materials.ru</strong>.
            </p>
          </section>

          <div className="bg-[#1A1A1A] text-[#EAE8E4] p-4 border border-[#1A1A1A] space-y-2 text-[11px] font-mono">
            <div className="font-bold text-[#F25C05] uppercase">Оператор персональных данных:</div>
            <div>Платформа «Лекции, материалы»</div>
            <div>Контакты ответственного за данные: support@med-materials.ru</div>
          </div>
        </div>
      )}
    </div>
  );
};
