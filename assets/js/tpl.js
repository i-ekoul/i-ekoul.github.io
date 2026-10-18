/* Tiny template renderer for the portfolio: {{path}} holes, <sc-for>, <sc-if>,
   and onEvent="{{fn}}" attributes turned into data-on-* hooks. Shared by the
   build (pre-render) and the browser (re-render on state change). */
(function (root) {
  function get(ctx, p) {
    return p.trim().split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, ctx);
  }
  function esc(v) {
    return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function render(t, ctx, handlers) {
    t = t.replace(/<sc-for list="\{\{([^}]+)\}\}" as="(\w+)"[^>]*>([\s\S]*?)<\/sc-for>/g, function (m, l, as, body) {
      return (get(ctx, l) || []).map(function (it, i) {
        var c = Object.assign({}, ctx); c[as] = it; c.$index = i;
        return render(body, c, handlers);
      }).join('');
    });
    var prev;
    do {
      prev = t;
      t = t.replace(/<sc-if value="\{\{([^}]+)\}\}"[^>]*>((?:(?!<sc-if)[\s\S])*?)<\/sc-if>/g, function (m, c, body) {
        return get(ctx, c) ? body : '';
      });
    } while (t !== prev);
    t = t.replace(/ on([A-Z][a-zA-Z]*)="\{\{([^}]+)\}\}"/g, function (m, ev, p) {
      var fn = get(ctx, p);
      if (typeof fn !== 'function' || !handlers) return '';
      handlers.push(fn);
      return ' data-on-' + ev.toLowerCase() + '="' + (handlers.length - 1) + '"';
    });
    t = t.replace(/ (open|disabled|checked|hidden)="\{\{([^}]+)\}\}"/g, function (m, a, p) {
      var v = get(ctx, p); return v && v !== 'false' ? ' ' + a : '';
    });
    return t.replace(/\{\{([^}]+)\}\}/g, function (m, p) {
      var x = get(ctx, p);
      return typeof x === 'function' || x == null ? '' : esc(x);
    });
  }
  root.PortfolioTpl = { render: render };
  if (typeof module !== 'undefined') module.exports = root.PortfolioTpl;
})(typeof window !== 'undefined' ? window : globalThis);
