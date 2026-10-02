// Browser checks: desktop nav, mobile menu, footer links, interest form, no console errors.
// Usage: start the server, then `npm run verify:nav`. Set SCREENSHOTS=dir to save full-page captures.
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.APP_ORIGIN ?? "http://127.0.0.1:3120";
const SHOTS = process.env.SCREENSHOTS;
let failures = 0;
function check(label, ok, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  (${detail})` : ""}`);
}

const browser = await chromium.launch();
const errors = [];

async function open(viewport, path = "/") {
  const page = await browser.newPage({ viewport });
  page.on("pageerror", (error) => errors.push(`${path}: ${error.message}`));
  page.on("console", (message) => message.type() === "error" && errors.push(`${path}: ${message.text()}`));
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  return page;
}

// Desktop navigation
{
  const page = await open({ width: 1440, height: 900 });
  const links = page.locator(".site-nav a");
  check("desktop nav has 6 links", (await links.count()) === 6);
  check("desktop menu toggle hidden", !(await page.locator(".menu-toggle").isVisible()));
  await page.locator(".site-nav a", { hasText: "Our Projects" }).click();
  await page.waitForURL("**/projects");
  check("nav → /projects", page.url().endsWith("/projects"));
  check("active link marked", (await page.locator('.site-nav a[aria-current="page"]').textContent())?.trim() === "Our Projects");
  await page.locator(".project-card").first().click();
  await page.waitForURL("**/projects/*");
  check("project card → detail", /\/projects\/[a-z0-9-]+$/.test(page.url()));
  await page.close();
}

// Mobile menu
{
  const page = await open({ width: 390, height: 844 });
  const toggle = page.locator(".menu-toggle");
  check("mobile toggle visible", await toggle.isVisible());
  check("desktop nav hidden on mobile", !(await page.locator(".site-nav").isVisible()));
  await toggle.click();
  check("mobile menu opens", await page.locator("#mobile-menu").isVisible());
  await page.keyboard.press("Escape");
  check("Escape closes menu", !(await page.locator("#mobile-menu").isVisible()));
  await toggle.click();
  await page.locator(".mobile-menu__link", { hasText: "Contact Us" }).click();
  await page.waitForURL("**/contact");
  check("menu closes after navigation", !(await page.locator("#mobile-menu").isVisible()));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check("no horizontal scroll at 390px", overflow <= 0, `${overflow}px`);
  await page.close();
}

// Footer links resolve
{
  const page = await open({ width: 1280, height: 800 });
  const hrefs = await page.locator(".site-footer a[href^='/']").evaluateAll((els) => els.map((el) => el.getAttribute("href")));
  for (const href of new Set(hrefs)) {
    const response = await page.request.get(`${BASE}${href}`);
    check(`footer ${href}`, response.ok(), String(response.status()));
  }
  await page.close();
}

// Interest form: client validation errors, then success
{
  const page = await open({ width: 1280, height: 900 }, "/contact");
  const form = page.locator(".interest-form");
  const before = errors.length;
  await form.locator('button[type="submit"]').click();
  await page.locator(".form-alert").waitFor();
  // The 400 from this deliberate invalid submit is expected; drop Chrome's resource-error log for it.
  errors.splice(before, errors.length - before, ...errors.slice(before).filter((e) => !e.includes("status of 400")));
  check("empty submit shows field errors", (await page.locator(".form-field__error").count()) > 3);
  await form.locator('[name="firstName"]').fill("Test");
  await form.locator('[name="lastName"]').fill("User");
  await form.locator('[name="email"]').fill("test@example.com");
  await form.locator('[name="phone"]').fill("+92 300 0000000");
  await form.locator('[name="whatsapp"]').fill("+92 300 0000000");
  await form.locator('[name="unitType"]').selectOption("residential");
  await form.locator('[name="project"]').selectOption("burj-quaid");
  await form.locator('[name="consent"]').check();
  await form.locator('button[type="submit"]').click();
  await page.locator(".form-success").waitFor();
  check("valid submit shows success", await page.locator(".form-success").isVisible());
  await page.close();
}

// Insight search
{
  const page = await open({ width: 1280, height: 900 }, "/insights");
  await page.locator('input[type="search"]').fill("freehold");
  await page.waitForFunction(() => document.querySelectorAll(".insight-card").length === 1);
  check("insight search filters list", (await page.locator(".insight-card").count()) === 1);
  check("search mirrored into URL", page.url().includes("search=freehold"));
  await page.close();
}

if (SHOTS) {
  mkdirSync(SHOTS, { recursive: true });
  const routes = ["/", "/projects", "/projects/burj-quaid", "/about", "/shariah-compliant", "/insights", "/insights/freehold-vs-leasehold-property-pakistan", "/live", "/contact"];
  for (const [name, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
    for (const route of routes) {
      const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
      await page.goto(`${BASE}${route}`, { waitUntil: "load" });
      await page.waitForTimeout(1500);
      const file = `${SHOTS}/${name}${route === "/" ? "-home" : route.replaceAll("/", "-")}.png`;
      await page.screenshot({ path: file, fullPage: true });
      await page.close();
    }
  }
  console.log(`Screenshots saved to ${SHOTS}`);
}

check("no browser console errors", errors.length === 0, errors.slice(0, 5).join(" | "));
await browser.close();
console.log(failures ? `\n${failures} check(s) failed.` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
