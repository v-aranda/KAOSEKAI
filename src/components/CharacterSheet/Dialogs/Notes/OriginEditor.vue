<script setup lang="ts">
import { ref, onMounted, watch, reactive } from 'vue';
import { uploadImage } from '../../../../services/uploadService';

// --- ÍCONES ---
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { 
  RiBold, RiItalic, RiUnderline, 
  RiH1, RiH2, RiListUnordered 
} from "oh-vue-icons/icons";

addIcons(RiBold, RiItalic, RiUnderline, RiH1, RiH2, RiListUnordered);

interface Props {
  modelValue: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

const editorRef = ref<HTMLElement | null>(null);
const isUploading = ref(false);

// --- ESTADO DOS BOTÕES ---
const activeFormats = reactive({
  bold: false,
  italic: false,
  underline: false,
  h3: false, // H1 visual
  h4: false, // H2 visual
  unorderedList: false
});

// Função que pergunta ao navegador o que está ativo no cursor
const checkFormats = () => {
  if (!document.getSelection()?.rangeCount) return;

  activeFormats.bold = document.queryCommandState('bold');
  activeFormats.italic = document.queryCommandState('italic');
  activeFormats.underline = document.queryCommandState('underline');
  activeFormats.unorderedList = document.queryCommandState('insertUnorderedList');
  
  // Para blocos (H1, H2) usamos queryCommandValue
  const blockValue = document.queryCommandValue('formatBlock');
  activeFormats.h3 = blockValue === 'h3';
  activeFormats.h4 = blockValue === 'h4';
};

const format = (command: string, value: string | undefined = undefined) => {
  document.execCommand(command, false, value);
  updateContent();
  checkFormats(); // Atualiza o estado dos botões logo após clicar
  editorRef.value?.focus();
};

const updateContent = () => {
  if (editorRef.value) {
    emit('update:modelValue', editorRef.value.innerHTML);
  }
};

const handlePaste = async (event: ClipboardEvent) => {
  // ... (Lógica de Paste mantida igual, omitida aqui para economizar espaço)
  // ... Copie a lógica do handlePaste anterior se precisar re-colar ...
  // Apenas lembre de chamar checkFormats() se necessário, mas no paste não muda estilo.
  
  // (Vou incluir a versão encurtada aqui, mas mantenha a sua completa de upload)
  const items = event.clipboardData?.items;
  if (!items) return;
  for (const item of items) {
    if (item.type.indexOf('image') !== -1) {
      event.preventDefault();
      const file = item.getAsFile();
      if (!file) return;
      
      const placeholderId = `uploading-${Date.now()}`;
      document.execCommand('insertHTML', false, `<span id="${placeholderId}" style="color: blue;">[Uploading...]</span>`);
      
      try {
        isUploading.value = true;
        const imageUrl = await uploadImage(file);
        const placeholderEl = document.getElementById(placeholderId);
        if (placeholderEl) {
          const range = document.createRange();
          range.selectNode(placeholderEl);
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
          document.execCommand('insertImage', false, imageUrl);
          sel?.removeAllRanges();
        }
      } catch (e) { document.getElementById(placeholderId)?.remove(); } 
      finally { isUploading.value = false; updateContent(); }
      return;
    }
  }
};

onMounted(() => {
  if (editorRef.value) editorRef.value.innerHTML = props.modelValue;
});

watch(() => props.modelValue, (newVal) => {
  if (editorRef.value && editorRef.value.innerHTML !== newVal) {
    editorRef.value.innerHTML = newVal;
  }
});
</script>

<template>
  <div class="editor-wrapper" :class="{ 'uploading': isUploading }">
    
    <div class="editor-dock">
      
      <div class="dock-group">
        <button 
          @click="format('bold')" 
          title="Negrito" 
          class="dock-btn"
          :class="{ active: activeFormats.bold }"
        >
          <OhVueIcon name="ri-bold" scale="1" />
        </button>
        <button 
          @click="format('italic')" 
          title="Itálico" 
          class="dock-btn"
          :class="{ active: activeFormats.italic }"
        >
          <OhVueIcon name="ri-italic" scale="1" />
        </button>
        <button 
          @click="format('underline')" 
          title="Sublinhado" 
          class="dock-btn"
          :class="{ active: activeFormats.underline }"
        >
          <OhVueIcon name="ri-underline" scale="1" />
        </button>
      </div>

      <div class="dock-separator"></div>

      <div class="dock-group">
        <button 
          @click="format('formatBlock', 'H3')" 
          title="Título Principal" 
          class="dock-btn"
          :class="{ active: activeFormats.h3 }"
        >
          <OhVueIcon name="ri-h-1" scale="1" />
        </button>
        <button 
          @click="format('formatBlock', 'H4')" 
          title="Subtítulo" 
          class="dock-btn"
          :class="{ active: activeFormats.h4 }"
        >
          <OhVueIcon name="ri-h-2" scale="1" />
        </button>
      </div>

      <div class="dock-separator"></div>

      <div class="dock-group">
        <button 
          @click="format('insertUnorderedList')" 
          title="Lista" 
          class="dock-btn"
          :class="{ active: activeFormats.unorderedList }"
        >
          <OhVueIcon name="ri-list-unordered" scale="1" />
        </button>
      </div>

      <div v-if="isUploading" class="upload-indicator">
        <div class="spinner"></div>
      </div>

    </div>

    <div 
      ref="editorRef"
      class="editor-content" 
      contenteditable="true"
      @input="updateContent"
      @paste="handlePaste" 
      @keyup="checkFormats"
      @mouseup="checkFormats"
      placeholder="Descreva a origem do seu personagem, ou alguma informação importante..."
    ></div>
  </div>
</template>

<style scoped lang="scss">
/* ... (Estilos anteriores mantidos) ... */

.editor-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  background: white;
}

.editor-dock {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 15px;
  background: #111;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  border: 1px solid #333;
}

.dock-group { display: flex; gap: 5px; }

.dock-btn {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 255, 255, 0.2); /* Cyan transparente */
    color: cyan;
    transform: translateY(-2px);
  }

  /* ESTILO ATIVO (HIGHLIGHT) */
  &.active {
    background: cyan;
    color: black;
    box-shadow: 0 0 8px cyan;
    transform: translateY(0); /* Fica fixo, sem pular como no hover */
  }

  &:active { transform: scale(0.95); }
}

.dock-separator { width: 1px; height: 20px; background: #444; }

/* ... (Resto do CSS igual: upload-indicator, editor-content, etc) ... */
.upload-indicator { margin-left: 10px; .spinner { width: 15px; height: 15px; border: 2px solid cyan; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; } }
@keyframes spin { to { transform: rotate(360deg); } }
.editor-content { flex-grow: 1; padding: 70px 40px 40px 40px; overflow-y: auto; font-family: 'Roboto Mono', monospace; font-size: 1rem; line-height: 1.6; color: #111; outline: none; &:empty:before { content: attr(placeholder); color: #999; font-style: italic; } &::-webkit-scrollbar { width: 8px; } &::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; } :deep(h3) { font-size: 1.8rem; border-bottom: 2px solid black; margin-top: 20px; margin-bottom: 10px; font-family: 'Share Tech Mono', monospace; text-transform: uppercase; } :deep(h4) { font-size: 1.3rem; font-weight: bold; margin-top: 15px; margin-bottom: 5px; color: #444; border-left: 4px solid cyan; padding-left: 10px; } :deep(ul) { padding-left: 20px; margin: 10px 0; } :deep(li) { margin-bottom: 5px; } :deep(img) { max-width: 100%; height: auto; border: 1px solid #ccc; box-shadow: 5px 5px 0px rgba(0,0,0,0.1); margin: 15px 0; display: block; } }
</style>