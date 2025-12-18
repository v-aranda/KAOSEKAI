<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useCharacterStore } from '../../../../stores/characterStore';
import { OhVueIcon } from "oh-vue-icons";
import type { ItemType } from '../../../../types';

// Componentes
import ToastNotification from '../../../Utils/ToastNotification.vue';

interface Props {
  isOpen: boolean;
}

defineProps<Props>();
const emit = defineEmits<{ (e: 'close'): void }>();

const store = useCharacterStore();
const toast = ref<InstanceType<typeof ToastNotification> | null>(null);

const availableIcons = [
  'gi-harpoon-trident','gi-trident','gi-harpoon-chain','gi-spear-hook','gi-stone-spear', 'gi-barbed-spear','gi-coiled-nail','gi-glaive',
  'gi-claw-hammer', 'gi-flat-hammer', 'gi-thor-hammer', 'gi-warhammer',
  'gi-axe-swing','gi-battered-axe','gi-battle-axe','gi-fire-axe','gi-magic-axe','gi-sharp-axe','gi-war-axe','gi-hatchet','gi-tomahawk',
  'gi-broadsword', 'gi-fragmented-sword', 'gi-relic-blade', 'gi-blade-drag','gi-katana','gi-lightning-saber','gi-gladius','gi-stiletto','gi-two-handed-sword',
  'gi-trench-knife','gi-curvy-knife','gi-bone-knife','gi-bowie-knife', 'gi-thrown-knife',
  'gi-health-potion', 'gi-first-aid-kit',  
  'gi-flashlight', 
  'gi-water-bottle', 
];

const form = reactive({
  name: '',
  description: '',
  type: 'OUTRO' as ItemType,
  quantity: 1,
  size: 1,
  icon: 'gi-generic-item'
});

const resetForm = () => {
  form.name = '';
  form.description = '';
  form.type = 'OUTRO';
  form.quantity = 1;
  form.size = 1;
  form.icon = 'gi-generic-item';
};

const totalWeight = computed(() => form.size * form.quantity);

const handleSave = () => {
  if (!form.name.trim()) {
    toast.value?.show('O item precisa de um nome!', 'error');
    return;
  }

  const result = store.addItem({
    name: form.name,
    description: form.description,
    type: form.type,
    quantity: form.quantity,
    size: form.size,
    icon: form.icon
  });

  if (result.success) {
    toast.value?.show('Item adicionado com sucesso!', 'success');
    resetForm();
    emit('close');
  } else {
    toast.value?.show(result.message || 'Erro ao adicionar.', 'error');
  }
};
</script>

<template>
  <div v-if="isOpen" class="dialog-overlay" @click.self="$emit('close')">
    <div class="dialog-container">
      
      <div class="dialog-header">
        <h3>NOVO ITEM</h3>
        <button class="close-btn" @click="$emit('close')">X</button>
      </div>

      <div class="dialog-body">
        
        <div class="left-col">
          <div class="icon-selector">
            <label>Ícone</label>
            <div class="preview">
              <OhVueIcon :name="form.icon" scale="3" />
            </div>
            <div class="grid-select">
              <button 
                v-for="icon in availableIcons" 
                :key="icon" 
                class="icon-option"
                :class="{ active: form.icon === icon }"
                @click="form.icon = icon"
              >
                <OhVueIcon :name="icon" />
              </button>
            </div>
          </div>
        </div>

        <div class="right-col">
          <div class="form-group">
            <label>Nome do Item</label>
            <input v-model="form.name" type="text" placeholder="Ex: Ração de Emergência" maxlength="25" />
          </div>

          <div class="row">
            <div class="form-group half">
              <label>Tipo</label>
              <select v-model="form.type">
                <option value="CONSUMIVEL">Consumível</option>
                <option value="EQUIPAMENTO">Equipamento</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>
            
            <div class="form-group half">
              <label>Tamanho (Slots)</label>
              <input v-model.number="form.size" type="number" min="0" max="10" />
              <small v-if="form.size === 0" class="hint-warn">Máx 3 itens tam. 0</small>
            </div>
          </div>

          <div class="form-group">
            <label>Quantidade</label>
            <div class="qty-control">
              <button @click="form.quantity > 1 ? form.quantity-- : null">-</button>
              <input v-model.number="form.quantity" type="number" min="1" />
              <button @click="form.quantity++">+</button>
            </div>
          </div>

          <div class="form-group">
            <label>Descrição</label>
            <textarea v-model="form.description" rows="2" placeholder="Detalhes..."></textarea>
          </div>

          <div class="load-summary" :class="{ 'overload': totalWeight > 5 }">
            PESO TOTAL: {{ totalWeight }} SLOTS
          </div>

        </div>
      </div>

      <div class="dialog-footer">
        <button class="confirm-btn" @click="handleSave">ADICIONAR AO INVENTÁRIO</button>
      </div>

    </div>

    <ToastNotification ref="toast" />
  </div>
</template>

<style scoped lang="scss">
.dialog-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.8); z-index: 2000;
  display: flex; justify-content: center; align-items: center;
  backdrop-filter: blur(3px);
}

.dialog-container {
  background: var(--bg-app); 
  color: var(--text-primary);
  width: 95%; max-width: 600px;
  border: 3px solid var(--border-main); 
  box-shadow: 10px 10px 0px var(--shadow-main);
  display: flex; flex-direction: column;
}

.dialog-header {
  background: var(--bg-card); 
  border-bottom: 3px solid var(--border-main); 
  padding: 15px;
  display: flex; justify-content: space-between; align-items: center;
  h3 { margin: 0; font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; letter-spacing: 1px; color: var(--text-primary); }
}

.close-btn {
  background: none; border: none; font-weight: bold; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);
  &:hover { color: var(--color-error); }
}

.dialog-body {
  padding: 20px; display: flex; gap: 20px;
  @media (max-width: 600px) { flex-direction: column; }
}

.left-col { width: 30%; display: flex; flex-direction: column; gap: 10px; }
.right-col { width: 70%; display: flex; flex-direction: column; gap: 15px; }
@media (max-width: 600px) { .left-col, .right-col { width: 100%; } }

.icon-selector {
  display: flex; flex-direction: column; gap: 5px;
  label { font-weight: bold; font-family: 'Share Tech Mono', monospace; }
}
.preview {
  height: 80px; background: var(--bg-card); border: 2px solid var(--border-main);
  display: flex; justify-content: center; align-items: center; margin-bottom: 10px;
  color: var(--color-accent);
}
.grid-select {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;
  max-height: 200px; overflow-y: auto; padding-right: 5px;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background: var(--border-main); }
}
.icon-option {
  background: var(--bg-card); border: 1px solid var(--border-main); cursor: pointer; padding: 5px; color: var(--text-primary);
  &:hover { background: var(--bg-app); }
  &.active { background: var(--border-main); color: var(--bg-app); border-color: var(--border-main); }
}

.form-group {
  display: flex; flex-direction: column; gap: 5px;
  label { font-weight: bold; font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; color: var(--text-secondary); }
  input, select, textarea {
    padding: 8px; border: 1px solid var(--border-main); background: var(--bg-card); color: var(--text-primary); font-family: 'Roboto Mono', monospace;
    &:focus { outline: none; border-color: var(--color-accent); box-shadow: 0 0 5px var(--color-focus-glow); }
  }
}

.row { display: flex; gap: 10px; }
.half { flex: 1; }

.qty-control {
  display: flex;
  button { width: 30px; background: var(--border-main); color: var(--bg-card); border: none; cursor: pointer; font-weight: bold; &:hover { opacity: 0.8; } }
  input { flex-grow: 1; text-align: center; border-left: none; border-right: none; }
}

.hint-warn { color: var(--color-error); font-size: 0.7rem; font-weight: bold; }

.load-summary {
  background: var(--border-main); color: var(--color-accent); padding: 10px; text-align: center;
  font-family: 'Share Tech Mono', monospace;
  &.overload { color: var(--color-error); }
}

.dialog-footer {
  padding: 15px; background: var(--bg-card); border-top: 3px solid var(--border-main); display: flex; justify-content: flex-end;
}

.confirm-btn {
  background: var(--color-accent); color: var(--bg-card); border: none; padding: 10px 20px;
  font-family: 'Share Tech Mono', monospace; font-weight: bold; font-size: 1rem;
  cursor: pointer; box-shadow: 4px 4px 0px var(--shadow-main);
  &:hover { filter: brightness(1.1); transform: translate(-2px, -2px); box-shadow: 6px 6px 0px var(--shadow-main); }
  &:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0px var(--shadow-main); }
}
</style>