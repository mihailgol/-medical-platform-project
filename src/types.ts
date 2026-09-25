export type ContentType = 'lecture' | 'summary' | 'pdf' | 'docx' | 'pptx';

export interface Discipline {
  id: string;
  name: string;
  shortDescription: string;
  iconName: string;
  materialsCount: number;
  testsCount: number;
  ticketsCount: number;
  topics: string[];
  bannerBg: string;
}

export interface Material {
  id: string;
  title: string;
  disciplineId: string;
  disciplineName: string;
  topic: string;
  type: ContentType;
  description: string;
  contentHtml?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  isPremium: boolean;
  price: number; // in RUB
  isPublished: boolean;
  createdAt: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface TestQuestion {
  id: string;
  testId: string;
  questionText: string;
  isMultipleChoice: boolean;
  options: QuestionOption[];
  explanation: string;
}

export interface Test {
  id: string;
  title: string;
  disciplineId: string;
  disciplineName: string;
  topic: string;
  description: string;
  questionsCount: number;
  isPublished: boolean;
}

export interface ExamTicket {
  id: string;
  ticketNumber: number;
  disciplineId: string;
  disciplineName: string;
  topic: string;
  questionTitle: string;
  caseDescription: string;
  modelAnswer: string;
  gradingCriteria: string[];
  isPublished: boolean;
}

export interface AIEvaluationResult {
  score: number; // 0-100
  grade: 2 | 3 | 4 | 5;
  gradeText: string;
  summary: string;
  strengths: string[];
  missingPoints: string[];
  errors: string[];
  recommendations: string[];
  checkedAt: string;
}

export interface StudentTicketAttempt {
  id: string;
  ticketId: string;
  ticketNumber: number;
  disciplineName: string;
  topic: string;
  questionTitle: string;
  studentAnswer: string;
  evaluation: AIEvaluationResult;
  createdAt: string;
}

export interface StudentTestResult {
  id: string;
  testId: string;
  testTitle: string;
  disciplineName: string;
  scorePercentage: number;
  correctAnswersCount: number;
  totalQuestionsCount: number;
  completedAt: string;
}

export interface PurchaseReceipt {
  id: string;
  materialId: string;
  materialTitle: string;
  amount: number;
  currency: string;
  purchasedAt: string;
  receiptNumber: string;
  taxStatus: string; // 'Сформирован в «Мой налог» (НПД)'
  paymentMethod: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  universityGroup: string;
  role: 'student' | 'admin';
  purchasedMaterialIds: string[];
}

export interface DraftQuestionFromAI {
  questionText: string;
  isMultipleChoice: boolean;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

export interface DraftTicketFromAI {
  questionTitle: string;
  caseDescription: string;
  modelAnswer: string;
  gradingCriteria: string[];
}

export interface AIAutoExtractResult {
  questions: DraftQuestionFromAI[];
  tickets: DraftTicketFromAI[];
  summary: string;
}
