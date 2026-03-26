(function () {
  function cfg() {
    return window.SITE_CONFIG || {};
  }

  function applySiteLinks() {
    const c = cfg();

    document.querySelectorAll("[data-site-link]").forEach(function (el) {
      var key = el.getAttribute("data-site-link");
      var url = "";
      if (key === "github") url = c.github || "";
      else if (key === "linkedin") url = c.linkedin || "";
      else if (key === "twitter") url = c.twitter || "";
      else if (key === "resume") url = c.resume || "";

      if (url) {
        el.setAttribute("href", url);
        el.classList.remove("hidden");
        el.removeAttribute("aria-hidden");
        if (el.tagName === "A" && /^https?:\/\//i.test(url)) {
          el.target = "_blank";
          el.rel = "noopener noreferrer";
        } else if (el.tagName === "A") {
          el.removeAttribute("target");
          el.removeAttribute("rel");
        }
      } else {
        el.classList.add("hidden");
        el.setAttribute("aria-hidden", "true");
      }
    });

    var projects = c.projects || {};
    document.querySelectorAll("[data-project-link]").forEach(function (el) {
      var key = el.getAttribute("data-project-link");
      var url = (key && projects[key]) || "";
      if (url) {
        el.setAttribute("href", url);
        el.classList.remove("hidden");
        el.removeAttribute("aria-hidden");
        if (/^https?:\/\//i.test(url)) {
          el.target = "_blank";
          el.rel = "noopener noreferrer";
        } else {
          el.removeAttribute("target");
          el.removeAttribute("rel");
        }
      } else {
        el.classList.add("hidden");
        el.setAttribute("aria-hidden", "true");
      }
    });

    if (c.email) {
      document.querySelectorAll("[data-bind-email]").forEach(function (el) {
        el.textContent = c.email;
      });
      document.querySelectorAll("[data-mailto-email]").forEach(function (el) {
        if (el.tagName === "A") el.setAttribute("href", "mailto:" + c.email);
      });
    }
  }

  function initMobileNav() {
    var toggle = document.querySelector("[data-mobile-nav-toggle]");
    var backdrop = document.querySelector("[data-mobile-nav-backdrop]");
    var panel = document.querySelector("[data-mobile-nav-panel]");
    if (!toggle || !backdrop || !panel) return;

    var closers = document.querySelectorAll("[data-mobile-nav-close]");

    function openNav() {
      backdrop.classList.remove("opacity-0", "pointer-events-none");
      backdrop.classList.add("opacity-100");
      panel.classList.remove("translate-x-full");
      panel.classList.add("translate-x-0");
      toggle.setAttribute("aria-expanded", "true");
      backdrop.setAttribute("aria-hidden", "false");
      panel.setAttribute("aria-hidden", "false");
      document.body.classList.add("overflow-hidden");
    }

    function closeNav() {
      backdrop.classList.add("opacity-0", "pointer-events-none");
      backdrop.classList.remove("opacity-100");
      panel.classList.add("translate-x-full");
      panel.classList.remove("translate-x-0");
      toggle.setAttribute("aria-expanded", "false");
      backdrop.setAttribute("aria-hidden", "true");
      panel.setAttribute("aria-hidden", "true");
      document.body.classList.remove("overflow-hidden");
    }

    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-expanded") === "true") closeNav();
      else openNav();
    });

    closers.forEach(function (node) {
      node.addEventListener("click", closeNav);
    });

    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  function initProjectFilters() {
    var buttons = document.querySelectorAll("[data-project-filter]");
    var cards = document.querySelectorAll("[data-project-categories]");
    if (!buttons.length || !cards.length) return;

    function setActive(btn) {
      buttons.forEach(function (b) {
        b.classList.remove("glass-card", "text-secondary", "border-secondary/30");
        b.classList.add("text-on-surface-variant", "hover:text-on-surface");
      });
      btn.classList.add("glass-card", "text-secondary", "border-secondary/30");
      btn.classList.remove("text-on-surface-variant", "hover:text-on-surface");
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = (btn.getAttribute("data-project-filter") || "all").toLowerCase();
        setActive(btn);
        cards.forEach(function (card) {
          var raw = (card.getAttribute("data-project-categories") || "").toLowerCase();
          var cats = raw.split(/\s+/).filter(Boolean);
          if (filter === "all" || cats.indexOf(filter) !== -1) {
            card.classList.remove("hidden");
          } else {
            card.classList.add("hidden");
          }
        });
      });
    });
  }

  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    var wrapper = form.closest(".glass-panel") || form.parentElement;
    var overlay = wrapper ? wrapper.querySelector("[data-contact-success]") : null;
    var resetBtn = wrapper ? wrapper.querySelector("[data-contact-reset]") : null;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var c = cfg();
      if (!c.email) {
        window.alert("Set SITE_CONFIG.email in js/site-config.js");
        return;
      }

      var name = (form.querySelector('[name="name"]') || {}).value || "";
      var from = (form.querySelector('[name="email"]') || {}).value || "";
      var subject = (form.querySelector('[name="subject"]') || {}).value || "Portfolio contact";
      var message = (form.querySelector('[name="message"]') || {}).value || "";

      var body =
        "Name: " +
        name +
        "\n" +
        "Reply-to: " +
        from +
        "\n\n" +
        message;

      window.location.href =
        "mailto:" +
        c.email +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      if (overlay) {
        overlay.classList.remove("hidden");
        overlay.setAttribute("aria-hidden", "false");
      }
    });

    if (resetBtn && overlay) {
      resetBtn.addEventListener("click", function () {
        form.reset();
        overlay.classList.add("hidden");
        overlay.setAttribute("aria-hidden", "true");
      });
    }
  }

  function run() {
    applySiteLinks();
    initMobileNav();
    initProjectFilters();
    initContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
