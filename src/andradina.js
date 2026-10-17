/* =========================================================
   OnVision — Landing Page Andradina/SP
   ========================================================= */
import {
  createIcons,
  ArrowRight, Award, BadgeCheck, Building2, CalendarCheck, Car, Cctv, Check, ChevronLeft,
  ChevronRight, CircleCheck, ClipboardList, Clock, Copy, Eye, Factory, Fingerprint, HardHat,
  Headset, House, Layers, LoaderCircle, Lock, Mail, MapPin, Menu, MonitorCheck, Phone, PlugZap,
  Radar, Radio, ScanFace, ScanLine, ScanSearch, ShieldCheck, Siren, Sparkles, Store, Timer, Wifi,
  X, Zap,
} from 'lucide';

const CONFIG = {
  whatsapp: '558005001090',
  phoneDisplay: '0800 500 1090',
  email: 'contato@onvision.com.br',
  cidade: 'Andradina/SP',
  address: 'Atendendo Andradina/SP e toda a região',
};

const ICONS = {
  ArrowRight, Award, BadgeCheck, Building2, CalendarCheck, Car, Cctv, Check, ChevronLeft,
  ChevronRight, CircleCheck, ClipboardList, Clock, Copy, Eye, Factory, Fingerprint, HardHat,
  Headset, House, Layers, LoaderCircle, Lock, Mail, MapPin, Menu, MonitorCheck, Phone, PlugZap,
  Radar, Radio, ScanFace, ScanLine, ScanSearch, ShieldCheck, Siren, Sparkles, Store, Timer, Wifi,
  X, Zap,
};

const SERVICES = {
  monitoramento: 'Monitoramento 24h + Seguro Contra Furtos',
  cftv: 'Câmeras e Alarmes (CFTV)',
  acesso: 'Controle de Acesso / Portaria',
  rondas: 'Rondas Patrimoniais',
  eletrica: 'Manutenção / Projeto Elétrico',
};

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const renderIcons = (root = document) => createIcons({ icons: ICONS, root });
const waUrl = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

let toastTimer;
function toast(message) {
  const el = $('#toast');
  $('#toast-text').textContent = message;
  el.classList.remove('opacity-0', 'translate-y-4');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('opacity-0', 'translate-y-4'), 2800);
}

/* ---------- 1. Ícones + links ---------- */
renderIcons();

$$('[data-wa-link]').forEach((a) => {
  a.href = waUrl(a.dataset.waMsg || 'Olá, OnVision! Gostaria de atendimento em Andradina/SP.');
});
$$('[data-tel-link]').forEach((a) => (a.href = `tel:+${CONFIG.whatsapp}`));
$$('[data-mail-link]').forEach((a) => (a.href = `mailto:${CONFIG.email}`));
$$('[data-config]').forEach((el) => {
  const value = CONFIG[el.dataset.config];
  if (value) el.textContent = value;
});
$('#year').textContent = new Date().getFullYear();

/* ---------- 2. Header (glassmorphism ao rolar) ---------- */
const header = $('#site-header');
const SCROLLED = ['bg-abyss/90', 'backdrop-blur-xl', 'border-forest/80', 'shadow-[0_10px_40px_-20px_rgba(5,10,7,.9)]'];
const TOP = ['bg-abyss/40', 'backdrop-blur-md'];
function onScroll() {
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
  menuOpen = open;
  mobileMenu.classList.toggle('opacity-0', !open);
  mobileMenu.classList.toggle('pointer-events-none', !open);
  mobileMenu.classList.toggle('scale-y-95', !open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menuBtn.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}" class="size-5"></i>`;
  renderIcons(menuBtn);
  if (open) header.classList.add('bg-abyss');
  else header.classList.remove('bg-abyss');
}
menuBtn.addEventListener('click', () => setMenu(!menuOpen));
$$('.mobile-link').forEach((a) => a.addEventListener('click', () => setMenu(false)));
window.addEventListener('resize', () => window.innerWidth >= 1024 && menuOpen && setMenu(false));
document.addEventListener('keydown', (e) => e.key === 'Escape' && menuOpen && setMenu(false));

/* ---------- 4. Link ativo na navegação ---------- */
const navLinks = $$('.nav-link');
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${entry.target.id}`));
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);
['inicio', 'solucoes', 'seguro', 'sobre', 'simulador'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

/* ---------- 5. Scroll reveal ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible');
      revealObserver.unobserve(el);
      const delay = parseInt(getComputedStyle(el).getPropertyValue('--d')) || 0;
      setTimeout(() => el.classList.remove('reveal', 'is-visible'), 1000 + delay);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
$$('.reveal').forEach((el) => revealObserver.observe(el));

/* ---------- 6. Contadores ---------- */
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      counterObserver.unobserve(el);
      const target = Number(el.dataset.count);
      if (reduceMotion) return (el.textContent = target);
      const start = performance.now();
      const duration = 1600;
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  },
  { threshold: 0.6 }
);
$$('[data-count]').forEach((el) => counterObserver.observe(el));

/* ---------- 7. Painel de telemetria ---------- */
const clockEl = $('#panel-clock');
const updateClock = () => (clockEl.textContent = new Date().toLocaleTimeString('pt-BR'));
updateClock();
setInterval(updateClock, 1000);

const voltageLine = $('#voltage-line');
const voltageValue = $('#voltage-value');
const voltages = Array.from({ length: 30 }, () => 219 + Math.random() * 3);
function drawVoltage() {
  const step = 120 / (voltages.length - 1);
  voltageLine.setAttribute(
    'points',
    voltages.map((v, i) => `${(i * step).toFixed(1)},${(26 - (v - 216) * 3.6).toFixed(1)}`).join(' ')
  );
  voltageValue.textContent = `${voltages.at(-1).toFixed(1).replace('.', ',')}V`;
}
drawVoltage();
setInterval(() => {
  voltages.shift();
  voltages.push(219 + Math.random() * 3);
  drawVoltage();
}, 1200);

const scanBtn = $('#scan-btn');
const scanLabel = $('#scan-btn-label');
const scanLog = $('#scan-log');
const scanProgress = $('#scan-progress');
const scanPercent = $('#scan-percent');
const scanSweep = $('#scan-sweep');
const camTiles = $$('[data-cam]');

const SCAN_STEPS = [
  { type: 'cams', label: 'Verificando câmeras IP em Andradina...', done: '4/4 câmeras online • gravação OK' },
  { check: 'perimeter', label: 'Testando sensores perimetrais...', done: '12/12 sensores respondendo' },
  { check: 'fence', label: 'Medindo cerca elétrica...', done: 'Cerca armada • 8,2 kV' },
  { check: 'power', label: 'Analisando rede elétrica...', done: 'Rede 220V estável • sem oscilações' },
  { check: 'link', label: 'Testando rota tática Andradina...', done: 'Link rádio/fibra OK • 10 ms' },
  { check: 'policy', label: 'Validando apólice de seguro...', done: 'Apólice vigente • cobertura ativa' },
];

function log(html) {
  const li = document.createElement('li');
  li.innerHTML = html;
  scanLog.appendChild(li);
  scanLog.scrollTop = scanLog.scrollHeight;
}

let scanning = false;
async function runScan() {
  if (scanning) return;
  scanning = true;
  scanBtn.disabled = true;
  scanBtn.querySelector('svg').outerHTML = '<i data-lucide="loader-circle" class="size-4 animate-spin text-abyss"></i>';
  renderIcons(scanBtn);
  scanLabel.textContent = 'Varredura em andamento...';
  scanLog.innerHTML = '';
  scanSweep.classList.remove('hidden');
  scanSweep.classList.add('animate-sweep');
  $$('[data-check]').forEach((c) => c.classList.remove('is-ok'));
  log('<span class="text-laser font-semibold">›</span> Iniciando varredura da unidade #AD-0112 (Andradina/SP)');

  for (let i = 0; i < SCAN_STEPS.length; i++) {
    const s = SCAN_STEPS[i];
    log(`<span class="text-laser font-semibold">›</span> ${s.label}`);

    if (s.type === 'cams') {
      for (const tile of camTiles) {
        tile.classList.add('is-scanning');
        await sleep(230);
        tile.classList.remove('is-scanning');
      }
    } else {
      const cell = $(`[data-check="${s.check}"]`);
      const status = $('[data-status]', cell);
      const original = status.textContent;
      cell.classList.add('is-scanning');
      status.textContent = 'Verificando...';
      await sleep(650);
      status.textContent = original;
      cell.classList.remove('is-scanning');
      cell.classList.add('is-ok');
    }

    const pct = Math.round(((i + 1) / SCAN_STEPS.length) * 100);
    scanProgress.style.width = `${pct}%`;
    scanPercent.textContent = `${pct}%`;
    log(`<span class="text-laser font-bold">✓</span> ${s.done}`);
  }

  log('<span class="text-laser font-bold">● Varredura concluída: 0 vulnerabilidades • Unidade Andradina 100% ativa</span>');
  scanPercent.textContent = '100% • OK';
  scanPercent.classList.add('text-laser', 'font-bold');
  scanSweep.classList.add('hidden');
  scanSweep.classList.remove('animate-sweep');
  scanBtn.querySelector('svg').outerHTML = '<i data-lucide="shield-check" class="size-4 text-abyss"></i>';
  renderIcons(scanBtn);
  scanLabel.textContent = 'Sistema 100% Protegido';
  scanBtn.classList.add('!bg-white');

  await sleep(3200);
  scanBtn.classList.remove('!bg-white');
  scanBtn.querySelector('svg').outerHTML = '<i data-lucide="scan-search" class="size-4 text-abyss"></i>';
  renderIcons(scanBtn);
  scanLabel.textContent = 'Testar Varredura Novamente';
  scanPercent.classList.remove('text-laser', 'font-bold');
  scanBtn.disabled = false;
  scanning = false;
}
scanBtn.addEventListener('click', runScan);

/* ---------- 8. Filtro de soluções ---------- */
const chips = $$('[data-filter]');
const cards = $$('#services-grid [data-category]');
chips.forEach((chip) =>
  chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    chips.forEach((c) => {
      const active = c === chip;
      c.classList.toggle('is-active', active);
      c.setAttribute('aria-selected', String(active));
    });
    cards.forEach((card) => {
      card.classList.remove('reveal', 'is-visible');
      const show = filter === 'todos' || card.dataset.category === filter;
      if (show) {
        card.classList.remove('hidden');
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove('is-hidden')));
      } else {
        card.classList.add('is-hidden');
        setTimeout(() => card.classList.contains('is-hidden') && card.classList.add('hidden'), 320);
      }
    });
  })
);

/* ---------- 9. Simulador de orçamento (Andradina/SP) ---------- */
const form = $('#quote-form');
const steps = $$('.sim-step', form);
const pills = $$('[data-step-pill]', form);
const lines = $$('[data-line]', form);
const btnPrev = $('#btn-prev');
const btnNext = $('#btn-next');
const btnSubmit = $('#btn-submit');
const stepError = $('#step-error');
const fNome = $('#f-nome');
const fBairro = $('#f-bairro');
const fTel = $('#f-telefone');
const fObs = $('#f-obs');
let currentStep = 1;

const getImovel = () => form.querySelector('input[name="imovel"]:checked')?.value || '';
const getServicos = () => $$('input[name="servicos"]:checked', form).map((i) => i.value);
const phoneDigits = () => fTel.value.replace(/\D/g, '');
const contactValid = () => fNome.value.trim().length >= 2 && fBairro.value.trim().length >= 2 && phoneDigits().length >= 10;

function showError(msg) {
  if (!msg) {
    stepError.classList.add('hidden');
    stepError.classList.remove('flex');
    return;
  }
  stepError.textContent = msg;
  stepError.classList.remove('hidden');
  stepError.classList.add('flex');
  stepError.animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
    { duration: 300 }
  );
}

function setFieldError(input, invalid) {
  input.classList.toggle('is-invalid', invalid);
  input.setAttribute('aria-invalid', String(invalid));
  input.parentElement.querySelector('.field-error')?.classList.toggle('hidden', !invalid);
}

function validateStep(step) {
  if (step === 1 && !getImovel()) return showError('Selecione o tipo de imóvel para continuar.'), false;
  if (step === 2 && !getServicos().length) return showError('Selecione ao menos um serviço.'), false;
  if (step === 3) {
    const nomeBad = fNome.value.trim().length < 2;
    const bairroBad = fBairro.value.trim().length < 2;
    const telBad = phoneDigits().length < 10;
    setFieldError(fNome, nomeBad);
    setFieldError(fBairro, bairroBad);
    setFieldError(fTel, telBad);
    if (nomeBad || bairroBad || telBad) {
      showError('Confira os campos destacados.');
      (nomeBad ? fNome : bairroBad ? fBairro : fTel).focus();
      return false;
    }
  }
  showError('');
  return true;
}

function goToStep(n) {
  currentStep = n;
  steps.forEach((s) => {
    const active = Number(s.dataset.step) === n;
    s.classList.toggle('hidden', !active);
    if (active && !reduceMotion) {
      s.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
  });
  pills.forEach((p) => {
    const i = Number(p.dataset.stepPill);
    p.classList.toggle('is-current', i === n);
    p.classList.toggle('is-done', i < n);
    p.querySelector('.step-num').innerHTML = i < n ? '<i data-lucide="check" class="size-3.5"></i>' : String(i);
  });
  renderIcons(form.querySelector('.flex'));
  lines.forEach((l) => (l.style.width = Number(l.dataset.line) < n ? '100%' : '0'));
  btnPrev.classList.toggle('invisible', n === 1);
  btnNext.classList.toggle('hidden', n === 3);
  btnSubmit.classList.toggle('hidden', n !== 3);
  showError('');
}

function buildMessage({ preview = false } = {}) {
  const dash = preview ? '—' : '';
  const imovel = getImovel() || dash;
  const servicos = getServicos();
  const lines = [
    '*SOLICITAÇÃO DE ORÇAMENTO — ONVISION ANDRADINA*',
    '_Enviada pela página exclusiva de Andradina/SP_',
    '',
    `*Tipo de imóvel:* ${imovel}`,
    '',
    '*Serviços desejados:*',
    ...(servicos.length ? servicos.map((s) => `• ${SERVICES[s]}`) : [`• ${dash}`]),
    '',
    `*Nome:* ${fNome.value.trim() || dash}`,
    `*Bairro/Região:* ${fBairro.value.trim() ? `${fBairro.value.trim()} — Andradina/SP` : dash}`,
    `*Telefone:* ${fTel.value.trim() || dash}`,
  ];
  if (fObs.value.trim()) lines.push(`*Observações:* ${fObs.value.trim()}`);
  lines.push('', 'Gostaria de agendar uma vistoria técnica gratuita em Andradina.');
  return lines.join('\n');
}

function updateSummary() {
  const imovel = getImovel();
  const servicos = getServicos();

  const sumImovel = $('#sum-imovel');
  sumImovel.textContent = imovel || 'Não selecionado';
  sumImovel.className = imovel ? 'mt-1.5 font-semibold text-white' : 'mt-1.5 font-semibold text-steel italic';

  const sumServicos = $('#sum-servicos');
  sumServicos.innerHTML = servicos.length
    ? servicos
        .map((s) =>
          s === 'monitoramento'
            ? `<span class="rounded-lg border border-laser/40 bg-laser/10 px-2.5 py-1 text-xs font-bold text-laser">${SERVICES[s]}</span>`
            : `<span class="rounded-lg border border-forest/80 bg-forest/40 px-2.5 py-1 text-xs font-semibold text-tech">${SERVICES[s]}</span>`
        )
        .join('')
    : '<span class="font-semibold text-steel italic">Nenhum serviço</span>';

  const sumContato = $('#sum-contato');
  const nome = fNome.value.trim();
  const bairro = fBairro.value.trim();
  const tel = fTel.value.trim();

  if (nome || bairro || tel) {
    sumContato.className = 'mt-1.5 space-y-0.5 font-semibold text-white';
    sumContato.replaceChildren(
      ...[nome, bairro && `${bairro} • Andradina/SP`, tel]
        .filter(Boolean)
        .map((t) => {
          const s = document.createElement('span');
          s.className = 'block';
          s.textContent = t;
          return s;
        })
    );
  } else {
    sumContato.className = 'mt-1.5 font-semibold text-steel italic';
    sumContato.textContent = 'Aguardando dados';
  }

  const seguro = $('#sum-seguro');
  seguro.classList.toggle('hidden', !servicos.includes('monitoramento'));
  seguro.classList.toggle('flex', servicos.includes('monitoramento'));

  const done = [!!imovel, servicos.length > 0, contactValid()].filter(Boolean).length;
  $('#summary-count').textContent = `${done}/3 etapas`;
  $('#sum-preview').textContent = buildMessage({ preview: true });
}

fTel.addEventListener('input', () => {
  const d = phoneDigits().slice(0, 11);
  let out = d;
  if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length > 6) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
  fTel.value = out;
});

[fNome, fBairro, fTel].forEach((input) =>
  input.addEventListener('input', () => input.classList.contains('is-invalid') && setFieldError(input, false))
);

form.addEventListener('input', updateSummary);
form.addEventListener('change', () => {
  updateSummary();
  showError('');
});

$$('input[name="imovel"]', form).forEach((r) =>
  r.addEventListener('change', () => currentStep === 1 && setTimeout(() => goToStep(2), 280))
);

btnNext.addEventListener('click', () => validateStep(currentStep) && goToStep(currentStep + 1));
btnPrev.addEventListener('click', () => goToStep(Math.max(1, currentStep - 1)));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (currentStep < 3) {
    if (validateStep(currentStep)) goToStep(currentStep + 1);
    return;
  }
  if (!validateStep(1)) return goToStep(1);
  if (!validateStep(2)) return goToStep(2);
  if (!validateStep(3)) return;
  window.open(waUrl(buildMessage()), '_blank', 'noopener');
  toast('Abrindo o WhatsApp com sua solicitação de Andradina...');
});

$('#btn-copy').addEventListener('click', async (e) => {
  const text = buildMessage({ preview: true });
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  const label = e.currentTarget.querySelector('span');
  label.textContent = 'Resumo copiado!';
  toast('Resumo copiado para a área de transferência.');
  setTimeout(() => (label.textContent = 'Copiar resumo'), 2200);
});

$$('[data-quote]').forEach((btn) =>
  btn.addEventListener('click', () => {
    const key = btn.dataset.quote;
    const input = form.querySelector(`input[name="servicos"][value="${key}"]`);
    if (input) input.checked = true;
    updateSummary();
    if (getImovel() && currentStep === 1) goToStep(2);
    document.getElementById('simulador').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    toast(`"${SERVICES[key]}" adicionado ao simulador`);
  })
);

updateSummary();
