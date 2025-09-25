import React, { useState } from 'react';

interface LeadCaptureScreenProps {
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
}

const LeadCaptureScreen: React.FC<LeadCaptureScreenProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setError('Por favor, preencha todos os campos para continuar.');
      return;
    }
    setError('');
    onSubmit({ name, email, phone });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg p-4">
      <div className="w-full max-w-lg bg-brand-card-bg rounded-2xl shadow-xl p-8 md:p-10 text-center border border-pink-100/10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-accent mb-3">
          Seu diagnóstico está pronto!
        </h1>
        <p className="text-lg text-brand-card-text-muted mb-8">
          Para receber sua análise personalizada e o plano de resgate, preencha os campos abaixo.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <input
            type="text"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-brand-bg/20 border-2 border-transparent focus:border-brand-accent focus:ring-brand-accent text-brand-card-text placeholder-brand-card-text-muted/70 rounded-lg py-3 px-4 text-lg transition-colors"
          />
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-brand-bg/20 border-2 border-transparent focus:border-brand-accent focus:ring-brand-accent text-brand-card-text placeholder-brand-card-text-muted/70 rounded-lg py-3 px-4 text-lg transition-colors"
          />
          <input
            type="tel"
            placeholder="Seu telefone (com DDD)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-brand-bg/20 border-2 border-transparent focus:border-brand-accent focus:ring-brand-accent text-brand-card-text placeholder-brand-card-text-muted/70 rounded-lg py-3 px-4 text-lg transition-colors"
          />
          
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-brand-accent text-brand-text font-bold text-xl py-4 px-8 rounded-full shadow-lg shadow-brand-accent/30 hover:bg-brand-accent-dark hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mt-4"
          >
            RECEBER MEU DIAGNÓSTICO AGORA
          </button>
        </form>
        <p className="text-xs text-brand-card-text-muted/50 mt-6">
          Respeitamos sua privacidade. Seus dados estão seguros conosco.
        </p>
      </div>
    </div>
  );
};

export default LeadCaptureScreen;
