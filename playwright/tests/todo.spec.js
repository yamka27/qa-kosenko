const { test, expect } = require('@playwright/test');

test('TodoMVC: додавання 3 задач і позначення першої виконаною', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  const tasks = ['поїсти', 'помитися', 'піти спати'];

  for (const task of tasks) {
    const input = page.locator('.new-todo');
    await input.fill(task);
    await input.press('Enter');
  }

  const counter = page.locator('.todo-count');
  await expect(counter).toHaveText('3 items left');

  const firstTaskCheckbox = page.locator('.todo-list li').first().locator('input[type="checkbox"]');
  await firstTaskCheckbox.click();

  await expect(counter).toHaveText('2 items left');
});