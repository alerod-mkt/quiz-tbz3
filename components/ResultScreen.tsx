import React, { useState, useEffect } from 'react';

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 0118 0z" />
  </svg>
);

const CrossIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


// Ícones representativos
const FamilyConflictIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-400/80 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 17a2 2 0 002-2 2 2 0 00-2-2 2 2 0 00-2 2 2 2 0 002 2z"></path>
        <path d="M8 21v-4h8v4"></path>
        <path d="M14.5 4.5l-5 5"></path><path d="M9.5 4.5l5 5"></path>
        <path d="M2 15a2 2 0 100-4 2 2 0 000 4z"></path>
        <path d="M22 15a2 2 0 100-4 2 2 0 000 4z"></path>
    </svg>
);

const HappyFamilyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-brand-accent mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 17a2 2 0 002-2 2 2 0 00-2-2 2 2 0 00-2 2 2 2 0 002 2z"></path>
        <path d="M8 21v-4h8v4"></path>
        <path d="M3 10h18"></path><path d="M3 10a5 5 0 0010 0"></path><path d="M11 10a5 5 0 0110 0"></path>
    </svg>
);

const BookIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-accent mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20v2H6.5A2.5 2.5 0 014 16.5v-11A2.5 2.5 0 016.5 3H20v14H6.5A2.5 2.5 0 014 14.5v-9z"></path>
    </svg>
);


const BarChart: React.FC<{ traumaLevel: number; harmonyPotential: number }> = ({ traumaLevel, harmonyPotential }) => (
    <div className="my-8 p-6 bg-brand-bg/80 rounded-lg text-brand-text">
        <h3 className="text-xl font-bold mb-4 text-center">Sua Situação Visualizada</h3>
        <div className="space-y-4">
            <div>
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-red-500">Nível de Trauma Atual</span>
                    <span className="text-sm font-medium text-red-500">{traumaLevel}%</span>
                </div>
                <div className="w-full bg-red-500/20 rounded-full h-4">
                    <div className="bg-red-500 h-4 rounded-full" style={{ width: `${traumaLevel}%` }}></div>
                </div>
            </div>
            <div>
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-brand-accent">Potencial de Harmonia</span>
                    <span className="text-sm font-medium text-brand-accent">{harmonyPotential}%</span>
                </div>
                <div className="w-full bg-brand-accent/20 rounded-full h-4">
                    <div className="bg-brand-accent h-4 rounded-full" style={{ width: `${harmonyPotential}%` }}></div>
                </div>
            </div>
        </div>
    </div>
);


const diagnoses = [
    {
        headline: "DIAGNÓSTICO: RISCO GRAVE",
        subheadline: "Suas brigas já instalaram o 'vírus da infelicidade' na mente dos seus filhos. Aja agora, antes que ele se torne incurável.",
        traumaLevel: 85,
    },
    {
        headline: "DIAGNÓSTICO: ESTADO CRÍTICO",
        subheadline: "Você está a um passo de condenar seus filhos a repetirem seus piores erros nos relacionamentos. O tempo para reverter está acabando.",
        traumaLevel: 92,
    },
    {
        headline: "DIAGNÓSTICO: DANO ALARMANTE",
        subheadline: "As memórias de hoje serão os traumas de amanhã. O que você considera 'só uma briga', eles sentirão como abandono para o resto da vida.",
        traumaLevel: 95,
    }
];

interface ResultScreenProps {
  diagnosisLevel: number;
  onCheckoutStart: () => void;
}

interface LeadData {
    name: string;
    email: string;
    phone: string;
}


const ResultScreen: React.FC<ResultScreenProps> = ({ diagnosisLevel, onCheckoutStart }) => {
    const [leadData, setLeadData] = useState<LeadData | null>(null);
    const selectedDiagnosis = diagnoses[diagnosisLevel] || diagnoses[0];
    const bonuses = [
        "BÔNUS 1: WhatsApp da Reconquista - 50 mensagens que fazem ele sorrir",
        "BÔNUS 2: Protocolo Pós-Briga - Como reconquistar depois de discussão",
        "BÔNUS 3: Manual da Esposa Irresistível - 15 atitudes irresistíveis",
        "BÔNUS 4: Código da Admiração - Como falar dos defeitos sem criticar",
        "BÔNUS 5: Suporte por Email Exclusivo - Tire suas dúvidas diretamente comigo",
        "BÔNUS 6: Acesso VITALÍCIO - Para sempre, sem mensalidades",
    ];
    
    useEffect(() => {
        // Read lead data from URL parameters when the component mounts
        const params = new URLSearchParams(window.location.search);
        const name = params.get('name');
        const email = params.get('email');
        const phone = params.get('phone');
        if (name && email && phone) {
            setLeadData({ name, email, phone });
        }
    }, []);

    const handleCheckoutClick = () => {
        onCheckoutStart(); // First, track the event

        const baseUrl = 'https://pay.hotmart.com/S101001652G?checkoutMode=10';
        
        if (leadData) {
            const checkoutParams = new URLSearchParams();
            checkoutParams.append('name', leadData.name);
            checkoutParams.append('email', leadData.email);

            // Hotmart requires phone to be split into area code and number
            const phoneDigits = leadData.phone.replace(/\D/g, ''); // Remove non-digits
            if (phoneDigits.length >= 10) {
                const areaCode = phoneDigits.substring(0, 2);
                const number = phoneDigits.substring(2);
                checkoutParams.append('phone_local_code', areaCode);
                checkoutParams.append('phone_number', number);
            }
            
            window.location.href = `${baseUrl}&${checkoutParams.toString()}`;
        } else {
            // Fallback if no lead data is present
            window.location.href = baseUrl;
        }
    };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full">
        {/* Dynamic Diagnosis Headline */}
        <div className="w-full text-center bg-brand-card-bg text-brand-card-text rounded-2xl shadow-xl p-6 md:p-8 mb-12 border-2 border-brand-accent">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-accent uppercase tracking-wide">
                {selectedDiagnosis.headline}
            </h1>
            <p className="text-lg sm:text-xl text-brand-card-text-muted mt-4">
                {selectedDiagnosis.subheadline}
            </p>
        </div>

        {/* Before & After Graphic Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-brand-card-bg/80 text-brand-card-text rounded-xl p-6 text-center border border-red-400/30">
                <FamilyConflictIcon />
                <h3 className="text-2xl font-bold text-red-400/90 mt-4 mb-2">O Ciclo de Dor Atual</h3>
                <ul className="text-left space-y-2 text-brand-card-text-muted">
                    <li className="flex items-start"><span className="mr-2 mt-1">❌</span><span>Crianças ansiosas e inseguras</span></li>
                    <li className="flex items-start"><span className="mr-2 mt-1">❌</span><span>Modelo de relacionamento tóxico</span></li>
                    <li className="flex items-start"><span className="mr-2 mt-1">❌</span><span>Futuro de relações fracassadas</span></li>
                </ul>
            </div>
            <div className="bg-brand-card-bg text-brand-card-text rounded-xl p-6 text-center border border-brand-accent/30">
                <HappyFamilyIcon />
                <h3 className="text-2xl font-bold text-brand-accent mt-4 mb-2">O Futuro de Paz Que Eles Merecem</h3>
                 <ul className="text-left space-y-2 text-brand-card-text-muted">
                    <li className="flex items-start"><CheckIcon className="w-5 h-5 text-brand-accent mr-2 mt-1 flex-shrink-0" /><span>Filhos seguros e emocionalmente estáveis</span></li>
                    <li className="flex items-start"><CheckIcon className="w-5 h-5 text-brand-accent mr-2 mt-1 flex-shrink-0" /><span>Exemplo de amor e respeito em casa</span></li>
                    <li className="flex items-start"><CheckIcon className="w-5 h-5 text-brand-accent mr-2 mt-1 flex-shrink-0" /><span>Capacidade de construir lares felizes</span></li>
                </ul>
            </div>
        </div>


        {/* Mini-VSL Section */}
        <div className="text-center mb-12 p-6 md:p-8 bg-brand-card-bg text-brand-card-text rounded-xl shadow-xl border border-pink-100/10">
          <p className="text-xl md:text-2xl text-brand-card-text-muted mb-6 leading-relaxed">
            "Se você tem filhos e chegou até aqui, preciso te dar uma notícia dolorosa mas necessária: suas brigas não estão só destruindo seu casamento. <strong className="text-brand-accent font-semibold">Estão destruindo seus filhos.</strong> E você tem muito pouco tempo para reverter isso."
          </p>
          
          <BarChart traumaLevel={selectedDiagnosis.traumaLevel} harmonyPotential={95} />

          <p className="text-lg md:text-xl text-brand-card-text-muted mb-6 leading-relaxed">
            "Estudos de Harvard comprovaram: crianças expostas a brigas constantes desenvolvem os mesmos sintomas de veteranos de guerra. Ansiedade crônica, problemas de concentração, dificuldade para formar relacionamentos saudáveis. O pior: <strong className="font-bold text-brand-accent">depois dos 12 anos, esses padrões se tornam quase irreversíveis.</strong> Seu filho vai carregar essas cicatrizes para sempre e repetir exatamente o que aprendeu com vocês."
          </p>
          <p className="text-lg md:text-xl text-brand-card-text-muted mb-6 leading-relaxed">
            "Mas ainda dá tempo. Baseado no seu diagnóstico, criei um protocolo de resgate familiar personalizado. Não é só para salvar seu casamento - é para <strong className="text-brand-accent font-semibold">salvar o futuro dos seus filhos.</strong>"
          </p>
          <p className="text-xl md:text-2xl font-bold text-brand-card-text italic">
            "Cada dia que você demora é um dia a mais de trauma na mente dos seus filhos. Daqui 20 anos, quando eles estiverem repetindo seus erros, você vai se lembrar deste momento. Seus filhos estão contando com você. Não falhe com eles novamente. Role para baixo e salve sua família agora."
          </p>
        </div>

        {/* Sales Page Section */}
        <div className="bg-brand-card-bg text-brand-card-text rounded-2xl shadow-2xl p-6 md:p-10 border border-pink-100/10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-brand-accent mb-2">ÚLTIMA CHANCE:</h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Seus Filhos Não Podem Esperar Mais</h2>
          <p className="text-center text-xl text-brand-accent/90 mb-10 font-semibold">Seu Plano de Resgate Familiar Está Pronto</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-brand-bg p-6 rounded-lg mb-8 border border-pink-200 text-brand-text">
            {/* Product Mockup */}
            <div className="flex flex-col items-center justify-center bg-brand-card-bg/50 p-8 rounded-lg text-center h-full">
                <BookIcon />
                <h3 className="text-2xl font-bold text-brand-card-text">Protocolo de Resgate Familiar</h3>
                <p className="text-brand-card-text-muted mt-2">O passo a passo de 7 dias para restaurar a paz e proteger seus filhos.</p>
                <p className="mt-4 bg-brand-accent text-brand-text font-bold py-2 px-4 rounded-full">VERSÃO EMERGÊNCIA</p>
            </div>
            
            {/* Bonuses */}
            <div>
              <h4 className="font-semibold text-xl mb-4">E você ainda recebe estes bônus de resgate:</h4>
              <div className="space-y-3">
                {bonuses.map((bonus, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckIcon className="w-6 h-6 text-brand-accent flex-shrink-0 mt-1" />
                    <span className="text-brand-text/90">{bonus}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>


          <div className="text-center bg-transparent p-6 rounded-lg border-2 border-brand-accent my-8 shadow-lg">
            <p className="text-lg text-brand-card-text-muted mb-2">Preço de Emergência:</p>
            <p className="text-5xl font-extrabold text-brand-card-text mb-2">R$ 29,90</p>
            <p className="text-brand-card-text-muted/80">Menos que uma consulta de psicólogo infantil que você vai precisar se não agir AGORA.</p>
          </div>
          
          <div className="text-center bg-brand-bg text-brand-text p-6 rounded-lg mb-8 flex flex-col items-center border border-brand-accent/20">
            <ShieldIcon className="w-16 h-16 text-brand-accent mb-4"/>
            <h3 className="font-bold text-xl text-brand-accent">Garantia de Proteção Familiar - 7 dias</h3>
            <p className="text-brand-text/70 mt-2 max-w-xl">Se em 7 dias você não vir uma mudança radical nas brigas, devolvemos tudo. Mas pense: você prefere recuperar R$ 29,90 ou recuperar o futuro dos seus filhos?</p>
          </div>

          <button onClick={handleCheckoutClick} className="w-full bg-brand-accent text-brand-text font-bold text-2xl py-5 px-8 rounded-full shadow-lg shadow-brand-accent/30 hover:bg-brand-accent-dark hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            SIM, VOU SALVAR MEUS FILHOS AGORA
          </button>

          {/* Extended Second CTA Section */}
          <div className="mt-12 pt-8 border-t border-brand-card-text/20">
            <h3 className="text-2xl font-bold text-center text-brand-card-text-muted mb-6">Ainda em dúvida? Deixe-me ser brutalmente honesta...</h3>
            <p className="text-center text-lg text-brand-card-text-muted/80 mb-8 max-w-3xl mx-auto">Neste exato momento, você está em uma encruzilhada. Existem apenas dois caminhos a seguir, e a decisão que você tomar agora definirá o futuro emocional dos seus filhos.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Path of Inaction */}
                <div className="bg-red-900/30 p-6 rounded-lg border border-red-500/50 shadow-inner">
                    <div className="flex items-center mb-4">
                        <CrossIcon className="w-8 h-8 text-red-400 mr-3"/>
                        <h4 className="text-xl font-bold text-red-300">Caminho 1: Você fecha esta página</h4>
                    </div>
                    <p className="text-brand-card-text-muted">Amanhã, a tensão continua. Outra briga acontece. Seus filhos se encolhem no canto de novo. O silêncio pesado volta. Daqui a 5 anos, eles são adolescentes distantes. Daqui a 20, eles estão em relacionamentos tóxicos, porque foi o que aprenderam. E a culpa, silenciosamente, te consumirá todos os dias.</p>
                </div>
                {/* Path of Action */}
                 <div className="bg-brand-accent/10 p-6 rounded-lg border border-brand-accent/70 shadow-inner">
                    <div className="flex items-center mb-4">
                        <CheckIcon className="w-8 h-8 text-brand-accent mr-3"/>
                        <h4 className="text-xl font-bold text-brand-accent">Caminho 2: Você toma a decisão</h4>
                    </div>
                    <p className="text-brand-card-text-muted">Em 24 horas, você já aplica a primeira técnica. A próxima discussão morre antes de começar. Seu marido te olha, surpreso. Seus filhos sentem a paz. Em 7 dias, sua casa é um lar de novo. Daqui a 20 anos, seus filhos te agradecem pelo exemplo de amor que você deu. Você se sentirá orgulhosa. Em paz.</p>
                </div>
            </div>
             <p className="text-center text-xl font-bold text-brand-card-text mt-10 mb-6">A escolha é sua. O futuro deles também.</p>
             <button onClick={handleCheckoutClick} className="w-full bg-brand-accent text-brand-text font-bold text-2xl py-5 px-8 rounded-full shadow-lg shadow-brand-accent/30 hover:bg-brand-accent-dark hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                ESCOLHO SALVAR MINHA FAMÍLIA
             </button>
          </div>

           <p className="text-center text-brand-card-text-muted/70 italic mt-10 text-base border-t border-brand-card-text/20 pt-6">
            "Como conselheira matrimonial cristã e mãe, vi famílias inteiras destruídas por brigas que poderiam ter sido evitadas. Não deixe seus filhos se tornarem mais uma estatística. Aja enquanto ainda é tempo."
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;