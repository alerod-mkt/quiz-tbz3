import React, { useState, useEffect } from 'react';
import type { QuizMetrics, Visitor } from '../types';
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

    const { visits, quizStarts, leads, questionCompletions, quizCompletions, addToCarts, visitors } = metrics;

    const visitToStartRate = visits > 0 ? ((quizStarts / visits) * 100).toFixed(1) : '0.0';
    const startToLeadRate = quizStarts > 0 ? ((leads / quizStarts) * 100).toFixed(1) : '0.0';
    const leadToCompletionRate = leads > 0 ? ((quizCompletions / leads) * 100).toFixed(1) : '0.0';
    const completionToCartRate = quizCompletions > 0 ? ((addToCarts / quizCompletions) * 100).toFixed(1) : '0.0';

    const funnelSteps = [
        { name: 'Início do Quiz', value: quizStarts, prevValue: visits },
        ...Array.from({ length: totalQuestions }, (_, i) => {
            const questionId = i + 1;
            const completions = questionCompletions[questionId] || 0;
            const prevValue = (questionId === 1) ? quizStarts : (questionCompletions[questionId - 1] || 0);
            return {
                name: `Pergunta ${questionId} Concluída`,
                value: completions,
                prevValue: prevValue
            };
        }),
        { name: 'Lead Gerado', value: leads, prevValue: questionCompletions[totalQuestions] || 0 },
        { name: 'Quiz Concluído', value: quizCompletions, prevValue: leads },
        { name: 'Adição ao Carrinho', value: addToCarts, prevValue: quizCompletions }
    ];

    const recentVisitors = [...(visitors || [])].reverse().slice(0, 10);

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <MetricCard title="Visitantes" value={visits} />
                    <MetricCard title="Inícios do Quiz" value={quizStarts} percentage={`${visitToStartRate}% dos visitantes`} />
                    <MetricCard title="Leads Gerados" value={leads} percentage={`${startToLeadRate}% de quem iniciou`} />
                    <MetricCard title="Quiz Concluídos" value={quizCompletions} percentage={`${leadToCompletionRate}% dos leads`}/>
                    <MetricCard title="Adições ao Carrinho" value={addToCarts} percentage={`${completionToCartRate}% de quem concluiu`}/>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 bg-brand-card-bg rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-brand-card-text mb-6">Funil de Conversão Completo</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-brand-card-text/20">
                                        <th className="p-3 text-sm font-semibold text-brand-card-text-muted uppercase">Etapa</th>
                                        <th className="p-3 text-sm font-semibold text-brand-card-text-muted uppercase text-right">Usuários</th>
                                        <th className="p-3 text-sm font-semibold text-brand-card-text-muted uppercase text-right">Abandono</th>
                                        <th className="p-3 text-sm font-semibold text-brand-card-text-muted uppercase text-right">% Abandono</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {funnelSteps.map((step, index) => {
                                        const dropOff = step.prevValue > 0 ? step.prevValue - step.value : 0;
                                        const dropOffRate = step.prevValue > 0 ? ((dropOff / step.prevValue) * 100).toFixed(1) : '0.0';
                                        return (
                                            <tr key={index} className="border-b border-brand-card-text/10">
                                                <td className="p-3 font-medium text-brand-card-text">{step.name}</td>
                                                <td className="p-3 font-mono text-brand-card-text text-right">{step.value}</td>
                                                <td className="p-3 font-mono text-red-400/80 text-right">{dropOff > 0 ? `-${dropOff}` : '0'}</td>
                                                <td className="p-3 font-mono text-red-400/80 text-right">{dropOffRate}%</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-brand-card-bg rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-brand-card-text mb-6">Visitantes Recentes</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-brand-card-text/20">
                                        <th className="p-2 text-sm font-semibold text-brand-card-text-muted uppercase">Data/Hora</th>
                                        <th className="p-2 text-sm font-semibold text-brand-card-text-muted uppercase">IP</th>
                                        <th className="p-2 text-sm font-semibold text-brand-card-text-muted uppercase">Localização</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentVisitors.map(visitor => (
                                        <tr key={visitor.id} className="border-b border-brand-card-text/10">
                                            <td className="p-2 text-xs font-mono text-brand-card-text-muted">{new Date(visitor.timestamp).toLocaleString('pt-BR')}</td>
                                            <td className="p-2 text-xs font-mono text-brand-card-text">{visitor.ip}</td>
                                            <td className="p-2 text-xs font-medium text-brand-card-text">{visitor.city}, {visitor.region}</td>
                                        </tr>
                                    ))}
                                    {recentVisitors.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="p-4 text-center text-brand-card-text-muted">Nenhum visitante ainda.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;