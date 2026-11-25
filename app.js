/* Plain JavaScript. No build step. Slide text: index.html. Usage data: analytics.js. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const slides = [...document.querySelectorAll('section.slide')];
  const docs = window.BRIEFING_CONFIG.docs;
  const stats = window.ANALYTICS;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = Math.max(0, Math.min(slides.length - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));
  let reading = null;
  let manualMode = null;
  let activeDoc = 'letter';
  let usageChart = null;
  let pendingChart = false;

  function syncControls(updateHash = true) {
    $('counter').textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    $('prev').disabled = current === 0;
    $('next').disabled = current === slides.length - 1;
    $('progress').style.width = `${100 * (current + 1) / slides.length}%`;
    if (updateHash) history.replaceState(null, '', `#${current + 1}`);
  }
  function fit() {
    if (!reading) $('canvas').style.transform = `translate(-50%,-50%) scale(${Math.min(innerWidth / 1600, innerHeight / 900)})`;
  }
  function setMode(mode, scroll = true) {
    reading = mode === 'read';
    document.body.className = reading ? 'read' : 'slides';
    $('modeButton').textContent = reading ? 'Slide view' : 'Read view';
    $('modeButton').setAttribute('aria-label', reading ? 'Switch to slide view' : 'Switch to reading view');
    slides.forEach((s, i) => {
      s.inert = !reading && i !== current;
      s.setAttribute('aria-hidden', String(!reading && i !== current));
    });
    fit();
    if (reading && scroll) slides[current].scrollIntoView({block: 'start'});
    if (reading || current === 1) requestAnimationFrame(() => usageChart?.resize());
  }
  function automaticMode(initial = false) {
    const mode = manualMode || (innerWidth < 1200 || innerHeight > innerWidth ? 'read' : 'slides');
    if ((mode === 'read') !== reading) setMode(mode, !initial);
    else fit();
  }
  function go(n, scroll = true) {
    current = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === current);
      s.classList.remove('enter');
      s.inert = !reading && i !== current;
      s.setAttribute('aria-hidden', String(!reading && i !== current));
    });
    if (!reading) {
      void slides[current].offsetWidth;
      slides[current].classList.add('enter');
      if (current === 1) requestAnimationFrame(animateUsage);
    } else if (scroll) {
      slides[current].scrollIntoView({behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start'});
    }
    syncControls();
  }
  function closeAll() { document.querySelectorAll('dialog[open]').forEach(d => d.close()); }
  function download(key) {
    const a = document.createElement('a');
    a.href = docs[key].url; a.download = docs[key].filename;
    document.body.append(a); a.click(); a.remove();
  }
  function viewDoc(key) {
    activeDoc = key; closeAll();
    $('docTitle').textContent = docs[key].title;
    $('docPages').replaceChildren();
    docs[key].previews.forEach((src, i) => {
      const image = new Image(); image.src = src;
      image.alt = `${docs[key].title}, original page ${i + 1}`;
      image.loading = i ? 'lazy' : 'eager';
      $('docPages').append(image);
    });
    $('viewer').showModal(); $('viewer').scrollTop = 0;
  }
  document.querySelectorAll('[data-doc]').forEach(b => b.onclick = () => viewDoc(b.dataset.doc));
  document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => b.closest('dialog').close());
  document.querySelectorAll('dialog').forEach(d => d.addEventListener('click', e => {
    const r = d.getBoundingClientRect();
    if (e.target === d && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) d.close();
  }));
  $('contentsButton').onclick = () => $('contents').showModal();
  $('documentsButton').onclick = () => $('documents').showModal();
  slides.forEach((s, i) => {
    const b = document.createElement('button'), number = document.createElement('span');
    b.className = 'toc-btn'; number.textContent = String(i + 1).padStart(2, '0');
    b.append(number, document.createTextNode(s.dataset.title));
    b.onclick = () => {closeAll(); go(i);}; $('contentsList').append(b);
  });
  $('prev').onclick = () => go(current - 1);
  $('next').onclick = () => go(current + 1);
  $('modeButton').onclick = () => {manualMode = reading ? 'slides' : 'read'; setMode(manualMode); if (current === 1) requestAnimationFrame(animateUsage);};
  $('downloadDoc').onclick = () => download(activeDoc);
  $('openDoc').onclick = () => {const a = document.createElement('a'); a.href = docs[activeDoc].url; a.target = '_blank'; a.rel = 'noopener'; document.body.append(a); a.click(); a.remove();};
  $('pdfButton').onclick = $('briefDownload').onclick = () => download('brief');

  // Chart.js is optional. An included, generated PNG is the no-network / print fallback.
  const rows = stats.weeklyAverages;
  const valid = Array.isArray(rows) && rows.length && rows.every(r => typeof r.average === 'number' && Number.isFinite(r.average) && r.average >= 0);
  if (valid) {
    const last = rows[rows.length - 1];
    $('latestAverage').textContent = new Intl.NumberFormat('en-US', {maximumFractionDigits: 1}).format(last.average);
    $('latestDates').textContent = last.fullDates;
    document.querySelector('.metric-label').textContent = stats.latestLabel;
    $('usageNote').textContent = `${stats.periodLabel} · ${stats.method}`;
    //document.querySelector('.chart-source').textContent = `Source: ${stats.source}${stats.isCurrent ? '' : ' · Not a current live metric'}`;
    $('usageChart').setAttribute('aria-label', 'Average daily users by week: ' + rows.map(r => `${r.label}, ${r.dates}: ${r.average}`).join('; '));
  }
  function animateUsage() {
    if (!valid) return;
    const ring = document.querySelector('.metric-ring');
    ring.classList.remove('draw'); void ring.offsetWidth; ring.classList.add('draw');
    if (!window.Chart) return; // static fallback already visible
    if (pendingChart) return;
    pendingChart = true;
    requestAnimationFrame(() => {
      try {
        if (usageChart) {usageChart.resize(); usageChart.reset(); usageChart.update();}
        else {
          $('usageChart').style.display = 'block';
          $('chartFallback').style.display = 'none';
          const labelsPlugin = {
            id: 'directValues',
            afterDatasetsDraw(chart) {
              const {ctx} = chart;
              ctx.save(); ctx.font = '600 14px Arial'; ctx.fillStyle = '#1E2433'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
              chart.getDatasetMeta(0).data.forEach((bar, i) => ctx.fillText(rows[i].average, bar.x, bar.y - 7));
              ctx.restore();
            }
          };
          usageChart = new Chart($('usageChart'), {
            type: 'bar',
            data: {labels: rows.map(r => [r.label, r.dates]), datasets: [{data: rows.map(r => r.average), backgroundColor: '#1751D0', borderWidth: 0, barPercentage: .58, categoryPercentage: .85}]},
            plugins: [labelsPlugin],
            options: {
              responsive: true, maintainAspectRatio: false,
              animation: reducedMotion.matches ? false : {duration: 1050, easing: 'easeOutQuart'},
              layout: {padding: {top: 25, right: 9}},
              plugins: {legend: {display: false}, tooltip: {enabled: true, callbacks: {label: c => `${c.raw} average daily users`}}},
              scales: {
                x: {grid: {display: false}, border: {color: '#CDD3E0'}, ticks: {color: '#505A74', font: {size: 11}, maxRotation: 0, autoSkip: false}},
                y: {beginAtZero: true, suggestedMax: Math.ceil(Math.max(...rows.map(r => r.average)) * 1.15 / 50) * 50, border: {display: false}, grid: {color: '#E2E6F0'}, ticks: {color: '#505A74', count: 4, font: {size: 10}}}
              }
            }
          });
        }
      } catch (error) {
        $('usageChart').style.display = 'none'; $('chartFallback').style.display = 'block';
        console.warn('Animated chart unavailable; showing the included static chart.', error);
      } finally {pendingChart = false;}
    });
  }
  document.addEventListener('keydown', e => {
    if (document.querySelector('dialog[open]') || reading || e.altKey || e.metaKey || e.ctrlKey || e.target.closest('button,a,input,textarea')) return;
    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {e.preventDefault(); go(current + 1);}
    if (['ArrowLeft', 'PageUp'].includes(e.key)) {e.preventDefault(); go(current - 1);}
    if (e.key === 'Home') {e.preventDefault(); go(0);}
    if (e.key === 'End') {e.preventDefault(); go(slides.length - 1);}
  });
  let tx = 0, ty = 0;
  $('canvas').addEventListener('touchstart', e => {tx = e.changedTouches[0].clientX; ty = e.changedTouches[0].clientY;}, {passive: true});
  $('canvas').addEventListener('touchend', e => {
    if (reading || document.querySelector('dialog[open]') || e.target.closest('button,a')) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 65 && Math.abs(dy) < 50) go(current + (dx < 0 ? 1 : -1));
  }, {passive: true});
  let scrollPending = false;
  addEventListener('scroll', () => {
    if (!reading || scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => {
      const point = innerHeight * .3;
      let best = 0, distance = Infinity;
      slides.forEach((s, i) => {const r = s.getBoundingClientRect(); const d = r.top <= point && r.bottom > point ? 0 : Math.min(Math.abs(r.top - point), Math.abs(r.bottom - point)); if (d < distance) {distance = d; best = i;}});
      if (best !== current) {current = best; syncControls();}
      scrollPending = false;
    });
  }, {passive: true});
  const observer = new IntersectionObserver(entries => {
    if (reading && entries.some(e => e.isIntersecting)) animateUsage();
  }, {threshold: .12});
  observer.observe($('s2'));
  addEventListener('resize', () => automaticMode());
  automaticMode(true); go(current, false);
  if (reading && current) requestAnimationFrame(() => slides[current].scrollIntoView({block: 'start'}));
})();
