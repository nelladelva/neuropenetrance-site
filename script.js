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

// Interest / market-data survey -> mailto (Get Involved page)
(function(){
  var form = document.getElementById('interestForm');
  if (!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('if-name').value || '(not provided)';
    var email = document.getElementById('if-email').value || '(not provided)';
    var role = document.getElementById('if-role').value;
    var interest = document.getElementById('if-interest').value;
    var conversation = document.getElementById('if-conversation').value;
    var msg = document.getElementById('if-msg').value || '(none)';
    var subject = encodeURIComponent('NeuroPenetrance interest form: ' + role);
    var lines = [
      'NEUROPENETRANCE — INTEREST FORM SUBMISSION',
      '',
      'Name: ' + name,
      'Email: ' + email,
      'Role: ' + role,
      'Interest: ' + interest,
      'Open to a 15-minute conversation: ' + conversation,
      'Additional comments: ' + msg
    ];
    var body = encodeURIComponent(lines.join('\n'));
    window.location.href = 'mailto:stemazing.advancement@gmail.com?subject=' + subject + '&body=' + body;
  });
})();
