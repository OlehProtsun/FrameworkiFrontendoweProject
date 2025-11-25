const { test, expect } = require("@playwright/test");

test("has link to sign in page", async ({ page }) => {
  await page.goto("/"); // завдяки baseURL це = http://localhost:3000/

    await page
    .locator("aside")
    .getByRole("link", { name: "Sign in" })
    .click();


  await expect(page).toHaveURL("/user/signin");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /sign in/i
  );
});
