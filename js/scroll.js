/* ============================================
   愛悼 — Scroll (Locomotive + GSAP)
   defer 로드 — DOM 준비 후 초기화
   ============================================ */

function initScroll() {
  if (
    typeof gsap === 'undefined' ||
    typeof ScrollTrigger === 'undefined' ||
    typeof LocomotiveScroll === 'undefined'
  ) return;

  gsap.registerPlugin(ScrollTrigger);

  const container = document.querySelector('[data-scroll-container]');
  if (!container) return;

  const locoScroll = new LocomotiveScroll({
    el: container,
    smooth: true,
    multiplier: 1,
    lerp: 0.12,
    smartphone: { smooth: true, multiplier: 1 },
    tablet: { smooth: true, multiplier: 1 },
  });

  locoScroll.on('scroll', ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(container, {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, { duration: 0, disableLerp: true })
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: 'transform', /* smooth:true만 사용 — container.style.transform은
      LocomotiveScroll 생성 직후 아직 비어 있어 'fixed'로 잘못 폴백됨 */
  });

  ScrollTrigger.defaults({ scroller: container });

  ScrollTrigger.addEventListener('refresh', () => locoScroll.update());

  window.addEventListener('resize', () => {
    locoScroll.update();
    ScrollTrigger.refresh();
  });

  window.locoScroll = locoScroll;

  const indicatorItems = document.querySelectorAll('.indicator-item');
  const sections = ['kv', 'intermission', 'about', 'profile', 'work', 'contact'];

  sections.forEach((id, index) => {
    ScrollTrigger.create({
      trigger: `#${id}`,
      scroller: container,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => updateIndicator(index),
      onEnterBack: () => updateIndicator(index),
    });
  });

  function updateIndicator(activeIndex) {
    indicatorItems.forEach((item, i) => {
      item.classList.toggle('active', i === activeIndex);
    });
  }

  indicatorItems.forEach((item) => {
    item.addEventListener('click', () => {
      const target = item.dataset.target;
      if (target) locoScroll.scrollTo(target);
    });
  });

  /* bootMain이 먼저 실행된 뒤 scroll 효과 초기화 */
  requestAnimationFrame(() => {
    initProfileAnimations(container);
    window.dispatchEvent(new Event('loco:ready'));
  });
}

function initProfileAnimations(scroller) {
  const profile = document.querySelector('#profile');
  if (!profile || typeof gsap === 'undefined') return;

  const img = profile.querySelector('.profile-anim-img');
  const typos = profile.querySelectorAll('.profile-anim-typo');
  const centerItems = profile.querySelectorAll('.profile-anim-center');
  const rightItems = profile.querySelectorAll('.profile-anim-right');
  const nav = profile.querySelector('.profile-anim-nav');

  if (img) gsap.set(img, { opacity: 0, y: 20 });
  if (typos.length) gsap.set(typos, { opacity: 0, x: -20 });
  if (centerItems.length) gsap.set(centerItems, { opacity: 0, y: 15 });
  if (rightItems.length) gsap.set(rightItems, { opacity: 0, y: 15 });
  if (nav) gsap.set(nav, { opacity: 0 });

  ScrollTrigger.create({
    trigger: profile,
    scroller,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      if (img) {
        gsap.to(img, {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.1,
          ease: 'power2.out',
        });
      }

      if (typos.length) {
        gsap.to(typos, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.3,
          stagger: 0.15,
          ease: 'power2.out',
        });
      }

      if (centerItems.length) {
        gsap.to(centerItems, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.4,
          stagger: 0.1,
          ease: 'power2.out',
        });
      }

      if (rightItems.length) {
        gsap.to(rightItems, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        });
      }

      if (nav) {
        gsap.to(nav, {
          opacity: 1,
          duration: 1,
          delay: 0.9,
          ease: 'power2.out',
        });
      }
    },
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScroll);
} else {
  initScroll();
}
