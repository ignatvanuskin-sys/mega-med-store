/* ============================================================
   MegaMedStom — база: конфиг, формат, иконки
   Данные компании: подтверждены 2ГИС/Instagram (см. README).
   Поля с пометкой TODO требуют уточнения у владельца.
   ============================================================ */
window.MMS = window.MMS || {};

MMS.CONFIG = {
  company: {
    name: "MegaMedStom",
    legalName: "Megamedstom Astana",
    descriptor: "Товары для стоматологий",
    tagline: "Материалы, инструменты и оборудование для стоматологических кабинетов и клиник",
    city: "Астана",
    address: "г. Астана, ул. Айнакол, 66",
    addressFull: "г. Астана, Алматинский район, ул. Айнакол, 66",
    hours: "Пн–Пт: 09:00–17:30",            // TODO: уточнить выходные у владельца
    hoursNote: "Сб–Вс — по договорённости",
    phone: "+7 771 544 24 87",
    phone2: "+7 700 544 40 82",
    phoneDial: "+77715442487",
    phone2Dial: "+77005444082",
    whatsapp: "77715442487",
    email: "megamedstomastana@mail.ru",
    instagram: "https://www.instagram.com/megamedstom_astana",
    deliveryShort: "Доставка по всему Казахстану",
    pickup: "Самовывоз со склада: ул. Айнакол, 66",
    mapUrl: "https://2gis.kz/astana/firm/70000001053670698"
  },
  demo: {
    enabled: false,
    banner: "",
    adminPass: "admin2026" // локальный вход в панель менеджера; в продакшене — серверная авторизация
  },
  ai: {
    // ИИ-помощник подбора (Groq API).
    // Ключ в статическом сайте хранить нельзя — он сразу становится публичным,
    // поэтому в рабочей версии запросы идут через прокси на сервере (см. README).
    // Пока прокси не подключён, помощник подбирает товары встроенным поиском по каталогу.
    enabled: false,
    url: "https://api.groq.com/openai/v1/chat/completions",
    key: "",
    model: "qwen/qwen3.8-27b",
    timeoutMs: 15000
  },
  integrations: {
    // Точки подключения продакшена (подробнее — README):
    orderChannel: "whatsapp",   // заказы уходят менеджеру в WhatsApp (реальный сценарий)
    payments: null,             // эквайринг (требуются данные мерчанта)
    crm: null,                  // выгрузка заказов в CRM/учётную систему
    notifyEmail: "megamedstomastana@mail.ru"
  },
  currency: "₸",
  lang: "ru",                    // архитектура готова к добавлению kz
  pageSize: 24
};

/* ---------- Форматирование ---------- */
MMS.fmt = {
  nf: new Intl.NumberFormat("ru-RU"),
  price(n, currency) {
    if (n === null || n === undefined) return "По запросу";
    return MMS.fmt.nf.format(Math.round(n)) + "\u00A0" + (currency || MMS.CONFIG.currency);
  },
  num(n) { return MMS.fmt.nf.format(n); },
  date(ts) {
    const d = new Date(ts);
    const p = (x) => String(x).padStart(2, "0");
    return p(d.getDate()) + "." + p(d.getMonth() + 1) + "." + d.getFullYear() + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  },
  dateShort(ts) {
    const d = new Date(ts);
    const p = (x) => String(x).padStart(2, "0");
    return p(d.getDate()) + "." + p(d.getMonth() + 1) + "." + d.getFullYear();
  },
  plural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  },
  goodsWord(n) { return MMS.fmt.plural(n, "товар", "товара", "товаров"); },
  escape(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  },
  uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
};

/* ---------- Иконки (24×24, линейные) ---------- */
(function () {
  const P = {
    search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z|M21 21l-4.3-4.3',
    cart: 'M3 4h2l2.3 11.7a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20.5 8H6|M11.3 20a1.3 1.3 0 1 1-2.6 0 1.3 1.3 0 0 1 2.6 0z|M18.8 20a1.3 1.3 0 1 1-2.6 0 1.3 1.3 0 0 1 2.6 0z',
    heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z',
    user: 'M20 21v-1.8a4.2 4.2 0 0 0-4.2-4.2H8.2A4.2 4.2 0 0 0 4 19.2V21|M12 3.5a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6z',
    home: 'M3 10.2 12 3l9 7.2V20a1.6 1.6 0 0 1-1.6 1.6H4.6A1.6 1.6 0 0 1 3 20z|M9.4 21.4v-6.8h5.2v6.8',
    grid: 'M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z',
    phone: 'M22 16.9v2.8a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h2.8a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L7.9 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z',
    mail: 'M4 5h16a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5v-11A1.5 1.5 0 0 1 4 5z|m3 7 9 6 9-6',
    pin: 'M20 10.4c0 6.6-8 11.6-8 11.6s-8-5-8-11.6a8 8 0 0 1 16 0z|M12 7.5a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8z',
    clock: 'M12 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4z|M12 7.5v4.8l3.2 1.9',
    truck: 'M2 5.5h12.5V16H2zM14.5 9H18l3.5 3.5V16h-7|M6 18.5a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8z|M17.5 18.5a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8z',
    shield: 'M12 21.5s7.5-3.2 7.5-9.3V5.6L12 2.5 4.5 5.6v6.6c0 6.1 7.5 9.3 7.5 9.3z|m9 11.6 2.2 2.2 4-4.2',
    doc: 'M13.5 2.5H7A1.8 1.8 0 0 0 5.2 4.3v15.4A1.8 1.8 0 0 0 7 21.5h10a1.8 1.8 0 0 0 1.8-1.8V7.8z|M13.5 2.5v5.3h5.3',
    plus: 'M12 5.5v13M5.5 12h13',
    minus: 'M5.5 12h13',
    x: 'M18 6 6 18M6 6l12 12',
    chevR: 'm9 6 6 6-6 6',
    chevD: 'm6 9 6 6 6-6',
    chevL: 'm15 6-6 6 6 6',
    filter: 'M21 4H3l7 8.5V19l4 2.5v-9z',
    sort: 'M4 6.5h16M7 12h10M10 17.5h4',
    check: 'M20 6.5 9.5 17 4 11.5',
    checkC: 'M12 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4z|m8.5 12 2.4 2.4 4.6-5',
    copy: 'M9 9h10a1.8 1.8 0 0 1 1.8 1.8v8.4A1.8 1.8 0 0 1 19 21H9a1.8 1.8 0 0 1-1.8-1.8v-8.4A1.8 1.8 0 0 1 9 9z|M5.8 15H5a1.8 1.8 0 0 1-1.8-1.8V4.8A1.8 1.8 0 0 1 5 3h8.4A1.8 1.8 0 0 1 15 4.8V5',
    trash: 'M4 6.5h16M9.5 6.5v-2h5v2M7 6.5 8 20a1.6 1.6 0 0 0 1.6 1.5h4.8A1.6 1.6 0 0 0 16 20l1-13.5',
    edit: 'M12 20h9|M16.7 3.8a2 2 0 0 1 2.9 2.9L7.4 18.9 3.5 20l1.1-3.9z',
    eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z|M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    spark: 'M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.4l-1.9-5.6L4.5 10.9 10.1 9z|M19 3v3M17.5 4.5h3',
    info: 'M12 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4z|M12 16.5v-5M12 8h.01',
    alert: 'M10.3 3.9 1.9 18.2A2 2 0 0 0 3.6 21h16.8a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0z|M12 9v4.5M12 17h.01',
    repeat: 'M21 12a9 9 0 1 1-2.6-6.3|M21 3.5V9h-5.5',
    list: 'M9 5.5H7A1.8 1.8 0 0 0 5.2 7.3v12A1.8 1.8 0 0 0 7 21h10a1.8 1.8 0 0 0 1.8-1.8v-12A1.8 1.8 0 0 0 17 5.5h-2|M9 3.5h6v4H9z|M9.5 13h5M9.5 16.5h5',
    help: 'M12 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4z|M9.3 9.3a2.8 2.8 0 0 1 5.4 1c0 1.8-2.7 2.2-2.7 3.7|M12 17h.01',
    up: 'M12 19V5M5.5 11.5 12 5l6.5 6.5',
    download: 'M21 15.5v3A1.8 1.8 0 0 1 19.2 20H4.8A1.8 1.8 0 0 1 3 18.5v-3|M7.5 11l4.5 4.5L16.5 11M12 3v12.5',
    upload: 'M21 15.5v3A1.8 1.8 0 0 1 19.2 20H4.8A1.8 1.8 0 0 1 3 18.5v-3|M7.5 7.5 12 3l4.5 4.5M12 3v12.5',
    lock: 'M5.5 10.5h13V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20z|M8.5 10.5V7a3.5 3.5 0 0 1 7 0v3.5',
    send: 'm21.5 2.5-7 19-4-8.5-8.5-4z|M21.5 2.5 10.5 13',
    ext: 'M18 13.5v5A1.8 1.8 0 0 1 16.2 20H4.8A1.8 1.8 0 0 1 3 18.2V7a1.8 1.8 0 0 1 1.8-1.8h5|M14.5 3h6.5v6.5M21 3l-9 9',
    receipt: 'M5 3.5h14v17l-2.3-1.4-2.4 1.4-2.3-1.4-2.3 1.4-2.4-1.4L5 20.5z|M9 8.5h6M9 12.5h6',
    wa: 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.7-.1-1.9-.6-4.3-2.7-5.3-4.9-.3-.7-.5-1.4-.4-1.9.1-.6.6-1.2 1-1.4.3-.2.9-.2 1.1.1l.8 1.5c.1.2.1.4 0 .6l-.4.6c-.1.2-.2.3 0 .6.5.8 1.5 1.8 2.3 2.2.3.1.4.1.6-.1l.7-.7c.2-.2.4-.2.6-.1l1.5.8c.2.1.4.4.3.6z',
    ig: 'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3z|M12 7.8a4.2 4.2 0 1 0 0 8.4 4.2 4.2 0 0 0 0-8.4z|M17.2 6.6h.01'
  };

  MMS.icon = function (name, size, cls) {
    if (typeof name === "string" && name.slice(-4) === "Fill") return MMS.iconFill(name.slice(0, -4), size, cls);
    const raw = P[name] || P.info;
    const paths = raw.split("|").map((d) => '<path d="' + d + '"/>').join("");
    return '<svg width="' + (size || 20) + '" height="' + (size || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="' + (cls || "") + '" aria-hidden="true">' + paths + "</svg>";
  };
  MMS.iconFill = function (name, size, cls) {
    const raw = P[name] || P.info;
    const paths = raw.split("|").map((d) => '<path d="' + d + '" fill="currentColor" stroke="none"/>').join("");
    return '<svg width="' + (size || 20) + '" height="' + (size || 20) + '" viewBox="0 0 24 24" class="' + (cls || "") + '" aria-hidden="true">' + paths + "</svg>";
  };
})();

/* ---------- Логотип ---------- */
MMS.logoMark = function (size) {
  const s = size || 34;
  return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 64 64" fill="none" aria-hidden="true">' +
    '<rect width="64" height="64" rx="17" fill="#0F4C44"/>' +
    '<rect x="1" y="1" width="62" height="62" rx="16" stroke="#FFFFFF" stroke-opacity=".14"/>' +
    '<path d="M32 16c-3.8 0-5.4 2.3-9.2 2.3-3 0-4.8 2.5-3.5 6.7.9 2.8 1.3 6.4 2.6 10.2 1 2.9 3.6 2.5 4.2-.7.3-1.7.4-4.2 2-4.2s1.7 2.5 2 4.2c.6 3.2 3.2 3.6 4.2.7 1.3-3.8 1.7-7.4 2.6-10.2 1.3-4.2-.5-6.7-3.5-6.7C37.4 18.3 35.8 16 32 16z" stroke="#F7F5EF" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<circle cx="47" cy="17" r="3.2" fill="#C39A64"/>' +
    "</svg>";
};
