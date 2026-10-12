/**
 * Shared behaviour: theme, header, mobile nav, config-driven links, phone
 * frames, app showcase, motion (split text, reveal, count-up, parallax,
 * timeline fill), project filters and the contact form.
 *
 * No dependencies, no build step. Runs on every page; each module no-ops
 * when its markup isn't present.
 */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- utils */

  function $(sel, scope) { return (scope || doc).querySelector(sel); }
  function $$(sel, scope) { return Array.prototype.slice.call((scope || doc).querySelectorAll(sel)); }

  /** Resolve "projects.basitCaseStudy" against the config object. */
  function lookup(path) {
    return String(path).split(".").reduce(function (acc, key) {
      return acc && typeof acc === "object" ? acc[key] : undefined;
    }, window.SITE_CONFIG || {});
  }

  /* ---------------------------------------------------------------- i18n */

  var AR = (root.getAttribute("lang") || "").indexOf("ar") === 0;

  /** Pick the English or Arabic variant of a UI string. */
  function t(en, ar) { return AR ? ar : en; }

  var FILTER_AR = { fintech: "التقنية المالية", mobile: "الجوال", personal: "الشخصية" };

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function onScrollFrame(fn) {
    var queued = false;
    function tick() { queued = false; fn(); }
    function request() { if (!queued) { queued = true; requestAnimationFrame(tick); } }
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    fn();
  }

  /* ---------------------------------------------------------------- theme */

  (function theme() {
    var toggles = $$("[data-theme-toggle]");
    if (!toggles.length) return;

    function apply(next) {
      root.dataset.theme = next;
      toggles.forEach(function (btn) {
        btn.setAttribute("aria-label", next === "dark"
          ? t("Switch to light theme", "التبديل إلى الوضع الفاتح")
          : t("Switch to dark theme", "التبديل إلى الوضع الداكن"));
      });
    }

    apply(root.dataset.theme === "dark" ? "dark" : "light");

    toggles.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = root.dataset.theme === "dark" ? "light" : "dark";
        try { localStorage.setItem("theme", next); } catch (e) {}
        apply(next);
      });
    });
  })();

  /* ------------------------------------------------- header + scroll bar */

  (function header() {
    var bar = $(".scroll-progress");
    onScrollFrame(function () {
      var y = window.scrollY;
      root.classList.toggle("is-scrolled", y > 12);
      if (bar) {
        var max = doc.documentElement.scrollHeight - window.innerHeight;
        bar.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : 0);
      }
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

  /* --------------------------------------------------------------- phones */

  var APP_NAMES = { hisab: "Hisab", wintoo: "Wintoo", forge: "FORGE", lifeos: "LifeOS", athkar: "Athkar", coinplus: "CoinPlus" };

  function screenLabel(key) {
    var parts = key.split("/");
    return (APP_NAMES[parts[0]] || parts[0]) + " — " + t(parts[1] + " screen", "شاشة " + parts[1]);
  }

  /** Fill a screen container with the configured screenshot, or the CSS mock. */
  function fillScreen(screen, key) {
    var shot = (lookup("screenshots") || {})[key];
    if (shot) {
      var img = doc.createElement("img");
      img.src = shot;
      img.alt = screenLabel(key);
      img.loading = "lazy";
      img.decoding = "async";
      screen.appendChild(img);
    } else if (window.renderScreen) {
      screen.innerHTML = window.renderScreen(key);
    }
  }

  function buildPhone(el) {
    var key = el.getAttribute("data-phone");
    el.classList.add("phone");
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", screenLabel(key));
    el.innerHTML = '<div class="phone__screen"></div><span class="phone__island"></span><span class="phone__glare"></span>';
    fillScreen(el.firstChild, key);
  }

  function makePhone(key, extraClass) {
    var el = doc.createElement("div");
    el.setAttribute("data-phone", key);
    if (extraClass) el.className = extraClass;
    buildPhone(el);
    return el;
  }

  (function browsers() {
    $$("[data-browser]").forEach(function (el) {
      var key = el.getAttribute("data-browser");
      el.classList.add("browser");
      el.setAttribute("role", "img");
      el.setAttribute("aria-label", screenLabel(key));
      el.innerHTML = '<div class="browser__bar"><i></i><i></i><i></i><span class="browser__url"></span></div><div class="browser__screen"></div>';
      $(".browser__url", el).textContent = el.getAttribute("data-url") || "";
      fillScreen($(".browser__screen", el), key);
    });
  })();

  /* ------------------------------------------------------------- showcase */

  (function showcase() {
    var wrap = $("[data-showcase]");
    if (!wrap) return;

    var steps = $$("[data-step]", wrap);
    var stage = $("[data-stage]", wrap);
    var counter = $("[data-stage-count]", wrap);
    var dots = $("[data-stage-dots]", wrap);
    var sets = [];

    steps.forEach(function (step, i) {
      var front = step.getAttribute("data-front");
      var back = step.getAttribute("data-back");
      var app = front.split("/")[0];
      var color = (window.APP_COLORS || {})[app] || "";
      step.style.setProperty("--app", color);

      // Inline pair for small screens, where the sticky stage is hidden.
      var inline = $(".step__phones", step);
      if (inline) {
        inline.appendChild(makePhone(back, "phone--back"));
        inline.appendChild(makePhone(front, "phone--front"));
      }

      if (stage) {
        var set = doc.createElement("div");
        set.className = "stage__set";
        set.appendChild(makePhone(back, "phone--back"));
        set.appendChild(makePhone(front, "phone--front"));
        set.dataset.color = color;
        stage.appendChild(set);
        sets.push(set);
      }
      if (dots) dots.appendChild(doc.createElement("i"));
    });

    var active = -1;
    function activate(i) {
      if (i === active) return;
      active = i;
      steps.forEach(function (s, n) { s.classList.toggle("is-active", n === i); });
      sets.forEach(function (s, n) {
        s.classList.toggle("is-active", n === i);
        s.classList.toggle("is-past", n < i);
        if (n === i) $$(".phone", s).forEach(function (p) { p.classList.add("is-live"); });
      });
      if (stage && sets[i]) stage.style.setProperty("--stage-color", sets[i].dataset.color);
      if (counter) counter.textContent = String(i + 1).padStart(2, "0") + " / " + String(steps.length).padStart(2, "0");
      if (dots) $$("i", dots).forEach(function (d, n) { d.classList.toggle("on", n === i); });
    }

    activate(0);

    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) activate(steps.indexOf(entry.target));
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(function (s) { io.observe(s); });
  })();

  // Build every remaining declarative phone, now that showcase phones exist.
  $$("[data-phone]:not(.phone)").forEach(buildPhone);

  /* --------------------------------------------- screens animate when seen */

  (function liveScreens() {
    var frames = $$(".phone, .browser").filter(function (el) { return !el.closest(".stage__set"); });
    if (reduceMotion || !("IntersectionObserver" in window)) {
      $$(".phone, .browser").forEach(function (el) { el.classList.add("is-live"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-live");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    frames.forEach(function (el) { io.observe(el); });
  })();

  /* ------------------------------------------------------- split headline */

  (function splitText() {
    $$("[data-split]").forEach(function (el) {
      if (reduceMotion) return;
      var i = 0;
      // Walk text nodes so inline markup (e.g. <em>) keeps its styling.
      (function walk(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (child) {
          if (child.nodeType === 3) {
            var frag = doc.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(doc.createTextNode(" ")); return; }
              var w = doc.createElement("span");
              w.className = "w";
              var inner = doc.createElement("span");
              inner.style.setProperty("--i", i++);
              inner.textContent = part;
              w.appendChild(inner);
              frag.appendChild(w);
            });
            child.parentNode.replaceChild(frag, child);
          } else if (child.nodeType === 1) {
            walk(child);
          }
        });
      })(el);
      el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
      el.classList.add("split");
    });
  })();

  /* ------------------------------------------------------------- count-up */

  (function countUp() {
    var els = $$("[data-count]");
    if (!els.length) return;

    function render(el, value) {
      var decimals = +(el.getAttribute("data-decimals") || 0);
      el.firstChild.textContent = (el.getAttribute("data-prefix") || "") + value.toFixed(decimals);
    }

    els.forEach(function (el) {
      // First text node holds the number; any <em> suffix stays untouched.
      if (!el.firstChild || el.firstChild.nodeType !== 3) el.insertBefore(doc.createTextNode(""), el.firstChild);
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { render(el, +el.getAttribute("data-count")); });
      return;
    }

    els.forEach(function (el) { render(el, 0); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        var el = entry.target;
        var target = +el.getAttribute("data-count");
        var start = performance.now();
        var dur = 1600;
        (function frame(now) {
          var t = Math.min(1, (now - start) / dur);
          var eased = 1 - Math.pow(1 - t, 4);
          render(el, target * eased);
          if (t < 1) requestAnimationFrame(frame);
        })(start);
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ------------------------------------------------------ pointer parallax */

  (function parallax() {
    var scene = $("[data-parallax-scene]");
    if (!scene || reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

    var layers = $$("[data-depth]", scene);
    var tx = 0, ty = 0, cx = 0, cy = 0, running = false;

    function loop() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      layers.forEach(function (el) {
        var d = +el.getAttribute("data-depth");
        el.style.setProperty("--px", (cx * d).toFixed(2) + "px");
        el.style.setProperty("--py", (cy * d).toFixed(2) + "px");
      });
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) requestAnimationFrame(loop);
      else running = false;
    }

    window.addEventListener("pointermove", function (e) {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: true });
  })();

  /* ------------------------------------------------------- timeline fill */

  (function timeline() {
    var line = $("[data-timeline]");
    if (!line) return;
    onScrollFrame(function () {
      var r = line.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.6 - r.top) / r.height;
      line.style.setProperty("--fill", Math.max(0, Math.min(1, p)).toFixed(4));
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
          ? t("Showing all " + count + " projects.", "عرض جميع المشاريع (" + count + ").")
          : t("Showing " + count + (count === 1 ? " project" : " projects") + " tagged " + label + ".",
              "عرض " + count + " من مشاريع " + (FILTER_AR[label] || label) + ".");
    }

    function apply(tag, animate) {
      var shown = 0;
      cards.forEach(function (card) {
        var tags = (card.getAttribute("data-tags") || "").split(/\s+/);
        var match = tag === "all" || tags.indexOf(tag) !== -1;
        card.hidden = !match;
        card.classList.remove("is-filtered-in");
        if (match) {
          if (animate && !reduceMotion) {
            void card.offsetWidth; // restart the animation
            card.style.animationDelay = shown * 70 + "ms";
            card.classList.add("is-filtered-in", "is-visible");
          }
          shown++;
        }
      });
      buttons.forEach(function (btn) {
        btn.setAttribute("aria-pressed", btn.getAttribute("data-filter") === tag ? "true" : "false");
      });
      announce(shown, tag);
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        apply(btn.getAttribute("data-filter"), true);
      });
    });

    apply("all", false);
  })();

  /* --------------------------------------------------------- contact form */

  (function contactForm() {
    var form = $("[data-contact-form]");
    if (!form) return;

    var note = $("[data-form-note]", form);
    var submit = $('[type="submit"]', form);
    var label = $("[data-form-label]", form);
    var intro = $("[data-form-intro]");
    var endpoint = lookup("formEndpoint");

    // With an endpoint, the form sends directly instead of opening a mail app.
    if (endpoint) {
      if (label) label.textContent = t("Send message", "إرسال الرسالة");
      if (intro) intro.textContent = t("Goes straight to my inbox — no email app needed.", "تصل الرسالة مباشرة إلى بريدي — دون الحاجة إلى تطبيق بريد.");
    }

    function say(message, tone) {
      if (!note) return;
      note.textContent = message;
      note.hidden = false;
      note.className = "form__note form__note--" + (tone === "error" ? "error" : "ok");
    }

    function read() {
      var data = new FormData(form);
      return {
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        subject: String(data.get("subject") || "").trim(),
        message: String(data.get("message") || "").trim(),
        gotcha: String(data.get("_gotcha") || "")
      };
    }

    function viaMailApp(to, f) {
      var body = f.message + "\n\n—\n" + f.name + "\n" + f.email;
      window.location.href =
        "mailto:" + to +
        "?subject=" + encodeURIComponent(f.subject || t("Portfolio enquiry from ", "استفسار من الموقع — ") + f.name) +
        "&body=" + encodeURIComponent(body);
      say(t("Opening your email client. If nothing happens, write to " + to + " directly.",
            "جارٍ فتح تطبيق البريد. إن لم يحدث شيء، راسلني مباشرة على " + to + "."), "ok");
    }

    function viaEndpoint(f) {
      submit.disabled = true;
      if (label) label.textContent = t("Sending…", "جارٍ الإرسال…");

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: f.name,
          email: f.email,
          _replyto: f.email,
          _subject: f.subject || t("Portfolio enquiry from ", "استفسار من الموقع — ") + f.name,
          message: f.message,
          _gotcha: f.gotcha
        })
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          form.reset();
          say(t("Thanks, " + f.name.split(" ")[0] + " — your message is on its way. I'll reply to " + f.email + ".",
                "شكرًا " + f.name.split(" ")[0] + " — وصلت رسالتك، وسأرد على " + f.email + "."), "ok");
        })
        .catch(function () {
          var to = lookup("email");
          say(t("That didn't send. Please try again" + (to ? ", or email " + to + " directly." : "."),
                "تعذّر الإرسال. حاول مرة أخرى" + (to ? "، أو راسلني مباشرة على " + to + "." : ".")), "error");
        })
        .then(function () {
          submit.disabled = false;
          if (label) label.textContent = t("Send message", "إرسال الرسالة");
        });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var f = read();
      if (f.gotcha) return; // a bot filled the hidden field

      if (!f.name || !f.message) {
        say(t("Please add your name and a message.", "يرجى كتابة اسمك ورسالتك."), "error");
        return;
      }
      if (!isEmail(f.email)) {
        say(t("That email address doesn't look right.", "يبدو أن البريد الإلكتروني غير صحيح."), "error");
        return;
      }

      if (endpoint) {
        viaEndpoint(f);
        return;
      }

      var to = lookup("email");
      if (!to) {
        say(t("No contact address is configured yet.", "لم يُضبط عنوان للتواصل بعد."), "error");
        return;
      }
      viaMailApp(to, f);
    });
  })();

  /* ---------------------------------------------------------- reveal on scroll */

  (function reveal() {
    var targets = $$("[data-reveal], [data-stagger] > *, .role");
    if (!targets.length) return;

    $$("[data-stagger]").forEach(function (group) {
      Array.prototype.slice.call(group.children).forEach(function (child, i) {
        child.style.setProperty("--i", i);
      });
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    targets.forEach(function (el) { el.classList.add("reveal"); });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    targets.forEach(function (el) { io.observe(el); });
  })();
})();
