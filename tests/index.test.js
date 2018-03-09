const stripAnsi = require('strip-ansi');

const data = require('./__fixtures__/age-distrib-germany.json');
const smallData = require('./__fixtures__/balance.json');

const draw = require('../lib');

describe('draw', () => {
  const outputResult = (data, options) => {
    const { chart, scale, legend } = draw(data, options);
    return '\n' + stripAnsi([chart, scale, legend].join('\n\n')).trim() + '\n';
  };

  it('should provide result with chart, scale and legend', () => {
    expect(outputResult(data, { length: 100 })).toMatchSnapshot();
  });

  it('should provide result custom value formatter', () => {
    expect(
      outputResult(data, { length: 100, format: () => 'meow :3' })
    ).toMatchSnapshot();
  });

  it('should provide result with prettified values and sorted charts', () => {
    expect(
      outputResult(smallData, { length: 100, format: '0.0e+0', sort: 'max' })
    ).toMatchSnapshot();
  });
});
