(function () {
  "use strict";
  const cars = window.ANTIKOR_CARS || [];
  const grid = document.getElementById("catalogGrid");
  const countEl = document.getElementById("catalogCount");
  const footEl = document.getElementById("catalogFoot");
  const moreBtn = document.getElementById("catalogMore");
  const pagerEl = document.getElementById("catalogPager");
  if (!grid) return;

  const PAGE_SIZE = 9;
  const params = new URLSearchParams(location.search);
  const formatPrice = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
  const formatMileage = (n) =>
    n === 0 ? "Новый" : n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " км";

  const state = {
    brand: params.get("brand") || "",
    type: params.get("type") || "",
    model: "",
    body: "",
    fuel: "",
    transmission: "",
    drive: "",
    priceFrom: "",
    priceTo: "",
    yearFrom: "",
    yearTo: "",
    mileageTo: "",
    hpFrom: "",
    page: 1,
    accumulate: false,
  };

  let filtered = [];

  const $ = (id) => document.getElementById(id);

  function fillSelect(id, values, placeholder) {
    const el = $(id);
    if (!el) return;
    el.innerHTML =
      `<option value="">${placeholder}</option>` +
      values.map((v) => `<option value="${v}">${v}</option>`).join("");
  }

  function unique(key) {
    return [...new Set(cars.map((c) => c[key]).filter(Boolean))].sort();
  }

  fillSelect("fBrand", unique("brand"), "Все марки");
  fillSelect("fBody", unique("body"), "Любой");
  fillSelect("fFuel", unique("fuel"), "Любой");
  fillSelect("fTransmission", unique("transmission"), "Любая");
  fillSelect("fDrive", unique("drive"), "Любой");

  function updateModels() {
    const brand = $("fBrand")?.value || state.brand;
    const models = [
      ...new Set(
        cars
          .filter((c) => !brand || c.brand === brand)
          .map((c) => c.model)
      ),
    ].sort();
    fillSelect("fModel", models, "Все модели");
  }
  updateModels();

  if (state.brand && $("fBrand")) $("fBrand").value = state.brand;
  if (state.type && $("fType")) $("fType").value = state.type;

  document.querySelectorAll(".brand-pill").forEach((pill) => {
    const b = pill.dataset.brand || "";
    if (b === state.brand) pill.classList.add("is-active");
    pill.addEventListener("click", () => {
      document.querySelectorAll(".brand-pill").forEach((p) => p.classList.remove("is-active"));
      pill.classList.add("is-active");
      state.brand = b;
      if ($("fBrand")) $("fBrand").value = b;
      updateModels();
      applyFilters();
    });
  });

  function readFilters() {
    state.brand = $("fBrand")?.value || "";
    state.model = $("fModel")?.value || "";
    state.body = $("fBody")?.value || "";
    state.fuel = $("fFuel")?.value || "";
    state.transmission = $("fTransmission")?.value || "";
    state.drive = $("fDrive")?.value || "";
    state.type = $("fType")?.value || state.type;
    state.priceFrom = $("fPriceFrom")?.value || "";
    state.priceTo = $("fPriceTo")?.value || "";
    state.yearFrom = $("fYearFrom")?.value || "";
    state.yearTo = $("fYearTo")?.value || "";
    state.mileageTo = $("fMileageTo")?.value || "";
    state.hpFrom = $("fHpFrom")?.value || "";
  }

  function filterCars() {
    readFilters();
    return cars.filter((c) => {
      if (state.brand && c.brand !== state.brand) return false;
      if (state.model && c.model !== state.model) return false;
      if (state.body && c.body !== state.body) return false;
      if (state.fuel && c.fuel !== state.fuel) return false;
      if (state.transmission && c.transmission !== state.transmission) return false;
      if (state.drive && c.drive !== state.drive) return false;
      if (state.type && c.type !== state.type) return false;
      if (state.priceFrom && c.price < +state.priceFrom) return false;
      if (state.priceTo && c.price > +state.priceTo) return false;
      if (state.yearFrom && c.year < +state.yearFrom) return false;
      if (state.yearTo && c.year > +state.yearTo) return false;
      if (state.mileageTo && c.mileage > +state.mileageTo) return false;
      if (state.hpFrom && c.hp < +state.hpFrom) return false;
      return true;
    });
  }

  function totalPages() {
    return Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  }

  function visibleList() {
    if (state.accumulate) {
      return filtered.slice(0, state.page * PAGE_SIZE);
    }
    const start = (state.page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }

  function shownCount() {
    return visibleList().length;
  }

  function cardHtml(c) {
    return `
      <article class="cat-card">
        <div class="cat-card__media">
          <a href="car.html?id=${c.id}"><img src="${c.img}" alt="${c.brand} ${c.model}" loading="lazy" /></a>
          <div class="cat-card__badges">
            ${(c.badges || []).slice(0, 2).map((b) => `<span class="cat-card__badge">${b}</span>`).join("")}
          </div>
        </div>
        <div class="cat-card__body">
          <h3 class="cat-card__title"><a href="car.html?id=${c.id}">${c.brand} ${c.model} ${c.year}</a></h3>
          <div class="cat-card__specs">
            <div class="cat-card__spec"><strong>${c.engine}</strong>объем</div>
            <div class="cat-card__spec"><strong>${c.hp} л.с.</strong>мощность</div>
            <div class="cat-card__spec"><strong>${c.fuel}</strong>топливо</div>
            <div class="cat-card__spec"><strong>${c.drive}</strong>привод</div>
          </div>
          <div class="cat-card__price">${formatPrice(c.price)}</div>
          <span class="cat-card__credit">от ${formatPrice(c.credit).replace(" ₽", "")} ₽/мес. · ${formatMileage(c.mileage)}</span>
          <div class="car-card__actions">
            <button class="btn btn--accent" type="button" data-open-modal="credit" data-credit-price="${c.price}">Рассчитать кредит</button>
            <div class="car-card__links">
              <a href="https://www.drom.ru/" target="_blank" rel="noopener">На drom.ru</a>
              <a href="car.html?id=${c.id}">Подробнее</a>
            </div>
          </div>
        </div>
      </article>`;
  }

  function bindCreditButtons() {
    document.querySelectorAll('#catalogGrid [data-open-modal="credit"]').forEach((el) => {
      if (el.dataset.creditBound) return;
      el.dataset.creditBound = "1";
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const price = el.dataset.creditPrice ? +el.dataset.creditPrice : undefined;
        window.openCreditModal?.(price);
      });
    });
  }

  function pagerPages(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, total, current, current - 1, current + 1]);
    if (current <= 3) [2, 3, 4].forEach((n) => pages.add(n));
    if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => pages.add(n));
    return [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  }

  function renderPager() {
    if (!pagerEl || !footEl || !moreBtn) return;

    const total = filtered.length;
    const pages = totalPages();
    const shown = shownCount();
    const hasMore = shown < total;

    if (!total || (pages <= 1 && !hasMore)) {
      footEl.hidden = true;
      return;
    }

    footEl.hidden = false;
    moreBtn.hidden = !hasMore;
    moreBtn.textContent = hasMore
      ? `Показать ещё ${Math.min(PAGE_SIZE, total - shown)}`
      : "Показать ещё";

    const activePage = state.accumulate
      ? Math.min(pages, Math.ceil(shown / PAGE_SIZE) || 1)
      : state.page;

    const nums = pagerPages(activePage, pages);
    let html = `<button class="catalog-pager__btn" type="button" data-page="prev" aria-label="Предыдущая" ${activePage <= 1 ? "disabled" : ""}>‹</button>`;
    nums.forEach((n, i) => {
      if (i > 0 && n - nums[i - 1] > 1) {
        html += `<span class="catalog-pager__ellipsis" aria-hidden="true">…</span>`;
      }
      html += `<button class="catalog-pager__btn${n === activePage ? " is-active" : ""}" type="button" data-page="${n}" aria-label="Страница ${n}" ${n === activePage ? 'aria-current="page"' : ""}>${n}</button>`;
    });
    html += `<button class="catalog-pager__btn" type="button" data-page="next" aria-label="Следующая" ${activePage >= pages ? "disabled" : ""}>›</button>`;
    pagerEl.innerHTML = html;
  }

  function render() {
    const list = visibleList();
    if (countEl) {
      countEl.textContent = filtered.length
        ? `Найдено: ${filtered.length} · показано ${shownCount()}`
        : "Найдено: 0";
    }

    if (!filtered.length) {
      grid.innerHTML =
        '<div class="catalog-empty">По заданным фильтрам ничего не найдено. Измените параметры поиска.</div>';
      if (footEl) footEl.hidden = true;
      return;
    }

    grid.innerHTML = list.map(cardHtml).join("");
    bindCreditButtons();
    renderPager();
  }

  function goToPage(page, { accumulate = false, scroll = true } = {}) {
    const pages = totalPages();
    state.page = Math.min(Math.max(1, page), pages);
    state.accumulate = accumulate;
    render();
    if (scroll) {
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function applyFilters() {
    filtered = filterCars();
    state.page = 1;
    state.accumulate = false;
    render();
    const url = new URL(location.href);
    if (state.brand) url.searchParams.set("brand", state.brand);
    else url.searchParams.delete("brand");
    if (state.type) url.searchParams.set("type", state.type);
    else url.searchParams.delete("type");
    history.replaceState(null, "", url);
  }

  moreBtn?.addEventListener("click", () => {
    if (shownCount() >= filtered.length) return;
    if (!state.accumulate) {
      state.accumulate = true;
    }
    state.page += 1;
    render();
  });

  pagerEl?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn || btn.disabled || btn.classList.contains("is-active")) return;
    const pages = totalPages();
    const activePage = state.accumulate
      ? Math.min(pages, Math.ceil(shownCount() / PAGE_SIZE) || 1)
      : state.page;
    let next = btn.dataset.page;
    if (next === "prev") next = activePage - 1;
    else if (next === "next") next = activePage + 1;
    else next = +next;
    goToPage(next, { accumulate: false, scroll: true });
  });

  $("fBrand")?.addEventListener("change", () => {
    state.brand = $("fBrand").value;
    document.querySelectorAll(".brand-pill").forEach((p) => {
      p.classList.toggle("is-active", (p.dataset.brand || "") === state.brand);
    });
    updateModels();
    applyFilters();
  });

  [
    "fModel",
    "fBody",
    "fFuel",
    "fTransmission",
    "fDrive",
    "fType",
    "fPriceFrom",
    "fPriceTo",
    "fYearFrom",
    "fYearTo",
    "fMileageTo",
    "fHpFrom",
  ].forEach((id) => {
    $(id)?.addEventListener("change", applyFilters);
    $(id)?.addEventListener("input", applyFilters);
  });

  $("fReset")?.addEventListener("click", () => {
    ["fBrand", "fModel", "fBody", "fFuel", "fTransmission", "fDrive", "fType"].forEach((id) => {
      if ($(id)) $(id).value = "";
    });
    ["fPriceFrom", "fPriceTo", "fYearFrom", "fYearTo", "fMileageTo", "fHpFrom"].forEach((id) => {
      if ($(id)) $(id).value = "";
    });
    state.type = "";
    state.brand = "";
    document.querySelectorAll(".brand-pill").forEach((p) => p.classList.remove("is-active"));
    document.querySelector('.brand-pill[data-brand=""]')?.classList.add("is-active");
    updateModels();
    applyFilters();
  });

  const filtersPanel = document.getElementById("filtersPanel");
  const filtersToggle = document.getElementById("filtersToggle");
  filtersToggle?.addEventListener("click", () => {
    const open = filtersPanel?.classList.toggle("is-open");
    filtersToggle.setAttribute("aria-expanded", open ? "true" : "false");
    filtersToggle.textContent = open ? "Скрыть фильтры" : "Фильтры";
  });
  $("fShow")?.addEventListener("click", () => {
    applyFilters();
    if (window.matchMedia("(max-width: 1100px)").matches && filtersPanel?.classList.contains("is-open")) {
      filtersPanel.classList.remove("is-open");
      if (filtersToggle) {
        filtersToggle.setAttribute("aria-expanded", "false");
        filtersToggle.textContent = "Фильтры";
      }
    }
  });

  applyFilters();
})();
