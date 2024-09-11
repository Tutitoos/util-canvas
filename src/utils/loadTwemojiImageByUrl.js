const { loadImage, Image } = require('@napi-rs/canvas');

const cachedTwemojiImages = new Map();

module.exports =  async function loadTwemojiImageByUrl (url) {
  // biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
  return new Promise(async (res, rej) => {
    try {
        if (cachedTwemojiImages.has(url)) {
          return res(cachedTwemojiImages.get(url));
        }

        const image = await loadImage(url);
        if (image instanceof Image) {
          if (!url.includes("discord")) {
            cachedTwemojiImages.set(url, image);
          }

          return res(image);
        }

        rej(new Error("La URL no devolvió una instancia de Image válida."));
    } catch (error) {
        console.error("Error al cargar la imagen: ", error);
        rej(error); // Rechaza la promesa en caso de error
    }
  });
}
