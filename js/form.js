/* SMAPS demo-request form.
   Required name/email/school (role optional), inline validation, then delivery to
   hdlcruz03@gmail.com via FormSubmit.co (AJAX). Success panel + reset preserved.
   NOTE (one-time): FormSubmit emails an activation link to that inbox on the FIRST
   submission — click Activate once, then all future submissions are delivered. */
(function () {
  var ENDPOINT = 'https://formsubmit.co/ajax/hdlcruz03@gmail.com';
  var ROLE_LABELS = {
    admin: 'School administrator / Principal',
    registrar: 'Registrar',
    finance: 'Finance / Accounting',
    it: 'IT / Operations',
    teacher: 'Teacher'
  };

  var form        = document.getElementById('demo-form');
  var errorEl     = document.getElementById('form-error');
  var successEl   = document.getElementById('demo-success');
  var successName = document.getElementById('success-name');
  var nameEl      = document.getElementById('f-name');
  var emailEl     = document.getElementById('f-email');
  var schoolEl    = document.getElementById('f-school');
  var addressEl   = document.getElementById('f-address');
  var roleEl      = document.getElementById('f-role');
  var honeyEl     = document.getElementById('f-honey');
  var submitBtn   = document.getElementById('demo-submit');
  var resetLink   = document.getElementById('demo-reset');

  if (!form || !submitBtn) { return; }

  function clearError() { errorEl.textContent = ''; errorEl.hidden = true; }
  function showError(msg) { errorEl.textContent = msg; errorEl.hidden = false; }
  function showSuccess(name) {
    successName.textContent = name.split(' ')[0] || 'there';
    clearError();
    form.hidden = true;
    successEl.hidden = false;
  }

  [nameEl, emailEl, schoolEl, addressEl, roleEl].forEach(function (el) {
    el.addEventListener('input', clearError);
    el.addEventListener('change', clearError);
  });

  submitBtn.addEventListener('click', function () {
    var name   = nameEl.value.trim();
    var email  = emailEl.value.trim();
    var school  = schoolEl.value.trim();
    var address = addressEl.value.trim();
    var role    = roleEl.value;

    if (!name || !email || !school) {
      showError('Please fill in your name, email, and school name.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showError('Please enter a valid email address.');
      return;
    }
    // honeypot: a real person leaves this empty. If filled, treat as spam (no send).
    if (honeyEl && honeyEl.value) { showSuccess(name); return; }

    clearError();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: name,
        email: email,
        school: school,
        address: address || 'Not specified',
        role: ROLE_LABELS[role] || 'Not specified',
        _subject: 'SMAPS demo request — ' + school,
        _template: 'table',
        _captcha: 'false'
      })
    }).then(function (res) {
      if (!res.ok) { throw new Error('HTTP ' + res.status); }
      return res.json();
    }).then(function () {
      showSuccess(name);
    }).catch(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Request a demo';
      showError('Something went wrong sending your request. Please try again.');
    });
  });

  resetLink.addEventListener('click', function () {
    nameEl.value = '';
    emailEl.value = '';
    schoolEl.value = '';
    addressEl.value = '';
    roleEl.value = '';
    if (honeyEl) honeyEl.value = '';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Request a demo';
    clearError();
    successEl.hidden = true;
    form.hidden = false;
  });
})();
