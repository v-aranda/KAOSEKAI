<script setup lang="ts">
import { ref } from 'vue';
import { useCharacterStore } from '../../../../stores/characterStore';
import { uploadImage } from '../../../../services/uploadService';
import ImageCropperDialog from './ImageCropperDialog.vue'; // <--- Importar Cropper

const store = useCharacterStore();
const isUploading = ref(false);

// --- ESTADOS DO CROPPER ---
const showCropper = ref(false);
const pendingImageSrc = ref<string | null>(null);

// --- LÓGICA DE DRAG & DROP (Mantida igual) ---
const draggingId = ref<string | null>(null);
const dragOffset = ref({ x: 0, y: 0 });

const startDrag = (event: MouseEvent, noteId: string, currentX: number, currentY: number) => {
    draggingId.value = noteId;
    dragOffset.value = { x: event.clientX - currentX, y: event.clientY - currentY };
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
};
const onDrag = (event: MouseEvent) => {
    if (!draggingId.value) return;
    const newX = event.clientX - dragOffset.value.x;
    const newY = event.clientY - dragOffset.value.y;
    store.updateNotePosition(draggingId.value, newX, newY);
};
const stopDrag = () => {
    draggingId.value = null;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
};

// --- INTERCEPTAR O PASTE E ABRIR CROPPER ---
const handleBoardPaste = (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            if (!file) return;

            // Cria uma URL local para exibir no modal de recorte
            pendingImageSrc.value = URL.createObjectURL(file);
            showCropper.value = true;
            return;
        }
    }
};

// --- CONFIRMAR RECORTE E FAZER UPLOAD ---
const onCropConfirm = async (croppedBlob: Blob) => {
    showCropper.value = false;

    // Transformar Blob em File para o serviço de upload (compatibilidade)
    const file = new File([croppedBlob], "evidence.jpg", { type: "image/jpeg" });

    try {
        isUploading.value = true;
        const imageUrl = await uploadImage(file);
        store.addNote(imageUrl);
    } catch (error) {
        alert("Erro ao enviar evidência.");
    } finally {
        isUploading.value = false;
        // Limpar URL temporária da memória
        if (pendingImageSrc.value) URL.revokeObjectURL(pendingImageSrc.value);
        pendingImageSrc.value = null;
    }
};

const onCropClose = () => {
    showCropper.value = false;
    if (pendingImageSrc.value) URL.revokeObjectURL(pendingImageSrc.value);
    pendingImageSrc.value = null;
};

const colors = ['#fff740', '#90e0ef', '#ffadad', '#caffbf', '#e0aaff'];
</script>

<template>
    <div class="investigation-board" tabindex="0" @paste.prevent="handleBoardPaste">
        <div class="board-toolbar">
            <button class="add-note-btn" @click="store.addNote()">+ NOVA NOTA</button>
            <span v-if="isUploading" class="uploading-hint">
                <span class="spinner"></span> Revelando foto...
            </span>
            <span v-else class="hint">/// CTRL+V PARA COLAR FOTOS /// ARRASTE PARA ORGANIZAR ///</span>
        </div>

        <div class="canvas-area">
            <div v-for="note in store.char.investigationNotes" :key="note.id" class="sticky-note"
                :class="{ 'is-polaroid': note.imageUrl }" :style="{
                    top: `${note.y}px`,
                    left: `${note.x}px`,
                    backgroundColor: note.imageUrl ? '#ffffff' : note.color,
                    width: `${note.width}px`,
                    height: `${note.height}px`
                }" @mousedown="startDrag($event, note.id, note.x, note.y)">
                <div class="note-header">
                    <div class="color-picker" v-if="!note.imageUrl">
                        <span v-for="c in colors" :key="c" :style="{ background: c }"
                            @click.stop="store.updateNoteColor(note.id, c)"></span>
                    </div>
                    <div v-else></div>
                    <button class="delete-note" @click.stop="store.removeNote(note.id)">×</button>
                </div>

                <div v-if="note.imageUrl" class="polaroid-content">
                    <div class="image-frame">
                        <img :src="note.imageUrl" alt="evidência" draggable="false">
                    </div>
                    <textarea v-model="note.text" placeholder="Legenda..." @mousedown.stop
                        class="caption-input"></textarea>
                </div>

                <textarea v-else v-model="note.text" placeholder="Anotação..." @mousedown.stop
                    class="note-input"></textarea>
            </div>
        </div>

        <ImageCropperDialog :isOpen="showCropper" :imageSrc="pendingImageSrc" @close="onCropClose"
            @confirm="onCropConfirm" />
    </div>
</template>

<style scoped lang="scss">
/* (MANTENHA TODO O CSS ANTERIOR, ESTÁ PERFEITO) */
.investigation-board {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    outline: none;
}

.board-toolbar {
    padding: 10px;
    background: #fff;
    border-bottom: 2px solid black;
    display: flex;
    align-items: center;
    gap: 15px;
}

.add-note-btn {
    background: black;
    color: white;
    border: none;
    padding: 8px 15px;
    font-family: 'Share Tech Mono', monospace;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.3);

    &:hover {
        background: #333;
        transform: translateY(-1px);
    }

    &:active {
        transform: translate(2px, 2px);
        box-shadow: none;
    }
}

.hint {
    color: #666;
    font-size: 0.8rem;
    font-family: 'Share Tech Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.canvas-area {
    flex-grow: 1;
    position: relative;
    overflow: hidden;
    background-color: #f9f9f9;
    background-image: radial-gradient(#ccc 1px, transparent 1px);
    background-size: 20px 20px;
}

.uploading-hint {
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    color: blue;
}

.spinner {
    width: 12px;
    height: 12px;
    border: 2px solid blue;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.sticky-note {
    position: absolute;
    padding: 10px;
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    cursor: grab;
    transition: transform 0.1s, box-shadow 0.1s;

    &:active {
        cursor: grabbing;
        box-shadow: 5px 10px 15px rgba(0, 0, 0, 0.15);
        transform: scale(1.02);
        z-index: 100;
    }

    .note-input {
        flex-grow: 1;
        background: transparent;
        border: none;
        resize: none;
        font-family: 'Indie Flower', 'Comic Sans MS', cursive;
        font-size: 1.1rem;
        color: #222;
        outline: none;
        width: 100%;
        height: 100%;
        line-height: 1.2;
    }
}

.sticky-note.is-polaroid {
    padding: 12px 12px 35px 12px;
    background-color: #ffffff !important;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
    border: 1px solid #eee;
    transform: rotate(1deg);

    &:active {
        transform: scale(1.02) rotate(0deg);
    }

    .polaroid-content {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .image-frame {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f0f0;
        border: 1px solid #ddd;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
    }

    .caption-input {
        height: 30px;
        margin-top: 8px;
        background: transparent;
        border: none;
        outline: none;
        resize: none;
        text-align: center;
        font-family: 'Indie Flower', cursive;
        color: #555;
        font-size: 0.9rem;

        &::placeholder {
            color: #ccc;
        }
    }
}

.note-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    opacity: 0;
    transition: opacity 0.2s;

    .sticky-note:hover & {
        opacity: 1;
    }
}

.color-picker {
    display: flex;
    gap: 3px;

    span {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.2);
        cursor: pointer;

        &:hover {
            border-color: black;
            transform: scale(1.2);
        }
    }
}

.delete-note {
    background: none;
    border: none;
    color: #555;
    font-weight: bold;
    font-size: 1.2rem;
    cursor: pointer;

    &:hover {
        color: red;
    }
}
</style>