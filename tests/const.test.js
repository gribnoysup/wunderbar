const data = require('./__fixtures__/age-distrib-germany.json');

const { SORT_METHODS } = require('../lib/const');

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
