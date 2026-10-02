// Verifies every public route, redirect and API contract against a running server.
// Usage: npm run dev (or build + start), then `npm run verify:routes`.
const BASE = process.env.APP_ORIGIN ?? "http://127.0.0.1:3120";

const projects = [
  "burj-quaid", "abs-executive", "abs-central", "pearl-one-courtyard-1", "pearl-one-courtyard-2",
  "pearl-one-courtyard-3", "pearl-one-premium", "pearl-one-capital", "sialkot-central",
  "pearl-one-royal", "abs-mall-residency-2", "abs-mall-residency-1", "pearl-one-tower",
];

const pages = [
  "/", "/projects", "/about", "/shariah-compliant", "/insights", "/insights?search=ring&page=1",
  "/live", "/contact", "/privacy-policy", "/robots.txt", "/sitemap.xml",
  "/insights/how-to-read-property-layout-plan-naqsha", "/api/health",
  ...projects.map((slug) => `/projects/${slug}`),
];

const redirects = [
  ["/pages/all-projects", "/projects"],
  ["/pages/about", "/about"],
  ["/pages/shariah-compliant", "/shariah-compliant"],
  ["/blogs/news", "/insights"],
  ["/blogs/news/freehold-vs-leasehold-property-pakistan", "/insights/freehold-vs-leasehold-property-pakistan"],
  ["/pages/abs-executive-y", "/projects/abs-executive"],
  ["/pages/mall-residency", "/projects/abs-mall-residency-1"],
  ["/pages/pearl-one-tower-yy", "/projects/pearl-one-tower"],
];

const validInterest = {
  firstName: "Test", lastName: "User", email: "test@example.com", phone: "+92 300 0000000",
  whatsapp: "+92 300 0000000", unitType: "residential", project: "burj-quaid", consent: true,
};

let failures = 0;
function check(label, ok, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  (${detail})` : ""}`);
}

const post = (operation, body, origin = BASE) =>
  fetch(`${BASE}/api/${operation}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

for (const path of pages) {
  const response = await fetch(`${BASE}${path}`);
  check(`200 ${path}`, response.status === 200, String(response.status));
}

for (const path of ["/does-not-exist", "/projects/does-not-exist", "/insights/does-not-exist"]) {
  const response = await fetch(`${BASE}${path}`);
  check(`404 ${path}`, response.status === 404, String(response.status));
}

for (const [from, to] of redirects) {
  const response = await fetch(`${BASE}${from}`, { redirect: "manual" });
  const location = response.headers.get("location") ?? "";
  check(`308 ${from} → ${to}`, response.status === 308 && new URL(location, BASE).pathname === to, `${response.status} ${location}`);
}

{
  const response = await fetch(`${BASE}/api/getProjectList?category=residential`);
  const body = await response.json();
  check("GET getProjectList filters", response.status === 200 && body.data.every((p) => p.category === "residential"));
}
{
  const response = await fetch(`${BASE}/api/getInsightList?page=2&pageSize=5`);
  const body = await response.json();
  check("GET getInsightList paginates", response.status === 200 && body.data.page === 2 && body.data.items.length === 5);
}
{
  const response = await fetch(`${BASE}/api/getProjectBySlug?slug=burj-quaid`);
  check("GET getProjectBySlug 200", response.status === 200);
}
for (const [label, path, status] of [
  ["bad pageSize", "/api/getInsightList?pageSize=abc", 400],
  ["bad category", "/api/getProjectList?category=castle", 400],
  ["missing slug", "/api/getProjectBySlug", 400],
  ["unknown slug", "/api/getProjectBySlug?slug=nope", 404],
  ["unknown operation", "/api/doesNotExist", 404],
]) {
  const response = await fetch(`${BASE}${path}`);
  check(`GET ${label} → ${status}`, response.status === status, String(response.status));
}

check("POST valid interest → 201", (await post("submitInterest", validInterest)).status === 201);
{
  const response = await post("submitInterest", { ...validInterest, email: "nope" });
  const body = await response.json();
  check("POST invalid email → 400 with field error", response.status === 400 && Boolean(body.error?.fields?.email));
}
check("POST malformed JSON → 400", (await post("submitInterest", "{not json")).status === 400);
check("POST wrong origin → 403", (await post("submitInterest", validInterest, "https://evil.example")).status === 403);
check("POST unknown operation → 404", (await post("doesNotExist", {})).status === 404);

console.log(failures ? `\n${failures} check(s) failed.` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
