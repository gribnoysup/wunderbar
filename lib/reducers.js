const chalk = require('chalk');

const { getSymbolNormal, getSymbolCondensed } = require('./const');

const splitNumber = value => {
  const int = Math.floor(value);
  const rest = value - int;

  // We are handling zero value as a special case
  // to print at least something on the screen
  return [int, int === 0 && rest === 0 ? 0.001 : rest];
};

const normalChartReducer = (acc, value) => {
  const { lineLength, color } = value;

  const [int, rest] = splitNumber(lineLength);
  const string = getSymbolNormal(int).repeat(int) + getSymbolNormal(rest);

  return `${acc}${chalk.hex(color)(string)}\n`;
};

const condensedChartReducer = (acc, value, index, array) => {
  const isEvenLine = index % 2 === 1;

  if (isEvenLine) return acc;

  const nextValue = array[index + 1];

  if (!nextValue) {
    const [int, rest] = splitNumber(value.lineLength);

    const string =
      getSymbolCondensed(int, true).repeat(int) +
      getSymbolCondensed(rest, true);

    acc += chalk.hex(value.color)(string) + '\n';
  } else if (value.lineLength === nextValue.lineLength) {
    const rounded = Math.round(value.lineLength);
    const string = getSymbolCondensed(rounded, true).repeat(rounded);

    acc += chalk.bgHex(nextValue.color)(chalk.hex(value.color)(string)) + '\n';
  } else if (value.lineLength > nextValue.lineLength) {
    const common = Math.round(nextValue.lineLength);
    const diff = value.lineLength - common;

    const commonString = getSymbolCondensed(common, true).repeat(common);

    acc += chalk.bgHex(nextValue.color)(chalk.hex(value.color)(commonString));

    if (diff > 0) {
      const [int, rest] = splitNumber(diff);
      const string =
        getSymbolCondensed(int, true).repeat(int) +
        getSymbolCondensed(rest, true);

      acc += chalk.hex(value.color)(string) + '\n';
    } else {
      acc += '\n';
    }
  } else if (value.lineLength < nextValue.lineLength) {
    const common = Math.round(value.lineLength);
    const diff = nextValue.lineLength - common;

    const commonString = getSymbolCondensed(common, false).repeat(common);

    acc += chalk.bgHex(value.color)(chalk.hex(nextValue.color)(commonString));

    if (diff > 0) {
      const [int, rest] = splitNumber(diff);
      const string =
        getSymbolCondensed(int, false).repeat(int) +
        getSymbolCondensed(rest, false);

      acc += chalk.hex(nextValue.color)(string) + '\n';
    } else {
      acc += '\n';
    }
  }

  return acc;
};

module.exports = { normalChartReducer, condensedChartReducer };
