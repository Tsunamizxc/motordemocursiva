(function () {
  "use strict";
  const cars = window.ANTIKOR_CARS || [];
  const id = new URLSearchParams(location.search).get("id") || cars[0]?.id;
  const car = cars.find((c) => c.id === id) || cars[0];
  if (!car) return;

  const formatPrice = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
  const formatNum = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  document.title = `${car.brand} ${car.model} — Антикор-Сервис`;
  const title = document.getElementById("carTitle");
  const crumbs = document.getElementById("carCrumbs");
  if (title) {
    title.textContent = `${car.brand} ${car.model} ${car.engine} ${car.transmission} (${car.hp} л.с.) ${car.year} года${
      car.mileage ? ` с пробегом ${formatNum(car.mileage)} км` : ""
    }`;
  }
  if (crumbs) {
    crumbs.innerHTML = `
      <a href="index.html">Главная</a><span aria-hidden="true">•</span>
      <a href="catalog.html">Каталог</a><span aria-hidden="true">•</span>
      <a href="catalog.html?brand=${encodeURIComponent(car.brand)}">${car.brand}</a><span aria-hidden="true">•</span>
      <span>${car.model}</span>`;
  }

  const mainImg = document.getElementById("carMainImg");
  const thumbs = document.getElementById("carThumbs");
  const gallery = car.gallery || [car.img];
  let gi = 0;
  function show(i) {
    gi = (i + gallery.length) % gallery.length;
    if (mainImg) mainImg.src = gallery[gi];
    thumbs?.querySelectorAll("button").forEach((b, idx) => b.classList.toggle("is-active", idx === gi));
  }
  if (thumbs) {
    thumbs.innerHTML = gallery
      .map(
        (src, i) =>
          `<button type="button" class="${i === 0 ? "is-active" : ""}" data-i="${i}"><img src="${src}" alt="" /></button>`
      )
      .join("");
    thumbs.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      show(+btn.dataset.i);
    });
  }
  document.getElementById("galPrev")?.addEventListener("click", () => show(gi - 1));
  document.getElementById("galNext")?.addEventListener("click", () => show(gi + 1));
  show(0);

  const priceEl = document.getElementById("carPrice");
  const monthEl = document.getElementById("carMonth");
  if (priceEl) priceEl.textContent = formatPrice(car.price);
  if (monthEl) monthEl.textContent = `от ${formatPrice(car.credit).replace(" ₽", "")} ₽/мес.`;
  document.querySelectorAll('[data-open-modal="credit"]').forEach((btn) => {
    btn.dataset.creditPrice = String(car.price);
  });

  const specs = document.getElementById("carSpecs");
  if (specs) {
    const rows = [
      ["Год выпуска", car.year],
      ["Пробег", car.mileage ? `${formatNum(car.mileage)} км` : "Новый"],
      ["Кузов", car.body],
      ["Двигатель", car.fuel],
      ["Коробка", car.transmission],
      ["Цвет", car.color],
      ["Привод", car.drive],
      ["Объём", car.engine],
      ["Мощность", `${car.hp} л.с.`],
      ["Владельцев", car.owners || "—"],
    ];
    specs.innerHTML = rows
      .map(
        ([k, v]) =>
          `<div class="specs-table__row"><span>${k}</span><strong>${v}</strong></div>`
      )
      .join("");
  }

  const equip = document.getElementById("carEquip");
  if (equip) {
    equip.innerHTML = (car.equipment || [])
      .map(
        (block, i) => `
      <details class="equip-item" ${i === 0 ? "open" : ""}>
        <summary>${block.title} <span>${block.items.length}</span></summary>
        <ul>${block.items.map((it) => `<li>${it}</li>`).join("")}</ul>
      </details>`
      )
      .join("");
  }

  /* Credit calculator */
  const price = car.price;
  const rate = 0.149 / 12;
  let downPct = 0;
  let years = 8;
  const downValue = document.getElementById("downValue");
  const downRange = document.getElementById("downRange");
  const paymentEl = document.getElementById("calcPayment");

  function calc() {
    const down = Math.round((price * downPct) / 100);
    if (downValue) downValue.textContent = formatPrice(down);
    const loan = Math.max(0, price - down);
    const n = years * 12;
    const pay =
      loan === 0
        ? 0
        : Math.round((loan * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1));
    if (paymentEl) paymentEl.textContent = `от ${formatPrice(pay).replace(" ₽", "")} ₽/мес`;
  }

  downRange?.addEventListener("input", () => {
    downPct = +downRange.value;
    calc();
  });
  document.querySelectorAll(".term-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".term-pill").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      years = +btn.dataset.years;
      calc();
    });
  });
  calc();
})();
