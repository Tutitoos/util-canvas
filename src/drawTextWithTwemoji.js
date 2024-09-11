const splitEntitiesFromText = require("./utils/splitEntitiesFromText");
const loadTwemojiImageByUrl = require("./utils/loadTwemojiImageByUrl");
const getFontSizeByCssFont = require("./utils/getFontSizeByCssFont");
const measureText = require("./measureText");

const { Image } = require('@napi-rs/canvas');

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
			console.log(entity.url, emoji, emoji instanceof Image);

			try {
				context.drawImage(
					emoji,
					textLeftMargin + x + currentWidth + emojiSideMargin,
					y + emojiTopMargin - fontSize - baseLine,
					fontSize,
					fontSize,
				);
			} catch (error) {
				console.error(error);
			}

			currentWidth += fontSize + emojiSideMargin * 2;
		}
	}

	// Restore
	if (textAlign) {
		context.textAlign = textAlign;
	}
};
