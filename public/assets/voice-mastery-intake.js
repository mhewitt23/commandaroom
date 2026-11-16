(function () {
  // The Voice Mastery welcome page (commandaroom.com/voice-mastery/welcome/), where course buyers land after paying.
  // It writes to the same sheet as the apply form, through the same endpoint and column names,
  // and says in "Anything Else" that the row is a Voice Mastery course intake.
  var form = document.getElementById('intakeForm');
  if (!form) { return; }
  var btn = document.getElementById('submitBtn');
  var errorNote = document.getElementById('intake-error');
  var thanks = document.getElementById('intake-thanks');
  var intro = document.getElementById('intake-intro');
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzFB4edJ8df3vKHBtAVvokloESL45n5IW4XFk5mVZJmKJYFSOfxy5zpn4DdtMhxTxpMpw/exec';
  var COURSE_MARK = 'Voice Mastery course intake';
  function fieldValue(name) { var el = form.querySelector('[name="' + name + '"]'); return el ? el.value.trim() : ''; }
  function checkedValue(name) { var el = form.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : ''; }
  function checkedValues(name) { return Array.prototype.map.call(form.querySelectorAll('input[name="' + name + '"]:checked'), function (box) { return box.value; }); }
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    errorNote.hidden = true;
    btn.disabled = true; btn.textContent = 'Sending...';
    var foundOn = checkedValue('found_on');
    // The sheet has the apply form's columns, so each answer goes in the nearest one:
    // their handle under LinkedIn, what they want to learn under Challenge, the ticked frustrations
    // under Resonates, and what they have tried under Coach History.
    var data = {
      name: fieldValue('name'), email: fieldValue('email'), phone: fieldValue('phone'),
      role: '',
      linkedin: fieldValue('handle'), location: '',
      challenge: fieldValue('learn'),
      resonates: checkedValues('frustrations').join(', '),
      event: '', impact: '',
      coach_history: fieldValue('tried'),
      availability: '', investment: '',
      anything_else: COURSE_MARK + (foundOn ? ' (found me on ' + foundOn + ')' : ''),
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
        if (window.console) { console.warn('intake: the form did not reach the sheet', err); }
        btn.disabled = false; btn.textContent = 'Send'; errorNote.hidden = false;
      });
  });
})();
