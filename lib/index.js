const chalk = require('chalk');
const randomColor = require('randomcolor');
const numeral = require('numeral');

const { width: terminalWidth } = require('window-size');

const { SYMBOLS, SORT_METHODS, CHART_VIEWS } = require('./const');

const { condensedChartReducer, normalChartReducer } = require('./reducers');

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
 * @typedef {{ chartLength: number, minValue: number, maxValue: number, normalizedValues: NormalizedValue[] }} RawData
 */

/**
 * Normalized value
 * @typedef {{ normalizedValue: number, rawValue: number, formattedValue: string, color: string, label: string, lineLength: number }} NormalizedValue
 */

/**
 * Returns an object with several different strings that you can use to print
 * bar chart, scale and legend
 *
 * @param {InputValue[]} values Values to draw on a chart
 *
 * @param {Object} [options] Chart drawing options
 * @param {("normal"|"condensed")} [options.view="normal"] Chart view type
 * @param {number} [options.min=min value from values array] Min chart value (inclusive)
 * @param {number} [options.max=max value from values array] Max chart value (inclusive)
 * @param {number} [options.length=terminal width] Chart length
 * @param {("min"|"max"|"none"|Function)} [options.sort="none"] Sort method for chart values
 * @param {(string|Function)} [options.format="0.00"] Value format method. String values are Numeral.js format strings
 *
 * @param {Object} [options.randomColorOptions={}] Options for color generator library randomcolor, more info: https://github.com/davidmerfield/randomColor#options
 *
 * @returns {OutputValue} Output that you can print to the terminal
 *
 * @throws {TypeError} Throws TypeError if values or options are not passing validation
 */
function draw(values = [], options = {}) {
  values = normalizeValues(values);

  const { randomColorOptions, view, sort, min, max, length, format } = normalizeOptions(
    options
  );

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

  const valueFormatter = (value) => numeral(value).format(format);

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

  const legend = normalizedValues.reduce((acc, value) => {
    const coloredBlock = chalk.hex(value.color)(SYMBOLS.Full);
    const lineValue = value.formattedValue.padStart(longestFormattedValue);
    const label = value.label.padStart(longestLabel);

    return `${acc}${coloredBlock} - ${label} ${lineValue}\n`;
  }, '');

  let chart = normalizedValues
    .slice()
    .sort(typeof sort === 'function' ? sort : SORT_METHODS[sort]);

  if (view === CHART_VIEWS.Normal) {
    chart = chart.reduce(normalChartReducer, '');
  }

  if (view === CHART_VIEWS.Condensed) {
    chart = chart.reduce(condensedChartReducer, '');
  }

  let scale = [`◺ ${valueFormatter(minValue)}`, `${valueFormatter(maxValue)} ◿`];

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
