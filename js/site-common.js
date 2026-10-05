(function () {
  "use strict";

  const header = document.getElementById("siteHeader");
  if (header && document.body.classList.contains("page-inner")) {
    header.classList.add("is-solid");
  }

  document.querySelectorAll(".mobile-drawer__group > button").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.classList.toggle("is-open");
    });
  });

  function ensureCreditModal() {
    if (document.getElementById("modalCredit")) return document.getElementById("modalCredit");
    const wrap = document.createElement("div");
    wrap.innerHTML = `
  <div class="modal modal--credit" id="modalCredit" aria-hidden="true">
    <div class="modal__backdrop" data-close-credit></div>
    <div class="modal__dialog modal__dialog--credit" role="dialog" aria-modal="true" aria-labelledby="creditModalTitle">
      <button class="modal__close" type="button" data-close-credit aria-label="Закрыть">×</button>
      <h2 id="creditModalTitle">Рассчитать кредит</h2>
      <p class="modal-credit__lead">Подберите взнос и срок — оставьте заявку, менеджер перезвонит с точным предложением.</p>
      <div class="modal-credit">
        <div class="modal-credit__calc">
          <label class="modal-credit__label">Стоимость автомобиля, ₽</label>
          <input class="modal-credit__input" id="mcPrice" type="number" value="2200000" min="300000" step="10000" />
          <label class="modal-credit__label">Первоначальный взнос: <strong id="mcDownValue">0 ₽</strong></label>
          <input id="mcDownRange" type="range" min="0" max="80" value="20" />
          <div class="modal-credit__range-meta"><span>0%</span><span>80%</span></div>
          <label class="modal-credit__label">Срок кредита</label>
          <div class="term-pills" id="mcTerms">
            <button class="term-pill" type="button" data-years="1">1 год</button>
            <button class="term-pill" type="button" data-years="3">3 года</button>
            <button class="term-pill" type="button" data-years="5">5 лет</button>
            <button class="term-pill is-active" type="button" data-years="7">7 лет</button>
            <button class="term-pill" type="button" data-years="8">8 лет</button>
          </div>
          <div class="modal-credit__result">
            <span>Ежемесячный платёж</span>
            <strong id="mcPayment">от 0 ₽/мес</strong>
          </div>
        </div>
        <form class="modal-credit__form lead-form" id="creditLeadForm">
          <label class="input-pill"><span class="sr-only">Имя</span><input type="text" name="name" placeholder="Как вас зовут?" required /></label>
          <label class="input-pill"><span class="sr-only">Телефон</span><input type="tel" name="phone" placeholder="+7 (___) ___-__-__" required /></label>
          <label class="check"><input type="checkbox" required checked /><span>Согласен на обработку персональных данных</span></label>
          <button class="btn btn--accent btn--block" type="submit">Оставить заявку</button>
        </form>
      </div>
      <img class="modal-credit__car" src="assets/cars/car-right2.png" alt="" aria-hidden="true" />
    </div>
  </div>`;
    document.body.appendChild(wrap.firstElementChild);
    return document.getElementById("modalCredit");
  }

  function formatRub(n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
  }

  function initCreditModalLogic(modal) {
    if (!modal || modal.dataset.inited) return;
    modal.dataset.inited = "1";

    let years = 7;
    const rate = 0.149 / 12;
    const priceInput = modal.querySelector("#mcPrice");
    const downRange = modal.querySelector("#mcDownRange");
    const downValue = modal.querySelector("#mcDownValue");
    const paymentEl = modal.querySelector("#mcPayment");

    function calc() {
      const price = Math.max(0, +priceInput.value || 0);
      const downPct = +downRange.value || 0;
      const down = Math.round((price * downPct) / 100);
      downValue.textContent = formatRub(down);
      const loan = Math.max(0, price - down);
      const n = years * 12;
      const pay =
        loan === 0
          ? 0
          : Math.round((loan * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1));
      paymentEl.textContent = `от ${formatRub(pay).replace(" ₽", "")} ₽/мес`;
    }

    priceInput?.addEventListener("input", calc);
    downRange?.addEventListener("input", calc);
    modal.querySelectorAll("#mcTerms .term-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        modal.querySelectorAll("#mcTerms .term-pill").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        years = +btn.dataset.years || 7;
        calc();
      });
    });
    calc();

    window.openCreditModal = function openCreditModal(price) {
      if (price && priceInput) priceInput.value = String(price);
      calc();
      modal.classList.remove("is-closing");
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    window.closeCreditModal = function closeCreditModal() {
      if (!modal.classList.contains("is-open")) return;
      modal.classList.add("is-closing");
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      setTimeout(() => {
        modal.classList.remove("is-closing");
        const anyOpen = document.querySelector(".modal.is-open");
        if (!anyOpen) document.body.style.overflow = "";
      }, 400);
    };

    modal.querySelectorAll("[data-close-credit]").forEach((el) =>
      el.addEventListener("click", window.closeCreditModal)
    );

    modal.querySelector("#creditLeadForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      e.target.reset();
      window.closeCreditModal();
      const toast = document.getElementById("toast");
      if (toast) {
        toast.hidden = false;
        setTimeout(() => (toast.hidden = true), 2800);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") window.closeCreditModal();
    });
  }

  const creditModal = ensureCreditModal();
  initCreditModalLogic(creditModal);

  document.querySelectorAll('[data-open-modal="credit"]').forEach((el) => {
    if (el.dataset.creditBound) return;
    el.dataset.creditBound = "1";
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const price = el.dataset.creditPrice ? +el.dataset.creditPrice : undefined;
      window.openCreditModal?.(price);
    });
  });

  /* Page credit calculator (credit.html) */
  (function initPageCreditCalc() {
    const root = document.getElementById("pageCreditCalc");
    if (!root) return;
    const priceInput = document.getElementById("pcPrice");
    const downRange = document.getElementById("pcDownRange");
    const downValue = document.getElementById("pcDownValue");
    const paymentEl = document.getElementById("pcPayment");
    const terms = document.getElementById("pcTerms");
    if (!priceInput || !downRange || !downValue || !paymentEl || !terms) return;

    let years = 3;
    const rate = 0.149 / 12;
    const format = (n) =>
      Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";

    function calc() {
      const price = Math.max(0, +priceInput.value || 0);
      const downPct = +downRange.value || 0;
      const down = Math.round((price * downPct) / 100);
      downValue.textContent = format(down);
      const loan = Math.max(0, price - down);
      const n = years * 12;
      const pay =
        loan === 0
          ? 0
          : Math.round((loan * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1));
      paymentEl.textContent = `от ${format(pay).replace(" ₽", "")} ₽/мес`;
    }

    priceInput.addEventListener("input", calc);
    downRange.addEventListener("input", calc);
    terms.querySelectorAll(".term-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        terms.querySelectorAll(".term-pill").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        years = +btn.dataset.years || 3;
        calc();
      });
    });
    calc();
  })();

  /* callback + burger for inner pages */
  if (document.body.classList.contains("page-inner")) {
    const modal = document.getElementById("modalCallback");
    if (modal && !window.__antikorModalBound) {
      window.__antikorModalBound = true;
      const open = () => {
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      };
      const close = () => {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      };
      document.querySelectorAll('[data-open-modal="callback"]').forEach((el) =>
        el.addEventListener("click", open)
      );
      document.querySelectorAll("[data-close-modal]").forEach((el) =>
        el.addEventListener("click", close)
      );
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });
      document.querySelectorAll("form.lead-form, #callbackForm").forEach((form) => {
        if (form.id === "creditLeadForm") return;
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          form.reset();
          close();
          window.closeCreditModal?.();
          const toast = document.getElementById("toast");
          if (toast) {
            toast.hidden = false;
            setTimeout(() => (toast.hidden = true), 2800);
          }
        });
      });
    }

    const burger = document.getElementById("burgerBtn");
    const drawer = document.getElementById("mobileDrawer");
    if (burger && drawer && !burger.dataset.bound) {
      burger.dataset.bound = "1";
      const openDrawer = () => {
        drawer.classList.add("is-open");
        drawer.setAttribute("aria-hidden", "false");
        burger.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
      };
      const closeDrawer = () => {
        drawer.classList.remove("is-open");
        drawer.setAttribute("aria-hidden", "true");
        burger.setAttribute("aria-expanded", "false");
        if (!document.querySelector(".modal.is-open")) document.body.style.overflow = "";
      };
      burger.addEventListener("click", () => {
        if (drawer.classList.contains("is-open")) closeDrawer();
        else openDrawer();
      });
      drawer.querySelectorAll("[data-close-drawer]").forEach((el) =>
        el.addEventListener("click", closeDrawer)
      );
    }
  }
})();
