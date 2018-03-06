const chalk = require('chalk');

const { SYMBOLS } = require('./const');

const normalChartReducer = (acc, value) =>
  `${acc}${chalk.hex(value.color)(SYMBOLS.Full.repeat(value.lineLength))}\n`;

const condensedChartReducer = (acc, value, index, array) => {
  const isOddLine = index % 2 === 0;

  const nextValue = array[index + 1];
  const prevValue = array[index - 1];

  if (isOddLine) {
    if (!nextValue) {
      acc += chalk.hex(value.color)(SYMBOLS.Up.repeat(value.lineLength));
      acc += '\n';
    } else if (value.lineLength <= nextValue.lineLength) {
      acc += chalk.bgHex(value.color)(
        chalk.hex(nextValue.color)(SYMBOLS.Down.repeat(value.lineLength))
      );
    } else if (value.lineLength > nextValue.lineLength) {
      acc += chalk.bgHex(nextValue.color)(
        chalk.hex(value.color)(SYMBOLS.Up.repeat(nextValue.lineLength))
      );

      acc += chalk.hex(value.color)(
        SYMBOLS.Up.repeat(value.lineLength - nextValue.lineLength)
      );
    }
  }

  if (!isOddLine) {
    if (value.lineLength > prevValue.lineLength) {
      acc += chalk.hex(value.color)(
        SYMBOLS.Down.repeat(value.lineLength - prevValue.lineLength)
      );
    }

    acc += '\n';
  }

  return acc;
};

module.exports = { normalChartReducer, condensedChartReducer };
