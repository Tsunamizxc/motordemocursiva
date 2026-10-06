(function () {
  "use strict";
  const cars = (window.ANTIKOR_CARS || []).map((car, index) => ({
    ...car,
    _index: index,
  }));
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

  const initialBrand = params.get("brand") || "";
  const initialType = params.get("type") || "";

  const state = {
    brands: initialBrand ? [initialBrand] : [],
    types: initialType ? [initialType] : [],
    bodies: [],
    fuels: [],
    transmissions: [],
    drives: [],
    priceFrom: "",
    priceTo: "",
    yearFrom: "",
    yearTo: "",
    mileageTo: "",
    hpFrom: "",
    sort: "price",
    sortDir: "asc",
    view: "grid",
    page: 1,
    accumulate: false,
  };

  let filtered = [];
  const $ = (id) => document.getElementById(id);

  function countBy(key) {
    const map = {};
    cars.forEach((c) => {
      const v = c[key];
      if (!v && v !== 0) return;
      map[v] = (map[v] || 0) + 1;
    });
    return map;
  }

  function uniqueSorted(key) {
    return [...new Set(cars.map((c) => c[key]).filter(Boolean))].sort((a, b) =>
      String(a).localeCompare(String(b), "ru")
    );
  }

  function renderCheckList(containerId, values, name, selected, counts) {
    const el = $(containerId);
    if (!el) return;
    el.innerHTML = values
      .map((value) => {
        const checked = selected.includes(value) ? " checked" : "";
        const count = counts[value] || 0;
        return `<label class="filter-check">
          <input type="checkbox" name="${name}" value="${value}"${checked} />
          <span>${value}</span>
          <em>${count}</em>
        </label>`;
      })
      .join("");
  }

  function buildFilterLists() {
    const brandCounts = countBy("brand");
    renderCheckList("fBrandList", uniqueSorted("brand"), "fBrand", state.brands, brandCounts);
    renderCheckList("fBodyList", uniqueSorted("body"), "fBody", state.bodies, countBy("body"));
    renderCheckList("fFuelList", uniqueSorted("fuel"), "fFuel", state.fuels, countBy("fuel"));
    renderCheckList(
      "fTransmissionList",
      uniqueSorted("transmission"),
      "fTransmission",
      state.transmissions,
      countBy("transmission")
    );
    renderCheckList("fDriveList", uniqueSorted("drive"), "fDrive", state.drives, countBy("drive"));

    const typeCounts = countBy("type");
    document.querySelectorAll("#fTypeList [data-count]").forEach((em) => {
      em.textContent = typeCounts[em.dataset.count] || 0;
    });
    document.querySelectorAll('#fTypeList input[name="fType"]').forEach((input) => {
      input.checked = state.types.includes(input.value);
    });
  }

  buildFilterLists();

  document.querySelectorAll(".filter-acc__head").forEach((btn) => {
    btn.addEventListener("click", () => {
      const acc = btn.closest(".filter-acc");
      if (!acc) return;
      const open = acc.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  function checkedValues(name) {
    return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((el) => el.value);
  }

  function readFilters() {
    state.brands = checkedValues("fBrand");
    state.types = checkedValues("fType");
    state.bodies = checkedValues("fBody");
    state.fuels = checkedValues("fFuel");
    state.transmissions = checkedValues("fTransmission");
    state.drives = checkedValues("fDrive");
    state.priceFrom = $("fPriceFrom")?.value || "";
    state.priceTo = $("fPriceTo")?.value || "";
    state.yearFrom = $("fYearFrom")?.value || "";
    state.yearTo = $("fYearTo")?.value || "";
    state.mileageTo = $("fMileageTo")?.value || "";
    state.hpFrom = $("fHpFrom")?.value || "";
  }

  function sortList(list) {
    const dir = state.sortDir === "desc" ? -1 : 1;
    const sorted = [...list];
    sorted.sort((a, b) => {
      let av;
      let bv;
      switch (state.sort) {
        case "date":
          av = a._index;
          bv = b._index;
          break;
        case "year":
          av = a.year;
          bv = b.year;
          break;
        case "mileage":
          av = a.mileage;
          bv = b.mileage;
          break;
        case "price":
        default:
          av = a.price;
          bv = b.price;
          break;
      }
      if (av === bv) return a._index - b._index;
      return av > bv ? dir : -dir;
    });
    return sorted;
  }

  function filterCars() {
    readFilters();
    const list = cars.filter((c) => {
      if (state.brands.length && !state.brands.includes(c.brand)) return false;
      if (state.types.length && !state.types.includes(c.type)) return false;
      if (state.bodies.length && !state.bodies.includes(c.body)) return false;
      if (state.fuels.length && !state.fuels.includes(c.fuel)) return false;
      if (state.transmissions.length && !state.transmissions.includes(c.transmission)) return false;
      if (state.drives.length && !state.drives.includes(c.drive)) return false;
      if (state.priceFrom && c.price < +state.priceFrom) return false;
      if (state.priceTo && c.price > +state.priceTo) return false;
      if (state.yearFrom && c.year < +state.yearFrom) return false;
      if (state.yearTo && c.year > +state.yearTo) return false;
      if (state.mileageTo && c.mileage > +state.mileageTo) return false;
      if (state.hpFrom && c.hp < +state.hpFrom) return false;
      return true;
    });
    return sortList(list);
  }

  function totalPages() {
    return Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  }

  function visibleList() {
    if (state.accumulate) return filtered.slice(0, state.page * PAGE_SIZE);
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
          <div class="cat-card__meta">
            <span>${formatMileage(c.mileage)}</span>
            <span>${c.transmission}</span>
          </div>
          <div class="cat-card__price">${formatPrice(c.price)}</div>
          <span class="cat-card__credit">от ${formatPrice(c.credit).replace(" ₽", "")} ₽/мес.</span>
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

  function updateToolbar() {
    if (countEl) {
      countEl.innerHTML = `Найдено машин: <strong>${filtered.length}</strong>`;
    }
    grid.dataset.view = state.view;
    grid.classList.toggle("catalog-results--list", state.view === "list");
    document.querySelectorAll(".catalog-view").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.view === state.view);
    });
    document.querySelectorAll(".catalog-sort").forEach((btn) => {
      const active = btn.dataset.sort === state.sort;
      btn.classList.toggle("is-active", active);
      btn.dataset.dir = active ? state.sortDir : "";
    });
  }

  function render() {
    updateToolbar();
    const list = visibleList();

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
    if (scroll) grid.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function applyFilters() {
    filtered = filterCars();
    state.page = 1;
    state.accumulate = false;
    render();

    const url = new URL(location.href);
    if (state.brands.length === 1) url.searchParams.set("brand", state.brands[0]);
    else url.searchParams.delete("brand");
    if (state.types.length === 1) url.searchParams.set("type", state.types[0]);
    else url.searchParams.delete("type");
    history.replaceState(null, "", url);
  }

  document.getElementById("filtersPanel")?.addEventListener("change", (e) => {
    if (e.target.matches('input[type="checkbox"], input[type="number"]')) applyFilters();
  });
  document.getElementById("filtersPanel")?.addEventListener("input", (e) => {
    if (e.target.matches('input[type="number"]')) applyFilters();
  });

  moreBtn?.addEventListener("click", () => {
    if (shownCount() >= filtered.length) return;
    if (!state.accumulate) state.accumulate = true;
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

  document.querySelectorAll(".catalog-sort").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.sort;
      if (state.sort === key) {
        state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      } else {
        state.sort = key;
        state.sortDir = key === "date" ? "desc" : "asc";
      }
      applyFilters();
    });
  });

  document.querySelectorAll(".catalog-view").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.view = btn.dataset.view || "grid";
      updateToolbar();
    });
  });

  $("fReset")?.addEventListener("click", () => {
    document.querySelectorAll('#filtersPanel input[type="checkbox"]').forEach((el) => {
      el.checked = false;
    });
    ["fPriceFrom", "fPriceTo", "fYearFrom", "fYearTo", "fMileageTo", "fHpFrom"].forEach((id) => {
      if ($(id)) $(id).value = "";
    });
    state.brands = [];
    state.types = [];
    state.bodies = [];
    state.fuels = [];
    state.transmissions = [];
    state.drives = [];
    state.sort = "price";
    state.sortDir = "asc";
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
