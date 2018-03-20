const chalk = require('chalk');
const randomColor = require('randomcolor');
const numeral = require('numeral');
const pad = require('pad');

const { SYMBOLS, SORT_METHODS, COLUMNS } = require('./const');

const {
  normalizeValues,
  normalizeOptions,
  createNormalizeValue,
} = require('./normalizers');

/**
 * Input value
 * @typedef {({ value: number, color: string, label: string }|number|string)} InputValue
 */

/**
 * Output value
 * @typedef {{ legend: string, scale: string, chart: string, __raw: RawData }} OutputValue
 */

/**
 * Raw data
 * @typedef {{ chartLength: number, minValue: number, minValueFormatted: string, maxValue: number, maxValueFormatted: string, normalizedValues: NormalizedValue[] }} RawData
 */

/**
 * Normalized value
 * @typedef {{ normalizedValue: number, rawValue: number, formattedValue: string, color: string, label: string, lineLength: number, chartBar: string }} NormalizedValue
 */

/**
 * Returns an object with several different strings that you can use to print
 * bar chart, scale and legend
 *
 * @param {InputValue[]} values Values to draw on a chart
 *
 * @param {Object} [options] Chart drawing options
 * @param {number} [options.min=min value from values array] Min chart value (inclusive)
 * @param {number} [options.max=max value from values array] Max chart value (inclusive)
 * @param {number} [options.length=terminal width] Chart length
 * @param {("min"|"max"|"none"|Function)} [options.sort="none"] Sort method for chart values
 * @param {(string|Function)} [options.format="0.00"] Value format method. String values are Numeral.js format strings
 * @param {Object} [options.randomColorOptions={}] Options for color generator library randomcolor, more info: https://github.com/davidmerfield/randomColor#options
 *
 * @returns {OutputValue} Building blocks for the chart
 *
 * @throws {TypeError} Throws TypeError if values or options are not passing validation
 */
function draw(values = [], options = {}) {
  values = normalizeValues(values);

  const {
    sort,
    min,
    max,
    length,
    format,
    randomColorOptions,
  } = normalizeOptions(options);

  const colors = randomColor(
    Object.assign({}, randomColorOptions, { count: values.length })
  );

  const chartLength = typeof length === 'number' ? length : COLUMNS;

  const minValue =
    typeof min === 'number'
      ? min
      : Math.min(...values.map(value => value.value));

  const maxValue =
    typeof max === 'number'
      ? max
      : Math.max(...values.map(value => value.value));

  const valueFormatter =
    typeof format === 'function'
      ? format
      : value => numeral(value).format(format);

  const minValueFormatted = valueFormatter(minValue);

  const maxValueFormatted = valueFormatter(maxValue);

  const normalizeValue = createNormalizeValue(
    minValue,
    maxValue,
    chartLength,
    colors,
    valueFormatter
  );

  const normalizedValues = values.map(normalizeValue);

  const longestFormattedValue = Math.max(
    ...normalizedValues.map(value => value.formattedValue.length)
  );

  const longestLabel = Math.max(
    ...normalizedValues.map(value => value.label.length)
  );

  const chart = normalizedValues
    .slice()
    .sort(typeof sort === 'function' ? sort : SORT_METHODS[sort])
    .map(({ chartBar, color }) => chalk.hex(color)(chartBar));

  const legend = normalizedValues.map(value => {
    const coloredBlock = chalk.hex(value.color)(SYMBOLS.Full);
    const lineValue = pad(longestFormattedValue, value.formattedValue);
    const label = pad(value.label, longestLabel);

    return `${coloredBlock} - ${label} ${lineValue}`;
  });

  let scale = [
    [SYMBOLS.LeftCorner, minValueFormatted].join(SYMBOLS.Space),
    [maxValueFormatted, SYMBOLS.RightCorner].join(SYMBOLS.Space),
  ];

  const scaleDividerLength =
    chartLength - scale.reduce((acc, s) => acc + s.length, 0);

  if (scaleDividerLength > 0) {
    scale = scale.join(SYMBOLS.Space.repeat(scaleDividerLength));
  } else {
    const padLength = Math.max(
      minValueFormatted.length,
      maxValueFormatted.length
    );

    scale = [
      `min: ${pad(padLength, minValueFormatted)}`,
      `max: ${pad(padLength, maxValueFormatted)}`,
    ].join(SYMBOLS.EOL);
  }

  return {
    chart: chart.join(SYMBOLS.EOL),
    legend: legend.join(SYMBOLS.EOL),
    scale: scale,
    __raw: {
      chartLength,
      minValue,
      minValueFormatted,
      maxValue,
      maxValueFormatted,
      normalizedValues,
    },
  };
}

module.exports = draw;
