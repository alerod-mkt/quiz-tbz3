import { QuizMetrics, EventType } from '../types';
import { db } from './db';

// This file simulates the backend server logic.
// These functions would be your API endpoints (e.g., GET /metrics, POST /track).

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const handleGetMetrics = async (): Promise<QuizMetrics> => {
  await delay(150); // Simulate database query time
  const metrics = db.getMetrics();
  return metrics;
};

export const handleTrackEvent = async (eventType: EventType, payload?: any): Promise<void> => {
  await delay(80); // Simulate event processing time
  const currentMetrics = db.getMetrics();
  let updatedMetrics: QuizMetrics = { ...currentMetrics };

  switch (eventType) {
    case EventType.VISIT:
      updatedMetrics.visits += 1;
      break;
    case EventType.QUIZ_START:
      updatedMetrics.quizStarts += 1;
      break;
    case EventType.QUESTION_VIEW:
      if (payload && payload.questionId) {
        const { questionId } = payload;
        updatedMetrics.questionViews[questionId] = (updatedMetrics.questionViews[questionId] || 0) + 1;
      }
      break;
    case EventType.LEAD_SUBMIT:
      updatedMetrics.leads += 1;
      break;
    case EventType.OFFER_CLICK:
      updatedMetrics.offerClicks += 1;
      break;
    default:
      console.warn(`[Backend] Unknown event type: ${eventType}`);
      return;
  }
  
  db.saveMetrics(updatedMetrics);
};

export const handleResetMetrics = async (): Promise<void> => {
  await delay(200); // Simulate database reset operation
  db.resetMetrics();
};
