/* SmartHerd lesson page enhancements.
   Progressive only: with JavaScript off, the lesson reads exactly as written.
   Nothing here changes lesson content; it adds a reading-progress bar, a sticky
   session stepper, and turns Session 2's numbered build lists into checkable
   steppers whose state is saved per viewer in localStorage. */
(function () {
  "use strict";
  var main = document.querySelector("main.wrap");
  if (!main) return;
  var lessonId = (location.pathname.split("/").pop() || "lesson").replace(/\.html$/, "");

  /* ---------- 1. reading-progress bar ---------- */
  var prog = document.createElement("div");
  prog.className = "lsn-progress";
  prog.innerHTML = "<i></i>";
  document.body.appendChild(prog);
  var progI = prog.firstChild;

  /* ---------- 2. sticky session stepper ---------- */
  var h2s = [].slice.call(main.querySelectorAll("h2[id]"));
  function sessionOf(h) {
    var m = (h.textContent || "").match(/Session\s+(\d)/i);
    return m ? parseInt(m[1], 10) : null;
  }
  var firstOf = {};
  h2s.forEach(function (h) {
    var s = sessionOf(h);
    if (s && !firstOf[s]) firstOf[s] = h.id;
  });
  var order = Object.keys(firstOf).map(Number).sort(function (a, b) { return a - b; });
  var labels = { 1: "Learn", 2: "Build", 3: "Submit" };
  var bar = null, stepEls = [];
  if (order.length) {
    bar = document.createElement("nav");
    bar.className = "lsn-steps";
    bar.setAttribute("aria-label", "Lesson sessions");
    var row = document.createElement("div");
    row.className = "row";
    order.forEach(function (s) {
      var a = document.createElement("a");
      a.className = "lsn-step";
      a.href = "#" + firstOf[s];
      a.dataset.sess = s;
      a.innerHTML = '<span class="n">' + s + "</span><span>Session " + s +
        "<small>" + (labels[s] || "") + "</small></span>";
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var t = document.getElementById(firstOf[s]);
        if (!t) return;
        var y = t.getBoundingClientRect().top + window.pageYOffset - (bar.offsetHeight + 14);
        window.scrollTo({ top: y, behavior: "smooth" });
      });
      row.appendChild(a);
      stepEls.push(a);
    });
    bar.appendChild(row);
    main.insertBefore(bar, main.firstChild);
  }
  function spy() {
    if (!stepEls.length) return;
    var off = (bar ? bar.offsetHeight : 0) + 40;
    var cur = order[0];
    h2s.forEach(function (h) {
      var s = sessionOf(h);
      if (s && h.getBoundingClientRect().top <= off) cur = s;
    });
    stepEls.forEach(function (a) {
      a.classList.toggle("active", Number(a.dataset.sess) === cur);
    });
  }

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? window.pageYOffset / max : 0;
    progI.style.width = (Math.min(1, Math.max(0, p)) * 100).toFixed(1) + "%";
    spy();
  }

  /* ---------- 3. checkable build steppers (Session 2 only) ---------- */
  var s2 = document.getElementById("s2");
  var s3 = document.getElementById("s3");
  if (s2) {
    var node = s2.nextElementSibling, i = 0;
    while (node && node !== s3) {
      if (node.tagName === "OL") enhance(node, i++);
      node = node.nextElementSibling;
    }
  }
  function enhance(ol, idx) {
    ol.classList.add("stepper");
    var items = [].slice.call(ol.children).filter(function (n) { return n.tagName === "LI"; });
    if (!items.length) return;
    var key = "smartherd:" + lessonId + ":steps:" + idx;
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || "{}"); } catch (e) {}

    var head = document.createElement("div");
    head.className = "step-head";
    head.innerHTML = '<span class="cnt"></span><span class="bar"><i></i></span>' +
      '<button class="reset" type="button">Reset</button>';
    ol.parentNode.insertBefore(head, ol);
    var cnt = head.querySelector(".cnt");
    var barI = head.querySelector(".bar > i");

    function save() { try { localStorage.setItem(key, JSON.stringify(saved)); } catch (e) {} }
    function update() {
      var done = 0;
      items.forEach(function (li) { if (li.classList.contains("done")) done++; });
      cnt.textContent = done + " / " + items.length + " done";
      cnt.classList.toggle("all-done", done === items.length);
      barI.style.width = (items.length ? done / items.length * 100 : 0) + "%";
    }
    items.forEach(function (li, j) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "step-check";
      btn.setAttribute("aria-label", "Mark step " + (j + 1) + " done");
      if (saved[j]) { li.classList.add("done"); btn.textContent = "✓"; }
      else { btn.textContent = String(j + 1); }
      btn.addEventListener("click", function () {
        var on = li.classList.toggle("done");
        btn.textContent = on ? "✓" : String(j + 1);
        saved[j] = on ? 1 : 0;
        save();
        update();
      });
      li.insertBefore(btn, li.firstChild);
    });
    head.querySelector(".reset").addEventListener("click", function () {
      items.forEach(function (li, j) {
        li.classList.remove("done");
        var b = li.querySelector(".step-check");
        if (b) b.textContent = String(j + 1);
        saved[j] = 0;
      });
      save();
      update();
    });
    update();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", spy);
  onScroll();
})();
