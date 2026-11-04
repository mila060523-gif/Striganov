document.addEventListener('DOMContentLoaded', () => {
  // Подгружаем общие шаблоны шапки и подвала для всех страниц.
  const headerTarget = document.getElementById('app-header');
  const footerTarget = document.getElementById('app-footer');

  if (!headerTarget || !footerTarget) {
    return;
  }

  Promise.all([
    fetch('partials/header.html').then((response) => {
      if (!response.ok) {
        throw new Error('Не удалось загрузить шапку');
      }
      return response.text();
    }),
    fetch('partials/footer.html').then((response) => {
      if (!response.ok) {
        throw new Error('Не удалось загрузить подвал');
      }
      return response.text();
    })
  ])
    .then(([headerHtml, footerHtml]) => {
      headerTarget.innerHTML = headerHtml;
      footerTarget.innerHTML = footerHtml;
      document.dispatchEvent(new CustomEvent('components:ready'));
    })
    .catch((error) => {
      console.error(error);
    });
});
