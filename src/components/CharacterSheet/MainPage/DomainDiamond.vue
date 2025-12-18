<script setup lang="ts">
// Definindo as Props (Entradas) e Emits (Saídas) com TypeScript
interface Props {
  label: string;
  modelValue: number;
  imageSrc?: string; 
}

// Valores padrão
withDefaults(defineProps<Props>(), {
  imageSrc: '/Diamond.png' 
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>();

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', Number(target.value));
};
</script>

<template>
  <div class="diamond-container">
    <img :src="imageSrc" :alt="label" class="diamond-bg" />

    <div class="content-overlay">
      <span class="stat-label">{{ label }}</span>
      <input 
        type="number" 
        :value="modelValue" 
        @input="updateValue" 
        class="stat-input"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.diamond-container {
  position: relative;
  width: 80px; 
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  rotate: -45deg; 
}

.diamond-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 1;
  // Garante que o diamante preto sempre tenha contraste
  filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
}

.content-overlay {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.stat-label {
  position: absolute;
  top: -10px; 
  left: 2px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  
  // CORRIGIDO: Fundo sempre branco e texto sempre preto, sem bordas
  background: #ffffff; 
  color: #000000;
  padding: 1px 4px;
  border: none; // Removido contorno
  white-space: nowrap;
}

.stat-input {
  width: 70%;
  text-align: center;
  font-size: 2.5rem; 
  background: transparent; 
  border: none;
  
  font-family: var(--font-display, 'Caesar Dressing', sans-serif);
  
  // CORRIGIDO: Cor fixa no Ciano Brilhante (Base do tema Dark) para contraste
  color: #ccffff; 
  // Efeito Glow reforçado para visibilidade sobre o diamante preto
  text-shadow: 0 0 8px rgba(0, 204, 204, 0.8), 0 0 2px #000; 

  rotate: 45deg; 
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;

  &:focus {
    outline: none;
  }
}
</style>