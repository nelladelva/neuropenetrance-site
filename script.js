/* ============================================================
   NeuroPenetrance — shared scripts
   ============================================================ */

/* ---- Mobile navigation ---- */
(function () {
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('primaryNav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? '✕' : '☰';
  });
})();

/* ---- Animate AUC bars when they scroll into view ---- */
(function () {
  var bars = document.querySelectorAll('.bar-fill[data-target]');
  if (!bars.length) return;

  // bars render at full width without JavaScript; with it, they animate in from zero
  bars.forEach(function (bar) { bar.style.width = '0'; });

  function fill() {
    bars.forEach(function (bar) {
      bar.style.width = bar.getAttribute('data-target') + '%';
    });
  }

  if (!('IntersectionObserver' in window)) { fill(); return; }

  var container = document.getElementById('aucBars') || bars[0].parentElement;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { fill(); observer.disconnect(); }
    });
  }, { threshold: 0.25 });
  observer.observe(container);
})();

/* ---- Tabbed literature panels ---- */
(function () {
  var tabs = document.querySelectorAll('.tab');
  if (!tabs.length) return;
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-tab');
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      document.querySelectorAll('.tab-panel').forEach(function (panel) {
        panel.hidden = panel.id !== 'panel-' + target;
      });
    });
  });
})();

/* ---- Formspree submission (AJAX, no redirect) ----
   Works on every <form class="js-form">. Texts come from the form's data-* attributes so each language
   shows its own messages. Without JavaScript the form still posts normally to Formspree. ---------------- */
(function () {
  document.querySelectorAll('form.js-form').forEach(function (form) {
    var status = form.querySelector('.form-status');
    var success = document.getElementById(form.getAttribute('data-success'));
    var button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (status) { status.textContent = form.getAttribute('data-sending'); status.classList.remove('error'); }
      if (button) { button.disabled = true; }
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (response) {
          if (response.ok) {
            form.hidden = true;
            if (success) { success.hidden = false; success.focus(); }
            return;
          }
          throw new Error(form.getAttribute('data-error'));
        })
        .catch(function () {
          if (status) { status.textContent = form.getAttribute('data-error'); status.classList.add('error'); }
          if (button) { button.disabled = false; }
        });
    });
  });
})();
