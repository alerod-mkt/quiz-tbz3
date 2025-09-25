import React, { useState, useEffect, useCallback } from 'react';
import { QuizState, EventType } from './types';
import { quizQuestions } from './constants/quizData';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import LeadCaptureScreen from './components/LeadCaptureScreen';
import DashboardScreen from './components/DashboardScreen';
import AuthScreen from './components/AuthScreen';
import * as api from './api';

const App: React.FC = () => {
  const [view, setView] = useState<QuizState>(QuizState.WELCOME);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisLevel, setDiagnosisLevel] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('dashboard_authed') === 'true');
  
  // This unified routing effect handles both initial load and subsequent hash changes.
  // This is the definitive fix for the race condition in the preview environment.
  useEffect(() => {
    const handleRouting = () => {
      const currentHash = window.location.hash;
      if (currentHash === '#dashboard') {
        const isAuthed = sessionStorage.getItem('dashboard_authed') === 'true';
        setIsAuthenticated(isAuthed);
        setView(isAuthed ? QuizState.DASHBOARD : QuizState.AUTH);
      } else {
        // Only reset to WELCOME if the view is a dashboard-related one.
        // This prevents interrupting the quiz flow if the hash changes for other reasons.
        if (view === QuizState.DASHBOARD || view === QuizState.AUTH) {
            setView(QuizState.WELCOME);
        }
      }
    };

    // Check the route as soon as the component mounts.
    handleRouting();

    // Listen for future hash changes.
    window.addEventListener('hashchange', handleRouting, false);

    // Cleanup the listener.
    return () => {
      window.removeEventListener('hashchange', handleRouting, false);
    };
  }, [view]); // Rerunning this on view change helps keep state consistent.


  const trackEvent = useCallback((eventType: EventType, payload?: any) => {
    api.trackEvent(eventType, payload);
  }, []);

  const handleAnswer = useCallback(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setView(QuizState.LEAD_CAPTURE);
    }
  }, [currentQuestionIndex]);

  const handleLeadSubmit = useCallback((leadData: { name: string; email: string; phone: string }) => {
    console.log("Lead captured:", leadData);
    trackEvent(EventType.LEAD_SUBMIT);
    setIsAnalyzing(true);
    setDiagnosisLevel(Math.floor(Math.random() * 3));
    setTimeout(() => {
      setIsAnalyzing(false);
      setView(QuizState.RESULTS);
    }, 2500);
  }, [trackEvent]);

  const handleAuthSuccess = () => {
    sessionStorage.setItem('dashboard_authed', 'true');
    setIsAuthenticated(true);
    setView(QuizState.DASHBOARD);
  };
  
  const renderContent = () => {
    if (isAnalyzing) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-bg p-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-accent mb-6"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-text">Analisando suas respostas...</h2>
          <p className="text-lg text-gray-500 mt-2">Gerando seu diagnóstico personalizado.</p>
        </div>
      );
    }

    switch (view) {
      case QuizState.WELCOME:
        return <WelcomeScreen onStart={() => {
            trackEvent(EventType.QUIZ_START);
            setView(QuizState.QUIZ);
        }} trackVisit={() => trackEvent(EventType.VISIT)} />;
      case QuizState.QUIZ:
        return (
          <QuizScreen
            questions={quizQuestions}
            currentQuestionIndex={currentQuestionIndex}
            onAnswer={handleAnswer}
            trackQuestionView={(id) => trackEvent(EventType.QUESTION_VIEW, { questionId: id })}
          />
        );
      case QuizState.LEAD_CAPTURE:
        return <LeadCaptureScreen onSubmit={handleLeadSubmit} />;
      case QuizState.RESULTS:
        return <ResultScreen diagnosisLevel={diagnosisLevel} onOfferClick={() => trackEvent(EventType.OFFER_CLICK)} />;
      case QuizState.AUTH:
        return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
      case QuizState.DASHBOARD:
        if (!isAuthenticated) {
            return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
        }
        return <DashboardScreen totalQuestions={quizQuestions.length}/>;
      default:
        return <WelcomeScreen onStart={() => {
            trackEvent(EventType.QUIZ_START);
            setView(QuizState.QUIZ);
        }} trackVisit={() => trackEvent(EventType.VISIT)} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      {renderContent()}
    </div>
  );
};

export default App;