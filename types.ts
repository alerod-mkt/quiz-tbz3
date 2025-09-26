export enum QuizState {
  WELCOME,
  QUIZ,
  LEAD_CAPTURE,
  RESULTS,
  DASHBOARD,
  AUTH,
}

export enum EventType {
  VISIT = 'visit',
  QUIZ_START = 'quiz_start',
  QUESTION_VIEW = 'question_view', // Mantido para possível análise futura de visualização vs. conclusão
  QUESTION_COMPLETE = 'question_complete',
  LEAD_SUBMIT = 'lead_submit',
  QUIZ_COMPLETE = 'quiz_complete',
  CHECKOUT_START = 'checkout_start',
}

export interface Question {
  id: number;
  category: 'A REALIDADE ATUAL' | 'SINAIS DE ALERTA' | 'O FUTURO DELES' | 'SUA DECISÃO';
  text: string;
  options: string[];
}

export interface Visitor {
    id: string;
    ip: string;
    country: string;
    region: string;
    city: string;
    timestamp: string;
}

export interface QuizMetrics {
  visits: number;
  quizStarts: number;
  leads: number;
  questionCompletions: { [key: number]: number };
  quizCompletions: number;
  checkoutStarts: number;
  visitors: Visitor[];
}