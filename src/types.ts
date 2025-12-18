// src/types.ts

// Tipos para Perícias
export interface SkillItem {
  name: string;
  value: number;
}

// Tipos para Ataques
export interface AttackItem {
  name: string;
  damage: string;
  graze: string;
  critical: string;
}

export type ItemType = 'CONSUMIVEL' | 'EQUIPAMENTO' | 'OUTRO';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  size: number;
  quantity: number;
  type: ItemType;
  equipped?: boolean; // <--- NOVO CAMPO OPCIONAL
}

export interface NoteItem {
  id: string;
  x: number;
  y: number;
  text: string;
  imageUrl?: string; // <--- NOVO CAMPO OPCIONAL
  color: string;
  width: number;
  height: number;
}

// Tipos para Poderes (Habilidades/Proezas)
export type PowerType = 'Ação' | 'Reação' | 'Passivo' | 'Técnica';

export interface PowerItem {
  name: string;
  type: PowerType;
  cost: string;
  description: string;
}

// O Objeto Principal do Personagem
export interface CharacterData {
  name: string;
  playerName: string;
  characterImage: string | null;
  
  stats: {
    body: number;
    senses: number;
    mind: number;
    soul: number;
  };
  
  hp: { current: number; max: number };
  determination: { current: number; max: number };
  
  rd: number;
  block: number;
  
  skills: SkillItem[];
  conditions: string[];
  
  attacks: AttackItem[];
  abilities: PowerItem[];
  feats: PowerItem[];
  
  // Futuros campos (já preparando terreno)
  notes: string; // Texto corrido de Anotações Gerais
  origin: string; // Texto corrido da Origem
  investigationNotes: NoteItem[]; // Array de post-its
  inventory: InventoryItem[]; // Itens do inventário
  credits: number; // Créditos disponíveis
}