#! /usr/bin/env node
const mri = require('mri');

const draw = require('../lib');

let data = '';

process.stdin.on('data', chunk => {
  data += chunk.toString();
});

process.stdin.on('end', () => {
  const { view, sort, min, max, length, randomColorOptions: opts } = mri(
    process.argv.slice(2)
  );

  const randomColorOptions = JSON.parse(opts);

  const { chart, scale, legend } = draw(JSON.parse(data), {
    view,
    sort,
    min,
    max,
    length,
    randomColorOptions,
  });

  process.stdout.write('\n');
  process.stdout.write([chart, scale, legend, ''].join('\n\n'));
});
