"use strict";

const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("primary-nav");
const toast = document.getElementById("toast");
const email = "buriii1357@gmail.com";

// Save and restore a visitor's light/dark preference.
let initialTheme = "dark";
try {
  const saved = localStorage.getItem("burhan-portfolio-theme");
  if (saved === "light" || saved === "dark") initialTheme = saved;
  else if (window.matchMedia("(prefers-color-scheme: light)").matches) initialTheme = "light";
} catch (_) { /* Site still works if browser storage is unavailable. */ }

function applyTheme(theme) {
  const isLight = theme === "light";
  body.dataset.theme = theme;
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  themeToggle.setAttribute("aria-pressed", String(isLight));
  document.querySelector('meta[name="theme-color"]').setAttribute("content", isLight ? "#f7f9fd" : "#0c1427");
  try { localStorage.setItem("burhan-portfolio-theme", theme); } catch (_) { /* Optional */ }
}
applyTheme(initialTheme);
themeToggle.addEventListener("click", () => applyTheme(body.dataset.theme === "dark" ? "light" : "dark"));

// Accessible mobile navigation.
function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  nav.classList.remove("open");
}
menuToggle.addEventListener("click", () => {
  const open = !nav.classList.contains("open");
  nav.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
document.addEventListener("click", e => { if (!nav.contains(e.target) && !menuToggle.contains(e.target)) closeMenu(); });

// Functional filtering of real projects.
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(other => {
      const active = other === button;
      other.classList.toggle("active", active);
      other.setAttribute("aria-pressed", String(active));
    });
    let visible = 0;
    projectCards.forEach(card => {
      const match = filter === "all" || card.dataset.category === filter;
      card.hidden = !match;
      if (match) visible++;
    });
    document.getElementById("projectEmpty").hidden = visible !== 0;
  });
});

// Scroll-reveal effects are optional: content stays readable without JavaScript.
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.09, rootMargin: "0px 0px 45px 0px" });
  reveals.forEach(element => revealObserver.observe(element));
}

// Highlight the section currently on screen.
if ("IntersectionObserver" in window) {
  const sections = document.querySelectorAll("main section[id]");
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".nav-link").forEach(link => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("current", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }
    });
  }, { rootMargin: "-25% 0px -58% 0px" });
  sections.forEach(section => navObserver.observe(section));
}

// A small rotating role label; reduced-motion visitors get a static label.
const dynamicRole = document.getElementById("dynamicRole");
const roles = ["Computer Science Student", "AI & NLP Enthusiast", "Aspiring Software Developer"];
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let roleIndex = 0;
  window.setInterval(() => {
    dynamicRole.classList.add("role-fade");
    window.setTimeout(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      dynamicRole.textContent = roles[roleIndex];
      dynamicRole.classList.remove("role-fade");
    }, 220);
  }, 4300);
}

// Copy email with a friendly message, without relying on external services.
let toastTimeout;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
}
document.getElementById("copyEmail").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(email);
    showToast("Email address copied!");
  } catch (_) {
    // Older browsers may not support clipboard access; show the exact email.
    showToast(`Email: ${email}`);
  }
});
document.getElementById("year").textContent = String(new Date().getFullYear());
