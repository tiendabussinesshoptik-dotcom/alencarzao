/* ============================================================
   ALENCARZAO — Admin panel (demo)
   Data lives in localStorage so the demo feels real:
   - alz_admin_products  (catalog)
   - alz_orders          (created by the public shop checkout)
   - alz_leads           (created by the contact form)
   ============================================================ */

const ADMIN_PASS = "alencar2026"; // demo credential — replace with real auth before production

// ---------- Seed data ----------
const SEED_PRODUCTS = [
  { id: "tee",    name: "Alencarzao Oversized Tee",     cat: "Apparel",     price: 29.9, stock: 124, active: true,  img: "../assets/img/product-1.svg" },
  { id: "hoodie", name: "Pink Energy Cropped Hoodie",   cat: "Apparel",     price: 54.9, stock: 56,  active: true,  img: "../assets/img/product-2.svg" },
  { id: "hat",    name: "Tropical Bucket Hat",          cat: "Accessories", price: 24.9, stock: 89,  active: true,  img: "../assets/img/product-3.svg" },
  { id: "case",   name: "Sunset Phone Case",            cat: "Accessories", price: 19.9, stock: 12,  active: true,  img: "../assets/img/product-4.svg" },
  { id: "towel",  name: "Brasil Beach Towel",           cat: "Accessories", price: 34.9, stock: 0,   active: false, img: "../assets/img/product-5.svg" },
  { id: "cap",    name: "ALZ Signature Cap",            cat: "Apparel",     price: 27.9, stock: 203, active: true,  img: "../assets/img/product-6.svg" }
];

const SEED_ORDERS = [
  { id: "ALZ-9F3K2", date: "2026-06-09T14:22:00Z", items: [{ name: "Alencarzao Oversized Tee", qty: 2, price: 29.9 }], total: 59.8, status: "shipped" },
  { id: "ALZ-8B1M7", date: "2026-06-08T09:10:00Z", items: [{ name: "Pink Energy Cropped Hoodie", qty: 1, price: 54.9 }, { name: "Sunset Phone Case", qty: 1, price: 19.9 }], total: 74.8, status: "pending" },
  { id: "ALZ-7D4Q1", date: "2026-06-05T18:45:00Z", items: [{ name: "Tropical Bucket Hat", qty: 1, price: 24.9 }], total: 24.9, status: "delivered" }
];

const SEED_LEADS = [
  { id: "L-DEMO1", date: "2026-06-10T11:00:00Z", name: "Camila Rocha", email: "camila@sheinbrasil.com", company: "SHEIN Brasil", budget: "$5,000 – $15,000", type: "TikTok / Instagram campaign", message: "Summer collection campaign — 3 videos + stories.", status: "new" },
  { id: "L-DEMO2", date: "2026-06-07T16:30:00Z", name: "Lucas Ferreira", email: "lucas@boticario.com", company: "O Boticário", budget: "$15,000+", type: "Brand ambassador", message: "Quarterly ambassadorship for the new fragrance line.", status: "negotiating" },
  { id: "L-DEMO3", date: "2026-06-02T10:15:00Z", name: "Ana Duarte", email: "ana@havaianas.com", company: "Havaianas", budget: "$1,000 – $5,000", type: "UGC content", message: "UGC pack for paid social, summer drop.", status: "closed" }
];

function store(key, seed) {
  if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(seed));
  return JSON.parse(localStorage.getItem(key));
}
function save(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

// Merge seeded demo leads/orders with ones created live on the public site
function getLeads()  { const live = JSON.parse(localStorage.getItem("alz_leads")  || "[]"); return [...live.filter(l => !l.seeded), ...store("alz_seed_leads", SEED_LEADS)]; }
function getOrders() { const live = JSON.parse(localStorage.getItem("alz_orders") || "[]"); return [...live, ...store("alz_seed_orders", SEED_ORDERS)]; }

// ---------- Auth ----------
const loginScreen = document.getElementById("login-screen");
const app = document.getElementById("app");

function showApp() { loginScreen.hidden = true; app.hidden = false; renderAll(); }

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const pass = document.getElementById("login-pass").value;
  if (pass === ADMIN_PASS) {
    sessionStorage.setItem("alz_admin", "1");
    showApp();
  } else {
    document.getElementById("login-err").style.display = "block";
  }
});
document.getElementById("logout-btn").addEventListener("click", () => {
  sessionStorage.removeItem("alz_admin");
  location.reload();
});

// ---------- Navigation ----------
const titles = { dashboard: "Dashboard", products: "Products", orders: "Orders", leads: "Brand Leads", social: "Social Stats" };
document.querySelectorAll(".side-link").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".side-link").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.getElementById("view-" + btn.dataset.view).classList.add("active");
    document.getElementById("view-title").textContent = titles[btn.dataset.view];
  });
});

// ---------- Renderers ----------
function fmtDate(iso) { return new Date(iso).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }); }
function money(n) { return "$" + Number(n).toFixed(2); }

function renderDashboard() {
  const orders = getOrders();
  const leads = getLeads();
  document.getElementById("kpi-revenue").textContent = money(orders.reduce((s, o) => s + o.total, 0));
  document.getElementById("kpi-orders").textContent = orders.length;
  document.getElementById("kpi-leads").textContent = leads.length;

  const growth = [8.1, 8.9, 9.6, 10.2, 10.9, 11.5, 12.0, 12.4];
  const labels = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  document.getElementById("chart-growth").innerHTML = growth.map((v, i) =>
    `<div class="bar-col"><div class="bar-v" style="height:${(v / 13) * 100}%" title="${v}M"></div><small>${labels[i]}</small></div>`
  ).join("");

  document.getElementById("dash-leads").innerHTML = leads.slice(0, 4).map(l =>
    `<div class="mini-item"><span class="ic">💌</span><div><b>${esc(l.company || l.name)}</b><small>${esc(l.type)} · ${esc(l.budget)}</small></div></div>`
  ).join("") || '<p class="muted">No leads yet.</p>';
}

function renderProducts() {
  const products = store("alz_admin_products", SEED_PRODUCTS);
  document.querySelector("#products-table tbody").innerHTML = products.map((p, i) => `
    <tr>
      <td><img class="p-thumb" src="${p.img}" alt="">${esc(p.name)}</td>
      <td>${esc(p.cat)}</td>
      <td><b>${money(p.price)}</b></td>
      <td>${p.stock === 0 ? '<span class="badge yellow">Out of stock</span>' : p.stock}</td>
      <td>${p.active ? '<span class="badge green">Active</span>' : '<span class="badge gray">Hidden</span>'}</td>
      <td class="row-actions"><button onclick="toggleProduct(${i})">${p.active ? "Hide" : "Show"}</button></td>
    </tr>`).join("");
}

function toggleProduct(i) {
  const products = store("alz_admin_products", SEED_PRODUCTS);
  products[i].active = !products[i].active;
  save("alz_admin_products", products);
  renderProducts();
}

document.getElementById("add-product-btn").addEventListener("click", () => {
  const name = prompt("Product name:");
  if (!name) return;
  const price = parseFloat(prompt("Price (USD):", "29.90")) || 29.9;
  const products = store("alz_admin_products", SEED_PRODUCTS);
  products.unshift({ id: "p" + Date.now(), name, cat: "Apparel", price, stock: 50, active: true, img: "../assets/img/product-1.svg" });
  save("alz_admin_products", products);
  renderProducts();
});

const ORDER_FLOW = { pending: "shipped", shipped: "delivered", delivered: "delivered" };
function renderOrders() {
  const orders = getOrders();
  const badge = { pending: "yellow", shipped: "pink", delivered: "green" };
  document.querySelector("#orders-table tbody").innerHTML = orders.map(o => `
    <tr>
      <td><b>${esc(o.id)}</b></td>
      <td>${fmtDate(o.date)}</td>
      <td>${o.items.map(i => `${i.qty}× ${esc(i.name)}`).join("<br>")}</td>
      <td><b>${money(o.total)}</b></td>
      <td><span class="badge ${badge[o.status] || "gray"}">${o.status}</span></td>
      <td class="row-actions">${o.status !== "delivered" ? `<button onclick="advanceOrder('${o.id}')">Mark ${ORDER_FLOW[o.status]}</button>` : ""}</td>
    </tr>`).join("") || '<tr><td colspan="6" class="muted">No orders yet — place one in the demo shop.</td></tr>';
}

function advanceOrder(id) {
  ["alz_orders", "alz_seed_orders"].forEach(key => {
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    const o = list.find(o => o.id === id);
    if (o) { o.status = ORDER_FLOW[o.status] || o.status; save(key, list); }
  });
  renderOrders();
  renderDashboard();
}

const LEAD_FLOW = { new: "negotiating", negotiating: "closed", closed: "closed" };
function renderLeads() {
  const leads = getLeads();
  const badge = { new: "pink", negotiating: "yellow", closed: "green" };
  document.querySelector("#leads-table tbody").innerHTML = leads.map(l => `
    <tr>
      <td><b>${esc(l.company || "—")}</b></td>
      <td>${esc(l.name)}<br><small class="muted">${esc(l.email)}</small></td>
      <td>${esc(l.type)}</td>
      <td>${esc(l.budget)}</td>
      <td>${fmtDate(l.date)}</td>
      <td><span class="badge ${badge[l.status] || "gray"}">${l.status}</span></td>
      <td class="row-actions">${l.status !== "closed" ? `<button onclick="advanceLead('${l.id}')">→ ${LEAD_FLOW[l.status]}</button>` : ""}</td>
    </tr>`).join("") || '<tr><td colspan="7" class="muted">No leads yet — send one from the contact form.</td></tr>';
}

function advanceLead(id) {
  ["alz_leads", "alz_seed_leads"].forEach(key => {
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    const l = list.find(l => l.id === id);
    if (l) { l.status = LEAD_FLOW[l.status] || l.status; save(key, list); }
  });
  renderLeads();
}

function renderSocial() {
  const data = [["TikTok", 62, ""], ["Instagram", 24, "gold"], ["YouTube", 9, "dark"], ["Other", 5, "gold"]];
  document.getElementById("chart-views").innerHTML = data.map(([label, v, cls]) =>
    `<div class="bar-col"><div class="bar-v ${cls}" style="height:${v}%" title="${v}M views"></div><small>${label} · ${v}M</small></div>`
  ).join("");
}

function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function renderAll() {
  renderDashboard();
  renderProducts();
  renderOrders();
  renderLeads();
  renderSocial();
}

// Auto-login for an existing session (kept at the end so all
// declarations above exist when renderAll runs)
if (sessionStorage.getItem("alz_admin") === "1") showApp();
