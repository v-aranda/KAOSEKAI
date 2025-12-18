<script setup lang="ts">
// Esta é agora a View principal que orquestra a Ficha.
// Os dados são gerenciados via characterStore.

import MainPage from '../components/CharacterSheet/MainPage.vue'; 
import DetailsPage from '../components/CharacterSheet/DetailsPage.vue';
</script>

<template>
    <div class="sheet-container">
        <MainPage class="page" />
        <DetailsPage class="page" />
    </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Roboto+Mono:wght@400;700&family=Share+Tech+Mono&display=swap');

.sheet-container {
    display: flex;
    // ⬇️ Corrigido: nowrap impede a quebra de linha lateral
    flex-wrap: nowrap; 
    gap: 20px;
    
    background-color: var(--bg-app);
    padding: 10px; // Reduzido levemente para ganhar espaço lateral
    
    font-family: 'Share Tech Mono', monospace;
    
    // ⬇️ Corrigido: garante que o container ocupe a largura total disponível
    width: 100%;
    justify-content: flex-start;
    align-items: flex-start;
}

.page {
    background: var(--bg-card);
    border: 1px solid var(--border-light, #ddd);
    box-shadow: 0 0 15px var(--shadow-light, rgba(0, 0, 0, 0.1));
    
    // ⬇️ Corrigido: flex: 1 faz com que as duas colunas dividam o espaço igualmente
    flex: 1;
    min-width: 0; // Evita que o conteúdo interno "estoure" a largura da coluna
    min-height: 800px;
    padding: 20px;
    position: relative;
    transition: all 0.3s ease;

    // Removemos o max-width fixo para permitir que elas preencham o espaço ao lado da Dock
}

// Ajuste para telas menores (Tablets/Mobile)
@media (max-width: 1100px) {
    .sheet-container {
        flex-wrap: wrap; // Volta a quebrar linha apenas em telas realmente pequenas
        justify-content: center;
    }
    
    .page {
        flex: none;
        width: 100%;
        max-width: 600px;
    }
}
</style>