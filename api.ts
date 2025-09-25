import { QuizMetrics, EventType } from './types';
// In a real application, these imports would be replaced by fetch calls to your backend API.
// For this simulation, we are directly calling the "backend" logic.
import { handleGetMetrics, handleTrackEvent, handleResetMetrics } from './backend/api';

/**
 * This file is the API client for the frontend.
 * It's responsible for communicating with the backend.
 * To switch to a real backend, you would only need to change this file
 * to use fetch() to call your HTTP endpoints.
 */

export const getMetrics = async (): Promise<QuizMetrics> => {
  // Real implementation would be:
  // const response = await fetch('/api/metrics');
  // return response.json();
  return handleGetMetrics();
};

export const trackEvent = async (eventType: EventType, payload?: any): Promise<void> => {
  // Real implementation would be:
  // await fetch('/api/track', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ eventType, payload })
  // });
  return handleTrackEvent(eventType, payload);
};

export const resetMetrics = async (): Promise<void> => {
  // Real implementation would be:
  // await fetch('/api/metrics/reset', { method: 'POST' });
  return handleResetMetrics();
};
