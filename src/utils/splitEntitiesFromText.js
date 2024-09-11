const { parse } = require('twemoji');

/*
 * Split Text
 * ex)
 *  '君👼の味方🤝だよ'
 *  > ['君', TwemojiObj(👼), 'の味方', TwemojiObj(🤝), 'だよ']
 */

const discordEmojiPattern = "<a?:\\w+:(\\d{17,19})>";

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

module.exports = function splitEntitiesFromText(text) {
  const twemojiEntities = parse(text, (iconId) => `https://jdecked.github.io/twemoji/v/latest/72x72/${iconId}.png`);
  const emojis = twemojiEntities?.split('src="').map((e) => e.split('"/>')[0]).filter(e => e.includes('twemoji'));

  let count = 0;
  let newText = twemojiEntities;
  while (true) {
    if (!newText.includes("<img")) break;

    const index1 = newText.indexOf('<img');
    const index2 = newText.indexOf('/>');
    if (index1 === -1 || index2 === -1) break;

    const removeText = newText.slice(index1,  index2 + 2);

    newText = newText.replace(removeText, `{${count}}`);
    count++;
  }

  const list = [];

  for (let i = 0; i < emojis.length; i++) {
    const emoji = emojis[i];

    const index = newText.indexOf(`{${i}}`);

    list.push({
      url: emoji,
      indices: [index - 1, index + 1],
    });
  }

  let unparsedText = text;
  let lastTwemojiIndice = 0;
  const textEntities = [];

  for (const twemoji of list) {
    textEntities.push(
      unparsedText.slice(0, twemoji.indices[0] - lastTwemojiIndice)
    );

    textEntities.push(twemoji);

    unparsedText = unparsedText.slice(twemoji.indices[1] - lastTwemojiIndice);
    lastTwemojiIndice = twemoji.indices[1];
  }

  textEntities.push(unparsedText);

  return parseDiscordEmojis(textEntities);
}
