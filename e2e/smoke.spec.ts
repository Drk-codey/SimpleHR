import { test, expect } from "@playwright/test";

// Real critical-path specs (login, submit/approve leave, add employee) are
// written in Phase 7 once those flows exist. This smoke test just confirms
// the app boots and the login page renders, so `npm run e2e` isn't empty.
test("login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});
