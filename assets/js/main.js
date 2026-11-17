/* =========================================================
   Teyvat Notes — interactions
   ========================================================= */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- element data ---------- */
  const ELEMENTS = {
    anemo: {
      name: "风", en: "Anemo", color: "#78cfb0",
      icon: '<path d="M4 9c2.2-4 7.4-5 10-2 2.1 2.4.8 5.4-2 5.4-2 0-3-1.1-3-2.3M14 15c3.1 0 6 2 6 5M7.2 16.2c-1 2.1 0 4.2 2.2 4.2"/>'
    },
    geo: {
      name: "岩", en: "Geo", color: "#e0bb62",
      icon: '<path d="M12 3l7 7-7 11-7-11 7-7z"/><path d="M12 7l3.2 3.2L12 16l-3.2-5.8L12 7z"/>'
    },
    electro: {
      name: "雷", en: "Electro", color: "#b493ff",
      icon: '<path d="M13.4 2.5L5.5 14h5.7l-1 7.5L18.5 10h-5.8l.7-7.5z"/>'
    },
    dendro: {
      name: "草", en: "Dendro", color: "#a7d46a",
      icon: '<path d="M20.2 4.2C10.5 4.2 4 9.2 4 16c0 2.1 1.2 3.8 3.3 3.8 6.8 0 11.7-6.4 11.7-15.6z"/><path d="M5.3 19.2c2.2-5.2 5.3-8.4 9.5-10.7"/>'
    },
    hydro: {
      name: "水", en: "Hydro", color: "#6cc7f2",
      icon: '<path d="M12 2.8c4.1 5 7 8.2 7 12a7 7 0 1 1-14 0c0-3.8 2.9-7 7-12z"/><path d="M9.2 15.2c.3 1.7 1.4 2.8 3 3.1"/>'
    },
    pyro: {
      name: "火", en: "Pyro", color: "#f28a63",
      icon: '<path d="M12.2 2.2c1.8 4 6 6.2 6 11.1a6.2 6.2 0 0 1-12.4 0c0-3.1 1.8-4.3 3.1-7.1.7 2 1.7 2.5 2.7 3.1.8-2 .8-4.2.6-7.1z"/><path d="M12 14.2c.9 1.4 1.4 2.5 1.4 3.5a1.8 1.8 0 0 1-3.6 0c0-1.2.7-2.2 2.2-3.5z"/>'
    },
    cryo: {
      name: "冰", en: "Cryo", color: "#a9e3ef",
      icon: '<path d="M12 2.5v19M4.3 7l15.4 10M19.7 7L4.3 17"/><path d="M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5M4.4 9.2L8 10l.9-3.6M19.6 14.8L16 14l-.9 3.6M19.6 9.2L16 10l-.9-3.6M4.4 14.8L8 14l.9 3.6"/>'
    }
  };

  const REACTIONS = {
    "anemo+cryo": ["扩散", "Swirl", "风将冰元素带向四周，适合打散成群目标。"],
    "anemo+electro": ["扩散", "Swirl", "风与雷相遇，元素被扩散到更远的地方。"],
    "anemo+hydro": ["扩散", "Swirl", "水元素被风卷起，形成大范围的元素附着。"],
    "anemo+pyro": ["扩散", "Swirl", "火焰借风势蔓延，清场效率很高。"],
    "cryo+electro": ["超导", "Superconduct", "冰与雷让敌人短暂僵直，并降低物理抗性。"],
    "cryo+hydro": ["冻结", "Frozen", "水与冰把敌人困在原地，节奏由你掌控。"],
    "cryo+pyro": ["融化", "Melt", "火克冰，伤害倍率提升，是一次干脆的爆发。"],
    "dendro+electro": ["激化", "Quicken", "草与雷互相激发，提升后续草、雷伤害。"],
    "dendro+hydro": ["绽放", "Bloom", "水与草生成草原核，等待下一次引爆。"],
    "dendro+pyro": ["燃烧", "Burning", "草与火持续燃烧，适合压制密集目标。"],
    "electro+hydro": ["感电", "Electro-Charged", "雷与水在敌群间跳跃，造成持续雷伤。"],
    "electro+pyro": ["超载", "Overloaded", "雷火爆炸，击退周围敌人并造成范围火伤。"],
    "geo+cryo": ["结晶", "Crystallize", "岩与冰凝成护盾晶片，兼顾输出与生存。"],
    "geo+electro": ["结晶", "Crystallize", "岩与雷凝成护盾晶片，提升队伍容错。"],
    "geo+hydro": ["结晶", "Crystallize", "岩与水凝成护盾晶片，让站场更从容。"],
    "geo+pyro": ["结晶", "Crystallize", "岩与火凝成护盾晶片，抵挡下一次冲击。"],
    "hydro+pyro": ["蒸发", "Vaporize", "火与水相遇，伤害倍率提升，是最经典的增幅反应之一。"]
  };

  const RESONANCE = {
    anemo: "风元素共鸣：移动速度提升，技能冷却更短。",
    geo: "岩元素共鸣：护盾强效提升，岩伤更稳。",
    electro: "雷元素共鸣：元素能量恢复更顺畅。",
    dendro: "草元素共鸣：元素精通提升，反应更痛。",
    hydro: "水元素共鸣：生命值上限提升，续航更稳。",
    pyro: "火元素共鸣：攻击力提升，输出更直接。",
    cryo: "冰元素共鸣：暴击率提升，控制更稳定。"
  };

  /* ---------- active nav ---------- */
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$(".nav-links a").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === file || (file === "" && href === "index.html") || (file === "index.html" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  /* ---------- mobile menu ---------- */
  const menuToggle = $(".menu-toggle");
  const navLinks = $(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    $$(".nav-links a").forEach((a) => a.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }));
  }

  /* ---------- starfield ---------- */
  const canvas = $("#starfield");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let stars = [];
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mouseX = 0, mouseY = 0;
    let t = 0;

    const makeStars = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(190, Math.max(80, Math.floor((w * h) / 16000)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.35 + 0.35,
        a: Math.random() * 0.55 + 0.15,
        s: Math.random() * 0.9 + 0.25,
        phase: Math.random() * Math.PI * 2
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const st of stars) {
        const twinkle = 0.55 + 0.45 * Math.sin(t * 0.0008 * st.s + st.phase);
        const px = st.x + mouseX * 4;
        const py = st.y + mouseY * 4;
        ctx.beginPath();
        ctx.arc(px, py, st.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 216, 186, ${st.a * twinkle})`;
        ctx.fill();
      }
      if (!reduceMotion) {
        t += 16;
        requestAnimationFrame(draw);
      }
    };

    makeStars();
    draw();
    window.addEventListener("resize", () => {
      makeStars();
      if (reduceMotion) draw();
    }, { passive: true });
    window.addEventListener("pointermove", (e) => {
      mouseX = (e.clientX / w - 0.5) * 2;
      mouseY = (e.clientY / h - 0.5) * 2;
    }, { passive: true });
  }

  /* ---------- cursor glow ---------- */
  if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);
    document.body.classList.add("has-cursor");
    window.addEventListener("pointermove", (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    }, { passive: true });
  }

  /* ---------- header / progress / back top ---------- */
  const header = $(".site-header");
  const progress = $(".page-progress");
  const backTop = $(".back-top");
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 24);
    if (backTop) backTop.classList.toggle("is-visible", y > 600);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`;
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (backTop) {
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  }

  /* ---------- reveal + counters + skills ---------- */
  const revealEls = $$(".reveal");
  const numberEls = $$("[data-count]");
  const skillEls = $$(".skill-fill");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.classList.contains("reveal")) el.classList.add("is-visible");
        if (el.matches("[data-count]") && !el.dataset.done) {
          el.dataset.done = "1";
          animateNumber(el);
        }
        if (el.classList.contains("skill-fill") && !el.dataset.done) {
          el.dataset.done = "1";
          el.style.width = `${el.dataset.level || 0}%`;
        }
        observer.unobserve(el);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => io.observe(el));
    numberEls.forEach((el) => io.observe(el));
    skillEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    numberEls.forEach(animateNumber);
    skillEls.forEach((el) => { el.style.width = `${el.dataset.level || 0}%`; });
  }

  function animateNumber(el) {
    const target = parseFloat(el.dataset.count || "0");
    const suffix = el.dataset.suffix || "";
    const decimals = Number(el.dataset.decimals || 0);
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = `${val.toFixed(decimals)}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = `${target.toFixed(decimals)}${suffix}`;
    };
    if (reduceMotion) {
      el.textContent = `${target.toFixed(decimals)}${suffix}`;
    } else {
      requestAnimationFrame(tick);
    }
  }

  /* ---------- daily quote ---------- */
  const quotes = [
    ["风会记得每一段旅途，正如我们会记得每一次相遇。", "旅行者手记 · 蒙德"],
    ["契约不是束缚，而是让彼此都能安心前行的约定。", "旅行者手记 · 璃月"],
    ["永恒不是停滞，而是守住值得守护的东西。", "旅行者手记 · 稻妻"],
    ["知识不是答案，而是看见世界的另一扇窗。", "旅行者手记 · 须弥"],
    ["哪怕落幕，也要把最后一幕演好。", "旅行者手记 · 枫丹"],
    ["火焰的意义，是照亮还在前行的人。", "旅行者手记 · 纳塔"]
  ];
  const quoteText = $("[data-daily-quote]");
  if (quoteText) {
    const day = Math.floor(Date.now() / 86400000) % quotes.length;
    quoteText.textContent = quotes[day][0];
    const by = $("[data-daily-by]");
    if (by) by.textContent = quotes[day][1];
  }

  /* ---------- character filter + modal ---------- */
  const filterButtons = $$(".filter-btn");
  const charCards = $$(".char-card");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.toggle("active", b === btn));
      const filter = btn.dataset.filter || "all";
      charCards.forEach((card) => {
        const show = filter === "all" || card.dataset.element === filter;
        card.classList.toggle("char-filter-hidden", !show);
      });
    });
  });

  const modal = $("#char-modal");
  if (modal) {
    const modalImg = $("#modal-img", modal);
    const modalName = $("#modal-name", modal);
    const modalEn = $("#modal-en", modal);
    const modalTitle = $("#modal-title", modal);
    const modalWeapon = $("#modal-weapon", modal);
    const modalConstellation = $("#modal-constellation", modal);
    const modalElement = $("#modal-element", modal);
    const modalQuote = $("#modal-quote", modal);
    const modalDesc = $("#modal-desc", modal);
    const closeBtn = $(".modal-close", modal);
    let lastFocus = null;

    const openModal = (card) => {
      lastFocus = card;
      modalImg.src = card.dataset.splash;
      modalImg.alt = `${card.dataset.name}角色立绘`;
      modalName.textContent = card.dataset.name;
      modalEn.textContent = card.dataset.en;
      modalTitle.textContent = card.dataset.title;
      modalWeapon.textContent = card.dataset.weapon;
      modalConstellation.textContent = card.dataset.constellation;
      modalElement.dataset.element = card.dataset.element;
      modalElement.innerHTML = `<i></i>${card.dataset.elementName}`;
      modalQuote.textContent = `“${card.dataset.quote}”`;
      modalDesc.textContent = card.dataset.desc;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
      closeBtn.focus({ preventScroll: true });
    };

    const closeModal = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    };

    charCards.forEach((card) => card.addEventListener("click", () => openModal(card)));
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }

  /* ---------- element lab ---------- */
  const picker = $("#element-picker");
  const slotA = $("#slot-a");
  const slotB = $("#slot-b");
  const resultPanel = $("#result-panel");
  const reactionName = $("#reaction-name");
  const reactionEn = $("#reaction-en");
  const reactionDesc = $("#reaction-desc");
  const reactionTags = $("#reaction-tags");
  const resetBtn = $(".lab-reset");

  if (picker && slotA && slotB && resultPanel) {
    let selected = ["pyro", "hydro"];
    const keys = Object.keys(ELEMENTS);

    keys.forEach((key) => {
      const el = ELEMENTS[key];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "el-btn";
      btn.dataset.element = key;
      btn.setAttribute("aria-label", `选择${el.name}元素`);
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round">${el.icon}</svg><span>${el.name}</span>`;
      btn.addEventListener("click", () => {
        if (selected.includes(key)) {
          selected = selected.filter((x) => x !== key);
        } else if (selected.length < 2) {
          selected.push(key);
        } else {
          selected = [selected[1], key];
        }
        renderLab();
      });
      picker.appendChild(btn);
    });

    const setSlot = (slot, key) => {
      if (!key) {
        slot.className = "slot";
        slot.innerHTML = "?";
        slot.setAttribute("aria-label", "空元素槽");
        return;
      }
      const el = ELEMENTS[key];
      slot.className = "slot filled";
      slot.style.setProperty("--el", el.color);
      slot.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">${el.icon}</svg>`;
      slot.setAttribute("aria-label", el.name);
    };

    const renderLab = () => {
      setSlot(slotA, selected[0]);
      setSlot(slotB, selected[1]);
      $$(".el-btn", picker).forEach((btn) => {
        btn.classList.toggle("is-selected", selected.includes(btn.dataset.element));
      });

      if (selected.length < 2) {
        resultPanel.style.setProperty("--a", "#6cc7f2");
        resultPanel.style.setProperty("--b", "#d8bc7a");
        reactionName.textContent = "等待元素";
        reactionEn.textContent = "Select two elements";
        reactionDesc.textContent = "再选择一个元素，看看它们在提瓦特会碰撞出什么。";
        reactionTags.innerHTML = "<span>元素实验</span><span>自由组合</span>";
        return;
      }

      const a = selected[0];
      const b = selected[1];
      const ea = ELEMENTS[a], eb = ELEMENTS[b];
      resultPanel.style.setProperty("--a", ea.color);
      resultPanel.style.setProperty("--b", eb.color);

      if (a === b) {
        reactionName.textContent = "元素共鸣";
        reactionEn.textContent = `${ea.en} Resonance`;
        reactionDesc.textContent = RESONANCE[a] || "同种元素彼此呼应，形成队伍增益。";
        reactionTags.innerHTML = `<span>${ea.name}元素</span><span>队伍增益</span><span>双元素</span>`;
      } else {
        const k = [a, b].sort().join("+");
        const r = REACTIONS[k];
        if (r) {
          reactionName.textContent = r[0];
          reactionEn.textContent = r[1];
          reactionDesc.textContent = r[2];
          reactionTags.innerHTML = `<span>${ea.name} + ${eb.name}</span><span>元素反应</span><span>策略搭配</span>`;
        } else {
          reactionName.textContent = "元素共存";
          reactionEn.textContent = "Elemental Coexistence";
          reactionDesc.textContent = "这两种元素在提瓦特没有直接反应，但可以同时存在，等待第三种元素加入。";
          reactionTags.innerHTML = `<span>${ea.name} + ${eb.name}</span><span>无直接反应</span><span>等待组合</span>`;
        }
      }

      resultPanel.classList.remove("burst");
      void resultPanel.offsetWidth;
      resultPanel.classList.add("burst");
    };

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        selected = ["pyro", "hydro"];
        renderLab();
      });
    }
    renderLab();
  }

  /* ---------- deep-link helper (?scroll=section-id) ---------- */
  const scrollId = new URLSearchParams(location.search).get("scroll");
  if (scrollId) {
    const target = document.getElementById(scrollId);
    if (target) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: Math.max(0, target.offsetTop - 80), behavior: "auto" });
      });
    }
  }

  /* ---------- year ---------- */
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
