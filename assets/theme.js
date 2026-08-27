/* ============================================================
   theme.js — ライト/ダーク切替（全ページ共通）

   1. 初回はダークテーマで表示
   2. ヘッダー右上のボタンで手動切替
   3. 選んだ結果は localStorage に保存され次回以降そちらが優先

   ちらつき防止のため、各ページの <head> 内で読み込むこと。
   ============================================================ */
(function () {
  var KEY = 'kb-theme';
  var mem = null; // localStorage が使えない環境用のフォールバック

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return mem; } }
  function set(v) { mem = v; try { localStorage.setItem(KEY, v); } catch (e) {} }
  function apply(v) { document.documentElement.setAttribute('data-theme', v); }

  apply(get() || 'dark');

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('tgl');
    if (btn) {
      btn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        apply(next);
        set(next);
      });
    }

    // Tsukutta 掲載バッジ（トップページの対象ツールカードに表示）
    var tsukuttaApps = {
      'Kanpe': 'a63f67db-e15a-417f-a71e-6644a38fd56f',
      'FlowDraft': '0a706b3f-b70b-483e-abbc-791432c65d8e'
    };

    document.querySelectorAll('#tools .card').forEach(function (card) {
      var title = card.querySelector('h3');
      if (!title || !tsukuttaApps[title.textContent.trim()]) return;

      var id = tsukuttaApps[title.textContent.trim()];
      var actions = card.querySelector('.card-act');
      if (!actions) return;

      var badgeWrap = document.createElement('div');
      badgeWrap.style.marginTop = '14px';

      var link = document.createElement('a');
      link.href = 'https://tsukutta.app/apps/' + id;
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('aria-label', title.textContent.trim() + ' のTsukutta掲載ページ');

      var img = document.createElement('img');
      img.src = 'https://tsukutta.app/api/badge/' + id + '?lang=ja';
      img.alt = 'Tsukuttaに掲載中';
      img.width = 200;
      img.height = 40;
      img.loading = 'lazy';
      img.style.maxWidth = '100%';
      img.style.height = 'auto';

      link.appendChild(img);
      badgeWrap.appendChild(link);
      actions.insertAdjacentElement('afterend', badgeWrap);
    });
  });
})();
