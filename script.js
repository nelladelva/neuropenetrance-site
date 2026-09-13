// Mobile nav toggle
(function(){
  var menuBtn = document.getElementById('menuBtn');
  var primaryNav = document.getElementById('primaryNav');
  if (menuBtn && primaryNav) {
    menuBtn.addEventListener('click', function(){
      var open = primaryNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.textContent = open ? '✕' : '☰';
    });
    primaryNav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        primaryNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = '☰';
      });
    });
  }
})();

// AUC bar reveal on scroll into view (evidence page)
(function(){
  var bars = document.querySelectorAll('.bar-fill');
  if (!bars.length) return;
  var revealBars = function(){ bars.forEach(function(b){ b.style.width = b.getAttribute('data-target') + '%'; }); };
  var aucSection = document.getElementById('aucBars');
  if ('IntersectionObserver' in window && aucSection) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){ if (entry.isIntersecting) { revealBars(); io.disconnect(); } });
    }, { threshold: 0.35 });
    io.observe(aucSection);
  } else {
    revealBars();
  }
})();

// Scientific rationale tab switching (evidence page)
(function(){
  var tabs = document.querySelectorAll('.rationale-tab');
  if (!tabs.length) return;
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      document.querySelectorAll('.rationale-tab').forEach(function(t){ t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      document.querySelectorAll('.rationale-panel').forEach(function(p){ p.classList.remove('active'); p.hidden = true; });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      var panel = document.getElementById('panel-' + tab.dataset.tab);
      if (panel) { panel.hidden = false; panel.classList.add('active'); }
    });
  });
})();

// Contact form -> mailto (homepage)
(function(){
  var form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('cf-name').value;
    var email = document.getElementById('cf-email').value;
    var msg = document.getElementById('cf-msg').value;
    var subject = encodeURIComponent('NeuroPenetrance inquiry from ' + name);
    var body = encodeURIComponent(msg + '\n\n— ' + name + ' (' + email + ')');
    window.location.href = 'mailto:stemazing.advancement@gmail.com?subject=' + subject + '&body=' + body;
  });
})();

// Get Involved form now submits directly to Formspree (native POST) —
// this just shows a thank-you state after the redirect back.
(function(){
  var success = document.getElementById('involvedSuccess');
  var formWrap = document.getElementById('involvedFormWrap');
  if (!success || !formWrap) return;
  var params = new URLSearchParams(window.location.search);
  if (params.get('sent') === 'true') {
    success.style.display = 'block';
    formWrap.style.display = 'none';
  }
})();
