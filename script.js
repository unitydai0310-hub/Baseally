document.documentElement.classList.add("js");

async function loadSiteContent() {
  try {
    const res = await fetch("/content/site.json", { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function toTelHref(phone) {
  const digits = String(phone || "").replace(/[^\d+]/g, "");
  if (!digits) return null;
  return `tel:${digits.replace(/^\+/, "+")}`;
}

function toMailtoHref(email) {
  const value = String(email || "").trim();
  if (!value) return null;
  return `mailto:${value}`;
}

function setText(el, value) {
  if (!el) return;
  el.textContent = String(value ?? "");
}

function setMultilineText(el, value) {
  if (!el) return;
  const text = String(value ?? "");
  // Keep it safe: no HTML injection.
  el.textContent = "";
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    if (i > 0) el.appendChild(document.createElement("br"));
    el.appendChild(document.createTextNode(lines[i]));
  }
}

function applySiteContent(content) {
  if (!content) return;

  // data-content="key" -> text
  for (const el of document.querySelectorAll("[data-content]")) {
    const key = el.getAttribute("data-content");
    if (!key) continue;
    if (!(key in content)) continue;
    if (key === "representativeMessage") setMultilineText(el, content[key]);
    else setText(el, content[key]);
  }

  // Images: data-content-src="key"
  for (const img of document.querySelectorAll("[data-content-src]")) {
    const key = img.getAttribute("data-content-src");
    if (!key) continue;
    const src = content[key];
    if (!src) continue;
    if (img instanceof HTMLImageElement) img.src = String(src);
  }

  // Update mailto/tel hrefs when we also control the text
  for (const a of document.querySelectorAll("a[data-content]")) {
    const key = a.getAttribute("data-content");
    if (!key) continue;
    const value = content[key];
    if (!value) continue;
    if (key.toLowerCase().includes("email")) {
      const href = toMailtoHref(value);
      if (href) a.setAttribute("href", href);
    }
    if (key.toLowerCase().includes("phone")) {
      const href = toTelHref(value);
      if (href) a.setAttribute("href", href);
    }
  }
}

loadSiteContent().then(applySiteContent);

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const header = document.querySelector("[data-header]");
function updateHeaderElevation() {
  if (!header) return;
  header.dataset.elevated = window.scrollY > 4 ? "true" : "false";
}
updateHeaderElevation();
window.addEventListener("scroll", updateHeaderElevation, { passive: true });

const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

function setNavOpen(open) {
  if (!navToggle || !nav) return;
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  nav.dataset.open = open ? "true" : "false";
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setNavOpen(!isOpen);
  });

  nav.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLAnchorElement)) return;
    setNavOpen(false);
  });
}

// Smooth scroll (respects reduced motion)
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.style.scrollBehavior = "smooth";
}

// Subtle reveal on scroll (no-op when reduced motion)
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealEls = Array.from(document.querySelectorAll(".reveal"));
if (revealEls.length) {
  let allowReveal = false;
  const hasIO = "IntersectionObserver" in window;
  const revealVisibleNow = () => {
    for (const el of revealEls) {
      if (el.classList.contains("is-visible")) continue;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
      if (inView) el.classList.add("is-visible");
    }
  };
  const revealAll = () => {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  };

  const onFirstScroll = () => {
    allowReveal = true;
    if (prefersReduced || !hasIO) {
      revealAll();
    } else {
      revealVisibleNow();
    }
    window.removeEventListener("scroll", onFirstScroll);
  };

  window.addEventListener("scroll", onFirstScroll, { passive: true });

  if (!(prefersReduced || !hasIO)) {
    const io = new IntersectionObserver(
      (entries) => {
        if (!allowReveal) return;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    revealEls.forEach((el) => io.observe(el));
  }
}
