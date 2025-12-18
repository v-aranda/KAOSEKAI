<script setup lang="ts">
import { ref, computed } from 'vue';
import CharacterCropDialog from '../Dialogs/CharacterCropDialog.vue';
import { uploadImage } from '../../../services/uploadService';

interface Props {
  image?: string | null;
  placeholderSrc?: string;
}

const props = withDefaults(defineProps<Props>(), {
  image: null,
  placeholderSrc: '/placeholder-character.png'
});

const emit = defineEmits<{
  (e: 'update:image', value: string): void
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const isUploading = ref(false);
const showCropper = ref(false);
const pendingImageSrc = ref<string | null>(null);

const displayImage = computed(() => props.image ? props.image : props.placeholderSrc);

const triggerUpload = () => fileInput.value?.click();

const handleContainerClick = () => {
  if (!props.image) {
    triggerUpload();
  }
};

const processFile = (file?: File) => {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    alert('Por favor, selecione um arquivo de imagem.');
    return;
  }
  pendingImageSrc.value = URL.createObjectURL(file);
  showCropper.value = true;
  if (fileInput.value) fileInput.value.value = '';
};

const onCropConfirm = async (croppedBlob: Blob) => {
  showCropper.value = false;
  const file = new File([croppedBlob], "avatar.png", { type: "image/png" });

  try {
    isUploading.value = true;
    const imageUrl = await uploadImage(file);
    emit('update:image', imageUrl);
  } catch (error) {
    alert("Erro ao fazer upload da imagem.");
  } finally {
    isUploading.value = false;
    if (pendingImageSrc.value) URL.revokeObjectURL(pendingImageSrc.value);
    pendingImageSrc.value = null;
  }
};

const onCropClose = () => {
  showCropper.value = false;
  if (pendingImageSrc.value) URL.revokeObjectURL(pendingImageSrc.value);
  pendingImageSrc.value = null;
};

const handleFileChange = (e: Event) => processFile((e.target as HTMLInputElement).files?.[0]);
const onDrop = (e: DragEvent) => { isDragging.value = false; processFile(e.dataTransfer?.files[0]); };
</script>

<template>
  <div class="uploader-container"
    :class="{ 'is-dragging': isDragging, 'has-image': !!image, 'is-loading': isUploading }"
    @click="handleContainerClick" @dragover.prevent @dragenter.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false" @drop.prevent="onDrop">
    
    <img :src="displayImage" alt="Personagem" class="char-img" :class="{ 'is-placeholder': !image }" />

    <div v-if="isUploading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <div class="upload-hint" @click.stop="triggerUpload">
      <span>{{ image ? 'ALTERAR FOTO' : 'ADICIONAR FOTO' }}</span>
    </div>

    <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" hidden />

    <CharacterCropDialog :isOpen="showCropper" :imageSrc="pendingImageSrc" @close="onCropClose"
      @confirm="onCropConfirm" />
  </div>
</template>

<style scoped lang="scss">
.uploader-container {
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible; // Alterado para visible para permitir que elementos internos saltem se necessário
  border-radius: 0 0 10px 10px;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &.has-image {
    cursor: default;
  }

  &.is-dragging {
    background: rgba(0, 255, 255, 0.1);
    box-shadow: inset 0 0 20px cyan;
    border: 2px dashed cyan;
  }

  /* Garante que o botão apareça ao passar o mouse mesmo se houver sobreposição */
  &:hover .upload-hint {
    opacity: 1;
    transform: translateX(-50%) translateY(-5px);
  }

  .char-img.is-placeholder {
    opacity: 0.7;
    filter: grayscale(50%) drop-shadow(5px 5px 0px rgba(0, 0, 0, 0.1));
  }
}

.char-img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: all 0.3s ease;
  z-index: 6;
}

.upload-hint {
  position: absolute;
  bottom: 130px; // Subimos o botão para sair de trás do nome do personagem
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9); // Mais opaco para ler melhor sobre o avatar
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.85rem;
  font-weight: bold;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  pointer-events: auto;
  cursor: pointer;

  border: 2px solid cyan;
  box-shadow: 4px 4px 0px rgb(171, 0, 0);
  user-select: none;
  
  // AUMENTADO: z-index muito alto para garantir que fique sobre o nome do personagem
  z-index: 100; 

  &:hover {
    background: #000;
    box-shadow: 2px 2px cyan, -2px -2px rgb(192, 0, 0);
    transform: translateX(-50%) scale(1.1);
  }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 110; // Acima da hint
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid cyan;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>