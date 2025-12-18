import { defineStore } from 'pinia';
import { reactive, watch, computed, ref } from 'vue';
import type { CharacterData, InventoryItem } from '../types';
import api from '../services/api';
import { useAuthStore } from './authStore';

export const useCharacterStore = defineStore('character', () => {
  const dbId = ref<number | null>(null);
  const isSaving = ref(false);
  const characterList = ref<any[]>([]);
  const authStore = useAuthStore();
  let isInternalUpdate = false;

  const defaultChar: CharacterData = {
    name: 'Novo Personagem',
    playerName: '',
    characterImage: null,
    stats: { body: 1, senses: 1, mind: 1, soul: 1 },
    hp: { current: 10, max: 10 },
    determination: { current: 3, max: 3 },
    rd: { sources: [{ name: 'Base', value: 0 }], blockBonus: 0 },
    block: 0,
    skills: [],
    conditions: [],
    attacks: [],
    abilities: [],
    feats: [],
    inventory: [],
    credits: 0,
    notes: '',
    origin: '',
    investigationNotes: []
  };

  const char = reactive<CharacterData>(JSON.parse(JSON.stringify(defaultChar)));

  // --- API ---
  async function fetchList() {
    if (!authStore.token) return;
    try {
      const { data } = await api.get('/characters');
      characterList.value = data;
    } catch (e) {
      console.error("Erro ao listar", e);
    }
  }

  function selectCharacter(id: number) {
    const found = characterList.value.find(c => c.id === id);
    if (found) {
      isInternalUpdate = true;
      dbId.value = found.id;
      
      Object.assign(char, JSON.parse(JSON.stringify(defaultChar)));
      const incomingData = { ...found.data };

      // Migração RD (number -> object)
      if (typeof incomingData.rd === 'number' || !incomingData.rd?.sources) {
        const oldVal = typeof incomingData.rd === 'number' ? incomingData.rd : 0;
        incomingData.rd = {
          sources: [{ name: 'Base (Migrado)', value: oldVal }],
          blockBonus: incomingData.block || 0
        };
      }

      Object.assign(char, { ...defaultChar, ...incomingData });
      setTimeout(() => { isInternalUpdate = false; }, 100);
      return true;
    }
    return false;
  }

  async function createNewCharacter() {
    try {
      const { data } = await api.post('/characters', { data: defaultChar });
      characterList.value.unshift(data);
      selectCharacter(data.id);
      return true;
    } catch (e) { return false; }
  }

  async function deleteCharacter(id: number) {
    await api.delete(`/characters/${id}`);
    characterList.value = characterList.value.filter(c => c.id !== id);
    if (dbId.value === id) dbId.value = null;
  }

  function closeSheet() { dbId.value = null; }

  // --- AUTOSAVE ---
  let saveTimeout: any;
  function triggerAutoSave() {
    if (isInternalUpdate || !authStore.token || !dbId.value) return;
    const targetId = dbId.value;
    clearTimeout(saveTimeout);
    isSaving.value = true;
    
    saveTimeout = setTimeout(async () => {
      try {
        await api.put(`/characters/${targetId}`, { data: char });
        const listItem = characterList.value.find(c => c.id === targetId);
        // Proteção contra undefined (Linha 122/137 fixes)
        if (listItem) {
          listItem.name = char.name;
          listItem.data = JSON.parse(JSON.stringify(char));
        }
      } finally {
        isSaving.value = false;
      }
    }, 2000);
  }
  watch(char, () => triggerAutoSave(), { deep: true });

  // --- GETTERS ---
  const maxLoad = computed(() => 5 + (Number(char.stats?.body) || 0));
  const currentLoad = computed(() => (char.inventory || []).reduce((t, i) => t + (i.size * i.quantity), 0));
  const sizeZeroCount = computed(() => (char.inventory || []).filter(i => i.size === 0).reduce((t, i) => t + i.quantity, 0));

  // --- ACTIONS INVENTÁRIO ---
  function addItem(newItem: Omit<InventoryItem, 'id'>) {
    if (!char.inventory) char.inventory = [];
    const idx = char.inventory.findIndex(i => i.name === newItem.name && i.size === newItem.size);
    
    if (idx !== -1) {
      char.inventory[idx].quantity += newItem.quantity;
    } else {
      char.inventory.push({ ...newItem, id: crypto.randomUUID(), equipped: false });
    }
    return { success: true, message: 'Item adicionado com sucesso' };
  }

  function removeItem(itemId: string) {
    if (!char.inventory) return;
    const idx = char.inventory.findIndex(i => i.id === itemId);
    if (idx !== -1) char.inventory.splice(idx, 1);
  }

  function toggleEquipped(itemId: string) {
    if (!char.inventory) return;
    const item = char.inventory.find(i => i.id === itemId);
    if (item && item.type === 'EQUIPAMENTO') item.equipped = !item.equipped;
  }

  function updateItemQuantity(itemId: string, newQuantity: number) {
    if (!char.inventory) return;
    const item = char.inventory.find(i => i.id === itemId);
    if (!item) return;
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      item.quantity = newQuantity;
    }
  }

  // --- RD & DEFESA (PROTEÇÃO COMPLETA) ---
  function addRdSource() {
    if (!char.rd) char.rd = { sources: [], blockBonus: 0 };
    if (!char.rd.sources) char.rd.sources = [];
    char.rd.sources.push({ name: 'Nova Fonte', value: 0 });
  }

  function removeRdSource(index: number) {
    if (char.rd?.sources && char.rd.sources.length > 1) {
      char.rd.sources.splice(index, 1);
    }
  }

  // --- OUTRAS ACTIONS ---
  function addAttack() {
    if (!char.attacks) char.attacks = [];
    char.attacks.push({ name: '', damage: '', graze: '', critical: '20 / x2' });
  }
  function removeAttack(i: number) { if (char.attacks) char.attacks.splice(i, 1); }
  
  function addSkill() {
    if (!char.skills) char.skills = [];
    char.skills.push({ name: 'Nova Perícia', value: 0 });
  }
  function removeSkill(i: number) { if (char.skills) char.skills.splice(i, 1); }

  function addCondition(name: string) {
    if (!char.conditions) char.conditions = [];
    if (!char.conditions.includes(name)) char.conditions.push(name);
  }
  function removeCondition(index: number) { if (char.conditions) char.conditions.splice(index, 1); }
  
  function addPower(target: 'abilities' | 'feats') { 
    if (!char[target]) char[target] = [];
    char[target].push({ name: '', type: 'Ação', cost: '', description: '' }); 
  }
  function removePower(target: 'abilities' | 'feats', i: number) { 
    if (char[target]) char[target].splice(i, 1); 
  }

  function addNote(imageUrl?: string) {
    if (!char.investigationNotes) char.investigationNotes = [];
    char.investigationNotes.push({ 
      id: crypto.randomUUID(), x: 50, y: 50, text: '', 
      imageUrl, color: imageUrl ? '#fff' : '#ffeba7', 
      width: 200, height: 200 
    });
  }
  function removeNote(id: string) {
    if (!char.investigationNotes) return;
    const idx = char.investigationNotes.findIndex(n => n.id === id);
    if (idx !== -1) char.investigationNotes.splice(idx, 1);
  }
  function updateNotePosition(id: string, x: number, y: number) {
    const note = char.investigationNotes?.find(n => n.id === id);
    if (note) { note.x = x; note.y = y; }
  }
  function updateNoteColor(id: string, color: string) {
    const note = char.investigationNotes?.find(n => n.id === id);
    if (note) note.color = color;
  }

  function exportCharacter() {
    const blob = new Blob([JSON.stringify(char, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${char.name}_kaosekai.json`; a.click();
  }

  return {
    char, dbId, isSaving, characterList, fetchList, selectCharacter, createNewCharacter, deleteCharacter, closeSheet,
    maxLoad, currentLoad, sizeZeroCount,
    addItem, removeItem, toggleEquipped, updateItemQuantity,
    addRdSource, removeRdSource, addAttack, removeAttack, addSkill, removeSkill,
    addCondition, removeCondition, addPower, removePower, addNote, removeNote,
    exportCharacter, updateNotePosition, updateNoteColor,
  };
});