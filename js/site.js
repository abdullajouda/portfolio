/**
 * Shared behaviour: theme toggle, mobile nav, config-driven links,
 * project filters, contact form, scroll reveal.
 *
 * No dependencies, no build step. Runs on every page; each module
 * no-ops when its markup isn't present.
 */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;

  /* ---------------------------------------------------------------- utils */

  function $(sel, scope) { return (scope || doc).querySelector(sel); }
  function $$(sel, scope) { return Array.prototype.slice.call((scope || doc).querySelectorAll(sel)); }

  /** Resolve "projects.basitCaseStudy" against the config object. */
  function lookup(path) {
    return String(path).split(".").reduce(function (acc, key) {
      return acc && typeof acc === "object" ? acc[key] : undefined;
    }, window.SITE_CONFIG || {});
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /* ---------------------------------------------------------------- theme */

  (function theme() {
    var toggles = $$("[data-theme-toggle]");
    if (!toggles.length) return;

    function apply(next) {
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      toggles.forEach(function (btn) {
        btn.setAttribute(
          "aria-label",
          next === "dark" ? "Switch to light theme" : "Switch to dark theme"
        );
      });
    }

    apply(root.dataset.theme === "dark" ? "dark" : "light");

    toggles.forEach(function (btn) {
      btn.addEventListener("click", function () {
        apply(root.dataset.theme === "dark" ? "light" : "dark");
      });
    });
  })();

  /* ------------------------------------------------------------ mobile nav */

  (function mobileNav() {
    var drawer = $("[data-nav-drawer]");
    var backdrop = $("[data-nav-backdrop]");
    var openBtn = $("[data-nav-open]");
    if (!drawer || !openBtn) return;

    var lastFocused = null;

    function setOpen(open) {
      drawer.dataset.open = open ? "true" : "false";
      if (backdrop) backdrop.dataset.open = open ? "true" : "false";
      drawer.setAttribute("aria-hidden", open ? "false" : "true");
      openBtn.setAttribute("aria-expanded", open ? "true" : "false");
      doc.body.style.overflow = open ? "hidden" : "";

      if (open) {
        lastFocused = doc.activeElement;
        var first = drawer.querySelector("a, button");
        if (first) first.focus();
      } else if (lastFocused) {
        lastFocused.focus();
      }
    }

    setOpen(false);

    openBtn.addEventListener("click", function () { setOpen(true); });
    $$("[data-nav-close]").forEach(function (el) {
      el.addEventListener("click", function () { setOpen(false); });
    });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.dataset.open === "true") setOpen(false);
    });

    // Keep focus inside the drawer while it's open.
    drawer.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || drawer.dataset.open !== "true") return;
      var items = $$("a[href], button:not([disabled])", drawer).filter(function (el) {
        return el.offsetParent !== null;
      });
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  })();

  /* -------------------------------------------------------- config-driven */

  (function configLinks() {
    $$("[data-site-link]").forEach(function (el) {
      var key = el.getAttribute("data-site-link");
      var value = lookup(key);

      if (!value) {
        el.hidden = true;
        el.setAttribute("aria-hidden", "true");
        el.tabIndex = -1;
        return;
      }

      if (key === "email") el.href = "mailto:" + value;
      else if (key === "phone") el.href = "tel:" + String(value).replace(/[^\d+]/g, "");
      else el.href = value;

      // Anything pointing off-site opens in a new tab, safely.
      if (/^https?:/i.test(el.getAttribute("href") || "")) {
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      }

      el.hidden = false;
      el.removeAttribute("aria-hidden");
      el.removeAttribute("tabindex");
    });

    $$("[data-site-text]").forEach(function (el) {
      var value = lookup(el.getAttribute("data-site-text"));
      if (value) el.textContent = value;
    });

    $$("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  })();

  /* ------------------------------------------------------ project filters */

  (function filters() {
    var buttons = $$("[data-filter]");
    var list = $("[data-projects]");
    if (!buttons.length || !list) return;

    var cards = $$(".project", list);
    var status = $("[data-filter-status]");

    function announce(count, label) {
      if (!status) return;
      status.textContent =
        label === "all"
          ? "Showing all " + count + " projects."
          : "Showing " + count + (count === 1 ? " project" : " projects") + " tagged " + label + ".";
    }

    function apply(tag) {
      var shown = 0;
      cards.forEach(function (card) {
        var tags = (card.getAttribute("data-tags") || "").split(/\s+/);
        var match = tag === "all" || tags.indexOf(tag) !== -1;
        card.hidden = !match;
        if (match) shown++;
      });
      buttons.forEach(function (btn) {
        btn.setAttribute("aria-pressed", btn.getAttribute("data-filter") === tag ? "true" : "false");
      });
      announce(shown, tag);
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        apply(btn.getAttribute("data-filter"));
      });
    });

    apply("all");
  })();

  /* --------------------------------------------------------- contact form */

  (function contactForm() {
    var form = $("[data-contact-form]");
    if (!form) return;

    var note = $("[data-form-note]", form);

    function say(message, tone) {
      if (!note) return;
      note.textContent = message;
      note.hidden = false;
      note.style.background = tone === "error" ? "var(--accent-soft)" : "var(--olive-soft)";
      note.style.color = tone === "error" ? "var(--accent-text)" : "var(--olive-text)";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var to = lookup("email");
      if (!to) {
        say("No contact address is configured yet.", "error");
        return;
      }

      var data = new FormData(form);
      var name = String(data.get("name") || "").trim();
      var from = String(data.get("email") || "").trim();
      var subject = String(data.get("subject") || "").trim();
      var message = String(data.get("message") || "").trim();

      if (!name || !message) {
        say("Please add your name and a message.", "error");
        return;
      }
      if (!isEmail(from)) {
        say("That email address doesn't look right.", "error");
        return;
      }

      var body = message + "\n\n—\n" + name + "\n" + from;
      var href =
        "mailto:" + to +
        "?subject=" + encodeURIComponent(subject || "Portfolio enquiry from " + name) +
        "&body=" + encodeURIComponent(body);

      window.location.href = href;
      say("Opening your email client. If nothing happens, write to " + to + " directly.", "ok");
    });
  })();

  /* ---------------------------------------------------------- reveal on scroll */

  (function reveal() {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var targets = $$(".section, .project, .card, .stat");
    if (!targets.length) return;

    targets.forEach(function (el) { el.classList.add("reveal"); });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    targets.forEach(function (el) { io.observe(el); });
  })();
})();
