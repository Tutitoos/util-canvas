const { parse: parseTwemoji } = require('twemoji-parser');

/*
 * Split Text
 * ex)
 *  '君👼の味方🤝だよ'
 *  > ['君', TwemojiObj(👼), 'の味方', TwemojiObj(🤝), 'だよ']
 */

const discordEmojiPattern = "<a?:\\w+:(\\d{17,19})>";

/**
 * Parses Discord emojis from a given array of text entities.
 *
 * @param {Array<string|{url: string}>} textEntities - Array of text entities.
 * @returns {Array<string|{url: string}>} The array of text entities with Discord
 * emojis parsed.
 */
function parseDiscordEmojis(textEntities) {
  const newTextEntities = [];

  for (const entity of textEntities) {
    if (typeof entity === "string")
      for (const word of entity.replace(new RegExp(discordEmojiPattern, "g"), "\u200b$&\u200b").split("\u200b")) {
        const match = word.match(new RegExp(discordEmojiPattern));
        newTextEntities.push(match ? { url: `https://cdn.discordapp.com/emojis/${match[1]}.png` } : word);
      }

    else newTextEntities.push(entity);
  }

  return newTextEntities;
}

/**
 * Splits a text into an array of strings and Twemoji objects.
 *
 * @param {string} text The text to split.
 * @returns {Array<string|{url: string}>} The array of strings and Twemoji objects.
 */
module.exports = function splitEntitiesFromText(text) {
  const twemojiEntities = parseTwemoji(text, {
    assetType: "png",
  });

  let unparsedText = text;
  let lastTwemojiIndice = 0;
  const textEntities = [];

  for (const twemoji of twemojiEntities) {
    textEntities.push(
      unparsedText.slice(0, twemoji.indices[0] - lastTwemojiIndice)
    );

    twemoji.url =  twemoji.url.replace("https://twemoji.maxcdn.com/", "https://jdecked.github.io/twemoji/");

    textEntities.push(twemoji);

    unparsedText = unparsedText.slice(twemoji.indices[1] - lastTwemojiIndice);
    lastTwemojiIndice = twemoji.indices[1];
  }

  textEntities.push(unparsedText);

  return parseDiscordEmojis(textEntities);
}
