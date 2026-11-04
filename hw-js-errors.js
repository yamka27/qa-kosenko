// ========== Д1: safeGetCart ==========
const safeGetCart = (storageValue) => {
  try {
    const parsed = JSON.parse(storageValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

console.assert(JSON.stringify(safeGetCart(null)) === '[]', 'null → []');
console.assert(JSON.stringify(safeGetCart('')) === '[]', 'порожній рядок → []');
console.assert(JSON.stringify(safeGetCart('{bad}')) === '[]', 'битий JSON → []');
console.assert(JSON.stringify(safeGetCart('{"a":1}')) === '[]', 'не масив → []');
console.assert(JSON.stringify(safeGetCart('[{"id":1}]')) === '[{"id":1}]', 'масив → сам масив');

// ========== Д2: parsePrice ==========
const parsePrice = (text) => {
  if (typeof text !== 'string') {
    throw new TypeError(`Invalid price format: "${text}"`);
  }
  const cleaned = text.replace(/[$,\s]/g, '');
  const num = Number(cleaned);
  if (Number.isNaN(num)) {
    throw new Error(`Invalid price format: "${text}"`);
  }
  return num;
};

console.assert(parsePrice('$1,299.99') === 1299.99, '$1,299.99 → 1299.99');

try {
  parsePrice(123);
  console.assert(false, 'число має кинути TypeError');
} catch (e) {
  console.assert(e instanceof TypeError, 'не рядок → TypeError');
}

try {
  parsePrice('');
  console.assert(false, 'порожній рядок має кинути Error');
} catch (e) {
  console.assert(e instanceof Error && !(e instanceof TypeError), 'порожній рядок → Error, не TypeError');
  console.assert(e.message.includes(''), 'повідомлення містить вхідне значення');
}

try {
  parsePrice('12abc');
  console.assert(false, 'сміття з цифрами має кинути Error');
} catch (e) {
  console.assert(e instanceof Error, '12abc → Error');
}

console.assert(parsePrice('-$150') === -150, '-$150 → -150');

// ========== Д3: assertEqual + assertThrows ==========
class AssertionError extends Error {
  constructor(label, expected, actual) {
    super(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    this.name = 'AssertionError';
    this.expected = expected;
    this.actual = actual;
  }
}

const assertEqual = (actual, expected, label) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new AssertionError(label, expected, actual);
  }
};

const assertThrows = (fn, ErrorType) => {
  let threw = false;
  try {
    fn();
  } catch (e) {
    if (e instanceof ErrorType) {
      threw = true;
    } else {
      throw new AssertionError('assertThrows', `instance of ${ErrorType.name}`, `${e.constructor.name}: ${e.message}`);
    }
  }
  if (!threw) {
    throw new AssertionError('assertThrows', 'помилку', 'нічого не кинуто');
  }
};

console.assert((() => {
  try { assertEqual(1, 1, 'one'); return true; }
  catch (e) { return false; }
})(), 'assertEqual: 1 === 1 — не кидає');

console.assert((() => {
  try { assertEqual(1, 2, 'one vs two'); return false; }
  catch (e) { return e.name === 'AssertionError' && e.message.includes('one vs two'); }
})(), 'assertEqual: 1 !== 2 — кидає AssertionError з label');

console.assert((() => {
  try { assertThrows(() => { throw new Error('test'); }, Error); return true; }
  catch (e) { return false; }
})(), 'assertThrows: Error кидає Error — не падає');

console.assert((() => {
  try { assertThrows(() => {}, Error); return false; }
  catch (e) { return e.name === 'AssertionError'; }
})(), 'assertThrows: fn нічого не кидає — падає AssertionError');

console.assert((() => {
  try { assertThrows(() => { throw new RangeError('x'); }, TypeError); return false; }
  catch (e) { return e.name === 'AssertionError'; }
})(), 'assertThrows: fn кидає інший тип — падає AssertionError');

// ========== Д4: runTests ==========
const runTests = (tests) => {
  let passed = 0;
  let failed = 0;
  const results = [];
  for (const { name, fn } of tests) {
    try {
      fn();
      passed++;
      results.push({ name, status: 'passed' });
      console.log(`✓ ${name}`);
    } catch (e) {
      failed++;
      results.push({ name, status: 'failed', error: e.message });
      console.log(`✗ ${name} — ${e.message}`);
    }
  }
  console.log(`\nPassed: ${passed}, Failed: ${failed}`);
  return { passed, failed, results };
};

const allTests = [
  { name: 'safeGetCart(null) → []', fn: () => assertEqual(safeGetCart(null), []) },
  { name: 'safeGetCart("[{\\"id\\":1}]") → масив', fn: () => assertEqual(safeGetCart('[{"id":1}]'), [{ id: 1 }]) },
  { name: 'safeGetCart("bad") → []', fn: () => assertEqual(safeGetCart('bad'), []) },
  { name: 'parsePrice("$1,299.99") → 1299.99', fn: () => assertEqual(parsePrice('$1,299.99'), 1299.99) },
  { name: 'parsePrice(123) кидає TypeError', fn: () => assertThrows(() => parsePrice(123), TypeError) },
  { name: 'parsePrice("12abc") кидає Error', fn: () => assertThrows(() => parsePrice('12abc'), Error) },
  { name: 'assertEqual(1,1) не кидає', fn: () => assertEqual(1, 1, 'one') },
  { name: 'assertEqual(1,2) кидає AssertionError', fn: () => assertThrows(() => assertEqual(1, 2, 'mismatch'), AssertionError) },
  { name: 'assertThrows з правильним типом не падає', fn: () => assertThrows(() => { throw new Error('x'); }, Error) },
  { name: 'НАВМИСНО ВПАЛИЙ ТЕСТ', fn: () => { throw new Error('цей тест спеціально падає'); } },
];

runTests(allTests);

// ========== Д5: loadUsers + checkAge ==========
const loadUsers = (raw) => {
  try {
    const data = JSON.parse(raw);
    const users = data.users.map(u => u.name.toUpperCase());
    return users;
  } catch (e) {
    // було: catch (e) { return []; } — ловив будь-яку помилку
    // чому погано: якщо JSON валідний але data.users undefined, отримували TypeError і тихо повертали []
    // як виправлено: catch тепер ловить лише SyntaxError від JSON.parse, інші помилки летять далі
    if (e instanceof SyntaxError) {
      return [];
    }
    throw e;
  }
  // було: finally { return null; } — перезаписував результат try/catch
  // чому погано: навіть якщо try повернув масив, finally повертав null
  // як виправлено: прибрав finally, тепер функція повертає те що треба
};

const checkAge = (age) => {
  // було: if (age < 0) throw 'negative age';
  // чому погано: кидається рядок, у нього немає message і stack, err.message === undefined
  // як виправлено: кидаємо RangeError з повідомленням
  if (age < 0) throw new RangeError('negative age');
  return age >= 18;
};

console.assert(JSON.stringify(loadUsers('{"users":[{"name":"ann"}]}')) === '["ANN"]', 'валідний JSON → масив імен');
console.assert(JSON.stringify(loadUsers('bad json')) === '[]', 'битий JSON → []');

try {
  loadUsers('{"data":1}');
  console.assert(false, 'немає users → має кинути TypeError');
} catch (e) {
  console.assert(e instanceof TypeError, 'немає users → TypeError, не []');
}

console.assert(checkAge(20) === true, '20 → true');
console.assert(checkAge(15) === false, '15 → false');

try {
  checkAge(-1);
  console.assert(false, '-1 має кинути помилку');
} catch (e) {
  console.assert(e instanceof RangeError, 'negative age → RangeError');
  console.assert(e.message === 'negative age', 'повідомлення "negative age"');
}