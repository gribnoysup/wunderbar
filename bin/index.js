#! /usr/bin/env node
const mri = require('mri');

const draw = require('../lib');
const { SYMBOLS } = require('../lib/const');

let data = '';

process.stdin.on('data', chunk => {
  data += chunk.toString();
});

process.stdin.on('end', () => {
  const options = mri(process.argv.slice(2));

  const { randomColorOptions: opts = '{}' } = options;
  const { view, sort, min, max, length, format } = options;

  const randomColorOptions = JSON.parse(opts);

  const drawOptions = {
    view,
    sort,
    min,
    max,
    length,
    format,
    randomColorOptions,
  };

  const { chart, scale, legend } = draw(JSON.parse(data), drawOptions);

  process.stdout.write(SYMBOLS.EOL);
  process.stdout.write(
    [chart, scale, legend, ''].join(SYMBOLS.EOL + SYMBOLS.EOL)
  );
});
