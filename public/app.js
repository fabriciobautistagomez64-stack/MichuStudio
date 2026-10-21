var ids = ['inicio', 'descargas', 'foro', 'reportar', 'michiverse'];

function show() {
  var h = location.hash.replace('#', '');
  if (ids.indexOf(h) === -1) h = 'inicio';
  ids.forEach(function (id) {
    document.getElementById(id).classList.toggle('on', id === h);
  });
  document.querySelectorAll('nav a').forEach(function (a) {
    a.classList.toggle('on', a.getAttribute('href') === '#' + h);
  });
  window.scrollTo(0, 0);
}

function el(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

function render(data) {
  document.getElementById('btn-foro').href = data.links.forum;
  document.getElementById('btn-reporte').href = data.links.report;
  var sp = data.sponsors || [];
  if (sp.length) {
    document.getElementById('patro').hidden = false;
    var pl = document.getElementById('patro-lista');
    sp.forEach(function (x) {
      var w = x.url ? el('a') : el('span');
      if (x.url) { w.href = x.url; w.target = '_blank'; w.rel = 'noopener'; }
      var i = el('img');
      i.src = 'images/sponsors/' + x.image;
      i.alt = x.name;
      w.appendChild(i);
      pl.appendChild(w);
    });
  }
  var box = document.getElementById('lista');
  box.textContent = '';
  data.categories.forEach(function (cat) {
    box.appendChild(el('div', 'cat', 'Categor\u00eda - ' + cat.name));
    data.games.filter(function (g) { return g.category === cat.id; }).forEach(function (g) {
      g.versions.forEach(function (v) {
        var card = el('div', 'card ver');
        if (v.banner) {
          var im = el('img', 'banner');
          im.src = v.banner;
          im.alt = v.name;
          im.onerror = function () { im.remove(); };
          card.appendChild(im);
        }
        var row = el('div', 'row');
        var left = el('div');
        var t = el('h3', '', v.name);
        var ok = v.status === 'available';
        t.appendChild(el('span', ok ? 'pill ok' : 'pill', ok ? 'Disponible' : 'Pr\u00f3ximamente'));
        left.appendChild(t);
        var info = v.notes || '';
        if (v.date) info += ' (' + v.date + ')';
        left.appendChild(el('p', '', info));
        if (v.description) left.appendChild(el('p', 'desc', v.description));
        row.appendChild(left);
        var b = el('a', ok ? 'btn' : 'btn off', ok ? 'Descargar APK' : 'Pr\u00f3ximamente');
        if (ok) {
          b.href = 'games/' + encodeURIComponent(v.file);
          b.setAttribute('download', v.file);
        }
        row.appendChild(b);
        card.appendChild(row);
        box.appendChild(card);
      });
    });
  });
}

window.addEventListener('hashchange', show);
show();

fetch('games.json')
  .then(function (r) { return r.json(); })
  .then(render)
  .catch(function () {
    document.getElementById('lista').textContent = 'No se pudo cargar la lista de juegos. Intenta de nuevo en un rato.';
  });
