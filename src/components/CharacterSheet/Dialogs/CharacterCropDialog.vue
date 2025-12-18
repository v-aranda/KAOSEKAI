<script setup lang="ts">
import { ref } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

interface Props {
  isOpen: boolean;
  imageSrc: string | null;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', blob: Blob): void;
}>();

const cropperRef = ref<any>(null);

const handleConfirm = () => {
  const { canvas } = cropperRef.value.getResult({
    width: 500,
    height: 500
  });
  
  if (canvas) {
    canvas.toBlob((blob: Blob | null) => {
      if (blob) emit('confirm', blob);
    }, 'image/png');
  }
};
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen && imageSrc" class="crop-overlay">
      <div class="crop-container">
        
        <div class="crop-header">
          <h3>FOTO DE PERFIL (1:1)</h3>
          <button class="close-btn" @click="$emit('close')">CANCELAR</button>
        </div>

        <div class="cropper-wrapper">
          <Cropper
            ref="cropperRef"
            class="cropper"
            :src="imageSrc"
            :stencil-props="{
              handlers: {},
              movable: true,
              scalable: true,
              aspectRatio: 1,
              lines: { vertical: 2, horizontal: 2 },
            }"
            image-restriction="none" 
          />
        </div>

        <div class="crop-footer">
          <div class="hint">Use Scroll para Zoom</div>
          <button class="confirm-btn" @click="handleConfirm">SALVAR PERFIL</button>
        </div>
        
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.crop-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  z-index: 99999;
  display: flex; justify-content: center; align-items: center;
  backdrop-filter: blur(5px);
}
.crop-container {
  background: var(--bg-app); 
  width: 95%; max-width: 600px;
  border: 3px solid var(--border-main); 
  box-shadow: 10px 10px 0px var(--shadow-main);
  display: flex; flex-direction: column;
}
.crop-header {
  background: var(--bg-card); 
  border-bottom: 2px solid var(--border-main); 
  padding: 15px;
  display: flex; justify-content: space-between; align-items: center;
  h3 { margin: 0; font-family: 'Share Tech Mono', monospace; color: var(--text-primary); letter-spacing: 2px; }
}
.cropper-wrapper {
  background: var(--bg-card);
  height: 450px; position: relative; overflow: hidden;
}
.cropper { height: 100%; width: 100%; }

/* Estilização customizada dos componentes internos do Cropper */
:deep(.vue-rectangle-stencil) { border: 2px solid var(--color-accent) !important; }

.crop-footer { 
  padding: 15px; background: var(--bg-card); 
  border-top: 2px solid var(--border-main); 
  display: flex; justify-content: space-between; align-items: center; 
}
.hint { color: var(--text-secondary); font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; }
.close-btn { 
  background: none; border: none; color: var(--text-primary); cursor: pointer; 
  font-family: 'Share Tech Mono', monospace; font-weight: bold;
  &:hover { color: var(--color-error); } 
}
.confirm-btn { 
  background: var(--color-accent); color: var(--bg-card); border: none; padding: 10px 25px; 
  font-family: 'Share Tech Mono', monospace; font-weight: bold; cursor: pointer;
  box-shadow: 4px 4px 0px var(--shadow-main);
  &:hover { filter: brightness(1.2); } 
}
</style>