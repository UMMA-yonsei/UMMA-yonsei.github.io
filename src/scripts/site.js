const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const mediaCards = Array.from(document.querySelectorAll('.media-card'));
const navLinks = Array.from(document.querySelectorAll('.primary-nav a'));
const introOpenButton = document.querySelector('[data-intro-open]');
const introDialog = document.querySelector('[data-intro-dialog]');
const introCloseButton = document.querySelector('[data-intro-close]');
const introPlayer = document.querySelector('[data-intro-player]');
const heroVideo = document.querySelector('[data-hero-video]');
const heroLocalVideo = document.querySelector('[data-hero-local-video]');
const heroLocalSource = heroLocalVideo?.querySelector('source[data-src]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let heroLocalState = heroLocalSource ? 'pending' : 'missing';

function showYouTubeBackground() {
  if (!heroVideo) return;
  heroVideo.src = heroVideo.dataset.src || 'about:blank';
}

// Prefer the self-hosted clip; fall back to the YouTube embed when the file is absent.
function loadHeroLocalVideo() {
  heroLocalState = 'loading';
  heroLocalSource.addEventListener('error', () => {
    heroLocalState = 'missing';
    heroLocalVideo.classList.remove('is-ready');
    if (!reducedMotion.matches) showYouTubeBackground();
  }, { once: true });
  heroLocalVideo.addEventListener('loadeddata', () => {
    heroLocalState = 'ready';
    heroLocalVideo.classList.add('is-ready');
    if (heroVideo) heroVideo.src = 'about:blank';
    if (!reducedMotion.matches) heroLocalVideo.play().catch(() => {});
  }, { once: true });
  heroLocalSource.src = heroLocalSource.dataset.src;
  heroLocalVideo.load();
}

function syncHeroBackgroundVideo() {
  if (reducedMotion.matches) {
    heroLocalVideo?.pause();
    if (heroVideo) heroVideo.src = 'about:blank';
    return;
  }

  if (heroLocalState === 'pending') loadHeroLocalVideo();
  else if (heroLocalState === 'ready') heroLocalVideo.play().catch(() => {});
  else showYouTubeBackground();
}

syncHeroBackgroundVideo();
reducedMotion.addEventListener?.('change', syncHeroBackgroundVideo);

function openIntroVideo() {
  if (!introDialog || !introPlayer) return;

  if (typeof introDialog.showModal !== 'function') {
    window.open('https://youtu.be/lkpkr6ZK67k', '_blank', 'noopener,noreferrer');
    return;
  }

  introPlayer.src = introPlayer.dataset.src || 'about:blank';
  introDialog.showModal();
}

function closeIntroVideo() {
  if (!introDialog || !introPlayer) return;

  introDialog.close();
  introPlayer.src = 'about:blank';
}

introOpenButton?.addEventListener('click', openIntroVideo);
introCloseButton?.addEventListener('click', closeIntroVideo);
introDialog?.addEventListener('click', (event) => {
  if (event.target === introDialog) closeIntroVideo();
});
introDialog?.addEventListener('close', () => {
  if (introPlayer) introPlayer.src = 'about:blank';
});

function filterMedia(category) {
  mediaCards.forEach((card) => {
    const shouldShow = category === 'all' || card.dataset.category === category;
    card.classList.toggle('is-hidden', !shouldShow);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter || 'all';
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    filterMedia(category);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
    });
  },
  {
    rootMargin: '-35% 0px -55% 0px',
    threshold: [0.05, 0.2, 0.4],
  }
);

document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
