/* ============================================================
   ALENCARZAO — main.js
   Header, mobile nav, scroll reveal, contact form, shop & cart
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Sticky header ----------
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Mobile nav ----------
  const burger = document.querySelector(".burger");
  const navLinks = document.querySelector(".nav-links");
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("open");
      navLinks.classList.toggle("open");
      document.body.style.overflow = navLinks.classList.contains("open") ? "hidden" : "";
    });
    navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      burger.classList.remove("open");
      navLinks.classList.remove("open");
      document.body.style.overflow = "";
    }));
  }

  // ---------- Cookie / local-storage notice ----------
  if (!localStorage.getItem("alz_cookie_ok")) {
    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    const inLegal = location.pathname.endsWith("legal.html");
    banner.innerHTML = `
      <p data-i18n="cookie.text">${t("cookie.text")}</p>
      <div class="cookie-actions">
        ${inLegal ? "" : `<a href="legal.html#cookies" data-i18n="cookie.more">${t("cookie.more")}</a>`}
        <button class="btn btn-primary btn-sm cookie-ok" data-i18n="cookie.accept">${t("cookie.accept")}</button>
      </div>`;
    document.body.appendChild(banner);
    requestAnimationFrame(() => setTimeout(() => banner.classList.add("show"), 600));
    banner.querySelector(".cookie-ok").addEventListener("click", () => {
      localStorage.setItem("alz_cookie_ok", "1");
      banner.classList.remove("show");
      setTimeout(() => banner.remove(), 600);
    });
  }

  // ---------- Reveal on scroll ----------
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // ---------- Audience bars (media kit) ----------
  const barIo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll(".a-bar .bar i").forEach(bar => { bar.style.width = bar.dataset.w + "%"; });
        barIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll(".audience-bars").forEach(el => barIo.observe(el));

  // ---------- Contact form ----------
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      const status = document.getElementById("form-status");
      const data = Object.fromEntries(new FormData(form).entries());
      btn.disabled = true;
      btn.textContent = t("contact.form.sending");
      status.className = "form-status";

      // Save lead locally so it shows in the admin panel
      try {
        const leads = JSON.parse(localStorage.getItem("alz_leads") || "[]");
        leads.unshift({
          id: "L-" + Date.now().toString(36).toUpperCase(),
          date: new Date().toISOString(),
          name: data.name, email: data.email, company: data.company,
          budget: data.budget, type: data.type, message: data.message,
          status: "new"
        });
        localStorage.setItem("alz_leads", JSON.stringify(leads));
      } catch (e) { /* storage unavailable — email delivery below still works */ }

      // Send by email via FormSubmit (https://formsubmit.co)
      // NOTE: the very first submission triggers an activation email to the
      // inbox — click "Activate" once and every message after that arrives.
      try {
        const res = await fetch("https://formsubmit.co/ajax/soyunviciadoalfortniteyas@gmail.com", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            _subject: "💖 New brand proposal — alencarzao.com",
            _template: "table",
            Name: data.name,
            Email: data.email,
            "Brand / Company": data.company,
            Budget: data.budget,
            "Collaboration type": data.type,
            Message: data.message
          })
        });
        if (!res.ok) throw new Error("send failed");
        status.textContent = t("contact.form.ok");
        status.classList.add("ok");
        form.reset();
      } catch (e) {
        status.textContent = t("contact.form.err");
        status.classList.add("err");
      } finally {
        btn.disabled = false;
        btn.textContent = t("contact.form.send");
      }
    });
  }
});

/* ============================================================
   SHOP — product catalog + cart (localStorage, demo checkout)
   ============================================================ */

const ALZ_PRODUCTS = [
  { id: "tee",    name: { en: "Alencarzao Oversized Tee", es: "Camiseta oversize Alencarzao", pt: "Camiseta oversized Alencarzao" }, cat: "apparel",     price: 29.9, old: 39.9, img: "assets/img/product-1.svg", badge: "hot" },
  { id: "hoodie", name: { en: "Pink Energy Cropped Hoodie", es: "Sudadera crop Pink Energy", pt: "Moletom cropped Pink Energy" },   cat: "apparel",     price: 54.9, old: null, img: "assets/img/product-2.svg", badge: "new" },
  { id: "hat",    name: { en: "Tropical Bucket Hat", es: "Bucket hat tropical", pt: "Bucket hat tropical" },                         cat: "accessories", price: 24.9, old: null, img: "assets/img/product-3.svg", badge: null },
  { id: "case",   name: { en: "Sunset Phone Case", es: "Funda de móvil Sunset", pt: "Capinha Sunset" },                              cat: "accessories", price: 19.9, old: 24.9, img: "assets/img/product-4.svg", badge: "limited" },
  { id: "towel",  name: { en: "Brasil Beach Towel", es: "Toalla de playa Brasil", pt: "Canga de praia Brasil" },                     cat: "accessories", price: 34.9, old: null, img: "assets/img/product-5.svg", badge: "new" },
  { id: "cap",    name: { en: "ALZ Signature Cap", es: "Gorra ALZ Signature", pt: "Boné ALZ Signature" },                            cat: "apparel",     price: 27.9, old: null, img: "assets/img/product-6.svg", badge: null }
];

const Cart = {
  get() { try { return JSON.parse(localStorage.getItem("alz_cart") || "[]"); } catch (e) { return []; } },
  save(items) { localStorage.setItem("alz_cart", JSON.stringify(items)); Cart.render(); },
  add(id) {
    const items = Cart.get();
    const found = items.find(i => i.id === id);
    if (found) found.qty++; else items.push({ id, qty: 1 });
    Cart.save(items);
    toast(t("cart.added"));
  },
  setQty(id, qty) {
    let items = Cart.get();
    const found = items.find(i => i.id === id);
    if (!found) return;
    found.qty = qty;
    items = items.filter(i => i.qty > 0);
    Cart.save(items);
  },
  total() {
    return Cart.get().reduce((s, i) => {
      const p = ALZ_PRODUCTS.find(p => p.id === i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  },
  count() { return Cart.get().reduce((s, i) => s + i.qty, 0); },
  checkout() {
    const items = Cart.get();
    if (!items.length) return;
    const orders = JSON.parse(localStorage.getItem("alz_orders") || "[]");
    orders.unshift({
      id: "ALZ-" + Date.now().toString(36).toUpperCase(),
      date: new Date().toISOString(),
      items: items.map(i => {
        const p = ALZ_PRODUCTS.find(p => p.id === i.id);
        return { name: p ? p.name.en : i.id, qty: i.qty, price: p ? p.price : 0 };
      }),
      total: Cart.total(),
      status: "pending"
    });
    localStorage.setItem("alz_orders", JSON.stringify(orders));
    Cart.save([]);
    document.querySelector(".cart-drawer")?.classList.remove("open");
    document.querySelector(".drawer-backdrop")?.classList.remove("show");
    toast(t("cart.checkout.ok"));
  },
  render() {
    const lang = localStorage.getItem("alz_lang") || "en";
    const countEl = document.querySelector(".cart-count");
    if (countEl) countEl.textContent = Cart.count();
    const list = document.querySelector(".cart-items");
    if (!list) return;
    const items = Cart.get();
    if (!items.length) {
      list.innerHTML = `<p class="cart-empty" data-i18n="cart.empty">${t("cart.empty")}</p>`;
    } else {
      list.innerHTML = items.map(i => {
        const p = ALZ_PRODUCTS.find(p => p.id === i.id);
        if (!p) return "";
        return `<div class="cart-item">
          <img src="${p.img}" alt="${p.name[lang] || p.name.en}">
          <div><h4>${p.name[lang] || p.name.en}</h4>
            <div class="qty">
              <button onclick="Cart.setQty('${p.id}', ${i.qty - 1})">−</button>
              <span>${i.qty}</span>
              <button onclick="Cart.setQty('${p.id}', ${i.qty + 1})">+</button>
            </div>
          </div>
          <b>$${(p.price * i.qty).toFixed(2)}</b>
        </div>`;
      }).join("");
    }
    const totalEl = document.querySelector(".cart-total b");
    if (totalEl) totalEl.textContent = "$" + Cart.total().toFixed(2);
  }
};

function renderProducts(targetSel, filter = "all", limit = null) {
  const target = document.querySelector(targetSel);
  if (!target) return;
  const lang = localStorage.getItem("alz_lang") || "en";
  let list = ALZ_PRODUCTS.filter(p => filter === "all" || p.cat === filter);
  if (limit) list = list.slice(0, limit);
  const badgeKey = { new: "shop.badge.new", hot: "shop.badge.hot", limited: "shop.badge.limited" };
  const catKey = { apparel: "shopp.apparel", accessories: "shopp.accessories" };
  target.innerHTML = list.map((p, i) => `
    <div class="product-card reveal reveal-d${i % 4}">
      <div class="p-img">
        <img src="${p.img}" alt="${p.name[lang] || p.name.en}" loading="lazy">
        ${p.badge ? `<span class="p-badge">${t(badgeKey[p.badge])}</span>` : ""}
      </div>
      <div class="p-body">
        <span class="p-cat">${t(catKey[p.cat])}</span>
        <h3>${p.name[lang] || p.name.en}</h3>
        <div class="p-foot">
          <span class="p-price">${p.old ? `<s>$${p.old.toFixed(2)}</s>` : ""}$${p.price.toFixed(2)}</span>
          <button class="btn btn-primary btn-sm" onclick="Cart.add('${p.id}')">${t("shop.add")}</button>
        </div>
      </div>
    </div>`).join("");
  target.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
}

function toast(msg) {
  let el = document.querySelector(".toast");
  if (!el) { el = document.createElement("div"); el.className = "toast"; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2600);
}

// Cart drawer wiring
document.addEventListener("DOMContentLoaded", () => {
  const fab = document.querySelector(".cart-fab");
  const drawer = document.querySelector(".cart-drawer");
  const backdrop = document.querySelector(".drawer-backdrop");
  if (fab && drawer) {
    const close = () => { drawer.classList.remove("open"); backdrop?.classList.remove("show"); };
    fab.addEventListener("click", () => { drawer.classList.add("open"); backdrop?.classList.add("show"); });
    drawer.querySelector(".cart-close")?.addEventListener("click", close);
    backdrop?.addEventListener("click", close);
    drawer.querySelector(".cart-checkout-btn")?.addEventListener("click", () => Cart.checkout());
  }
  Cart.render();
  document.addEventListener("langchange", () => Cart.render());
});
