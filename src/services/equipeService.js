import api from './api';
import { PACIENTES_MOCK, CREDENCIAIS_MOCK } from '../data/mockData';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

const persistSession = (user, token) => {
  localStorage.setItem('claramed_token', token);
  localStorage.setItem('claramed_user', JSON.stringify(user));
};

/**
 * Serviço de Equipe Médica — Consome endpoints reais do backend Java.
 * Prompt 2: Integração completa com API REST + fallback mock.
 */
export const equipeService = {
  /**
   * Realiza autenticação da equipe médica
   */
  login: async (credenciais) => {
    if (useMock) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const { email, senha } = credenciais;
          if (email === CREDENCIAIS_MOCK.email && senha === CREDENCIAIS_MOCK.senha) {
            const user = {
              nome: CREDENCIAIS_MOCK.nome,
              email: CREDENCIAIS_MOCK.email,
              cargo: CREDENCIAIS_MOCK.cargo,
            };
            const token = 'mocked_jwt_token_for_claramed';
            persistSession(user, token);
            resolve({ user, token });
          } else {
            reject(new Error('E-mail ou senha inválidos.'));
          }
        }, 800);
      });
    }

    try {
      const response = await api.post('/auth/login', credenciais);
      persistSession(response.data.user, response.data.token);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'E-mail ou senha inválidos', { cause: error });
    }
  },

  /**
   * Obtém a lista completa de pacientes
   */
  getPacientes: async () => {
    if (useMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([...PACIENTES_MOCK]);
        }, 600);
      });
    }

    try {
      const response = await api.get('/equipe/pacientes');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao buscar pacientes', { cause: error });
    }
  },

  /**
   * Obtém os alertas ativos
   */
  getAlertas: async () => {
    if (useMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const alertas = PACIENTES_MOCK.filter((p) => p.precisaAjuda);
          resolve(alertas);
        }, 500);
      });
    }

    try {
      const response = await api.get('/equipe/alertas');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao buscar alertas', { cause: error });
    }
  },

  /**
   * Marca o pedido de ajuda como resolvido
   */
  resolverAlerta: async (pacienteId) => {
    if (useMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const paciente = PACIENTES_MOCK.find((p) => p.id === pacienteId);
          if (paciente) {
            paciente.precisaAjuda = false;
          }
          resolve({ success: true, id: pacienteId });
        }, 400);
      });
    }

    try {
      const response = await api.delete(`/equipe/alertas/${pacienteId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao resolver alerta', { cause: error });
    }
  },

  /**
   * Atualiza a etapa do atendimento
   */
  atualizarEtapa: async (pacienteId, etapaId) => {
    if (useMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const paciente = PACIENTES_MOCK.find((p) => p.id === pacienteId);
          if (paciente) {
            paciente.etapaAtual = etapaId;
          }
          resolve({ ...paciente });
        }, 400);
      });
    }

    try {
      const response = await api.put(`/equipe/pacientes/${pacienteId}/etapa`, { etapaId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao atualizar etapa', { cause: error });
    }
  },
};

export default equipeService;
