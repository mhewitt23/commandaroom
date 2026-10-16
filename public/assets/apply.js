(function () {
  var form = document.getElementById('applicationForm');
  var btn = document.getElementById('submitBtn');
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzFB4edJ8df3vKHBtAVvokloESL45n5IW4XFk5mVZJmKJYFSOfxy5zpn4DdtMhxTxpMpw/exec';
  var NEXT = 'https://calendly.com/commandaroom/intro';
  function fieldValue(name) { var el = form.querySelector('[name="' + name + '"]'); return el ? el.value : ''; }
  function checkedValue(name) { var el = form.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : ''; }
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    btn.disabled = true; btn.textContent = 'Submitting...';
    var data = {
      name: fieldValue('name'), email: fieldValue('email'), phone: fieldValue('phone'), role: fieldValue('role'),
      linkedin: fieldValue('linkedin'), location: fieldValue('location'),
      challenge: fieldValue('challenge'),
      resonates: Array.prototype.map.call(form.querySelectorAll('input[name="resonates"]:checked'), function (box) { return box.value; }).join(', '),
      event: fieldValue('event'), impact: fieldValue('impact'),
      coach_history: checkedValue('coach_history'), availability: checkedValue('availability'), investment: checkedValue('investment'),
      anything_else: fieldValue('anything_else'),
      submitted_at: new Date().toISOString()
    };
    // The sheet's reply can't be read (no-cors), so success and failure look alike here. Either way the visitor
    // goes on to pick a time, so a network hiccup never costs a booking; a failure is noted in the console.
    var next = function () { window.location.href = NEXT; };
    fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(next, function (err) { if (window.console) { console.warn('apply: the form did not reach the sheet', err); } next(); });
  });
})();
