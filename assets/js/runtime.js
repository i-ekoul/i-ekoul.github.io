/* Mounts the portfolio component: renders the template into #app, patches the
   DOM in place with morphdom on every state change, and routes clicks. */
(function () {
  var app = document.getElementById('app');
  var tpl = JSON.parse(document.getElementById('tpl').textContent);
  var handlers = [];
  var mounted = false, queued = false;

  window.DCLogic = function DCLogic(props) { this.props = props || {}; this.state = {}; };
  window.DCLogic.prototype.setState = function (s) {
    Object.assign(this.state, typeof s === 'function' ? s(this.state) : s);
    if (mounted && !queued) { queued = true; requestAnimationFrame(draw); }
  };

  var inst;
  function draw() {
    queued = false;
    handlers = [];
    var html = window.PortfolioTpl.render(tpl, inst.renderVals(), handlers);
    morphdom(app, '<div id="app">' + html + '</div>', {
      onBeforeElUpdated: function (from, to) {
        if (from.tagName === 'DETAILS' && from.dataset.user) {
          if (from.open) to.setAttribute('open', ''); else to.removeAttribute('open');
          to.dataset.user = '1';
        }
        return true;
      }
    });
  }

  app.addEventListener('click', function (e) {
    var el = e.target.closest('[data-on-click]');
    if (el && app.contains(el)) handlers[+el.getAttribute('data-on-click')](e);
  });
  // Remember accordions the visitor opened or closed so re-renders don't undo it.
  app.addEventListener('click', function (e) {
    var s = e.target.closest('summary');
    if (s && s.parentElement && s.parentElement.tagName === 'DETAILS') s.parentElement.dataset.user = '1';
  }, true);

  window.mountPortfolio = function (Component) {
    inst = new Component({});
    mounted = true;
    draw();
    if (inst.componentDidMount) inst.componentDidMount();
  };
})();
