import { QuizMetrics } from '../types';

const METRICS_STORAGE_KEY = 'quizMetrics_db';

const initialMetrics: QuizMetrics = {
  visits: 0,
  quizStarts: 0,
  leads: 0,
  offerClicks: 0,
  questionViews: {},
};

// This simulates our "database" connection and operations.
// It uses localStorage for persistence in this simulated environment.

export const db = {
  getMetrics: (): QuizMetrics => {
    try {
      const storedMetrics = localStorage.getItem(METRICS_STORAGE_KEY);
      if (storedMetrics) {
        return JSON.parse(storedMetrics);
      }
      localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(initialMetrics));
      return initialMetrics;
    } catch (error) {
      console.error("Database read error:", error);
      return initialMetrics;
    }
  },
  
  saveMetrics: (metrics: QuizMetrics): void => {
    try {
      localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(metrics));
    } catch (error) {
      console.error("Database write error:", error);
    }
  },

  resetMetrics: (): QuizMetrics => {
    try {
      localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(initialMetrics));
      return initialMetrics;
    } catch (error) {
      console.error("Database reset error:", error);
      return initialMetrics;
    }
  }
};
