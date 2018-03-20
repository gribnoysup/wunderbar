const data = require('./__fixtures__/age-distrib-germany.json');

const { SORT_METHODS, getSymbolNormal } = require('../lib/const');

describe('sort methods', () => {
  describe('min', () => {
    it('should sort values from minimum to maximum', () => {
      expect(data.slice().sort(SORT_METHODS.min)).toMatchSnapshot();
    });
  });

  describe('max', () => {
    it('should sort values from maximum to minimum', () => {
      expect(data.slice().sort(SORT_METHODS.max)).toMatchSnapshot();
    });
  });

  describe('none', () => {
    it('should not sort anything', () => {
      expect(data.slice().sort(SORT_METHODS.none)).toEqual(data);
    });
  });
});

describe('getSymbolNormal', () => {
  const testValues = [
    -1,
    0,
    1 / 8,
    1 / 4,
    3 / 8,
    1 / 2,
    5 / 8,
    3 / 4,
    7 / 8,
    1,
    2,
  ];

  it('should return correct symbol for partial values', () => {
    expect(testValues.map(getSymbolNormal)).toMatchSnapshot();
  });
});
