document.addEventListener('components:ready', () => {
  // Инициализация общих интерактивных элементов сайта.
  initNavState();
  initMobileMenu();
  initFooterYear();
  initContactForm();
  initPhoneMask();
});

const employees = [
  { name: 'Стриганов Максим Сергеевич', initials: 'МС', position: 'Директор организации', department: 'Руководство', highlighted: true },
  { name: 'Стриганова Наталья Викторовна', initials: 'НВ', position: 'Председатель организации', department: 'Руководство', highlighted: true },
  { name: 'Станева Юлия Максимовна', initials: 'ЮМ', position: 'Специалист', department: 'ЖКХ' },
  { name: 'Домановская Татьяна Васильевна', initials: 'ТВ', position: 'Специалист', department: 'Недвижимость' },
  { name: 'Кривин Александр Олегович', initials: 'АО', position: 'Специалист', department: 'Недвижимость' }
];

document.addEventListener('DOMContentLoaded', renderEmployees);

function renderEmployees() {
  const grid = document.querySelector('#team-grid');
  if (!grid) {
    return;
  }

  grid.innerHTML = employees.map((employee) => `
    <article class="team-card">
      <div class="team-head">
        <div class="avatar${employee.highlighted ? ' purple' : ''}">${employee.initials}</div>
        <div class="team-meta">
          <h3>${employee.name}</h3>
          <span class="role">${employee.position}</span>
        </div>
      </div>
      <p><strong>Отдел:</strong> ${employee.department}</p>
      <p>Телефон: —</p>
      <p>Email: —</p>
    </article>
  `).join('');
}

function initNavState() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    const href = new URL(link.href, window.location.href).pathname.split('/').pop() || 'index.html';
    link.classList.toggle('is-active', href === currentPath);
  });
}

function initMobileMenu() {
  const header = document.querySelector('.site-header');
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.site-nav');

  if (!header || !burger || !nav) {
    return;
  }

  let overlay = document.querySelector('.mobile-menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
  }

  const toggleMenu = (forceOpen) => {
    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !header.classList.contains('nav-open');
    header.classList.toggle('nav-open', shouldOpen);
    burger.setAttribute('aria-expanded', String(shouldOpen));
    nav.classList.toggle('is-open', shouldOpen);
    overlay.classList.toggle('is-visible', shouldOpen);
    document.body.classList.toggle('menu-open', shouldOpen);
  };

  burger.addEventListener('click', () => toggleMenu());
  overlay.addEventListener('click', () => toggleMenu(false));

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      toggleMenu(false);
    }
  });
}

function initFooterYear() {
  const yearNode = document.querySelector('.current-year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
}

function initPhoneMask() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach((input) => {
    input.addEventListener('input', (event) => {
      const target = event.target;
      const digits = target.value.replace(/\D/g, '').substring(0, 11);
      let formatted = '';

      if (digits.length > 0) {
        formatted = '+7 (' + digits.substring(1, 4);
      }
      if (digits.length >= 4) {
        formatted += ') ' + digits.substring(4, 7);
      }
      if (digits.length >= 7) {
        formatted += '-' + digits.substring(7, 9);
      }
      if (digits.length >= 9) {
        formatted += '-' + digits.substring(9, 11);
      }

      target.value = digits.length > 0 ? formatted : '';
    });
  });
}

function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) {
    return;
  }

  const status = document.querySelector('#form-status');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const fields = [
      { name: 'name', value: form.querySelector('[name="name"]').value.trim() },
      { name: 'phone', value: form.querySelector('[name="phone"]').value.trim() },
      { name: 'email', value: form.querySelector('[name="email"]').value.trim() },
      { name: 'address', value: form.querySelector('[name="address"]').value.trim() },
      { name: 'topic', value: form.querySelector('[name="topic"]').value.trim() },
      { name: 'message', value: form.querySelector('[name="message"]').value.trim() }
    ];

    const required = fields.every(({ value }) => value.length > 0);
    const consent = form.querySelector('[name="consent"]').checked;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.querySelector('[name="email"]').value.trim());
    const phoneValid = form.querySelector('[name="phone"]').value.replace(/\D/g, '').length >= 11;

    if (!required || !consent || !emailValid || !phoneValid) {
      status.textContent = 'Проверьте, пожалуйста, все обязательные поля и согласие на обработку данных.';
      status.classList.add('is-error');
      return;
    }

    status.textContent = 'Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.';
    status.classList.remove('is-error');
    form.reset();
  });
}
