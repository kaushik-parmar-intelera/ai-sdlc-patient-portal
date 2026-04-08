import { expect, test } from "@playwright/test";

test.describe("US1 website launch smoke", () => {
  test("renders starter page with baseline navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Patient Portal" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Public" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Private" })).toBeVisible();
  });
});
