const chalk = require('chalk');
const randomColor = require('randomcolor');

const { width: terminalWidth } = require('window-size');

const CHART_TYPES = {
  Normal: 'normal',
  Condensed: 'condensed',
};

const SYMBOLS = {
  Up: '▀',
  Down: '▄',
  Space: ' ',
};

const normalChartReducer = (acc, value) =>
  `${acc}${chalk.bgHex(value.color)(SYMBOLS.Space.repeat(value.lineLength))}\n`;

const condensedChartReducer = (acc, value, index, array) => {
  const isOddLine = index % 2 === 0;

  const nextValue = array[index + 1];
  const prevValue = array[index - 1];

  if (isOddLine && value.lineLength <= nextValue.lineLength) {
    acc += chalk.bgHex(value.color)(
      chalk.hex(nextValue.color)(SYMBOLS.Down.repeat(value.lineLength))
    );
  }

  if (isOddLine && value.lineLength > nextValue.lineLength) {
    acc += chalk.bgHex(nextValue.color)(
      chalk.hex(value.color)(SYMBOLS.Up.repeat(nextValue.lineLength))
    );

    acc += chalk.hex(value.color)(
      SYMBOLS.Up.repeat(value.lineLength - nextValue.lineLength)
    );
  }

  if (!isOddLine && value.lineLength > prevValue.lineLength) {
    acc += chalk.hex(value.color)(
      SYMBOLS.Down.repeat(value.lineLength - prevValue.lineLength)
    );
  }

  if (!isOddLine) {
    acc += '\n';
  }

  return acc;
};

const prettyPrint = val =>
  JSON.stringify(val, null, 1)
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ');

const normalizeValues = values => {
  if (!Array.isArray(values)) {
    const stringified = prettyPrint(values);

    throw new TypeError(
      `Unexpected "values" argument: ${stringified}. Expected Array<{ value: number, color?: string, label?: string }>`
    );
  }

  return values.map(value => {
    if (typeof value === 'object' && typeof value.value !== 'undefined') {
      return value;
    } else if (typeof value === 'string' && !isNaN(parseFloat(value))) {
      return { value: parseFloat(value) };
    } else if (typeof value === 'number') {
      return { value };
    } else {
      const stringified = prettyPrint(value);

      throw new TypeError(
        `Unexpected value in "values" argument: ${stringified}. Expected { value: number, color?: string, label?: string }`
      );
    }
  });
};

const normalizeOptions = options => {
  if (
    options.type &&
    options.type !== CHART_TYPES.Normal &&
    options.type !== CHART_TYPES.Condensed
  ) {
    throw new TypeError(
      `Unexpected options.type: ${
        options.type
      }. Expected "normal" | "condensed"`
    );
  }

  if (typeof options.min !== 'undefined' && isNaN(parseFloat(options.min))) {
    throw new TypeError(
      `Unexpected options.min: ${options.min}. Expected number`
    );
  }

  if (typeof options.max !== 'undefined' && isNaN(parseFloat(options.max))) {
    throw new TypeError(
      `Unexpected options.max: ${options.min}. Expected number`
    );
  }

  if (
    typeof options.length !== 'undefined' &&
    isNaN(parseFloat(options.length))
  ) {
    throw new TypeError(
      `Unexpected options.length: ${options.length}. Expected number`
    );
  }

  if (
    typeof options.randomColorOptions !== 'object' ||
    options.randomColorOptions === null
  ) {
    throw new TypeError(
      `Unexpected options.randomColorOptions: ${
        options.randomColorOptions
      }. Expected object with randoncolor options (https://github.com/davidmerfield/randomColor#options)`
    );
  }

  return {
    type: options.type,
    max: typeof options.max !== 'undefined' ? parseFloat(options.max) : void 0,
    min: typeof options.min !== 'undefined' ? parseFloat(options.min) : void 0,
    length:
      typeof options.length !== 'undefined'
        ? parseFloat(options.length)
        : void 0,
    randomColorOptions: options.randomColorOptions,
  };
};

/**
 * Returns an object with several different strings that you can use to print
 * bar chart, scale and legend
 *
 * @param {Array<{ value: number, color?: string, label?: string }>} values values to put on a chart
 * @param {?Object} options        chart drawing options
 * @param {?string} options.type   chart type, accepts two values: "normal" or "condensed", defaults to "normal"
 * @param {?number} options.min    min chart value (inclusive), zero point for the chart, defaults to min value from values array
 * @param {?number} options.max    max chart value (inclusive), maximum value on the chart, defaults to max value from values array
 * @param {?number} options.length chart length, defaults to all available space in terminal window
 * @param {?Object} options.randomColorOptions options for color generator library: randomcolor
 *                                             more info: https://github.com/davidmerfield/randomColor#options
 *
 * @returns {Object<{ legend: string, scale: string, chart: string, __raw: object }>} output that you can print to the terminal
 *
 * @throws {TypeError} throws TypeError if values or options are not passing validation
 */
function draw(values = [], options = {}) {
  values = normalizeValues(values);

  const {
    randomColorOptions = {},
    type = CHART_TYPES.Normal,
    min,
    max,
    length,
  } = normalizeOptions(options);

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
    const normalizedValue = Math.min(
      value.value - minValue,
      maxValue - minValue
    );

    return {
      normalizedValue,
      rawValue: value.value,
      color: value.color ? value.color : colors[index],
      label: value.label || `#${index + 1}`,
      lineLength: Math.round(
        normalizedValue / (maxValue - minValue) * chartLength
      ),
    };
  });

  const legend = normalizedValues.reduce(
    (acc, value) =>
      `${acc}${chalk.bgHex(value.color)(SYMBOLS.Space)} - ${
        value.label
      } (${value.rawValue.toFixed(2)})\n`,
    ''
  );

  let chart = '';

  if (type === CHART_TYPES.Normal) {
    chart = normalizedValues.reduce(normalChartReducer, chart);
  }

  if (type === CHART_TYPES.Condensed) {
    chart = normalizedValues.reduce(condensedChartReducer, chart);
  }

  let scale = [`◺ ${minValue.toFixed(2)}`, `${maxValue.toFixed(2)} ◿`];

  return {
    chart: chart.trim(),
    legend: legend.trim(),
    scale: scale.join(
      SYMBOLS.Space.repeat(
        chartLength - scale.reduce((acc, s) => acc + s.length, 0)
      )
    ),
    __raw: { chartLength, minValue, maxValue, normalizedValues },
  };
}

module.exports = draw;
