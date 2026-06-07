import { useRef, useEffect } from 'react';
import { ETAPAS } from '../data/mockData';

/**
 * Indicador visual de progresso por etapas.
 * Prompt 1: Timeline vertical no mobile com ícones SVG médicos.
 * Design clínico com bordas coloridas por categoria de etapa.
 */

// Ícones SVG médicos por etapa
const ICONES_SVG = {
  1: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>, // Recepção
  2: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>, // Triagem
  3: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>, // Aguardando
  4: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 15c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm0-8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>, // Em Atendimento
  5: <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 4c1.93 0 3.5 1.57 3.5 3.5S13.93 14 12 14s-3.5-1.57-3.5-3.5S10.07 7 12 7zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 16.82 9.64 16 12 16s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V20z"/>, // Exames
  6: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>, // Aguardando Resultado
  7: <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z"/>, // Retorno Médico
  8: <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>, // Alta
};

// Cores de borda por categoria de etapa
const getCoresBorda = (etapaId) => {
  if ([1, 2].includes(etapaId)) return 'border-l-primary'; // Triagem: azul
  if ([3, 6].includes(etapaId)) return 'border-l-warning'; // Aguardando: âmbar
  if ([4, 5, 7].includes(etapaId)) return 'border-l-accent'; // Atendimento: verde
  return 'border-l-success'; // Alta: verde
};

export default function EtapaProgress({ etapaAtual }) {
  const total = ETAPAS.length;
  const progressPercent = (etapaAtual / total) * 100;
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [etapaAtual]);

  return (
    <div className="w-full space-y-4" role="progressbar" aria-valuenow={etapaAtual} aria-valuemin={1} aria-valuemax={total} aria-label={`Progresso do atendimento: etapa ${etapaAtual} de ${total}`}>
      {/* Barra de progresso */}
      <div className="relative w-full h-2 bg-surface-dark rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out bg-primary"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Timeline vertical no mobile, horizontal no desktop */}
      <div
        ref={scrollRef}
        className="flex md:grid md:grid-cols-4 gap-2 overflow-x-auto md:overflow-visible scroll-hidden snap-x snap-mandatory pb-2 md:pb-0"
      >
        {ETAPAS.map((etapa) => {
          const isAtiva = etapa.id === etapaAtual;
          const isCompleta = etapa.id < etapaAtual;

          return (
            <div
              key={etapa.id}
              data-active={isAtiva}
              className={`
                clinical-card-subtle p-3 flex items-center gap-3 snap-center flex-shrink-0 w-64 md:w-auto
                border-l-4 transition-all duration-300
                ${isAtiva ? `${getCoresBorda(etapa.id)} shadow-md` : isCompleta ? 'border-l-accent' : 'border-l-border'}
              `}
            >
              <div
                className={`
                  w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center transition-all duration-500
                  ${isAtiva
                    ? 'bg-primary text-white scale-110 shadow-md'
                    : isCompleta
                      ? 'bg-accent text-white'
                      : 'bg-surface-dark text-text-muted'
                  }
                `}
                aria-label={`${etapa.label}${isAtiva ? ' — etapa atual' : isCompleta ? ' — concluída' : ' — pendente'}`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
                  {isCompleta ? <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/> : ICONES_SVG[etapa.id]}
                </svg>
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-semibold truncate ${isAtiva ? 'text-primary' : isCompleta ? 'text-accent' : 'text-text-muted'}`}>
                  {etapa.label}
                </p>
                <p className="text-[10px] text-text-muted truncate">
                  Etapa {etapa.id} de {total}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
