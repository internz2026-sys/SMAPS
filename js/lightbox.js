// Click any product screenshot (.media-img) to view it full-size in a lightbox.
(function () {
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  var closeBtn = document.getElementById('lightbox-close');
  if (!lb || !lbImg) return;

  function open(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    lb.classList.remove('open');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.media-img').forEach(function (img) {
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    img.setAttribute('aria-label', 'View screenshot: ' + (img.getAttribute('alt') || 'SMAPS screen'));
    img.addEventListener('click', function () { open(img.currentSrc || img.src, img.getAttribute('alt')); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img.currentSrc || img.src, img.getAttribute('alt')); }
    });
  });

  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lb.classList.contains('open')) close();
  });
})();
