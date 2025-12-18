<script setup lang="ts">
import { computed } from 'vue';
import { useCharacterStore } from '../../../stores/characterStore';
import type { PowerType } from '../../../types';

interface Props {
  isOpen: boolean;
  title: string;
  target: 'abilities' | 'feats'; 
  colorTheme?: string;
}

const props = withDefaults(defineProps<Props>(), {
  colorTheme: 'var(--color-accent)' // Agora aceita variáveis CSS
});

const emit = defineEmits<{ (e: 'close'): void }>();

const store = useCharacterStore();
const types: PowerType[] = ['Ação', 'Reação', 'Passivo', 'Técnica'];

const powerList = computed(() => store.char[props.target]);

const addPower = () => { store.addPower(props.target); };
const removePower = (index: number) => { store.removePower(props.target, index); };
</script>

<template>
  <div v-if="isOpen" class="dialog-overlay" @click.self="$emit('close')">
    <div class="dialog-container">
      
      <div class="dialog-header">
        <h2 :style="{ color: colorTheme }">{{ title }}</h2>
        <button class="close-btn" @click="$emit('close')">FECHAR [X]</button>
      </div>

      <div class="dialog-body">
        <div v-if="powerList.length === 0" class="empty-state">
          Nenhum registro encontrado.
        </div>

        <div v-for="(power, index) in powerList" :key="index" class="power-card" :style="{ borderLeftColor: colorTheme }">
          <div class="card-header">
            <div class="top-row">
              <input v-model="power.name" placeholder="NOME" class="input-name"/>
              <button class="remove-btn" @click="removePower(index)">×</button>
            </div>
            
            <div class="meta-row">
              <select v-model="power.type" class="type-select">
                <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
              </select>
              <div class="cost-wrapper">
                <label>CUSTO:</label>
                <input v-model="power.cost" placeholder="-" class="cost-input"/>
              </div>
            </div>
          </div>
          <textarea v-model="power.description" placeholder="Descrição..." class="desc-input"></textarea>
        </div>
      </div>

      <div class="dialog-footer">
        <button class="add-btn" @click="addPower" :style="{ background: colorTheme }">
          + ADICIONAR NOVO
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dialog-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.8); z-index: 999;
  display: flex; justify-content: center; align-items: center;
  backdrop-filter: blur(4px);
}

.dialog-container {
  background: var(--bg-app); width: 90%; max-width: 650px; height: 85%;
  border: 4px solid var(--border-main); box-shadow: 10px 10px 0px var(--shadow-main);
  display: flex; flex-direction: column;
}

.dialog-header {
  padding: 15px; background: var(--bg-card); border-bottom: 4px solid var(--border-main);
  display: flex; justify-content: space-between; align-items: center;
  h2 { margin: 0; font-family: 'Share Tech Mono', monospace; text-transform: uppercase; font-weight: 700; letter-spacing: 2px; }
  .close-btn { 
    background: transparent; border: 2px solid var(--border-main); color: var(--text-primary);
    font-family: 'Share Tech Mono', monospace; padding: 5px 12px; cursor: pointer;
    &:hover { background: var(--border-main); color: var(--bg-app); }
  }
}

.dialog-body { flex-grow: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 15px; }

.power-card { 
  background: var(--bg-card); border: 1px solid var(--border-main); padding: 15px; 
  border-left: 6px solid var(--border-main); display: flex; flex-direction: column; gap: 8px;
}

.input-name { 
  width: 100%; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; font-weight: bold; 
  background: transparent; border: none; outline: none; text-transform: uppercase; color: var(--text-primary);
}

.remove-btn { background: none; border: none; font-size: 1.5rem; color: var(--text-secondary); cursor: pointer; &:hover { color: var(--color-error); } }

.meta-row { display: flex; gap: 15px; align-items: center; }
.type-select { padding: 5px; font-family: 'Share Tech Mono', monospace; background: var(--bg-app); color: var(--text-primary); border: 1px solid var(--border-main); }
.cost-wrapper { display: flex; gap: 5px; align-items: center; font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; color: var(--text-secondary); }
.cost-input { width: 60px; border: none; border-bottom: 1px dashed var(--border-main); background: transparent; color: var(--color-error); text-align: center; font-weight: bold; }
.desc-input { width: 100%; min-height: 80px; border: 1px solid var(--border-main); background: var(--bg-app); color: var(--text-primary); padding: 8px; font-family: 'Roboto Mono', monospace; resize: vertical; }

.dialog-footer { padding: 15px; border-top: 1px solid var(--border-main); background: var(--bg-card); }
.add-btn { width: 100%; padding: 12px; color: var(--bg-card); border: none; font-family: 'Share Tech Mono', monospace; font-weight: bold; cursor: pointer; text-transform: uppercase; }
</style>