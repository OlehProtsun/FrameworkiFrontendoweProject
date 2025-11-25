const { test, expect } = require("@playwright/test");

const TEST_EMAIL = "olegprocun@gmail.com";
const TEST_PASSWORD = "123456";

test("after login user is redirected to profile (protected route)", async ({ page }) => {
  await page.goto("/user/profile");

  await expect(page).toHaveURL(/\/user\/signin/);

  await page.getByLabel(/email/i).fill(TEST_EMAIL);
  await page.getByLabel(/password/i).fill(TEST_PASSWORD);

  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL("/user/profile");

});

test("unauthenticated user is redirected to sign in when opening profile", async ({
  page,
}) => {
  await page.goto("/user/profile");

  await expect(page).toHaveURL(/\/user\/signin/);

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
