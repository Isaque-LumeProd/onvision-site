/* =========================================================
   OnVision — Página Institucional: Nossa História
   ========================================================= */
import {
  createIcons,
  ArrowRight, Award, BadgeCheck, Building2, CalendarCheck, Check,
  Clock, Eye, HardHat, HeartHandshake, Layers, Lock, Mail, MapPin,
  Menu, MonitorCheck, Phone, ShieldCheck, Sparkles, Target, Timer,
  Users, Wifi, X, Zap,
} from 'lucide';

const CONFIG = {
  whatsapp: '558005001090',
  phoneDisplay: '0800 500 1090',
  email: 'contato@onvision.com.br',
  address: 'Três Lagoas/MS — atendendo todo o Bolsão e Oeste Paulista',
};

const ICONS = {
  ArrowRight, Award, BadgeCheck, Building2, CalendarCheck, Check,
  Clock, Eye, HardHat, HeartHandshake, Layers, Lock, Mail, MapPin,
  Menu, MonitorCheck, Phone, ShieldCheck, Sparkles, Target, Timer,
  Users, Wifi, X, Zap,
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const renderIcons = (root = document) => createIcons({ icons: ICONS, root });
const waUrl = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

/* ---------- 1. Ícones e links ---------- */
renderIcons();

$$('[data-wa-link]').forEach((a) => {
  a.href = waUrl(a.dataset.waMsg || 'Olá, OnVision! Gostaria de conversar com a equipe sobre os serviços.');
});
$$('[data-tel-link]').forEach((a) => (a.href = `tel:+${CONFIG.whatsapp}`));
$$('[data-mail-link]').forEach((a) => (a.href = `mailto:${CONFIG.email}`));
$$('[data-config]').forEach((el) => {
  const value = CONFIG[el.dataset.config];
  if (value) el.textContent = value;
});
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- 2. Header com glassmorphism ---------- */
const header = $('#site-header');
const SCROLLED = ['bg-abyss/90', 'backdrop-blur-xl', 'border-forest/80', 'shadow-[0_10px_40px_-20px_rgba(5,10,7,.9)]'];
const TOP = ['bg-abyss/40', 'backdrop-blur-md'];
function onScroll() {
  if (!header) return;
  const scrolled = window.scrollY > 12;
  header.classList.toggle('border-transparent', !scrolled);
  SCROLLED.forEach((c) => header.classList.toggle(c, scrolled));
  TOP.forEach((c) => header.classList.toggle(c, !scrolled));
}
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- 3. Menu mobile ---------- */
const menuBtn = $('#menu-toggle');
const mobileMenu = $('#mobile-menu');
let menuOpen = false;
function setMenu(open) {
  if (!menuBtn || !mobileMenu) return;
  menuOpen = open;
  mobileMenu.classList.toggle('opacity-0', !open);
  mobileMenu.classList.toggle('pointer-events-none', !open);
  mobileMenu.classList.toggle('scale-y-95', !open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menuBtn.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}" class="size-5"></i>`;
  renderIcons(menuBtn);
  if (header) {
    if (open) header.classList.add('bg-abyss');
    else header.classList.remove('bg-abyss');
  }
}
if (menuBtn) {
  menuBtn.addEventListener('click', () => setMenu(!menuOpen));
  $$('.mobile-link').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('resize', () => window.innerWidth >= 1024 && menuOpen && setMenu(false));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && menuOpen && setMenu(false));
}

/* ---------- 4. Scroll reveal ---------- */
if (!reduceMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  $$('.reveal').forEach((el) => io.observe(el));
} else {
  $$('.reveal').forEach((el) => el.classList.add('is-visible'));
}

/* ---------- 5. Contadores animados ---------- */
const counters = $$('[data-count]');
if (counters.length && 'IntersectionObserver' in window) {
  const cIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const target = Number(e.target.dataset.count);
          animateCount(e.target, target);
          cIo.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((c) => cIo.observe(c));
}
function animateCount(el, target) {
  if (reduceMotion) {
    el.textContent = String(target);
    return;
  }
  const dur = 1400;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = String(Math.round(target * ease));
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = String(target);
  }
  requestAnimationFrame(step);
}
