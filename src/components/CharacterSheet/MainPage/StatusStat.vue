<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  label: string;
  current: number;
  max: number;
  color?: string;
  backgroundImageSrc?: string; 
}

const props = withDefaults(defineProps<Props>(), {
  color: 'var(--color-accent)' // Alterado para variável padrão
});

const emit = defineEmits<{
  (e: 'update:current', value: number): void;
  (e: 'update:max', value: number): void;
}>();

const updateCurrent = (e: Event) => {
  const val = Number((e.target as HTMLInputElement).value);
  emit('update:current', val);
};

const updateMax = (e: Event) => {
  const val = Number((e.target as HTMLInputElement).value);
  emit('update:max', val);
};

// Usar a cor padrão do sistema se a cor passada for o azul navy antigo
const containerStyle = computed(() => {
  // Se for o valor padrão antigo, usamos a variável do tema. 
  // Caso contrário, usamos a cor passada (ex: para Vida ou Determinação)
  const finalColor = props.color === '#000080' ? 'var(--color-accent)' : props.color;
  return {
    color: finalColor
  };
});
</script>

<template>
  <div class="stat-container" :style="containerStyle">
    
    <img 
      v-if="backgroundImageSrc" 
      :src="backgroundImageSrc" 
      alt="" 
      class="stat-bg" 
    />

    <div class="stat-content">
      <span class="stat-label">{{ label }}</span>
      
      <input 
        type="number" 
        :value="current" 
        @input="updateCurrent" 
        class="current-input"
      />
      
      <div class="max-circle">
        <span class="parenthesis">Max.</span>
        <input 
          type="number" 
          :value="max" 
          @input="updateMax" 
          class="max-input"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* Adicionando variáveis de fonte (assumindo que foram definidas em _variables.scss) */
// Exemplos de definição para referência (se não existirem, precisam ser criadas):
// --font-primary: 'Share Tech Mono', monospace;
// --font-display: 'Cinzel', serif;
// --font-mono: 'Roboto Mono', monospace;
// --color-text-main: #333; (para tema light)
// --color-text-title: #000; (para tema light)

.stat-container {
  position: relative;
  width: 130px;
  display: flex;
  justify-content: center;
}

.stat-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%; 
  height: auto;
  z-index: 0;
  pointer-events: none;
  // Opacidade diferente para temas, garantindo visibilidade sutil
  [data-theme='light'] & {
    opacity: 0.05; 
  }
  [data-theme='dark'] & {
    opacity: 0.15;
  }
}

.stat-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 1rem; 
  letter-spacing: 2px;
  text-transform: uppercase;
  // Padronizado para a fonte de títulos digitais
  font-family: var(--font-primary, 'Share Tech Mono', monospace);
  margin-bottom: -5px;
  // Padronizado para a cor de títulos/destaque
  color: var(--color-text-title, black);
  font-weight: bold;
}

.current-input {
  font-size: 3rem;
  width: 100%;
  text-align: center;
  color: inherit; // Herda a cor do .stat-container (que vem da prop 'color')
  font-weight: bold;
  // Padronizado para a fonte de números de destaque
  font-family: var(--font-display, 'Cinzel', serif);
  background: transparent;
  border: none;
  padding: 0;
  margin: 5px 0 0 0;
  /* Sombra sutil mantida para o efeito "glow" */
  text-shadow: 0 4px 4px rgba(79, 79, 79, 0.482); 

  &:focus { outline: none; }
  &::-webkit-outer-spin-button, &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  -moz-appearance: textfield;
}

.max-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  // Padronizado para a cor de fundo de elementos (compatível com Dark Mode)
  background: white;
  // Padronizado para a borda principal do tema
  border: 2px solid black;
  border-radius: 20px;
  padding: 0 5px;
  height: 30px;
  min-width: 45px;
  margin-top: -5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);

  .parenthesis {
    font-size: 0.9rem;
    font-weight: bold;
    // Padronizado para a cor de texto principal
    color: var(--color-text-main, black);
  }

  .max-input {
    width: 35px;
    text-align: center;
    font-size: 1.1rem;
    font-weight: bold;
    border: none;
    background: transparent;
    // Padronizado para a fonte monospaced de utilitários
    font-family: var(--font-mono, 'Roboto Mono', monospace);
    // Padronizado para a cor de texto principal
    color: var(--color-text-main, black);
    
    &:focus { 
      outline: none; 
      // Borda inferior usa a cor de borda principal
      border-bottom: 1px solid var(--border-main, black); 
    }
    &::-webkit-outer-spin-button, &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    -moz-appearance: textfield;
  }
}
</style>