safeCartStorage = (storageValue) => {
    try {
    const parsed = JSON.parse(storageValue)
    if (Array.isArray(parsed)) {
      return parsed;
    } else return []
    }catch {
        return []
    }
}
console.assert(JSON.stringify(safeCartStorage(null)) === JSON.stringify([]), 'function must return []')
console.assert(JSON.stringify(safeCartStorage('')) === JSON.stringify('[]'), 'function must return []')
console.assert(JSON.stringify(safeCartStorage('[{"id":1}]')) === JSON.stringify([{"id":1}]), 'function must return [{"id":1}]')
console.assert(JSON.stringify(safeCartStorage('{bad')) === JSON.stringify([]), 'function must return []')
console.assert(JSON.stringify(safeCartStorage('{"a":1}')) === JSON.stringify([]), 'function must return []')