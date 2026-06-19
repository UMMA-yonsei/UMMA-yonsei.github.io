const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const mediaCards = Array.from(document.querySelectorAll('.media-card'));
const navLinks = Array.from(document.querySelectorAll('.primary-nav a'));

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
