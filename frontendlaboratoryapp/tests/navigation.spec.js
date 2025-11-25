const { test, expect } = require("@playwright/test");

test("has link to sign in page", async ({ page }) => {
  // 1. Відкриваємо головну
  await page.goto("/"); // завдяки baseURL це = http://localhost:3000/

    // шукаємо "Sign in" тільки всередині <aside> (сайдбар)
    await page
    .locator("aside")
    .getByRole("link", { name: "Sign in" })
    .click();


  // 3. Перевіряємо URL
  await expect(page).toHaveURL("/user/signin");

  // 4. Перевіряємо заголовок на сторінці логіну
  // Підлаштуй текст під свій <h1> (наприклад, "Sign in", "Sign in to your account" і т.д.)
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /sign in/i
  );
});
