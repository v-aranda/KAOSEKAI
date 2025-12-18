<script setup lang="ts">
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { GiBackpack, GiNotebook } from "oh-vue-icons/icons";

// Registrando apenas os ícones necessários
addIcons(GiBackpack, GiNotebook);

interface Props {
  modelValue: string; // Nome do Jogador
  level?: number;     // Nível do Personagem
  backgroundSrc?: string;
}

const props = withDefaults(defineProps<Props>(), {
  level: 1
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:level', value: number): void;
  (e: 'open:inventory'): void;
  (e: 'open:notes'): void;
}>();

// Função para validar o nível entre 1 e 10
const handleLevelInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let val = parseInt(target.value);
  
  if (isNaN(val) || val < 1) val = 1;
  if (val > 10) val = 10;
  
  emit('update:level', val);
};
</script>

<template>
  <div class="header-container">
    <img 
      v-if="backgroundSrc" 
      :src="backgroundSrc" 
      alt="" 
      class="header-bg" 
    />

    <div class="aux-menu">
      <div class="icon-wrapper" @click="$emit('open:inventory')" title="Inventário">
        <OhVueIcon name="gi-backpack" class="icon" scale="1.8" />
        <span class="icon-label">MOCHILA</span>
      </div>

      <div class="icon-wrapper" @click="$emit('open:notes')" title="Anotações">
        <OhVueIcon name="gi-notebook" class="icon" scale="1.8" />
        <span class="icon-label">DIÁRIO</span>
      </div>

      <div class="level-wrapper">
        <span class="lv-prefix">LV.</span>
        <input 
          type="number" 
          :value="level" 
          @input="handleLevelInput"
          min="1" 
          max="10" 
          class="level-input"
        />
      </div>
    </div>

    <div class="top-line"></div>
    
    <input 
      type="text" 
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="char-name-input" 
      placeholder="JOGADOR" 
    />
    
    <span class="label-footer">NOME DO JOGADOR</span>
  </div>
</template>

<style scoped lang="scss">
.header-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 220px;
  position: relative;
  z-index: 20;
  padding: 5px 0;
  color: var(--text-primary); // Adaptável ao tema
}

.header-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  object-fit: cover; z-index: 0; opacity: 0.1; pointer-events: none;
}

.aux-menu {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 8px;
  position: relative;
  z-index: 2;
}

.icon-wrapper {
  position: relative;
  cursor: pointer;
  color: black;
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-error);
    transform: translateY(-2px);
    .icon-label { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
}

/* Tooltip Labels */
.icon-label {
  position: absolute;
  top: 100%; left: 50%;
  transform: translateX(-50%) translateY(-5px);
  background: black;
  color: white;
  padding: 2px 5px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  white-space: nowrap;
  opacity: 0;
  transition: all 0.2s ease;
  pointer-events: none;
  z-index: 10;
}

/* Estilização do Level */
.level-wrapper {
  display: flex;
  align-items: baseline;
  background: var(--border-main);
  color: var(--bg-card);
  padding: 2px 8px;
  border-radius: 2px;
  font-family: 'Share Tech Mono', monospace;

  .lv-prefix { font-size: 0.7rem; font-weight: bold; margin-right: 3px; }
  .level-input {
    background: transparent;
    border: none;
    color: inherit;
    width: 25px;
    font-size: 1.1rem;
    font-weight: bold;
    text-align: center;
    font-family: inherit;
    &:focus { outline: none; }
    &::-webkit-outer-spin-button, &::-webkit-inner-spin-button { -webkit-appearance: none; }
  }
}

.top-line {
  width: 100%;
  height: 3px;
  background: var(--border-main);
  margin-bottom: 5px;
  // Efeito Glitch sutil adaptado ao tema
  box-shadow: 2px 0 0 var(--color-accent); 
}

.char-name-input {
  width: 100%;
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
  font-family: 'Share Tech Mono', monospace;
  text-transform: uppercase;
  background: transparent;
  border: none;
  color: black;
  &:focus { outline: none; border-bottom: 1px dashed var(--color-accent); }
}

.label-footer {
  font-size: 0.6rem;
  letter-spacing: 3px;
  font-family: 'Share Tech Mono', monospace;
  color: var(--text-secondary);
  font-weight: bold;
  text-transform: uppercase;
}
</style>