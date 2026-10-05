(function () {
  "use strict";

  const root = document.getElementById("chronicle");
  if (!root) return;

  const yearEl = root.querySelector("[data-chronicle-year]");
  const eraEl = root.querySelector("[data-chronicle-era]");
  const fillEl = root.querySelector("[data-chronicle-fill]");
  const beadEl = root.querySelector("[data-chronicle-bead]");
  const events = Array.from(root.querySelectorAll(".chronicle__event"));
  const chips = Array.from(root.querySelectorAll(".chronicle__chip"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCompact = () => window.matchMedia("(max-width: 1100px)").matches;

  let activeIndex = 0;
  let yearLock = false;

  function setYear(text, era) {
    if (!yearEl) return;
    if (yearEl.textContent === text) {
      if (eraEl && era) eraEl.textContent = era;
      return;
    }
    if (reduceMotion || yearLock) {
      yearEl.textContent = text;
      if (eraEl && era) eraEl.textContent = era;
      return;
    }
    yearLock = true;
    yearEl.classList.add("is-swap");
    window.setTimeout(() => {
      yearEl.textContent = text;
      if (eraEl && era) eraEl.textContent = era;
      yearEl.classList.remove("is-swap");
      yearLock = false;
    }, 160);
  }

  function setProgress(ratio) {
    const pct = Math.max(0, Math.min(1, ratio)) * 100;
    if (!fillEl || !beadEl) return;
    if (isCompact()) {
      fillEl.style.width = pct + "%";
      fillEl.style.height = "100%";
      beadEl.style.left = pct + "%";
      beadEl.style.top = "50%";
    } else {
      fillEl.style.height = pct + "%";
      fillEl.style.width = "100%";
      beadEl.style.top = pct + "%";
      beadEl.style.left = "50%";
    }
  }

  function activate(index, fromChip) {
    activeIndex = Math.max(0, Math.min(events.length - 1, index));
    events.forEach((el, i) => {
      el.classList.toggle("is-active", i === activeIndex);
    });
    const current = events[activeIndex];
    if (current) {
      setYear(current.dataset.year || "", current.dataset.era || "");
      const eraKey = current.dataset.eraKey || "";
      chips.forEach((chip) => {
        chip.classList.toggle("is-active", chip.dataset.eraKey === eraKey);
      });
    }
    setProgress(events.length <= 1 ? 1 : activeIndex / (events.length - 1));
    if (fromChip && current) {
      current.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    }
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-in");
      });
    },
    { threshold: 0.28, rootMargin: "0px 0px -10% 0px" }
  );
  events.forEach((el) => io.observe(el));

  const activeIo = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const idx = events.indexOf(visible.target);
      if (idx >= 0) activate(idx, false);
    },
    { threshold: [0.35, 0.55, 0.75], rootMargin: "-20% 0px -35% 0px" }
  );
  events.forEach((el) => activeIo.observe(el));

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const key = chip.dataset.eraKey;
      const idx = events.findIndex((el) => el.dataset.eraKey === key);
      if (idx >= 0) activate(idx, true);
    });
  });

  window.addEventListener("resize", () => setProgress(events.length <= 1 ? 1 : activeIndex / (events.length - 1)));
  activate(0, false);
})();
