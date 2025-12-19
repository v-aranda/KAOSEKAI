<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useUiStore } from '../stores/uiStore';

const auth = useAuthStore();
const ui = useUiStore();
const email = ref('vinicius@kaosekai.com');
const password = ref('');
const errorMsg = ref('');

const handleLogin = async () => {
    errorMsg.value = '';
    
    // ui.isLoading é gerenciado pelo Axios Interceptor
    const result = await auth.login(email.value, password.value);
    
    if (!result.success) {
        errorMsg.value = result.message || 'Falha na autenticação';
    }
};
</script>

<template>
    <div class="login-wrapper">
        <div class="login-container">
            <!-- IMAGEM CIRCLE (DECORATIVA) -->
            <div class="circle-decoration" aria-hidden="true">
                <img src="/Circle.png" alt="" class="circle-image" />
            </div>

            <!-- CARD FORMULÁRIO -->
            <div class="login-card">
                <div class="login-header">
                    <h1>KAOSEKAI</h1>
                    <p>BEM VINDO AO CAOS</p>
                </div>

                <div class="form-group">
                    <label>E-MAIL</label>
                    <input v-model="email" type="email" placeholder="seu@email.com" :disabled="ui.isLoading" />
                </div>

                <div class="form-group">
                    <label>SENHA</label>
                    <input v-model="password" type="password" placeholder="••••••" @keyup.enter="handleLogin" :disabled="ui.isLoading" />
                </div>

                <div v-if="errorMsg" class="error-alert">{{ errorMsg }}</div>

                <button class="btn-primary" @click="handleLogin" :disabled="ui.isLoading">
                    {{ ui.isLoading ? 'ENTRANDO...' : 'ENTRAR' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
/* WRAPPER */
.login-wrapper {
    /* usar viewport dinâmico para evitar overflow no mobile */
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-app);
    background-image: url('/login-bg.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-blend-mode: soft-light;
    padding: 0;
    box-sizing: border-box;
    overflow-x: hidden;
    width: 100vw;
    position: relative;
}

/* overlay sutil para melhorar contraste */
.login-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.15);
    pointer-events: none;
}

/* CONTAINER: mobile 1 coluna, desktop 60/40 */
.login-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    max-width: 100%;
    padding: 0;
    position: relative;
    z-index: 1;
}

@media (min-width: 1024px) {
    .login-container {
        grid-template-columns: 60% 40%;
        gap: 40px;
    }
}

/* ARTE CIRCLE */
.circle-decoration {
    display: flex;
    align-items: center;
    justify-content: center;
}

.circle-image {
    /* reduzir dimensões em mobile para caber sem scroll */
    width: min(75vw, 360px);
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
    max-height: 50vh; /* limita a altura relativa à viewport */
}

@media (min-width: 1024px) {
    .circle-image {
        width: 100%;
        max-height: 60vh; /* ocupar ~60% da tela em desktop */
    }
}

/* CARD LOGIN */
.login-card {
    width: calc(100vw - 20px);
    max-width: 420px;
    background: var(--bg-card);
    padding: 20px;
    border: 3px solid var(--border-main);
    box-shadow: 3px 3px 0px var(--shadow-main);
    border-radius: 0;
    text-align: left;
    justify-self: center;
    box-sizing: border-box;
}

@media (min-width: 1024px) {
    .login-card {
        max-width: 500px;
        padding: 36px;
    }
}

/* HEADER */
.login-header {
    text-align: center;
    margin-bottom: 16px;
    text-transform: uppercase;
}

.login-header h1 {
    margin: 0;
    font-size: 1.8rem;
    color: var(--color-accent);
    letter-spacing: 2px;
    line-height: 1.2;
}

.login-header p {
    margin-top: 8px;
    color: var(--text-secondary);
    font-weight: bold;
    letter-spacing: 1px;
    font-size: 0.85rem;
}

/* FORM */
.form-group { margin-bottom: 16px; }

.form-group label {
    display: block;
    font-size: 0.85rem;
    font-weight: bold;
    color: var(--text-primary);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

input {
    width: 100%;
    padding: 12px 14px;
    border: 2px solid var(--border-main);
    border-radius: 0;
    font-size: 1rem;
    background: var(--bg-app);
    color: var(--text-primary);
    font-family: inherit;
    box-sizing: border-box;
    transition: all 0.2s ease;
    -webkit-appearance: none; /* remove estilo padrão do iOS */
    -moz-appearance: none;

    &:focus {
        outline: none;
        border-color: var(--color-accent);
        box-shadow: 2px 2px 0px var(--color-accent);
    }
    &:disabled {
        background: var(--bg-footer);
        cursor: not-allowed;
        color: var(--text-secondary);
        opacity: 0.6;
    }
}

/* BOTÃO */
.btn-primary {
    width: 100%;
    padding: 12px;
    margin-top: 6px;
    background-color: var(--color-accent);
    color: var(--text-on-light);
    border: 2px solid var(--border-main);
    box-shadow: 3px 3px 0px var(--shadow-main);
    border-radius: 0;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.2s ease;

    &:hover {
        background-color: var(--color-accent-dark);
        color: var(--text-on-light);
        transform: translate(-1px, -1px);
    }
    &:active {
        transform: translate(2px, 2px);
        box-shadow: 0px 0px 0px var(--shadow-main);
    }
    &:disabled {
        background-color: var(--bg-footer);
        color: var(--text-secondary);
        cursor: not-allowed;
        box-shadow: none;
        transform: none;
    }
}

/* ALERTA */
.error-alert {
    background: var(--color-error);
    color: white;
    padding: 12px;
    border-radius: 0;
    font-size: 0.85rem;
    margin-bottom: 16px;
    text-align: center;
    font-weight: bold;
    border: 2px solid var(--border-main);
    animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
}
</style>