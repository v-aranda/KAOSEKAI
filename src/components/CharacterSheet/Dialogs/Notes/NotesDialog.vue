<script setup lang="ts">
import { ref } from 'vue';
import { useCharacterStore } from '../../../../stores/characterStore';
import OriginEditor from './OriginEditor.vue';
import InvestigationBoard from './InvestigationBoard.vue';

// --- ÍCONES (GAME ICONS) ---
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { GiBookmarklet, GiArchiveResearch } from "oh-vue-icons/icons";

addIcons(GiBookmarklet, GiArchiveResearch);

interface Props {
  isOpen: boolean;
}

defineProps<Props>();
const emit = defineEmits<{ (e: 'close'): void }>();

const store = useCharacterStore();
const activeTab = ref<'ORIGEM' | 'INVESTIGACAO'>('INVESTIGACAO');
</script>

<template>
  <div v-if="isOpen" class="dialog-overlay" @click.self="$emit('close')">
    <div class="dialog-container">
      
      <div class="dialog-header">
        <div class="tabs">
          <button 
            :class="['tab-btn', { active: activeTab === 'INVESTIGACAO' }]" 
            @click="activeTab = 'INVESTIGACAO'"
          >
            <OhVueIcon name="gi-archive-research" scale="1" />
            MURAL DE INVESTIGAÇÃO
          </button>
          
          <button 
            :class="['tab-btn', { active: activeTab === 'ORIGEM' }]" 
            @click="activeTab = 'ORIGEM'"
          >
            <OhVueIcon name="gi-bookmarklet" scale="1" />
            DIÁRIO
          </button>
        </div>
        
        <button class="close-btn" @click="$emit('close')">X</button>
      </div>

      <div class="dialog-body">
        <div v-if="activeTab === 'ORIGEM'" class="tab-content-wrapper">
          <OriginEditor v-model="store.char.origin" />
        </div>

        <div v-if="activeTab === 'INVESTIGACAO'" class="tab-content-wrapper">
          <InvestigationBoard />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
.dialog-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.7); z-index: 999;
  display: flex; justify-content: center; align-items: center;
  backdrop-filter: blur(2px);
}

.dialog-container {
  background: var(--bg-app); width: 95%; max-width: 1100px; height: 90%;
  border: 4px solid var(--border-main); box-shadow: 10px 10px 0px var(--shadow-main);
  display: flex; flex-direction: column;
}

.dialog-header {
  background: var(--bg-card); border-bottom: 4px solid var(--border-main);
  display: flex; justify-content: space-between; align-items: flex-end;
  padding: 10px 10px 0 10px;
}

.tabs { display: flex; gap: 5px; }

.tab-btn {
  background: var(--bg-app); color: var(--text-secondary); border: 2px solid var(--border-main); 
  padding: 8px 15px; font-family: 'Share Tech Mono', monospace; font-weight: bold;
  cursor: pointer; border-bottom: none; border-top-left-radius: 5px; border-top-right-radius: 5px; 
  transition: all 0.2s; display: flex; align-items: center; gap: 8px;

  &.active {
    background: var(--border-main); color: var(--bg-card); transform: translateY(2px);
  }

  &:hover:not(.active) { background: var(--bg-card); color: var(--text-primary); }
}

.close-btn {
  background: none; border: none; color: var(--text-primary); 
  font-size: 1.5rem; font-weight: bold; cursor: pointer; padding: 0 10px;
  font-family: 'Share Tech Mono', monospace;
  &:hover { color: var(--color-error); transform: scale(1.2); }
}

.dialog-body { flex-grow: 1; overflow: hidden; position: relative; background: var(--bg-app); }
.tab-content-wrapper { width: 100%; height: 100%; }
</style>