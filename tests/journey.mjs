import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const base = process.env.TEST_URL || "http://127.0.0.1:3000";
const out = "work/verification";
await fs.mkdir(out, { recursive: true });
await page.goto(base + "/#/home");
await page.waitForTimeout(300);
await expect(page.locator(".hero")).toBeVisible();
await expect(page.locator(".portrait-shell img")).toHaveAttribute(
  "src",
  /matthew-github.jpg/,
);
await expect(
  page.getByRole("link", { name: "Home", exact: true }),
).toHaveAttribute("aria-current", "page");
await page.getByRole("link", { name: "About", exact: true }).click();
await expect(page.locator("#about-page")).toBeVisible();
await expect(
  page.getByRole("heading", { name: "Brigham Young University", exact: false }),
).toBeVisible();
await page
  .getByRole("link", { name: "Projects", exact: false })
  .first()
  .click();
await expect(page.locator(".station-copy h2")).toHaveText("Patrol Center");
await page
  .getByRole("button", { name: "Travel to ShopWyse", exact: true })
  .click();
await page.waitForTimeout(1200);
await expect(page.locator(".station-copy h2")).toHaveText("ShopWyse");
await expect(page.locator(".project-actions>a")).toHaveAttribute(
  "href",
  "https://github.com/mtchr/Shopwyse_Grocery_App",
);
await page.goBack();
await expect(page.locator(".station-copy h2")).toHaveText("Patrol Center");
await page.getByRole("button", { name: "Open project index" }).click();
await expect(page.getByRole("dialog")).toBeVisible();
await expect(page.locator(".index-list>button")).toHaveCount(4);
await page.locator('[data-index="2"]').click();
await page.waitForTimeout(1200);
await expect(page.locator(".station-copy h2")).toHaveText("CougarCalc");
await page.getByRole("button", { name: "Pause ambient motion" }).click();
await expect(
  page.getByRole("button", { name: "Resume ambient motion" }),
).toBeVisible();
await page.getByRole("button", { name: "Space journey", exact: false }).click();
await expect(
  page.getByRole("button", { name: "Direct navigation", exact: false }),
).toHaveAttribute("aria-pressed", "true");
await page.getByRole("link", { name: "Home", exact: true }).click();
await page.locator("body").click({ position: { x: 10, y: 130 } });
await page.keyboard.press("ArrowRight");
await expect(page.locator(".station-copy h2")).toHaveText("Patrol Center");
await page.keyboard.press("ArrowLeft");
await expect(page.locator(".hero")).toBeVisible();
await page.evaluate(() =>
  window.scrollTo(0, document.documentElement.scrollHeight),
);
await page.waitForTimeout(400);
await expect(page.locator(".station-copy h2")).toHaveText("Northwest Aquarium");
await page.goto(base + "/#/projects/shopwyse");
await expect(page.locator(".station-copy h2")).toHaveText("ShopWyse");
for (const [width, height] of [
  [1920, 1080],
  [1440, 900],
  [1280, 800],
  [1024, 768],
  [768, 1024],
  [390, 844],
  [375, 667],
  [320, 658],
]) {
  await page.setViewportSize({ width, height });
  for (const route of [
    "home",
    "projects/patrol-center",
    "projects/shopwyse",
    "projects/cougarcalc",
    "projects/northwest-aquarium",
    "about",
  ]) {
    await page.goto(base + "/#/" + route);
    await page.waitForTimeout(140);
    const check = await page.evaluate(() => {
      const about = location.hash.includes("about");
      const content = about
        ? document.querySelector("#about-page")
        : document.querySelector(".journey-layer:not([hidden])");
      const action = about ? null : content.querySelector(".primary-button");
      const actionBox = action?.getBoundingClientRect();
      const header = document
        .querySelector(".site-header")
        .getBoundingClientRect();
      const nav = document.querySelector(".flight-nav").getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        missing: [...document.images]
          .filter((i) => !i.complete || i.naturalWidth === 0)
          .map((i) => i.src),
        actionOverlapsNav: actionBox ? actionBox.bottom > nav.top : false,
        actionOverlapsHeader: actionBox ? actionBox.top < header.bottom : false,
        staleText: /Seth Sherman|Breadcrumbs|KoalatyTime|Old Ship Zion/.test(
          document.body.innerText,
        ),
      };
    });
    if (
      check.overflow ||
      check.missing.length ||
      check.actionOverlapsNav ||
      check.actionOverlapsHeader ||
      check.staleText
    )
      throw Error(JSON.stringify({ width, height, route, ...check }));
    if (
      [1440, 390].includes(width) &&
      ["home", "about", "projects/shopwyse"].includes(route)
    )
      await page.screenshot({
        path: `${out}/${width}-${route.replaceAll("/", "-")}.png`,
      });
  }
  console.log(
    `PASS: ${width}×${height}, home, about, four projects, images, navigation clearance, no overflow.`,
  );
}
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(base + "/#/home");
await expect(
  page.getByRole("button", { name: "Resume ambient motion" }),
).toBeVisible();
await expect(
  page.getByRole("button", { name: "Direct navigation", exact: false }),
).toHaveAttribute("aria-pressed", "true");
if (errors.length) throw Error(errors.join("\n"));
await browser.close();
console.log(
  "PASS: routes, deep links, browser back, project destinations, index dialog, keyboard, scroll travel, reduced motion, image replacement, GitHub links, and 8 responsive sizes. No JavaScript errors.",
);
