## Installation
```shell
$ npm install util-canvas
```
[npm](util-canvas)

## Quick Example
```javascript
const { createCanvas } = require('@napi-rs/canvas');
const { fillTextWithTwemoji } = require('util-canvas');

async function main () {
    const canvas = createCanvas(200, 200);
    const context = canvas.getContext('2d');

    context.fillStyle = '#000000';
    context.font = '30px Arial';
    await fillTextWithTwemoji(context, 'emoji 😉 discord emoji <:id:name>', 100, 100);
}

main();
```
