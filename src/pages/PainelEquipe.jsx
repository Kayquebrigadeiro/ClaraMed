import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ETAPAS, PRIORIDADE_CONFIG } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { usePacientes } from '../context/PacientesContext';
import equipeService from '../services/equipeService';
import Header from '../components/Header';

/**
 * Painel da equipe médica.
 * Prompt 1: Layout 3 colunas desktop, cards otimizados, tempo calculado, modal QR.
 * Prompt 2: Polling real a cada 15s com Promise.all e badge piscante no título.
 */
export default function PainelEquipe() {
  const { usuario, logout } = useAuth();
  const { pacientes: pacientesLocal, resolverAlerta: resolverLocal, atualizarEtapa: atualizarLocal } = usePacientes();
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState(pacientesLocal);
  const [alertasAtivos, setAlertasAtivos] = useState([]);
  const [qrAberto, setQrAberto] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

  // Busca inicial e polling a cada 15s
  useEffect(() => {
    const buscarDados = async () => {
      try {
        const [listaPacientes, listaAlertas] = await Promise.all([
          equipeService.getPacientes(),
          equipeService.getAlertas(),
        ]);
        setPacientes(listaPacientes);
        setAlertasAtivos(listaAlertas);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        // Fallback para dados locais
        setPacientes(pacientesLocal);
        setAlertasAtivos(pacientesLocal.filter(p => p.precisaAjuda));
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
    const interval = setInterval(buscarDados, 15000);

    return () => clearInterval(interval);
  }, [pacientesLocal]);

  // Badge piscante no título quando há alertas
  useEffect(() => {
    const originalTitle = document.title;
    if (alertasAtivos.length > 0) {
      let isAlert = false;
      const interval = setInterval(() => {
        isAlert = !isAlert;
        document.title = isAlert ? `🔴 (${alertasAtivos.length}) ClaraMed` : originalTitle;
      }, 1000);
      return () => {
        clearInterval(interval);
        document.title = originalTitle;
      };
    } else {
      document.title = originalTitle;
    }
  }, [alertasAtivos]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleResolverAlerta = async (pacienteId) => {
    try {
      await equipeService.resolverAlerta(pacienteId);
      setPacientes(prev => prev.map(p => p.id === pacienteId ? { ...p, precisaAjuda: false } : p));
      setAlertasAtivos(prev => prev.filter(p => p.id !== pacienteId));
      resolverLocal(pacienteId);
    } catch (error) {
      console.error('Erro ao resolver alerta:', error);
    }
  };

  const handleAtualizarEtapa = async (pacienteId, etapaId) => {
    try {
      await equipeService.atualizarEtapa(pacienteId, etapaId);
      setPacientes(prev => prev.map(p => p.id === pacienteId ? { ...p, etapaAtual: etapaId } : p));
      atualizarLocal(pacienteId, etapaId);
    } catch (error) {
      console.error('Erro ao atualizar etapa:', error);
    }
  };

  const pacientesFiltrados = useMemo(() => {
    return pacientes.filter((p) =>
      p.nome.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [pacientes, filtro]);

  const getEtapaLabel = (etapaId) => {
    const etapa = ETAPAS.find((e) => e.id === etapaId);
    return etapa ? etapa : ETAPAS[0];
  };

  const calcularTempoEspera = (horarioChegada) => {
    const [hora, minuto] = horarioChegada.split(':').map(Number);
    const agora = new Date();
    const chegada = new Date();
    chegada.setHours(hora, minuto, 0, 0);
    const diff = Math.floor((agora - chegada) / 60000); // minutos
    if (diff < 60) return `${diff} min`;
    const horas = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${horas}h ${mins}min`;
  };

  const baseUrl = window.location.origin;

  const SkeletonCard = () => (
    <div className="clinical-card p-5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-surface-dark" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-surface-dark rounded w-2/3" />
          <div className="h-3 bg-surface-dark rounded w-1/2" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm text-text-primary font-semibold">{usuario?.nome}</span>
            <span className="text-xs text-text-muted">{usuario?.cargo}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 min-h-[48px] rounded-lg bg-danger/10 text-danger text-sm font-semibold hover:bg-danger/20 transition-all cursor-pointer border border-danger/20 flex items-center gap-2"
            aria-label="Sair do painel médico"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Sair
          </button>
        </div>
      </Header>

      <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Header do dashboard */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-serif)' }}>
            Painel de Controle
          </h2>
          <p className="text-text-secondary text-base mt-1">
            {pacientes.length} pacientes • {alertasAtivos.length} alerta{alertasAtivos.length !== 1 ? 's' : ''} ativo{alertasAtivos.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Layout 3 colunas no desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUNA 1: Fila de Pacientes */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-text-primary">Fila de Pacientes</h3>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  aria-label="Buscar paciente por nome"
                  placeholder="Buscar..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-lg bg-white border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm min-h-[44px] w-64"
                />
              </div>
            </div>

            <div className="grid gap-3">
              {carregando ? (
                Array.from({ length: 4 }).map((_, idx) => <SkeletonCard key={idx} />)
              ) : (
                pacientesFiltrados.map((paciente) => {
                  const etapa = getEtapaLabel(paciente.etapaAtual);
                  const prio = PRIORIDADE_CONFIG[paciente.prioridade] || PRIORIDADE_CONFIG.normal;
                  const tempoEspera = calcularTempoEspera(paciente.horarioChegada);

                  return (
                    <div
                      key={paciente.id}
                      onClick={() => setPacienteSelecionado(paciente.id === pacienteSelecionado ? null : paciente.id)}
                      className={`
                        clinical-card p-4 cursor-pointer transition-all
                        ${paciente.precisaAjuda ? 'ring-2 ring-danger/50 shadow-lg' : 'hover:shadow-lg'}
                        ${pacienteSelecionado === paciente.id ? 'ring-2 ring-primary shadow-xl' : ''}
                      `}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center text-2xl ${paciente.precisaAjuda ? 'bg-danger/10 animate-pulse' : 'bg-primary/10'}`} aria-hidden="true">
                            {paciente.precisaAjuda ? '🆘' : etapa.icone}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h4 className="font-bold text-text-primary truncate text-base">
                                {paciente.nome}
                              </h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${prio.bg} ${prio.cor} border ${prio.border}`}>
                                {prio.label}
                              </span>
                              {paciente.precisaAjuda && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-danger/10 text-danger border border-danger/30 animate-pulse" role="alert">
                                  AJUDA
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-text-secondary flex-wrap">
                              <span>{paciente.idade} anos</span>
                              <span>•</span>
                              <span className="font-semibold">{tempoEspera}</span>
                              <span>•</span>
                              <span>{etapa.label}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQrAberto(qrAberto === paciente.id ? null : paciente.id);
                          }}
                          className="w-10 h-10 flex-shrink-0 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all cursor-pointer border border-primary/20 flex items-center justify-center"
                          aria-label={`Ver QR Code de ${paciente.nome}`}
                          title="Ver QR Code"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.875 12h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M13.5 12h.75m-.75 3h.75m-.75 3h.75M19.5 13.5V12M21 16.5v-.75m-3 3v-.75m3 3v-.75" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              {!carregando && pacientesFiltrados.length === 0 && (
                <div className="clinical-card p-12 text-center">
                  <span className="text-5xl block mb-3" aria-hidden="true">🔍</span>
                  <p className="text-text-muted">Nenhum paciente encontrado.</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUNA 2: Detalhes + Alertas */}
          <div className="space-y-4">
            {/* Detalhes do paciente selecionado */}
            {pacienteSelecionado && (
              <div className="clinical-card p-5 space-y-4 slide-up">
                <h3 className="text-lg font-bold text-text-primary border-b border-border pb-3">Detalhes do Paciente</h3>
                {(() => {
                  const p = pacientes.find(pac => pac.id === pacienteSelecionado);
                  if (!p) return null;
                  const etapa = getEtapaLabel(p.etapaAtual);
                  return (
                    <>
                      <div>
                        <p className="text-sm text-text-muted mb-1">Nome</p>
                        <p className="text-base font-semibold text-text-primary">{p.nome}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted mb-1">Etapa Atual</p>
                        <p className="text-base font-semibold text-text-primary">{etapa.label}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted mb-2">Avançar para</p>
                        <select
                          onChange={(e) => {
                            handleAtualizarEtapa(p.id, parseInt(e.target.value));
                            e.target.value = p.etapaAtual;
                          }}
                          defaultValue={p.etapaAtual}
                          className="w-full p-3 rounded-lg bg-surface border border-border text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                        >
                          {ETAPAS.map((et) => (
                            <option key={et.id} value={et.id}>{et.label}</option>
                          ))}
                        </select>
                      </div>
                      {p.precisaAjuda && (
                        <button
                          onClick={() => handleResolverAlerta(p.id)}
                          className="w-full btn-success text-sm cursor-pointer"
                        >
                          ✓ Resolver Alerta
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* Alertas Ativos */}
            <div className="clinical-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-lg font-bold text-text-primary">Alertas Ativos</h3>
                {alertasAtivos.length > 0 && (
                  <span className="w-6 h-6 rounded-full bg-danger text-white text-xs font-bold flex items-center justify-center animate-pulse">
                    {alertasAtivos.length}
                  </span>
                )}
              </div>

              {carregando ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <div key={idx} className="animate-pulse p-3 rounded-lg bg-surface-dark" />
                  ))}
                </div>
              ) : alertasAtivos.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl block mb-2" aria-hidden="true">✅</span>
                  <p className="text-sm text-text-muted">Nenhum alerta ativo</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alertasAtivos.map((paciente) => {
                    const etapa = getEtapaLabel(paciente.etapaAtual);
                    return (
                      <div
                        key={paciente.id}
                        className="p-3 rounded-lg bg-danger/5 border-l-4 border-l-danger hover:bg-danger/10 transition-all cursor-pointer"
                        onClick={() => setPacienteSelecionado(paciente.id)}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-2xl animate-pulse flex-shrink-0" aria-hidden="true">🆘</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-text-primary text-sm truncate">{paciente.nome}</p>
                            <p className="text-xs text-text-secondary mt-0.5">
                              {paciente.idade} anos • {etapa.label}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Stats rápidas */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Em Atendimento', valor: pacientes.filter((p) => p.etapaAtual === 4).length, icone: '👨‍⚕️', cor: 'bg-accent/10 border-accent/30 text-accent' },
                { label: 'Aguardando', valor: pacientes.filter((p) => [3, 6].includes(p.etapaAtual)).length, icone: '⏳', cor: 'bg-warning/10 border-warning/30 text-warning' },
              ].map((stat) => (
                <div key={stat.label} className={`clinical-card-subtle p-4 text-center border ${stat.cor}`}>
                  <span className="text-2xl block mb-1" aria-hidden="true">{stat.icone}</span>
                  <p className="text-2xl font-bold">{stat.valor}</p>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modal QR Code */}
      {qrAberto && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setQrAberto(null)}
        >
          <div
            className="clinical-card p-8 max-w-md w-full space-y-4 fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-text-primary">QR Code do Paciente</h3>
              <button
                onClick={() => setQrAberto(null)}
                className="w-8 h-8 rounded-lg hover:bg-surface-dark flex items-center justify-center text-text-muted hover:text-text-primary transition-all cursor-pointer"
                aria-label="Fechar modal"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <QRCodeSVG
                  value={`${baseUrl}/paciente/${qrAberto}`}
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-text-primary mb-1">
                  {pacientes.find(p => p.id === qrAberto)?.nome}
                </p>
                <p className="text-xs text-text-muted font-mono bg-surface-dark px-3 py-2 rounded-lg break-all">
                  {baseUrl}/paciente/{qrAberto}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
