import React, { useEffect } from 'react';
import type { Question } from '../types';

interface QuizScreenProps {
  questions: Question[];
  currentQuestionIndex: number;
  onAnswer: (answer: string) => void;
  trackQuestionView: (questionId: number) => void;
}

// Accelerated progress steps: starts fast, slows down.
const progressSteps = [15, 30, 45, 55, 60, 65, 70, 75, 80, 85, 90, 93, 96, 98, 100];

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, currentQuestionIndex, onAnswer, trackQuestionView }) => {
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = progressSteps[currentQuestionIndex];

  const categoryEmojis: { [key in Question['category']]: string } = {
    'A REALIDADE ATUAL': '🏡',
    'SINAIS DE ALERTA': '💔',
    'O FUTURO DELES': '😟',
    'SUA DECISÃO': '❤️‍🩹',
  };

  const emoji = categoryEmojis[currentQuestion.category];

  useEffect(() => {
    if (currentQuestion) {
      trackQuestionView(currentQuestion.id);
    }
  }, [currentQuestionIndex, currentQuestion, trackQuestionView]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
            <div className="flex justify-between mb-2">
                <span className="text-base font-medium text-brand-text/70">Progresso</span>
            </div>
            <div className="w-full bg-brand-accent/20 rounded-full h-3">
                <div 
                    className="bg-brand-accent h-3 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progressPercentage}%` }}>
                </div>
            </div>
        </div>

        {/* Quiz Card */}
        <div className="bg-brand-card-bg rounded-xl shadow-xl p-6 sm:p-8 text-center border border-pink-100/10">
          {emoji && <div className="text-6xl mx-auto mb-4">{emoji}</div>}
          <span className="text-sm font-bold uppercase tracking-wider text-brand-accent">{currentQuestion.category}</span>
          <h2 className="text-2xl sm:text-3xl font-bold my-4 text-brand-card-text leading-tight">
            {currentQuestion.text}
          </h2>
          
          <div className="mt-8 flex flex-col space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => onAnswer(option)}
                className="group w-full bg-transparent border-2 border-brand-accent/50 text-brand-card-text-muted font-semibold py-4 px-5 rounded-xl text-left text-base sm:text-lg transition-all duration-300 ease-in-out hover:border-brand-accent hover:bg-brand-accent hover:text-brand-text transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-brand-accent/30"
              >
                <span className="ml-4">{option}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;