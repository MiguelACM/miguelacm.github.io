/* Fauna e Flora de Portugal: comportamento da página (sem dependências). */
(function () {
  "use strict";

  /* ---- Tema claro/escuro ---- */
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.addEventListener("click", function () {
      var cur = root.getAttribute("data-theme");
      if (!cur) cur = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      var next = cur === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("ff-theme", next); } catch (e) {}
    });
  }

  function monthOn(card, m) {
    var s = card.getAttribute("data-months") || "";
    return s.charAt(m) === "1";
  }

  /* ---- "Este mês": mostra as espécies em boa época no mês atual ---- */
  var now = document.getElementById("now");
  if (now) {
    var m = new Date().getMonth();
    var label = document.getElementById("now-month");
    if (label && label.dataset.months) label.textContent = label.dataset.months.split("|")[m];
    var shown = 0, max = parseInt(now.dataset.max || "8", 10);
    var cards = Array.prototype.slice.call(now.querySelectorAll(".card"));
    // Primeiro as que só estão em época poucos meses (mais "especiais"), depois as de todo o ano.
    cards.sort(function (a, b) {
      var ca = (a.dataset.months.match(/1/g) || []).length, cb = (b.dataset.months.match(/1/g) || []).length;
      return ca - cb;
    });
    cards.forEach(function (c) {
      if (shown < max && monthOn(c, m)) { c.hidden = false; c.parentNode.appendChild(c); shown++; }
    });
  }

  /* ---- Filtros do catálogo ---- */
  var cat = document.getElementById("catalog");
  if (cat) {
    var state = { group: "", month: "", zone: "", ev: "" };
    var all = cat.querySelectorAll(".card");
    var count = document.getElementById("count");
    var empty = document.getElementById("empty");
    var params = new URLSearchParams(location.search);

    function apply() {
      var n = 0;
      all.forEach(function (c) {
        var ok = true;
        if (state.group && c.dataset.group !== state.group) ok = false;
        if (ok && state.month !== "" && !monthOn(c, +state.month)) ok = false;
        var ev = c.dataset.evidence || "";
        if (ok && state.zone && ev.indexOf(" " + state.zone + ":") === -1) ok = false;
        if (ok && state.ev) {
          var needle = state.zone ? " " + state.zone + ":" + state.ev + " " : ":" + state.ev + " ";
          if (ev.indexOf(needle) === -1) ok = false;
        }
        c.hidden = !ok;
        if (ok) n++;
      });
      if (count) count.textContent = n + " " + count.dataset.label;
      if (empty) empty.hidden = n !== 0;
      var q = new URLSearchParams();
      Object.keys(state).forEach(function (k) { if (state[k] !== "") q.set(k, state[k]); });
      var qs = q.toString();
      history.replaceState(null, "", qs ? "?" + qs : location.pathname);
    }

    cat.querySelectorAll(".chip[data-group]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.group = chip.dataset.group;
        cat.querySelectorAll(".chip[data-group]").forEach(function (o) {
          o.setAttribute("aria-pressed", o === chip ? "true" : "false");
        });
        apply();
      });
    });
    ["month", "zone", "ev"].forEach(function (k) {
      var sel = document.getElementById("f-" + k);
      if (!sel) return;
      if (params.has(k)) { sel.value = params.get(k); state[k] = sel.value; }
      sel.addEventListener("change", function () { state[k] = sel.value; apply(); });
    });
    if (params.has("group")) {
      var g = params.get("group");
      var chip = cat.querySelector('.chip[data-group="' + g.replace(/"/g, "") + '"]');
      if (chip) chip.click();
    }
    apply();
  }

  /* ---- Mapa das zonas (Leaflet + OpenStreetMap) ---- */
  var mapEl = document.getElementById("zone-map");
  var dataEl = document.getElementById("zone-data");
  if (mapEl && dataEl) {
    window.addEventListener("load", function () {
      if (!window.L) { mapEl.hidden = true; return; }
      var zones = JSON.parse(dataEl.textContent);
      var map = L.map(mapEl, { scrollWheelZoom: false }).setView([39.6, -8.1], 6);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
      var rust = getComputedStyle(root).getPropertyValue("--rust").trim() || "#A44E2B";
      zones.forEach(function (z) {
        var a = document.createElement("a");
        a.href = z.url; a.textContent = z.name;
        L.circleMarker(z.c, { radius: 10, color: rust, weight: 2, fillColor: rust, fillOpacity: 0.35 })
          .addTo(map).bindPopup(a).bindTooltip(z.name);
      });
    });
  }
})();
