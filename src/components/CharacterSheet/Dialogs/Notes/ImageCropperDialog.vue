<script setup lang="ts">
import { ref } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

interface Props {
  isOpen: boolean;
  imageSrc: string | null;
  // Nova prop opcional. Se não passar, o recorte é livre.
  aspectRatio?: number; 
}

// Valor padrão 0 significa livre/dinâmico na lib
const props = withDefaults(defineProps<Props>(), {
  aspectRatio: 0 
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', blob: Blob): void;
}>();

const cropperRef = ref<any>(null);

const handleConfirm = () => {
  const { canvas } = cropperRef.value.getResult();
  if (canvas) {
    canvas.toBlob((blob: Blob | null) => {
      if (blob) emit('confirm', blob);
    }, 'image/jpeg');
  }
};
</script>

<template>
  <div v-if="isOpen && imageSrc" class="crop-overlay">
    <div class="crop-container">
      <div class="crop-header">
        <h3>AJUSTAR IMAGEM</h3>
        <button class="close-btn" @click="$emit('close')">CANCELAR</button>
      </div>

      <div class="cropper-wrapper">
        <Cropper
          ref="cropperRef"
          class="cropper"
          :src="imageSrc"
          :stencil-props="{
            // Se passar prop, usa ela. Senão 0 (livre).
            aspectRatio: props.aspectRatio,
            // Linhas de guia (regra dos terços + centro)
            lines: {}, 
            handlers: {}, 
            movable: true,
            scalable: true
          }"
        />
      </div>

      <div class="crop-footer">
        <button class="confirm-btn" @click="handleConfirm">CONFIRMAR RECORTE</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.crop-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.85); z-index: 9999;
  display: flex; justify-content: center; align-items: center;
  backdrop-filter: blur(4px);
}

.crop-container {
  background: #f4f4f4; width: 90%; max-width: 600px;
  border: 3px solid black; 
  box-shadow: 0 0 30px rgba(0,0,0,0.8);
  display: flex; flex-direction: column;
}

.crop-header {
  background: white; border-bottom: 2px solid black; padding: 10px;
  display: flex; justify-content: space-between; align-items: center;
  h3 { margin: 0; font-family: 'Share Tech Mono', monospace; font-size: 1.2rem; }
}

.cropper-wrapper {
  background: #222;
  /* Altura fixa para o editor */
  height: 500px; 
  position: relative;
}

.cropper { height: 100%; width: 100%; }

.crop-footer {
  padding: 15px; background: white; border-top: 2px solid black;
  display: flex; justify-content: flex-end;
}

.close-btn {
  background: none; border: none; color: red; font-weight: bold; cursor: pointer; font-family: 'Share Tech Mono', monospace;
  &:hover { text-decoration: underline; }
}

.confirm-btn {
  background: black; color: white; border: none; padding: 10px 20px;
  font-family: 'Share Tech Mono', monospace; font-weight: bold; font-size: 1rem; cursor: pointer;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.3);
  &:hover { transform: translate(-1px, -1px); box-shadow: 5px 5px 0 rgba(0,0,0,0.3); background: #333; }
  &:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 rgba(0,0,0,0.3); }
}
</style>