// ========== Стартовий код ==========
const USERS = { 1: { id: 1, name: 'Olena' }, 2: { id: 2, name: 'Taras' } };
const ORDERS = { 1: [120, 80, 45.5], 2: [] };

function getUser(id, callback) {
  setTimeout(() => {
    const user = USERS[id];
    if (!user) return callback(new Error(`User ${id} not found`));
    callback(null, user);
  }, 300);
}

function getOrders(userId, callback) {
  setTimeout(() => callback(null, ORDERS[userId] ?? []), 300);
}

// ========== Д1: Три стилі ==========

// Версія 1: тільки колбеки
const printTotalCb = (id, done) => {
  getUser(id, (err, user) => {
    if (err) return done(err);
    getOrders(user.id, (err, orders) => {
      if (err) return done(err);
      const sum = orders.reduce((a, b) => a + b, 0);
      console.log(`${user.name}: ${sum}`);
      done(null);
    });
  });
};

// Версія 2: проміси (плоский ланцюжок, без вкладених .then)
const getUserAsync = (id) => new Promise((resolve, reject) => {
  getUser(id, (err, user) => err ? reject(err) : resolve(user));
});

const getOrdersAsync = (userId) => new Promise((resolve, reject) => {
  getOrders(userId, (err, orders) => err ? reject(err) : resolve(orders));
});

const printTotalThen = (id) => {
  let user;
  getUserAsync(id)
    .then(u => { user = u; return getOrdersAsync(u.id); })
    .then(orders => {
      const sum = orders.reduce((a, b) => a + b, 0);
      console.log(`${user.name}: ${sum}`);
    })
    .catch(err => console.log(`Помилка: ${err.message}`));
};

// Версія 3: async/await + try/catch, без жодного .then
const printTotalAwait = async (id) => {
  try {
    const user = await getUserAsync(id);
    const orders = await getOrdersAsync(user.id);
    const sum = orders.reduce((a, b) => a + b, 0);
    console.log(`${user.name}: ${sum}`);
  } catch (err) {
    console.log(`Помилка: ${err.message}`);
  }
};

// Тести Д1
console.log('--- Д1: id=1 ---');
printTotalCb(1, (err) => { if (err) console.log(`Помилка: ${err.message}`); });
printTotalThen(1);
printTotalAwait(1);

setTimeout(() => {
  console.log('--- Д1: id=2 ---');
  printTotalCb(2, (err) => { if (err) console.log(`Помилка: ${err.message}`); });
  printTotalThen(2);
  printTotalAwait(2);
}, 700);

setTimeout(() => {
  console.log('--- Д1: id=3 ---');
  printTotalCb(3, (err) => { if (err) console.log(`Помилка: ${err.message}`); });
  printTotalThen(3);
  printTotalAwait(3);
}, 1400);

// Д2 
// ФРАГМЕНТ A
// Прогноз порядку виводу: A, F, C, E, D, B
setTimeout(() => {
    console.log('ФРАГМЕНТ A')
    
    console.log('Теоретичний вивід:');
    console.log('A — синхронний код, перша інструкція');
    console.log('F — синхронний код, остання інструкція');
    console.log('C — мікрозадача (перший .then)');
    console.log('E — мікрозадача (queueMicrotask)');
    console.log('D — мікрозадача (другий .then, додався після C)');
    console.log('B — макрозадача (setTimeout), виконується в кінці');
    console.log('');
    console.log('Фактичний вивід:');

    console.log('A'); // СИНХРОННИЙ КОД — виконується одразу
    setTimeout(() => console.log('B'), 0); // МАКРОЗАДАЧА — реєструється в черзі макрозадач, виконається останнім
    Promise.resolve() // СИНХРОННИЙ КОД — створює вирішений проміс одразу
        .then(() => console.log('C')) // МІКРОЗАДАЧА — перший .then, додає 'C' в чергу мікрозадач
        .then(() => console.log('D')); // МІКРОЗАДАЧА — другий .then, додасть 'D' тільки після виконання 'C'
    queueMicrotask(() => console.log('E')); // МІКРОЗАДАЧА — додається в чергу мікрозадач одразу, після 'C'
    console.log('F'); // СИНХРОННИЙ КОД — виконується одразу, другим у виводі
}, 5000);

// ФРАГМЕНТ B
// Прогноз порядку виводу: 3, 1, 4, 2, 5
setTimeout(() => {
    console.log('\n ФРАГМЕНТ B ');
    
    console.log('Теоретичний вивід:');
    console.log('3 — синхронний код, перший console.log після оголошення run');
    console.log('1 — синхронний код всередині run, до await');
    console.log('4 — синхронний код, після виклику run');
    console.log('2 — мікрозадача, продовження run після await');
    console.log('5 — макрозадача (setTimeout), виконується в кінці');
    console.log('');
    console.log('Фактичний вивід:');

    async function run() { // СИНХРОННЕ ОГОЛОШЕННЯ — тільки реєструється, не виконується
        console.log('1'); // СИНХРОННИЙ КОД всередині run — виконується одразу при виклику, до await
        await null; // МІКРОЗАДАЧА — await завжди створює мікрозадачу, призупиняє run
        console.log('2'); // МІКРОЗАДАЧА — продовження async-функції після await
    }
    console.log('3'); // СИНХРОННИЙ КОД — перша виконувана інструкція після оголошення run
    run(); // СИНХРОННИЙ ВИКЛИК — всередині виконується '1', потім await призупиняє
    console.log('4'); // СИНХРОННИЙ КОД — виконується одразу після повернення з run
    setTimeout(() => console.log('5'), 0); // МАКРОЗАДАЧА — реєструється в черзі, виконається останнім
}, 6000);

// ФРАГМЕНТ C
// Прогноз порядку виводу: p1, t1, t2, p2, t3
setTimeout(() => {
    console.log('\nФРАГМЕНТ C');
    
    console.log('Теоретичний вивід:');
    console.log('p1 — мікрозадача, єдина після початкового синхронного коду');
    console.log('t1 — макрозадача 1, перша в черзі setTimeout');
    console.log('t2 — синхронний код всередині макрозадачі 2');
    console.log('p2 — мікрозадача, створена ПІД ЧАС виконання макрозадачі 2');
    console.log('t3 — макрозадача 3, виконується після очищення черги мікрозадач');
    console.log('');
    console.log('Фактичний вивід:');

    setTimeout(() => console.log('t1'), 0); // МАКРОЗАДАЧА 1 — реєструється першою в черзі макрозадач
    setTimeout(() => { // МАКРОЗАДАЧА 2 — реєструється другою в черзі макрозадач
        console.log('t2'); // СИНХРОННИЙ КОД всередині макрозадачі 2
        Promise.resolve().then(() => console.log('p2')); // МІКРОЗАДАЧА — створюється під час виконання макрозадачі 2
    }, 0);
    setTimeout(() => console.log('t3'), 0); // МАКРОЗАДАЧА 3 — реєструється третьою в черзі макрозадач
    Promise.resolve().then(() => console.log('p1')); // МІКРОЗАДАЧА — єдина мікрозадача на синхронному етапі
}, 7000);

// Д3 3

setTimeout(() => {

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function retryAsync(fn, attempts = 3, delayMs = 500) {
        let lastError = null; 

        for (let i = 0; i < attempts; i++) {
            try {
                const result = await fn(); 
                return result;             
            } catch (err) {
                lastError = err;           

                if (i < attempts - 1) {
                    await delay(delayMs);
                }
            }
        }

        throw new Error(`Failed after ${attempts} attempts`, { cause: lastError });
    }

    function makeFlaky(failTimes) {
        let callCount = 0;

        return async () => {
            callCount++;
            if (callCount <= failTimes) {
                throw new Error(`Flaky error #${callCount}`);
            }
            return 'ok';
        };
    }

    (async () => {
        const flaky1 = makeFlaky(0);
        const result1 = await retryAsync(flaky1);
        console.assert(result1 === 'ok', 'Сценарій 1: успіх з 1-ї спроби — результат "ok"');
        console.log('Сценарій 1 пройшов: успіх з 1-ї спроби, результат =', result1);

        const flaky2 = makeFlaky(2); 
        const startTime = Date.now(); 
        const result2 = await retryAsync(flaky2, 3, 500);
        const elapsed = Date.now() - startTime;
        console.assert(result2 === 'ok', 'Сценарій 2: успіх з 3-ї спроби — результат "ok"');
        console.assert(elapsed >= 2 * 500, `Сценарій 2: загальний час ${elapsed}мс >= ${2 * 500}мс (2 затримки)`);
        console.log(`Сценарій 2 пройшов: успіх з 3-ї спроби, час = ${elapsed}мс`);

        const flaky3 = makeFlaky(10); 
        try {
            await retryAsync(flaky3, 3, 100);
            console.assert(false, 'Сценарій 3: помилка повинна була бути кинута');
        } catch (err) {
            console.assert(err.message === 'Failed after 3 attempts', 'Сценарій 3: message помилки');
            console.assert(err.cause !== undefined, 'Сценарій 3: cause помилки присутній');
            console.assert(err.cause.message === 'Flaky error #3', 'Сценарій 3: cause — остання помилка');
            console.log('Сценарій 3 пройшов: помилка кинута, message =', err.message, ', cause =', err.cause.message);
        }

        console.log('\nВсі сценарії Д3 перевірені.');
    })();
}, 8000);

// ========== Д4: Послідовно vs паралельно ==========

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchUser(id) {
  await delay(500);
  if (id === 4) throw new Error(`User ${id}: 500 Internal Server Error`);
  return { id, name: `user-${id}` };
}

// loadSequential: for...of з await
const loadSequential = async (ids) => {
  const ok = [];
  const failed = [];
  for (const id of ids) {
    try {
      const user = await fetchUser(id);
      ok.push(user);
    } catch (e) {
      failed.push({ id, reason: e.message });
    }
  }
  return { ok, failed };
};

// loadParallel: Promise.all
const loadParallel = async (ids) => {
  const results = await Promise.all(ids.map(id => fetchUser(id).catch(e => ({ error: e, id }))));
  const ok = results.filter(r => !r.error);
  const failed = results.filter(r => r.error).map(r => ({ id: r.id, reason: r.error.message }));
  return { ok, failed };
};

// loadReport: Promise.allSettled
const loadReport = async (ids) => {
  const results = await Promise.allSettled(ids.map(id => fetchUser(id)));
  const ok = results.filter(r => r.status === 'fulfilled').map(r => r.value);
  const failed = results.filter(r => r.status === 'rejected').map((r, i) => {
    const idx = ids.findIndex(id => results[i].reason?.message.includes(String(id)));
    return { id: ids[results.indexOf(r)], reason: r.reason.message };
  });
  return { ok, failed };
};

// Тести Д4
// loadSequential [1,2,3]: ~1503ms
// loadParallel [1,2,3]: ~501ms
// loadSequential [1,2,3,4]: ~2004ms (падає на 4-му)
// loadParallel [1,2,3,4]: ~501ms, 3 ok + 1 failed

(async () => {
  console.log('\n--- Д4: loadSequential [1,2,3] ---');
  const t1 = Date.now();
  const seq123 = await loadSequential([1, 2, 3]);
  console.log(`loadSequential [1,2,3]: ${Date.now() - t1}ms`, seq123);

  console.log('\n--- Д4: loadParallel [1,2,3] ---');
  const t2 = Date.now();
  const par123 = await loadParallel([1, 2, 3]);
  console.log(`loadParallel [1,2,3]: ${Date.now() - t2}ms`, par123);

  console.log('\n--- Д4: loadParallel [1,2,3,4] ---');
  const t3 = Date.now();
  const par1234 = await loadParallel([1, 2, 3, 4]);
  console.log(`loadParallel [1,2,3,4]: ${Date.now() - t3}ms`, par1234);

  console.log('\n--- Д4: loadSequential [1,2,3,4] з try/catch ---');
  const t4 = Date.now();
  try {
    const seq1234 = await loadSequential([1, 2, 3, 4]);
    console.log(`loadSequential [1,2,3,4]: ${Date.now() - t4}ms`, seq1234);
  } catch (e) {
    console.log(`loadSequential [1,2,3,4] впав: ${e.message}`);
  }

  console.log('\n--- Д4: loadReport [1,2,3,4] ---');
  const rep = await loadReport([1, 2, 3, 4]);
  console.log('loadReport [1,2,3,4]:', rep);
})();

/*
Я б взяв loadReport (Promise.allSettled), бо реальні апі іноді падають через мережеві помилки і паралельне завантаження відхилиться повністю, тому ми втратимо всі успішні результати
Також через те, що послідовне завантаження дуже повільний, бо якщо перевірок більше, то на кожну по 500мс. Останній варіант шукає паралльно і причому повертає всі результати.
*/
