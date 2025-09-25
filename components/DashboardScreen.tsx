import React, { useState, useEffect } from 'react';
import type { QuizMetrics } from '../types';
import * as api from '../api';

interface DashboardScreenProps {
  totalQuestions: number;
}

const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
    </svg>
);


const MetricCard: React.FC<{ title: string; value: string | number; percentage?: string }> = ({ title, value, percentage }) => (
  <div className="bg-brand-card-bg rounded-lg shadow-lg p-6">
    <p className="text-sm font-medium text-brand-card-text-muted uppercase tracking-wider">{title}</p>
    <p className="text-4xl font-bold text-brand-accent mt-2">{value}</p>
    {percentage && <p className="text-sm text-brand-card-text-muted mt-1">{percentage}</p>}
  </div>
);

const DashboardScreen: React.FC<DashboardScreenProps> = ({ totalQuestions }) => {
    const [metrics, setMetrics] = useState<QuizMetrics | null>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            const data = await api.getMetrics();
            setMetrics(data);
        };
        fetchMetrics();
    }, []);

    const handleReset = async () => {
        await api.resetMetrics();
        const data = await api.getMetrics();
        setMetrics(data);
    };
    
    const handleBack = () => {
        // Navigate to the root path and trigger a popstate event to update the view in App.tsx
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    if (!metrics) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-brand-bg p-4 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-accent"></div>
             </div>
        );
    }

    const { visits, quizStarts, leads, offerClicks, questionViews } = metrics;

    const visitToStartRate = visits > 0 ? ((quizStarts / visits) * 100).toFixed(1) : '0.0';
    const startToLeadRate = quizStarts > 0 ? ((leads / quizStarts) * 100).toFixed(1) : '0.0';
    const leadToClickRate = leads > 0 ? ((offerClicks / leads) * 100).toFixed(1) : '0.0';

    const funnelSteps = Array.from({ length: totalQuestions }, (_, i) => {
        const questionId = i + 1;
        const views = questionViews[questionId] || 0;
        const previousViews = questionId === 1 ? quizStarts : (questionViews[questionId - 1] || 0);
        const dropOff = previousViews > 0 ? previousViews - views : 0;
        const dropOffRate = previousViews > 0 ? ((dropOff / previousViews) * 100).toFixed(1) : '0.0';
        return {
        questionId,
        name: `Pergunta ${questionId}`,
        views,
        dropOff,
        dropOffRate
        };
    });

    return (
        <div className="min-h-screen bg-brand-bg p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-4">
                        <button onClick={handleBack} className="text-brand-text/70 hover:text-brand-accent transition-colors">
                            <BackIcon className="w-10 h-10"/>
                        </button>
                        <h1 className="text-4xl font-bold text-brand-text">Dashboard de Métricas</h1>
                    </div>
                    <button 
                        onClick={handleReset}
                        className="bg-red-500/10 text-red-500 font-semibold py-2 px-4 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                        Resetar Estatísticas
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard title="Visitantes" value={visits} />
                    <MetricCard title="Inícios do Quiz" value={quizStarts} percentage={`${visitToStartRate}% dos visitantes`} />
                    <MetricCard title="Leads Gerados" value={leads} percentage={`${startToLeadRate}% de quem iniciou`} />
                    <MetricCard title="Cliques na Oferta" value={offerClicks} percentage={`${leadToClickRate}% dos leads`} />
                </div>

                <div className="bg-brand-card-bg rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-brand-card-text mb-6">Funil de Abandono do Quiz</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-brand-card-text/20">
                                    <th className="p-3 text-sm font-semibold text-brand-card-text-muted uppercase">Etapa</th>
                                    <th className="p-3 text-sm font-semibold text-brand-card-text-muted uppercase text-right">Usuários</th>
                                    <th className="p-3 text-sm font-semibold text-brand-card-text-muted uppercase text-right">Abandono</th>
                                    <th className="p-3 text-sm font-semibold text-brand-card-text-muted uppercase text-right">Taxa de Abandono</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-brand-card-text/10">
                                    <td className="p-3 font-medium text-brand-card-text">Início do Quiz</td>
                                    <td className="p-3 font-mono text-brand-card-text text-right">{quizStarts}</td>
                                    <td className="p-3 font-mono text-red-400/80 text-right">-</td>
                                    <td className="p-3 font-mono text-red-400/80 text-right">-</td>
                                </tr>
                                {funnelSteps.map(step => (
                                    <tr key={step.questionId} className="border-b border-brand-card-text/10">
                                        <td className="p-3 font-medium text-brand-card-text">{step.name}</td>
                                        <td className="p-3 font-mono text-brand-card-text text-right">{step.views}</td>
                                        <td className="p-3 font-mono text-red-400/80 text-right">{step.dropOff > 0 ? `-${step.dropOff}` : '0'}</td>
                                        <td className="p-3 font-mono text-red-400/80 text-right">{step.dropOffRate}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;