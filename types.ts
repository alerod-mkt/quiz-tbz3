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
  QUESTION_VIEW = 'question_view',
  LEAD_SUBMIT = 'lead_submit',
  OFFER_CLICK = 'offer_click',
}

export interface Question {
  id: number;
  category: 'A REALIDADE ATUAL' | 'SINAIS DE ALERTA' | 'O FUTURO DELES' | 'SUA DECISÃO';
  text: string;
  options: string[];
}

export interface QuizMetrics {
  visits: number;
  quizStarts: number;
  leads: number;
  offerClicks: number;
  questionViews: { [key: number]: number };
}