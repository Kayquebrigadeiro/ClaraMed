/**
 * Header do ClaraMed — Exibido em todas as telas.
 * Design clínico profissional com branding refinado.
 * Prompt 1: Nova identidade visual com paleta clínica.
 */
export default function Header({ children }) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <a href="#main-content" className="skip-to-content">
        Pular para o conteúdo principal
      </a>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo médico clínico */}
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <svg 
              viewBox="0 0 24 24" 
              fill="white" 
              className="w-7 h-7"
              aria-hidden="true"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary" style={{ fontFamily: 'var(--font-serif)' }}>
              ClaraMed
            </h1>
            <p className="text-[10px] text-text-muted leading-none font-medium">
              Comunicação Hospitalar Inteligente
            </p>
          </div>
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </header>
  );
}
