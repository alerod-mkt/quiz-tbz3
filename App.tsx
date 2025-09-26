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

// Determines the correct initial view based on the URL path and auth status.
const getInitialView = (): QuizState => {
  if (window.location.pathname === '/dashboard') {
    return sessionStorage.getItem('dashboard_authed') === 'true'
      ? QuizState.DASHBOARD
      : QuizState.AUTH;
  }
  return QuizState.WELCOME;
};


const App: React.FC = () => {
  const [view, setView] = useState<QuizState>(getInitialView);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisLevel, setDiagnosisLevel] = useState<number>(0);
  
  // This effect handles browser navigation events (like back/forward buttons)
  // to keep the view in sync with the URL.
  useEffect(() => {
    const handlePopState = () => {
      setView(getInitialView());
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // Runs only once on component mount.


  const trackEvent = useCallback((eventType: EventType, payload?: any) => {
    api.trackEvent(eventType, payload);
  }, []);

  const handleAnswer = useCallback(() => {
    // Track completion of the CURRENT question before moving to the next
    trackEvent(EventType.QUESTION_COMPLETE, { questionId: quizQuestions[currentQuestionIndex].id });

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setView(QuizState.LEAD_CAPTURE);
    }
  }, [currentQuestionIndex, trackEvent]);

  const handleLeadSubmit = useCallback((leadData: { name: string; email: string; phone: string }) => {
    console.log("Lead captured:", leadData);
    trackEvent(EventType.LEAD_SUBMIT);
    setIsAnalyzing(true);
    setDiagnosisLevel(Math.floor(Math.random() * 3));
    setTimeout(() => {
      setIsAnalyzing(false);
      setView(QuizState.RESULTS);
      trackEvent(EventType.QUIZ_COMPLETE);
    }, 2500);
  }, [trackEvent]);

  const handleAuthSuccess = () => {
    sessionStorage.setItem('dashboard_authed', 'true');
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
        return <ResultScreen diagnosisLevel={diagnosisLevel} onAddToCart={() => trackEvent(EventType.ADD_TO_CART)} />;
      case QuizState.AUTH:
        return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
      case QuizState.DASHBOARD:
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