<script setup lang="ts">
import AttackList from './DetailsPage/AttackList.vue';
import PowerList from './DetailsPage/PowerList.vue';
// Não precisa mais importar store aqui, os filhos cuidam de si mesmos
</script>

<template>
  <div class="page details-page">
    
    <AttackList />

    <PowerList 
      title="PROEZAS E TRAÇOS" 
      target="feats"
      colorTheme="#502863" 
    />

  </div>
</template>

<style lang="scss" scoped>
.details-page {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-bottom: 20px;
  
  // ⬇️ FORÇANDO O TEMA CLARO (EFEITO PAPEL)
  // Sobrescreve o background herdado da View (para ser o papel claro)
  background: var(--bg-sheet-paper);
  // Força o texto base da folha a ser escuro
  color: var(--text-on-light);
}

// Nota: Assumimos que AttackList e PowerList herdarão 'color: var(--text-on-light)' e usarão
// 'var(--bg-card)' para seus fundos internos se necessário.
</style>