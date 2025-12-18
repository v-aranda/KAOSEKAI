<script setup lang="ts">
import { ref, computed } from "vue";
import { useCharacterStore } from "../../../stores/characterStore";

const store = useCharacterStore();

const STATUS_DB = [
  { name: "SANGRANDO", desc: "Perde sangue vital. Início do turno: 3 de Dano Fixo (ignora RD). Persiste até cura mágica ou Estancar (Medicina CD 15)." },
  { name: "AGARRADO", desc: "Deslocamento 0u. Ações de Corpo são Desafiadoras (-5). Ataques contra você têm Bônus (+2)." },
  { name: "CAÍDO", desc: "Fica DESPREVENIDO. Ações de Corpo são Difíceis (-5). Ataques à distância contra você são Desafiadores (-2). Levantar custa metade do movimento." },
  { name: "QUEIMANDO", desc: "Início do turno: 1d6 Dano de Fogo. Gasta Ação Padrão para apagar." },
  { name: "DESPREVENIDO", desc: "Não usa Reações. Ataques contra você têm Bônus (+3)." },
  { name: "CEGO", desc: "Não vê. Fica DESPREVENIDO. Falha em testes de visão. Atacar é Difícil (-5) e tem 50% chance de falha." },
  { name: "SURDO", desc: "Falha em Percepção (audição). Desvantagem (-2) na Iniciativa. Imune a efeitos sonoros." },
  { name: "APAIXONADO", desc: "Soma Dado de Amor à Determinação Máxima e Atual." },
  { name: "CORAÇÃO PARTIDO", desc: "Remove Apaixonado. Fica ABALADO (-2) até recuperar 1 Det ou fim da cena. Sofre Dano na Determinação." },
  { name: "ATORDOADO", desc: "Fica DESPREVENIDO, não Age nem Move. Falha auto em Corpo e Sentidos." },
  { name: "ABALADO", desc: "Medo. Testes são Desafiadores (-2). Se sofrer novamente, vira APAVORADO." },
  { name: "APAVORADO", desc: "Medo. Testes são Difíceis (-5). Deve fugir da fonte." },
];

const selectedStatus = ref("");
const activeDesc = ref("");

const availableStatuses = computed(() => {
  // Proteção contra store carregando
  const currentConditions = store.char?.conditions || [];
  return STATUS_DB.filter((s) => !currentConditions.includes(s.name));
});

const handleAdd = () => {
  if (!selectedStatus.value) return;
  store.addCondition(selectedStatus.value);
  selectedStatus.value = "";
};

const handleRemove = (index: number) => {
  activeDesc.value = ""; // Limpa o tooltip ao remover para evitar bugs visuais
  if (typeof store.removeCondition === 'function') {
    store.removeCondition(index);
  } else {
    console.error("Erro: A função removeCondition não foi encontrada no CharacterStore!");
  }
};

const getDescription = (name: string) => {
  return STATUS_DB.find((s) => s.name === name)?.desc || "";
};

const onMouseEnter = (name: string) => { activeDesc.value = getDescription(name); };
const onMouseLeave = () => { activeDesc.value = ""; };
</script>

<template>
  <div class="status-list-container">
    <h3>STATUS</h3>

    <div v-if="activeDesc" class="floating-tooltip">
      {{ activeDesc }}
    </div>

    <div class="scroll-area">
      <div class="active-list">
        <div
          v-for="(statusName, index) in store.char.conditions"
          :key="index"
          class="status-item"
          @mouseenter="onMouseEnter(statusName)"
          @mouseleave="onMouseLeave"
        >
          <span class="status-name">{{ statusName }}</span>
          <button class="remove-btn" @click.stop="handleRemove(index)">×</button>
        </div>

        <div v-if="!store.char.conditions || store.char.conditions.length === 0" class="empty-msg">Normal</div>
      </div>
    </div>

    <div class="add-controls">
      <select v-model="selectedStatus" class="status-select">
        <option value="" disabled>+ Adicionar</option>
        <option v-for="s in availableStatuses" :key="s.name" :value="s.name">
          {{ s.name }}
        </option>
      </select>
      <button v-if="selectedStatus" @click="handleAdd" class="confirm-btn">OK</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* Estilos mantidos conforme sua solicitação original para preservar a UI */
.status-list-container {
  width: 100%;
  background: rgba(255, 255, 255, 0.6);
  padding: 10px;
  border-left: 2px solid #000;
  position: relative;
  overflow: visible;

  h3 {
    font-size: 0.8rem;
    color: #555;
    margin: 0 0 8px 0;
    font-family: "Share Tech Mono", monospace;
    text-transform: uppercase;
    border-bottom: 1px dotted #999;
  }
}

.floating-tooltip {
  position: absolute;
  right: 105%; 
  top: 0;
  width: 200px;
  background: #222;
  color: #fff;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  z-index: 9999;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  font-family: sans-serif;
  line-height: 1.3;
  pointer-events: none;

  &::after {
    content: "";
    position: absolute;
    top: 15px;
    left: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent transparent #222;
  }
}

.scroll-area {
  max-height: 75px;
  overflow-y: auto;
  padding-right: 5px;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #000; border-radius: 2px; }
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  padding: 2px 5px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  cursor: help;
  &:hover { background: rgba(0, 0, 0, 0.1); }

  .status-name {
    font-size: 0.75rem;
    font-weight: bold;
    color: #c2002f;
    font-family: "Roboto Mono", monospace;
  }

  .remove-btn {
    background: none;
    border: none;
    color: #999;
    font-weight: bold;
    cursor: pointer;
    font-size: 1.2rem;
    line-height: 0.8;
    &:hover { color: red; }
  }
}

.empty-msg { font-size: 0.7rem; color: #888; font-style: italic; margin-bottom: 10px; }
.add-controls { display: flex; gap: 2px; margin-top: 5px; }
.status-select {
  width: 100%; border: none; background: transparent; font-size: 0.7rem;
  font-family: "Share Tech Mono", monospace; color: #444; border-bottom: 1px dashed #ccc;
  cursor: pointer; &:focus { outline: none; border-bottom: 1px solid black; }
}
.confirm-btn {
  border: 1px solid #ccc; background: white; font-size: 0.6rem; cursor: pointer;
  border-radius: 2px; &:hover { background: #eee; }
}
</style>