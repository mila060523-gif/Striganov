// Меню на телефоне и форма заявки. Сайт статический, своего сервера у него нет,
// поэтому форма готовит письмо в почтовой программе жителя.
const REQUEST_EMAIL = '89221166119@mail.ru';

initMenu();
initRequestForm();

function initMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });
}

function initRequestForm() {
  const form = document.querySelector('#request-form');
  if (!form) return;

  const status = form.querySelector('#form-status');
  const fields = {
    name: { test: (value) => value.length > 0, message: 'Укажите имя, чтобы мы знали, как к вам обращаться.' },
    phone: { test: (value) => normalizePhone(value) !== null, message: 'Укажите телефон из 10 или 11 цифр, например 8 922 000-00-00.' },
    email: { test: (value) => value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: 'Проверьте email: в адресе должны быть символ @ и домен. Поле можно оставить пустым.' },
    address: { test: (value) => value.length > 0, message: 'Укажите улицу и номер дома.' },
    topic: { test: (value) => value.length > 0, message: 'Выберите тему обращения.' },
    message: { test: (value) => value.length > 0, message: 'Опишите, что случилось или какой у вас вопрос.' }
  };

  applyLinkPrefill(form);

  const setError = (name, message) => {
    const control = form.elements[name];
    const error = form.querySelector(`#${name}-error`);
    error.textContent = message;
    if (message) {
      control.setAttribute('aria-invalid', 'true');
    } else {
      control.removeAttribute('aria-invalid');
    }
  };

  const validate = () => {
    const invalid = [];
    Object.entries(fields).forEach(([name, rule]) => {
      const valid = rule.test(form.elements[name].value.trim());
      setError(name, valid ? '' : rule.message);
      if (!valid) invalid.push(form.elements[name]);
    });

    const consent = form.elements.consent;
    setError('consent', consent.checked ? '' : 'Без согласия мы не сможем принять обращение.');
    if (!consent.checked) invalid.push(consent);
    return invalid;
  };

  Object.keys(fields).concat('consent').forEach((name) => {
    form.elements[name].addEventListener('input', () => {
      if (form.elements[name].getAttribute('aria-invalid') === 'true') validate();
    });
  });

  form.elements.phone.addEventListener('blur', () => {
    const phone = normalizePhone(form.elements.phone.value);
    if (phone) form.elements.phone.value = phone;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.className = 'form-status';
    status.textContent = '';

    const invalid = validate();
    if (invalid.length > 0) {
      invalid[0].focus();
      return;
    }

    const value = (name) => form.elements[name].value.trim();
    const body = [
      `Имя: ${value('name')}`,
      `Телефон: ${normalizePhone(value('phone'))}`,
      value('email') ? `Email: ${value('email')}` : null,
      `Адрес дома: ${value('address')}`,
      `Тема: ${value('topic')}`,
      '',
      value('message')
    ].filter((line) => line !== null).join('\n');

    const subject = `Обращение с сайта: ${value('topic')}`;
    window.location.href = `mailto:${REQUEST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    status.classList.add('is-success');
    status.textContent = 'Письмо подготовлено в почтовой программе. Проверьте его и нажмите «Отправить» там. Если почта не открылась, позвоните нам: 8 (343) 541-81-49.';
  });
}

// Ссылка «Запросить копию» со страницы документов сразу заполняет тему и сообщение.
function applyLinkPrefill(form) {
  const documentName = new URLSearchParams(window.location.search).get('document');
  if (!documentName) return;
  form.elements.topic.value = 'Запрос документа';
  form.elements.message.value = `Прошу предоставить копию документа: ${documentName}.`;
}

function normalizePhone(value) {
  let digits = value.replace(/\D/g, '');
  if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) digits = digits.slice(1);
  if (digits.length !== 10) return null;
  return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
}
