const { getSymbolNormal } = require('./const');

const splitNumber = (value = 0) => {
  const [int, rest = '0'] = value.toString().split('.');
  return [parseInt(int, 10), parseInt(rest, 10) / Math.pow(10, rest.length)];
};

const normalBarBuilder = lineLength => {
  const [int, rest] = splitNumber(lineLength);

  const string =
    int < 0
      ? ''
      : getSymbolNormal(int).repeat(int) +
        // We are handling zero value as a special case
        // to print at least something on the screen
        getSymbolNormal(int === 0 && rest === 0 ? 0.001 : rest);

  return string;
};

module.exports = { splitNumber, normalBarBuilder };
