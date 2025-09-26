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

// Determines the correct initial view based on the URL path.
const getInitialView = (): QuizState => {
  const path = window.location.pathname;
  if (path.startsWith('/dashboard')) {
    return sessionStorage.getItem('dashboard_authed') === 'true'
      ? QuizState.DASHBOARD
      : QuizState.AUTH;
  }
  if (path.startsWith('/results')) {
      return QuizState.RESULTS;
  }
  return QuizState.WELCOME;
};


const App: React.FC = () => {
  const [view, setView] = useState<QuizState>(getInitialView);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisLevel, setDiagnosisLevel] = useState<number>(0);
  
  // This effect handles browser back/forward button clicks.
  useEffect(() => {
    const handlePopState = () => {
      setView(getInitialView());
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);


  const trackEvent = useCallback((eventType: EventType, payload?: any) => {
    api.trackEvent(eventType, payload);
  }, []);

  const handleAnswer = useCallback(() => {
    trackEvent(EventType.QUESTION_COMPLETE, { questionId: quizQuestions[currentQuestionIndex].id });

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setView(QuizState.LEAD_CAPTURE);
    }
  }, [currentQuestionIndex, trackEvent]);

  const handleLeadSubmit = useCallback((leadData: { name: string; email: string; phone: string }) => {
    trackEvent(EventType.LEAD_SUBMIT);
    setIsAnalyzing(true);
    setDiagnosisLevel(Math.floor(Math.random() * 3));
    
    const params = new URLSearchParams();
    params.append('name', leadData.name);
    params.append('email', leadData.email);

    // Apply the Hotmart phone formatting logic immediately.
    const phoneDigits = leadData.phone.replace(/\D/g, '');
    let phoneac = '';
    let phonenumber = '';
    
    // Assumes phoneDigits includes '55' prefix
    if (phoneDigits.length >= 12) { // 55 + DDD (2) + Number (9)
        phoneac = phoneDigits.slice(2);      // e.g., 11987654321
        phonenumber = phoneDigits.slice(4);  // e.g., 987654321
    } else if (phoneDigits.length >= 10) { // Fallback for numbers without 55 or 8 digits
        phoneac = phoneDigits;
        phonenumber = phoneDigits.slice(2);
    }
    
    params.append('phoneac', phoneac);
    params.append('phonenumber', phonenumber);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      window.history.pushState(null, '', `/results?${params.toString()}`);
      setView(QuizState.RESULTS);
      trackEvent(EventType.QUIZ_COMPLETE);
    }, 2500);
  }, [trackEvent]);

  const handleAuthSuccess = () => {
    sessionStorage.setItem('dashboard_authed', 'true');
    window.history.pushState(null, '', '/dashboard');
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
        return <ResultScreen diagnosisLevel={diagnosisLevel} onCheckoutStart={() => trackEvent(EventType.CHECKOUT_START)} />;
      case QuizState.AUTH:
        return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
      case QuizState.DASHBOARD:
        return <DashboardScreen 
                 totalQuestions={quizQuestions.length} 
                 onBack={() => {
                   window.history.pushState(null, '', '/');
                   setView(QuizState.WELCOME);
                 }} 
               />;
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