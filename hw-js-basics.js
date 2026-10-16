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