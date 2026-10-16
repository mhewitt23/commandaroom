(function () {
  var form = document.getElementById('applicationForm');
  var btn = document.getElementById('submitBtn');
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzFB4edJ8df3vKHBtAVvokloESL45n5IW4XFk5mVZJmKJYFSOfxy5zpn4DdtMhxTxpMpw/exec';
  var NEXT = 'https://calendly.com/commandaroom/intro';
  function val(name) { var el = form.querySelector('[name="' + name + '"]'); return el ? el.value : ''; }
  function picked(name) { var el = form.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : ''; }
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    btn.disabled = true; btn.textContent = 'Submitting...';
    var data = {
      name: val('name'), email: val('email'), phone: val('phone'), role: val('role'), linkedin: val('linkedin'), location: val('location'),
      challenge: val('challenge'),
      resonates: Array.prototype.map.call(form.querySelectorAll('input[name="resonates"]:checked'), function (box) { return box.value; }).join(', '),
      event: val('event'), impact: val('impact'),
      coach_history: picked('coach_history'), availability: picked('availability'), investment: picked('investment'),
      anything_else: val('anything_else'),
      submitted_at: new Date().toISOString()
    };
    // The sheet's reply can't be read (no-cors), so success and failure look alike here. Either way the visitor
    // goes on to pick a time, so a network hiccup never costs a booking; a failure is noted in the console.
    var next = function () { window.location.href = NEXT; };
    fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(next, function (err) { if (window.console) { console.warn('apply: the form did not reach the sheet', err); } next(); });
  });
})();
