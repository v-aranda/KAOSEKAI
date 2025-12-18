<script setup lang="ts">
import { useUiStore } from '../../stores/uiStore';

const ui = useUiStore();
</script>

<template>
    <Transition name="fade-overlay">
        <div v-if="ui.isLoading" class="loader-overlay">
            <div class="loader-box">
                <v-icon name="fa-spinner" class="spinner" scale="2.5" animation="spin" />
                <p>CARREGANDO...</p>
            </div>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
.loader-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.95); /* Fundo preto quase sólido */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10002; /* Acima de tudo (Dialog é 10001, Toast é 10000) */
}

.loader-box {
    background: #fff;
    border: 3px solid #000;
    padding: 30px 40px;
    box-shadow: 8px 8px 0px #000;
    text-align: center;
    font-family: 'Share Tech Mono', monospace;
    color: #000;
    
    .spinner {
        color: #000;
        margin-bottom: 15px;
    }

    p {
        margin: 0;
        font-weight: bold;
        letter-spacing: 2px;
    }
}

/* Transições para o Overlay */
.fade-overlay-enter-active,
.fade-overlay-leave-active {
    transition: opacity 0.3s ease;
}

.fade-overlay-enter-from,
.fade-overlay-leave-to {
    opacity: 0;
}
</style>