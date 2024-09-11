const drawTextWithTwemoji = require('./drawTextWithTwemoji');
const measureText = require('./measureText');

exports.fillTextWithTwemoji = async (context, text, x, y, options = {}) => await drawTextWithTwemoji(context, 'fill', text, x, y, options)

exports.strokeTextWithTwemoji = async (context, text, x, y, options = {}) => await drawTextWithTwemoji(context, 'stroke', text, x, y, options)

exports.measureText = (context, text, options = {}) => measureText(context, text, options)
