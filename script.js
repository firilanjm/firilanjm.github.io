/**
 * Portfolio — UI interactions & GitHub profile stats
 */

const GITHUB_USERNAME = 'firilanjm';

/* ---- Header scroll ---- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('header--scrolled', window.scrollY > 40);
});

/* ---- Mobile nav ---- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('nav__links--open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('nav__links--open'));
});

/* ---- Scroll reveal ---- */
const revealEls = document.querySelectorAll(
  '.section__header, .about__grid, .projects__grid, .skills__grid, .contact__inner, .hero__content, .hero__visual'
);
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
revealEls.forEach(el => { el.classList.add('reveal'); observer.observe(el); });

/* ---- GitHub profile stats (hero only) ---- */
async function loadGitHubStats() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    if (!res.ok) return;
    const user = await res.json();
    document.getElementById('repoCount').textContent     = user.public_repos;
    document.getElementById('followerCount').textContent = user.followers;
  } catch { /* stats stay as — */ }
}

/* ---- Contact form (demo) ---- */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const original = btn.textContent;
  btn.textContent = 'Message Sent ✓';
  btn.style.background = '#6BAA75';
  btn.style.borderColor = '#6BAA75';
  e.target.reset();
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    btn.style.borderColor = '';
  }, 3000);
});

loadGitHubStats();
