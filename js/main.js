/* ============================================
   愛悼 — Main JS
   ============================================ */

function getScrollContainer() {
  return document.querySelector('[data-scroll-container]');
}

function hasGsap() {
  return typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
}

function showKvFallback() {
  document.querySelectorAll(
    '.anim-kv-portfolio, .anim-kv-flower, .anim-kv-kanji, .anim-kv-header, .anim-kv-bottom-left, .anim-kv-bottom-right'
  ).forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = '';
  });
}

function setupSectionAnimations() {
  const scroller = getScrollContainer();
  if (!scroller) return;

  document.querySelectorAll('.anim-up').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      scroller,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out',
        });
      },
    });
  });

  document.querySelectorAll('.anim-fade').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      scroller,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        });
      },
    });
  });

  const lines = document.querySelectorAll('.anim-line');
  if (lines.length) {
    gsap.to(lines, {
      y: 0,
      opacity: 1,
      duration: 1.1,
      ease: 'power3.out',
      stagger: 0.1,
      delay: 0.2,
    });
  }
}

function initKvLoadAnimation() {
  if (!document.querySelector('#kv') || !hasGsap()) return;

  gsap.killTweensOf(
    '.kv-portfolio, .anim-kv-header, .anim-kv-bottom-left, .anim-kv-bottom-right, .anim-kv-flower, .anim-kv-kanji'
  );

  const tl = gsap.timeline({
    onComplete: () => {
      if (window.locoScroll) initKvScrollEffects();
      ScrollTrigger.refresh();
    },
  });

  tl.fromTo('.kv-portfolio', { opacity: 0 }, {
    opacity: 1,
    duration: 0.9,
    ease: 'power3.out',
  }, 0.1)
    .to('.anim-kv-header', {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    }, 0)
    .to('.anim-kv-bottom-left', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    }, 0.1)
    .to('.anim-kv-bottom-right', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    }, 0.15)
    .to('.anim-kv-flower', {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
    }, 0.25)
    .to('.anim-kv-kanji', {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    }, 0.45);
}

function initKvScrollEffects() {
  if (!document.querySelector('#kv') || !hasGsap()) return;

  const scroller = getScrollContainer();
  if (!scroller || !window.locoScroll) return;

  ScrollTrigger.getAll()
    .filter((st) => st.vars && st.vars.id && String(st.vars.id).startsWith('kv-scroll-'))
    .forEach((st) => st.kill());

  gsap.set('.kv-artboard', { xPercent: -50, yPercent: -50 });

  gsap.to('.kv-artboard', {
    y: -20,
    xPercent: -50,
    yPercent: -50,
    ease: 'none',
    scrollTrigger: {
      id: 'kv-scroll-artboard',
      trigger: '#kv',
      scroller,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  gsap.fromTo(['.anim-kv-bottom-left', '.anim-kv-bottom-right'], {
    opacity: 1,
    y: 0,
  }, {
    opacity: 0,
    y: 8,
    ease: 'none',
    scrollTrigger: {
      id: 'kv-scroll-bottom',
      trigger: '#kv',
      scroller,
      start: 'top top',
      end: '25% top',
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });
}

function initRevealAnimations() {
  const scroller = getScrollContainer();
  if (!scroller || !hasGsap()) return;

  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reveals.length) return;

  gsap.set(reveals, { opacity: 0, y: 24 });

  reveals.forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        scroller,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

function initSiteGnb() {
  const gnb = document.querySelector('.site-gnb');
  const kv = document.querySelector('#kv');
  const scroller = getScrollContainer();

  if (!gnb || !kv || !scroller || !hasGsap()) return;

  /* KV를 지나면(인터미션·About부터) KV와 동일한 위치에 고정 GNB 표시 */
  ScrollTrigger.create({
    trigger: kv,
    scroller,
    start: 'bottom top',
    onEnter: () => {
      gnb.classList.add('is-visible');
      gnb.setAttribute('aria-hidden', 'false');
    },
    onLeaveBack: () => {
      gnb.classList.remove('is-visible');
      gnb.setAttribute('aria-hidden', 'true');
    },
  });
}

function initKvHeader() {
  const header = document.querySelector('.kv-header');
  if (!header || typeof window.locoScroll === 'undefined') return;

  let lastScrollY = 0;

  window.locoScroll.on('scroll', ({ scroll }) => {
    const currentY = scroll.y;

    if (currentY > lastScrollY && currentY > 100) {
      gsap.to(header, { y: '-100%', opacity: 0, duration: 0.3, ease: 'power2.out' });
    } else {
      gsap.to(header, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
    }

    lastScrollY = currentY;
  });
}

function initSiteNav() {
  document.querySelectorAll('.nav-link[data-scroll]').forEach((link) => {
    link.addEventListener('click', () => {
      const target = link.dataset.scroll;
      if (target && window.locoScroll) {
        window.locoScroll.scrollTo(target, {
          duration: 600,
          disableLerp: false,
        });
      }
    });
  });
}

function bootMain() {
  if (!hasGsap()) {
    document.documentElement.classList.add('no-js-anim');
    showKvFallback();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  initKvLoadAnimation();
  initSiteNav();
}

window.addEventListener('loco:ready', () => {
  if (!hasGsap()) return;

  setupSectionAnimations();
  initRevealAnimations();
  initKvHeader();
  initSiteGnb();
});

window.addEventListener('load', () => {
  if (!hasGsap()) {
    showKvFallback();
    return;
  }

  const kvFlower = document.querySelector('.anim-kv-flower');
  if (kvFlower && getComputedStyle(kvFlower).opacity === '0') {
    initKvLoadAnimation();
  }

  if (window.locoScroll) window.locoScroll.update();
  ScrollTrigger.refresh();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootMain);
} else {
  bootMain();
}
