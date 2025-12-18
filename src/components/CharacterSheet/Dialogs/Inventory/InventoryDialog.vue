<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCharacterStore } from '../../../../stores/characterStore';
import { OhVueIcon } from "oh-vue-icons";
import type { InventoryItem } from '../../../../types';
import AddItemDialog from './AddItemDialog.vue';

interface Props { isOpen: boolean; }
defineProps<Props>();
defineEmits<{ (e: 'close'): void }>();

const store = useCharacterStore();
const showAddDialog = ref(false);

const hoveredItem = ref<InventoryItem | null>(null);
const selectedItem = ref<InventoryItem | null>(null);

const activeItem = computed(() => hoveredItem.value || selectedItem.value);

const selectItem = (item: InventoryItem) => {
  selectedItem.value = item;
};

const increaseQty = () => {
  if (activeItem.value) {
    if (store.currentLoad + activeItem.value.size <= store.maxLoad) {
      store.updateItemQuantity(activeItem.value.id, activeItem.value.quantity + 1);
    }
  }
};

const decreaseQty = () => {
  if (activeItem.value) {
    store.updateItemQuantity(activeItem.value.id, activeItem.value.quantity - 1);
    if (!store.char.inventory.find(i => i.id === activeItem.value?.id)) {
      selectedItem.value = null;
      hoveredItem.value = null;
    }
  }
};

const toggleEquip = () => {
  if (activeItem.value) store.toggleEquipped(activeItem.value.id);
};

const loadSlots = computed(() => {
  const max = store.maxLoad;
  const current = store.currentLoad;
  const slots = [];
  for (let i = 0; i < max; i++) slots.push({ status: i < current ? 'filled' : 'empty', id: i });
  return slots;
});

const regularItems = computed(() => store.char.inventory.filter(i => i.size > 0));
const smallItems = computed(() => store.char.inventory.filter(i => i.size === 0));
</script>

<template>
  <div v-if="isOpen" class="dialog-overlay" @click.self="$emit('close')">
    <div class="inventory-container">
      
      <div class="header">
        <div class="title-box">
          <h2>INVENTÁRIO</h2>
          <div class="status-row">
            <div class="weight-info">CARGA: {{ store.currentLoad }} / {{ store.maxLoad }}</div>
            <div class="money-wrapper">
              <span class="currency-symbol">C$</span>
              <input type="number" v-model.number="store.char.credits" class="money-input" placeholder="0" />
            </div>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">X</button>
      </div>

      <div class="main-layout">
        
        <div class="inventory-panel">
          
          <div class="load-grid-section">
            <small class="label">CAPACIDADE DO CORPO</small>
            <div class="load-grid">
              <div v-for="slot in loadSlots" :key="slot.id" class="slot-cell" :class="slot.status"></div>
              <div v-if="store.currentLoad > store.maxLoad" class="slot-cell overload">
                +{{ store.currentLoad - store.maxLoad }}
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="items-section">
            <div class="items-grid">
              <div 
                v-for="item in regularItems" 
                :key="item.id" 
                class="item-card"
                :class="{ 
                  'is-hovered': hoveredItem?.id === item.id,
                  'is-selected': selectedItem?.id === item.id,
                  'is-equipped': item.equipped 
                }"
                @mouseenter="hoveredItem = item"
                @mouseleave="hoveredItem = null"
                @click="selectItem(item)"
              >
                <div class="item-icon">
                  <OhVueIcon :name="item.icon" scale="1.5" />
                  <span class="qty-badge" v-if="item.quantity > 1">x{{ item.quantity }}</span>
                  <div v-if="item.equipped" class="equipped-dot"></div>
                </div>
              </div>
              <div v-if="regularItems.length === 0" class="empty-msg">Mochila vazia...</div>
            </div>
          </div>

          <div class="pockets-section">
            <div class="pocket-header"><small>BOLSOS ({{ store.sizeZeroCount }}/3)</small></div>
            <div class="pockets-list">
              <div 
                v-for="item in smallItems" 
                :key="item.id" 
                class="pocket-item"
                :class="{ 'is-selected': selectedItem?.id === item.id }"
                @mouseenter="hoveredItem = item"
                @mouseleave="hoveredItem = null"
                @click="selectItem(item)"
              >
                <OhVueIcon :name="item.icon" scale="0.8" />
                <span>{{ item.name }} (x{{ item.quantity }})</span>
                <span v-if="item.equipped" class="eqp-tag">[Eqp]</span>
              </div>
              <div v-for="n in (3 - store.sizeZeroCount)" :key="n" class="pocket-item empty"><span>[Vazio]</span></div>
            </div>
          </div>
        </div>

        <div class="details-sidebar">
          
          <div v-if="activeItem" class="item-details">
            <div class="detail-header">
              <div class="big-icon">
                <OhVueIcon :name="activeItem.icon" scale="3" />
              </div>
              <h3>{{ activeItem.name }}</h3>
              <span class="type-tag">{{ activeItem.type }}</span>
            </div>

            <div class="detail-body">
              <p class="description">{{ activeItem.description || 'Sem descrição.' }}</p>
              
              <div class="stats-row">
                <span>Peso: {{ activeItem.size }} slots</span>
                <span>Total: {{ activeItem.size * activeItem.quantity }} slots</span>
              </div>
            </div>

            <div class="detail-footer">
              <label v-if="activeItem.type === 'EQUIPAMENTO'" class="equip-control">
                <input type="checkbox" :checked="activeItem.equipped" @change="toggleEquip" />
                <span>EQUIPADO</span>
              </label>

              <div class="qty-control">
                <button @click="decreaseQty">-</button>
                <span>{{ activeItem.quantity }}</span>
                <button @click="increaseQty">+</button>
              </div>
            </div>
          </div>

          <div v-else class="empty-details">
            <OhVueIcon name="gi-backpack" scale="5" class="faded-icon" />
            <p>Selecione um item<br>para ver detalhes</p>
          </div>

        </div>

      </div>

      <div class="fab-container">
        <button class="hand-btn" @click="showAddDialog = true">
          <OhVueIcon name="gi-hand" scale="1.5" />
        </button>
      </div>

    </div>
    <AddItemDialog :isOpen="showAddDialog" @close="showAddDialog = false" />
  </div>
</template>

<style scoped lang="scss">
.dialog-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.7); z-index: 1000;
  display: flex; justify-content: center; align-items: center;
  backdrop-filter: blur(2px);
}

.inventory-container {
  background: var(--bg-app); color: var(--text-primary);
  width: 95%; max-width: 800px; height: 80vh;
  border: 2px solid var(--border-main); 
  box-shadow: 0 0 20px var(--shadow-main);
  display: flex; flex-direction: column; position: relative;
}

.header {
  background: var(--bg-card); padding: 15px; border-bottom: 2px solid var(--border-main);
  display: flex; justify-content: space-between; align-items: flex-start;
  flex-shrink: 0;
}
.title-box {
  flex-grow: 1; margin-right: 15px;
  h2 { margin: 0 0 5px 0; font-family: 'Share Tech Mono', monospace; color: var(--color-accent); font-size: 1.5rem; letter-spacing: 2px; }
}
.status-row { display: flex; justify-content: space-between; align-items: center; width: 100%; font-family: 'Roboto Mono', monospace; font-size: 0.8rem; padding-right: 10px; }
.weight-info { color: var(--text-secondary); }
.money-wrapper { 
  display: flex; align-items: center; gap: 5px; color: var(--color-warning); border-bottom: 1px solid var(--text-secondary); 
  .currency-symbol { font-weight: bold; font-family: 'Share Tech Mono', monospace; } 
  .money-input { background: transparent; border: none; color: inherit; width: 80px; text-align: right; font-family: 'Share Tech Mono', monospace; font-size: 1rem; &:focus { outline: none; } } 
}
.close-btn { background: none; border: 1px solid var(--border-main); color: var(--text-primary); width: 30px; height: 30px; cursor: pointer; &:hover { border-color: var(--color-error); color: var(--color-error); } }

.main-layout { display: flex; flex-grow: 1; overflow: hidden; @media (max-width: 600px) { flex-direction: column; } }

.inventory-panel { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; border-right: 1px solid var(--border-main); }

.details-sidebar {
  width: 280px; background: var(--bg-card); padding: 20px;
  display: flex; flex-direction: column; border-left: 1px solid var(--border-main);
  @media (max-width: 600px) { width: 100%; height: 250px; border-top: 2px solid var(--color-accent); border-left: none; }
}

.empty-details {
  flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; color: var(--text-secondary); text-align: center;
  .faded-icon { opacity: 0.1; margin-bottom: 10px; }
  p { font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; }
}

.item-details {
  display: flex; flex-direction: column; height: 100%; gap: 15px; animation: fadeIn 0.3s ease;
  .detail-header {
    text-align: center; border-bottom: 1px solid var(--border-main); padding-bottom: 10px;
    .big-icon { color: var(--color-accent); margin-bottom: 10px; }
    h3 { margin: 0; font-family: 'Share Tech Mono', monospace; color: var(--text-primary); font-size: 1.2rem; }
    .type-tag { font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; }
  }
  .detail-body { flex-grow: 1; font-family: 'Roboto Mono', monospace; font-size: 0.85rem; color: var(--text-primary); .description { line-height: 1.4; margin-bottom: 15px; } .stats-row { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); } }
  .detail-footer { border-top: 1px solid var(--border-main); padding-top: 15px; display: flex; flex-direction: column; gap: 10px; }
}

.qty-control {
  display: flex; justify-content: center; align-items: center; gap: 10px; background: var(--bg-app); padding: 5px; border-radius: 4px; border: 1px solid var(--border-main);
  button { width: 30px; height: 30px; background: var(--bg-card); border: 1px solid var(--border-main); color: var(--text-primary); cursor: pointer; &:hover { background: var(--color-accent); color: var(--bg-app); } }
  span { font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; min-width: 30px; text-align: center; }
}

.equip-control {
  display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; background: var(--bg-card); padding: 8px; border: 1px solid var(--border-main);
  &:hover { border-color: var(--color-accent); }
  span { font-family: 'Share Tech Mono', monospace; font-weight: bold; font-size: 0.9rem; }
  input[type="checkbox"] { accent-color: var(--color-accent); width: 18px; height: 18px; }
}

.items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 8px; }

.item-card {
  background: var(--bg-card); border: 1px solid var(--border-main); aspect-ratio: 1;
  display: flex; justify-content: center; align-items: center; cursor: pointer; position: relative; transition: all 0.2s;
  .item-icon { color: var(--text-secondary); transition: color 0.2s; }
  &:hover, &.is-hovered { border-color: var(--color-accent); background: var(--bg-app); .item-icon { color: var(--text-primary); } }
  &.is-selected { border-color: var(--color-accent); background: var(--bg-app); box-shadow: 0 0 10px var(--color-focus-glow); .item-icon { color: var(--color-accent); } }
  &.is-equipped { border-color: var(--color-warning); box-shadow: inset 0 0 5px var(--color-warning); }
  .qty-badge { position: absolute; bottom: 2px; right: 2px; background: var(--bg-app); color: var(--text-primary); font-size: 0.7rem; padding: 0 3px; border: 1px solid var(--border-main); border-radius: 3px; }
  .equipped-dot { position: absolute; top: 4px; left: 4px; width: 6px; height: 6px; background: var(--color-warning); border-radius: 50%; }
}

.load-grid-section .label { font-family: 'Share Tech Mono', monospace; color: var(--color-accent); font-size: 0.7rem; display: block; margin-bottom: 5px; }
.load-grid { display: flex; flex-wrap: wrap; gap: 4px; }
.slot-cell { width: 20px; height: 20px; border: 1px solid var(--border-main); background: var(--bg-card); &.filled { background: var(--color-accent); } &.overload { background: var(--color-error); color: white; display: flex; justify-content: center; align-items: center; font-size: 0.6rem; } }
.divider { height: 1px; background: var(--border-main); width: 100%; margin: 5px 0; }
.pockets-section { 
  margin-top: auto; background: var(--bg-card); border: 1px dashed var(--border-main); padding: 10px; border-radius: 5px; 
  .pocket-header { color: var(--text-secondary); margin-bottom: 5px; font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; } 
  .pocket-item { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; padding: 5px; background: var(--bg-app); border: 1px solid transparent; cursor: pointer; .eqp-tag { color: var(--color-accent); font-size: 0.7rem; margin-left: auto; } &.is-selected { border-color: var(--color-accent); } &.empty { color: var(--text-secondary); font-style: italic; cursor: default; border: none; } } 
}

.fab-container { position: absolute; bottom: 20px; right: 20px; z-index: 10; }
.hand-btn { 
  width: 60px; height: 60px; border-radius: 50%; background: var(--color-accent); border: 4px solid var(--border-main); color: var(--bg-app); 
  display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 0 15px var(--color-focus-glow); transition: all 0.2s; 
  &:hover { transform: scale(1.1); background: var(--text-primary); color: var(--bg-app); } 
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>