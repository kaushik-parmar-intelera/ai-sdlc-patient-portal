import { expect, test } from "@playwright/test";

test.describe("US3 keyboard accessibility baseline", () => {
  test("supports predictable keyboard traversal for primary controls", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();

    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Public" })).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Private" })).toBeFocused();
  });
});
