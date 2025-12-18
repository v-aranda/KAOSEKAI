<script setup lang="ts">
import { computed } from 'vue';
import { useCharacterStore } from '../../../stores/characterStore';

const store = useCharacterStore();

const totalRd = computed(() => {
  const sources = store.char?.rd?.sources || [];
  return sources.reduce((acc, source) => acc + (Number(source.value) || 0), 0);
});

const finalBlock = computed(() => {
  const bonus = Number(store.char?.rd?.blockBonus) || 0;
  return totalRd.value + bonus;
});
</script>

<template>
  <div class="defense-list-container">
    <h3>DEFESA & RD</h3>
    
    <div class="total-header">
       <span>RD TOTAL: <strong>{{ totalRd }}</strong></span>
    </div>

    <div class="scroll-area">
      <div v-if="!store.char?.rd?.sources?.length" class="empty-state">
        Sem registros
      </div>

      <div v-for="(source, index) in store.char?.rd?.sources" :key="index" class="source-row">
        <input type="text" v-model="source.name" class="source-name-input" placeholder="Fonte..." />
        <input type="number" v-model="source.value" class="source-value-input" />
        
        <button 
          v-if="store.char.rd.sources.length > 1"
          class="remove-btn" 
          @click="store.removeRdSource(index)"
        >×</button>
      </div>
    </div>

    <button class="add-btn" @click="store.addRdSource()">+ ADICIONAR RD</button>

    <div class="block-footer">
      <div class="block-input-group">
        <label>BÔNUS BLOQUEIO</label>
        <input type="number" v-model="store.char.rd.blockBonus" class="block-value-input" />
      </div>
      
      <div class="block-result">
        <span class="res-label">BLOQUEIO</span>
        <span class="res-value">{{ finalBlock }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.defense-list-container {
  width: 100%;
  box-sizing: border-box; // Garante que padding não aumente a largura
  background: rgba(255, 255, 255, 0.95); 
  padding: 10px;
  border-right: 2px solid #000; 
  border-bottom-right-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
  font-family: 'Share Tech Mono', monospace;
  overflow: hidden; // Corta qualquer vazamento acidental

  h3 { 
    font-size: 0.9rem; 
    border-bottom: 2px solid black; 
    margin: 0 0 10px 0;
    text-align: center;
  }
}

.total-header {
  text-align: right;
  font-size: 0.7rem;
  margin-bottom: 5px;
  strong { color: #990000; font-size: 0.9rem; }
}

.scroll-area {
  max-height: 120px;
  overflow-y: auto;
  overflow-x: hidden; // Bloqueia o scroll lateral no container de lista
  padding-right: 2px;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #000; border-radius: 2px; }
}

.empty-state { text-align: center; font-size: 0.65rem; color: #888; margin-bottom: 5px; }

.source-row {
  display: flex; 
  align-items: center; 
  gap: 4px; 
  margin-bottom: 4px; 
  border-bottom: 1px dotted #ccc;
  width: 100%; // Força a linha a respeitar o pai
  box-sizing: border-box;

  &:hover .remove-btn { opacity: 1; }

  .source-name-input {
    flex: 1; // Ocupa o espaço restante sem empurrar
    min-width: 0; // Essencial para que o flex-item possa encolher
    border: none; 
    background: transparent; 
    font-size: 0.75rem;
    font-weight: bold; 
    text-transform: uppercase; 
    color: #333;
    &:focus { outline: none; }
  }

  .source-value-input {
    width: 35px; // Largura fixa para o valor
    flex-shrink: 0; // Impede o input de valor de sumir
    text-align: right; 
    font-weight: bold; 
    color: #000080; 
    font-size: 0.9rem;
    border: none; 
    background: transparent;
    &::-webkit-outer-spin-button, &::-webkit-inner-spin-button { -webkit-appearance: none; }
  }

  .remove-btn {
    background: none; border: none; color: red; cursor: pointer;
    font-size: 1rem; opacity: 0; transition: opacity 0.2s;
    flex-shrink: 0;
  }
}

.add-btn {
  width: 100%; margin-top: 8px; background: black; color: white; border: none;
  font-size: 0.65rem; padding: 5px; cursor: pointer;
  text-transform: uppercase;
  &:hover { background: #00cccc; color: black; }
}

.block-footer {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;

  .block-input-group {
    display: flex;
    flex-direction: column;
    min-width: 0;
    label { font-size: 0.55rem; font-weight: bold; white-space: nowrap; }
    input { 
        width: 100%; max-width: 45px; border: none; border-bottom: 1px solid #000; 
        background: transparent; text-align: center; font-weight: bold;
    }
  }

  .block-result {
    background: #000;
    color: #00cccc;
    padding: 3px 6px;
    text-align: center;
    border-radius: 2px;
    flex-shrink: 0;

    .res-label { display: block; font-size: 0.5rem; color: white; }
    .res-value { font-size: 1.2rem; font-weight: bold; }
  }
}
</style>