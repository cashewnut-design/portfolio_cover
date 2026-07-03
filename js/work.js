/* ============================================
   愛悼 — Work Section
   ============================================ */

const worksData = [
  {
    category: 'UXUI',
    title: 'Lorem ipsum',
    keywords: ['keyword', 'keyword', 'keyword'],
    badgeText: '카테고리 다양 우리 삶을 담아',
    image: 'assets/images/intermission.webp',
    tags: ['Branding', 'Branding', 'Branding'],
    description:
      'dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    category: 'BRAND',
    title: 'Vitae suscipit',
    keywords: ['editorial', 'identity', 'motion'],
    badgeText: '살아가기 위해 존재하는 것들',
    image: 'assets/images/profile.webp',
    tags: ['Visual', 'Package', 'Web'],
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    category: 'WEB',
    title: 'Tellus elementum',
    keywords: ['interface', 'system', 'flow'],
    badgeText: '피었다 지는 그 사이 아직도',
    image: 'assets/images/kv-images.png',
    tags: ['UX', 'UI', 'Prototype'],
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
  {
    category: 'EDITORIAL',
    title: 'Sagittis purus',
    keywords: ['print', 'layout', 'type'],
    badgeText: '존재의 흔적을 남기다',
    image: 'assets/images/intermission.webp',
    tags: ['Editorial', 'Typography', 'Print'],
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    category: 'MOTION',
    title: 'Facilisis gravida',
    keywords: ['animation', 'story', 'rhythm'],
    badgeText: '애도는 기록이 되고',
    image: 'assets/images/profile.webp',
    tags: ['Motion', 'Film', 'Brand'],
    description:
      'Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Praesent sapien massa, convallis a pellentesque.',
  },
];

/** 팝업 라벨 ↔ 상단 필터 탭 카테고리 매핑 */
const POPUP_MENU_ITEMS = [
  { label: 'UXUI', filter: 'UXUI' },
  { label: 'LOGO', filter: 'BRAND' },
  { label: 'POSTER', filter: 'EDITORIAL' },
  { label: 'CHARACTER', filter: 'MOTION' },
];

/** 원형 배지 고정 문구 (카테고리명 아님) */
const BADGE_RING_TEXT = '우리 삶은 살아가기 위한 과정이다';
/** 마스터 프롬프트 예시 radius 60 — h5(29px) 링에 맞게 확장 */
const BADGE_RING_RADIUS = 92;

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
 * 글자 단위 원 둘레 배치 (마스터 프롬프트 방식)
 * rotate(각도) → translate(반지름) → rotate(90deg), left/top 50%
 */
function createBadgeRingMarkup() {
  const text = BADGE_RING_TEXT.replace(/\s/g, '');
  const charCount = text.length;
  const angleStep = 360 / charCount;

  const charNodes = text
    .split('')
    .map((char, i) => {
      const angle = angleStep * i;
      return `<span class="work-badge__char t-h5" style="transform: rotate(${angle}deg) translate(0, -${BADGE_RING_RADIUS}px) rotate(90deg);">${escapeHtml(char)}</span>`;
    })
    .join('');

  return `
    <div class="work-badge__ring" aria-hidden="true">
      <div class="work-badge__circle-container">
        ${charNodes}
      </div>
    </div>
  `;
}

/**
 * sticky 배지 — createElement 방식 (프롬프트 스펙과 동일 로직)
 */
function mountBadgeRing(parentEl) {
  if (!parentEl) return;

  const text = BADGE_RING_TEXT.replace(/\s/g, '');
  const charCount = text.length;
  const angleStep = 360 / charCount;

  const ring = document.createElement('div');
  ring.className = 'work-badge__ring';
  ring.setAttribute('aria-hidden', 'true');

  const circleContainer = document.createElement('div');
  circleContainer.className = 'work-badge__circle-container';

  text.split('').forEach((char, i) => {
    const angle = angleStep * i;
    const el = document.createElement('span');
    el.className = 'work-badge__char t-h5';
    el.textContent = char;
    el.style.transform = `rotate(${angle}deg) translate(0, -${BADGE_RING_RADIUS}px) rotate(90deg)`;
    circleContainer.appendChild(el);
  });

  ring.appendChild(circleContainer);
  parentEl.appendChild(ring);
}

function createWorkItem(work, index) {
  const keywords = work.keywords
    .map((kw) => `<li class="work-info__keyword">${escapeHtml(kw)}</li>`)
    .join('');
  const tags = work.tags
    .map((tag) => `<li class="work-tags__item">${escapeHtml(tag)}</li>`)
    .join('');

  return `
    <article class="work-item" data-work-index="${index}" data-category="${escapeHtml(work.category)}">
      <div class="work-info">
        <h3 class="work-info__title">${escapeHtml(work.title)}</h3>
        <ul class="work-info__keywords">${keywords}</ul>
      </div>
      <div class="work-badge-wrap">
        <div class="work-badge" aria-hidden="true">
          ${createBadgeRingMarkup()}
        </div>
      </div>
      <div class="work-visual">
        <div class="work-visual__image">
          <img
            class="work-visual__img"
            src="${escapeHtml(work.image)}"
            alt="${escapeHtml(work.title)}"
            width="960"
            height="540"
            loading="lazy"
            decoding="async"
          />
        </div>
        <ul class="work-tags">${tags}</ul>
        <p class="work-visual__desc">${escapeHtml(work.description)}</p>
      </div>
    </article>
  `;
}

function renderWorkFilters() {
  if (typeof jQuery === 'undefined') return;

  const $filters = jQuery('#work-filters');
  if (!$filters.length) return;

  const buttons = getWorkCategories()
    .map((category) => {
      const isActive = category === currentWorkFilter ? ' is-active' : '';
      return `<button type="button" class="work-filter t-h5${isActive}" data-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`;
    })
    .join('');

  $filters.html(buttons);
}

function renderWorkItems() {
  const list = document.getElementById('work-list');
  if (!list) return;

  list.innerHTML = worksData.map(createWorkItem).join('');
}

function renderStickyBadge() {
  const container = document.getElementById('work-sticky-badge');
  if (!container) return;

  const popupItems = POPUP_MENU_ITEMS.map(
    (item) =>
      `<li class="work-badge-popup__row">
        <button
          type="button"
          class="work-badge-popup__item t-h5"
          role="menuitem"
          data-filter="${escapeHtml(item.filter)}"
        >${escapeHtml(item.label)}</button>
      </li>`
  ).join('');

  container.innerHTML = `
    <div class="work-sticky-badge__trigger-wrap">
      <button
        type="button"
        class="work-badge work-badge--sticky"
        id="work-badge-trigger"
        aria-expanded="false"
        aria-haspopup="true"
        aria-controls="work-badge-popup"
      ></button>
      <nav class="work-badge-popup" id="work-badge-popup" role="menu" aria-label="Work category menu" aria-hidden="true">
        <ul class="work-badge-popup__list">
          ${popupItems}
        </ul>
      </nav>
    </div>
  `;

  const trigger = document.getElementById('work-badge-trigger');
  if (trigger) mountBadgeRing(trigger);
}

/** 상단 탭 · 원형 배지 팝업 공통 필터 함수 */
function setWorkFilter(category) {
  if (typeof jQuery === 'undefined') return;

  const filter = String(category || 'ALL');
  currentWorkFilter = filter;

  const $filters = jQuery('#work-filters');
  $filters.find('.work-filter').removeClass('is-active');
  $filters.find(`.work-filter[data-filter="${filter}"]`).addClass('is-active');

  jQuery('.work-item').each(function () {
    const $item = jQuery(this);
    const itemCategory = $item.data('category');
    const show = filter === 'ALL' || itemCategory === filter;
    $item.toggle(show);
  });

  syncPopupActiveState();

  if (window.locoScroll) window.locoScroll.update();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function syncPopupActiveState() {
  if (typeof jQuery === 'undefined') return;

  jQuery('.work-badge-popup__item').each(function () {
    const $item = jQuery(this);
    $item.toggleClass('is-active', $item.data('filter') === currentWorkFilter);
  });
}

let workStickyScrollTrigger = null;

function initWorkStickyBadge() {
  const section = document.querySelector('#work');
  const sticky = document.getElementById('work-sticky-badge');
  const scroller = document.querySelector('[data-scroll-container]');

  if (!section || !sticky) return;

  const setVisible = (visible) => {
    sticky.classList.toggle('is-visible', visible);
  };

  if (typeof ScrollTrigger !== 'undefined' && scroller) {
    if (workStickyScrollTrigger) {
      workStickyScrollTrigger.kill();
      workStickyScrollTrigger = null;
    }

    workStickyScrollTrigger = ScrollTrigger.create({
      trigger: section,
      scroller,
      start: 'top 85%',
      end: 'bottom 15%',
      onEnter: () => setVisible(true),
      onEnterBack: () => setVisible(true),
      onLeave: () => setVisible(false),
      onLeaveBack: () => setVisible(false),
    });
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => setVisible(entry.isIntersecting),
    { threshold: 0.05, rootMargin: '-10% 0px -10% 0px' }
  );
  observer.observe(section);
}

function initWorkBadgePopup() {
  if (typeof jQuery === 'undefined') return;

  const $sticky = jQuery('#work-sticky-badge');
  const $trigger = jQuery('#work-badge-trigger');
  const $popup = jQuery('#work-badge-popup');

  if (!$sticky.length || !$trigger.length || !$popup.length) return;

  const openPopup = () => {
    $sticky.addClass('is-open');
    $trigger.attr('aria-expanded', 'true');
    $popup.attr('aria-hidden', 'false');
    syncPopupActiveState();
  };

  const closePopup = () => {
    if (!$sticky.hasClass('is-open')) return;

    $sticky.removeClass('is-open');
    $trigger.attr('aria-expanded', 'false');
    $popup.attr('aria-hidden', 'true');
  };

  $trigger.on('click', (event) => {
    event.stopPropagation();
    if ($sticky.hasClass('is-open')) {
      closePopup();
    } else {
      openPopup();
    }
  });

  $popup.on('click', '.work-badge-popup__item', function (event) {
    event.stopPropagation();
    setWorkFilter(jQuery(this).data('filter'));
    closePopup();
  });

  jQuery(document).on('click.workBadgePopup', (event) => {
    if (!jQuery(event.target).closest('#work-sticky-badge').length) {
      closePopup();
    }
  });

  jQuery(document).on('keydown.workBadgePopup', (event) => {
    if (event.key === 'Escape') closePopup();
  });
}

function initWorkFilters() {
  if (typeof jQuery === 'undefined') return;

  const $filters = jQuery('#work-filters');
  if (!$filters.length) return;

  $filters.on('click', '.work-filter', function () {
    setWorkFilter(jQuery(this).data('filter'));
  });
}

function initWorkBadgeInteraction() {
  if (typeof jQuery === 'undefined') return;

  const $trigger = jQuery('#work-badge-trigger');
  if (!$trigger.length) return;

  $trigger.on('mouseenter focusin', () => {
    $trigger.addClass('is-hovered');
  });

  $trigger.on('mouseleave focusout', () => {
    $trigger.removeClass('is-hovered');
  });
}

function initWorkSection() {
  renderWorkFilters();
  renderWorkItems();
  renderStickyBadge();
  initWorkFilters();
  initWorkBadgePopup();
  initWorkBadgeInteraction();

  if (window.locoScroll) {
    window.locoScroll.update();
  }
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }

  if (!window.locoScroll) {
    initWorkStickyBadge();
  }
}

window.addEventListener('loco:ready', () => {
  initWorkStickyBadge();

  if (window.locoScroll) {
    window.locoScroll.update();
  }
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});
