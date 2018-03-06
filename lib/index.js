const chalk = require('chalk');
const randomColor = require('randomcolor');
const { width: terminalWidth } = require('window-size');

const { SYMBOLS, SORT_METHODS, CHART_TYPES } = require('./const');

const { condensedChartReducer, normalChartReducer } = require('./reducers');

const {
  normalizeValues,
  normalizeOptions,
  createNormalizeValue,
} = require('./normalizers');

/**
 * Returns an object with several different strings that you can use to print
 * bar chart, scale and legend
 *
 * @param {Array<{ value: number, color?: string, label?: string }>} values values to put on a chart
 *
 * @param {Object} [options] chart drawing options
 * @param {string} [options.type="normal"] chart type, accepts two values: "normal" or "condensed", defaults to "normal"
 * @param {number} [options.min] min chart value (inclusive), zero point for the chart, defaults to min value from values array
 * @param {number} [options.max] max chart value (inclusive), maximum value on the chart, defaults to max value from values array
 * @param {number} [options.length] chart length, defaults to all available space in terminal window
 * @param {(string|Function)} [options.sort="none"] sort by value, accepts function that will be passed to Array.sort method or
 *                                                  a string value "min", "max" or "none", defaults to "none"
 *
 * @param {?Object} options.randomColorOptions options for color generator library: randomcolor
 *                                             more info: https://github.com/davidmerfield/randomColor#options
 *
 * @returns {Object<{ legend: string, scale: string, chart: string, __raw: object }>} output that you can print to the terminal
 *
 * @throws {TypeError} throws TypeError if values or options are not passing validation
 */
function draw(values = [], options = {}) {
  values = normalizeValues(values);

  const { randomColorOptions, type, sort, min, max, length } = normalizeOptions(
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

  const normalizeValue = createNormalizeValue(
    minValue,
    maxValue,
    chartLength,
    colors
  );

  const normalizedValues = values.map(normalizeValue);

  const longestValue = Math.max(
    ...normalizedValues.map(value => value.rawValue.toFixed(2).length)
  );

  const longestLabel = Math.max(
    ...normalizedValues.map(value => value.label.length)
  );

  const legend = normalizedValues.reduce((acc, value) => {
    const coloredBlock = chalk.hex(value.color)(SYMBOLS.Full);
    const lineValue = value.rawValue.toFixed(2).padStart(longestValue);
    const label = value.label.padStart(longestLabel);

    return `${acc}${coloredBlock} - ${label} ${lineValue}\n`;
  }, '');

  let chart = normalizedValues
    .slice()
    .sort(typeof sort === 'function' ? sort : SORT_METHODS[sort]);

  if (type === CHART_TYPES.Normal) {
    chart = chart.reduce(normalChartReducer, '');
  }

  if (type === CHART_TYPES.Condensed) {
    chart = chart.reduce(condensedChartReducer, '');
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
