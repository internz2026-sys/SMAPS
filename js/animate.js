// Landing interactivity: scroll reveals, count-up stats, and the paperwork calculator.
// All motion is disabled under prefers-reduced-motion (content + final values still shown).
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- count-up ---------- */
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }
  function countUp(el) {
    var to = parseFloat(el.getAttribute('data-count-to'));
    var pre = el.getAttribute('data-count-prefix') || '';
    var suf = el.getAttribute('data-count-suffix') || '';
    if (isNaN(to)) return;
    if (reduce) { el.textContent = pre + fmt(to) + suf; return; }
    var dur = 1100, start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = pre + fmt(to * eased) + suf;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = pre + fmt(to) + suf;
    }
    requestAnimationFrame(frame);
  }

  /* ---------- reveals + counters ---------- */
  var reveals = document.querySelectorAll('.reveal, .reveal-group');
  var counters = document.querySelectorAll('[data-count-to]');

  if (reduce || !hasIO) {
    reveals.forEach(function (el) { el.classList.add('in'); });
    counters.forEach(countUp);
  } else {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { rio.observe(el); });

    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- paperwork calculator ---------- */
  var teachers = document.getElementById('calc-teachers');
  var students = document.getElementById('calc-students');
  if (teachers && students) {
    var hoursEl = document.getElementById('calc-hours');
    var weeksEl = document.getElementById('calc-weeks');
    var cardsEl = document.getElementById('calc-cards');
    var tVal = document.getElementById('calc-teachers-val');
    var sVal = document.getElementById('calc-students-val');

    function fillTrack(input) {
      var min = +input.min, max = +input.max;
      var pct = ((+input.value - min) / (max - min)) * 100;
      input.style.setProperty('--p', pct);
    }
    function update() {
      var t = +teachers.value, s = +students.value;
      var hours = t * 30 * 4;            // ~30 hrs saved per teacher per quarter × 4 quarters
      var weeks = hours / 40;            // in 40-hour work-weeks
      var cards = Math.round(s * 0.10);  // 8–12% error midpoint, caught before parents see them
      hoursEl.textContent = fmt(hours);
      weeksEl.textContent = weeks.toFixed(1);
      cardsEl.textContent = fmt(cards);
      tVal.textContent = fmt(t);
      sVal.textContent = fmt(s);
      fillTrack(teachers);
      fillTrack(students);
    }
    teachers.addEventListener('input', update);
    students.addEventListener('input', update);
    update();
  }
})();
