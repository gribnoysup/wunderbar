const data = require('./__fixtures__/age-distrib-germany.json');

const {
  normalizeValues,
  normalizeOptions,
  createNormalizeValue,
} = require('../lib/normalizers');

describe('normalizers', () => {
  describe('normalizeValues', () => {
    it('should throw if values is not an array', () => {
      expect(() => normalizeValues('foo')).toThrowErrorMatchingSnapshot();
    });

    it('should throw if values are not numbers', () => {
      expect(() =>
        normalizeValues(['foo', () => {}])
      ).toThrowErrorMatchingSnapshot();
    });

    it('should throw if there is no value key in values', () => {
      expect(() =>
        normalizeValues([{ rabbit: 1 }, {}])
      ).toThrowErrorMatchingSnapshot();
    });

    it('should normalize Array<number> to Array<{ value: number }>', () => {
      expect(normalizeValues([1, 2, 3])).toMatchSnapshot();
    });

    it('should normalize Array<string> to Array<{ value: number }>', () => {
      expect(normalizeValues(['1', '2', '3'])).toMatchSnapshot();
    });
  });

  describe('normalizeOptions', () => {
    it('should properly print NaN when in error message', () => {
      expect(() =>
        normalizeOptions({ min: NaN })
      ).toThrowErrorMatchingSnapshot();
    });

    it('should throw if min is not a number', () => {
      expect(() =>
        normalizeOptions({ min: [] })
      ).toThrowErrorMatchingSnapshot();
    });

    it('should throw if max is not a number', () => {
      expect(() =>
        normalizeOptions({ max: {} })
      ).toThrowErrorMatchingSnapshot();
    });

    it('should throw if length is not a number', () => {
      expect(() =>
        normalizeOptions({ length: () => {} })
      ).toThrowErrorMatchingSnapshot();
    });

    it('should throw if sort type is not supported', () => {
      expect(() =>
        normalizeOptions({ sort: 'magic' })
      ).toThrowErrorMatchingSnapshot();
    });

    it('should throw if sort is not a function', () => {
      expect(() =>
        normalizeOptions({ sort: {} })
      ).toThrowErrorMatchingSnapshot();
    });

    it('should throw if format is not a string or a function', () => {
      expect(() =>
        normalizeOptions({ format: null })
      ).toThrowErrorMatchingSnapshot();
    });

    it('should throw if randomColorOptions is not an object', () => {
      expect(() =>
        normalizeOptions({ randomColorOptions: null })
      ).toThrowErrorMatchingSnapshot();
    });

    it('should return default values if options are empty', () => {
      expect(normalizeOptions({})).toMatchSnapshot();
    });

    it('should normalize min, max and length to numbers, if strings are provided', () => {
      expect(
        normalizeOptions({ min: '1.23', max: '13.5', length: '42' })
      ).toMatchSnapshot();
    });
  });

  describe('createNormalizeValue', () => {
    const colors = ['red', 'blue', 'green', 'pink', 'yellow'];
    const valueFormatter = value => `meow ${value.toFixed(2)}`;
    const chartLength = 100;

    const createNormalize = (min, max) =>
      createNormalizeValue(min, max, chartLength, colors, valueFormatter);

    describe('normalizeValue', () => {
      it('should prepare data for drawing', () => {
        const normalized = createNormalize(0, data[0].value);
        expect(normalized(data[0], 0)).toMatchSnapshot();
      });

      it('should cap data value by maxValue', () => {
        const normalized = createNormalize(0, 500);
        expect(normalized(data[0], 0).normalizedValue).toEqual(500);
      });

      it('should shift data value by minValue', () => {
        const normalized = createNormalize(1000, data[0].value);
        expect(normalized(data[0], 0).normalizedValue).toEqual(
          data[0].value - 1000
        );
      });

      it('should calculate lineLength based on chartLength and normalizedValue', () => {
        const normalized = createNormalize(0, data[0].value);

        // Expecting chartLength here because maxValue of chart is the same as data value
        expect(normalized(data[0], 0).lineLength).toEqual(chartLength);
      });

      it('should return formatted value', () => {
        const normalized = createNormalize(0, data[0].value);
        expect(normalized(data[0], 0).formattedValue).toEqual(
          valueFormatter(data[0].value)
        );
      });
    });
  });
});
