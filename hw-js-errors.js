const safeCartStorage = (storageValue) => {
  try {
    const parsed = JSON.parse(storageValue);
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      return [];
    }
  } catch {
    return [];
  }
};

console.assert(JSON.stringify(safeCartStorage(null)) === JSON.stringify([]), 'null → []');
console.assert(JSON.stringify(safeCartStorage('')) === JSON.stringify([]), '"" → []');
console.assert(JSON.stringify(safeCartStorage('[{"id":1}]')) === JSON.stringify([{ id: 1 }]), '[{"id":1}] → [{id:1}]');
console.assert(JSON.stringify(safeCartStorage('{bad')) === JSON.stringify([]), "'{bad' → []");
console.assert(JSON.stringify(safeCartStorage('{"a":1}')) === JSON.stringify([]), '{"a":1} → []');

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
assertThrows(() => parsePrice('trash'), Error, 'Invalid price format');

console.assert(
  parsePrice('$1,299.99') === 1299.99,
  "'$1,299.99' → 1299.99"
);

class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AssertionError';
  }
}

const assertEqual = (actual, expected, label) => {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  
  if (actualStr !== expectedStr) {
    throw new AssertionError(`${label}: expected ${expectedStr}, got ${actualStr}`);
  }
};

const assertThrowsTestscode  = (fn, ErrorType) => {
  try {
    fn();
  } catch (e) {
    if (e instanceof ErrorType) {
      return; 
    }
    throw new AssertionError(`Expected ${ErrorType.name}, got ${e.constructor.name}`);
  }
  throw new AssertionError(`Expected ${ErrorType.name} to be thrown, but nothing was thrown`);
};

try {
  assertEqual([1, 2, 3], [1, 2, 3], 'arrays equal');
  console.log('assertEqual: arrays equal - passed');
} catch (e) {
  console.log('assertEqual: arrays equal - failed');
}

try {
  assertEqual({ a: 1 }, { a: 1 }, 'objects equal');
  console.log('assertEqual: objects equal - passed');
} catch (e) {
  console.log('assertEqual: objects equal — failed');
}

try {
  assertEqual([1, 2], [1, 3], 'arrays not equal');
  console.log('assertEqual: arrays not equal  should have thrown');
} catch (e) {
  if (e instanceof AssertionError) {
    console.log('assertEqual: arrays not equal must have thrown AssertionError');
  } else {
    console.log('assertEqual: wrong error type');
  }
}

const runTests = (tests) =>{
    const results = []

    for(const test of tests){
        try{
            test.fn()
            results.push({ name : test.name , status : "✓"})
        }catch(e){
            results.push({name : test.name , status : "X", error : e.message})
        }
    }
    const passed = results.filter(r => r.status === "✓").length
    const failed = results.filter(r => r.status === "X").length
    for (const r of results){
    if (r.status === "✓"){
        console.log(`✓ ${r.name}`)
    }else {
        console.log(`X ${r.name}`)
    }
    console.log(`\nPassed: ${passed}, Failed: ${failed}`);
    return { passed, failed, results}
}
}
const d1Tests = [
  { name: 'safeCartStorage(null) → []', fn: () => {
      const r = safeCartStorage(null);
      if (JSON.stringify(r) !== '[]') throw new Error('wrong');
    }
  }
];

const d2Tests = [
  { name: 'parsePrice("$1,299.99") → 1299.99', fn: () => {
      if (parsePrice('$1,299.99') !== 1299.99) throw new Error('wrong');
    }
  }
];

const d3Tests = [
  { name: 'assertEqual([1,2], [1,2])', fn: () => {
      assertEqual([1, 2], [1, 2], 'test');
    }
  }
];
runTests(d1Tests);
runTests(d2Tests);
runTests(d3Tests);

const loadUsers = (raw) => {
  try {
    const data = JSON.parse(raw);
    const users = data.users.map(u => u.name.toUpperCase());//було nmae треба name
    return users;
  } catch (e) {
    if (e instanceof SyntaxError) return [] //catch виконувався завжди, тому треба додати перевірку
    throw e;
  } //finally виконувався завжди, тому функція завжди кидала null, я його взагалі видалив
};

const checkAge = (age) => {
  if (age < 0) throw new Error('negative age'); //було просто throw, треба throw new Error
  return age >= 18;
};
console.assert(
  JSON.stringify(loadUsers('{"users":[{"name":"ann"}]}')) === JSON.stringify(['ANN']),
  'loadUsers: valid JSON → ["ANN"]'
);

console.assert(
  JSON.stringify(loadUsers('invalid json')) === JSON.stringify([]),
  'loadUsers: invalid JSON → []'
);

console.assert(checkAge(20) === true, 'checkAge(20) → true');
console.assert(checkAge(15) === false, 'checkAge(15) → false');

try {
  loadUsers('{"data": 123}');
  console.assert(false, 'loadUsers should throw an error');
} catch (e) {
  console.assert(
    e instanceof TypeError,
    'loadUsers throws TypeError, not returns []'
  );
}

try {
  checkAge(-1);
  console.assert(false, 'checkAge(-1) should throw an error');
} catch (e) {
  console.assert(
    e instanceof Error,
    'checkAge throws Error, not a string'
  );
  console.assert(
    e.message === 'negative age',
    'error message is correct'
  );
}