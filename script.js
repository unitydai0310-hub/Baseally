const body = document.body;
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const year = document.getElementById("year");
const cursorBall = document.querySelector("[data-cursor-ball]");

if (year) year.textContent = String(new Date().getFullYear());

const markLoaded = () => {
  body.classList.add("is-loaded");
  document.querySelectorAll(".hero .reveal").forEach((el) => el.classList.add("is-visible"));
  
  // 1文字ずつのアニメーション処理
  const heroStatement = document.querySelector(".hero-statement");
  if (heroStatement) {
    const text = heroStatement.textContent;
    heroStatement.textContent = "";
    heroStatement.style.opacity = "1"; // アニメーション後の状態に設定
    
    text.split("").forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.className = "char";
      span.style.setProperty("--char-index", index);
      heroStatement.appendChild(span);
    });
  }
};

window.addEventListener("load", () => window.setTimeout(markLoaded, 280));
window.setTimeout(markLoaded, 1100);

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
  const progress = Math.min(window.scrollY / 900, 1);
  document.documentElement.style.setProperty("--hero-scale", String(1.08 - progress * 0.035));
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const setNavOpen = (open) => {
  if (!header || !navToggle) return;
  header.classList.toggle("is-open", open);
  body.classList.toggle("nav-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
};

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    setNavOpen(navToggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) setNavOpen(false);
  });
}

const revealTargets = [
  ...document.querySelectorAll(".reveal"),
  ...document.querySelectorAll(".line-title"),
];

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

if (cursorBall && window.matchMedia("(pointer: fine)").matches) {
  let targetX = -100;
  let targetY = -100;
  let currentX = -100;
  let currentY = -100;
  let rafId = 0;

  const renderBall = () => {
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;
    cursorBall.style.transform = `translate3d(${currentX - 16}px, ${currentY - 16}px, 0) rotate(${currentX * 0.35}deg)`;
    rafId = window.requestAnimationFrame(renderBall);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      body.classList.add("has-pointer");
      if (!rafId) rafId = window.requestAnimationFrame(renderBall);
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", () => {
    body.classList.remove("has-pointer");
  });
}
