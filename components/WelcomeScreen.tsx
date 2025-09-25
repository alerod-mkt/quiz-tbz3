import React, { useEffect } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
  trackVisit: () => void;
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, trackVisit }) => {
  useEffect(() => {
    trackVisit();
  }, [trackVisit]);

  const fascinações = [
    "O protocolo de emergência para parar as brigas antes que seja tarde demais",
    "Como desprogramar seus filhos dos traumas já causados pelas discussões",
    "As 3 frases que fazem qualquer marido parar na hora e te respeitar",
    "O método para ser ouvida sem destruir a paz da família",
    "Como transformar sua casa de campo de batalha em lar de paz",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl w-full text-center bg-brand-card-bg text-brand-card-text rounded-2xl shadow-xl p-6 md:p-10 border border-pink-100/10">
        <span className="text-brand-accent font-bold uppercase tracking-widest text-sm">Diagnóstico de Emergência</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold my-4 leading-tight">
          <span className="text-brand-accent">PARE!</span> SUAS BRIGAS ESTÃO CONDENANDO SEUS FILHOS
        </h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-brand-card-text-muted mb-6">
          Faça Este Diagnóstico Antes Que o Dano Se Torne Irreversível
        </h2>
        <p className="text-base sm:text-lg text-brand-card-text-muted mb-8 max-w-2xl mx-auto">
          A cada briga que seus filhos presenciam, você os ensina que casamento é sofrimento. Neurociência confirma: isso causa danos permanentes após os 12 anos. Este diagnóstico revelará o nível de risco e gerará seu plano de resgate:
        </p>
        
        <div className="text-left max-w-xl mx-auto space-y-4 mb-10">
          {fascinações.map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckIcon className="w-6 h-6 text-brand-accent flex-shrink-0 mt-1" />
              <span className="text-brand-card-text text-lg">{item}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={onStart} 
          className="w-full max-w-md mx-auto bg-brand-accent text-brand-text font-bold text-xl sm:text-2xl py-4 px-8 rounded-full shadow-lg shadow-brand-accent/30 hover:bg-brand-accent-dark hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          QUERO SALVAR MEUS FILHOS AGORA
        </button>
        
        <p className="mt-8 text-base font-semibold text-brand-card-text-muted/70">
          "1.436 mães já salvaram seus casamentos e protegeram o futuro dos filhos"
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;