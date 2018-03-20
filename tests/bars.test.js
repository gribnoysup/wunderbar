const { splitNumber, normalBarBuilder } = require('../lib/bars');

describe('splitNumber', () => {
  it('should split float to integer and float parts', () => {
    const value = 1.23;
    const [int, rest] = splitNumber(value);

    expect(int).toBe(1);
    expect(rest).toBe(0.23);
  });
});

describe('normalBarBuilder', () => {
  const testValues = [-1, 0, 0.1, 1.25, 3.34, 5.43, 7.56, 8.75, 9.89, 10];

  it('should return a proper bar for every value', () => {
    expect(testValues.map(normalBarBuilder)).toMatchSnapshot();
  });
});
