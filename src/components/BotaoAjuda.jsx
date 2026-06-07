import { useState } from 'react';

/**
 * Botão "Preciso de ajuda" com feedback visual de confirmação.
 * Prompt 1: Design clínico, altura mínima 64px, cores da nova paleta.
 */
export default function BotaoAjuda({ onSolicitarAjuda }) {
  const [estado, setEstado] = useState('idle'); // 'idle' | 'confirmado' | 'cooldown'

  const handleClick = () => {
    if (estado !== 'idle') return;

    setEstado('confirmado');
    if (onSolicitarAjuda) onSolicitarAjuda();

    setTimeout(() => {
      setEstado('cooldown');
      setTimeout(() => setEstado('idle'), 6000);
    }, 4000);
  };

  if (estado === 'confirmado') {
    return (
      <div className="w-full slide-up" role="status" aria-live="polite">
        <div className="w-full py-4 px-6 rounded-xl bg-accent text-white text-center shadow-lg min-h-[64px] flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-3 text-lg font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 flex-shrink-0" aria-hidden="true">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>Pedido enviado!</span>
          </div>
          <p className="mt-2 text-sm opacity-90">
            A equipe médica foi notificada. Aguarde no local.
          </p>
        </div>
      </div>
    );
  }

  if (estado === 'cooldown') {
    return (
      <button
        disabled
        aria-label="Aguarde para solicitar ajuda novamente"
        className="w-full py-4 px-6 rounded-xl bg-surface-dark text-text-muted text-lg font-semibold cursor-not-allowed flex items-center justify-center gap-3 border border-border min-h-[64px]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 flex-shrink-0 animate-spin" style={{ animationDuration: '3s' }} aria-hidden="true">
          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
        </svg>
        <span>Aguarde para solicitar novamente</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Preciso de ajuda — notificar equipe médica"
      className="w-full btn-danger cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 flex-shrink-0" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      <span>Preciso de ajuda</span>
    </button>
  );
}
