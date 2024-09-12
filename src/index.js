const drawTextWithTwemoji = require('./drawTextWithTwemoji');
const measureText = require('./measureText');

/**
 * Draws a text with emojis on a canvas context, with optional options.
 *
 * @param {SKRSContext2D} context - The canvas context to draw on.
 * @param {string} text - The text to draw, can include emojis in the form of
 *   `<a?:emoji_name:emoji_id>`.
 * @param {number} x - The x coordinate of the text.
 * @param {number} y - The y coordinate of the text.
 * @param {Object} [options] - Optional options.
 * @param {number} [options.maxWidth] - The maximum width of the text. If the text
 *   exceeds this width, it will be trimmed to fit.
 * @param {number} [options.emojiSideMarginPercent] - The percentage of the font
 *   size to use as the side margin for emojis. Defaults to 10%.
 * @param {number} [options.emojiTopMarginPercent] - The percentage of the font
 *   size to use as the top margin for emojis. Defaults to 10%.
 * @returns {Promise<void>} - A promise that resolves when the drawing is done.
 */
exports.fillTextWithTwemoji = async (context, text, x, y, options = {}) => drawTextWithTwemoji(context, 'fill', text, x, y, options)

/**
 * Strokes a text with emojis on a canvas context, with optional options.
 *
 * @param {SKRSContext2D} context - The canvas context to draw on.
 * @param {string} text - The text to draw, can include emojis in the form of
 *   `<a?:emoji_name:emoji_id>`.
 * @param {number} x - The x coordinate of the text.
 * @param {number} y - The y coordinate of the text.
 * @param {Object} [options] - Optional options.
 * @param {number} [options.maxWidth] - The maximum width of the text. If the text
 *   exceeds this width, it will be trimmed to fit.
 * @param {number} [options.emojiSideMarginPercent] - The percentage of the font
 *   size to use as the side margin for emojis. Defaults to 10%.
 * @param {number} [options.emojiTopMarginPercent] - The percentage of the font
 *   size to use as the top margin for emojis. Defaults to 10%.
 * @returns {Promise<void>} - A promise that resolves when the drawing is done.
 */
exports.strokeTextWithTwemoji = async (context, text, x, y, options = {}) => drawTextWithTwemoji(context, 'stroke', text, x, y, options)

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
exports.measureText = (context, text, options = {}) => measureText(context, text, options)

