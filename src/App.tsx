import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { DisciplinesView } from './components/DisciplinesView';
import { MaterialsView } from './components/MaterialsView';
import { TestsView } from './components/TestsView';
import { TicketAIView } from './components/TicketAIView';
import { CabinetView } from './components/CabinetView';
import { AdminView } from './components/AdminView';
import { OfferLegalView } from './components/OfferLegalView';
import { PurchaseModal } from './components/PurchaseModal';
import { AuthModal } from './components/AuthModal';

import { 
  INITIAL_DISCIPLINES, 
  INITIAL_MATERIALS, 
  INITIAL_TESTS, 
  INITIAL_TEST_QUESTIONS, 
  INITIAL_TICKETS 
} from './data/initialData';

import { 
  UserProfile, 
  Material, 
  Test, 
  TestQuestion, 
  ExamTicket, 
  StudentTestResult, 
  StudentTicketAttempt, 
  PurchaseReceipt 
} from './types';

import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [legalSubTab, setLegalSubTab] = useState<'offer' | 'refund' | 'privacy'>('offer');
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string | null>(null);

  // User State (persisted)
  const [user, setUser] = useLocalStorage<UserProfile>('med_user', {
    id: 'user-1',
    name: 'Даниил Мапола',
    email: 'danielmapola12@gmail.com',
    universityGroup: '302 группа, Лечебный факультет',
    role: 'student',
    purchasedMaterialIds: ['mat-1', 'mat-3', 'mat-5'] // Initial free unlocked materials
  });

  // Dynamic Platform Data (persisted)
  const [materials, setMaterials] = useLocalStorage<Material[]>('med_materials', INITIAL_MATERIALS);
  const [tests, setTests] = useLocalStorage<Test[]>('med_tests', INITIAL_TESTS);
  const [questions, setQuestions] = useLocalStorage<TestQuestion[]>('med_questions', INITIAL_TEST_QUESTIONS);
  const [tickets, setTickets] = useLocalStorage<ExamTicket[]>('med_tickets', INITIAL_TICKETS);

  // User Activity Records (persisted)
  const [testResults, setTestResults] = useLocalStorage<StudentTestResult[]>('med_test_results', []);
  const [ticketAttempts, setTicketAttempts] = useLocalStorage<StudentTicketAttempt[]>('med_ticket_attempts', []);
  const [receipts, setReceipts] = useLocalStorage<PurchaseReceipt[]>('med_receipts', []);

  // Modals State
  const [purchasingMaterial, setPurchasingMaterial] = useState<Material | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const handleOpenPurchase = (mat: Material) => {
    setPurchasingMaterial(mat);
  };

  const handlePurchaseSuccess = (receipt: PurchaseReceipt) => {
    setReceipts(prev => [receipt, ...prev]);
    setUser(prev => ({
      ...prev,
      purchasedMaterialIds: [...prev.purchasedMaterialIds, receipt.materialId]
    }));
  };

  const handleSaveTestResult = (result: StudentTestResult) => {
    setTestResults(prev => [result, ...prev]);
  };

  const handleSaveTicketAttempt = (attempt: StudentTicketAttempt) => {
    setTicketAttempts(prev => [attempt, ...prev]);
  };

  // Admin Callbacks
  const handleAddMaterial = (newMat: Material) => {
    setMaterials(prev => [newMat, ...prev]);
  };

  const handleAddTest = (newTest: Test, newQuestions: TestQuestion[]) => {
    setTests(prev => [newTest, ...prev]);
    setQuestions(prev => [...newQuestions, ...prev]);
  };

  const handleAddTicket = (newTicket: ExamTicket) => {
    setTickets(prev => [newTicket, ...prev]);
  };

  const handleResetData = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все сохраненные данные (покупки, тесты, сгенерированные билеты) к исходному состоянию?')) {
      ['med_user', 'med_materials', 'med_tests', 'med_questions', 'med_tickets', 'med_test_results', 'med_ticket_attempts', 'med_receipts'].forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (_) {}
      });
      window.location.reload();
    }
  };

  const handleOpenLegalSubTab = (subtab: 'offer' | 'refund' | 'privacy') => {
    setLegalSubTab(subtab);
    setCurrentTab('offer');
  };

  return (
    <div className="min-h-screen bg-[#EAE8E4] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#F25C05] selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        setUser={setUser}
        purchasedCount={user.purchasedMaterialIds.length}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'home' && (
          <HomeView
            disciplines={INITIAL_DISCIPLINES}
            materials={materials}
            setCurrentTab={setCurrentTab}
            setSelectedDisciplineId={setSelectedDisciplineId}
            onOpenPurchase={handleOpenPurchase}
            purchasedMaterialIds={user.purchasedMaterialIds}
          />
        )}

        {currentTab === 'disciplines' && (
          <DisciplinesView
            disciplines={INITIAL_DISCIPLINES}
            materials={materials}
            tests={tests}
            tickets={tickets}
            selectedDisciplineId={selectedDisciplineId}
            setSelectedDisciplineId={setSelectedDisciplineId}
            setCurrentTab={setCurrentTab}
            onOpenPurchase={handleOpenPurchase}
            purchasedMaterialIds={user.purchasedMaterialIds}
          />
        )}

        {currentTab === 'materials' && (
          <MaterialsView
            materials={materials}
            disciplines={INITIAL_DISCIPLINES}
            onOpenPurchase={handleOpenPurchase}
            purchasedMaterialIds={user.purchasedMaterialIds}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'tests' && (
          <TestsView
            tests={tests}
            questions={questions}
            disciplines={INITIAL_DISCIPLINES}
            onSaveTestResult={handleSaveTestResult}
          />
        )}

        {currentTab === 'tickets' && (
          <TicketAIView
            tickets={tickets}
            disciplines={INITIAL_DISCIPLINES}
            onSaveAttempt={handleSaveTicketAttempt}
          />
        )}

        {currentTab === 'cabinet' && (
          <CabinetView
            user={user}
            materials={materials}
            testResults={testResults}
            ticketAttempts={ticketAttempts}
            receipts={receipts}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView
            disciplines={INITIAL_DISCIPLINES}
            materials={materials}
            tests={tests}
            questions={questions}
            tickets={tickets}
            receipts={receipts}
            onAddMaterial={handleAddMaterial}
            onAddTest={handleAddTest}
            onAddTicket={handleAddTicket}
            onResetData={handleResetData}
          />
        )}

        {currentTab === 'offer' && (
          <OfferLegalView key={legalSubTab} initialTab={legalSubTab} />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(updatedUser) => setUser(updatedUser)}
        setCurrentTab={setCurrentTab}
      />

      {/* Payment Acquiring Modal */}
      <PurchaseModal
        material={purchasingMaterial}
        onClose={() => setPurchasingMaterial(null)}
        onSuccess={handlePurchaseSuccess}
      />

      {/* Footer */}
      <Footer 
        setCurrentTab={setCurrentTab} 
        onOpenLegalTab={handleOpenLegalSubTab}
      />
    </div>
  );
}
