document.documentElement.classList.add("js");

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
