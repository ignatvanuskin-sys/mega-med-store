/* ============================================================
   MegaMedStom — хранилище состояния (localStorage).
   Корзина, избранное, список закупки, заказы, недавние, история
   поиска, данные клиента и локальные правки каталога (админ-панель).
   ============================================================ */
(function () {
  const LS_KEY = "mms_state_v1";
  const listeners = {};

  const defaults = () => ({
    cart: {},          // key -> { id, variant, qty }
    fav: [],           // [id]
    list: {},          // key -> { id, variant, qty }  (список закупки)
    orders: [],        // заказы (локальные)
    recent: [],        // [id]
    searches: [],      // [строка]
    customer: {},      // { name, phone, email, city, address, bin }
    prodEdits: {},     // id -> { price, name }
    hidden: {}         // служебные флаги интерфейса
  });

  let state = defaults();

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) state = Object.assign(defaults(), JSON.parse(raw));
    } catch (e) { state = defaults(); }
  }
  function save() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function emit(type, detail) {
    (listeners[type] || []).forEach((fn) => { try { fn(detail); } catch (e) {} });
    (listeners["change"] || []).forEach((fn) => { try { fn({ type, detail }); } catch (e) {} });
  }

  load();

  const keyOf = (id, variant) => id + "::" + (variant || "");

  const store = {
    on(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); },
    raw() { return state; },

    /* ---------- Каталог: эффективная карточка (с учётом правок) ---------- */
    product(id) {
      const base = (MMS.PRODUCTS || []).find((p) => p.id === id);
      if (!base) return null;
      const edit = state.prodEdits[id];
      return edit ? Object.assign({}, base, edit, { id }) : base;
    },
    products() { return (MMS.PRODUCTS || []).map((p) => store.product(p.id)); },
    prodEdit(id, patch) { state.prodEdits[id] = Object.assign({}, state.prodEdits[id], patch); save(); emit("catalog"); },
    prodReset(id) { if (id) delete state.prodEdits[id]; else state.prodEdits = {}; save(); emit("catalog"); },

    /* ---------- Корзина / список закупки ---------- */
    add(bag, id, variant, qty) {
      const p = store.product(id);
      if (!p) return;
      const v = variant != null ? variant : (p.variants && p.variants.length ? p.variants[0].label : "");
      const k = keyOf(id, v);
      const cur = state[bag][k] || { id, variant: v, qty: 0 };
      cur.qty += (qty || 1);
      if (cur.qty <= 0) delete state[bag][k]; else state[bag][k] = cur;
      save(); emit(bag === "cart" ? "cart" : "list");
    },
    setQty(bag, key, qty) {
      const cur = state[bag][key];
      if (!cur) return;
      if (qty <= 0) delete state[bag][key]; else cur.qty = qty;
      save(); emit(bag === "cart" ? "cart" : "list");
    },
    remove(bag, key) { delete state[bag][key]; save(); emit(bag === "cart" ? "cart" : "list"); },
    clearBag(bag) { state[bag] = {}; save(); emit(bag === "cart" ? "cart" : "list"); },
    bagItems(bag) {
      return Object.keys(state[bag]).map((k) => {
        const it = state[bag][k];
        const p = store.product(it.id);
        return p ? { key: k, qty: it.qty, variant: it.variant, product: p, price: store.priceOf(p, it.variant), sum: store.priceOf(p, it.variant) * it.qty } : null;
      }).filter(Boolean);
    },
    priceOf(p, variant) {
      if (p.variants && p.variants.length) {
        const v = p.variants.find((x) => x.label === variant);
        if (v) return v.price;
      }
      return p.price;
    },
    bagCount(bag) { return Object.values(state[bag]).reduce((s, it) => s + it.qty, 0); },
    bagTotal(bag) { return store.bagItems(bag).reduce((s, it) => s + (it.sum || 0), 0); },
    qtyOf(id, bag) {
      let n = 0;
      Object.values(state[bag || "cart"]).forEach((it) => { if (it.id === id) n += it.qty; });
      return n;
    },

    /* ---------- Избранное ---------- */
    favToggle(id) {
      const i = state.fav.indexOf(id);
      if (i >= 0) state.fav.splice(i, 1); else state.fav.push(id);
      save(); emit("fav", { id, active: i < 0 });
      return i < 0;
    },
    favHas(id) { return state.fav.indexOf(id) >= 0; },
    favItems() { return state.fav.map((id) => store.product(id)).filter(Boolean); },

    /* ---------- Недавно просмотренные ---------- */
    recentPush(id) {
      state.recent = [id].concat(state.recent.filter((x) => x !== id)).slice(0, 10);
      save(); emit("recent");
    },
    recentItems(excludeId) { return state.recent.filter((x) => x !== excludeId).map((id) => store.product(id)).filter(Boolean); },

    /* ---------- Поиск ---------- */
    searchPush(q) {
      q = (q || "").trim();
      if (!q) return;
      state.searches = [q].concat(state.searches.filter((x) => x !== q)).slice(0, 6);
      save(); emit("searches");
    },
    searchHistory() { return state.searches.slice(); },
    searchClear() { state.searches = []; save(); emit("searches"); },

    /* ---------- Заказы ---------- */
    orderCreate(payload) {
      const d = new Date();
      const p2 = (x) => String(x).padStart(2, "0");
      const num = "MMS-" + String(d.getFullYear()).slice(2) + p2(d.getMonth() + 1) + p2(d.getDate()) + "-" + String(Math.floor(1000 + Math.random() * 9000));
      const order = Object.assign({
        id: num, createdAt: Date.now(), status: "new", channel: "whatsapp"
      }, payload);
      state.orders.unshift(order);
      save(); emit("orders");
      return order;
    },
    ordersAll() { return state.orders.slice(); },
    orderGet(id) { return state.orders.find((o) => o.id === id) || null; },
    orderUpdate(id, patch) {
      const o = state.orders.find((x) => x.id === id);
      if (o) { Object.assign(o, patch); save(); emit("orders"); }
      return o;
    },

    /* ---------- Клиент ---------- */
    customerSave(data) { state.customer = Object.assign({}, state.customer, data); save(); },
    customer() { return Object.assign({}, state.customer); },

    /* ---------- Служебное ---------- */
    hide(key) { state.hidden[key] = true; save(); },
    isHidden(key) { return !!state.hidden[key]; },

    /* ---------- Экспорт / импорт (админ-панель) ---------- */
    exportAll() {
      return JSON.stringify({
        exportedAt: new Date().toISOString(),
        catalog: MMS.PRODUCTS,
        state: state
      }, null, 2);
    },
    importAll(json) {
      const data = JSON.parse(json);
      if (data.state) { state = Object.assign(defaults(), data.state); save(); emit("change", { type: "import" }); }
      return true;
    },
    resetAll() { state = defaults(); save(); emit("change", { type: "reset" }); }
  };

  MMS.store = store;
  MMS.STATUSES = [
    { id: "new", label: "Новый" },
    { id: "confirmed", label: "Подтверждён" },
    { id: "packed", label: "Собирается" },
    { id: "shipped", label: "Отправлен" },
    { id: "done", label: "Завершён" },
    { id: "canceled", label: "Отменён" }
  ];
  MMS.statusLabel = function (id) {
    const s = (MMS.STATUSES || []).find((x) => x.id === id);
    return s ? s.label : id;
  };
})();
