<script setup lang="ts">
import { useCharacterStore } from "../../stores/characterStore";
import { ref } from 'vue';

// Componentes Existentes
import DomainDiamond from "./MainPage/DomainDiamond.vue";
import CharacterUploader from "./MainPage/CharacterUploader.vue";
import SkillList from "./MainPage/SkillList.vue";
import StatusStat from "./MainPage/StatusStat.vue";
import PlayerHeader from "./MainPage/PlayerHeader.vue";
import DefenseSection from "./MainPage/DefenseSection.vue";
import StatusList from "./MainPage/StatusList.vue";
// Dialogs
import NotesDialog from './Dialogs/Notes/NotesDialog.vue';
import InventoryDialog from './Dialogs/Inventory/InventoryDialog.vue';

const store = useCharacterStore();
const isNotesOpen = ref(false);
const isInventoryOpen = ref(false);

const openInventory = () => {
    isInventoryOpen.value = true;
};
const openNotes = () => {
    isNotesOpen.value = true;
};
</script>

<template>
    <div class="page main-page">
        <div class="top-bar">
            <StatusStat label="VIDA" v-model:current="store.char.hp.current" v-model:max="store.char.hp.max"
                color="#c2002f" backgroundImageSrc="/bg-vida.png" />

            <PlayerHeader v-model="store.char.playerName" @action:export="store.exportCharacter()"
                @open:inventory="openInventory" @open:notes="openNotes" />

            <NotesDialog :isOpen="isNotesOpen" @close="isNotesOpen = false" />
            <InventoryDialog :isOpen="isInventoryOpen" @close="isInventoryOpen = false" />
            <StatusStat label="DETERMINAÇÃO" v-model:current="store.char.determination.current"
                v-model:max="store.char.determination.max" color="#00cccc" backgroundImageSrc="/bg-determinacao.png" />
        </div>

        <div class="stats-avatar-wrapper">
            <div class="stat-position body-pos">
                <DomainDiamond label="CORPO" v-model="store.char.stats.body" />
            </div>
            <div class="stat-position senses-pos">
                <DomainDiamond label="SENTIDOS" v-model="store.char.stats.senses" />
            </div>
            <div class="stat-position mind-pos">
                <DomainDiamond label="MENTE" v-model="store.char.stats.mind" />
            </div>
            <div class="stat-position soul-pos">
                <DomainDiamond label="ALMA" v-model="store.char.stats.soul" />
            </div>

            <CharacterUploader v-model:image="store.char.characterImage" placeholderSrc="/placeholder-character.png" />

            <div class="char-name-footer">
                <textarea v-model="store.char.name" placeholder="PERSONAGEM" rows="2"
                    spellcheck="false"></textarea>
            </div>
        </div>
        <div class="sidebar-left">
            <DefenseSection v-model:rd="store.char.rd" v-model:block="store.char.block"
                blockBackgroundSrc="/Circle.png" />
        </div>

        <div class="sidebar-right">
            <StatusList />
            <SkillList />

        </div>
    </div>
</template>

<style lang="scss" scoped>
/* Estrutura Mantida */
.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    position: relative;
    z-index: 20;
}

.stats-avatar-wrapper {
    position: relative;
    height: 600px;
    overflow: visible;
    z-index: 10;
}

.stat-position {
    position: absolute;
    z-index: 10;

    &.body-pos {
        top: 60px;
        left: 15%;
    }

    &.senses-pos {
        top: 0px;
        left: 30%;
    }

    &.mind-pos {
        top: 0px;
        right: 30%;
    }

    &.soul-pos {
        top: 60px;
        right: 15%;
    }
}

.main-page {
    background: var(--bg-sheet-paper);
    color: var(--text-on-light);
}

.char-name-footer {
    position: absolute;
    bottom: -20px; // Ajustado levemente para baixo devido ao aumento de altura
    left: 50%;
    transform: translateX(-50%);
    width: 250px; // Largura fixa para forçar a quebra por volta de 10 letras
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 35;
    pointer-events: none;

    textarea {
        font-size: 2.5rem; // Reduzido minimamente para acomodar 2 linhas
        font-family: "Share Tech Mono", monospace;
        font-weight: bold;
        text-transform: uppercase;
        text-align: center;
        width: 100%;
        height: auto;
        min-height: 100px;

        // --- LÓGICA DE QUEBRA DE LINHA ---
        overflow: hidden;
        resize: none;
        word-break: break-all; // Quebra a palavra em qualquer caractere para respeitar o limite lateral
        line-height: 1;

        color: var(--text-inverted);

        text-shadow:
            -2px -2px 0 #000,
            2px -2px 0 #000,
            -2px 2px 0 #000,
            2px 2px 0 #000,
            6px 6px 0px var(--shadow-main);

        background: transparent;
        border: none;
        pointer-events: auto;

        &:focus {
            outline: none;
            text-shadow: 0 0 10px var(--color-focus-glow);
        }

        &::placeholder {
            color: rgba(255, 255, 255, 0.5);
            text-shadow: none;
            font-size: 1.5rem;
        }
    }
}

.sidebar-right {
    position: absolute;
    right: 22px;
    bottom: 100px;
    top: auto;
    width: 170px;
    z-index: 15;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.sidebar-left {
    position: absolute;
    left: 0px;
    bottom: 100px;
    width: 180px; // Mesma largura da sidebar-right
    z-index: 15;
    display: flex;
    flex-direction: column;
    gap: 15px;
}
</style>