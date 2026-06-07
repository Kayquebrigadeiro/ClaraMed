import api from './api';
import { PACIENTES_MOCK } from '../data/mockData';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Serviço de Paciente — Consome endpoints reais do backend Java.
 * Prompt 2: Integração completa com API REST + fallback mock.
 */
export const pacienteService = {
  /**
   * Busca os detalhes de um paciente específico
   */
  getPaciente: async (pacienteId) => {
    if (useMock) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const paciente = PACIENTES_MOCK.find((p) => p.id === pacienteId);
          if (paciente) {
            resolve({ ...paciente });
          } else {
            reject(new Error('Paciente não encontrado.'));
          }
        }, 500);
      });
    }

    try {
      const response = await api.get(`/pacientes/${pacienteId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao buscar paciente', { cause: error });
    }
  },

  /**
   * Envia um alerta de "Preciso de ajuda"
   */
  postAlerta: async (pacienteId) => {
    if (useMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const paciente = PACIENTES_MOCK.find((p) => p.id === pacienteId);
          if (paciente) {
            paciente.precisaAjuda = true;
          }
          resolve({ success: true, message: 'Alerta enviado com sucesso.' });
        }, 400);
      });
    }

    try {
      const response = await api.post(`/pacientes/${pacienteId}/ajuda`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.erro || 'Erro ao enviar alerta', { cause: error });
    }
  },
};

export default pacienteService;
