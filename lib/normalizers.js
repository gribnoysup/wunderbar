const { CHART_TYPES, SORT_METHODS } = require('./const');

const methods = Object.keys(SORT_METHODS);

const prettify = value =>
  typeof value === 'function'
    ? '[Function]'
    : JSON.stringify(value, null, 2).replace(/\n\s*/g, ' ');

const normalizeValues = values => {
  if (!Array.isArray(values)) {
    throw new TypeError(
      `Unexpected "values" argument ${prettify(
        values
      )}. Expected Array<{ value: number, color?: string, label?: string }>`
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
      throw new TypeError(
        `Unexpected value ${prettify(
          value
        )} in "values" argument. Expected { value: number, color?: string, label?: string }`
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
      `Unexpected options.type: ${prettify(
        options.type
      )}. Expected "normal" | "condensed"`
    );
  }

  if (typeof options.min !== 'undefined' && isNaN(parseFloat(options.min))) {
    throw new TypeError(
      `Unexpected options.min: ${prettify(options.min)}. Expected number`
    );
  }

  if (typeof options.max !== 'undefined' && isNaN(parseFloat(options.max))) {
    throw new TypeError(
      `Unexpected options.max: ${prettify(options.max)}. Expected number`
    );
  }

  if (
    typeof options.length !== 'undefined' &&
    isNaN(parseFloat(options.length))
  ) {
    throw new TypeError(
      `Unexpected options.length: ${prettify(options.length)}. Expected number`
    );
  }

  if (
    typeof options.randomColorOptions === 'object' &&
    options.randomColorOptions === null
  ) {
    throw new TypeError(
      `Unexpected options.randomColorOptions: ${prettify(
        options.randomColorOptions
      )}. Expected object with randomcolor options (https://github.com/davidmerfield/randomColor#options)`
    );
  }

  if (
    typeof options.sort !== 'undefined' &&
    typeof options.sort !== 'function' &&
    !methods.includes(options.sort)
  ) {
    throw new TypeError(
      `Unexpected options.sort: ${prettify(
        options.sort
      )}. Expected function or ${methods.map(name => `"${name}"`).join(' | ')}`
    );
  }

  return {
    type: options.type || CHART_TYPES.Normal,
    max: typeof options.max !== 'undefined' ? parseFloat(options.max) : void 0,
    min: typeof options.min !== 'undefined' ? parseFloat(options.min) : void 0,
    length:
      typeof options.length !== 'undefined'
        ? parseInt(options.length, 10)
        : void 0,
    sort: options.sort || 'none',
    randomColorOptions: options.randomColorOptions || {},
  };
};

const createNormalizeValue = (minValue, maxValue, chartLength, colors) => (
  value,
  index
) => {
  const normalizedValue = Math.min(value.value - minValue, maxValue - minValue);

  return {
    normalizedValue,
    rawValue: value.value,
    color: value.color ? value.color : colors[index],
    label: value.label || `#${index + 1}`,
    lineLength: Math.round(
      normalizedValue / (maxValue - minValue) * chartLength
    ),
  };
};

module.exports = { normalizeValues, normalizeOptions, createNormalizeValue };
