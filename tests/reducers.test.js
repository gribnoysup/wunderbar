const stripAnsi = require('strip-ansi');
const data = require('./__fixtures__/age-distrib-germany.json');

const {
  normalChartReducer,
  condensedChartReducer,
} = require('../lib/reducers');

const { createNormalizeValue } = require('../lib/normalizers');

const { SORT_METHODS } = require('../lib/const');

describe('reducers', () => {
  const colors = ['red', 'blue', 'green', 'pink', 'yellow'];
  const chartLength = 100;
  const minValue = 0;
  const maxValue = Math.max(...data.map(_ => _.value));
  const valueFormatter = value => value.toFixed(2);

  const normalizedData = data.map(
    createNormalizeValue(
      minValue,
      maxValue,
      chartLength,
      colors,
      valueFormatter
    )
  );

  const dataThreeWays = [
    normalizedData,
    normalizedData.slice().sort(SORT_METHODS.min),
    normalizedData.slice().sort(SORT_METHODS.max),
  ];

  describe('normalChartReducer', () => {
    it('should print chart where every line represents one value', () => {
      dataThreeWays.forEach(data => {
        const chart = stripAnsi(data.reduce(normalChartReducer, ''));
        expect('\n' + chart).toMatchSnapshot();
      });
    });
  });

  describe('condensedChartReducer', () => {
    it('should print chart where every line represents two values', () => {
      dataThreeWays.forEach(data => {
        const chart = stripAnsi(data.reduce(condensedChartReducer, ''));
        expect('\n' + chart).toMatchSnapshot();
      });
    });
  });
});
