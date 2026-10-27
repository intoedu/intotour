(function () {
  'use strict';

  var CFG = window.SITE_CONFIG || {};
  var EN = window.I18N_EN || {};
  var KO_MSG = window.I18N_KO_MSG || {};
  var LANG_KEY = 'intotour.lang';
  var lang = 'ko';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function t(key) { return lang === 'en' ? (EN[key] || KO_MSG[key] || key) : (KO_MSG[key] || key); }
  function storeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function storeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 무시 */ } }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- 다국어 ---------- */
  // 한국어 원문은 HTML에서 한 번 읽어 보관해 두고, 영어는 I18N_EN에서 가져옵니다.
  $$('[data-i18n]').forEach(function (el) { el.dataset.ko = el.innerHTML; });
  $$('[data-i18n-ph]').forEach(function (el) { el.dataset.koPh = el.getAttribute('placeholder') || ''; });

  function applyLang(next) {
    lang = next === 'en' ? 'en' : 'ko';
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(function (el) {
      var key = el.dataset.i18n;
      el.innerHTML = lang === 'en' && EN[key] ? EN[key] : el.dataset.ko;
    });
    $$('[data-i18n-ph]').forEach(function (el) {
      var key = el.dataset.i18nPh;
      el.setAttribute('placeholder', lang === 'en' && EN[key] ? EN[key] : el.dataset.koPh);
    });
    $$('.lang-toggle button').forEach(function (b) { b.classList.toggle('on', b.dataset.lang === lang); });
    document.title = lang === 'en' ? 'INTO TOUR | Your Travel Partner' : 'INTO TOUR | 인투여행사';
    storeSet(LANG_KEY, lang);
    renderNews();
  }

  $$('.lang-toggle button').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.dataset.lang); });
  });

  /* ---------- 내비게이션 ---------- */
  var nav = $('#nav');
  var toggle = $('#navToggle');
  var toTop = $('#toTop');

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('#navLinks a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // 현재 보고 있는 섹션 메뉴 강조
  var navMap = {};
  $$('#navLinks a').forEach(function (a) { navMap[a.getAttribute('href').slice(1)] = a; });
  var activeMap = { greeting: 'about', destinations: 'about', why: 'services', process: 'services' };

  /* ---------- 스크롤 등장 효과 ---------- */
  if ('IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealer.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    $$('.fade-up').forEach(function (el) { revealer.observe(el); });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = activeMap[e.target.id] || e.target.id;
        $$('#navLinks a').forEach(function (a) { a.classList.remove('active'); });
        if (navMap[id]) navMap[id].classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('section[id]').forEach(function (s) { spy.observe(s); });
  } else {
    $$('.fade-up').forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- 모달 ---------- */
  var lastFocus = null;
  function openModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    lastFocus = document.activeElement;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
    var c = $('[data-close]', m);
    if (c) c.focus();
  }
  function closeModal(m) {
    m.classList.remove('open');
    if (!$('.modal.open')) document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-open]');
    if (opener) { e.preventDefault(); openModal(opener.dataset.open); return; }
    var modal = e.target.closest('.modal');
    if (modal && (e.target === modal || e.target.closest('[data-close]'))) closeModal(modal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { var m = $('.modal.open'); if (m) closeModal(m); }
  });

  /* ---------- 공지·소식 (data/notices.json) ---------- */
  var PAGE = 5;
  var notices = null;
  var newsError = false;
  var newsCat = 'all';
  var newsShown = PAGE;
  var newsList = $('#newsList');
  var newsMore = $('#newsMore');

  function pick(v) { return v && typeof v === 'object' ? (v[lang] || v.ko || '') : (v || ''); }
  function catLabel(c) { return t(c === 'news' ? 'cat.news' : 'cat.notice'); }

  function renderNews() {
    if (newsError) { newsList.innerHTML = '<div class="news-empty">' + t('news.error') + '</div>'; return; }
    if (!notices) return;
    var items = notices.filter(function (n) { return newsCat === 'all' || n.category === newsCat; });
    if (!items.length) {
      newsList.innerHTML = '<div class="news-empty">' + t('news.empty') + '</div>';
      newsMore.hidden = true;
      return;
    }
    newsList.innerHTML = items.slice(0, newsShown).map(function (n) {
      return '<button type="button" class="news-item' + (n.pinned ? ' pinned' : '') + '" data-id="' + escapeHtml(n.id) + '">' +
        '<span class="news-cat' + (n.category === 'news' ? ' cat-news' : '') + '">' + (n.pinned ? '📌 ' : '') + catLabel(n.category) + '</span>' +
        '<span class="news-title">' + escapeHtml(pick(n.title)) + '</span>' +
        '<span class="news-date">' + escapeHtml(n.date) + '</span></button>';
    }).join('');
    newsMore.hidden = items.length <= newsShown;
  }

  function openNews(id) {
    var n = (notices || []).filter(function (x) { return String(x.id) === String(id); })[0];
    if (!n) return;
    var cat = $('#newsModalCat');
    cat.textContent = catLabel(n.category);
    cat.className = 'news-cat' + (n.category === 'news' ? ' cat-news' : '');
    $('#newsModalDate').textContent = n.date;
    $('#newsModalTitle').textContent = pick(n.title);
    $('#newsModalBody').innerHTML = pick(n.body).split(/\n{2,}/).map(function (p) {
      return '<p>' + escapeHtml(p).replace(/\n/g, '<br>') + '</p>';
    }).join('');
    openModal('newsModal');
  }

  newsList.addEventListener('click', function (e) {
    var item = e.target.closest('.news-item');
    if (item) openNews(item.dataset.id);
  });
  $$('#newsFilter button').forEach(function (b) {
    b.addEventListener('click', function () {
      newsCat = b.dataset.cat;
      newsShown = PAGE;
      $$('#newsFilter button').forEach(function (x) { x.classList.toggle('on', x === b); });
      renderNews();
    });
  });
  $('button', newsMore).addEventListener('click', function () { newsShown += PAGE; renderNews(); });

  fetch('data/notices.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      notices = data.slice().sort(function (a, b) {
        if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
        return String(b.date).localeCompare(String(a.date)) || (b.id - a.id);
      });
      renderNews();
    })
    .catch(function () { newsError = true; renderNews(); });

  /* ---------- 신청·문의 양식 ---------- */
  var FIELD_LABELS = {
    name: '성함', phone: '연락처', email: '이메일', organization: '단체·회사명', tripType: '여행 유형',
    destination: '희망 여행지', departure: '출발 희망일', duration: '여행 기간', people: '예상 인원',
    budget: '1인 예산', message: '내용'
  };

  function showMsg(form, type, text) {
    var box = $('.form-msg', form);
    box.className = 'form-msg ' + type;
    box.textContent = text;
  }

  function collect(form) {
    var data = {};
    $$('input, select, textarea', form).forEach(function (el) {
      if (!el.name || el.name === 'agree' || el.name === '_hp') return;
      data[el.name] = el.value.trim();
    });
    return data;
  }

  // 받는 메일함에서 인투여행사 접수 건을 구분할 수 있도록 제목·본문에 출처를 표시합니다.
  var SOURCE = CFG.formSource || '인투여행사 홈페이지';
  function mailSubject(kind, data) {
    return '[' + SOURCE + '] ' + (kind === 'booking' ? '여행 신청' : '문의') +
      ' - ' + (data.name || '') + (data.tripType ? ' / ' + data.tripType : '');
  }

  var FORM_TO = CFG.formTo || CFG.email || '';

  function mailIntro(kind) {
    return '■ 인투여행사(INTO TOUR) 홈페이지에서 접수된 ' + (kind === 'booking' ? '여행 신청' : '문의') + '입니다.';
  }

  // 자동 발송이 안 될 때의 예비 경로: 방문자의 메일 앱으로 같은 내용을 보냅니다.
  function sendMail(kind, data) {
    var lines = Object.keys(data).filter(function (k) { return data[k]; }).map(function (k) {
      return (FIELD_LABELS[k] || k) + ': ' + data[k];
    });
    var body = mailIntro(kind) + '\n\n' + lines.join('\n') +
      '\n\n— 보낸 곳: ' + SOURCE + ' (' + location.origin + location.pathname + ')';
    window.location.href = 'mailto:' + FORM_TO + '?' + (CFG.formCc ? 'cc=' + encodeURIComponent(CFG.formCc) + '&' : '') +
      'subject=' + encodeURIComponent(mailSubject(kind, data)) + '&body=' + encodeURIComponent(body);
  }

  $$('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var kind = form.dataset.form;
      if ($('[name="_hp"]', form).value) return; // 스팸 봇

      var missing = $$('[required]', form).filter(function (el) {
        return el.type === 'checkbox' ? false : !el.value.trim();
      });
      if (missing.length) { showMsg(form, 'err', t('msg.required')); missing[0].focus(); return; }
      if (!$('[name="agree"]', form).checked) { showMsg(form, 'err', t('msg.agree')); return; }

      var data = collect(form);
      if (!CFG.formEndpoint) {
        sendMail(kind, data);
        showMsg(form, 'ok', t('msg.mailto'));
        return;
      }

      var btn = $('button[type="submit"]', form);
      var label = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = t('msg.sending');

      // FormSubmit(formsubmit.co) 형식: _로 시작하는 항목은 메일 설정, 나머지는 표로 정리되어 도착합니다.
      var payload = new FormData();
      payload.append('_subject', mailSubject(kind, data));
      payload.append('_template', 'table');
      payload.append('_captcha', 'false');
      if (CFG.formCc) payload.append('_cc', CFG.formCc);
      if (data.email) payload.append('_replyto', data.email);
      payload.append('접수처', SOURCE);
      payload.append('안내', mailIntro(kind));
      Object.keys(data).forEach(function (k) { if (data[k]) payload.append(FIELD_LABELS[k] || k, data[k]); });

      fetch(CFG.formEndpoint, { method: 'POST', body: payload, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          return r.json();
        })
        .then(function (res) {
          if (res && (res.success === false || res.success === 'false')) throw new Error(res.message || 'not sent');
          form.reset();
          showMsg(form, 'ok', t('msg.ok'));
        })
        .catch(function () {
          // 전송 실패 시 접수가 사라지지 않도록 메일 앱으로 이어서 보냅니다.
          sendMail(kind, data);
          showMsg(form, 'err', t('msg.failMailto'));
        })
        .then(function () { btn.disabled = false; btn.innerHTML = label; });
    });
  });

  /* ---------- 설정값 반영 (사업자 정보 · SNS) ---------- */
  $$('[data-cfg]').forEach(function (el) {
    var v = CFG[el.dataset.cfg];
    if (v) { el.textContent = v; el.hidden = false; }
  });

  var SNS = {
    kakao: '카카오톡 채널', instagram: 'Instagram', blog: '네이버 블로그', youtube: 'YouTube', facebook: 'Facebook'
  };
  var sns = CFG.sns || {};
  $('#snsRow').innerHTML = Object.keys(SNS).filter(function (k) { return sns[k]; }).map(function (k) {
    return '<a href="' + escapeHtml(sns[k]) + '" target="_blank" rel="noopener">' + SNS[k] + ' ↗</a>';
  }).join('');

  // 카카오톡 ID 복사
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.dataset.copy;
      var done = function () {
        btn.textContent = t('msg.copied');
        btn.classList.add('done');
        setTimeout(function () {
          btn.innerHTML = lang === 'en' && EN[btn.dataset.i18n] ? EN[btn.dataset.i18n] : btn.dataset.ko;
          btn.classList.remove('done');
        }, 1600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { window.prompt('ID', text); });
      } else {
        window.prompt('ID', text);
      }
    });
  });

  $('#year').textContent = new Date().getFullYear();

  /* ---------- 시작 ---------- */
  var saved = storeGet(LANG_KEY);
  var initial = /[?&]lang=en\b/.test(location.search) ? 'en' : saved;
  if (initial === 'en') applyLang('en');
})();
