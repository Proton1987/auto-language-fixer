(() => {
  // ---------- Thai Kedmanee layout (English key -> Thai output) ----------
  const EN_KEYS =
    "`1234567890-=" + "~!@#$%^&*()_+" +
    "qwertyuiop[]\\" + "QWERTYUIOP{}|" +
    "asdfghjkl;'" + "ASDFGHJKL:\"" +
    "zxcvbnm,./" + "ZXCVBNM<>?";
  const TH_KEYS =
    "_ๅ/-ภถุึคตจขช" + "%+๑๒๓๔ู฿๕๖๗๘๙" +
    "ๆไำพะัีรนยบลฃ" + "๐\"ฎฑธํ๊ณฯญฐ,ฅ" +
    "ฟหกดเ้่าสวง" + "ฤฆฏโฌ็๋ษศซ." +
    "ผปแอิืทมใฝ" + "()ฉฮฺ์?ฒฬฦ";

  const EN_TO_TH = {};
  const TH_TO_EN = {};
  for (let i = 0; i < EN_KEYS.length; i++) {
    EN_TO_TH[EN_KEYS[i]] = TH_KEYS[i];
    TH_TO_EN[TH_KEYS[i]] = EN_KEYS[i];
  }

  const THAI_G = /[\u0E00-\u0E7F]/g;
  const LATIN_G = /[A-Za-z]/g;
  const countMatches = (s, re) => (s.match(re) || []).length;

  // Direction is chosen by the majority script of the whole text; only words
  // written in that source script are converted, others are left untouched.
  // opts.symbols: the user explicitly chose this text (selection / whole field), so
  // letter-less tokens such as ";" (= ว) are converted too. Digit-only tokens never are.
  function convertText(text, opts = {}) {
    const th = countMatches(text, THAI_G);
    const en = countMatches(text, LATIN_G);
    if (!th && !en) {
      if (!opts.symbols) return null;
      let changed = false;
      const out = text.replace(/\S+/g, (w) => {
        if (/^\d+$/.test(w) || !Array.from(w).some((c) => EN_TO_TH[c] !== undefined)) return w;
        changed = true;
        return Array.from(w, (c) => (EN_TO_TH[c] !== undefined ? EN_TO_TH[c] : c)).join('');
      });
      return changed ? { text: out, dir: 'en2th' } : null;
    }
    const toEn = th >= en;

    // Caps Lock left on: "hELLO" -> "Hello" (only when every Latin word fits the pattern)
    if (!toEn && th === 0) {
      const latinWords = text.match(/\S+/g).filter((w) => /[A-Za-z]/.test(w));
      if (latinWords.length && latinWords.every((w) => /^[a-z][A-Z]{3,}$/.test(w))) {
        return {
          text: text.replace(/\S+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),
          dir: 'caps'
        };
      }
    }

    const map = toEn ? TH_TO_EN : EN_TO_TH;
    const srcRe = toEn ? /[\u0E00-\u0E7F]/ : /[A-Za-z]/;
    const out = text.replace(/\S+/g, (w) =>
      srcRe.test(w) ? Array.from(w, (c) => (map[c] !== undefined ? map[c] : c)).join('') : w
    );
    return { text: out, dir: toEn ? 'th2en' : 'en2th' };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { convertText, EN_KEYS, TH_KEYS };
    return;
  }

  // ---------- DOM helpers ----------
  const TEXT_INPUT_TYPES = ['text', 'search', 'url', 'tel', 'password', 'email', ''];

  function deepActive() {
    let el = document.activeElement;
    while (el && el.shadowRoot && el.shadowRoot.activeElement) el = el.shadowRoot.activeElement;
    return el;
  }

  function targetOf(el) {
    if (!el) return null;
    const tag = el.tagName;
    if (tag === 'IFRAME' || tag === 'FRAME') return { kind: 'frame' };
    if (tag === 'TEXTAREA' || tag === 'INPUT') {
      const ok = tag === 'TEXTAREA' || TEXT_INPUT_TYPES.includes(el.type);
      if (!ok || el.readOnly || el.disabled) return { kind: 'unsupported' };
      return { kind: 'field', el };
    }
    if (el.isContentEditable) {
      let host = el;
      while (host.parentElement && host.parentElement.isContentEditable) host = host.parentElement;
      return { kind: 'rich', el: host };
    }
    return { kind: 'none' };
  }

  // ---------- <input> / <textarea> ----------
  function setFieldValue(el, value, caret) {
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
    try { el.setSelectionRange(caret, caret); } catch (_) {}
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function runField(el, mode) {
    const v = el.value;
    let s = null, e = null;
    try { s = el.selectionStart; e = el.selectionEnd; } catch (_) {}
    const canSelect = s !== null && s !== undefined;
    let hadSelection = false;

    if (!canSelect) {              // e.g. type=email: no selection API
      s = 0; e = v.length;
    } else if (s !== e) {
      hadSelection = true;
    } else if (mode === 'word') {
      const m = /\S+$/.exec(v.slice(0, e));
      if (!m) return null;
      s = e - m[0].length;
    } else if (mode === 'line') {
      s = e > 0 ? v.lastIndexOf('\n', e - 1) + 1 : 0;
      const nl = v.indexOf('\n', e);
      e = nl === -1 ? v.length : nl;
    } else {
      s = 0; e = v.length;
    }

    const res = convertText(v.slice(s, e), { symbols: hadSelection || mode === 'all' || !canSelect });
    if (!res) return null;

    const expected = v.slice(0, s) + res.text + v.slice(e);
    let done = false;
    if (canSelect) {
      try {
        el.setSelectionRange(s, e);
        document.execCommand('insertText', false, res.text);   // keeps Ctrl+Z working
        done = el.value === expected;
      } catch (_) {}
    }
    if (!done) setFieldValue(el, expected, s + res.text.length);
    if (hadSelection) { try { el.setSelectionRange(s, s + res.text.length); } catch (_) {} }
    return res;
  }

  // ---------- contentEditable ----------
  function lastWordRange(range) {
    let node = range.startContainer;
    let off = range.startOffset;
    if (node.nodeType !== 3) {
      let t = node.childNodes[off - 1];
      while (t && t.nodeType !== 3) t = t.lastChild;
      if (!t) return null;
      node = t;
      off = t.data.length;
    }
    const m = /\S+$/.exec(node.data.slice(0, off));
    if (!m) return null;
    const r = document.createRange();
    r.setStart(node, off - m[0].length);
    r.setEnd(node, off);
    return r;
  }

  function blockOf(node, host) {
    let n = node.nodeType === 3 ? node.parentNode : node;
    while (n && n !== host) {
      const d = getComputedStyle(n).display;
      if (!d.startsWith('inline') && d !== 'contents') return n;
      n = n.parentNode;
    }
    return host;
  }

  function runRich(host, mode) {
    const root = host.getRootNode();
    const sel = (root && root.getSelection ? root.getSelection() : null) || window.getSelection();
    if (!sel || !sel.rangeCount) return null;
    const range = sel.getRangeAt(0);
    const explicit = !sel.isCollapsed || mode === 'all';

    let target;
    if (!sel.isCollapsed) {
      target = range.cloneRange();
    } else if (mode === 'word') {
      target = lastWordRange(range);
    } else {
      target = document.createRange();
      target.selectNodeContents(mode === 'line' ? blockOf(range.startContainer, host) : host);
    }
    if (!target) return null;

    sel.removeAllRanges();
    sel.addRange(target);
    const res = convertText(sel.toString(), { symbols: explicit });
    if (!res) { sel.removeAllRanges(); sel.addRange(range); return null; }
    if (!document.execCommand('insertText', false, res.text)) return null;
    return res;
  }

  // ---------- toast ----------
  function toast(msg) {
    const old = document.getElementById('__alf_toast');
    if (old) old.remove();
    const d = document.createElement('div');
    d.id = '__alf_toast';
    d.textContent = msg;
    Object.assign(d.style, {
      position: 'fixed', right: '16px', bottom: '16px', zIndex: '2147483647',
      background: 'rgba(30,30,30,.92)', color: '#fff', padding: '8px 12px',
      borderRadius: '8px', font: '13px/1.4 system-ui, sans-serif',
      pointerEvents: 'none', boxShadow: '0 2px 8px rgba(0,0,0,.3)'
    });
    document.documentElement.appendChild(d);
    setTimeout(() => d.remove(), 1600);
  }

  const MSG = {
    th2en: 'แปลงแล้ว: ไทย → อังกฤษ',
    en2th: 'แปลงแล้ว: อังกฤษ → ไทย',
    caps: 'แก้ Caps Lock แล้ว',
    empty: 'ไม่พบข้อความที่จะแปลง',
    password: 'ข้ามช่องรหัสผ่าน (เปิดได้ใน popup)',
    unsupported: 'ช่องนี้ไม่รองรับการแปลง',
    noField: 'คลิกในช่องข้อความก่อน'
  };

  // ---------- main ----------
  function main() {
    const t = targetOf(deepActive());
    if (!t || t.kind === 'frame') return;           // focus is inside a child frame
    const isTop = window === window.top;
    if (t.kind === 'none' && !isTop) return;

    const forced = globalThis.__alfForce || null;
    delete globalThis.__alfForce;

    chrome.storage.sync.get({ mode: 'word', notify: true, skipPassword: true }, (cfg) => {
      if (t.kind === 'none') { if (cfg.notify) toast(MSG.noField); return; }
      if (t.kind === 'unsupported') { if (cfg.notify) toast(MSG.unsupported); return; }
      if (t.kind === 'field' && t.el.type === 'password' && cfg.skipPassword) {
        if (cfg.notify) toast(MSG.password);
        return;
      }
      const mode = forced || cfg.mode;
      let res = null;
      try {
        res = t.kind === 'field' ? runField(t.el, mode) : runRich(t.el, mode);
      } catch (err) {
        console.warn('Auto Language Fixer:', err);
      }
      if (cfg.notify) toast(res ? MSG[res.dir] : MSG.empty);
    });
  }

  main();
})();