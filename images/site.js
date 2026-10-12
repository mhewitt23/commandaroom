(function () {
  var header = document.querySelector('header');
  var btn = document.getElementById('menu-btn');
  var menu = document.getElementById('mobile-menu');
  var scrim = document.getElementById('menu-scrim');
  function setMenu(open) {
    menu.hidden = !open; scrim.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    header.classList.toggle('menu-open', open);
  }
  btn.addEventListener('click', function () { setMenu(menu.hidden); });
  scrim.addEventListener('click', function () { setMenu(false); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-close-menu]'), function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  var tabs = document.querySelectorAll('.mtab');
  var panels = document.querySelectorAll('.mpanel');
  function showTab(key) {
    Array.prototype.forEach.call(tabs, function (t) {
      var on = t.getAttribute('data-tab') === key;
      t.classList.toggle('is-on', on); t.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    Array.prototype.forEach.call(panels, function (p) { p.hidden = p.getAttribute('data-panel') !== key; });
  }
  Array.prototype.forEach.call(tabs, function (t) {
    t.addEventListener('click', function () {
      showTab(t.getAttribute('data-tab'));
      if (t.getBoundingClientRect().top < 72) { t.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    });
  });

  var links = document.querySelectorAll('[data-nav]');
  if ('IntersectionObserver' in window) {
    var seen = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen[en.target.id] = en.isIntersecting; });
      var on = '';
      ['method', 'results', 'about'].forEach(function (id) { if (seen[id]) { on = id; } });
      Array.prototype.forEach.call(links, function (a) {
        var hit = a.getAttribute('data-nav') === on;
        a.classList.toggle('is-on', hit);
        if (hit) { a.setAttribute('aria-current', 'location'); } else { a.removeAttribute('aria-current'); }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['method', 'results', 'about'].forEach(function (id) { var el = document.getElementById(id); if (el) { spy.observe(el); } });
  }

  var videos = {"spencer": {"name": "Spencer Applebaum","role": "General Partner and Co-Head of Venture, Multicoin Capital","src": "vimeo.com/1234419726"},"marina": {"name": "Marina","role": "Solutions Architect (Applied AI), Vellum AI","src": "vimeo.com/1234455607"},"raj": {"name": "Raj","role": "COO, Investor, Entrepreneur","src": "youtube.com/watch?v=0ZH5UG2Orns"},"michael": {"name": "Michael","role": "VC-backed CEO and Founder","src": "youtube.com/watch?v=bZ8Ccua4Zow"},"adam": {"name": "Adam","role": "CEO","src": "youtube.com/shorts/pqJYumeCXtk"},"scott": {"name": "Scott","role": "CEO","src": "youtube.com/watch?v=rCVyUGVXSt0"},"scottvoice": {"name": "Scott","role": "CEO (public speaking coaching)","src": "youtube.com/watch?v=RdjPj-9mam0"},"kellen": {"name": "Kellen","role": "Founder, Chief Growth Officer","src": "youtube.com/watch?v=9yFwKjzwC-M"},"andres": {"name": "Andres","role": "Founder","src": "vimeo.com/1234517384"},"riley": {"name": "Riley","role": "Founder","src": "vimeo.com/1231514012"},"jimmy": {"name": "Jimmy","role": "Executive","src": "youtube.com/watch?v=KZNo-HRSkOQ"},"brian": {"name": "Brian","role": "VP of Sales","src": "vimeo.com/1231514017"},"salesleader": {"name": "Sales Leader","role": "","src": "youtube.com/watch?v=5vhKC7Qepic"},"rose": {"name": "Rose","role": "Entrepreneur","src": "vimeo.com/1231514018"},"jonathan": {"name": "Jonathan","role": "Associate General Counsel, Director of Sales","src": "youtube.com/watch?v=E1kEzJ4mrsU"},"bryan": {"name": "Bryan","role": "Insurance Broker","src": "vimeo.com/1234517383"},"eric": {"name": "Eric","role": "DeFi Business Development","src": "vimeo.com/1231514014"},"strategicae": {"name": "Fortune 1000 Strategic AE","role": "","src": "youtube.com/watch?v=oLAwVyTCoDY"},"sakul": {"name": "Sakul","role": "Enterprise AE","src": "vimeo.com/1231514016"},"nelly": {"name": "Nelly","role": "BDR","src": "vimeo.com/1231514013"},"sdr": {"name": "SDR","role": "","src": "youtube.com/shorts/S_n-x5PmyvU"},"mark": {"name": "Mark","role": "Coach","src": "vimeo.com/1231514015"}};
  var modal = document.getElementById('video-modal');
  var player = document.getElementById('video-player');
  var nameEl = document.getElementById('video-name');
  var roleEl = document.getElementById('video-role');
  var closeBtn = document.getElementById('video-close');
  var lastFocus = null;
  function embedUrl(src) {
    var m;
    if ((m = src.match(/vimeo\.com\/(\d+)/))) { return { url: 'https://player.vimeo.com/video/' + m[1] + '?autoplay=1&title=0&byline=0&portrait=0', tall: false }; }
    if ((m = src.match(/youtube\.com\/shorts\/([\w-]+)/))) { return { url: 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0', tall: true }; }
    if ((m = src.match(/[?&]v=([\w-]+)/))) { return { url: 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0', tall: false }; }
    return null;
  }
  function openVideo(key) {
    var v = videos[key]; if (!v) { return; }
    var e = embedUrl(v.src); if (!e) { return; }
    lastFocus = document.activeElement;
    nameEl.textContent = v.name; roleEl.textContent = v.role ? ' · ' + v.role : '';
    modal.setAttribute('aria-label', 'Video: ' + v.name);
    player.classList.toggle('is-tall', e.tall);
    player.innerHTML = '';
    var f = document.createElement('iframe');
    f.src = e.url; f.title = 'Video: ' + v.name;
    f.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
    f.setAttribute('allowfullscreen', '');
    player.appendChild(f);
    modal.hidden = false; document.body.classList.add('modal-open');
    closeBtn.focus();
  }
  function closeVideo() {
    modal.hidden = true; player.innerHTML = ''; document.body.classList.remove('modal-open');
    if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-video]'), function (el) {
    el.addEventListener('click', function () { openVideo(el.getAttribute('data-video')); });
  });
  closeBtn.addEventListener('click', closeVideo);
  modal.addEventListener('click', function (ev) { if (ev.target === modal) { closeVideo(); } });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') { if (!modal.hidden) { closeVideo(); } else if (!menu.hidden) { setMenu(false); } }
  });
})();
