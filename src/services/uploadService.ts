// src/services/uploadService.ts

const API_KEY = '6713a4bc7dfda226a1bb7f60ff8da821'; // <--- COLOCAR SUA CHAVE DO IMGBB

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return data.data.url; // Retorna a URL direta da imagem na nuvem
    } else {
      throw new Error('Falha no upload da imagem');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}