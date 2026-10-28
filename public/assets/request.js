(function () {
  // The full-method request (commandaroom.com/method/request/). It writes to the same sheet as the apply form,
  // through the same endpoint and column names, and says in "Anything Else" that it's a method request.
  var form = document.getElementById('requestForm');
  if (!form) { return; }
  var btn = document.getElementById('submitBtn');
  var errorNote = document.getElementById('request-error');
  var thanks = document.getElementById('request-thanks');
  var intro = document.getElementById('request-intro');
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzFB4edJ8df3vKHBtAVvokloESL45n5IW4XFk5mVZJmKJYFSOfxy5zpn4DdtMhxTxpMpw/exec';
  var boxes = form.querySelectorAll('input[name="problems"]');
  function fieldValue(name) { var el = form.querySelector('[name="' + name + '"]'); return el ? el.value.trim() : ''; }
  function checkedValue(name) { var el = form.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : ''; }
  function checkedValues(name) { return Array.prototype.map.call(form.querySelectorAll('input[name="' + name + '"]:checked'), function (box) { return box.value; }); }
  function requireAProblem() {   // at least one box, said once on the first box so the browser shows it there
    boxes[0].setCustomValidity(checkedValues('problems').length ? '' : 'Pick at least one.');
  }
  Array.prototype.forEach.call(boxes, function (box) { box.addEventListener('change', requireAProblem); });
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    requireAProblem();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    errorNote.hidden = true;
    btn.disabled = true; btn.textContent = 'Sending...';
    var title = fieldValue('title'), organization = fieldValue('organization');
    var data = {
      name: fieldValue('name'), email: fieldValue('email'), phone: fieldValue('phone'),
      role: [title, organization].filter(Boolean).join(', '),
      linkedin: '', location: '',
      challenge: fieldValue('in_your_words'),
      resonates: checkedValues('problems').join(', '),
      event: '', impact: fieldValue('outcome'), coach_history: '',
      availability: checkedValue('timeline'),
      investment: 'Budget: ' + checkedValue('budget'),
      anything_else: 'Method request (asked for the full method and the research)',
      submitted_at: new Date().toISOString()
    };
    // The sheet's reply can't be read (no-cors). A request that leaves the browser counts as sent;
    // only a network failure shows the email fallback.
    fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(function () {
        var first = data.name.split(/\s+/)[0];
        document.getElementById('thanks-name').textContent = first ? ', ' + first : '';
        form.hidden = true; intro.hidden = true; thanks.hidden = false; thanks.focus();
      }, function (err) {
        if (window.console) { console.warn('request: the form did not reach the sheet', err); }
        btn.disabled = false; btn.textContent = 'Request the full method'; errorNote.hidden = false;
      });
  });
})();
