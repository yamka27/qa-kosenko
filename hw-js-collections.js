const results = [
  { name: 'test1', status: 'Failed', duration: 500 },
  { name: 'test2', status: 'Passed', duration: 2000 },
  { name: 'test3', status: 'Failed', duration: 1500 },
  { name: 'test4', status: 'Failed', duration: 300 }
];

const getSlowFailed = (results, limitMS) => {
  let array = results.filter(r => r.status === 'Failed');
  array = array.filter(s => s.duration > limitMS);
  array = array.toSorted((a, b) => b.duration - a.duration);
  return array.map(r => r.name);
};

const firstName = results[0].name;
const output = getSlowFailed(results, 400);

console.assert(JSON.stringify(output) === JSON.stringify(['test3', 'test1']), 'function output is invalid');
console.assert(JSON.stringify(results[0].name) === JSON.stringify(firstName), 'function can not change the original list');
console.assert(JSON.stringify(getSlowFailed([], 100)) === JSON.stringify([]), 'function does not operate with ideal or empty tests');

const groupByStatus = (results) => {
  return results.reduce((a, test) => {
    if (test.status === 'Passed') {
      a.passed.push(test.name);
    } else if (test.status === 'Failed') {
      a.failed.push(test.name);
    } else if (test.status === 'Skipped') {
      a.skipped.push(test.name);
    }
    return a;
  }, { passed: [], failed: [], skipped: [] });
};

console.assert(JSON.stringify(groupByStatus([{ name: '01', status: 'Passed' },
  { name: '02', status: 'Failed' },
  { name: '03', status: 'Passed' }])) === JSON.stringify({
    passed: ['01', '03'],
    failed: ['02'],
    skipped: []
  }), 'Function\'s answer is invalid');

console.assert(JSON.stringify(groupByStatus([])) === JSON.stringify({ passed: [], failed: [], skipped: [] }), 'Functions must show the empty list');

console.assert(JSON.stringify(groupByStatus([{ name: '01', status: 'Passed' },
  { name: '02', status: 'Failed' },
  { name: '03', status: 'Unknown' }])) === JSON.stringify({
    passed: ['01'],
    failed: ['02'],
    skipped: []
  }), 'Function must not remember invalid status');

  const parseUsers = ({ data: { users }, meta: { page } }) =>{
return users.filter(user => user.email.includes('@'))
.map(({ firstName, lastName, email }) => 
 `#${page} ${firstName}${lastName ? ' ' + lastName : ''} <${email}>`
)
}
const apiResponse = {
data: {
users: [
{ firstName: 'Olena', lastName: 'Koval', email: 'olena@test.com' },
{ firstName: 'Vasya', email: 'vasya@gmail.com' },
{ firstName: 'Petr', lastName: 'Test', email: 'invalid-email' }
]
  },
meta: { page: 7 }
};
console.assert(
JSON.stringify(parseUsers(apiResponse)) === JSON.stringify([
 '#7 Olena Koval <olena@test.com>',
 '#7 Vasya <vasya@gmail.com>'
  ]), 'Function answer is invalid')
console.assert(
  JSON.stringify(parseUsers({
  data: { users: [] },
  meta: { page: 3 }
})) === JSON.stringify([]), 'Empty answer should be sent')
console.assert(
  JSON.stringify(parseUsers({
  data: {
    users: [
   { firstName: 'fjdfklsdj', lastName: 'Bjkldjflsd', email: 'lol' },
   { firstName: 'dfssdf', email: 'whoopsie' }
]
  },
  meta: { page: 99 }
})) === JSON.stringify([]),
  'Emails without @ are not valid')

const diffObjects = (expected, actual) => {
  const arr1 = Object.keys(expected);
  const arr2 = Object.keys(actual);
  const arr = [...arr1, ...arr2];
  const uniqueArr = arr.filter((key, index) => arr.indexOf(key) === index);
  const r = uniqueArr.map(key => {
    const expectedVal = expected[key];
    const actualVal = actual[key];
    if (expectedVal !== actualVal) {
      return `${key}: expected "${expectedVal}", got "${actualVal}"`;
    } else {
      return null;
    }
  });
  return r.filter(item => item !== null);
};

console.assert(JSON.stringify(diffObjects({ role: 'admin', name: 'Vasya' },
  { role: 'viewer', name: 'Vasya' })) === JSON.stringify(['role: expected "admin", got "viewer"']),
  'Function\'s answer is invalid');

console.assert(JSON.stringify(diffObjects({ role: 'admin', age: 5 },
  { role: 'admin' })) === JSON.stringify(['age: expected "5", got "undefined"']),
  'Function does not detect missing key in actual');

console.assert(
  JSON.stringify(diffObjects({ log: 1 }, { log: 1 })) === JSON.stringify([]),
  'Function must return [] if objects are identical'
);

const getReport = (results) => {
const sorted = results.toSorted(); // було var, sort мутує оригінальний масив
const names = sorted.map(({ name }) => name.toUpperCase());//було var і звичайна функція
const text = names.reduce((a, name, c) => { //було var, замінив for на reduce
return c === 0 ? name : a + ', ' + name;
}, '');
return `Tests: ${text}`; //раніше рядки по суті додавалися, зараз через template literals
};
console.assert(
getReport([{ name: 'Vasya' }, { name: 'Kolya' }]) === 'Tests: KOLYA, VASYA',
'Wrong output'
);
console.assert(
getReport([]) === 'Tests: ',
'Output must be an empty array'
);
console.assert(
getReport([{ name: 'Vasya' }]) === 'Tests: VASYA',
'Wrong output')