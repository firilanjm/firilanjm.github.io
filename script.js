/**
 * Portfolio — UI interactions, accessibility, scroll reveal & filters
 */

const header    = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Header scroll ---- */
window.addEventListener('scroll', () => {
  header.classList.toggle('header--scrolled', window.scrollY > 40);
}, { passive: true });

/* ---- Mobile nav (accessible) ---- */
function setNavOpen(open) {
  navLinks.classList.toggle('nav__links--open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('nav-open', open);
}

navToggle.addEventListener('click', () => {
  setNavOpen(!navLinks.classList.contains('nav__links--open'));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setNavOpen(false));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('nav__links--open')) {
    setNavOpen(false);
    navToggle.focus();
  }
});

/* ---- Scroll reveal ---- */
const revealEls = document.querySelectorAll(
  '.section__header, .about__grid, .skills-inline, .cards-grid, .projects-showcase, ' +
  '.projects-toolbar, .awards__grid, .resume__inner, .contact__inner, .highlights, ' +
  '.impact-quote, .leadership-skills, .leadership-timeline, .leadership-entry, ' +
  '.community-values, .community-impact, .community-entry, .hero__content, .hero__visual'
);

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  revealEls.forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

/* ---- Active nav link on scroll ---- */
const sections   = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav__link');

const navObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle('nav__link--active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
);
sections.forEach(section => navObserver.observe(section));

/* ---- Contact form (FormSubmit) ---- */
const contactForm  = document.getElementById('contactForm');
const formStatus   = document.getElementById('formStatus');
const formSubmitBtn = document.getElementById('formSubmitBtn');
const FORM_ENDPOINT = contactForm.action;

function showFormStatus(message, type) {
  formStatus.textContent = message;
  formStatus.hidden = false;
  formStatus.className = `form__status form__status--${type}`;
}

contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  if (contactForm.querySelector('[name="_honey"]').value) return;

  const original = formSubmitBtn.textContent;
  formSubmitBtn.disabled = true;
  formSubmitBtn.textContent = 'Sending…';
  formStatus.hidden = true;

  const data = {
    name: contactForm.name.value.trim(),
    email: contactForm.email.value.trim(),
    message: contactForm.message.value.trim(),
    _subject: contactForm.querySelector('[name="_subject"]').value,
    _template: 'table',
  };

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Request failed');

    contactForm.reset();
    showFormStatus('Thank you — your message has been sent. I\'ll get back to you soon.', 'success');
    formSubmitBtn.textContent = 'Message Sent ✓';
    formSubmitBtn.style.background = '#6BAA75';
    formSubmitBtn.style.borderColor = '#6BAA75';
  } catch {
    showFormStatus('Something went wrong. Please email me directly at firilanjm@gmail.com.', 'error');
    formSubmitBtn.textContent = original;
  } finally {
    formSubmitBtn.disabled = false;
    setTimeout(() => {
      formSubmitBtn.textContent = original;
      formSubmitBtn.style.background = '';
      formSubmitBtn.style.borderColor = '';
    }, 4000);
  }
});

/* ---- Projects search & filter ---- */
const projectSearch    = document.getElementById('projectSearch');
const projectCards     = document.querySelectorAll('.project-showcase');
const projectFilters   = document.querySelectorAll('.projects-filter');
const projectCount     = document.getElementById('projectCount');
const projectsEmpty    = document.getElementById('projectsEmpty');
const projectsShowcase = document.getElementById('projectsShowcase');

let activeFilter = 'all';

function filterProjects() {
  const query = projectSearch.value.trim().toLowerCase();
  let visible = 0;

  projectCards.forEach(card => {
    const matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
    const matchesSearch = !query || card.dataset.search.toLowerCase().includes(query);
    const show = matchesFilter && matchesSearch;
    card.classList.toggle('is-hidden', !show);
    if (show) visible++;
  });

  projectCount.textContent = visible === 1
    ? 'Showing 1 project'
    : `Showing ${visible} projects`;
  projectsEmpty.hidden = visible > 0;
  projectsShowcase.style.display = visible > 0 ? '' : 'none';
}

projectSearch.addEventListener('input', filterProjects);

projectFilters.forEach(btn => {
  btn.addEventListener('click', () => {
    projectFilters.forEach(b => {
      b.classList.remove('projects-filter--active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('projects-filter--active');
    btn.setAttribute('aria-pressed', 'true');
    activeFilter = btn.dataset.filter;
    filterProjects();
  });
});
