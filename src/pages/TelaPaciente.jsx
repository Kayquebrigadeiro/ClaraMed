import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ETAPAS } from '../data/mockData';
import { usePacientes } from '../context/PacientesContext';
import pacienteService from '../services/pacienteService';
import Header from '../components/Header';
import EtapaProgress from '../components/EtapaProgress';
import TextToSpeechButton from '../components/TextToSpeechButton';
import BotaoAjuda from '../components/BotaoAjuda';

/**
 * Tela do Paciente — Acessada via QR Code (sem login).
 * Prompt 1: Tipografia DM Serif Display, tamanhos maiores, borda colorida.
 * Prompt 2: Polling real a cada 10s com tratamento de loading e erro.
 */
export default function TelaPaciente() {
  const { pacienteId } = useParams();
  const { pacientes, toggleAjuda } = usePacientes();

  const [paciente, setPaciente] = useState(null);
  const [etapaIndex, setEtapaIndex] = useState(1);
  const [transicao, setTransicao] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Busca inicial e polling a cada 10s
  useEffect(() => {
    const buscarPaciente = async () => {
      try {
        const data = await pacienteService.getPaciente(pacienteId);
        setPaciente(data);
        if (data.etapaAtual !== etapaIndex) {
          setEtapaIndex(data.etapaAtual);
          setTransicao(true);
          setTimeout(() => setTransicao(false), 600);
        }
        setErro(null);
      } catch (error) {
        setErro(error.message);
        // Fallback para contexto mock se API falhar
        const fallback = pacientes.find((p) => p.id === pacienteId) || pacientes[0];
        if (fallback) {
          setPaciente(fallback);
          setEtapaIndex(fallback.etapaAtual);
        }
      } finally {
        setLoading(false);
      }
    };

    buscarPaciente();
    const interval = setInterval(buscarPaciente, 10000);

    return () => clearInterval(interval);
  }, [pacienteId, pacientes, etapaIndex]);

  const etapaAtual = ETAPAS.find((e) => e.id === etapaIndex) || ETAPAS[0];

  const handleAjuda = useCallback(async () => {
    try {
      await pacienteService.postAlerta(pacienteId);
      if (paciente) toggleAjuda(paciente.id, true);
    } catch (error) {
      console.error('Erro ao enviar alerta:', error);
    }
  }, [pacienteId, paciente, toggleAjuda]);

  const textoTTS = `${etapaAtual.label}. ${etapaAtual.descricao}`;

  // Cor da borda por categoria
  const getCorBorda = () => {
    if ([1, 2].includes(etapaIndex)) return 'border-l-primary';
    if ([3, 6].includes(etapaIndex)) return 'border-l-warning';
    if ([4, 5, 7].includes(etapaIndex)) return 'border-l-accent';
    return 'border-l-success';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-text-secondary">Carregando informações...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />

      <main id="main-content" className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto w-full gap-8">
        {/* Erro de rede */}
        {erro && (
          <div className="w-full clinical-card p-4 bg-warning/5 border-l-4 border-l-warning">
            <p className="text-sm text-text-secondary">⚠️ Usando dados locais. Conexão com servidor instável.</p>
          </div>
        )}

        {/* Saudação */}
        <div className="text-center fade-in">
          {paciente && (
            <p className="text-text-secondary text-base mb-2">
              Olá, <span className="text-primary font-semibold">{paciente.nome}</span>
            </p>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-serif)' }}>
            Seu Atendimento
          </h2>
        </div>

        {/* Barra de progresso */}
        <div className="w-full clinical-card p-6">
          <EtapaProgress etapaAtual={etapaIndex} />
        </div>

        {/* Card da etapa atual com borda esquerda colorida */}
        <div
          className={`
            w-full clinical-card p-8 md:p-10 text-center space-y-6
            border-l-4 ${getCorBorda()}
            transition-all duration-500
            ${transicao ? 'scale-[1.01] shadow-xl' : ''}
          `}
        >
          <div className="float">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-primary/10 text-6xl">
              <span role="img" aria-label={etapaAtual.label}>
                {etapaAtual.icone}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-primary/10 text-primary border border-primary/20">
              Etapa {etapaAtual.id} de {ETAPAS.length}
            </span>
            <h3 className="text-3xl md:text-4xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', lineHeight: '1.2' }}>
              {etapaAtual.label}
            </h3>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-xl mx-auto" style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              {etapaAtual.descricao}
            </p>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="w-full space-y-4">
          <TextToSpeechButton texto={textoTTS} tamanhoGrande />
          <BotaoAjuda onSolicitarAjuda={handleAjuda} />
        </div>

        {/* Info de atualização automática */}
        <p className="text-text-muted text-sm text-center flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
          Atualização automática a cada 10 segundos
        </p>
      </main>
    </div>
  );
}
