const splitEntitiesFromText = require("./utils/splitEntitiesFromText");
const loadTwemojiImageByUrl = require("./utils/loadTwemojiImageByUrl");
const getFontSizeByCssFont = require("./utils/getFontSizeByCssFont");
const measureText = require("./measureText");

/**
 * Draws a text with emojis on a canvas context, with optional options.
 *
 * @param {SKRSContext2D} context - The canvas context to draw on.
 * @param {"fill"|"stroke"} fillType - The type of drawing to do.
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
module.exports = async function drawTextWithEmoji(
	context,
	fillType,
	text,
	x,
	y,
	{
		maxWidth = Number.POSITIVE_INFINITY,
		emojiSideMarginPercent = 0.1,
		emojiTopMarginPercent = 0.1,
	} = {},
) {
	const textEntities = splitEntitiesFromText(text);
	const fontSize = getFontSizeByCssFont(context.font);
	const baseLine = context.measureText("").alphabeticBaseline;
	const textAlign = context.textAlign;

	const emojiSideMargin = fontSize * emojiSideMarginPercent;
	const emojiTopMargin = fontSize * emojiTopMarginPercent;

	const textWidth = measureText(context, text, {
		emojiSideMarginPercent,
	}).width;

	// for Text align
	let textLeftMargin = 0;

	if (!["", "left", "start"].includes(textAlign)) {
		context.textAlign = "left";

		switch (textAlign) {
			case "center":
				textLeftMargin = -textWidth / 2;
				break;

			case "right":
			case "end":
				textLeftMargin = -textWidth;
				break;
		}
	}

	// Drawing
	let currentWidth = 0;

	for (const entity of textEntities) {
		if (typeof entity === "string") {
			// Common text case
			if (fillType === "fill") {
				context.fillText(entity, textLeftMargin + x + currentWidth, y);
			} else {
				context.strokeText(entity, textLeftMargin + x + currentWidth, y);
			}

			currentWidth += context.measureText(entity).width;
		} else {
			// Emoji case
			const emoji = await loadTwemojiImageByUrl(entity.url);

			try {
				context.drawImage(
					emoji,
					textLeftMargin + x + currentWidth + emojiSideMargin,
					y + emojiTopMargin - fontSize - baseLine,
					fontSize,
					fontSize,
				);
			} catch (error) {
				console.error(`Error in context.drawImage: ${error.message} from ${entity.url}`);
			}

			currentWidth += fontSize + emojiSideMargin * 2;
		}
	}

	// Restore
	if (textAlign) {
		context.textAlign = textAlign;
	}
};
