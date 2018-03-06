const stripAnsi = require('strip-ansi');

const data = require('./__fixtures__/age-distrib-germany.json');
const draw = require('../lib');

describe('draw', () => {
  const outputResult = (data, options) => {
    const { chart, scale, legend } = draw(data, options);
    return '\n' + stripAnsi([chart, scale, legend].join('\n\n')).trim() + '\n';
  };

  it('should provide result with chart, scale and legend', () => {
    expect(outputResult(data, { length: 100 })).toMatchSnapshot();
  });
});
