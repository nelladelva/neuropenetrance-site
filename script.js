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
   Submitting in the background avoids the cross-domain redirect
   that silently blocked earlier submissions. ---------------- */
(function () {
  var form = document.getElementById('interestForm');
  if (!form) return;

  var status = document.getElementById('formStatus');
  var wrap = document.getElementById('formWrap');
  var success = document.getElementById('formSuccess');
  var button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (status) { status.textContent = 'Sending…'; status.classList.remove('error'); }
    if (button) { button.disabled = true; }

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          if (wrap) wrap.style.display = 'none';
          if (success) success.style.display = 'block';
          return;
        }
        return response.json().then(function (data) {
          var message = 'Something went wrong. Please email stemazing.advancement@gmail.com instead.';
          if (data && data.errors && data.errors.length) {
            message = data.errors.map(function (e) { return e.message; }).join(', ');
          }
          throw new Error(message);
        });
      })
      .catch(function (error) {
        if (status) {
          status.textContent = error.message || 'Network error — please email stemazing.advancement@gmail.com instead.';
          status.classList.add('error');
        }
        if (button) { button.disabled = false; }
      });
  });
})();
