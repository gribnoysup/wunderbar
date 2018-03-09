#! /usr/bin/env node
const mri = require('mri');

const draw = require('../lib');

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

  process.stdout.write('\n');
  process.stdout.write([chart, scale, legend, ''].join('\n\n'));
});
