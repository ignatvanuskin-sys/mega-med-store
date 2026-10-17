/* ============================================================
   MegaMedStom — общий UI: шапка, поиск, навигация, карточки,
   шторки, тосты, виджет подбора, сквозные механики.
   ============================================================ */
(function () {
  const C = MMS.CONFIG;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = MMS.fmt.escape;
  const ui = { $, $$, esc };
  let inited = false;

  ui.qsp = (name, def) => { const v = new URLSearchParams(location.search).get(name); return v == null ? (def || "") : v; };
  ui.go = (url) => { location.href = url; };

  /* Картинка товара: WebP 320/640 px через srcset — на телефоне грузится
     лёгкая версия, размеры заданы заранее (нет скачков вёрстки). */
  ui.artBlock = function (p, opts) {
    if (!p.img) return MMS.art(p.art);
    opts = opts || {};
    const base = p.img.replace(/\.(jpe?g|png|webp)$/i, "");
    const eager = !!opts.eager;
    return '<img src="' + esc(base) + '.webp"' +
      ' srcset="' + esc(base) + '-320.webp 320w, ' + esc(base) + '.webp 640w"' +
      ' sizes="' + esc(opts.sizes || "(max-width: 700px) 46vw, 300px") + '"' +
      ' width="640" height="640"' +
      ' alt="' + esc(p.name) + '"' +
      ' loading="' + (eager ? "eager" : "lazy") + '" decoding="async"' +
      (eager ? ' fetchpriority="high"' : "") + ">";
  };

  ui.priceHtml = (p, variant) => {
    const v = variant != null ? variant : p.price;
    return MMS.fmt.price(v);
  };

  /* ---------- Карточка товара ---------- */
  function qtyBlock(p, inCart) {
    if (p.price == null) return "";
    return '<div class="pcard__qty" data-qtywrap data-id="' + p.id + '"' + (inCart ? "" : " hidden") + ">" +
      '<button data-dec="' + p.id + '" aria-label="Минус">' + MMS.icon("minus", 15) + "</button>" +
      "<output>" + MMS.store.qtyOf(p.id, "cart") + "</output>" +
      '<button data-inc="' + p.id + '" aria-label="Плюс">' + MMS.icon("plus", 15) + "</button></div>";
  }
  function addBtn(p, inCart) {
    const isReq = p.price == null;
    const label = isReq ? "Добавить в список закупки" : "Добавить в корзину";
    return '<button class="pcard__add' + (!isReq && inCart ? " is-in" : "") + '" data-add="' + p.id + '"' +
      (inCart && !isReq ? " hidden" : "") + ' aria-label="' + label + '" title="' + label + '">' +
      MMS.icon(isReq ? "send" : "plus", 18) +
      '<span class="pcard__add-txt">' + (isReq ? "Запросить" : "В корзину") + "</span></button>";
  }

  ui.productCard = function (p) {
    const favOn = MMS.store.favHas(p.id);
    const inCart = MMS.store.qtyOf(p.id, "cart") > 0;
    return '<article class="pcard fade-in" data-card="' + p.id + '">' +
      '<div class="pcard__media">' +
        (p.isNew ? '<span class="badge badge--accent pcard__badge">Новинка</span>' : "") +
        '<button class="pcard__fav' + (favOn ? " is-active" : "") + '" data-fav="' + p.id + '" aria-label="В избранное">' + MMS.icon(favOn ? "heartFill" : "heart", 17) + "</button>" +
        '<a href="product.html?id=' + p.id + '" aria-label="' + esc(p.name) + '">' + ui.artBlock(p) + "</a>" +
      "</div>" +
      '<div class="pcard__body">' +
        '<div class="pcard__meta"><i>' + esc(p.brand) + "</i><i>" + esc(p.article) + "</i></div>" +
        '<h3 class="pcard__name"><a href="product.html?id=' + p.id + '">' + esc(p.name) + "</a></h3>" +
        '<div class="pcard__foot">' +
          '<div class="pcard__price"><b>' + ui.priceHtml(p) + "</b><span>" + esc(p.unit) + "</span></div>" +
          '<div class="pcard__actions">' + addBtn(p, inCart) + qtyBlock(p, inCart) + "</div>" +
        "</div>" +
      "</div></article>";
  };

  ui.renderProducts = function (container, items, opts) {
    opts = opts || {};
    if (!items.length) {
      container.innerHTML = ui.emptyState(opts.empty || {});
      return;
    }
    container.innerHTML = items.map(ui.productCard).join("");
  };

  ui.emptyState = function (o) {
    o = o || {};
    return '<div class="empty">' +
      '<div class="empty__icon">' + MMS.icon(o.icon || "search", 34) + "</div>" +
      '<div class="empty__title">' + esc(o.title || "Ничего не найдено") + "</div>" +
      "<p>" + esc(o.text || "Попробуйте изменить запрос или посмотрите другие категории.") + "</p>" +
      (o.cta ? '<a class="btn btn--primary" href="' + o.cta.href + '">' + esc(o.cta.label) + "</a>" : "") +
      "</div>";
  };

  ui.skeletonGrid = function (container, n) {
    let html = "";
    for (let i = 0; i < (n || 8); i++) {
      html += '<div class="skel-card"><div class="skel skel-card__media"></div><div class="skel-card__body">' +
        '<div class="skel" style="height:12px;width:46%"></div><div class="skel" style="height:14px;width:92%"></div><div class="skel" style="height:14px;width:70%"></div>' +
        '<div class="skel" style="height:30px;width:100%;margin-top:6px"></div></div></div>';
    }
    container.innerHTML = html;
  };

  /* ---------- Мини-карточка (поиск, подбор, корзина) ---------- */
  ui.miniHit = function (p, right) {
    return '<a class="search-hit" href="product.html?id=' + p.id + '">' +
      '<span class="search-hit__art">' + ui.artBlock(p) + "</span>" +
      '<span class="search-hit__info"><span class="search-hit__name">' + esc(p.name) + "</span>" +
      '<span class="search-hit__meta">' + esc(p.brand) + " · " + esc(p.unit) + "</span></span>" +
      (right !== undefined ? right : '<span class="search-hit__price nowrap">' + ui.priceHtml(p) + "</span>") +
      "</a>";
  };

  /* ---------- Бейджи ---------- */
  ui.syncBadges = function () {
    const cart = MMS.store.bagCount("cart");
    const fav = MMS.store.favItems().length;
    $$('[data-badge="cart"]').forEach((el) => { el.textContent = cart; el.hidden = !cart; });
    $$('[data-badge="fav"]').forEach((el) => { el.textContent = fav; el.hidden = !fav; });
    const cn = $('[data-cart-count]');
    if (cn) cn.textContent = cart;
    /* доступное имя иконочных ссылок включает видимое число бейджа */
    const favLink = $('.header__actions a.iconbtn[href="favorites.html"]');
    const cartLink = $('.header__actions a.iconbtn[href="cart.html"]');
    if (favLink) favLink.setAttribute("aria-label", fav ? "Избранное, товаров: " + fav : "Избранное");
    if (cartLink) cartLink.setAttribute("aria-label", cart ? "Корзина, товаров: " + cart : "Корзина");
  };

  ui.syncCards = function () {
    $$("[data-card]").forEach((card) => {
      const id = card.getAttribute("data-card");
      const p = MMS.store.product(id);
      if (!p) return;
      const qty = MMS.store.qtyOf(id, "cart");
      const wrap = $("[data-qtywrap]", card);
      const btn = $(".pcard__add", card);
      if (wrap) { wrap.hidden = qty <= 0; const out = $("output", wrap); if (out) out.textContent = qty; }
      if (btn) btn.hidden = qty > 0 && p.price != null;
    });
  };

  /* ---------- Тосты ---------- */
  function toastHost() {
    let host = $("#toasts");
    if (!host) { host = document.createElement("div"); host.id = "toasts"; host.className = "toasts"; host.setAttribute("aria-live", "polite"); document.body.appendChild(host); }
    return host;
  }
  ui.toast = function (text, opts) {
    opts = opts || {};
    const t = document.createElement("div");
    t.className = "toast" + (opts.type === "error" ? " toast--err" : "");
    t.innerHTML = MMS.icon(opts.type === "error" ? "alert" : "check", 18) + "<span>" + esc(text) + "</span>";
    if (opts.action) {
      const a = document.createElement("a");
      a.href = opts.action.href;
      a.className = "btn btn--sm btn--soft";
      a.style.marginLeft = "auto";
      a.textContent = opts.action.label;
      t.appendChild(a);
    }
    toastHost().appendChild(t);
    setTimeout(() => { t.classList.add("is-out"); setTimeout(() => t.remove(), 240); }, opts.duration || 3600);
  };

  /* ---------- Оверлей, шторки, модалки ---------- */
  function ensureOverlay() {
    let ov = $("#overlay");
    if (!ov) {
      ov = document.createElement("div");
      ov.id = "overlay"; ov.className = "overlay";
      ov.addEventListener("click", () => { ui.closeSheets(); ui.closeModal(); });
      document.body.appendChild(ov);
    }
    return ov;
  }
  ui.openSheet = function (sheet) {
    ensureOverlay().classList.add("is-open");
    sheet.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };
  ui.closeSheets = function () {
    $$(".sheet.is-open").forEach((s) => s.classList.remove("is-open"));
    const anyModal = $$(".modal.is-open").length;
    if (!anyModal) {
      const ov = $("#overlay"); if (ov) ov.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  };
  ui.closeSheet = ui.closeSheets;
  ui.modal = function (innerHtml, opts) {
    opts = opts || {};
    ui.closeModal();
    const m = document.createElement("div");
    m.className = "modal";
    m.id = "modal";
    m.innerHTML = '<div class="modal__box" role="dialog" aria-modal="true">' + innerHtml + "</div>";
    document.body.appendChild(m);
    ensureOverlay().classList.add("is-open");
    m.addEventListener("click", (e) => { if (e.target === m) ui.closeModal(); });
    requestAnimationFrame(() => m.classList.add("is-open"));
    ui.closeModal._el = m;
    document.body.style.overflow = "hidden";
    return m;
  };
  ui.closeModal = function () {
    const m = $("#modal");
    if (m) m.remove();
    if (!$$(".sheet.is-open").length) {
      const ov = $("#overlay"); if (ov) ov.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  };
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { ui.closeSheets(); ui.closeModal(); } });

  /* ---------- WhatsApp ---------- */
  ui.waLink = (text) => "https://wa.me/" + C.company.whatsapp + "?text=" + encodeURIComponent(text || "");
  ui.orderText = function (order, mode) {
    const lines = [];
    lines.push(mode === "quote" ? "Здравствуйте! Запрос счёта по списку закупки (сайт MegaMedStom):" : "Здравствуйте! Заказ с сайта MegaMedStom № " + order.id + ":");
    const byRequest = order.items.some((it) => !it.sum);
    order.items.forEach((it) => {
      lines.push("• " + it.name + (it.variant ? " (" + it.variant + ")" : "") + " × " + it.qty + " — " + (it.sum ? MMS.fmt.price(it.sum) : "цена по запросу"));
    });
    if (order.total) lines.push("Итого: " + MMS.fmt.price(order.total) + (byRequest ? " + позиции «по запросу» (менеджер оценит отдельно)" : ""));
    else if (byRequest) lines.push("Стоимость: менеджер рассчитает по позициям «по запросу».");
    else lines.push("Итого: " + MMS.fmt.price(order.total));
    if (order.customer) {
      const cst = order.customer;
      if (cst.name) lines.push("ФИО: " + cst.name);
      if (cst.phone) lines.push("Телефон: " + cst.phone);
      if (cst.organization) lines.push("Организация: " + cst.organization + (cst.bin ? ", БИН " + cst.bin : ""));
      if (cst.delivery) lines.push("Получение: " + cst.delivery);
      if (cst.address) lines.push("Адрес: " + cst.address);
      if (cst.comment) lines.push("Комментарий: " + cst.comment);
    }
    return lines.join("\n");
  };
  ui.copyText = function (text, okMsg) {
    const done = () => ui.toast(okMsg || "Скопировано");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, () => fallback());
    } else fallback();
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) {}
      ta.remove();
    }
  };

  /* ---------- Маска телефона ---------- */
  ui.maskPhone = function (input) {
    input.addEventListener("input", () => {
      let d = input.value.replace(/\D/g, "");
      if (d.startsWith("8")) d = "7" + d.slice(1);
      if (!d.startsWith("7")) d = "7" + d;
      d = d.slice(0, 11);
      let out = "+7";
      if (d.length > 1) out += " (" + d.slice(1, 4);
      if (d.length >= 5) out += ") " + d.slice(4, 7);
      if (d.length >= 8) out += "-" + d.slice(7, 9);
      if (d.length >= 10) out += "-" + d.slice(9, 11);
      input.value = out;
    });
  };
  ui.validPhone = (v) => (String(v || "").replace(/\D/g, "").length === 11);

  /* ---------- Механики корзины из карточек ---------- */
  ui.addSmart = function (id) {
    const p = MMS.store.product(id);
    if (!p) return;
    if (p.price == null) {
      MMS.store.add("list", id, "", 1);
      ui.toast("Добавлено в список закупки");
      return;
    }
    const keys = Object.values(MMS.store.raw().cart).filter((x) => x.id === id);
    if (keys.length) MMS.store.setQty("cart", id + "::" + keys[0].variant, keys[0].qty + 1);
    else MMS.store.add("cart", id, null, 1);
    ui.toast("В корзине: «" + p.name + "»", { action: { label: "Корзина", href: "cart.html" } });
  };
  ui.decSmart = function (id) {
    const items = Object.values(MMS.store.raw().cart).filter((x) => x.id === id);
    if (!items.length) return;
    items.sort((a, b) => b.qty - a.qty);
    const it = items[0];
    MMS.store.setQty("cart", id + "::" + it.variant, it.qty - 1);
  };

  /* ---------- Каркас страницы ---------- */
  function headerHtml(page, cat) {
    const phone = C.company;

    return '<div class="topbar"><div class="wrap">' +
        '<div class="topbar__left"><span><i class="topbar__dot"></i>Астана · ул. Айнакол, 66</span><span>' + esc(phone.hours) + '</span></div>' +
        '<div class="topbar__right"><span>Самовывоз и доставка по Казахстану</span><span>Документы для клиник по БИН</span></div>' +
      '</div></div>' +
      '<header class="header"><div class="wrap">' +
        '<div class="header__row">' +
          '<a class="logo" href="index.html">' + MMS.logoMark(34) +
            '<span class="logo__text"><span class="logo__name">Mega<em>Med</em>Stom</span><span class="logo__sub">Стоматологические товары · Астана</span></span></a>' +
          '<div class="header__search" id="headerSearchWrap">' +
            '<div class="searchbar" id="headerSearchbar">' + MMS.icon("search", 18, "searchbar__icon") +
              '<input type="search" id="headerSearchInput" placeholder="Товар, бренд или артикул" autocomplete="off" aria-label="Поиск по каталогу">' +
            "</div>" +
            '<div class="search-drop" id="searchDrop" hidden></div>' +
          "</div>" +
          '<div class="header__actions">' +
            '<div class="header__phone hide-mob"><a href="tel:' + phone.phoneDial + '">' + phone.phone + "</a><span>" + esc(phone.hours) + "</span></div>" +
            '<a class="iconbtn header__call" href="tel:' + phone.phoneDial + '" aria-label="Позвонить: ' + phone.phone + '">' + MMS.icon("phone", 19) + "</a>" +
            '<a class="iconbtn" href="favorites.html" aria-label="Избранное">' + MMS.icon("heart", 21) + '<span class="iconbtn__badge" data-badge="fav" hidden aria-hidden="true">0</span></a>' +
            '<a class="iconbtn" href="cart.html" aria-label="Корзина">' + MMS.icon("cart", 21) + '<span class="iconbtn__badge" data-badge="cart" hidden aria-hidden="true">0</span></a>' +
          "</div>" +
        "</div>" +
      "</div></header>";
  }

  function bottomNavHtml(page) {
    const items = [
      { key: "home", href: "index.html", icon: "home", label: "Главная" },
      { key: "catalog", href: "catalog.html", icon: "grid", label: "Каталог" },
      { key: "fav", href: "favorites.html", icon: "heart", label: "Избранное", badge: "fav" },
      { key: "cart", href: "cart.html", icon: "cart", label: "Корзина", badge: "cart" },
      { key: "profile", href: "profile.html", icon: "user", label: "Профиль" }
    ];
    const aliases = { product: "catalog", checkout: "cart", success: "cart", order: "cart" };
    const cur = aliases[page] || page;
    return '<nav class="bottomnav" aria-label="Основная навигация">' +
      items.map((it) =>
        '<a class="bottomnav__item' + (cur === it.key ? " is-active" : "") + '" href="' + it.href + '"' +
        (cur === it.key ? ' aria-current="page"' : "") + ">" + MMS.icon(it.icon, 22) +
        "<span>" + it.label + "</span>" +
        (it.badge ? '<span class="bottomnav__badge" data-badge="' + it.badge + '" hidden>0</span>' : "") +
        "</a>"
      ).join("") + "</nav>";
  }

  function footerHtml() {
    const c = C.company;
    return '<footer class="footer"><div class="wrap">' +
      '<div class="footer__top">' +
        '<div class="footer__about">' +
          '<a class="logo" href="index.html">' + MMS.logoMark(36) +
            '<span class="logo__text"><span class="logo__name">Mega<em>Med</em>Stom</span><span class="logo__sub">Стоматологические товары · Астана</span></span></a>' +
          "<p>" + esc(c.tagline) + ". " + esc(c.deliveryShort) + ".</p>" +
          '<div class="footer__social">' +
            '<a href="' + c.instagram + '" target="_blank" rel="noopener" aria-label="Instagram">' + MMS.icon("ig", 19) + "</a>" +
            '<a href="' + ui.waLink("Здравствуйте! Пишу с сайта MegaMedStom.") + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + MMS.icon("wa", 19) + "</a>" +
            '<a href="mailto:' + c.email + '" aria-label="Почта">' + MMS.icon("mail", 19) + "</a>" +
          "</div>" +
          '<p class="footer__plain-note">Информация на сайте не является публичной офертой. Наличие, цены и условия доставки уточняйте у менеджера.</p>' +
        "</div>" +
        '<details class="facc" open><summary><h4>Покупателям</h4></summary><div class="footer__links">' +
          '<a href="catalog.html">Каталог</a><a href="favorites.html">Избранное</a><a href="cart.html">Корзина</a>' +
          '<a href="profile.html">Кабинет и список закупки</a><a href="delivery.html">Доставка и оплата</a><a href="returns.html">Возврат и обмен</a>' +
        "</div></details>" +
        '<details class="facc" open><summary><h4>Компания</h4></summary><div class="footer__links">' +
          '<a href="about.html">О компании</a><a href="delivery.html">Условия доставки</a><a href="returns.html">Возврат и обмен</a>' +
          '<a href="privacy.html">Политика конфиденциальности</a><a href="terms.html">Пользовательское соглашение</a>' +
        "</div></details>" +
        '<div class="footer__col"><h4>Контакты</h4><div class="footer__contacts">' +
          '<div class="footer__contact-row">' + MMS.icon("pin", 17) + "<span>" + esc(c.addressFull) + "</span></div>" +
          '<div class="footer__contact-row">' + MMS.icon("clock", 17) + "<span>" + esc(c.hours) + " · " + esc(c.hoursNote) + "</span></div>" +
          '<div class="footer__contact-row">' + MMS.icon("phone", 17) + '<span><a href="tel:' + c.phoneDial + '">' + c.phone + "</a><br><a href=\"tel:" + c.phone2Dial + '">' + c.phone2 + "</a></span></div>" +
          '<div class="footer__contact-row">' + MMS.icon("mail", 17) + '<span><a href="mailto:' + c.email + '">' + c.email + "</a></span></div>" +
        "</div></div>" +
      "</div>" +
      '<div class="footer__bottom"><span>© 2026 ' + esc(c.legalName) + " · " + esc(c.city) + '</span><div class="footer__bottom-links">' +
        '<a href="privacy.html">Конфиденциальность</a><a href="terms.html">Соглашение</a><a href="' + c.mapUrl + '" target="_blank" rel="noopener">Мы в 2ГИС</a>' +
      "</div></div>" +
    "</div></footer>";
  }

  /* ---------- Поиск ---------- */
  function searchResultsHtml(q, ctx) {
    const s = MMS.search.suggest(q, 6);
    if (!q) {
      const hist = MMS.store.searchHistory();
      let html = "";
      if (hist.length) {
        html += '<div class="search-group"><div class="label search-group__title">Недавние запросы</div><div class="search-hints">' +
          hist.map((h) => '<button class="chip chip--soft" data-search-chip="' + esc(h) + '">' + esc(h) + "</button>").join("") +
          '<button class="chip chip--soft" data-search-clear="1">Очистить</button></div></div>';
      }
      html += '<div class="search-group"><div class="label search-group__title">Часто ищут</div><div class="search-hints">' +
        ["артикаин", "композит", "боры алмазные", "перчатки", "гуттаперча", "наконечник"].map((h) =>
          '<button class="chip chip--soft" data-search-chip="' + h + '">' + h + "</button>").join("") +
        "</div></div>";
      const top = MMS.search.query("", { sort: "popular" }).slice(0, 4);
      html += '<div class="search-group"><div class="label search-group__title">Хиты каталога</div>' + top.map((p) => ui.miniHit(p)).join("") + "</div>";
      return html;
    }
    if (!s.products.length) {
      return '<div class="search-empty">' + MMS.icon("search", 34) + "<p><b>По запросу «" + esc(q) + "» ничего не найдено.</b><br>Проверьте написание или посмотрите категории каталога.</p></div>";
    }
    let html = "";
    if (s.cats.length || s.brands.length) {
      html += '<div class="search-group"><div class="label search-group__title">Разделы и бренды</div><div class="search-hints">' +
        s.cats.slice(0, 3).map((c) => '<a class="chip" href="catalog.html?cat=' + c.slug + '">' + esc(c.name) + "</a>").join("") +
        s.brands.map((b) => '<a class="chip" href="catalog.html?q=' + encodeURIComponent(b) + '">' + esc(b) + "</a>").join("") +
        "</div></div>";
    }
    html += '<div class="search-group"><div class="label search-group__title">' + s.total + " " + MMS.fmt.goodsWord(s.total) + "</div>" +
      s.products.map((p) => ui.miniHit(p)).join("") +
      (s.total > s.products.length ? '<a class="btn btn--ghost btn--block mt-1" href="catalog.html?q=' + encodeURIComponent(q) + '">Показать все результаты</a>' : "") +
      "</div>";
    return html;
  }

  function bindSearch() {
    const input = $("#headerSearchInput");
    const drop = $("#searchDrop");
    const wrap = $("#headerSearchWrap");

    /* мобильная шторка */
    let sheet = $("#searchSheet");
    if (!sheet) {
      sheet = document.createElement("div");
      sheet.id = "searchSheet";
      sheet.className = "sheet search-overlay";
      sheet.innerHTML = '<div class="sheet__grip"><i></i></div>' +
        '<div class="sheet__head"><div class="searchbar" style="flex:1">' + MMS.icon("search", 18, "searchbar__icon") +
          '<input type="search" id="sheetSearchInput" placeholder="Название, бренд или артикул" autocomplete="off" aria-label="Поиск">' + "</div>" +
          '<button class="sheet__close" type="button" data-close-sheet aria-label="Закрыть">' + MMS.icon("x", 18) + "</button></div>" +
        '<div class="sheet__body" id="searchSheetBody"></div>';
      document.body.appendChild(sheet);
    }
    const sheetInput = $("#sheetSearchInput");
    const sheetBody = $("#searchSheetBody");

    document.addEventListener("click", (e) => {
      const openBtn = e.target.closest("[data-open-search]");
      if (openBtn) {
        e.preventDefault();
        sheetInput.value = input ? input.value : "";
        sheetBody.innerHTML = searchResultsHtml(sheetInput.value);
        ui.openSheet(sheet);
        setTimeout(() => sheetInput.focus(), 120);
        return;
      }
      const chip = e.target.closest("[data-search-chip]");
      if (chip) {
        const q = chip.getAttribute("data-search-chip");
        if (sheetBody.contains(chip)) { sheetInput.value = q; sheetBody.innerHTML = searchResultsHtml(q); sheetInput.focus(); }
        else { location.href = "catalog.html?q=" + encodeURIComponent(q); }
        return;
      }
      if (e.target.closest("[data-search-clear]")) { MMS.store.searchClear(); sheetBody.innerHTML = searchResultsHtml(""); return; }
      if (!e.target.closest("#headerSearchWrap")) { if (drop) drop.hidden = true; }
    });

    function handle(q, target) {
      if (target === "sheet") sheetBody.innerHTML = searchResultsHtml(q);
      else { drop.innerHTML = searchResultsHtml(q); drop.hidden = !q && !MMS.store.searchHistory().length; }
    }

    if (input) {
      let t = null;
      input.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => handle(input.value.trim(), "drop"), 160); });
      input.addEventListener("focus", () => {
        /* на мобильных строка поиска открывает шторку — так удобнее печатать */
        if (window.matchMedia("(max-width: 899px)").matches) {
          input.blur();
          sheetInput.value = input.value;
          sheetBody.innerHTML = searchResultsHtml(sheetInput.value);
          ui.openSheet(sheet);
          setTimeout(() => sheetInput.focus(), 140);
          return;
        }
        handle(input.value.trim(), "drop");
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const q = input.value.trim();
          if (q) { MMS.store.searchPush(q); location.href = "catalog.html?q=" + encodeURIComponent(q); }
        }
      });
      document.addEventListener("mousedown", (e) => {
        if (!e.target.closest("#headerSearchWrap")) drop.hidden = true;
      });
    }
    if (sheetInput) {
      let t2 = null;
      sheetInput.addEventListener("input", () => { clearTimeout(t2); t2 = setTimeout(() => handle(sheetInput.value.trim(), "sheet"), 160); });
      sheetInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const q = sheetInput.value.trim();
          if (q) { MMS.store.searchPush(q); location.href = "catalog.html?q=" + encodeURIComponent(q); }
        }
      });
    }
  }

  /* ---------- Виджет подбора ---------- */
  function bindAdvisor(page) {
    /* на страницах оформления и в карточке товара плавающая кнопка
       перекрывает цены и кнопки покупки — там она не нужна */
    if (["cart", "checkout", "success", "admin", "product"].indexOf(page) >= 0) return;
    const btn = document.createElement("button");
    btn.className = "advisor-btn";
    btn.id = "advisorBtn";
    btn.innerHTML = MMS.icon("spark", 20) + "<span>Помощь с подбором</span>";
    btn.setAttribute("aria-label", "Помощь с подбором товаров");
    document.body.appendChild(btn);

    /* кнопка не висит над товарами, пока читатель листает вниз;
       возвращается, как только он прокручивает страницу вверх */
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 4) return;
      btn.classList.toggle("is-hidden", y > lastY && y > 240);
      lastY = y;
    }, { passive: true });

    const sheet = document.createElement("div");
    sheet.className = "sheet advisor";
    sheet.id = "advisorSheet";
    sheet.innerHTML = '<div class="sheet__grip"><i></i></div>' +
      '<div class="sheet__head"><div class="sheet__title">Помощь с подбором</div>' +
      '<button class="sheet__close" type="button" data-close-sheet aria-label="Закрыть">' + MMS.icon("x", 18) + "</button></div>" +
      '<div class="sheet__body"><div class="advisor__note">Помощник отвечает по каталогу сайта с помощью ИИ и не заменяет консультацию специалиста: по клиническим вопросам ориентируйтесь на документацию производителя.</div>' +
      '<div class="advisor__msgs" id="advisorMsgs"></div>' +
      '<div class="advisor__chips" id="advisorChips">' +
        ['Композиты для пломб', 'Анестезия и карпулы', 'Боры и наконечники', 'Перчатки и маски', 'Доставка и оплата', 'Счёт для клиники'].map((c) => '<button class="advisor__chip">' + c + "</button>").join("") +
      "</div>" +
      '<div class="advisor__inputrow"><textarea class="textarea" id="advisorInput" rows="1" placeholder="Опишите, что нужно найти…"></textarea>' +
      '<button class="advisor__send" id="advisorSend" aria-label="Отправить">' + MMS.icon("send", 19) + "</button></div></div>";
    document.body.appendChild(sheet);

    const msgs = $("#advisorMsgs");
    let greeted = false;

    function bot(html) {
      const d = document.createElement("div");
      d.className = "msg msg--bot";
      d.innerHTML = html;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
      const body = $(".sheet__body", sheet);
      if (body) body.scrollTop = body.scrollHeight;
      return d;
    }
    function user(text) {
      const d = document.createElement("div");
      d.className = "msg msg--user";
      d.textContent = text;
      msgs.appendChild(d);
      const body = $(".sheet__body", sheet);
      if (body) body.scrollTop = body.scrollHeight;
    }
    function hitsHtml(list) {
      return '<div class="advisor__hits">' + list.map((p) =>
        '<div class="advisor__hit">' +
          '<span class="search-hit__art">' + ui.artBlock(p) + "</span>" +
          '<span class="search-hit__info"><a class="search-hit__name" href="product.html?id=' + p.id + '">' + esc(p.name) + "</a>" +
          '<span class="search-hit__meta">' + esc(p.brand) + " · " + ui.priceHtml(p) + "</span></span>" +
          '<button class="pcard__add" style="width:34px;height:34px;border-radius:10px" data-add="' + p.id + '" aria-label="Добавить">' + MMS.icon(p.price == null ? "send" : "plus", 16) + "</button>" +
        "</div>").join("") + "</div>";
    }
    function answerLocal(qRaw) {
      const q = (qRaw || "").toLowerCase();
      /* клинические вопросы — без медицинских советов */
      if (/(чем лечить|как лечить|вылечить|у пациента|диагноз|назначи[тл]|какую дозу|дозировк|что принимать|клиническ[а-я]+ (случай|вопрос))/.test(q)) {
        bot("Я помогаю только с подбором товаров из каталога и не даю клинических рекомендаций по лечению — ориентируйтесь на протоколы и документацию производителя. Могу найти материалы и инструменты по названию: например, «анестезия», «файлы для каналов», «композит»." +
          '<div class="advisor__chips" style="margin-top:8px"><a class="btn btn--sm btn--ghost" href="catalog.html">Открыть каталог</a>' +
          '<a class="btn btn--sm btn--primary" href="' + ui.waLink("Здравствуйте! Помогите подобрать товары: " + qRaw) + '" target="_blank" rel="noopener">Спросить менеджера</a></div>');
        return;
      }
      if (/доставк|привез|курьер|казахстан|регион/.test(q)) {
        bot("Доставка по всему Казахстану, самовывоз — со склада: " + esc(C.company.address) + ". Стоимость и срок менеджер подтвердит при оформлении. <a class='linkbtn' href='delivery.html'>Условия доставки</a>");
        return;
      }
      if (/оплат|оплатить|kaspi|каспи|счет|счёт|счет|бИН/.test(q)) {
        bot("Оплата согласуется с менеджером при подтверждении заказа; для клиник оформляем счёт на организацию (по БИН). Соберите нужные позиции в «Список закупки» — и отправьте запрос, менеджер подготовит счёт. <a class='linkbtn' href='profile.html'>Открыть список закупки</a>");
        return;
      }
      if (/график|работа|часы|когда открыт/.test(q)) {
        bot("Магазин работает: " + esc(C.company.hours) + " (" + esc(C.company.hoursNote) + "). Телефон " + esc(C.company.phone) + ".");
        return;
      }
      if (/контакт|телефон|адрес|где вы/.test(q)) {
        bot(esc(C.company.address) + ". Телефон: " + esc(C.company.phone) + ", WhatsApp — по кнопке ниже." +
          '<div class="advisor__chips" style="margin-top:8px"><a class="btn btn--sm btn--primary" href="' + ui.waLink("Здравствуйте! Вопрос по товарам.") + '" target="_blank" rel="noopener">' + MMS.icon("wa", 16) + "Написать в WhatsApp</a></div>");
        return;
      }
      /* подбор по товарам: чистим вопрос от разговорных слов, чтобы поиск не сбивался */
      const stop = { "а": 1, "у": 1, "вас": 1, "есть": 1, "можно": 1, "нужен": 1, "нужна": 1, "нужно": 1, "нужны": 1, "подскажите": 1, "посоветуйте": 1, "хочу": 1, "ищу": 1, "интересует": 1, "какие": 1, "какой": 1, "какая": 1, "что": 1, "где": 1, "сколько": 1, "стоит": 1, "цена": 1, "цены": 1, "штук": 1, "шт": 1 };
      const clean = qRaw.replace(/[?!.,:;]/g, " ").split(/\s+/)
        .filter((w) => w && !stop[w.toLowerCase()]).join(" ").trim();
      const s = MMS.search.suggest(clean || qRaw, 5);
      if (s.products.length) {
        bot("Вот что подходит под запрос «" + esc(qRaw) + "»:" + hitsHtml(s.products) +
          (s.total > s.products.length ? '<a class="linkbtn" href="catalog.html?q=' + encodeURIComponent(clean || qRaw) + '">Показать все (' + s.total + ")</a>" : ""));
      } else {
        bot("Не нашёл точных совпадений по запросу «" + esc(qRaw) + "». Уточните название, бренд или назначение — либо напишите менеджеру, подберём вручную." +
          '<div class="advisor__chips" style="margin-top:8px"><a class="btn btn--sm btn--ghost" href="catalog.html">Открыть каталог</a>' +
          '<a class="btn btn--sm btn--primary" href="' + ui.waLink("Здравствуйте! Помогите подобрать: " + qRaw) + '" target="_blank" rel="noopener">Спросить менеджера</a></div>');
      }
    }

    /* ИИ-помощник (Groq): ответ по каталогу; при сбое — локальный подбор выше */
    const aiHistory = [];
    let aiSystem = "";
    let sending = false;

    function aiSystemPrompt() {
      if (aiSystem) return aiSystem;
      const lines = MMS.PRODUCTS.map((p) => [
        p.id, p.name, p.brand, p.price, (p.tags || []).slice(0, 5).join(",")
      ].join("|"));
      aiSystem = "Ты — онлайн-консультант магазина стоматологических товаров «MegaMedStom Astana» (Астана, ул. Айнакол, 66). " +
        "Факты: доставка по всему Казахстану и самовывоз со склада; график Пн–Пт 09:00–17:30 (Сб–Вс по договорённости); " +
        "заказ без регистрации, менеджер подтверждает по WhatsApp; для клиник — счёт на организацию по БИН через «Список закупки». " +
        "Подбирай товары из каталога по запросу покупателя и отвечай на вопросы о доставке, оплате, самовывозе и оформлении заказа. " +
        "Каталог (по строке на товар, поля через |: id|название|бренд|цена ₸|теги):\n" +
        lines.join("\n") + "\n" +
        "Правила: 1) отвечай по-русски, кратко (1–3 предложения), вежливо и по делу; " +
        "2) рекомендуй только товары из каталога, указывая их id — от 1 до 4 самых подходящих; " +
        "3) если ничего не подходит — ids: [] и предложи уточнить запрос или написать менеджеру в WhatsApp; " +
        "4) на клинические вопросы (диагнозы, лечение, «чем лечить», дозировки) не давай медицинских советов и не подбирай товары — вежливо откажись и верни ids: []; " +
        "5) цены в тексте не перечисляй — они показаны покупателю под ответом; " +
        "6) без markdown, без ссылок, без эмодзи. " +
        'Формат ответа — строго JSON: {"reply": "текст ответа покупателю", "ids": ["id1", "id2"]}';
      return aiSystem;
    }

    async function askAI(text) {
      const cfg = MMS.CONFIG.ai || {};
      if (!cfg.enabled || !cfg.key) return null;
      const messages = [{ role: "system", content: aiSystemPrompt() }]
        .concat(aiHistory.slice(-6), [{ role: "user", content: text }]);
      const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
      const timer = ctrl ? setTimeout(() => ctrl.abort(), cfg.timeoutMs || 15000) : null;
      try {
        const r = await fetch(cfg.url, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + cfg.key },
          body: JSON.stringify({
            model: cfg.model,
            messages,
            temperature: 0.3,
            max_tokens: 400,
            response_format: { type: "json_object" }
          }),
          signal: ctrl ? ctrl.signal : undefined
        });
        if (!r.ok) return null;
        const d = await r.json();
        const raw = d && d.choices && d.choices[0] && d.choices[0].message ? String(d.choices[0].message.content || "") : "";
        const parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, ""));
        const reply = String(parsed.reply || "").trim();
        if (!reply) return null;
        const ids = Array.isArray(parsed.ids) ? parsed.ids.filter((x) => typeof x === "string") : [];
        return { reply: reply, ids: ids };
      } catch (e) {
        return null;
      } finally {
        if (timer) clearTimeout(timer);
      }
    }

    function renderAI(text, res) {
      const prods = (res.ids || []).slice(0, 4)
        .map((id) => MMS.PRODUCTS.find((p) => p.id === id)).filter(Boolean);
      let html = esc(res.reply);
      if (prods.length) {
        html += hitsHtml(prods);
      } else {
        html += '<div class="advisor__chips" style="margin-top:8px"><a class="btn btn--sm btn--ghost" href="catalog.html">Открыть каталог</a>' +
          '<a class="btn btn--sm btn--primary" href="' + ui.waLink("Здравствуйте! Помогите подобрать: " + text) + '" target="_blank" rel="noopener">Спросить менеджера</a></div>';
      }
      bot(html);
    }

    function send(text) {
      text = (text || "").trim();
      if (!text || sending) return;
      sending = true;
      user(text);
      $("#advisorInput").value = "";
      const typing = bot('<span class="advisor__typing"><i></i><i></i><i></i></span>');
      askAI(text).then((res) => {
        typing.remove();
        if (res) {
          aiHistory.push({ role: "user", content: text });
          aiHistory.push({ role: "assistant", content: JSON.stringify({ reply: res.reply, ids: res.ids }) });
          if (aiHistory.length > 16) aiHistory.splice(0, aiHistory.length - 16);
          renderAI(text, res);
        } else {
          answerLocal(text);
        }
      }).catch(() => {
        typing.remove();
        answerLocal(text);
      }).then(() => { sending = false; });
    }

    btn.addEventListener("click", () => {
      if (!greeted) {
        greeted = true;
        bot("Здравствуйте! Опишите, что ищете — например «артикаин 50 карпул» или «боры для турбины». Найду позиции в каталоге и помогу собрать заказ.");
      }
      ui.openSheet(sheet);
    });
    $("#advisorSend").addEventListener("click", () => send($("#advisorInput").value));
    $("#advisorInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send($("#advisorInput").value); }
    });
    $$("#advisorChips .advisor__chip").forEach((ch) => ch.addEventListener("click", () => send(ch.textContent)));
  }

  /* ---------- Скролл наверх ---------- */
  function bindScrollTop() {
    const b = document.createElement("button");
    b.className = "scroll-top";
    b.setAttribute("aria-label", "Наверх");
    b.innerHTML = MMS.icon("up", 19);
    b.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    document.body.appendChild(b);
    window.addEventListener("scroll", () => b.classList.toggle("is-visible", window.scrollY > 700), { passive: true });
  }

  /* ---------- Глобальные обработчики ---------- */
  function bindGlobal() {
    document.addEventListener("click", (e) => {
      const fav = e.target.closest("[data-fav]");
      if (fav) {
        const id = fav.getAttribute("data-fav");
        const active = MMS.store.favToggle(id);
        fav.classList.toggle("is-active", active);
        fav.innerHTML = MMS.icon(active ? "heartFill" : "heart", 17);
        if (active) ui.toast("Добавлено в избранное", { action: { label: "Избранное", href: "favorites.html" } });
        ui.syncBadges();
        return;
      }
      const add = e.target.closest("[data-add]");
      if (add) { ui.addSmart(add.getAttribute("data-add")); ui.syncCards(); ui.syncBadges(); return; }
      const inc = e.target.closest("[data-inc]");
      if (inc) { ui.addSmart(inc.getAttribute("data-inc")); ui.syncCards(); ui.syncBadges(); return; }
      const dec = e.target.closest("[data-dec]");
      if (dec) { ui.decSmart(dec.getAttribute("data-dec")); ui.syncCards(); ui.syncBadges(); return; }
      const addList = e.target.closest("[data-add-list]");
      if (addList) {
        const id = addList.getAttribute("data-add-list");
        const p = MMS.store.product(id);
        if (p) { MMS.store.add("list", id, "", 1); ui.toast("Добавлено в список закупки", { action: { label: "Список", href: "profile.html" } }); }
        return;
      }
      const cs = e.target.closest("[data-close-sheet]");
      if (cs) { ui.closeSheets(); return; }
      if (e.target.closest("[data-close-modal]")) { ui.closeModal(); return; }
      const cup = e.target.closest("[data-copy]");
      if (cup) { ui.copyText(cup.getAttribute("data-copy"), cup.getAttribute("data-copy-msg") || "Скопировано"); return; }
    });
    MMS.store.on("cart", ui.syncBadges);
    MMS.store.on("fav", ui.syncBadges);
    MMS.store.on("list", ui.syncBadges);
  }

  /* ---------- Инициализация ---------- */
  ui.init = function (opts) {
    if (inited) return; inited = true;
    opts = opts || {};
    const page = opts.page || document.body.getAttribute("data-page") || "";
    const cat = opts.cat || ui.qsp("cat");

    const chromeTop = $("#chromeTop");
    if (chromeTop) { chromeTop.innerHTML = headerHtml(page, cat); }

    /* Шапка на десктопе: прокрутка вниз — уезжает, вверх — возвращается.
       На телефоне шапка не липкая и просто прокручивается со страницей. */
    const headerEl = $(".header");
    if (headerEl) {
      const desk = window.matchMedia("(min-width: 900px)");
      let lastY = window.scrollY;
      window.addEventListener("scroll", () => {
        const y = window.scrollY;
        if (Math.abs(y - lastY) < 6) return;
        if (desk.matches) {
          headerEl.classList.toggle("is-hidden", y > lastY && y > 140);
        } else {
          headerEl.classList.remove("is-hidden");
        }
        headerEl.classList.toggle("is-scrolled", y > 8);
        lastY = y;
      }, { passive: true });
      desk.addEventListener("change", () => headerEl.classList.remove("is-hidden"));
    }
    const chromeFooter = $("#chromeFooter");
    if (chromeFooter) {
      chromeFooter.innerHTML = footerHtml();
      /* на телефоне ссылки футера свёрнуты в аккордеон, на десктопе раскрыты */
      const mqDesk = window.matchMedia("(min-width: 760px)");
      const syncFacc = () => $$(".facc").forEach((d) => { d.open = mqDesk.matches; });
      syncFacc();
      if (mqDesk.addEventListener) mqDesk.addEventListener("change", syncFacc);
    }
    const bn = $("#bottomNav");
    if (bn) bn.innerHTML = bottomNavHtml(page);

    /* иконки, размеченные в HTML страниц через data-icon */
    $$("[data-icon]").forEach((el) => {
      const svg = MMS.icon(el.getAttribute("data-icon"), parseInt(el.getAttribute("data-isize"), 10) || 20);
      if (el.childNodes.length === 0) el.innerHTML = svg;
      else el.insertAdjacentHTML("afterbegin", svg);
    });

    ensureOverlay();
    bindSearch();
    bindAdvisor(page);
    bindScrollTop();
    bindGlobal();
    ui.syncBadges();
    document.dispatchEvent(new CustomEvent("mms:ready", { detail: { page } }));
  };

  MMS.ui = ui;
})();
