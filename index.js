const chalk = require('chalk');
const randomColor = require('randomcolor');

const { width: terminalWidth } = require('window-size');

const CHART_TYPES = {
  Normal: 'normal',
  Condensed: 'condensed',
};

const BOX_SYMBOLS = {
  Up: '▀',
  Down: '▄',
};

const normalChartReducer = (acc, value) =>
  `${acc}${chalk.bgHex(value.color)(' '.repeat(value.chartLength))}\n`;

const condensedChartReducer = (acc, value, index, array) => {
  const isOddLine = index % 2 === 0;

  const nextValue = array[index + 1];
  const prevValue = array[index - 1];

  if (isOddLine && value.chartLength <= nextValue.chartLength) {
    acc += chalk.bgHex(value.color)(
      chalk.hex(nextValue.color)(BOX_SYMBOLS.Down.repeat(value.chartLength))
    );
  }

  if (isOddLine && value.chartLength > nextValue.chartLength) {
    acc += chalk.bgHex(nextValue.color)(
      chalk.hex(value.color)(BOX_SYMBOLS.Up.repeat(nextValue.chartLength))
    );

    acc += chalk.hex(value.color)(
      BOX_SYMBOLS.Up.repeat(value.chartLength - nextValue.chartLength)
    );
  }

  if (!isOddLine && value.chartLength > prevValue.chartLength) {
    acc += chalk.hex(value.color)(
      BOX_SYMBOLS.Down.repeat(value.chartLength - prevValue.chartLength)
    );
  }

  if (!isOddLine) {
    acc += '\n';
  }

  return acc;
};

/**
 *
 * @param {Array<{ value: number, color?: string, label?: string }>} values values to put on a chart
 * @param {?Object}  options         chart drawing options
 * @param {?string}  options.type    chart type, accepts two values: "normal" or "condensed", defaults to "normal"
 * @param {?number}  options.min     min chart value, zero point for the chart, defaults to min value from values array
 * @param {?number}  options.max     max chart value, maximum value on the chart, defaults to max value from values array
 * @param {?number}  options.length  chart length, defaults to all available space in terminal window
 *
 * @returns {Object<{ legend: string, chart: string }>} output that you can print to the terminal
 */
function draw(
  values = [],
  { type = CHART_TYPES.Normal, min, max, length, randomColorOptions = {} } = {}
) {
  if (!Array.isArray(values)) {
    throw new TypeError(
      'Unsupported values. Expected Array<{ value: number, color?: string, label?: string }>'
    );
  }

  const colors = randomColor(
    Object.assign({}, randomColorOptions, { count: values.length })
  );

  const chartLength = typeof length === 'number' ? length : terminalWidth;

  const minValue =
    typeof min === 'number'
      ? min
      : Math.min(...values.map(value => value.value));

  const maxValue =
    typeof max === 'number'
      ? max
      : Math.max(...values.map(value => value.value));

  const normalizedValues = values.map((value, index) => {
    const normalizedValue = Math.min(value.value - minValue, maxValue);

    return {
      normalizedValue,
      rawValue: value.value,
      color: value.color ? value.color : colors[index],
      label: value.label || `#${index + 1}`,
      chartLength: Math.round(
        normalizedValue / (maxValue - minValue) * chartLength
      ),
    };
  });

  const legend = normalizedValues.reduce(
    (acc, value) =>
      `${acc}${chalk.bgHex(value.color)(' ')} - ${
        value.label
      } (${value.rawValue.toFixed(2)})\n`,
    ''
  );

  let chart = '';

  if (type === CHART_TYPES.Normal) {
    chart = normalizedValues.reduce(normalChartReducer, chart);
  } else if (type === CHART_TYPES.Condensed) {
    chart = normalizedValues.reduce(condensedChartReducer, chart);
  } else {
    throw new TypeError(
      `Unsupported chart type: ${type}. Expected "normal" | "condensed"`
    );
  }

  return {
    chart: chart.trim(),
    legend: legend.trim(),
    __raw: { colors, chartLength, minValue, maxValue, normalizedValues },
  };
}

module.exports = draw;
