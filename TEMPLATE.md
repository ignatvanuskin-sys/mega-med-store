# Шаблон интернет-магазина MegaMedStom

Статический магазин без сборки и зависимостей: HTML + CSS + ванильный JS.
Открывается с любого хостинга, каталог и цены лежат в одном файле.

Новый магазин = 5 правок. Ниже — что менять и в каком порядке.

## 1. Бренд и контакты — `js/base.js`

```js
MMS.CONFIG.company = {
  name: "Название",
  phone: "+7 ...", phoneDial: "+7...",
  whatsapp: "...", email: "...",
  address: "...", hours: "...", mapUrl: "..."
};
```

Здесь же: ссылки на соцсети, способ оплаты, текст примечания в футере, пароль входа в панель.

## 2. Логотип — `images/brand/mark.svg` и `js/base.js → MMS.logoMark`

- `mark.svg` — знак для favicon и соцсетей (64×64).
- `MMS.logoMark(size)` — тот же знак инлайном (шапка, футер).
- Название в шапке — обычный текст, менять в `js/ui.js → headerHtml` и `footerHtml`.

Правила: охранное поле не меньше высоты латунной точки, знак от 24 px,
логотип с подписью от 120 px. Полные правила — на странице `styleguide.html`.

## 3. Каталог — `js/data.js`

```js
{ id: "comp-001", name: "...", brand: "GC", art: "MM-1001",
  cat: "terapiya", sub: "kompozity", price: 24900, unit: "шприц 4 г",
  art: "compos", img: "images/products/comp-001.jpg",
  variants: ["Оттенок A1", ...], tags: ["hit"], desc: "..." }
```

- `id` — латиницей, используется в URL `product.html?id=...`.
- `img` — путь к JPEG 900×900; WebP-версии генерируются отдельно (см. ниже).
- `price: null` — позиция «цена по запросу» (уходит в список закупки, а не в корзину).

### Фото

```bash
python - <<'PY'
from PIL import Image; from pathlib import Path
for f in Path("images/products").glob("*.jpg"):
    im = Image.open(f).convert("RGB")
    im.resize((640,640), Image.LANCZOS).save(f.with_suffix(".webp"), "WEBP", quality=82)
    im.resize((320,320), Image.LANCZOS).save(f.with_name(f.stem+"-320.webp"), "WEBP", quality=80)
PY
```

Имена не меняются: `artBlock()` сам подставляет `-320.webp` и `.webp` через `srcset`.

## 4. Палитра и типографика — `css/premium.css` + `css/themes.css`

Все цвета — CSS-переменные в `:root`. Быстрая смена характера:

```html
<html data-theme="graphite">  <!-- default | graphite | marine -->
```

Тема запоминается в браузере (`localStorage.mms_theme`) и применяется на всех страницах.
Добавить свою — блок в `css/themes.css`, переопределяющий 10 переменных.
Шрифты меняются в `<link>` Google Fonts + `--font-display` в `premium.css`.

## 5. Запуск

1. Заменить домен в `canonical`, `og:url`, `sitemap.xml`, `robots.txt`.
2. Проверить `css/*.css?v=...` — при правках версию нужно поднимать (кэш на сутки).
3. Задеплоить: GitHub → Vercel (или любой статический хостинг).
4. До публикации: закрыть `admin.html` серверной авторизацией, подключить приём
   заказов (БД или вебхук), проверить реквизиты и политику конфиденциальности.

## Структура

```
index.html          главная
catalog.html        каталог и фильтры (состояние в URL)
product.html        карточка товара (?id=)
cart.html           корзина
checkout.html       оформление
favorites.html      избранное
profile.html        заказы и список закупки
about / delivery / returns / privacy / terms   информационные страницы
admin.html          панель менеджера (демо-доступ)
styleguide.html     айдентика и UI-кит
css/base.css        токены и базовые компоненты
css/shop.css        страницы магазина
css/premium.css     премиальный слой (палитра, типографика, блоки)
css/themes.css      пресеты тем
js/base.js          конфиг бренда, иконки, логотип
js/data.js          каталог
js/store.js         корзина, избранное, заказы (localStorage)
js/search.js        поиск и фильтры
js/ui.js            шапка, футер, навигация, шторки, виджеты
```
