#! /usr/bin/env node
const mri = require('mri');

const draw = require('../lib');

let data = '';

process.stdin.on('data', chunk => {
  data += chunk.toString();
});

process.stdin.on('end', () => {
  const { type, min, max, length } = mri(process.argv.slice(2));
  const { chart, scale, legend } = draw(JSON.parse(data), { type, min, max, length });

  process.stdout.write('\n');
  process.stdout.write([chart, scale, legend, ''].join('\n\n'));
});
