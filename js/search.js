/* ============================================================
   MegaMedStom — поиск, фильтры и сортировка по каталогу.
   Работает на данных каталога (без выдуманных результатов).
   ============================================================ */
(function () {
  function norm(s) {
    return String(s || "").toLowerCase().replace(/ё/g, "е").replace(/[^a-zа-я0-9.\s-]/gi, " ").replace(/\s+/g, " ").trim();
  }
  function tokens(q) { return norm(q).split(" ").filter(Boolean); }

  function catName(slug) {
    const c = (MMS.CATEGORIES || []).find((x) => x.slug === slug);
    return c ? c.name : "";
  }
  function subName(cat, sub) {
    const c = (MMS.CATEGORIES || []).find((x) => x.slug === cat);
    if (!c) return "";
    const s = c.subs.find((x) => x.slug === sub);
    return s ? s.name : "";
  }
  function shortName(cat, sub) {
    const c = (MMS.CATEGORIES || []).find((x) => x.slug === cat);
    if (c && c.subs.length === 1) return c.name;
    return subName(cat, sub) || catName(cat);
  }

  /* Расширение запроса синонимами (в обе стороны) */
  function expand(ts) {
    const out = ts.slice();
    const syn = MMS.SYN || {};
    ts.forEach((t) => {
      Object.keys(syn).forEach((k) => {
        const v = syn[k];
        if (norm(k).indexOf(t) === 0 || t === norm(k)) {
          norm(v).split(" ").forEach((x) => { if (out.indexOf(x) < 0) out.push(x); });
        }
        if (norm(v).indexOf(t) === 0 || norm(v) === t) {
          norm(k).split(" ").forEach((x) => { if (out.indexOf(x) < 0) out.push(x); });
        }
      });
    });
    return out;
  }

  function score(p, ts) {
    if (!ts.length) return 1;
    let total = 0;
    const fields = [
      { w: 6, text: norm(p.name) },
      { w: 4, text: norm(p.brand) },
      { w: 3, text: norm((p.tags || []).join(" ")) },
      { w: 2, text: norm(catName(p.cat) + " " + subName(p.cat, p.sub)) },
      { w: 1, text: norm(p.desc) }
    ];
    const art = norm(p.article);
    ts.forEach((t) => {
      let best = 0;
      fields.forEach((f) => {
        if (f.text.indexOf(t) >= 0) {
          const w = f.text.split(" ").some((word) => word.indexOf(t) === 0) ? f.w * 1.4 : f.w;
          if (w > best) best = w;
        }
      });
      if (art.indexOf(t) >= 0) best = Math.max(best, 9);
      total += best;
    });
    return total;
  }

  const search = {
    norm, tokens, catName, subName, shortName,

    /* Основной запрос с фильтрами */
    query(q, opt) {
      opt = opt || {};
      const ts = expand(tokens(q));
      let items = (MMS.store ? MMS.store.products() : MMS.PRODUCTS.slice());

      if (opt.cat) items = items.filter((p) => p.cat === opt.cat);
      if (opt.sub) items = items.filter((p) => p.sub === opt.sub);
      if (opt.brands && opt.brands.length) items = items.filter((p) => opt.brands.indexOf(p.brand) >= 0);
      if (opt.pmin != null) items = items.filter((p) => (p.price == null ? false : p.price >= opt.pmin));
      if (opt.pmax != null) items = items.filter((p) => (p.price == null ? false : p.price <= opt.pmax));
      if (opt.onlyNew) items = items.filter((p) => p.isNew);
      if (opt.onlyStock) items = items.filter((p) => p.price != null);

      if (ts.length) {
        items = items.map((p) => ({ p, s: score(p, ts) })).filter((x) => x.s > 0)
          .sort((a, b) => b.s - a.s)
          .map((x) => x.p);
      }

      const sort = opt.sort || (ts.length ? "relevance" : "popular");
      const sorters = {
        popular: (a, b) => (a.rank || 99) - (b.rank || 99),
        relevance: null,
        priceAsc: (a, b) => (a.price == null ? 1e12 : a.price) - (b.price == null ? 1e12 : b.price),
        priceDesc: (a, b) => (b.price == null ? -1 : b.price) - (a.price == null ? -1 : a.price),
        name: (a, b) => a.name.localeCompare(b.name, "ru"),
        new: (a, b) => (b.addedAt || 0) - (a.addedAt || 0)
      };
      if (sort !== "relevance") {
        const f = sorters[sort] || sorters.popular;
        items = items.slice().sort(f);
      } else if (!ts.length) {
        items = items.slice().sort(sorters.popular);
      }
      return items;
    },

    /* Подсказки для строки поиска */
    suggest(q, limit) {
      limit = limit || 6;
      const ts = expand(tokens(q));
      const res = search.query(q, {});
      const products = res.slice(0, limit);
      const cats = [];
      (MMS.CATEGORIES || []).forEach((c) => {
        const n = norm(c.name);
        if (ts.some((t) => n.indexOf(t) >= 0)) cats.push(c);
      });
      const brands = (MMS.BRANDS || []).filter((b) => ts.some((t) => norm(b).indexOf(t) >= 0)).slice(0, 4);
      return { products, cats, brands, total: res.length };
    },

    /* Параметры URL <-> фильтры */
    fromParams(sp) {
      const get = (k) => sp.get(k);
      const brands = (get("brand") || "").split(",").map((s) => s.trim()).filter(Boolean);
      const num = (v) => { const n = parseInt(v, 10); return isNaN(n) ? null : n; };
      return {
        q: get("q") || "",
        cat: get("cat") || "",
        sub: get("sub") || "",
        brands,
        pmin: num(get("pmin")),
        pmax: num(get("pmax")),
        onlyNew: get("new") === "1",
        onlyStock: get("stock") === "1",
        sort: get("sort") || ""
      };
    },
    toParams(f, extra) {
      const sp = new URLSearchParams();
      if (f.q) sp.set("q", f.q);
      if (f.cat) sp.set("cat", f.cat);
      if (f.sub) sp.set("sub", f.sub);
      if (f.brands && f.brands.length) sp.set("brand", f.brands.join(","));
      if (f.pmin != null) sp.set("pmin", f.pmin);
      if (f.pmax != null) sp.set("pmax", f.pmax);
      if (f.onlyNew) sp.set("new", "1");
      if (f.onlyStock) sp.set("stock", "1");
      if (f.sort) sp.set("sort", f.sort);
      Object.keys(extra || {}).forEach((k) => { if (extra[k]) sp.set(k, extra[k]); });
      return sp.toString();
    },
    activeCount(f) {
      let n = 0;
      if (f.brands && f.brands.length) n += f.brands.length;
      if (f.pmin != null) n++;
      if (f.pmax != null) n++;
      if (f.onlyNew) n++;
      if (f.onlyStock) n++;
      if (f.sub) n++;
      return n;
    },
    /* Бренды с количеством товаров в выборке (без учёта самого фильтра брендов) */
    brandCounts(baseOpt) {
      const items = search.query("", Object.assign({}, baseOpt, { brands: [] }));
      const map = {};
      items.forEach((p) => { map[p.brand] = (map[p.brand] || 0) + 1; });
      return map;
    },
    priceRange(baseOpt) {
      const items = search.query("", Object.assign({}, baseOpt, { brands: [], pmin: null, pmax: null }));
      let min = Infinity, max = 0;
      items.forEach((p) => { if (p.price != null) { min = Math.min(min, p.price); max = Math.max(max, p.price); } });
      if (min === Infinity) return { min: 0, max: 0 };
      return { min, max };
    }
  };

  MMS.search = search;
})();
