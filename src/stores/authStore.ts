import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token') || '');
  const user = ref(null);

  async function login(email: string, password: string) {
    try {
      const response = await api.post('/login', { email, password });
      
      // Salva o token e atualiza estado
      token.value = response.data.access_token;
      user.value = response.data.user;
      localStorage.setItem('auth_token', token.value);
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao entrar' 
      };
    }
  }

  function logout() {
    token.value = '';
    user.value = null;
    localStorage.removeItem('auth_token');
    // Opcional: Chamar api.post('/logout') se quiser invalidar no back
  }

  return { token, user, login, logout };
});