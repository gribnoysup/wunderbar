/** 
 * Chart print types:
 *   normal - one bar on one line
 *   condensed - two bars on one line
*/
const CHART_TYPES = {
  Normal: 'normal',
  Condensed: 'condensed',
};

/**
 * Printing symbols
 */
const SYMBOLS = {
  Up: '▀',
  Down: '▄',
  Space: ' ',
  Full: '█',
};

/**
 * Available sorting methods for chart values:
 *   min - top to bottom from minimum to maximum
 *   max - top to bottom from maximum to minimum
 *   none - no sorting
 */
const SORT_METHODS = {
  min: (a, b) => a.rawValue - b.rawValue,
  max: (a, b) => b.rawValue - a.rawValue,
  none: Function.prototype,
};

module.exports = { CHART_TYPES, SYMBOLS, SORT_METHODS };
