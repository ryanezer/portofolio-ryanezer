document.documentElement.classList.add("js"); /* animasi hanya aktif jika script.js termuat */
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/* ===== BINTANG ===== */
const starsContainer = document.getElementById("stars");

for (let i = 0; i < 70; i++) {
  const star = document.createElement("span");
  star.className = "star";
  const size = Math.floor(Math.random() * 3) + 2;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.animationDelay = `${Math.random() * 4}s`;
  star.style.animationDuration = `${2 + Math.random() * 4}s`;
  starsContainer.appendChild(star);
}

/* ===== NAVBAR ===== */
const navbar = document.getElementById("navbar");
const onNavScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 24);
onNavScroll();
window.addEventListener("scroll", onNavScroll, { passive: true });

/* ===== REVEAL SAAT SCROLL ===== */
document.querySelectorAll(".reveal, .mask .line").forEach((el) => {
  const delay = el.style.getPropertyValue("--d");
  if (delay) el.style.transitionDelay = delay;
});

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal, .mask").forEach((el) => io.observe(el));

/* ===== GALAKSI: TILT 3D + PARALLAX ===== */
const hero = document.getElementById("beranda");
const tilt = document.getElementById("galaxy-tilt");
const parallax = document.getElementById("galaxy-parallax");

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

hero.addEventListener("mousemove", (e) => {
  const r = hero.getBoundingClientRect();
  targetX = (e.clientX - r.left) / r.width - 0.5;
  targetY = (e.clientY - r.top) / r.height - 0.5;
});

hero.addEventListener("mouseleave", () => {
  targetX = 0;
  targetY = 0;
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animate() {
  if (!reduceMotion) {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    const rotateY = currentX * 9;
    const rotateX = -currentY * 7;
    tilt.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    const offset = Math.min(window.scrollY * 0.1, 90);
    parallax.style.transform = `translateY(${-offset}px)`;
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

/* ===== MODAL GALERI / VIDEO ===== */
const overlays = document.querySelectorAll(".gallery-overlay");

function openModal(overlay) {
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.documentElement.style.overflow = "hidden";
  const video = overlay.querySelector("video");
  if (video) {
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  }
}

function closeModal(overlay) {
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.documentElement.style.overflow = "";
  const video = overlay.querySelector("video");
  if (video) video.pause();
}

document.querySelectorAll("[data-modal]").forEach((trigger) => {
  const open = () => openModal(document.getElementById(trigger.dataset.modal));
  trigger.addEventListener("click", open);
  trigger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  });
});

overlays.forEach((overlay) => {
  overlay.querySelector(".gallery-close").addEventListener("click", () => closeModal(overlay));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal(overlay);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    overlays.forEach((o) => {
      if (o.classList.contains("open")) closeModal(o);
    });
  }
});