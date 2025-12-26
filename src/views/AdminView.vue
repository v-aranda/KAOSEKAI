<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentSubtopic: string;
}>();

const title = computed(() => {
  switch (props.currentSubtopic) {
    case 'users': return 'Gerenciar Usuários';
    case 'settings': return 'Configurações do Sistema';
    case 'logs': return 'Logs do Sistema';
    default: return 'Painel Admin';
  }
});
</script>

<template>
  <div class="admin-view">
    <header class="admin-header">
      <h1>{{ title }}</h1>
      <p class="subtitle">Área restrita para administradores</p>
    </header>

    <div class="admin-content">
      <div v-if="currentSubtopic === 'users'" class="placeholder-section">
        <v-icon name="gi-three-friends" scale="4" class="placeholder-icon" />
        <h2>Gerenciamento de Usuários</h2>
        <p>Funcionalidade em desenvolvimento...</p>
      </div>

      <div v-else-if="currentSubtopic === 'settings'" class="placeholder-section">
        <v-icon name="gi-gears" scale="4" class="placeholder-icon" />
        <h2>Configurações</h2>
        <p>Ajuste os parâmetros globais do sistema aqui.</p>
      </div>

      <div v-else class="placeholder-section">
        <v-icon name="gi-checked-shield" scale="4" class="placeholder-icon" />
        <h2>Bem-vindo, Admin</h2>
        <p>Selecione uma opção no menu lateral.</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;
}

.admin-header {
  border-bottom: 2px solid var(--border-main);
  padding-bottom: 20px;

  h1 {
    font-size: 2rem;
    color: var(--color-accent);
    margin: 0;
  }
  
  .subtitle {
    color: var(--text-secondary);
    margin: 5px 0 0;
  }
}

.admin-content {
  flex: 1;
  background: var(--bg-card);
  border: 2px solid var(--border-main);
  border-radius: 16px;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 4px 4px 0px var(--border-main);
}

.placeholder-section {
  text-align: center;
  color: var(--text-secondary);
  
  .placeholder-icon {
    margin-bottom: 20px;
    color: var(--border-main);
  }

  h2 {
    color: var(--text-primary);
    margin-bottom: 10px;
  }
}
</style>
