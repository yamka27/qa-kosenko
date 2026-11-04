// Boundary values: 9.9; 10; 10.1; 24.9; 25; 25.1; NaN; 'abc'.
const classifyTemperature = (t) => {
if (typeof t !== 'number' || isNaN(t))
{
return 'invalid'
}
else if (t < 10)
{
return 'cold'
}
else if (t > 25)
{
return 'hot'
}
else 
{
return 'warm'
}}
console.assert(classifyTemperature(9.9) === 'cold', 't < 10 means it is cold')
console.assert(classifyTemperature(10) === 'warm', 't >= 10 && t <= 25 means it is warm')
console.assert(classifyTemperature(25.1) === 'hot', 't > 25 means it is hot')
console.assert(classifyTemperature(NaN) === 'invalid', 't must be a number')

// Boundary Values: n=0; array[2], array[4], array[14].
const fizzBuzz = (n) =>{
const array = []
for (let i = 1; i <= n; i++) {
}
if (i % 15 === 0){
array.push('FizzBuzz')
}
else if (i % 3 === 0){
array.push('Fizz')
}
else if (i % 5 === 0){
array.push('Buzz')
}
else {
array.push(`${i}`)
}
return array
}
console.assert(fizzBuzz(0).length === 0, 'n = 0, must be an empty array')
console.assert(fizzBuzz(3)[2] === 'Fizz', 'i % 3 = 0, must change item to Fizz')
console.assert(fizzBuzz(5)[4] === 'Buzz', 'i % 5 = 0, must change item to Buzz')
console.assert(fizzBuzz(15)[14] === 'FizzBuzz', 'i % 15 = 0, must change item to FizzBuzz')

const summarizeResults = results => {
let pass = 0
let fail = 0
let skip = 0
let quantity = 0
for (let i = 0; i <= results.length - 1; i++){
if (results[i] === 'passed'){
pass++
}
else if (results[i] === 'failed'){
fail++
}
else{
skip++
}
}
if (skip === results.length  || results.length === 0){
return { 'passed': 0, 'failed': 0, 'skipped': 0, 'passRate': 0 }
}
quantity = pass + fail
const passRate = (pass / quantity) * 100
return { 'passed': pass, 'failed': fail, 'skipped': skip, 'passRate': passRate }
}

console.assert(summarizeResults([]),passRate === 0, 'No data means no passRate')
console.assert(summarizeResults(['skipped', 'skipped']),passRate === 0, 'No complete test means no passRate')
const res = summarizeResults(['passed', 'failed', 'skipped', 'passed']);
console.assert(result.passed === 2 && result.failed === 1 && result.skipped === 1, 'Correct data:passed = 2, failed = 1, skipped = 1')

const retry = (fn, maxAttempts = 3) => {
let i = 0
while (i < maxAttempts){
const res = fn()
if (res === true){
return i + 1
}
i++
}
return -1
}
const fntr = () => true
console.assert(retry(fntr) === 1, 'fn responded with true, so it must be 1 iteration')
let count = 0;
const fnfa = () => {
сount++  
return false
}
const result = retry(fnfa, 3)
console.assert(result === -1, 'fn responded with false all attempts')
console.assert(count === 3, 'fn was called  3 times')

const getTimeout = (config) => { // застарілий var, ним ніхто не користується
{ const timeout = config.timeout ?? 3000; // тут був оператор |, що повертає праву частину, якщо ліва falsy, тому навіть якщо буде 0 || 3000, вибереться 0, це баг
if (config.retries === 0) return timeout; // тут була умова == '0', що посуті порівнювало к-ість спроб рядком, тому це баг
return timeout * config.retries; 
};
console.assert(getTimeout({ timeout: 0, retries: 0 }) === 0, 'timeout is 0, so retries must be 0');
console.assert(getTimeout({ retries: 2 }) === 6000, '2 retries, so 3000*2 = 6000');
console.assert(getTimeout({}) === 3000, 'empty config, so functions sets default timeout');