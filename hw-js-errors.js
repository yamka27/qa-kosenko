const parsePrice = (text) => {
  if (typeof text !== 'string') {
    throw new TypeError(`Argument must be a string, got ${typeof text}`);
  }

  const clean = text.replace(/[^0-9.\-]/g, '');

  if (clean === '' || isNaN(clean) || parseFloat(clean) <= 0) {
    throw new Error(`Invalid price format: "${text}"`);
  }

  return parseFloat(clean);
};

const assertThrows = (fn, errorType, messageIncludes) => {
  try {
    fn();
    console.assert(false, `Error not thrown! Expected: ${errorType.name}`);
  } catch (e) {
    console.assert(
      e instanceof errorType,
      `Expected ${errorType.name}, got ${e.constructor.name}`
    );
    console.assert(
      e.message.includes(messageIncludes),
      `Message "${e.message}" does not contain "${messageIncludes}"`
    );
  }
};

assertThrows(() => parsePrice(123.456), TypeError, 'string');
assertThrows(() => parsePrice(''), Error, 'Invalid price format');
assertThrows(() => parsePrice('-150'), Error, 'Invalid price format');
assertThrows(() => parsePrice('thrash'), Error, 'Invalid price format');

console.assert(
  parsePrice('$1,299.99') === 1299.99, "'$1,299.99' → 1299.99"
);