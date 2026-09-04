/* Wesley L. Passos — site behaviour: theme, drawer, publication filter, scrollspy. */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------------- Theme ---------------- */
  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
    });
  });

  /* ---------------- Mobile drawer ---------------- */
  var sidebar = document.getElementById("sidebar");
  var scrim = document.querySelector("[data-scrim]");
  var openBtn = document.querySelector("[data-menu-open]");
  var closeBtn = document.querySelector("[data-menu-close]");

  function isDesktop() {
    return window.matchMedia("(min-width: 1024px)").matches;
  }

  function openMenu() {
    sidebar.classList.add("is-open");
    scrim.classList.add("is-open");
    if (openBtn) openBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  }

  function closeMenu() {
    if (!sidebar.classList.contains("is-open")) return;
    sidebar.classList.remove("is-open");
    scrim.classList.remove("is-open");
    if (openBtn) {
      openBtn.setAttribute("aria-expanded", "false");
      openBtn.focus();
    }
    document.body.style.overflow = "";
  }

  if (openBtn) openBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  if (scrim) scrim.addEventListener("click", closeMenu);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  // Tapping a nav link inside the drawer should dismiss it.
  document.querySelectorAll(".sidebar .nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      if (!isDesktop()) closeMenu();
    });
  });

  // Rotating to landscape can cross the desktop breakpoint while the drawer is open.
  window.addEventListener("resize", function () {
    if (isDesktop()) {
      sidebar.classList.remove("is-open");
      scrim.classList.remove("is-open");
      document.body.style.overflow = "";
      if (openBtn) openBtn.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------------- Accordions ---------------- */
  // Panels are open in the markup, so they stay readable with JS disabled.
  document.querySelectorAll(".acc").forEach(function (acc) {
    var trigger = acc.querySelector(".acc__trigger");
    if (!trigger) return;

    trigger.addEventListener("click", function () {
      var open = acc.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(open));
    });

    // Show how many entries a group holds, straight from the DOM so it can't drift.
    if (acc.hasAttribute("data-count")) {
      var slot = acc.querySelector("[data-count-slot]");
      var n = acc.querySelectorAll(".acc__panel .pub, .acc__panel .people > li").length;
      if (slot && n) slot.textContent = String(n);
    }
  });

  // Following a link into a collapsed panel should open it.
  function revealTarget(hash) {
    var target = null;
    try {
      if (hash && hash.length > 1) target = document.querySelector(hash);
    } catch (e) { /* hash is not a valid selector */ }
    if (!target) return;
    var acc = target.closest(".acc");
    while (acc) {
      if (!acc.classList.contains("is-open")) {
        acc.classList.add("is-open");
        var t = acc.querySelector(".acc__trigger");
        if (t) t.setAttribute("aria-expanded", "true");
      }
      acc = acc.parentElement ? acc.parentElement.closest(".acc") : null;
    }
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (a) revealTarget(a.getAttribute("href"));
  });
  window.addEventListener("hashchange", function () { revealTarget(location.hash); });
  revealTarget(location.hash);

  /* ---------------- Scrollspy ---------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });
      // Highlight the topmost section currently on screen.
      for (var i = 0; i < sections.length; i++) {
        if (visible[sections[i].id]) { setActive(sections[i].id); return; }
      }
    }, { rootMargin: "-15% 0px -70% 0px", threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------------- Back to top ---------------- */
  var toTop = document.querySelector("[data-to-top]");
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    var onScroll = function () {
      toTop.classList.toggle("is-visible", window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- Footer year ---------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
