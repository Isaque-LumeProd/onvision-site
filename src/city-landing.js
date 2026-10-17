/* =========================================================
   OnVision — Generic City Landing Page Engine
   Handles interactive features for all location landing pages
   (Andradina, Castilho, Araçatuba, Brasilândia, etc.)
   ========================================================= */
import {
  createIcons,
  ArrowRight, Award, BadgeCheck, Building2, CalendarCheck, Car, Cctv, Check, ChevronLeft,
  ChevronRight, CircleCheck, ClipboardList, Clock, Copy, Eye, Factory, Fingerprint, HardHat,
  Headset, House, Layers, LoaderCircle, Lock, Mail, MapPin, Menu, MonitorCheck, Phone, PlugZap,
  Radar, Radio, ScanFace, ScanLine, ScanSearch, ShieldCheck, Siren, Sparkles, Store, Timer, Wifi,
  X, Zap,
} from 'lucide';

const doc = document.documentElement;
const cidade = doc.dataset.cidade || 'Andradina';
const uf = doc.dataset.uf || 'SP';
const cidadeUf = `${cidade}/${uf}`;
const unitCode = doc.dataset.unit || '#AD-0112';

const CONFIG = {
  whatsapp: '558005001090',
  phoneDisplay: '0800 500 1090',
  email: 'contato@onvision.com.br',
  cidade: cidadeUf,
  unitCode,
  address: `Atendendo ${cidadeUf} e toda a região`,
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
  if (!el) return;
  $('#toast-text').textContent = message;
  el.classList.remove('opacity-0', 'translate-y-4');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('opacity-0', 'translate-y-4'), 2800);
}

/* ---------- 1. Ícones + links ---------- */
renderIcons();

$$('[data-wa-link]').forEach((a) => {
  a.href = waUrl(a.dataset.waMsg || `Olá, OnVision! Gostaria de falar com um especialista sobre segurança em ${cidadeUf}.`);
});
$$('[data-tel-link]').forEach((a) => (a.href = `tel:+${CONFIG.whatsapp}`));
$$('[data-mail-link]').forEach((a) => (a.href = `mailto:${CONFIG.email}`));
$$('[data-config]').forEach((el) => {
  const value = CONFIG[el.dataset.config];
  if (value) el.textContent = value;
});
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- 2. Header (glassmorphism ao rolar) ---------- */
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

/* ---------- 4. Scroll reveal suave ---------- */
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

/* ---------- 5. Relógio e osciloscópio da Central ---------- */
const clockEl = $('#panel-clock');
function updateClock() {
  if (!clockEl) return;
  const now = new Date();
  clockEl.textContent = now.toTimeString().split(' ')[0];
}
updateClock();
setInterval(updateClock, 1000);

const vLine = $('#voltage-line');
const vVal = $('#voltage-value');
let vHistory = [220, 221, 220, 219, 220, 222, 220, 220, 221, 220];
function updateVoltage() {
  if (!vLine || !vVal) return;
  const delta = (Math.random() - 0.5) * 2.8;
  const v = Math.round((220 + delta) * 10) / 10;
  vVal.textContent = `${v.toFixed(0)}V`;
  vHistory.push(v);
  vHistory.shift();
  const min = 215;
  const max = 225;
  const pts = vHistory
    .map((val, idx) => {
      const x = (idx / (vHistory.length - 1)) * 120;
      const norm = (val - min) / (max - min);
      const y = 26 - norm * 24;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  vLine.setAttribute('points', pts);
}
updateVoltage();
setInterval(updateVoltage, 1400);

/* ---------- 6. Contador numérico na faixa de autoridade ---------- */
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

/* ---------- 7. Varredura interativa do painel ---------- */
const scanBtn = $('#scan-btn');
const scanLabel = $('#scan-btn-label');
const scanLog = $('#scan-log');
const scanProgress = $('#scan-progress');
const scanPercent = $('#scan-percent');
const scanSweep = $('#scan-sweep');
const camTiles = $$('#cam-grid [data-cam]');

const SCAN_STEPS = [
  { label: `Verificando feeds de vídeo setor ${cidade}...`, type: 'cams', done: '4/4 câmeras operando em alta definição' },
  { label: 'Testando sensores perimetrais e infravermelho...', check: 'perimeter', done: 'Barreiras perimetrais 100% íntegras' },
  { label: 'Checando eletrificador e tensão de cerca...', check: 'fence', done: 'Pulsos estáveis em 8,2 kV' },
  { label: 'Monitorando oscilação da rede elétrica...', check: 'power', done: 'Rede 220V estabilizada com nobreak online' },
  { label: 'Validando rota de fibra óptica e redundância 4G...', check: 'link', done: 'Latência 10 ms • Redundância ativa' },
  { label: 'Auditando apólice do Seguro Contra Furtos...', check: 'policy', done: `Apólice válida e segurada para ${cidadeUf}` },
];

function log(html) {
  if (!scanLog) return;
  const li = document.createElement('li');
  li.innerHTML = html;
  scanLog.appendChild(li);
  scanLog.scrollTop = scanLog.scrollHeight;
}

let scanning = false;
async function runScan() {
  if (scanning || !scanBtn) return;
  scanning = true;
  scanBtn.disabled = true;
  scanBtn.querySelector('svg').outerHTML = '<i data-lucide="loader-circle" class="size-4 animate-spin text-abyss"></i>';
  renderIcons(scanBtn);
  scanLabel.textContent = 'Varredura em andamento...';
  scanLog.innerHTML = '';
  scanSweep.classList.remove('hidden');
  scanSweep.classList.add('animate-sweep');
  $$('[data-check]').forEach((c) => c.classList.remove('is-ok'));
  log(`<span class="text-laser font-semibold">›</span> Iniciando varredura da unidade ${unitCode} (${cidadeUf})`);

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
      if (cell) {
        const status = $('[data-status]', cell);
        const original = status ? status.textContent : '';
        cell.classList.add('is-scanning');
        if (status) status.textContent = 'Verificando...';
        await sleep(650);
        if (status) status.textContent = original;
        cell.classList.remove('is-scanning');
        cell.classList.add('is-ok');
      }
    }

    const pct = Math.round(((i + 1) / SCAN_STEPS.length) * 100);
    if (scanProgress) scanProgress.style.width = `${pct}%`;
    if (scanPercent) scanPercent.textContent = `${pct}%`;
    log(`<span class="text-laser font-bold">✓</span> ${s.done}`);
  }

  log(`<span class="text-laser font-bold">● Varredura concluída: 0 vulnerabilidades • Unidade ${cidade} 100% ativa</span>`);
  if (scanPercent) {
    scanPercent.textContent = '100% • OK';
    scanPercent.classList.add('text-laser', 'font-bold');
  }
  if (scanSweep) {
    scanSweep.classList.add('hidden');
    scanSweep.classList.remove('animate-sweep');
  }
  scanBtn.querySelector('svg').outerHTML = '<i data-lucide="shield-check" class="size-4 text-abyss"></i>';
  renderIcons(scanBtn);
  scanLabel.textContent = 'Sistema 100% Protegido';
  scanBtn.classList.add('!bg-white');

  await sleep(3200);
  scanBtn.classList.remove('!bg-white');
  scanBtn.querySelector('svg').outerHTML = '<i data-lucide="scan-search" class="size-4 text-abyss"></i>';
  renderIcons(scanBtn);
  scanLabel.textContent = 'Testar Varredura Novamente';
  if (scanPercent) scanPercent.classList.remove('text-laser', 'font-bold');
  scanBtn.disabled = false;
  scanning = false;
}
if (scanBtn) scanBtn.addEventListener('click', runScan);

/* ---------- 8. Filtro de soluções ---------- */
const chips = $$('[data-filter]');
const cards = $$('#services-grid [data-category]');
chips.forEach((chip) =>
  chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    chips.forEach((c) => {
      const active = c === chip;
      c.classList.toggle('filter-chip-active', active);
      c.setAttribute('aria-pressed', String(active));
    });
    cards.forEach((card) => {
      const cat = card.dataset.category;
      const show = filter === 'todos' || cat === filter;
      card.classList.toggle('hidden', !show);
    });
  })
);

/* ---------- 9. Simulador interativo em 3 etapas ---------- */
const form = $('#quote-form');
if (form) {
  const steps = $$('.sim-step', form);
  const pills = $$('[data-step-pill]', form);
  const lines = $$('[data-line]', form);
  const btnPrev = $('#btn-prev');
  const btnNext = $('#btn-next');
  const btnSubmit = $('#btn-submit');
  const errorBox = $('#sim-error');

  const fNome = $('#f-nome');
  const fBairro = $('#f-bairro');
  const fTel = $('#f-telefone');
  const fObs = $('#f-obs');

  let currentStep = 1;

  function showError(msg) {
    if (!errorBox) return;
    if (!msg) {
      errorBox.classList.add('hidden');
      errorBox.textContent = '';
      return;
    }
    errorBox.textContent = msg;
    errorBox.classList.remove('hidden');
  }

  function setFieldError(input, show, msg) {
    if (!input) return;
    const parent = input.closest('div');
    const err = parent?.querySelector('.field-error');
    input.classList.toggle('is-invalid', show);
    if (err) {
      if (msg) err.textContent = msg;
      err.classList.toggle('hidden', !show);
    }
  }

  function getImovel() {
    const el = form.querySelector('input[name="imovel"]:checked');
    return el ? el.value : '';
  }

  function getServicos() {
    return $$('input[name="servicos"]:checked', form).map((c) => c.value);
  }

  function phoneDigits() {
    return fTel.value.replace(/\D/g, '');
  }

  function contactValid() {
    const n = fNome.value.trim().length >= 2;
    const b = fBairro.value.trim().length >= 2;
    const p = phoneDigits().length >= 10;
    return n && b && p;
  }

  function validateStep(step) {
    showError('');
    if (step === 1) {
      const ok = !!getImovel();
      if (!ok) showError(`Selecione o tipo de imóvel em ${cidade} para continuar.`);
      return ok;
    }
    if (step === 2) {
      const ok = getServicos().length > 0;
      if (!ok) showError('Selecione pelo menos um serviço para continuar.');
      return ok;
    }
    if (step === 3) {
      let valid = true;
      if (fNome.value.trim().length < 2) {
        setFieldError(fNome, true, 'Informe seu nome.');
        valid = false;
      } else {
        setFieldError(fNome, false);
      }
      if (fBairro.value.trim().length < 2) {
        setFieldError(fBairro, true, `Informe o bairro ou região em ${cidade}.`);
        valid = false;
      } else {
        setFieldError(fBairro, false);
      }
      if (phoneDigits().length < 10) {
        setFieldError(fTel, true, 'Informe um telefone válido com DDD.');
        valid = false;
      } else {
        setFieldError(fTel, false);
      }
      if (!valid) showError('Por favor, complete os campos obrigatórios.');
      return valid;
    }
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
      `*SOLICITAÇÃO DE ORÇAMENTO — ONVISION ${cidade.toUpperCase()}*`,
      `_Enviada pela página exclusiva de ${cidadeUf}_`,
      '',
      `*Tipo de imóvel:* ${imovel}`,
      '',
      '*Serviços desejados:*',
      ...(servicos.length ? servicos.map((s) => `• ${SERVICES[s]}`) : [`• ${dash}`]),
      '',
      `*Nome:* ${fNome.value.trim() || dash}`,
      `*Bairro/Região:* ${fBairro.value.trim() ? `${fBairro.value.trim()} — ${cidadeUf}` : dash}`,
      `*Telefone:* ${fTel.value.trim() || dash}`,
    ];
    if (fObs.value.trim()) lines.push(`*Observações:* ${fObs.value.trim()}`);
    lines.push('', `Gostaria de agendar uma vistoria técnica gratuita em ${cidade}.`);
    return lines.join('\n');
  }

  function updateSummary() {
    const imovel = getImovel();
    const servicos = getServicos();

    const sumImovel = $('#sum-imovel');
    if (sumImovel) {
      sumImovel.textContent = imovel || 'Não selecionado';
      sumImovel.className = imovel ? 'mt-1.5 font-semibold text-white' : 'mt-1.5 font-semibold text-steel italic';
    }

    const sumServicos = $('#sum-servicos');
    if (sumServicos) {
      sumServicos.innerHTML = servicos.length
        ? servicos
            .map((s) =>
              s === 'monitoramento'
                ? `<span class="rounded-lg border border-laser/40 bg-laser/10 px-2.5 py-1 text-xs font-bold text-laser">${SERVICES[s]}</span>`
                : `<span class="rounded-lg border border-forest/80 bg-forest/40 px-2.5 py-1 text-xs font-semibold text-tech">${SERVICES[s]}</span>`
            )
            .join('')
        : '<span class="font-semibold text-steel italic">Nenhum serviço</span>';
    }

    const sumContato = $('#sum-contato');
    if (sumContato) {
      const nome = fNome.value.trim();
      const bairro = fBairro.value.trim();
      const tel = fTel.value.trim();

      if (nome || bairro || tel) {
        sumContato.className = 'mt-1.5 space-y-0.5 font-semibold text-white';
        sumContato.replaceChildren(
          ...[nome, bairro && `${bairro} • ${cidadeUf}`, tel]
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
    }

    const seguro = $('#sum-seguro');
    if (seguro) {
      seguro.classList.toggle('hidden', !servicos.includes('monitoramento'));
      seguro.classList.toggle('flex', servicos.includes('monitoramento'));
    }

    const done = [!!imovel, servicos.length > 0, contactValid()].filter(Boolean).length;
    const summaryCount = $('#summary-count');
    if (summaryCount) summaryCount.textContent = `${done}/3 etapas`;
    const sumPreview = $('#sum-preview');
    if (sumPreview) sumPreview.textContent = buildMessage({ preview: true });
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
    toast(`Abrindo o WhatsApp com sua solicitação de ${cidade}...`);
  });

  const btnCopy = $('#btn-copy');
  if (btnCopy) {
    btnCopy.addEventListener('click', async (e) => {
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
      if (label) {
        label.textContent = 'Resumo copiado!';
        setTimeout(() => (label.textContent = 'Copiar resumo'), 2200);
      }
      toast('Resumo copiado para a área de transferência.');
    });
  }

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
}
