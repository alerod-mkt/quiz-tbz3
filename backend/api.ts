import { QuizMetrics, EventType, Visitor } from '../types';
import { db } from './db';

// This file simulates the backend server logic.
// These functions would be your API endpoints (e.g., GET /metrics, POST /track).

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createSimulatedVisitor = (): Visitor => {
    const randomOctet = () => Math.floor(Math.random() * 256);
    const ip = `187.${randomOctet()}.${randomOctet()}.${randomOctet()}`;
    return {
        id: crypto.randomUUID(),
        ip,
        country: 'Brasil',
        region: 'São Paulo',
        city: 'São Paulo',
        timestamp: new Date().toISOString(),
    };
};


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
      const newVisitor = createSimulatedVisitor();
      // Ensure visitors array exists
      if (!updatedMetrics.visitors) {
          updatedMetrics.visitors = [];
      }
      updatedMetrics.visitors.push(newVisitor);
      break;
    case EventType.QUIZ_START:
      updatedMetrics.quizStarts += 1;
      break;
    case EventType.QUESTION_VIEW:
        // This is still tracked but not displayed on the dashboard for now.
        // Could be useful for other analyses.
      break;
    case EventType.QUESTION_COMPLETE:
        if (payload && payload.questionId) {
            const { questionId } = payload;
            updatedMetrics.questionCompletions[questionId] = (updatedMetrics.questionCompletions[questionId] || 0) + 1;
        }
        break;
    case EventType.LEAD_SUBMIT:
      updatedMetrics.leads += 1;
      break;
    case EventType.QUIZ_COMPLETE:
      updatedMetrics.quizCompletions += 1;
      break;
    case EventType.ADD_TO_CART:
      updatedMetrics.addToCarts += 1;
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