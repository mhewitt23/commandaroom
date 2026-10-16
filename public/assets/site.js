(function () {
  // the menu
  var header = document.querySelector('header');
  var btn = document.getElementById('menu-btn');
  var menu = document.getElementById('mobile-menu');
  var scrim = document.getElementById('menu-scrim');
  function setMenu(open) {
    menu.hidden = !open; scrim.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    header.classList.toggle('menu-open', open);
  }
  if (btn && menu && scrim) {
    btn.addEventListener('click', function () { setMenu(menu.hidden); });
    scrim.addEventListener('click', function () { setMenu(false); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-close-menu]'), function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }

  // the homepage: Results and About light up while you read them
  var links = document.querySelectorAll('[data-nav]');
  if (links.length && 'IntersectionObserver' in window) {
    var seen = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen[en.target.id] = en.isIntersecting; });
      var on = '';
      ['results', 'about'].forEach(function (id) { if (seen[id]) { on = id; } });
      Array.prototype.forEach.call(links, function (a) {
        var hit = a.getAttribute('data-nav') === on;
        a.classList.toggle('is-on', hit);
        if (hit) { a.setAttribute('aria-current', 'location'); } else { a.removeAttribute('aria-current'); }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['results', 'about'].forEach(function (id) { var el = document.getElementById(id); if (el) { spy.observe(el); } });
  }

  function setInert(keep, on) {
    Array.prototype.forEach.call(keep.parentNode.children, function (el) {
      if (el === keep || el.tagName === 'SCRIPT') { return; }
      if (on) { el.setAttribute('inert', ''); } else { el.removeAttribute('inert'); }
    });
  }
  function trap(box, ev) {
    var f = Array.prototype.filter.call(box.querySelectorAll('button, a[href]'), function (x) { return x.getClientRects().length > 0; });
    if (!f.length) { return; }
    var a = document.activeElement;
    if (ev.shiftKey && (a === f[0] || a === box)) { ev.preventDefault(); f[f.length - 1].focus(); }
    else if (!ev.shiftKey && a === f[f.length - 1]) { ev.preventDefault(); f[0].focus(); }
    else if (!box.contains(a)) { ev.preventDefault(); f[0].focus(); }
  }

  // the video player
  var videos = {"spencer": {"name": "Spencer Applebaum","role": "General Partner and Co-Head of Venture, Multicoin Capital","src": "vimeo.com/1234419726","ratio": ""},"marina": {"name": "Marina","role": "Solutions Architect (Applied AI), Vellum AI","src": "vimeo.com/1234455607","ratio": ""},"raj": {"name": "Raj","role": "COO, Investor, Entrepreneur","src": "youtube.com/watch?v=0ZH5UG2Orns","ratio": ""},"michael": {"name": "Michael","role": "VC-backed CEO and Founder","src": "youtube.com/watch?v=bZ8Ccua4Zow","ratio": ""},"adam": {"name": "Adam","role": "CEO","src": "youtube.com/shorts/pqJYumeCXtk","ratio": ""},"scott": {"name": "Scott","role": "CEO","src": "youtube.com/watch?v=rCVyUGVXSt0","ratio": ""},"scottvoice": {"name": "Scott","role": "CEO (public speaking coaching)","src": "youtube.com/watch?v=RdjPj-9mam0","ratio": ""},"kellen": {"name": "Kellen","role": "Founder, Chief Growth Officer","src": "youtube.com/watch?v=9yFwKjzwC-M","ratio": ""},"andres": {"name": "Andres","role": "Founder","src": "vimeo.com/1234517384","ratio": ""},"riley": {"name": "Riley","role": "Founder","src": "vimeo.com/1231514012","ratio": ""},"jimmy": {"name": "Jimmy","role": "Executive","src": "youtube.com/watch?v=KZNo-HRSkOQ","ratio": ""},"brian": {"name": "Brian","role": "VP of Sales","src": "vimeo.com/1231514017","ratio": ""},"salesleader": {"name": "Sales Leader","role": "","src": "youtube.com/watch?v=5vhKC7Qepic","ratio": ""},"rose": {"name": "Rose","role": "Entrepreneur","src": "vimeo.com/1231514018","ratio": ""},"jonathan": {"name": "Jonathan","role": "Associate General Counsel, Director of Sales","src": "youtube.com/watch?v=E1kEzJ4mrsU","ratio": ""},"bryan": {"name": "Bryan","role": "Insurance Broker","src": "vimeo.com/1234517383","ratio": ""},"eric": {"name": "Eric","role": "DeFi Business Development","src": "vimeo.com/1231514014","ratio": ""},"strategicae": {"name": "Fortune 1000 Strategic AE","role": "","src": "youtube.com/watch?v=oLAwVyTCoDY","ratio": ""},"sakul": {"name": "Sakul","role": "Enterprise AE","src": "vimeo.com/1231514016","ratio": ""},"nelly": {"name": "Nelly","role": "BDR","src": "vimeo.com/1231514013","ratio": ""},"sdr": {"name": "SDR","role": "","src": "youtube.com/shorts/S_n-x5PmyvU","ratio": ""},"mark": {"name": "Mark","role": "Coach","src": "vimeo.com/1231514015","ratio": ""},"jay": {"name": "Jay","role": "TV News Anchor","src": "vimeo.com/1235620079?h=ee53050bee","ratio": "4/5"},"sam": {"name": "Sam","role": "Corporate Sales, Entrepreneur","src": "vimeo.com/1235620269?h=9273ba5922","ratio": "4/5"},"dylan": {"name": "Dylan","role": "@serialsales, Workshop Attendee and Organizer","src": "vimeo.com/1235620080?h=751d20f79b","ratio": "4/5"},"adampartner": {"name": "Adam","role": "Client and Partner","src": "vimeo.com/1235620212?h=f7d157124d","ratio": "4/5"},"chris": {"name": "Chris","role": "Software Engineer","src": "vimeo.com/1235620196?h=87aa392ef3","ratio": "4/5"},"eddy": {"name": "Eddy","role": "Entrepreneur","src": "vimeo.com/1235623564?h=27e9cfaedc","ratio": "4/5"},"doug": {"name": "Doug","role": "CPA, Entrepreneur","src": "vimeo.com/1235624688?h=8dbeec75ec","ratio": "4/5"},"presentation": {"name": "Client","role": "Presentation Skills","src": "vimeo.com/1235624692?h=e7613d22d4","ratio": "4/5"},"brendan": {"name": "Brendan","role": "Sales, Content Creator","src": "vimeo.com/1235624690?h=39fdb9e61a","ratio": "4/5"},"christy": {"name": "Christy","role": "Hypnotherapist, Entrepreneur","src": "vimeo.com/1235624691?h=8cb0d453c1","ratio": "4/5"},"paul": {"name": "Paul","role": "Sales and Marketing","src": "vimeo.com/1235623739?h=ed95ee970e","ratio": "4/5"},"kade": {"name": "Kade","role": "Top 1% TikTok Shop","src": "vimeo.com/1235669158?h=14266f6db4","ratio": "4/5"},"edlatimore": {"name": "Ed Latimore","role": "Author and Speaker","src": "vimeo.com/1235973059?h=9dc614cd63","ratio": "4/5"},"harrison": {"name": "Harrison","role": "Executive Recruitment Firm Principal","src": "vimeo.com/1235972915?h=fec7184a62","ratio": "4/5"},"max": {"name": "Max","role": "Real Estate Development","src": "vimeo.com/1235973159?h=44b5564bd6","ratio": "4/5"},"natalie": {"name": "Natalie","role": "Group Workshop Facilitator","src": "vimeo.com/1235973058?h=b885391bda","ratio": "4/5"},"trevor": {"name": "Trevor","role": "Group Workshop Participant","src": "vimeo.com/1235973053?h=9eb5913814","ratio": "4/5"},"danny": {"name": "Danny","role": "Insurance Sales","src": "vimeo.com/1235972914?h=c6c005fdfd","ratio": "4/5"},"patrick": {"name": "Patrick","role": "Coach and Parent","src": "vimeo.com/1235972913?h=ee0dfeb114","ratio": "4/5"},"john": {"name": "John","role": "Sales","src": "vimeo.com/1235972912?h=436369cc5f","ratio": "4/5"},"debbie": {"name": "Debbie","role": "","src": "vimeo.com/1235973060?h=7bc09908a2","ratio": "4/5"},"jared": {"name": "Jared","role": "","src": "vimeo.com/1235973140?h=a639bc9fa9","ratio": "4/5"}};
  var modal = document.getElementById('video-modal');
  var player = document.getElementById('video-player');
  var frame = document.getElementById('video-frame');
  var nameEl = document.getElementById('video-name');
  var roleEl = document.getElementById('video-role');
  var closeBtn = document.getElementById('video-close');
  var lastFocus = null;
  function embedUrl(src) {
    var m;
    if ((m = src.match(/vimeo\.com\/(\d+)(?:\/([0-9a-f]{6,})|\?h=([0-9a-f]+))?/))) { var h = m[2] || m[3]; return { url: 'https://player.vimeo.com/video/' + m[1] + '?' + (h ? 'h=' + h + '&' : '') + 'autoplay=1&title=0&byline=0&portrait=0', tall: false }; }
    if ((m = src.match(/youtube\.com\/shorts\/([\w-]+)/))) { return { url: 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0', tall: true }; }
    if ((m = src.match(/[?&]v=([\w-]+)/))) { return { url: 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0', tall: false }; }
    return null;
  }
  function openVideo(key, back) {
    var v = videos[key]; if (!v || !modal) { return; }
    var e = embedUrl(v.src); if (!e) { return; }
    lastFocus = back || document.activeElement;
    nameEl.textContent = v.name; roleEl.textContent = v.role ? ', ' + v.role : '';
    modal.setAttribute('aria-label', 'Video: ' + v.name);
    var shape = v.ratio === '4/5' ? 'r-45' : (e.tall ? 'r-916' : '');
    player.className = shape; frame.className = shape;
    player.innerHTML = '';
    var f = document.createElement('iframe');
    f.src = e.url; f.title = 'Video: ' + v.name;
    f.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
    f.setAttribute('allowfullscreen', '');
    player.appendChild(f);
    modal.hidden = false; document.body.classList.add('modal-open'); setInert(modal, true);
    closeBtn.focus();
  }
  function closeVideo() {
    modal.hidden = true; player.innerHTML = ''; document.body.classList.remove('modal-open'); setInert(modal, false);
    if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
  }
  if (modal) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-video]'), function (el) {
      el.addEventListener('click', function () { openVideo(el.getAttribute('data-video')); });
    });
    closeBtn.addEventListener('click', closeVideo);
    modal.addEventListener('click', function (ev) { if (ev.target === modal) { closeVideo(); } });
  }

  // the carousel of written testimonials (homepage)
  var track = document.getElementById('cq-track');
  if (track) {
    var prev = document.getElementById('cq-prev');
    var next = document.getElementById('cq-next');
    var count = document.getElementById('cq-count');
    var slides = track.children.length;
    var at = 0, end = false, frameId = 0;
    var still = window.matchMedia('(prefers-reduced-motion: reduce)');
    var phone = window.matchMedia('(max-width: 759px)');
    function slideStep() { return slides > 1 ? track.children[1].offsetLeft - track.children[0].offsetLeft : track.clientWidth; }
    function syncCarousel() {
      frameId = 0;
      at = Math.max(0, Math.min(slides - 1, Math.round(track.scrollLeft / (slideStep() || 1))));
      end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      count.textContent = (at + 1) + ' of ' + slides;
      prev.setAttribute('aria-disabled', at > 0 ? 'false' : 'true');
      next.setAttribute('aria-disabled', end ? 'true' : 'false');
    }
    function syncSoon() { if (!frameId) { frameId = window.requestAnimationFrame(syncCarousel); } }
    function moveCarousel(d) {
      if ((d < 0 && at === 0) || (d > 0 && end)) { return; }
      track.scrollBy({ left: d * slideStep(), behavior: still.matches ? 'auto' : 'smooth' });
    }
    track.addEventListener('scroll', syncSoon, { passive: true });
    prev.addEventListener('click', function () { moveCarousel(-1); });
    next.addEventListener('click', function () { moveCarousel(1); });
    // phones: a long review is clamped and opens in place; one that fits loses its button
    var more = track.querySelectorAll('[data-cq-more]');
    function fitMore() {
      Array.prototype.forEach.call(more, function (button) {
        var slide = button.closest('.cq-slide'), q = slide.querySelector('.cq-q');
        if (slide.classList.contains('is-open')) { return; }
        slide.classList.remove('is-fit');
        slide.classList.toggle('is-fit', !phone.matches || q.scrollHeight <= q.clientHeight + 2);
      });
    }
    Array.prototype.forEach.call(more, function (button) {
      var slide = button.closest('.cq-slide');
      button.addEventListener('click', function () {
        var open = slide.classList.toggle('is-open');
        button.setAttribute('aria-expanded', open ? 'true' : 'false');
        button.textContent = open ? 'Show less' : 'Read the full review';
        if (!open && slide.getBoundingClientRect().top < 72) { slide.scrollIntoView({ block: 'start' }); }
      });
    });
    window.addEventListener('resize', function () { syncSoon(); fitMore(); });
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function () { syncCarousel(); fitMore(); }); }
    syncCarousel(); fitMore();
  }

  // testimonial cards (Wall of Love): fade only where the text runs past the card
  var wins = document.querySelectorAll('.rv-win');
  function fitWins() {
    Array.prototype.forEach.call(wins, function (w) {
      if (!w.getClientRects().length) { return; }
      w.classList.toggle('is-fit', w.scrollHeight <= w.clientHeight + 2);
    });
  }
  if (wins.length) {
    fitWins();
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fitWins); }
    var fitT = null;
    window.addEventListener('resize', function () { clearTimeout(fitT); fitT = setTimeout(fitWins, 150); });
  }

  // the reader (Wall of Love): one testimonial at a time, full size, with previous and next
  var rdEl = document.getElementById('reader');
  var readsEl = document.getElementById('reads');
  var reads = null;
  var PLAY = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M7 4.5v15l13-7.5z"></path></svg>';
  var rdBody = document.getElementById('rd-body');
  var rdName = document.getElementById('rd-name');
  var rdRole = document.getElementById('rd-role');
  var rdCount = document.getElementById('rd-count');
  var rdLive = document.getElementById('rd-live');
  var rdSet = 'r', rdI = 0, rdBack = null;
  var narrow = window.matchMedia('(max-width: 759px)');
  function rdShow() {
    var list = reads[rdSet], it = list[rdI], n = list.length;
    rdName.textContent = it.name;
    rdRole.textContent = it.role ? ', ' + it.role : '';
    rdCount.textContent = (rdI + 1) + ' of ' + n;
    rdLive.textContent = it.name + ', ' + (rdI + 1) + ' of ' + n;
    rdBody.className = 'rd-body ' + (rdSet === 's' ? 'is-shot' : (it.src ? 'is-img' : 'is-text'));
    rdBody.style.width = rdSet === 's' ? 'min(100%, 640px, calc((100vh - 190px) * ' + (it.w / it.h).toFixed(4) + '))' : '';
    rdBody.innerHTML = '';
    if (it.src) {
      var im = document.createElement('img');
      im.className = 'rd-img'; im.alt = it.alt || ''; im.width = it.w; im.height = it.h;
      im.loading = 'lazy'; im.decoding = 'async'; im.src = it.src;
      rdBody.appendChild(im);
    }
    if (rdSet === 'r') {
      var t = document.querySelector('#' + it.id + ' .review-txt');
      if (t) { var d = document.createElement('div'); d.className = 'rd-txt'; d.innerHTML = t.innerHTML; rdBody.appendChild(d); }
      if (it.video || it.link) {
        var row = document.createElement('div'); row.className = 'rd-links';
        if (it.video) {
          var vb = document.createElement('button');
          vb.type = 'button'; vb.className = 'linkbtn'; vb.innerHTML = PLAY + 'Watch ' + it.first + '\u2019s video';
          vb.addEventListener('click', function () { var back = rdBack; rdHide(false); openVideo(it.video, back); });
          row.appendChild(vb);
        }
        if (it.link) {
          var a = document.createElement('a');
          a.href = it.link; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'View on Testimonial.to';
          row.appendChild(a);
        }
        rdBody.appendChild(row);
      }
    }
    rdEl.scrollTop = 0;
    if (!(rdSet === 'r' && narrow.matches)) {
      [-1, 1].forEach(function (k) { var nb = list[(rdI + k + n) % n]; if (nb.src) { var p = new Image(); p.src = nb.src; } });
    }
  }
  function rdOpen(set, i) {
    rdBack = document.activeElement; rdSet = set; rdI = i;
    rdShow();
    rdEl.hidden = false; document.body.classList.add('modal-open'); setInert(rdEl, true);
    rdEl.focus();
  }
  function rdHide(restore) {
    rdEl.hidden = true; rdBody.innerHTML = ''; document.body.classList.remove('modal-open'); setInert(rdEl, false);
    if (restore !== false && rdBack && rdBack.focus) { rdBack.focus(); }
  }
  function rdStep(k) { var n = reads[rdSet].length; rdI = (rdI + k + n) % n; rdShow(); }
  if (rdEl && readsEl) {
    reads = JSON.parse(readsEl.textContent);
    Array.prototype.forEach.call(document.querySelectorAll('[data-read]'), function (el) {
      el.addEventListener('click', function () { var v = el.getAttribute('data-read').split(':'); rdOpen(v[0], +v[1]); });
    });
    document.getElementById('rd-close').addEventListener('click', function () { rdHide(); });
    document.getElementById('rd-prev').addEventListener('click', function () { rdStep(-1); });
    document.getElementById('rd-next').addEventListener('click', function () { rdStep(1); });
    rdEl.addEventListener('click', function (ev) { if (ev.target === rdEl) { rdHide(); } });
    var tx = null, ty = 0;
    rdEl.addEventListener('touchstart', function (ev) {
      if (ev.touches.length === 1) { tx = ev.touches[0].clientX; ty = ev.touches[0].clientY; } else { tx = null; }
    }, { passive: true });
    rdEl.addEventListener('touchend', function (ev) {
      if (tx === null) { return; }
      var t = ev.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty; tx = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > 1.6 * Math.abs(dy)) { rdStep(dx < 0 ? 1 : -1); }
    }, { passive: true });
  }

  document.addEventListener('keydown', function (ev) {
    if (rdEl && !rdEl.hidden) {
      if (ev.key === 'Escape') { rdHide(); }
      else if (ev.key === 'ArrowRight') { ev.preventDefault(); rdStep(1); }
      else if (ev.key === 'ArrowLeft') { ev.preventDefault(); rdStep(-1); }
      else if (ev.key === 'Tab') { trap(rdEl, ev); }
      return;
    }
    if (ev.key === 'Escape') {
      if (modal && !modal.hidden) { closeVideo(); } else if (menu && !menu.hidden) { setMenu(false); }
    }
  });
})();
