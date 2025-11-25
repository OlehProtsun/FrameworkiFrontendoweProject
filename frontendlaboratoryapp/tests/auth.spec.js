const { test, expect } = require("@playwright/test");

// ⚠️ ВСТАВ СВОГО ТЕСТОВОГО КОРИСТУВАЧА З FIREBASE
const TEST_EMAIL = "olegprocun@gmail.com";
const TEST_PASSWORD = "123456";

test("after login user is redirected to profile (protected route)", async ({ page }) => {
  // 1. Заходимо одразу на захищений маршрут
  await page.goto("/user/profile");

  // 2. Має відбутися редірект на /user/signin з параметром returnUrl
  await expect(page).toHaveURL(/\/user\/signin/);

  // 3. Заповнюємо форму логіну
  // ПІДГОНИ ЛОКАТОРИ ПІД СВОЇ ЛЕЙБЛИ/PLACEHOLDER'И
  await page.getByLabel(/email/i).fill(TEST_EMAIL);
  await page.getByLabel(/password/i).fill(TEST_PASSWORD);

  // 4. Сабмітимо форму
  await page.getByRole("button", { name: /sign in/i }).click();

  // 5. Після успішного логіну користувача повинно перекинути назад на профіль
  await expect(page).toHaveURL("/user/profile");

});

test("unauthenticated user is redirected to sign in when opening profile", async ({
  page,
}) => {
  // 1. Гарантуємо, що ми як гість: чистий контекст (playwright це і так робить для кожного тесту)
  // 2. Заходимо на захищену сторінку
  await page.goto("/user/profile");

  // 3. Перевіряємо, що нас перекинуло на /user/signin
  await expect(page).toHaveURL(/\/user\/signin/);

  // 4. На формі логіну можемо перевірити, що є заголовок або кнопка
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /sign in/i
  );
});

test("unauthenticated user is redirected to sign in from change password", async ({
  page,
}) => {
  await page.goto("/user/changepassword");
  await expect(page).toHaveURL(/\/user\/signin/);
});
