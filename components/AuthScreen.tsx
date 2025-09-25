import React, { useState } from 'react';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // In a real app, this would be validated against a server.
  const CORRECT_PASSWORD = 'admin123'; 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setError('');
      onAuthSuccess();
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg p-4">
      <div className="w-full max-w-sm bg-brand-card-bg rounded-2xl shadow-xl p-8 text-center border border-pink-100/10">
        <h1 className="text-3xl font-extrabold text-brand-accent mb-3">
          Acesso Restrito
        </h1>
        <p className="text-lg text-brand-card-text-muted mb-8">
          Por favor, insira a senha para acessar o dashboard.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-brand-bg/20 border-2 border-transparent focus:border-brand-accent focus:ring-brand-accent text-brand-card-text placeholder-brand-card-text-muted/70 rounded-lg py-3 px-4 text-lg transition-colors"
            autoFocus
          />
          
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-brand-accent text-brand-text font-bold text-xl py-3 px-8 rounded-full shadow-lg shadow-brand-accent/30 hover:bg-brand-accent-dark hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mt-2"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;