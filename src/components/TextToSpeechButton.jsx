import { useState, useRef } from 'react';

/**
 * Botão de text-to-speech usando a Web Speech API nativa.
 * Prompt 1: Design clínico, altura mínima 64px, efeito glow sutil.
 */
export default function TextToSpeechButton({ texto, tamanhoGrande = false }) {
  const [falando, setFalando] = useState(false);
  const utteranceRef = useRef(null);

  const handleFalar = () => {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não suporta leitura em voz alta.');
      return;
    }

    if (falando) {
      window.speechSynthesis.cancel();
      setFalando(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const vozPt = voices.find(
      (v) => v.lang.startsWith('pt') && v.localService
    ) || voices.find((v) => v.lang.startsWith('pt'));
    if (vozPt) utterance.voice = vozPt;

    utterance.onend = () => setFalando(false);
    utterance.onerror = () => setFalando(false);

    utteranceRef.current = utterance;
    setFalando(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handleFalar}
      aria-label={falando ? 'Parar leitura em voz alta' : 'Ouvir informações em voz alta'}
      aria-pressed={falando}
      title={falando ? 'Parar leitura' : 'Ouvir em voz alta'}
      className={`
        ${tamanhoGrande ? 'w-full btn-primary' : 'btn-primary'} 
        ${!falando && 'tts-glow'} 
        ${falando && 'bg-warning shadow-lg'}
        cursor-pointer relative overflow-hidden
      `}
    >
      <span className={`flex-shrink-0 ${falando ? 'animate-pulse' : ''}`}>
        {falando ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" aria-hidden="true">
            <path d="M6 6h2v12H6zm10 0h2v12h-2z"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" aria-hidden="true">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        )}
      </span>

      <span className="text-center font-semibold">
        {falando ? 'Parar leitura' : 'Ouvir em voz alta'}
      </span>

      {falando && (
        <span className="absolute inset-0 rounded-xl" aria-hidden="true">
          <span className="absolute inset-0 rounded-xl animate-ping bg-white/10" />
        </span>
      )}
    </button>
  );
}
