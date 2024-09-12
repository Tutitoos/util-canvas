const { loadImage, Image } = require('@napi-rs/canvas');

const cacheImages = new Map();

/**
 * @description Loads a Twemoji image by URL. If the image was already
 *              loaded, it returns the cached one.
 * @param {string} url The URL of the Twemoji image.
 * @returns {Promise<Image>} A promise with the loaded image.
 * @throws {Error} If the image wasn't loaded successfully.
 */
module.exports =  async function loadTwemojiImageByUrl(url) {
  // biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
  return new Promise(async (resolve, reject) => {
    try {
        if (cacheImages.has(url)) {
          return resolve(cacheImages.get(url));
        }

        const image = await loadImage(url);
        if (!image) {
         throw new Error(`Image not loaded from ${url}`)
        }

        if (!(image instanceof Image)) {
          throw new Error(`Loaded object is not an instance of Image from ${url}`)
        }

        if (!url.includes("discord")) cacheImages.set(url, image);

        resolve(image);
    } catch (error) {
        reject(error);
    }
  });
}
