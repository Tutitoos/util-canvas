const splitEntitiesFromText = require('./utils/splitEntitiesFromText');
const getFontSizeByCssFont = require('./utils/getFontSizeByCssFont');

/**
 * Measures the width of a given text with emojis on a canvas context.
 *
 * @param {SKRSContext2D} context - The canvas context to measure on.
 * @param {string} text - The text to measure, can include emojis in the form of
 *   `<a?:emoji_name:emoji_id>`.
 * @param {Object} [options] - Optional options.
 * @param {number} [options.emojiSideMarginPercent] - The percentage of the font
 *   size to use as the side margin for emojis. Defaults to 10%.
 * @returns {Object} - An object with `width` and `alphabeticBaseline` properties.
 */
module.exports = function measureText (
  context,
  text,
  {
    emojiSideMarginPercent = 0.1
  } = {}
) {
  const textEntities = splitEntitiesFromText(text);
  const fontSize = getFontSizeByCssFont(context.font);

  const emojiSideMargin = fontSize * emojiSideMarginPercent;

  let currentWidth = 0;

  for (const element of textEntities) {
    const entity = element;
    if (typeof entity === 'string') {
      // Common text case
      currentWidth += context.measureText(entity).width;
    } else {
      // Emoji case
      currentWidth += fontSize + (emojiSideMargin * 2);
    }
  }

  const measured = context.measureText('');

  return {
    width: currentWidth,
    alphabeticBaseline: measured.alphabeticBaseline
  };
}
