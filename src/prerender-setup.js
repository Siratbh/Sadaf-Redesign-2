// Must be the first import in prerender.jsx.
// decode-named-character-reference/index.dom.js calls document.createElement('i')
// at module initialization time. This stub prevents that from throwing in Node.js.
// The browser ignores this block entirely (document is already defined).
if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    createElement() {
      let _html = ''
      return {
        get innerHTML() { return _html },
        set innerHTML(v) { _html = v },
        get textContent() { return _html },
      }
    },
  }
}
