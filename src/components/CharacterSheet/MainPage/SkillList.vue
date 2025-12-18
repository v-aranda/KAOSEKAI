<script setup lang="ts">
import { useCharacterStore } from '../../../stores/characterStore';

const store = useCharacterStore();
</script>

<template>
  <div class="skills-list-container">
    <h3>COMPETÊNCIAS</h3>
    
    <div class="scroll-area">
      <div v-if="store.char.skills.length === 0" class="empty-state">
        Sem registros
      </div>

      <div v-for="(skill, index) in store.char.skills" :key="index" class="skill-row">
        <input type="text" v-model="skill.name" class="skill-name-input" placeholder="Nome..." />
        <input type="number" v-model="skill.value" class="skill-value-input" />
        
        <button class="remove-btn" @click="store.removeSkill(index)" title="Remover">×</button>
      </div>
    </div>

    <button class="add-btn" @click="store.addSkill()">+ ADICIONAR</button>
  </div>
</template>

<style scoped lang="scss">
.skills-list-container {
  width: 100%;
  background: rgba(255,255,255,0.9); 
  padding: 10px;
  border-left: 2px solid #000;
  border-bottom-left-radius: 10px;
  box-shadow: -2px 2px 5px rgba(0,0,0,0.1);

  h3 { 
    font-size: 0.9rem; 
    border-bottom: 2px solid black; 
    margin: 0 0 10px 0;
    text-align: center;
    font-family: 'Share Tech Mono', monospace;
  }
}

.scroll-area {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 5px;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #000; border-radius: 2px; }
}

.empty-state { text-align: center; font-size: 0.7rem; color: #888; margin-bottom: 10px; font-style: italic; }

.skill-row {
  display: flex; align-items: center; gap: 5px; margin-bottom: 4px; border-bottom: 1px dotted #ccc; padding-bottom: 2px;
  &:hover .remove-btn { opacity: 1; }

  .skill-name-input {
    flex-grow: 1; width: 100%; border: none; background: transparent; font-size: 0.85rem;
    font-weight: bold; text-transform: uppercase; color: #333; font-family: 'Share Tech Mono', monospace; padding: 0;
    &:focus { outline: none; border-bottom: 1px solid blue; }
  }

  .skill-value-input {
    width: 25px; text-align: right; font-weight: bold; color: #000080; font-size: 1rem;
    border: none; background: transparent; padding: 0; font-family: 'Roboto Mono', monospace;
    &:focus { outline: none; border-bottom: 1px solid blue; }
    &::-webkit-outer-spin-button, &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    -moz-appearance: textfield;
  }

  .remove-btn {
    background: none; border: none; color: red; font-weight: bold; cursor: pointer;
    font-size: 1rem; padding: 0; width: 15px; opacity: 0; transition: opacity 0.2s;
  }
}

.add-btn {
  width: 100%; margin-top: 10px; background: black; color: white; border: none;
  font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; padding: 5px; cursor: pointer;
  text-transform: uppercase; transition: all 0.2s;
  &:hover { background: #000080; box-shadow: 2px 2px 0px rgba(0,255,255,0.5); }
}
</style>