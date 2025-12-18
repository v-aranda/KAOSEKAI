<script setup lang="ts">
// Props: Recebe os dados do personagem
const props = defineProps<{
    character: any; // Pode tipar como CharacterData se tiver o tipo importado
}>();

// Emits: Avisa o pai quando clicar no card ou no botão de deletar
const emit = defineEmits(['select', 'delete']);

// --- FUNÇÕES DE TRATAMENTO DE TEXTO ---

// 1. Remove tags HTML (Para evitar quebra de layout)
const stripHtml = (html: string) => {
    if (!html) return '';
    // Usa DOMParser para remover tags, garantindo que nenhum HTML seja renderizado
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
};

// 2. Processa o texto de origem, limpando e retornando o resultado
const processOriginText = (text: string) => {
    const cleanText = stripHtml(text);
    // O CSS fará o limite de 4 linhas visualmente.
    return cleanText || 'Origem Desconhecida.';
};
</script>

<template>
    <div class="card" @click="emit('select', props.character.id)">
        <div class="card-body">
            <h2 class="char-name">{{ props.character.name }}</h2>

            <div class="char-image-container">
                <img v-if="props.character.data.characterImage" :src="props.character.data.characterImage" alt="Retrato"
                    class="char-image" />
                <div v-else class="char-image-placeholder">
                    <img src="/placeholder-character.png" style="object-fit: contain;"
                        alt="Retrato" class="char-image" />
                </div>

                <div class="origin-overlay">
                    <p class="origin-text">{{ processOriginText(props.character.data.origin) }}</p>
                </div>
            </div>
        </div>

        <div class="card-footer">
            <small>ATT: {{ new Date(props.character.updated_at).toLocaleDateString() }}</small>

            <button class="delete-btn" @click.stop="emit('delete', props.character.id)" title="Excluir Personagem">
                <v-icon name="gi-skull-crack" scale="1.4" />
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
/* Estilo Base do Card - BRUTALIST (Com Variáveis Dinâmicas) */
.card {
    background: var(--bg-card);
    border: 3px solid var(--border-main);
    box-shadow: 6px 6px 0px var(--shadow-main);
    
    height: auto;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: all 0.1s;
    text-align: left;
    position: relative;
    padding: 0;
    overflow: hidden;
}

.card:hover {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0px var(--color-accent);
}

.card:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px var(--shadow-main);
}

/* Corpo */
.card-body {
    padding: 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.char-name {
    color: var(--text-primary);
    
    margin: 0 0 15px 0;
    font-size: 1.2rem;
    text-transform: uppercase;
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
}

/* --- IMAGEM QUADRADA --- */
.char-image-container {
    width: 100%;
    aspect-ratio: 1 / 1;
    border: 3px solid var(--border-main);
    background: var(--bg-card);
    
    position: relative;
    overflow: hidden;
}

.char-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.char-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    background: var(--bg-app);
}

/* --- OVERLAY DE ORIGEM (Fundo com Contraste e Blur) --- */
.origin-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    
    // Fundo escuro opaco para fácil leitura
    background: var(--bg-overlay-dark, rgba(0, 0, 0, 0.95));
    
    // Efeito de Blur
    backdrop-filter: blur(2px);
    
    // ⬅️ AJUSTE SOLICITADO: Cor do texto fixada em branco
    color: #fff; 
    
    padding: 15px;
    font-family: monospace;
    font-size: 0.85rem;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    max-height: 100%;
    display: flex;
    align-items: flex-end;
}

/* Aplicação das regras de quebra de linha e limite de 4 linhas */
.origin-text {
    margin: 0;
    // ⬅️ AJUSTE SOLICITADO: Cor do texto fixada em branco
    color: #fff; 
    font-weight: normal;

    /* Regra 1: Quebra de palavra com hifenização */
    hyphens: auto;
    word-break: break-word;

    /* Regra 2: Limite de 4 linhas com ellipsis (...) */
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card:hover .origin-overlay {
    opacity: 1;
}

/* Footer */
.card-footer {
    border-top: 3px solid var(--border-main);
    background: var(--bg-footer);
    
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-footer small {
    color: var(--text-primary);
    font-weight: bold;
    font-size: 0.8rem;
}

.delete-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 5px;
    display: flex;
    align-items: center;
    transition: color 0.2s;
}

.delete-btn:hover {
    color: var(--color-error);
    transform: scale(1.1);
}
</style>