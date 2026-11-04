// ========== classifyTemperature ==========
const classifyTemperature = (t) => {
  if (typeof t !== 'number' || isNaN(t)) {
    return 'invalid';
  } else if (t < 10) {
    return 'cold';
  } else if (t > 25) {
    return 'hot';
  } else {
    return 'warm';
  }
};

console.assert(classifyTemperature(9.9) === 'cold', 't < 10 means it is cold');
console.assert(classifyTemperature(10) === 'warm', 't >= 10 && t <= 25 means it is warm');
console.assert(classifyTemperature(25.1) === 'hot', 't > 25 means it is hot');
console.assert(classifyTemperature(NaN) === 'invalid', 't must be a number');

// ========== fizzBuzz ==========
const fizzBuzz = (n) => {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push('FizzBuzz');
    else if (i % 3 === 0) result.push('Fizz');
    else if (i % 5 === 0) result.push('Buzz');
    else result.push(String(i));
  }
  return result;
};

console.assert(fizzBuzz(15).length === 15, 'fizzBuzz(15) — 15 елементів');
console.assert(fizzBuzz(15)[2] === 'Fizz', '[2] === Fizz');
console.assert(fizzBuzz(15)[4] === 'Buzz', '[4] === Buzz');
console.assert(fizzBuzz(15)[14] === 'FizzBuzz', '[14] === FizzBuzz');
console.assert(fizzBuzz(0).length === 0, 'fizzBuzz(0) — порожній масив');

// ========== summarizeResults ==========
const summarizeResults = (results) => {
  const passed = results.filter(r => r === 'passed').length;
  const failed = results.filter(r => r === 'failed').length;
  const skipped = results.filter(r => r === 'skipped').length;
  const total = passed + failed;
  const passRate = total === 0 ? 0 : Math.round((passed / total) * 10000) / 100;
  return { passed, failed, skipped, passRate };
};

const r1 = summarizeResults(['passed', 'failed', 'skipped', 'passed']);
console.assert(r1.passed === 2, 'passed = 2');
console.assert(r1.failed === 1, 'failed = 1');
console.assert(r1.skipped === 1, 'skipped = 1');
console.assert(r1.passRate === 66.67, 'passRate = 66.67');

const r2 = summarizeResults([]);
console.assert(r2.passed === 0 && r2.failed === 0 && r2.skipped === 0 && r2.passRate === 0, 'порожній масив → всі нулі');

const r3 = summarizeResults(['skipped', 'skipped']);
console.assert(r3.passRate === 0, 'всі skipped → passRate = 0');

// ========== retry ==========
const retry = (fn, maxAttempts = 3) => {
  let attempt = 1;
  while (attempt <= maxAttempts) {
    if (fn() === true) return attempt;
    attempt++;
  }
  return -1;
};

console.assert(retry(() => true) === 1, 'fn одразу true → 1');
console.assert(retry(() => false) === -1, 'fn завжди false → -1');

let calls = 0;
const fnFalse = () => { calls++; return false; };
retry(fnFalse);
console.assert(calls === 3, 'fn викликана рівно maxAttempts=3 разів');

let attempt2 = 0;
const fnTrueOn2 = () => { attempt2++; return attempt2 === 2; };
console.assert(retry(fnTrueOn2) === 2, 'fn стає true на 2-й спробі → 2');

// ========== getTimeout ==========
// Виправлення 1: var → const (var небезпечний через hoisting і функціональну область видимості)
// Виправлення 2: config.retries == '0' → config.retries === 0 (== робить неявне приведення типів)
// Виправлення 3: config.timeout || 3000 → config.timeout ?? 3000 (|| вважає 0 порожнім і підставляє 3000, хоча 0 — свідоме значення)
const getTimeout = (config) => {
  const timeout = config.timeout ?? 3000;
  if (config.retries === 0) return timeout;
  return timeout * config.retries;
};

console.assert(getTimeout({ timeout: 0, retries: 0 }) === 0, 'timeout 0, retries 0 → 0');
console.assert(getTimeout({ retries: 2 }) === 6000, 'retries 2 без timeout → 6000');
console.assert(getTimeout({ timeout: 1000, retries: 3 }) === 3000, 'timeout 1000, retries 3 → 3000');