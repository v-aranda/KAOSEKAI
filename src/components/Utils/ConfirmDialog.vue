<script setup lang="ts">
import { useUiStore } from '../../stores/uiStore';

const ui = useUiStore();
</script>

<template>
  <Transition name="fade">
    <div v-if="ui.dialog.isOpen" class="backdrop" @click="ui.handleChoice(false)">
      <div class="dialog-box" @click.stop>
        <div class="header">
          <h3>{{ ui.dialog.title }}</h3>
        </div>
        
        <div class="body">
          <p>{{ ui.dialog.message }}</p>
        </div>
        
        <div class="footer">
          <button class="btn cancel" @click="ui.handleChoice(false)">CANCELAR</button>
          <button class="btn confirm" @click="ui.handleChoice(true)">CONFIRMAR</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.backdrop {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 10001; /* Maior que o Toast */
  backdrop-filter: blur(2px);
}

.dialog-box {
  background: white;
  border: 2px solid black;
  box-shadow: 8px 8px 0px rgba(0,0,0,1); /* Sombra dura igual ao Toast */
  padding: 20px;
  width: 90%;
  max-width: 400px;
  font-family: 'Share Tech Mono', monospace;
  animation: slideUp 0.2s ease-out;

  .header h3 {
    margin: 0 0 15px 0;
    font-size: 1.5rem;
    color: black;
    border-bottom: 2px solid black;
    padding-bottom: 10px;
  }

  .body p {
    font-size: 1rem;
    color: #333;
    margin-bottom: 25px;
    line-height: 1.4;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
  }
}

.btn {
  font-family: 'Share Tech Mono', monospace;
  font-weight: bold;
  border: 2px solid black;
  padding: 10px 20px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.1s;
  box-shadow: 3px 3px 0px rgba(0,0,0,1);

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px rgba(0,0,0,1);
  }

  &.cancel {
    background: white;
    color: black;
    &:hover { background: #eee; }
  }

  &.confirm {
    background: red; /* Danger action */
    color: white;
    &:hover { background: #cc0000; }
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>