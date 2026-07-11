/* SMAPS demo-request form — vanilla-JS port of the .dc.html DCLogic component.
   Behavior matches the original exactly: required name/email/school (role optional),
   inline validation with the same messages, success panel with first-name greeting,
   and a reset that restores an empty form.
   NOTE: no backend call — see TODO at submit. */
(function () {
  var form        = document.getElementById('demo-form');
  var errorEl     = document.getElementById('form-error');
  var successEl   = document.getElementById('demo-success');
  var successName = document.getElementById('success-name');
  var nameEl      = document.getElementById('f-name');
  var emailEl     = document.getElementById('f-email');
  var schoolEl    = document.getElementById('f-school');
  var roleEl      = document.getElementById('f-role');
  var submitBtn   = document.getElementById('demo-submit');
  var resetLink   = document.getElementById('demo-reset');

  if (!form || !submitBtn) { return; }

  function clearError() {
    errorEl.textContent = '';
    errorEl.hidden = true;
  }
  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }

  // Any edit clears the current error (mirrors the original bind() closure).
  [nameEl, emailEl, schoolEl, roleEl].forEach(function (el) {
    el.addEventListener('input', clearError);
    el.addEventListener('change', clearError);
  });

  submitBtn.addEventListener('click', function () {
    var name   = nameEl.value.trim();
    var email  = emailEl.value.trim();
    var school = schoolEl.value.trim();

    if (!name || !email || !school) {
      showError('Please fill in your name, email, and school name.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    // TODO: wire demo-request backend (POST lead → CRM / email). Out of scope for the design pass.
    successName.textContent = name.split(' ')[0] || 'there';
    clearError();
    form.hidden = true;
    successEl.hidden = false;
  });

  resetLink.addEventListener('click', function () {
    nameEl.value = '';
    emailEl.value = '';
    schoolEl.value = '';
    roleEl.value = '';
    clearError();
    successEl.hidden = true;
    form.hidden = false;
  });
})();
