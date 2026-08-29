(function () {
  'use strict';

  var script = document.currentScript;
  var cfg = script ? script.dataset : {};
  var params = new URLSearchParams(window.location.search);

  // The portfolio shell is intentionally opt-in. Direct visits keep each
  // tool's standalone interface unchanged.
  if (params.get('from') !== (cfg.entry || 'portfolio')) return;

  var root = document.documentElement;
  var home = cfg.home || 'https://kazukibass.github.io/';
  var placeholder = null;
  var adopted = null;
  var nav = null;
  var sheet = null;
  var burger = null;

  root.classList.add('kb-shell-active');
  if (cfg.slim === 'mobile') root.classList.add('kb-shell-slim-mobile');
  if (cfg.mobileHome === 'brand') root.classList.add('kb-shell-mobile-brand');

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function syncTheme() {
    var dark = false;
    if (cfg.themeAttr === 'class') {
      dark = root.classList.contains(cfg.themeDark || 'theme-dark');
    } else if (cfg.themeAttr) {
      dark = root.getAttribute(cfg.themeAttr) === (cfg.themeDark || 'dark');
    } else {
      dark = root.getAttribute('data-theme') === 'dark';
    }
    root.classList.toggle('kb-shell-dark', dark);
  }

  function buildNav() {
    nav = element('header', 'kb-nav');
    nav.id = 'kb-nav';

    var brand = element('a', 'kb-brand');
    brand.href = home;
    brand.setAttribute('aria-label', 'kazukiのランディングページへ戻る');
    brand.appendChild(element('span', 'kb-mark', 'K'));
    brand.appendChild(element('span', 'kb-brand-name', 'kazuki'));
    nav.appendChild(brand);

    nav.appendChild(element('span', 'kb-divider'));
    var crumb = element('span', 'kb-crumb');
    if (cfg.kicker) crumb.appendChild(element('span', 'kb-kicker', cfg.kicker));
    crumb.appendChild(element('span', 'kb-tool-name', cfg.tool || document.title));
    nav.appendChild(crumb);

    var slot = element('div', 'kb-slot');
    slot.id = 'kb-slot';
    nav.appendChild(slot);
    nav.appendChild(element('span', 'kb-spacer'));

    var back = element('a', 'kb-back');
    back.href = home;
    back.setAttribute('aria-label', 'ランディングページへ戻る');
    back.innerHTML = '<span aria-hidden="true">&#8592;</span><b>INDEX</b>';
    nav.appendChild(back);

    return nav;
  }

  function shouldAdopt() {
    var min = Number(cfg.adoptMin || 0);
    return !min || window.matchMedia('(min-width: ' + min + 'px)').matches;
  }

  function restoreAdopted() {
    if (adopted && placeholder && placeholder.parentNode) {
      placeholder.parentNode.insertBefore(adopted, placeholder);
    }
  }

  function syncAdoption() {
    if (!cfg.adopt || !nav) return;
    if (!adopted) {
      adopted = document.querySelector(cfg.adopt);
      if (!adopted) return;
      placeholder = document.createComment('kb-shell-adopt');
      adopted.parentNode.insertBefore(placeholder, adopted);
    }

    if (!shouldAdopt()) {
      restoreAdopted();
      return;
    }

    var target = window.matchMedia('(max-width: 680px)').matches && sheet
      ? sheet
      : document.getElementById('kb-slot');
    if (target && adopted.parentNode !== target) target.appendChild(adopted);
  }

  function closeSheet() {
    if (!sheet || !burger) return;
    sheet.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'ツールメニューを開く');
  }

  function setupSheet() {
    if (!cfg.adopt || cfg.slim === 'mobile') return;
    sheet = element('div', 'kb-sheet');
    sheet.id = 'kb-sheet';
    sheet.hidden = true;

    burger = element('button', 'kb-burger');
    burger.type = 'button';
    burger.setAttribute('aria-controls', 'kb-sheet');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'ツールメニューを開く');
    burger.innerHTML = '<span></span><span></span><span></span>';
    burger.addEventListener('click', function () {
      var opening = sheet.hidden;
      sheet.hidden = !opening;
      burger.setAttribute('aria-expanded', String(opening));
      burger.setAttribute('aria-label', opening ? 'ツールメニューを閉じる' : 'ツールメニューを開く');
      if (opening) syncAdoption();
    });
    nav.insertBefore(burger, nav.querySelector('.kb-back'));
    nav.insertAdjacentElement('afterend', sheet);
  }

  function mount() {
    if (document.getElementById('kb-nav')) return;
    document.body.insertBefore(buildNav(), document.body.firstChild);
    setupSheet();
    syncAdoption();
    syncTheme();

    new MutationObserver(syncTheme).observe(root, { attributes: true });
    window.addEventListener('resize', function () {
      closeSheet();
      syncAdoption();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
