const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const topBtn = document.getElementById('topBtn');

function closeMenu() {
  navMenu?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  if (menuToggle) menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}

menuToggle?.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menuToggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});

document.querySelectorAll('.nav-link, .nav-cta').forEach(link => link.addEventListener('click', closeMenu));

const pageSections = [...document.querySelectorAll('main section[id]')];
function updateOnScroll() {
  const scrollY = window.scrollY;
  header?.classList.toggle('scrolled', scrollY > 24);
  if (topBtn) topBtn.style.display = scrollY > 600 ? 'grid' : 'none';
  const y = scrollY + 150;
  let activeId = 'home';
  pageSections.forEach(section => {
    if (y >= section.offsetTop && y < section.offsetTop + section.offsetHeight) activeId = section.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    const active = link.getAttribute('href') === `#${activeId}`;
    link.classList.toggle('active', active);
  });
}
window.addEventListener('scroll', updateOnScroll, { passive: true });
updateOnScroll();
topBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Reveal content as it enters the viewport, with a safe fallback for older browsers.
const revealElements = document.querySelectorAll('.reveal:not(.visible)');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add('visible'));
}

// Portfolio category filters.
const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');
filters.forEach(button => {
  button.addEventListener('click', () => {
    filters.forEach(item => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    const category = button.dataset.filter;
    projects.forEach(project => {
      project.classList.toggle('hidden-filter', category !== 'all' && project.dataset.category !== category);
    });
  });
});

// Accessible project-detail modal. The image path comes directly from the card image.
const modal = document.getElementById('projectModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalType = document.getElementById('modalType');
const modalTech = document.getElementById('modalTech');
const modalLink = document.getElementById('modalLink');
const modalInstagram = document.getElementById('modalInstagram');
let lastFocusedProject = null;

function openProject(project) {
  if (!modal || !project) return;
  const image = project.querySelector('.project-image img');
  modalImage.src = image?.getAttribute('src') || '';
  modalImage.alt = image?.alt || project.dataset.title || 'Project preview';
  modalTitle.textContent = project.dataset.title || 'Project';
  modalDescription.textContent = project.dataset.description || '';
  modalType.textContent = (project.dataset.category || 'PROJECT').toUpperCase();
  modalTech.innerHTML = (project.dataset.tech || '').split(',').filter(Boolean)
    .map(tech => `<b>${tech.trim().replace(/[&<>"']/g, '')}</b>`).join('');
  modalLink.href = project.dataset.link || '#';
  if (modalInstagram) {
    modalInstagram.hidden = !project.dataset.instagram;
    modalInstagram.href = project.dataset.instagram || '#';
  }
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  lastFocusedProject = project;
  modal.querySelector('.modal-close')?.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  lastFocusedProject?.focus();
}

projects.forEach(project => {
  project.addEventListener('click', event => {
    if (event.target.closest('a')) return;
    openProject(project);
  });
  project.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProject(project);
    }
  });
});
document.querySelectorAll('[data-close]').forEach(element => element.addEventListener('click', closeModal));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal?.classList.contains('open')) closeModal();
});

// Contact form builds a WhatsApp message; no form data is stored on this website.
const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');
let toastTimeout;
form?.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value || 'Not specified';
  const message = document.getElementById('message').value.trim();
  const whatsappText = `Hi T&L Tech!\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nService: ${service}\n\nProject details:\n${message}`;
  const whatsappUrl = `https://wa.me/27714767516?text=${encodeURIComponent(whatsappText)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  if (toast) {
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3200);
  }
  form.reset();
});

// Pause the background video when the tab is not visible to reduce unnecessary work.
const heroVideo = document.querySelector('.hero-video');
document.addEventListener('visibilitychange', () => {
  if (!heroVideo) return;
  if (document.hidden) heroVideo.pause();
  else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) heroVideo.play().catch(() => {});
});
