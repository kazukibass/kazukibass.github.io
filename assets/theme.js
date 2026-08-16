/* ============================================================
   theme.js — ライト/ダーク切替（全ページ共通）

   1. 初回は OS の設定に従う
   2. ヘッダー右上のボタンで手動切替
   3. 選んだ結果は localStorage に保存され次回以降そちらが優先
   4. 手動で選ぶまでは OS 側の変更にリアルタイムで追従

   ちらつき防止のため、各ページの <head> 内で読み込むこと。
   ============================================================ */
(function () {
  var KEY = 'kb-theme';
  var mem = null; // localStorage が使えない環境用のフォールバック

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return mem; } }
  function set(v) { mem = v; try { localStorage.setItem(KEY, v); } catch (e) {} }
  function apply(v) { document.documentElement.setAttribute('data-theme', v); }

  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  apply(get() || (mq && mq.matches ? 'dark' : 'light'));

  if (mq && mq.addEventListener) {
    mq.addEventListener('change', function (e) {
      if (!get()) apply(e.matches ? 'dark' : 'light');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('tgl');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      set(next);
    });
  });
})();
