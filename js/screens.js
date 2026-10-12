/**
 * Illustrative app screens for the phone frames.
 *
 * Each key ("hisab/dashboard") renders a CSS-drawn mock. To show a real
 * screenshot instead, set the same key under `screenshots` in site-config.js —
 * site.js prefers the image whenever one is configured.
 */
(function () {
  "use strict";

  var THEMES = {
    hisab:  { bg: "#f4f7f6", card: "#ffffff", ink: "#0d1f1a", accent: "#0f766e", soft: "#d5eee8", grad: "linear-gradient(140deg,#0f766e,#0b4f4a)" },
    wintoo: { bg: "#ffffff", card: "#f5f3ff", ink: "#16112a", accent: "#7c3aed", soft: "#ede9fe", grad: "linear-gradient(135deg,#7c3aed,#db2777)" },
    forge:  { bg: "#0b0b0c", card: "#18181a", ink: "#f5f5f4", accent: "#f97316", soft: "rgba(249,115,22,.16)", grad: "linear-gradient(135deg,#f97316,#dc2626)", tab: "#111113", dark: true, on: "#0b0b0c" },
    lifeos: { bg: "#f5f6fb", card: "#ffffff", ink: "#0f1530", accent: "#2563eb", soft: "#dbe5fe", grad: "linear-gradient(135deg,#2563eb,#4f46e5)" },
    athkar: { bg: "#0e2621", card: "rgba(255,255,255,.06)", ink: "#f1ecdd", accent: "#d6b56d", soft: "rgba(214,181,109,.16)", grad: "linear-gradient(160deg,#1d4a40,#0e2621)", tab: "#0b1f1b", dark: true, on: "#0e2621" },
    coinplus: { bg: "#f7f8fa", card: "#ffffff", ink: "#111827", accent: "#c2410c", soft: "#fde7d7", grad: "linear-gradient(135deg,#c2410c,#9a3412)" }
  };

  /* ------------------------------------------------------------ helpers */

  function status() {
    return '<div class="m-status"><span>9:41</span><span class="m-status__r"><i></i><i></i><i></i></span></div>';
  }
  function tab(count, active) {
    var s = '<div class="m-tab">';
    for (var i = 0; i < count; i++) s += '<i' + (i === active ? ' class="on"' : "") + "></i>";
    return s + '</div><div class="m-homebar"></div>';
  }
  function row(icon, title, sub, amt, tone) {
    return '<div class="m-row"><span class="m-ico">' + icon + '</span><div class="m-grow"><p class="m-t">' + title +
      '</p><p class="m-s">' + sub + "</p></div>" + (amt ? '<span class="m-amt ' + (tone || "") + '">' + amt + "</span>" : "") + "</div>";
  }
  function bars(heights, opts) {
    opts = opts || {};
    return '<div class="m-bars"' + (opts.h ? ' style="height:' + opts.h + '"' : "") + ">" + heights.map(function (h, n) {
      var o = opts.dim && opts.dim.indexOf(n) !== -1 ? ";--o:.28" : "";
      return '<i style="--h:' + h + "%;--n:" + n + o + '"></i>';
    }).join("") + "</div>";
  }
  function progress(w, color) {
    return '<div class="m-progress"><i style="--w:' + w + "%" + (color ? ";--c:" + color : "") + '"></i></div>';
  }
  function ring(p, size, inner, color, thick) {
    return '<div class="m-ringwrap" style="width:' + size + '"><div class="m-ring" style="--p:' + p +
      (color ? ";--c:" + color : "") + (thick ? ";--t:" + thick : "") + '"></div><div class="m-ring__in">' + (inner || "") + "</div></div>";
  }
  function head(kicker, title, avatar) {
    return '<div class="m-head"><div><p class="m-kicker">' + kicker + '</p><p class="m-title">' + title + "</p></div>" +
      (avatar ? '<span class="m-avatar">' + avatar + "</span>" : "") + "</div>";
  }

  /* ------------------------------------------------------------ screens */

  var SCREENS = {
    /* Hisab — accounting & remittance */
    "hisab/dashboard": function () {
      return status() + head("Good morning, Abdulla", "Overview", "AJ") +
        '<div class="m-hero"><p class="m-sm">Total balance · USD</p><p class="m-big" style="margin-top:.25em">$248,930</p>' +
        '<p class="m-sm" style="margin-top:.2em">▲ 3.2% this month</p>' +
        '<div class="m-chips" style="margin-top:.9em"><span class="m-chip on">USD</span><span class="m-chip">ILS</span><span class="m-chip">EUR</span><span class="m-chip">JOD</span></div></div>' +
        '<div class="m-between"><p class="m-label">Recent entries</p><p class="m-s" style="opacity:.8">See all</p></div>' +
        '<div class="m-list">' +
        row("↗", "Transfer · Al-Quds Exch.", "JV-1042 · Today", "+$12,400", "m-pos") +
        row("⇄", "FX revaluation", "EUR → USD · 1.0841", "−$318", "m-neg") +
        row("₪", "Cash deposit", "Fund box #2 · ILS", "+₪8,750", "m-pos") +
        row("%", "Commission income", "Auto-posted", "+$240", "m-pos") +
        "</div>" + tab(4, 0);
    },
    "hisab/ledger": function () {
      function entry(no, date, dr, cr, amt) {
        return '<div class="m-card"><div class="m-between"><p class="m-t">' + no + '</p><span class="m-chip on" style="font-size:.62em">Balanced</span></div>' +
          '<p class="m-s" style="margin-top:.15em">' + date + "</p>" +
          '<div class="m-list m-list--lined" style="margin-top:.7em;gap:.55em">' +
          '<div class="m-between"><span class="m-s" style="opacity:.8">Dr · ' + dr + '</span><span class="m-amt">' + amt + "</span></div>" +
          '<div class="m-between"><span class="m-s" style="opacity:.8">Cr · ' + cr + '</span><span class="m-amt">' + amt + "</span></div></div></div>";
      }
      return status() + head("Double-entry", "Journal") +
        '<div class="m-chips"><span class="m-chip on">All</span><span class="m-chip">Posted</span><span class="m-chip">Pending</span><span class="m-chip">FX</span></div>' +
        entry("JV-1042", "12 Oct · Transfer", "Cash — USD", "Client · Rami S.", "12,400.00") +
        entry("JV-1041", "12 Oct · Exchange", "Bank — EUR", "Cash — USD", "5,000.00") +
        entry("JV-1040", "11 Oct · Expense", "Rent", "Fund box #1", "1,850.00") +
        tab(4, 1);
    },
    "hisab/reports": function () {
      return status() + head("Q3 · 2026", "Profit & Loss") +
        '<div class="m-card"><p class="m-s">Net profit</p><div class="m-between"><p class="m-big">$64,210</p><span class="m-chip on">+18%</span></div>' +
        '<div style="margin-top:.8em">' + bars([42, 55, 38, 61, 70, 52, 66, 74, 58, 81, 77, 92], { dim: [0, 1, 2, 3, 4, 5, 6, 7, 8] }) + "</div></div>" +
        '<div class="m-card m-list m-list--lined">' +
        '<div class="m-between"><span class="m-t">Revenue</span><span class="m-amt">$182,400</span></div>' +
        '<div class="m-between"><span class="m-t">Operating expenses</span><span class="m-amt m-neg">−$97,050</span></div>' +
        '<div class="m-between"><span class="m-t">FX trading P&amp;L</span><span class="m-amt m-pos">+$4,860</span></div>' +
        '<div class="m-between"><span class="m-t">Revaluation</span><span class="m-amt m-neg">−$1,240</span></div></div>' +
        tab(4, 2);
    },

    /* Wintoo — social commerce */
    "wintoo/feed": function () {
      var g = ["linear-gradient(135deg,#fde68a,#f97316)", "linear-gradient(135deg,#a5f3fc,#6366f1)", "linear-gradient(135deg,#fbcfe8,#db2777)", "linear-gradient(135deg,#bbf7d0,#059669)", "linear-gradient(135deg,#ddd6fe,#7c3aed)"];
      return status() +
        '<div class="m-between"><p class="m-title" style="color:var(--m-accent)">wintoo</p><div class="m-row" style="gap:.5em"><span class="m-ico" style="width:2em;height:2em">♡</span><span class="m-ico" style="width:2em;height:2em">✉</span></div></div>' +
        '<div class="m-row" style="gap:.55em">' + g.map(function (x) { return '<span class="m-story"><i style="--g:' + x + '"></i></span>'; }).join("") + "</div>" +
        '<div class="m-row"><span class="m-avatar" style="background:linear-gradient(135deg,#fbcfe8,#db2777);color:#fff">N</span><div class="m-grow"><p class="m-t">Nour Boutique</p><p class="m-s">Store · 2h</p></div><span class="m-chip on">Follow</span></div>' +
        '<div class="m-img" style="--g:linear-gradient(160deg,#fce7f3 0%,#f9a8d4 45%,#a855f7 100%);--ar:1/1.02">' +
        '<span style="position:absolute;left:.7em;bottom:.7em;z-index:1;background:#fff;color:#16112a;padding:.35em .7em;border-radius:.7em;font-weight:700;font-size:.8em">$24.00 · Shop</span></div>' +
        '<div class="m-between"><div class="m-row" style="gap:1em;font-weight:600;font-size:.85em"><span>♥ 1.2k</span><span>💬 84</span><span>↗</span></div><span class="m-s">Live draw in 2d</span></div>' +
        tab(5, 0);
    },
    "wintoo/shop": function () {
      function item(g, name, price) {
        return '<div><div class="m-img" style="--g:' + g + '"></div><p class="m-t" style="margin-top:.4em">' + name + '</p><p class="m-amt" style="color:var(--m-accent)">' + price + "</p></div>";
      }
      return status() + head("Marketplace", "Discover") + '<div class="m-search">Search stores &amp; products</div>' +
        '<div class="m-chips"><span class="m-chip on">For you</span><span class="m-chip">Fashion</span><span class="m-chip">Tech</span><span class="m-chip">Home</span></div>' +
        '<div class="m-grid2">' +
        item("linear-gradient(150deg,#fef3c7,#f59e0b)", "Canvas tote", "$18") +
        item("linear-gradient(150deg,#e0e7ff,#6366f1)", "Wireless buds", "$59") +
        item("linear-gradient(150deg,#fce7f3,#ec4899)", "Silk scarf", "$32") +
        item("linear-gradient(150deg,#dcfce7,#10b981)", "Desk plant", "$14") +
        "</div>" + tab(5, 1);
    },
    "wintoo/chat": function () {
      return status() +
        '<div class="m-row" style="padding-bottom:.7em;border-bottom:1px solid var(--m-line)"><span class="m-avatar">A</span><div class="m-grow"><p class="m-t">Ahmad · Hand2Hand</p><p class="m-s" style="color:#16a34a;opacity:1">● online</p></div></div>' +
        '<div class="m-list" style="gap:.5em;flex:1;justify-content:flex-end">' +
        '<p class="m-bubble them">Hi! Is the logo design job still open?</p>' +
        '<p class="m-bubble me">Yes — budget is $120, 3 days.</p>' +
        '<p class="m-bubble them">Great, sending my portfolio now 👇</p>' +
        '<div class="m-bubble them" style="padding:.4em;width:62%"><div class="m-img" style="--g:linear-gradient(135deg,#ddd6fe,#7c3aed);--ar:16/10"></div></div>' +
        '<p class="m-bubble me">Looks great. Offer sent ✓✓</p></div>' +
        '<div class="m-search" style="margin-top:.2em">Message…</div>' + tab(5, 3);
    },

    /* FORGE — fitness & nutrition */
    "forge/workout": function () {
      function set(n, kg, reps, done) {
        return '<div class="m-between" style="padding:.55em .2em;border-top:1px solid var(--m-line)"><span class="m-s" style="opacity:.7">Set ' + n + '</span><span class="m-t">' + kg + ' kg × ' + reps + "</span>" +
          '<span class="m-ico" style="width:1.7em;height:1.7em;border-radius:.5em;' + (done ? "background:var(--m-accent);color:#0b0b0c" : "") + '">' + (done ? "✓" : "") + "</span></div>";
      }
      return status() + head("Push day · Week 6", "Bench Press") +
        '<div class="m-card" style="display:grid;place-items:center;padding:1.1em">' +
        ring(68, "62%", '<p class="m-s">Rest</p><p class="m-big" style="font-size:2.2em">0:42</p>', null, ".5em") + "</div>" +
        '<div class="m-card" style="padding:.4em .8em">' + set(1, 60, 10, true) + set(2, 70, 8, true) + set(3, 75, 6, false) + "</div>" +
        '<div class="m-btn">Complete set</div>' + tab(4, 0);
    },
    "forge/nutrition": function () {
      function macro(p, label, val, c) {
        return '<div style="display:grid;justify-items:center;gap:.35em">' + ring(p, "100%", '<p class="m-t">' + val + "</p>", c, ".42em") + '<p class="m-s">' + label + "</p></div>";
      }
      return status() + head("Saturday", "Nutrition") +
        '<div class="m-card"><div class="m-between"><p class="m-s">Calories</p><p class="m-s">2,400 goal</p></div><p class="m-big" style="margin:.15em 0 .5em">1,840 <span style="font-size:.45em;opacity:.55">kcal</span></p>' + progress(77) + "</div>" +
        '<div class="m-card" style="display:grid;grid-template-columns:repeat(3,1fr);gap:.8em">' +
        macro(82, "Protein", "148g", "#f97316") + macro(64, "Carbs", "190g", "#facc15") + macro(51, "Fat", "52g", "#38bdf8") + "</div>" +
        '<div class="m-list">' + row("☀", "Breakfast", "Oats, whey, berries", "520") + row("◐", "Lunch", "Chicken rice bowl", "780") + "</div>" +
        tab(4, 1);
    },
    "forge/progress": function () {
      return status() + head("Last 30 days", "Progress") +
        '<div class="m-card"><p class="m-s">Body weight</p><div class="m-between"><p class="m-big">78.4 <span style="font-size:.45em;opacity:.55">kg</span></p><span class="m-chip on">−2.1 kg</span></div>' +
        '<svg viewBox="0 0 200 80" style="width:100%;margin-top:.6em" aria-hidden="true"><path class="m-area" d="M0 18 L25 22 L50 20 L75 34 L100 30 L125 44 L150 48 L175 58 L200 62 L200 80 L0 80 Z"/>' +
        '<path class="m-line" d="M0 18 L25 22 L50 20 L75 34 L100 30 L125 44 L150 48 L175 58 L200 62"/></svg></div>' +
        '<p class="m-label">Personal records</p><div class="m-list">' +
        row("◆", "Deadlift", "3 days ago", "140 kg", "m-pos") + row("◆", "Bench press", "Today", "75 kg", "m-pos") + row("◆", "Squat", "Last week", "120 kg") +
        "</div>" + tab(4, 2);
    },

    /* LifeOS — tasks, budget, hours */
    "lifeos/budget": function () {
      function cat(icon, name, spent, cap, pct, warn) {
        return '<div><div class="m-between" style="margin-bottom:.4em"><div class="m-row" style="gap:.55em"><span class="m-ico" style="width:1.9em;height:1.9em;border-radius:.6em">' + icon + '</span><span class="m-t">' + name + "</span>" +
          (warn ? '<span class="m-chip" style="background:#fef3c7;color:#b45309;font-size:.6em">' + warn + "</span>" : "") +
          '</div><span class="m-s" style="opacity:.75">' + spent + " / " + cap + "</span></div>" + progress(pct, pct >= 80 ? "#f59e0b" : null) + "</div>";
      }
      return status() + head("October", "Budget", "A") +
        '<div class="m-hero"><p class="m-sm">Spent this month</p><p class="m-big" style="margin:.2em 0 .7em">$1,920 <span style="font-size:.45em;opacity:.7">of $2,600</span></p>' +
        '<div class="m-progress" style="background:rgba(255,255,255,.2)"><i style="--w:74%;--c:#fff"></i></div><p class="m-sm" style="margin-top:.6em">12% less than September</p></div>' +
        '<div class="m-card m-list">' + cat("⌂", "Rent", "$900", "$900", 100) + cat("🛒", "Groceries", "$412", "$480", 86, "86%") + cat("☕", "Eating out", "$96", "$200", 48) + cat("⚡", "Utilities", "$74", "$140", 53) + "</div>" +
        tab(4, 1);
    },
    "lifeos/tasks": function () {
      function q(title, color, items) {
        return '<div class="m-card" style="padding:.75em;border-top:.25em solid ' + color + '"><p class="m-t" style="font-size:.78em">' + title + '</p><div class="m-list" style="gap:.35em;margin-top:.5em">' +
          items.map(function (t, i) { return '<div class="m-row" style="gap:.4em"><span style="flex:none;width:.85em;height:.85em;border-radius:.25em;border:.12em solid ' + color + ";" + (i === 0 ? "background:" + color : "") + '"></span><span class="m-s" style="opacity:.85;font-size:.68em">' + t + "</span></div>"; }).join("") +
          "</div></div>";
      }
      return status() + head("Eisenhower matrix", "Focus") +
        '<div class="m-card m-row"><span class="m-ico" style="background:#fff7ed;color:#ea580c">🔥</span><div class="m-grow"><p class="m-t">12-day streak</p><p class="m-s">Tasks + budget on track</p></div><span class="m-amt" style="color:var(--m-accent)">86%</span></div>' +
        '<div class="m-grid2">' +
        q("Do first", "#ef4444", ["Invoice client", "Pay electricity", "Fix sync bug"]) +
        q("Schedule", "#2563eb", ["Plan Q4 goals", "Dentist", "Gym x3"]) +
        q("Delegate", "#f59e0b", ["Book flights", "Car service"]) +
        q("Later", "#94a3b8", ["Read 'Atomic'", "Clean drive"]) +
        "</div>" +
        '<div class="m-card m-between"><div><p class="m-s">Logged this week</p><p class="m-t" style="font-size:1.05em">31.5 h · $1,260</p></div><span class="m-chip on">Post to budget</span></div>' +
        tab(4, 0);
    },

    /* Athkar — offline remembrance */
    "athkar/counter": function () {
      return status() +
        '<div class="m-head"><div><p class="m-kicker">Morning · 4 of 12</p><p class="m-title" style="font-family:inherit">أذكار الصباح</p></div><span class="m-avatar">☾</span></div>' +
        '<div class="m-card" style="padding:1.1em;text-align:center"><p dir="rtl" style="font-size:1.25em;line-height:1.7;font-weight:600">سُبْحَانَ اللهِ وَبِحَمْدِهِ</p><p class="m-s" style="margin-top:.4em;white-space:normal">Glory be to Allah and praise Him</p></div>' +
        '<div style="display:grid;place-items:center;flex:1">' +
        ring(66, "70%", '<p class="m-big" style="font-size:2.6em;color:var(--m-accent)">66</p><p class="m-s">of 100</p>', null, ".45em") + "</div>" +
        '<div class="m-between"><span class="m-chip">↺ Reset</span><span class="m-chip on">Tap to count</span><span class="m-chip">♡ Save</span></div>' +
        tab(4, 0);
    },
    "athkar/collections": function () {
      return status() + head("Six languages · offline", "Collections") +
        '<div class="m-hero" style="background:linear-gradient(135deg,#d6b56d,#a07d34);color:#0e2621"><p class="m-sm">Current streak</p><p class="m-big">21 days</p><p class="m-sm">Next reminder · Evening, 5:42 PM</p></div>' +
        '<div class="m-list">' +
        row("☀", "Morning", "12 adhkar · done", "✓", "m-pos") +
        row("☾", "Evening", "13 adhkar", "0/13") +
        row("◌", "After prayer", "9 adhkar", "4/9") +
        row("✦", "Before sleep", "11 adhkar", "") +
        row("➶", "Travel", "6 adhkar", "") +
        "</div>" + tab(4, 1);
    },

    /* CoinPlus — web dashboard */
    "coinplus/web": function () {
      function kpi(label, val) {
        return '<div class="m-card" style="border:1px solid var(--m-line)"><p class="m-s">' + label + '</p><p class="m-t" style="font-size:1.3em;margin-top:.2em">' + val + "</p></div>";
      }
      return '<div class="m-side"><p style="font-weight:800;font-size:1.1em;margin-bottom:.6em">CoinPlus</p><i class="on"></i><i></i><i></i><i></i><i></i><i style="width:60%"></i></div>' +
        '<div class="m-main"><div class="m-between"><div><p class="m-s">Overview · all currencies</p><p class="m-title" style="font-size:2em">Dashboard</p></div><span class="m-chip on">+ New transaction</span></div>' +
        '<div class="m-kpis">' + kpi("Cash on hand", "$412,880") + kpi("Banks", "$1.28M") + kpi("Receivables", "$96,410") + kpi("Today's P&amp;L", '<span class="m-pos">+$3,214</span>') + "</div>" +
        '<div style="display:grid;grid-template-columns:1.5fr 1fr;gap:.9em"><div class="m-card" style="border:1px solid var(--m-line)"><p class="m-s">Volume · 14 days</p>' +
        bars([30, 44, 38, 52, 47, 60, 41, 55, 66, 58, 72, 64, 80, 74], { h: "7em" }) + "</div>" +
        '<div class="m-card m-table" style="border:1px solid var(--m-line)"><div><span>Rate</span><span>Buy</span><span>Sell</span><span></span></div>' +
        '<div><span>USD/ILS</span><span>3.71</span><span>3.74</span><span class="m-pos">▲</span></div><div><span>EUR/USD</span><span>1.08</span><span>1.09</span><span class="m-neg">▼</span></div><div><span>JOD/USD</span><span>1.41</span><span>1.42</span><span class="m-pos">▲</span></div></div></div></div>';
    }
  };

  function themeStyle(t) {
    return "--m-bg:" + t.bg + ";--m-card:" + t.card + ";--m-ink:" + t.ink + ";--m-accent:" + t.accent +
      ";--m-soft:" + t.soft + ";--m-grad:" + t.grad + (t.tab ? ";--m-tabbg:" + t.tab : "") + (t.on ? ";--m-on:" + t.on : "");
  }

  /** Returns the mock's HTML for a key, or "" if the key is unknown. */
  window.renderScreen = function (key) {
    var build = SCREENS[key];
    if (!build) return "";
    var app = key.split("/")[0];
    var t = THEMES[app] || THEMES.hisab;
    var web = app === "coinplus";
    return '<div class="m' + (t.dark ? " m--dark" : "") + (web ? " m--web" : "") + '" style="' + themeStyle(t) + '" aria-hidden="true">' + build() + "</div>";
  };

  window.APP_COLORS = Object.keys(THEMES).reduce(function (acc, k) { acc[k] = THEMES[k].accent; return acc; }, {});
})();
