const express = require('express');
const { createCanvas } = require('@napi-rs/canvas');
const base64 = require('urlsafe-base64');

const wt = require('../src/index');

const app = express();

app.get('/', async (req, res) => {
  const canvas = createCanvas(200, 500);
  const context = canvas.getContext('2d');

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, 200, 500);

  context.fillStyle = '#888888';
  context.font = '18px serif';
  context.textAlign = "left";
  context.fillStyle = '#888888';
  await wt.fillTextWithTwemoji(context, 'I am left aligned 😳', 10, 100, {maxWidth: 50});

  context.textAlign = "center";
  await wt.fillTextWithTwemoji(context, '我々✨は宇宙人👽だ', 100, 150, {maxWidth: 100});

  context.textAlign = "right";
  await wt.fillTextWithTwemoji(context, 'I am right aligned 😳', 190, 200, {maxWidth: 100});

  context.textAlign = "left";
  await wt.fillTextWithTwemoji(context, 'left 😳', 10, 250);

  context.textAlign = "center";
  await wt.fillTextWithTwemoji(context, 'center 😳', 100, 300);

  context.textAlign = "right";
  await wt.fillTextWithTwemoji(context, 'right 😳', 190, 350);

  if (req.query.text) {
    await wt.fillTextWithTwemoji(context, req.query.text, 10, 400);
  }

  const b64 = canvas.toDataURL().split(',');
  const image = base64.decode(b64[1]);

  res.set('Content-Type', 'image/png');
  return res.send(image);
});

app.listen('4002', () => console.log('Example app listening on port http://localhost:4002'));
