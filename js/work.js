/* ============================================
   愛悼 — Work Section
   ============================================ */

const worksData = [
  {
    category: 'UXUI',
    title: 'Lorem ipsum',
    keywords: ['UX Research', 'Wireframe', 'Prototype'],
    image: 'assets/images/intermission.webp',
    tags: ['UX', 'UI', 'Prototype'],
    description:
      'dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    category: 'BRAND',
    title: 'Vitae suscipit',
    keywords: ['Identity', 'Logotype', 'Guideline'],
    image: 'assets/images/profile.webp',
    tags: ['Branding', 'Visual', 'Package'],
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    category: 'WEB',
    title: 'Tellus elementum',
    keywords: ['Interface', 'System', 'Flow'],
    image: 'assets/images/kv-images.png',
    tags: ['Web', 'UI', 'Interaction'],
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
  {
    category: 'EDITORIAL',
    title: 'Sagittis purus',
    keywords: ['Print', 'Layout', 'Type'],
    image: 'assets/images/intermission.webp',
    tags: ['Editorial', 'Typography', 'Print'],
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
];

/* 원형 뱃지 고정 문구 — 카테고리명과 무관, 항상 이 한 문장 */
const BADGE_RING_TEXT = '우리 삶은 살아가기 위한 과정이다';
const BADGE_RING_RADIUS = 52; // px — 뱃지 크기(140px)에 맞춘 값
const BADGE_RING_START_ANGLE = -90; // 12시 방향에서 시작

let currentWorkFilter = 'ALL';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getWorkCategories() {
  return ['ALL', ...new Set(worksData.map((work) => work.category))];
}

/**
 * 원형 텍스트 배치 — 지정 공식 그대로 (순서·값 변경 금지)
 * 마지막 rotate(90deg)는 반드시 고정값이어야 함.
 * rotate(-angle)처럼 동적 역회전을 넣으면 글자가 원 중심을 향해
 * 방사형(sunburst)으로 튀어나오는 버그가 발생하므로 절대 넣지 않는다.
 */
function mountBadgeRing(container) {
  if (!container) return;
  container.innerHTML = '';

  const text = BADGE_RING_TEXT;
  const chars = text.split('');
  const radius = BADGE_RING_RADIUS;
  const n = chars.length;
  const angleStep = 360 / n;
  const startAngle = BADGE_RING_START_ANGLE;

  chars.forEach((char, i) => {
    const angle = startAngle + (angleStep * i);

    const span = document.createElement('span');
    span.className = 'work-badge__char';
    span.textContent = char === ' ' ? ' ' : char;
    span.style.position = 'absolute';
    span.style.left = '50%';
    span.style.top = '50%';
    span.style.transformOrigin = '0 0';
    span.style.transform = `
      rotate(${angle}deg)
      translate(0, -${radius}px)
      rotate(90deg)
    `;

    container.appendChild(span);
  });
}

function createWorkItem(work, index) {
  const keywords = work.keywords
    .map((kw) => `<li class="t-b3">${escapeHtml(kw)}</li>`)
    .join('');
  const tags = work.tags
    .map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`)
    .join('');

  return `
    <article class="work-row" data-work-index="${index}" data-category="${escapeHtml(work.category)}">
      <div class="work-row__left">
        <h3 class="work-row__title t-h4">${escapeHtml(work.title)}</h3>
        <ul class="work-row__keywords">${keywords}</ul>
      </div>
      <div class="work-row__right">
        <div class="work-row__thumb">
          <img
            src="${escapeHtml(work.image)}"
            alt="${escapeHtml(work.title)}"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div class="pill-tags">${tags}</div>
        <p class="work-row__desc t-b3">${escapeHtml(work.description)}</p>
      </div>
    </article>
  `;
}

function renderWorkItems() {
  const list = document.getElementById('work-list');
  if (!list) return;

  list.innerHTML = worksData.map(createWorkItem).join('');
}

function renderWorkFilters() {
  const filters = document.getElementById('work-filters');
  if (!filters) return;

  const buttons = getWorkCategories()
    .map((category) => {
      const isActive = category === currentWorkFilter ? ' is-active' : '';
      return `<button type="button" class="work-filter t-h5${isActive}" data-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`;
    })
    .join('');

  filters.innerHTML = buttons;
}

function renderStickyBadge() {
  const container = document.getElementById('work-sticky-badge');
  if (!container) return;

  const popupItems = getWorkCategories()
    .map((category) => {
      const isActive = category === currentWorkFilter ? ' is-active' : '';
      return `<li class="work-badge-popup__row">
        <button
          type="button"
          class="work-badge-popup__item t-h5${isActive}"
          role="menuitem"
          data-filter="${escapeHtml(category)}"
        >${escapeHtml(category)}</button>
      </li>`;
    })
    .join('');

  container.innerHTML = `
    <button
      type="button"
      class="circular-badge"
      id="work-badge-trigger"
      aria-expanded="false"
      aria-haspopup="true"
      aria-controls="work-badge-popup"
    >
      <div class="work-badge__ring" id="badgeTextRing" aria-hidden="true"></div>
    </button>
    <nav class="work-badge-popup" id="work-badge-popup" role="menu" aria-label="Work category menu" aria-hidden="true">
      <ul class="work-badge-popup__list">
        ${popupItems}
      </ul>
    </nav>
  `;

  mountBadgeRing(document.getElementById('badgeTextRing'));
}

/** 상단 필터 탭 · 원형 배지 팝업 — 동일 카테고리 데이터 공유 */
function setWorkFilter(category) {
  currentWorkFilter = String(category || 'ALL');

  document.querySelectorAll('.work-filter').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.filter === currentWorkFilter);
  });

  document.querySelectorAll('.work-row').forEach((item) => {
    const show = currentWorkFilter === 'ALL' || item.dataset.category === currentWorkFilter;
    item.style.display = show ? '' : 'none';
  });

  syncPopupActiveState();

  if (window.locoScroll) window.locoScroll.update();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function syncPopupActiveState() {
  document.querySelectorAll('.work-badge-popup__item').forEach((item) => {
    item.classList.toggle('is-active', item.dataset.filter === currentWorkFilter);
  });
}

function initWorkFilters() {
  const filters = document.getElementById('work-filters');
  if (!filters) return;

  filters.addEventListener('click', (event) => {
    const btn = event.target.closest('.work-filter');
    if (!btn) return;
    setWorkFilter(btn.dataset.filter);
  });
}

function initWorkBadgePopup() {
  const wrap = document.getElementById('work-sticky-badge');
  const trigger = document.getElementById('work-badge-trigger');
  const popup = document.getElementById('work-badge-popup');

  if (!wrap || !trigger || !popup) return;

  const openPopup = () => {
    wrap.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    popup.setAttribute('aria-hidden', 'false');
    syncPopupActiveState();
  };

  const closePopup = () => {
    if (!wrap.classList.contains('is-open')) return;
    wrap.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    popup.setAttribute('aria-hidden', 'true');
  };

  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    if (wrap.classList.contains('is-open')) {
      closePopup();
    } else {
      openPopup();
    }
  });

  popup.addEventListener('click', (event) => {
    const item = event.target.closest('.work-badge-popup__item');
    if (!item) return;
    event.stopPropagation();
    setWorkFilter(item.dataset.filter);
    closePopup();
  });

  document.addEventListener('click', (event) => {
    if (!wrap.contains(event.target)) closePopup();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closePopup();
  });
}

function initWorkBadgeHover() {
  const trigger = document.getElementById('work-badge-trigger');
  if (!trigger) return;

  trigger.addEventListener('mouseenter', () => trigger.classList.add('is-hovered'));
  trigger.addEventListener('mouseleave', () => trigger.classList.remove('is-hovered'));
}

let badgeRotationTween = null;

/** 스크롤에 따라 뱃지 링을 천천히 회전 (글자 배치 공식 자체는 건드리지 않음) */
function initBadgeRotation() {
  const ring = document.getElementById('badgeTextRing');
  const section = document.querySelector('#work');
  const scroller = document.querySelector('[data-scroll-container]');

  if (!ring || !section) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  if (badgeRotationTween) {
    if (badgeRotationTween.scrollTrigger) badgeRotationTween.scrollTrigger.kill();
    badgeRotationTween.kill();
    badgeRotationTween = null;
  }

  gsap.set(ring, { rotation: 0, transformOrigin: '50% 50%' });

  badgeRotationTween = gsap.to(ring, {
    rotation: 360,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      scroller: scroller || undefined,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.6,
    },
  });
}

let workBadgePinTrigger = null;

/**
 * 배지를 리스트 구간 동안 화면에 고정 — GSAP ScrollTrigger의 pin 기능 사용.
 * Locomotive Scroll(smooth/transform 모드)과 함께 쓸 때 scroll.js의
 * scrollerProxy + pinType:'transform' 설정을 그대로 활용한다.
 * start 기준은 wrapper 전체가 아니라 첫 번째 .work-row — wrapper 상단과
 * 첫 항목 사이 여백만큼 고정 시점이 일찍 시작되는 것을 방지한다.
 * end 기준은 리스트 전체(.work-body)를 유지해, 마지막 항목까지 고정된다.
 */
function initWorkBadgePin() {
  const wrapper = document.querySelector('.work-body');
  const firstRow = document.querySelector('.work-row');
  const badge = document.getElementById('work-sticky-badge');
  const scroller = document.querySelector('[data-scroll-container]');

  if (!wrapper || !firstRow || !badge) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  if (workBadgePinTrigger) {
    workBadgePinTrigger.kill();
    workBadgePinTrigger = null;
  }

  workBadgePinTrigger = ScrollTrigger.create({
    trigger: firstRow,
    scroller: scroller || undefined,
    start: 'top center',
    endTrigger: wrapper,
    end: 'bottom center',
    pin: badge,
    pinSpacing: false,
  });
}

function initWorkSection() {
  renderWorkFilters();
  renderWorkItems();
  renderStickyBadge();
  initWorkFilters();
  initWorkBadgePopup();
  initWorkBadgeHover();
  initBadgeRotation();
  initWorkBadgePin();

  if (window.locoScroll) window.locoScroll.update();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

window.addEventListener('loco:ready', () => {
  initBadgeRotation();
  initWorkBadgePin();

  if (window.locoScroll) window.locoScroll.update();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});
