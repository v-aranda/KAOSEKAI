
import { defineStore } from 'pinia';
import { ref } from 'vue';
// import api from '../services/api';
import type { User } from '../types';
// import { useUiStore } from './uiStore';

export const useAdminStore = defineStore('admin', () => {
    const users = ref<User[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // --- Actions ---

    async function fetchUsers() {
        isLoading.value = true;
        error.value = null;
        try {
            // MOCK: Se a API não existir, vamos simular
            // const response = await api.get('/users');
            // users.value = response.data;

            // -- SIMULATION MODE START --
            console.warn('Simulating API Call for Users');
            await new Promise(r => setTimeout(r, 600));
            if (users.value.length === 0) {
                users.value = [
                    { id: 1, name: 'Admin Master', email: 'admin@kaosekai.com', role: 'admin', created_at: '2023-01-01' },
                    { id: 2, name: 'Jogador Teste', email: 'player@kaosekai.com', role: 'user', created_at: '2023-02-15' },
                ];
            }
            // -- SIMULATION MODE END --

        } catch (err: any) {
            error.value = err.message || 'Erro ao buscar usuários';
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    }

    async function createUser(userData: Partial<User>) {
        isLoading.value = true;
        try {
            // const response = await api.post('/users', userData);
            // users.value.push(response.data);

            // -- SIMULATION --
            await new Promise(r => setTimeout(r, 500));
            const newUser: User = {
                id: Date.now(),
                name: userData.name || 'Novo Usuário',
                email: userData.email || 'email@teste.com',
                role: userData.role || 'user',
                created_at: new Date().toISOString().split('T')[0]
            };
            users.value.push(newUser);
            return { success: true };

        } catch (err: any) {
            return { success: false, message: err.message };
        } finally {
            isLoading.value = false;
        }
    }

    async function updateUser(id: number, userData: Partial<User>) {
        isLoading.value = true;
        try {
            // await api.put(`/users/${id}`, userData);

            // -- SIMULATION --
            await new Promise(r => setTimeout(r, 500));
            const idx = users.value.findIndex(u => u.id === id);
            if (idx !== -1) {
                users.value[idx] = { ...users.value[idx], ...userData };
            }
            return { success: true };
        } catch (err: any) {
            return { success: false, message: err.message };
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteUser(id: number) {
        isLoading.value = true;
        try {
            // await api.delete(`/users/${id}`);

            // -- SIMULATION --
            await new Promise(r => setTimeout(r, 500));
            users.value = users.value.filter(u => u.id !== id);
            return { success: true };
        } catch (err: any) {
            return { success: false, message: err.message };
        } finally {
            isLoading.value = false;
        }
    }

    return { users, isLoading, error, fetchUsers, createUser, updateUser, deleteUser };
});
