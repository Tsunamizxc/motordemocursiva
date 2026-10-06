(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const cars = [
    {
      brand: "HAVAL",
      model: "Jolion",
      year: 2025,
      engine: "1.5 л",
      hp: "150 л.с.",
      fuel: "Бензин",
      drive: "Передний",
      price: 2149000,
      credit: 18990,
      img: "assets/cars/car1.png",
      logo: "assets/partners/haval.webp",
      detail: "car.html?id=jolion",
      drom: "https://www.drom.ru/",
    },
    {
      brand: "HAVAL",
      model: "Dargo",
      year: 2025,
      engine: "2.0 л",
      hp: "192 л.с.",
      fuel: "Бензин",
      drive: "Полный",
      price: 2899000,
      credit: 24990,
      img: "assets/cars/car-right2.png",
      logo: "assets/partners/haval.webp",
      detail: "car.html?id=dargo",
      drom: "https://www.drom.ru/",
    },
    {
      brand: "HAVAL",
      model: "M6",
      year: 2025,
      engine: "1.5 л",
      hp: "150 л.с.",
      fuel: "Бензин",
      drive: "Передний",
      price: 1999000,
      credit: 17490,
      img: "assets/cars/car-left.webp",
      logo: "assets/partners/haval.webp",
      detail: "car.html?id=m6",
      drom: "https://www.drom.ru/",
    },
    {
      brand: "GEELY",
      model: "Coolray",
      year: 2025,
      engine: "1.5 л",
      hp: "177 л.с.",
      fuel: "Бензин",
      drive: "Передний",
      price: 2349000,
      credit: 20490,
      img: "assets/cars/car-right.webp",
      logo: "assets/partners/geely.webp",
      detail: "car.html?id=coolray",
      drom: "https://www.drom.ru/",
    },
    {
      brand: "TENET",
      model: "T4",
      year: 2025,
      engine: "1.5 л",
      hp: "147 л.с.",
      fuel: "Бензин",
      drive: "Полный",
      price: 2249000,
      credit: 19490,
      img: "assets/cars/car1.png",
      logo: "assets/partners/tenet.webp",
      detail: "car.html?id=t4",
      drom: "https://www.drom.ru/",
    },
    {
      brand: "TENET",
      model: "T7",
      year: 2025,
      engine: "1.6 л",
      hp: "150 л.с.",
      fuel: "Бензин",
      drive: "Полный",
      price: 2699000,
      credit: 23490,
      img: "assets/cars/car-profile.webp",
      logo: "assets/partners/tenet.webp",
      detail: "car.html?id=t7",
      drom: "https://www.drom.ru/",
    },
    {
      brand: "BELGEE",
      model: "X50+",
      year: 2025,
      engine: "1.5 л",
      hp: "150 л.с.",
      fuel: "Бензин",
      drive: "Передний",
      price: 1899000,
      credit: 16490,
      img: "assets/cars/car-right2.png",
      logo: "assets/partners/belgee.webp",
      detail: "car.html?id=x50",
      drom: "https://www.drom.ru/",
    },
    {
      brand: "NORDCROSS",
      model: "001",
      year: 2025,
      engine: "1.5 л",
      hp: "147 л.с.",
      fuel: "Бензин",
      drive: "Передний",
      price: 2099000,
      credit: 18290,
      img: "assets/cars/car-left.webp",
      logo: "assets/partners/nordcross.webp",
      detail: "car.html?id=nc001",
      drom: "https://www.drom.ru/",
    },
  ];

  const formatPrice = (n) =>
    n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";

  const iconEngine = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10h3l2-3h4l2 3h3v7H4v-7z" stroke="currentColor" stroke-width="1.6"/><path d="M14 10v7M9 14h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  const iconHp = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 3L5 14h6l-1 7 9-12h-6l1-6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  const iconFuel = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 21V5a2 2 0 012-2h6a2 2 0 012 2v16M5 21h10M16 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  const iconDrive = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

  let catalogSwiper = null;

  function initCatalogSwiper() {
    const el = document.getElementById("catalogSwiper");
    if (!el || typeof Swiper === "undefined") return;
    if (catalogSwiper) {
      catalogSwiper.destroy(true, true);
      catalogSwiper = null;
    }
    catalogSwiper = new Swiper(el, {
      slidesPerView: "auto",
      spaceBetween: 14,
      grabCursor: true,
      watchOverflow: true,
      touchAngle: 30,
      threshold: 8,
      touchReleaseOnEdges: true,
      touchStartPreventDefault: false,
      resistanceRatio: 0.65,
      breakpoints: {
        901: {
          enabled: false,
        },
      },
    });
  }

  function renderCars(list) {
    const grid = document.getElementById("catalogGrid");
    if (!grid) return;
    if (!list.length) {
      if (catalogSwiper) {
        catalogSwiper.destroy(true, true);
        catalogSwiper = null;
      }
      grid.innerHTML = `
      <div class="catalog-empty reveal is-in">
        <img class="catalog-empty__car" src="assets/cars/car-profile.webp" alt="" />
        <p class="catalog-empty__text">автомобиль не найден</p>
      </div>`;
      return;
    }
    grid.innerHTML = list
      .map(
        (car) => `
      <div class="swiper-slide catalog-slide">
      <article class="car-card reveal" data-brand="${car.brand}">
        <div class="car-card__media">
          <span class="car-card__badge"><img src="${car.logo}" alt="${car.brand}" /></span>
          <img src="${car.img}" alt="${car.brand} ${car.model}" loading="lazy" />
        </div>
        <div class="car-card__body">
          <h3 class="car-card__title">${car.brand} ${car.model} ${car.year}</h3>
          <div class="car-card__specs">
            <div class="car-card__spec">${iconEngine}<span>${car.engine}</span></div>
            <div class="car-card__spec">${iconHp}<span>${car.hp}</span></div>
            <div class="car-card__spec">${iconFuel}<span>${car.fuel}</span></div>
            <div class="car-card__spec">${iconDrive}<span>${car.drive}</span></div>
          </div>
          <p class="car-card__price">${formatPrice(car.price)}</p>
          <p class="car-card__credit">от ${formatPrice(car.credit)}/мес. в кредит</p>
          <div class="car-card__actions">
            <button class="btn btn--accent" type="button" data-open-modal="credit" data-credit-price="${car.price}">Рассчитать кредит</button>
            <div class="car-card__links">
              <a href="${car.drom}" target="_blank" rel="noopener">На drom.ru</a>
              <a href="${car.detail}">Подробнее</a>
            </div>
          </div>
        </div>
      </article>
      </div>`
      )
      .join("");

    initCatalogSwiper();
    observeReveals();
    bindModalTriggers();
  }
const header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (!header) return;
    const solid = window.scrollY > 40;
    header.classList.toggle("is-solid", solid);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();
const burger = document.getElementById("burgerBtn");
  const drawer = document.getElementById("mobileDrawer");

  function openDrawer() {
    if (!drawer || !burger) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    burger.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (!drawer || !burger) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    if (!document.getElementById("modalCallback")?.classList.contains("is-open")) {
      document.body.style.overflow = "";
    }
  }

  burger?.addEventListener("click", () => {
    if (drawer?.classList.contains("is-open")) closeDrawer();
    else openDrawer();
  });

  document.querySelectorAll("[data-close-drawer]").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (el.tagName === "A" && el.getAttribute("href")?.startsWith("#")) {
        closeDrawer();
        return;
      }
      if (el.hasAttribute("data-open-modal")) {
        closeDrawer();
        return;
      }
      closeDrawer();
    });
  });
const modal = document.getElementById("modalCallback");
  let modalTimer;

  function openModal() {
    if (!modal) return;
    clearTimeout(modalTimer);
    modal.classList.remove("is-closing");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeDrawer();
    setTimeout(() => modal.querySelector("input")?.focus(), 350);
  }

  function closeModal() {
    if (!modal || !modal.classList.contains("is-open")) return;
    modal.classList.add("is-closing");
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modalTimer = setTimeout(() => {
      modal.classList.remove("is-closing");
      if (!drawer?.classList.contains("is-open")) document.body.style.overflow = "";
    }, 400);
  }

  function bindModalTriggers() {
    document.querySelectorAll('[data-open-modal="callback"]').forEach((el) => {
      if (el.dataset.bound) return;
      el.dataset.bound = "1";
      el.addEventListener("click", openModal);
    });
    document.querySelectorAll('[data-open-modal="credit"]').forEach((el) => {
      if (el.dataset.creditBound) return;
      el.dataset.creditBound = "1";
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const price = el.dataset.creditPrice ? +el.dataset.creditPrice : undefined;
        if (window.openCreditModal) window.openCreditModal(price);
      });
    });
  }

  document.querySelectorAll("[data-close-modal]").forEach((el) =>
    el.addEventListener("click", closeModal)
  );

  const mediaModal = document.getElementById("modalMedia");
  const mediaViewer = document.getElementById("mediaViewer");
  let mediaModalTimer;

  function closeMediaModal() {
    if (!mediaModal || !mediaModal.classList.contains("is-open")) return;
    mediaModal.classList.add("is-closing");
    mediaModal.classList.remove("is-open");
    mediaModal.setAttribute("aria-hidden", "true");
    const video = mediaViewer?.querySelector("video");
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    mediaModalTimer = setTimeout(() => {
      mediaModal.classList.remove("is-closing");
      if (mediaViewer) mediaViewer.innerHTML = "";
      mediaModal.querySelector(".media-viewer__caption")?.remove();
      if (!modal?.classList.contains("is-open") && !drawer?.classList.contains("is-open")) {
        document.body.style.overflow = "";
      }
    }, 400);
  }

  function openMediaModal(card) {
    if (!mediaModal || !mediaViewer || !card) return;
    const type = card.dataset.mediaType || "image";
    const src = card.dataset.mediaSrc || "";
    const poster = card.dataset.mediaPoster || "";
    const title = card.dataset.mediaTitle || "Медиа отзыва";
    const titleEl = document.getElementById("mediaModalTitle");
    if (titleEl) titleEl.textContent = title;

    mediaViewer.innerHTML = "";
    if (type === "video" && src) {
      const video = document.createElement("video");
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      if (poster) video.poster = poster;
      video.src = src;
      mediaViewer.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = src || poster || card.querySelector("img")?.src || "";
      img.alt = title;
      mediaViewer.appendChild(img);
    }
    const caption = document.createElement("p");
    caption.className = "media-viewer__caption";
    caption.textContent = title;
    mediaViewer.parentElement?.querySelector(".media-viewer__caption")?.remove();
    mediaViewer.insertAdjacentElement("afterend", caption);

    clearTimeout(mediaModalTimer);
    mediaModal.classList.remove("is-closing");
    mediaModal.classList.add("is-open");
    mediaModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  document.querySelectorAll("[data-close-media]").forEach((el) => {
    el.addEventListener("click", closeMediaModal);
  });

  document.addEventListener("click", (e) => {
    const track = document.getElementById("reviewsTrack");
    if (track?.classList.contains("did-drag")) return;
    const trigger = e.target.closest("[data-open-media]");
    const mediaCard = e.target.closest(".t-card--media[data-media-type]");
    const card = trigger?.closest("[data-media-type]") || mediaCard;
    if (!card) return;
    e.preventDefault();
    e.stopPropagation();
    openMediaModal(card);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMediaModal();
      closeModal();
      closeDrawer();
    }
  });

function formatCount(value, decimals) {
    if (decimals > 0) {
      return value.toFixed(decimals).replace(".", ",");
    }
    return Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function animateCount(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const target = parseFloat(el.dataset.target || "0");
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();

    if (reduceMotion) {
      el.textContent = formatCount(target, decimals) + suffix;
      return;
    }

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatCount(target * eased, decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = formatCount(target, decimals) + suffix;
    }
    requestAnimationFrame(tick);
  }

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll(".count-up").forEach((el) => countObserver.observe(el));
const whySlices = [...document.querySelectorAll(".why-card__slice")];
  function updateWhySlices() {
    if (!window.matchMedia("(max-width: 900px)").matches || reduceMotion) {
      whySlices.forEach((s) => s.style.removeProperty("--slice-x"));
      return;
    }
    whySlices.forEach((slice) => {
      const rect = slice.getBoundingClientRect();
      const view = window.innerHeight || 1;
      const progress = (view - rect.top) / (view + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      const x = clamped * 100;
      slice.style.setProperty("--slice-x", `${x}%`);
    });
  }
  window.addEventListener("scroll", updateWhySlices, { passive: true });
  window.addEventListener("resize", updateWhySlices);
  updateWhySlices();
const slides = [...document.querySelectorAll(".hero__slide")];
  const dots = [...document.querySelectorAll(".hero__dot")];
  let slideIndex = 0;
  let heroTimer;

  function goSlide(i) {
    slideIndex = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle("is-active", idx === slideIndex));
    dots.forEach((d, idx) => d.classList.toggle("is-active", idx === slideIndex));
  }

  function startHero() {
    if (reduceMotion || slides.length < 2) return;
    clearInterval(heroTimer);
    heroTimer = setInterval(() => goSlide(slideIndex + 1), 6000);
  }

  dots.forEach((dot) =>
    dot.addEventListener("click", () => {
      goSlide(Number(dot.dataset.slide));
      startHero();
    })
  );
  startHero();
function filterByBrand(brand) {
    const list = brand ? cars.filter((c) => c.brand === brand) : cars;
    renderCars(list);
    const select = document.getElementById("filterBrand");
    if (select) select.value = brand || "";
  }

  document.querySelectorAll(".brand-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".brand-pill").forEach((p) => p.classList.remove("is-active"));
      pill.classList.add("is-active");
      filterByBrand(pill.dataset.brand || "");
    });
  });

  const filterSearch = document.getElementById("filterSearch");
  if (filterSearch) {
    filterSearch.addEventListener("click", () => {
      const brand = document.getElementById("filterBrand")?.value || "";
      const model = document.getElementById("filterModel")?.value || "";
      let list = cars;
      if (brand) list = list.filter((c) => c.brand === brand);
      if (model) list = list.filter((c) => c.model === model);
      renderCars(list);
    });
  }
const newsSlider = document.getElementById("newsSlider");
  document.getElementById("newsPrev")?.addEventListener("click", () => {
    newsSlider?.scrollBy({ left: -260, behavior: reduceMotion ? "auto" : "smooth" });
  });
  document.getElementById("newsNext")?.addEventListener("click", () => {
    newsSlider?.scrollBy({ left: 260, behavior: reduceMotion ? "auto" : "smooth" });
  });

  const reviewsTrack = document.getElementById("reviewsTrack");
  const reviewsPrev = document.getElementById("reviewsPrev");
  const reviewsNext = document.getElementById("reviewsNext");
  const reviewsViewport = document.getElementById("reviewsViewport");
  if (reviewsTrack && reviewsPrev && reviewsNext && reviewsViewport) {
    let reviewsIndex = 0;
    let dragOffset = 0;
    const reviewsGap = 18;

    const getPerView = () => {
      const w = window.innerWidth;
      if (w <= 640) return 1;
      if (w <= 1200) return 2;
      return 3;
    };

    const getMaxIndex = () => {
      const total = reviewsTrack.children.length;
      return Math.max(0, total - getPerView());
    };

    const getStep = () => {
      const card = reviewsTrack.querySelector(".t-card");
      if (!card) return 300;
      return card.getBoundingClientRect().width + reviewsGap;
    };

    const setTrackOffset = (offset, animate) => {
      dragOffset = offset;
      reviewsTrack.style.transition = animate && !reduceMotion
        ? "transform .55s var(--ease, cubic-bezier(0.22, 1, 0.36, 1))"
        : "none";
      reviewsTrack.style.transform = `translate3d(${offset}px, 0, 0)`;
    };

    const updateReviewsSlider = (animate = true) => {
      const max = getMaxIndex();
      reviewsIndex = Math.min(Math.max(0, reviewsIndex), max);
      const offset = -reviewsIndex * getStep();
      setTrackOffset(offset, animate);
      reviewsPrev.disabled = reviewsIndex <= 0;
      reviewsNext.disabled = reviewsIndex >= max;
    };

    reviewsPrev.addEventListener("click", () => {
      reviewsIndex = Math.max(0, reviewsIndex - 1);
      updateReviewsSlider();
    });
    reviewsNext.addEventListener("click", () => {
      reviewsIndex = Math.min(getMaxIndex(), reviewsIndex + 1);
      updateReviewsSlider();
    });

    let pointerId = null;
    let startX = 0;
    let startOffset = 0;
    let moved = false;

    const onPointerDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.target.closest("button, a, [data-open-media]")) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startOffset = dragOffset;
      moved = false;
      reviewsTrack.classList.remove("did-drag");
      reviewsTrack.classList.add("is-dragging");
      reviewsViewport.setPointerCapture?.(pointerId);
    };

    const onPointerMove = (e) => {
      if (pointerId === null || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6) moved = true;
      const max = getMaxIndex() * getStep();
      let next = startOffset + dx;
      if (next > 0) next *= 0.35;
      if (next < -max) next = -max + (next + max) * 0.35;
      setTrackOffset(next, false);
    };

    const onPointerUp = (e) => {
      if (pointerId === null || e.pointerId !== pointerId) return;
      pointerId = null;
      reviewsTrack.classList.remove("is-dragging");
      if (moved) {
        reviewsTrack.classList.add("did-drag");
        setTimeout(() => reviewsTrack.classList.remove("did-drag"), 120);
      }
      const step = getStep();
      const projected = -dragOffset / step;
      reviewsIndex = Math.round(projected);
      updateReviewsSlider(true);
    };

    reviewsViewport.addEventListener("pointerdown", onPointerDown);
    reviewsViewport.addEventListener("pointermove", onPointerMove);
    reviewsViewport.addEventListener("pointerup", onPointerUp);
    reviewsViewport.addEventListener("pointercancel", onPointerUp);
    reviewsViewport.addEventListener("lostpointercapture", onPointerUp);

    window.addEventListener("resize", () => updateReviewsSlider(false));
    updateReviewsSlider(false);
  }
function maskPhone(input) {
    input.addEventListener("input", () => {
      let digits = input.value.replace(/\D/g, "");
      if (digits.startsWith("8")) digits = "7" + digits.slice(1);
      if (!digits.startsWith("7")) digits = "7" + digits;
      digits = digits.slice(0, 11);
      const p = digits.split("");
      let out = "+7";
      if (p.length > 1) out += " (" + p.slice(1, 4).join("");
      if (p.length >= 4) out += ")";
      if (p.length >= 5) out += " " + p.slice(4, 7).join("");
      if (p.length >= 8) out += "-" + p.slice(7, 9).join("");
      if (p.length >= 10) out += "-" + p.slice(9, 11).join("");
      input.value = out;
    });
  }
  document.querySelectorAll("[data-phone-mask]").forEach(maskPhone);
const toast = document.getElementById("toast");
  function showToast() {
    if (!toast) return;
    toast.hidden = false;
    setTimeout(() => {
      toast.hidden = true;
    }, 3200);
  }

  function bindForm(form) {
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      form.reset();
      closeModal();
      showToast();
    });
  }
  bindForm(document.getElementById("tradeInForm"));
  bindForm(document.getElementById("callbackForm"));
let revealObserver;
  function observeReveals() {
    const items = document.querySelectorAll(".reveal:not(.is-in)");
    if (reduceMotion) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
    }
    items.forEach((el) => revealObserver.observe(el));
  }
function initMotion() {
    if (reduceMotion || typeof gsap === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".hero__content > *", {
      y: 36,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: "power3.out",
      delay: 0.15,
    });
  }
renderCars(cars);
  bindModalTriggers();
  observeReveals();
  initMotion();
})();
