import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  
  // --- ESTADO GLOBAL DE CARREGAMENTO ---
  const isLoading = ref(false); // <--- NOVO ESTADO

  // --- CONFIRM DIALOG STATE ---
  const dialog = ref({
    isOpen: false,
    title: '',
    message: '',
    resolve: null as ((value: boolean) => void) | null
  });

  // Chama o dialog e espera a resposta (true/false)
  function confirm(title: string, message: string): Promise<boolean> {
    dialog.value.isOpen = true;
    dialog.value.title = title;
    dialog.value.message = message;
    
    return new Promise((resolve) => {
      dialog.value.resolve = resolve;
    });
  }

  // Chamado pelos botões do Dialog
  function handleChoice(choice: boolean) {
    if (dialog.value.resolve) {
      dialog.value.resolve(choice);
    }
    dialog.value.isOpen = false;
    dialog.value.resolve = null;
  }

  return { 
    isLoading, // <--- EXPORTADO
    dialog, 
    confirm, 
    handleChoice 
  };
});