<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCharacterStore } from '../../../stores/characterStore';
import type { PowerType } from '../../../types';
import ExpandedPowerDialog from '../Dialogs/ExpandedPowerDialog.vue';

interface Props {
    // Agora recebemos a CHAVE do array ('abilities' ou 'feats')
    target: 'abilities' | 'feats';
    title: string;
    colorTheme?: string;
}

const props = withDefaults(defineProps<Props>(), {
    colorTheme: '#000080'
});

const store = useCharacterStore();
const isExpanded = ref(false);
const types: PowerType[] = ['Ação', 'Reação', 'Passivo', 'Técnica'];

// Computed para pegar o array correto da Store baseado na prop target
const powerList = computed(() => store.char[props.target]);

const addPower = () => {
    store.addPower(props.target);
};

const removePower = (index: number) => {
    store.removePower(props.target, index);
};
</script>

<template>
    <div class="panel-box">
        <h3 class="glitch-title">{{ title }}</h3>

        <button class="expand-btn" @click="isExpanded = true" title="Expandir Lista">
            ⛶
        </button>

        <div class="scroll-area">
            <div class="list-container">
                <div v-for="(power, index) in powerList" :key="index" class="power-card"
                    :style="{ borderLeftColor: colorTheme }">
                    <div class="card-header">
                        <div class="top-row">
                            <input v-model="power.name" placeholder="NOME" class="input-name" />
                            <button class="remove-btn" @click="removePower(index)">×</button>
                        </div>

                        <div class="meta-row">
                            <select v-model="power.type" class="type-select">
                                <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
                            </select>
                            <div class="cost-wrapper">
                                <label>CUSTO:</label>
                                <input v-model="power.cost" placeholder="-" class="cost-input" />
                            </div>
                        </div>
                    </div>
                    <textarea v-model="power.description" placeholder="Descrição..." class="desc-input"></textarea>
                </div>
            </div>
        </div>

        <button class="add-btn" @click="addPower" :style="{ background: colorTheme }">
            + ADICIONAR
        </button>

        <ExpandedPowerDialog 
      :isOpen="isExpanded"
      :title="title"
      :target="target" 
      :colorTheme="colorTheme"
      @close="isExpanded = false"
    />
  </div>
</template>

<style scoped lang="scss">
/* (ESTILOS IGUAIS AOS ANTERIORES, MANTENHA O CSS EXISTENTE) */
.panel-box {
    border: 3px solid black;
    border-radius: 4px;
    padding: 20px 15px 15px 15px;
    background: #f0f0f5;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 1);
    position: relative;
    margin-top: 15px;
}

.glitch-title {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Share Tech Mono', monospace;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-size: 1.2rem;
    background: white;
    padding: 2px 5px;
    white-space: nowrap;
    z-index: 10;
}

.expand-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #555;

    &:hover {
        color: black;
        transform: scale(1.1);
    }
}

.scroll-area {
    max-height: 360px;
    overflow-y: auto;
    margin-bottom: 10px;
    padding-right: 5px;

    &::-webkit-scrollbar {
        width: 5px;
    }

    &::-webkit-scrollbar-thumb {
        background: #999;
        border-radius: 2px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }
}

.list-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.power-card {
    background: white;
    border: 1px solid #ccc;
    padding: 10px;
    border-left: 4px solid #000;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.card-header {
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
}

.top-row {
    display: flex;
    justify-content: space-between;
}

.input-name {
    width: 100%;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1rem;
    font-weight: bold;
    text-transform: uppercase;
    border: none;
    outline: none;

    &::placeholder {
        color: #ccc;
    }
}

.remove-btn {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 1.2rem;

    &:hover {
        color: red;
    }
}

.meta-row {
    display: flex;
    gap: 10px;
    align-items: center;
}

.type-select {
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 0.7rem;
    padding: 2px;
    font-family: 'Share Tech Mono', monospace;
    background: #eee;
    text-transform: uppercase;
}

.cost-wrapper {
    display: flex;
    align-items: center;
    gap: 5px;

    label {
        font-size: 0.7rem;
        font-weight: bold;
        color: #777;
    }
}

.cost-input {
    border: none;
    border-bottom: 1px dashed #ccc;
    width: 60px;
    font-size: 0.8rem;
    font-weight: bold;
    color: #c2002f;
    font-family: 'Share Tech Mono', monospace;

    &:focus {
        outline: none;
        border-bottom: 1px solid red;
    }
}

.desc-input {
    width: 100%;
    min-height: 60px;
    border: none;
    resize: vertical;
    font-family: 'Roboto Mono', monospace;
    font-size: 0.85rem;
    color: #333;
    background: transparent;
    outline: none;
}

.add-btn {
    width: 100%;
    padding: 8px;
    color: white;
    border: none;
    font-family: 'Share Tech Mono', monospace;
    cursor: pointer;
    text-transform: uppercase;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.8;
    }
}
</style>