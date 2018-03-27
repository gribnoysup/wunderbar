/**
 * Printing symbols
 */
const SYMBOLS = {
  Empty: '',
  LeftCorner: '◺',
  RightCorner: '◿',
  Space: ' ',
  Full: '█',
  SevenEighths: '▉',
  ThreeQuarters: '▊',
  FiveEighths: '▋',
  Half: '▌',
  ThreeEighths: '▍',
  Quarter: '▎',
  Eighth: '▏',
  EOL: require('os').EOL,
};

// win32 systems support only half-block symbol and no corners 😭
if (process.platform === 'win32') {
  Object.assign(SYMBOLS, {
    LeftCorner: '',
    RightCorner: '',
    Full: '█',
    SevenEighths: '█',
    ThreeQuarters: '█',
    FiveEighths: '█',
    Half: '▌',
    ThreeEighths: '▌',
    Quarter: '▌',
    Eighth: '▌',
  });
}

const getSymbolNormal = value => {
  if (value <= 0) {
    return SYMBOLS.Empty;
  } else if (value <= 1 / 8) {
    return SYMBOLS.Eighth;
  } else if (value <= 1 / 4) {
    return SYMBOLS.Quarter;
  } else if (value <= 3 / 8) {
    return SYMBOLS.ThreeEighths;
  } else if (value <= 1 / 2) {
    return SYMBOLS.Half;
  } else if (value <= 5 / 8) {
    return SYMBOLS.FiveEighths;
  } else if (value <= 3 / 4) {
    return SYMBOLS.ThreeQuarters;
  } else if (value <= 7 / 8) {
    return SYMBOLS.SevenEighths;
  } else {
    return SYMBOLS.Full;
  }
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

const COLUMNS = (process && process.stdout && process.stdout.columns) || 42;

module.exports = {
  SYMBOLS,
  SORT_METHODS,
  COLUMNS,
  getSymbolNormal,
};
