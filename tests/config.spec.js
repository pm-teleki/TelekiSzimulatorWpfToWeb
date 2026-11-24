// @ts-check
import { test, expect } from "@playwright/test";
import path from "node:path";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Teleki szimulátor/);

  await page.getByRole("button", { name: "Szerkesztő" }).click();

  const uploadFile = path.join(process.cwd(), "Egy nap az iskolában");

  const uploadPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Import (mappa)" }).click();
  const fileChooser = await uploadPromise;
  await fileChooser.setFiles(uploadFile);

  await page.getByRole("button", { name: "Bezárás" }).click();
  await page.getByRole("button", { name: "Játék" }).click();
  await page.getByRole("combobox").selectOption("Egy nap az iskolában");

  await expect(page.locator("video")).toBeVisible();
  await expect(page.locator("#app")).toContainText("Nem ébredek fel");
  await expect(page.locator("#app")).toContainText("Szundi");
  await expect(page.locator("#app")).toContainText("Felkelek");
});
