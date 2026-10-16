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
    Array.prototype.forEach.call(document.querySelectorAll('[data-close-menu]'), function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
  }

  // the homepage: Results and About light up while you read them
  var navLinks = document.querySelectorAll('[data-nav]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var seen = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { seen[entry.target.id] = entry.isIntersecting; });
      var on = '';
      ['results', 'about'].forEach(function (id) { if (seen[id]) { on = id; } });
      Array.prototype.forEach.call(navLinks, function (link) {
        var hit = link.getAttribute('data-nav') === on;
        link.classList.toggle('is-on', hit);
        if (hit) { link.setAttribute('aria-current', 'location'); } else { link.removeAttribute('aria-current'); }
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
  // keep Tab inside an open dialog
  function trapFocus(box, ev) {
    var stops = Array.prototype.filter.call(box.querySelectorAll('button, a[href]'), function (el) { return el.getClientRects().length > 0; });
    if (!stops.length) { return; }
    var first = stops[0], last = stops[stops.length - 1], active = document.activeElement;
    if (ev.shiftKey && (active === first || active === box)) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && active === last) { ev.preventDefault(); first.focus(); }
    else if (!box.contains(active)) { ev.preventDefault(); first.focus(); }
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
    var match = src.match(/vimeo\.com\/(\d+)(?:\/([0-9a-f]{6,})|\?h=([0-9a-f]+))?/);
    if (match) {
      var hash = match[2] || match[3];
      return { url: 'https://player.vimeo.com/video/' + match[1] + '?' + (hash ? 'h=' + hash + '&' : '') + 'autoplay=1&title=0&byline=0&portrait=0', tall: false };
    }
    match = src.match(/youtube\.com\/shorts\/([\w-]+)/);
    if (match) { return { url: 'https://www.youtube-nocookie.com/embed/' + match[1] + '?autoplay=1&rel=0', tall: true }; }
    match = src.match(/[?&]v=([\w-]+)/);
    if (match) { return { url: 'https://www.youtube-nocookie.com/embed/' + match[1] + '?autoplay=1&rel=0', tall: false }; }
    return null;
  }
  function openVideo(key, back) {
    var video = videos[key]; if (!video || !modal) { return; }
    var embed = embedUrl(video.src); if (!embed) { return; }
    lastFocus = back || document.activeElement;
    nameEl.textContent = video.name; roleEl.textContent = video.role ? ', ' + video.role : '';
    modal.setAttribute('aria-label', 'Video: ' + video.name);
    var shape = video.ratio === '4/5' ? 'r-45' : (embed.tall ? 'r-916' : '');
    player.className = shape; frame.className = shape;
    player.innerHTML = '';
    var iframe = document.createElement('iframe');
    iframe.src = embed.url; iframe.title = 'Video: ' + video.name;
    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    player.appendChild(iframe);
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
    function syncOnNextFrame() { if (!frameId) { frameId = window.requestAnimationFrame(syncCarousel); } }
    function moveCarousel(direction) {
      if ((direction < 0 && at === 0) || (direction > 0 && end)) { return; }
      track.scrollBy({ left: direction * slideStep(), behavior: still.matches ? 'auto' : 'smooth' });
    }
    track.addEventListener('scroll', syncOnNextFrame, { passive: true });
    prev.addEventListener('click', function () { moveCarousel(-1); });
    next.addEventListener('click', function () { moveCarousel(1); });
    // phones: a long review is clamped and opens in place; one that fits loses its button
    var more = track.querySelectorAll('[data-cq-more]');
    function markReviewsThatFit() {
      Array.prototype.forEach.call(more, function (button) {
        var slide = button.closest('.cq-slide'), quote = slide.querySelector('.cq-q');
        if (slide.classList.contains('is-open')) { return; }
        slide.classList.remove('is-fit');
        slide.classList.toggle('is-fit', !phone.matches || quote.scrollHeight <= quote.clientHeight + 2);
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
    window.addEventListener('resize', function () { syncOnNextFrame(); markReviewsThatFit(); });
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function () { syncCarousel(); markReviewsThatFit(); }); }
    syncCarousel(); markReviewsThatFit();
  }

  // testimonial cards (Wall of Love): fade only where the text runs past the card
  var wins = document.querySelectorAll('.rv-win');
  function markCardsThatFit() {
    Array.prototype.forEach.call(wins, function (win) {
      if (!win.getClientRects().length) { return; }
      win.classList.toggle('is-fit', win.scrollHeight <= win.clientHeight + 2);
    });
  }
  if (wins.length) {
    markCardsThatFit();
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(markCardsThatFit); }
    var fitTimer = null;
    window.addEventListener('resize', function () { clearTimeout(fitTimer); fitTimer = setTimeout(markCardsThatFit, 150); });
  }

  // the reader (Wall of Love): one testimonial at a time, full size, with previous and next
  var rdEl = document.getElementById('reader');
  var readsEl = document.getElementById('reads');
  var readerSets = null;   // {r: the written reviews, s: the texts and posts}, from the JSON on the page
  var PLAY = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M7 4.5v15l13-7.5z"></path></svg>';
  var rdBody = document.getElementById('rd-body');
  var rdName = document.getElementById('rd-name');
  var rdRole = document.getElementById('rd-role');
  var rdCount = document.getElementById('rd-count');
  var rdLive = document.getElementById('rd-live');
  var rdSet = 'r', rdIndex = 0, rdBack = null;
  var narrow = window.matchMedia('(max-width: 759px)');
  function renderReader() {
    var list = readerSets[rdSet], item = list[rdIndex], total = list.length;
    rdName.textContent = item.name;
    rdRole.textContent = item.role ? ', ' + item.role : '';
    rdCount.textContent = (rdIndex + 1) + ' of ' + total;
    rdLive.textContent = item.name + ', ' + (rdIndex + 1) + ' of ' + total;
    rdBody.className = 'rd-body ' + (rdSet === 's' ? 'is-shot' : (item.src ? 'is-img' : 'is-text'));
    rdBody.style.width = rdSet === 's' ? 'min(100%, 640px, calc((100vh - 190px) * ' + (item.width / item.height).toFixed(4) + '))' : '';
    rdBody.innerHTML = '';
    if (item.src) {
      var img = document.createElement('img');
      img.className = 'rd-img'; img.alt = item.alt || ''; img.width = item.width; img.height = item.height;
      img.loading = 'lazy'; img.decoding = 'async'; img.src = item.src;
      rdBody.appendChild(img);
    }
    if (rdSet === 'r') {
      var source = document.querySelector('#' + item.id + ' .review-txt');
      if (source) { var copy = document.createElement('div'); copy.className = 'rd-txt'; copy.innerHTML = source.innerHTML; rdBody.appendChild(copy); }
      if (item.video || item.link) {
        var row = document.createElement('div'); row.className = 'rd-links';
        if (item.video) {
          var watch = document.createElement('button');
          watch.type = 'button'; watch.className = 'linkbtn'; watch.innerHTML = PLAY + 'Watch ' + item.first + '\u2019s video';
          watch.addEventListener('click', function () { var back = rdBack; closeReader(false); openVideo(item.video, back); });
          row.appendChild(watch);
        }
        if (item.link) {
          var link = document.createElement('a');
          link.href = item.link; link.target = '_blank'; link.rel = 'noopener'; link.textContent = 'View on Testimonial.to';
          row.appendChild(link);
        }
        rdBody.appendChild(row);
      }
    }
    rdEl.scrollTop = 0;
    if (!(rdSet === 'r' && narrow.matches)) {   // fetch the neighbors' images ahead of a swipe
      [-1, 1].forEach(function (step) {
        var neighbor = list[(rdIndex + step + total) % total];
        if (neighbor.src) { var preload = new Image(); preload.src = neighbor.src; }
      });
    }
  }
  function openReader(set, index) {
    rdBack = document.activeElement; rdSet = set; rdIndex = index;
    renderReader();
    rdEl.hidden = false; document.body.classList.add('modal-open'); setInert(rdEl, true);
    rdEl.focus();
  }
  function closeReader(restore) {
    rdEl.hidden = true; rdBody.innerHTML = ''; document.body.classList.remove('modal-open'); setInert(rdEl, false);
    if (restore !== false && rdBack && rdBack.focus) { rdBack.focus(); }
  }
  function stepReader(step) { var total = readerSets[rdSet].length; rdIndex = (rdIndex + step + total) % total; renderReader(); }
  if (rdEl && readsEl) {
    // a list that can't be read leaves the cards as they are, and the rest of the page keeps working
    try { readerSets = JSON.parse(readsEl.textContent); }
    catch (err) { if (window.console) { console.warn('wall: the reader list could not be read', err); } }
  }
  if (readerSets) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-read]'), function (el) {
      el.addEventListener('click', function () { var parts = el.getAttribute('data-read').split(':'); openReader(parts[0], +parts[1]); });
    });
    document.getElementById('rd-close').addEventListener('click', function () { closeReader(); });
    document.getElementById('rd-prev').addEventListener('click', function () { stepReader(-1); });
    document.getElementById('rd-next').addEventListener('click', function () { stepReader(1); });
    rdEl.addEventListener('click', function (ev) { if (ev.target === rdEl) { closeReader(); } });
    var touchX = null, touchY = 0;   // a sideways swipe moves to the next or previous testimonial
    rdEl.addEventListener('touchstart', function (ev) {
      if (ev.touches.length === 1) { touchX = ev.touches[0].clientX; touchY = ev.touches[0].clientY; } else { touchX = null; }
    }, { passive: true });
    rdEl.addEventListener('touchend', function (ev) {
      if (touchX === null) { return; }
      var touch = ev.changedTouches[0], deltaX = touch.clientX - touchX, deltaY = touch.clientY - touchY; touchX = null;
      if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > 1.6 * Math.abs(deltaY)) { stepReader(deltaX < 0 ? 1 : -1); }
    }, { passive: true });
  }

  document.addEventListener('keydown', function (ev) {
    if (rdEl && !rdEl.hidden) {
      if (ev.key === 'Escape') { closeReader(); }
      else if (ev.key === 'ArrowRight') { ev.preventDefault(); stepReader(1); }
      else if (ev.key === 'ArrowLeft') { ev.preventDefault(); stepReader(-1); }
      else if (ev.key === 'Tab') { trapFocus(rdEl, ev); }
      return;
    }
    if (ev.key === 'Escape') {
      if (modal && !modal.hidden) { closeVideo(); } else if (menu && !menu.hidden) { setMenu(false); }
    }
  });
})();
