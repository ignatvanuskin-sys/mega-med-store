/* ============================================================
   MegaMedStom — иллюстрации товаров и категорий.
   Единый стиль: линейная графика на мягком фоне, графит + бирюза.
   В продакшене заменяются реальными фотографиями компании
   (поддерживается поле img у товара в data.js).
   ============================================================ */
(function () {
  const ST = "#23272E";       // графит
  const AC = "#0E7C74";       // акцент
  const SO = "#CDE9E5";       // мягкий акцент
  const PA = "#E9EEEC";       // бледный
  const WH = "#FFFFFF";
  const GY = "#D9DEDB";
  const s = (w) => ' stroke="' + ST + '" stroke-width="' + (w || 5) + '" stroke-linecap="round" stroke-linejoin="round"';
  const halo = '<circle cx="100" cy="100" r="66" fill="#EDF3F1"/>';
  const A = (inner) => '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + inner + "</svg>";

  const ART = {
    /* --- Терапия --- */
    compos: A(halo +
      '<rect x="88" y="16" width="24" height="28" rx="6" fill="' + WH + '"' + s() + "/>" +
      '<rect x="70" y="42" width="60" height="13" rx="6.5" fill="' + WH + '"' + s() + "/>" +
      '<rect x="80" y="54" width="40" height="88" rx="10" fill="' + WH + '"' + s() + "/>" +
      '<rect x="88" y="62" width="24" height="72" rx="7" fill="' + SO + '" fill-opacity=".85"/>' +
      '<rect x="80" y="80" width="40" height="30" fill="' + PA + '"' + s(4) + "/>" +
      '<circle cx="100" cy="95" r="5.5" fill="' + AC + '"/>' +
      '<path d="M92 142h16v8l-8 13-8-13z" fill="' + WH + '"' + s() + "/>" +
      '<path d="M100 163v12"' + s(3.6) + "/>"),

    bottle: A(halo +
      '<rect x="86" y="22" width="28" height="24" rx="7" fill="' + WH + '"' + s() + "/>" +
      '<rect x="91" y="46" width="18" height="14" fill="' + WH + '"' + s(4) + "/>" +
      '<rect x="76" y="60" width="48" height="92" rx="13" fill="' + WH + '"' + s() + "/>" +
      '<path d="M84 108v30a8 8 0 0 0 8 8h16a8 8 0 0 0 8-8v-30z" fill="' + SO + '" fill-opacity=".9"/>' +
      '<rect x="76" y="82" width="48" height="24" fill="' + PA + '"' + s(4) + "/>" +
      '<circle cx="100" cy="94" r="5.5" fill="' + AC + '"/>'),

    gel: A(halo +
      '<rect x="90" y="24" width="20" height="26" rx="5" fill="' + WH + '"' + s() + "/>" +
      '<rect x="83" y="46" width="34" height="12" rx="6" fill="' + WH + '"' + s() + "/>" +
      '<rect x="84" y="56" width="32" height="62" rx="8" fill="' + WH + '"' + s() + "/>" +
      '<rect x="90" y="62" width="20" height="50" rx="5" fill="' + SO + '" fill-opacity=".85"/>' +
      '<path d="M94 118h12l-6 11z" fill="' + WH + '"' + s(4) + "/>" +
      '<path d="M100 129v16"' + s(3.6) + "/>" +
      '<path d="M100 150c0 0 7 8.5 7 13a7 7 0 0 1-14 0c0-4.5 7-13 7-13z" fill="' + AC + '"/>'),

    tube: A(halo +
      '<rect x="88" y="20" width="24" height="16" rx="6" fill="' + WH + '"' + s() + "/>" +
      '<path d="M78 36h44v92a14 14 0 0 1-14 14H92a14 14 0 0 1-14-14z" fill="' + WH + '"' + s() + "/>" +
      '<rect x="78" y="142" width="44" height="16" rx="5" fill="' + GY + '"' + s(4) + "/>" +
      '<rect x="78" y="58" width="44" height="44" fill="' + PA + '"' + s(4) + "/>" +
      '<path d="M78 90h44" stroke="' + AC + '" stroke-width="6" stroke-linecap="round"/>'),

    jar: A(halo +
      '<rect x="86" y="30" width="28" height="14" rx="7" fill="' + WH + '"' + s() + "/>" +
      '<rect x="66" y="44" width="68" height="18" rx="9" fill="' + WH + '"' + s() + "/>" +
      '<rect x="72" y="62" width="56" height="78" rx="10" fill="' + WH + '"' + s() + "/>" +
      '<rect x="72" y="84" width="56" height="36" fill="' + PA + '"' + s(4) + "/>" +
      '<path d="M84 96h32M84 108h20"' + s(4) + "/>"),

    disc: A(halo +
      '<path d="M54 96a46 14 0 0 1 92 0v36a46 14 0 0 1-92 0z" fill="' + WH + '"' + s() + "/>" +
      '<ellipse cx="100" cy="96" rx="46" ry="14" fill="' + SO + '"' + s() + "/>" +
      '<path d="M54 114a46 14 0 0 0 92 0" fill="none"' + s(4) + "/>" +
      '<path d="M100 82V58"' + s() + "/>" +
      '<circle cx="100" cy="50" r="6.5" fill="' + AC + '"/>'),

    brush: A(halo +
      '<path d="M62 158 116 104"' + s(11) + "/>" +
      '<path d="M62 158l14-14" stroke="' + AC + '" stroke-width="11" stroke-linecap="round"/>' +
      '<ellipse cx="129" cy="91" rx="25" ry="17" transform="rotate(-45 129 91)" fill="' + SO + '"' + s() + "/>" +
      '<circle cx="129" cy="91" r="6" fill="' + AC + '"/>'),

    file: A(halo +
      '<rect x="86" y="16" width="28" height="48" rx="9" fill="' + WH + '"' + s() + "/>" +
      '<path d="M92 30h16M92 42h16"' + s(3.6) + "/>" +
      '<rect x="82" y="62" width="36" height="13" rx="6.5" fill="' + AC + '"/>' +
      '<path d="M100 75v72"' + s(4) + "/>" +
      '<path d="M95 86l10 6M95 98l10 6M95 110l10 6M95 122l10 6M95 134l10 6" fill="none"' + s(3.4) + "/>" +
      '<path d="M100 147v8"' + s(3.2) + "/>"),

    points: A(halo +
      '<rect x="50" y="110" width="100" height="42" rx="9" fill="' + WH + '"' + s() + "/>" +
      '<path d="M64 124h72" stroke="' + PA + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M76 110V84l7-17 7 17v26z" fill="' + SO + '"' + s() + "/>" +
      '<path d="M93 110V84l7-17 7 17v26z" fill="' + WH + '"' + s() + "/>" +
      '<path d="M110 110V84l7-17 7 17v26z" fill="' + SO + '"' + s() + "/>"),

    /* --- Ортопедия --- */
    wax: A(halo +
      '<path d="M60 92l18-20h80l-18 20z" fill="' + SO + '"' + s() + "/>" +
      '<path d="M140 92l18-20v48l-18 20z" fill="' + PA + '"' + s() + "/>" +
      '<rect x="60" y="92" width="80" height="48" rx="7" fill="' + WH + '"' + s() + "/>" +
      '<path d="M78 108h44"' + s(4) + "/>"),

    zircon: A(halo +
      '<rect x="68" y="64" width="64" height="80" rx="12" fill="' + WH + '"' + s() + "/>" +
      '<ellipse cx="100" cy="64" rx="32" ry="11" fill="' + SO + '"' + s() + "/>" +
      '<path d="M72 96h56M72 118h56" fill="none"' + s(3.4) + "/>" +
      '<circle cx="122" cy="80" r="4.5" fill="' + AC + '"/>'),

    bur: A(halo +
      '<path d="M100 24v66"' + s(6) + "/>" +
      '<path d="M100 90v10"' + s(4) + "/>" +
      '<rect x="87" y="100" width="26" height="46" rx="13" fill="' + WH + '"' + s() + "/>" +
      '<path d="M87 113l26 7M87 127l26 7" fill="none"' + s(3.4) + "/>" +
      '<circle cx="100" cy="88" r="4" fill="' + AC + '"/>'),

    burset: A(halo +
      '<rect x="48" y="58" width="104" height="84" rx="14" fill="' + WH + '"' + s() + "/>" +
      '<path d="M66 118h68" stroke="' + PA + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M74 74v14M91 74v14M108 74v14M125 74v14"' + s(4) + "/>" +
      '<rect x="70" y="88" width="8" height="24" rx="4" fill="' + SO + '"' + s(3) + "/>" +
      '<rect x="87" y="88" width="8" height="24" rx="4" fill="' + SO + '"' + s(3) + "/>" +
      '<rect x="104" y="88" width="8" height="24" rx="4" fill="' + SO + '"' + s(3) + "/>" +
      '<rect x="121" y="88" width="8" height="24" rx="4" fill="' + SO + '"' + s(3) + "/>"),

    /* --- Ортодонтия --- */
    bracket: A(halo +
      '<path d="M70 126h60l-9 16H79z" fill="' + GY + '"' + s() + "/>" +
      '<rect x="82" y="82" width="36" height="36" rx="8" transform="rotate(45 100 100)" fill="' + WH + '"' + s() + "/>" +
      '<rect x="60" y="92" width="20" height="17" rx="6" fill="' + WH + '"' + s(4) + "/>" +
      '<rect x="120" y="92" width="20" height="17" rx="6" fill="' + WH + '"' + s(4) + "/>" +
      '<path d="M60 100.5h80" stroke="' + AC + '" stroke-width="5.5"/>'),

    wire: A(halo +
      '<path d="M42 58c8 78 108 78 116 0" fill="none"' + s(10) + "/>" +
      '<path d="M42 58c8 78 108 78 116 0" fill="none" stroke="' + AC + '" stroke-width="3.4" opacity=".65"/>' +
      '<circle cx="42" cy="58" r="6" fill="' + AC + '"/>' +
      '<circle cx="158" cy="58" r="6" fill="' + AC + '"/>'),

    elastic: A(halo +
      '<circle cx="100" cy="52" r="7" fill="' + WH + '"' + s(4) + "/>" +
      '<rect x="54" y="62" width="92" height="76" rx="13" fill="' + WH + '"' + s() + "/>" +
      '<circle cx="79" cy="87" r="12" fill="' + SO + '"' + s(4.4) + "/>" +
      '<circle cx="121" cy="87" r="12" fill="' + SO + '"' + s(4.4) + "/>" +
      '<circle cx="79" cy="116" r="12" fill="' + SO + '"' + s(4.4) + "/>" +
      '<circle cx="121" cy="116" r="12" fill="' + SO + '"' + s(4.4) + "/>"),

    /* --- Инструменты --- */
    kit: A(halo +
      '<path d="M54 154 122 86"' + s(10) + "/>" +
      '<circle cx="134" cy="74" r="18" fill="' + SO + '"' + s() + "/>" +
      '<path d="M146 154 84 92" fill="none"' + s(6) + "/>" +
      '<path d="M84 92c-5-5-7-13-3-19" fill="none"' + s(4) + "/>" +
      '<circle cx="100" cy="100" r="6.5" fill="' + WH + '"' + s(4) + "/>"),

    matrix: A(halo +
      '<circle cx="100" cy="62" r="17" fill="none"' + s(5.5) + "/>" +
      '<path d="M100 79v14"' + s(4) + "/>" +
      '<rect x="50" y="93" width="100" height="32" rx="16" fill="' + WH + '"' + s() + "/>" +
      '<circle cx="76" cy="109" r="4" fill="' + PA + '" stroke="' + ST + '" stroke-width="3"/>' +
      '<circle cx="92" cy="109" r="4" fill="' + PA + '" stroke="' + ST + '" stroke-width="3"/>' +
      '<circle cx="108" cy="109" r="4" fill="' + PA + '" stroke="' + ST + '" stroke-width="3"/>' +
      '<circle cx="124" cy="109" r="4" fill="' + PA + '" stroke="' + ST + '" stroke-width="3"/>'),

    /* --- Анестезия --- */
    carpule: A(halo +
      '<rect x="58" y="82" width="80" height="36" rx="14" fill="' + SO + '" fill-opacity=".75"/>' +
      '<rect x="58" y="82" width="80" height="36" rx="14" fill="none"' + s() + "/>" +
      '<rect x="46" y="88" width="14" height="24" rx="5" fill="' + GY + '"' + s(4) + "/>" +
      '<circle cx="142" cy="100" r="9" fill="' + WH + '"' + s(4.5) + "/>" +
      '<path d="M84 82v36" fill="none"' + s(3.4) + "/>" +
      '<circle cx="100" cy="100" r="5" fill="' + AC + '"/>'),

    needle: A(halo +
      '<rect x="84" y="52" width="32" height="40" rx="10" fill="' + GY + '"' + s() + "/>" +
      '<path d="M100 92v68"' + s(3.6) + "/>" +
      '<path d="M100 160l6-9" fill="none"' + s(3.6) + "/>" +
      '<path d="M92 64h16"' + s(3.6) + "/>" +
      '<path d="M64 156h36l-7-14H71z" fill="' + WH + '"' + s(4) + "/>"),

    syringe: A(halo +
      '<rect x="90" y="18" width="20" height="30" rx="5" fill="' + WH + '"' + s() + "/>" +
      '<rect x="82" y="42" width="36" height="12" rx="6" fill="' + WH + '"' + s() + "/>" +
      '<rect x="84" y="52" width="32" height="70" rx="8" fill="' + WH + '"' + s() + "/>" +
      '<path d="M94 62v50M106 62v50" fill="none"' + s(2.6) + "/>" +
      '<path d="M94 122h12l-6 11z" fill="' + WH + '"' + s(4) + "/>" +
      '<path d="M100 133v30"' + s(3.4) + "/>" +
      '<circle cx="100" cy="90" r="4.5" fill="' + AC + '"/>'),

    /* --- Расходные --- */
    glove: A(halo +
      '<path d="M62 168v-54c0-8 6-14 14-14h2V66c0-7 5.5-12.5 12.5-12.5S103 59 103 66v22h2V54c0-7 5.5-12.5 12.5-12.5S130 47 130 54v34h2v-12c0-7 5.5-12.5 12.5-12.5S157 69 157 76v40c0 27-21 52-48 52h-13c-14 0-34-14-34-34z" fill="' + WH + '"' + s() + "/>" +
      '<path d="M76 150h74" fill="none"' + s(3.6) + "/>" +
      '<path d="M104 168v-13" stroke="' + AC + '" stroke-width="4.4"/>'),

    mask: A(halo +
      '<path d="M46 94c0-17 24-29 54-29s54 12 54 29c0 31-24 56-54 56s-54-25-54-56z" fill="' + WH + '"' + s() + "/>" +
      '<path d="M56 84c15-8 73-8 88 0" fill="none" stroke="' + AC + '" stroke-width="4.4"/>' +
      '<path d="M56 106h88M62 124h76" fill="none"' + s(3.4) + "/>" +
      '<path d="M46 90c-9 2-13 8-10 15M154 90c9 2 13 8 10 15" fill="none"' + s(4) + "/>"),

    bib: A(halo +
      '<path d="M70 56h60v82a24 24 0 0 1-24 24h-12a24 24 0 0 1-24-24z" fill="' + WH + '"' + s() + "/>" +
      '<path d="M84 56a16 16 0 0 1 32 0" fill="' + SO + '"' + s() + "/>" +
      '<path d="M70 60 52 48M130 60l18-12" fill="none"' + s(4) + "/>" +
      '<path d="M70 116h60" fill="none" stroke="' + PA + '" stroke-width="7"/>'),

    roll: A(halo +
      '<rect x="66" y="72" width="80" height="34" rx="17" fill="' + WH + '"' + s() + "/>" +
      '<rect x="52" y="96" width="88" height="38" rx="19" fill="' + WH + '"' + s() + "/>" +
      '<ellipse cx="140" cy="115" rx="12" ry="19" fill="' + SO + '"' + s() + "/>" +
      '<path d="M74 86h44" fill="none"' + s(3.2) + "/>"),

    cup: A(halo +
      '<path d="M68 60h64l-9 90a12 12 0 0 1-12 11H89a12 12 0 0 1-12-11z" fill="' + WH + '"' + s() + "/>" +
      '<ellipse cx="100" cy="60" rx="32" ry="8.5" fill="' + SO + '"' + s(4.5) + "/>" +
      '<path d="M74 92h52M78 116h44" fill="none"' + s(3.4) + "/>"),

    /* --- Дезинфекция и стерилизация --- */
    pouch: A(halo +
      '<rect x="46" y="60" width="108" height="80" rx="13" fill="' + WH + '"' + s() + "/>" +
      '<rect x="46" y="60" width="20" height="80" rx="11" fill="' + PA + '"' + s(3.6) + "/>" +
      '<circle cx="56" cy="76" r="2.6" fill="' + ST + '"/><circle cx="56" cy="92" r="2.6" fill="' + ST + '"/><circle cx="56" cy="108" r="2.6" fill="' + ST + '"/><circle cx="56" cy="124" r="2.6" fill="' + ST + '"/>' +
      '<circle cx="110" cy="88" r="9" fill="' + SO + '"' + s(4) + "/>" +
      '<path d="M102 134V108c0-6 4-10 8-12" fill="none"' + s(4) + "/>"),

    indicator: A(halo +
      '<rect x="62" y="56" width="76" height="88" rx="10" fill="' + WH + '"' + s() + "/>" +
      '<rect x="70" y="68" width="60" height="16" rx="5" fill="' + SO + '"/>' +
      '<rect x="70" y="92" width="60" height="16" rx="5" fill="#F2DFC4"/>' +
      '<path d="M70 124h60" stroke="' + PA + '" stroke-width="8" stroke-linecap="round"/>' +
      '<circle cx="118" cy="132" r="4" fill="' + AC + '"/>'),

    wipe: A(halo +
      '<rect x="52" y="84" width="94" height="56" rx="8" fill="' + WH + '"' + s() + "/>" +
      '<rect x="58" y="72" width="94" height="18" rx="8" fill="' + SO + '"' + s() + "/>" +
      '<path d="M58 72c20-13 76-13 94 0" fill="none"' + s(3.6) + "/>" +
      '<path d="M64 108h70" fill="none"' + s(3.2) + "/>"),

    canister: A(halo +
      '<rect x="88" y="36" width="24" height="15" rx="6" fill="' + WH + '"' + s() + "/>" +
      '<path d="M76 66v-8a6 6 0 0 1 6-6h36a6 6 0 0 1 6 6v8" fill="none"' + s(4) + "/>" +
      '<rect x="64" y="66" width="72" height="86" rx="13" fill="' + WH + '"' + s() + "/>" +
      '<rect x="76" y="88" width="48" height="42" rx="7" fill="' + PA + '"' + s(3.6) + "/>" +
      '<path d="M100 98c0 0 7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13z" fill="' + AC + '"/>'),

    /* --- Оборудование --- */
    handpiece: A(halo +
      '<g transform="rotate(-16 100 106)">' +
      '<rect x="34" y="96" width="16" height="18" rx="5" fill="' + GY + '"' + s(4) + "/>" +
      '<rect x="48" y="93" width="82" height="24" rx="12" fill="' + WH + '"' + s() + "/>" +
      '<circle cx="76" cy="105" r="3" fill="' + ST + '"/><circle cx="90" cy="105" r="3" fill="' + ST + '"/><circle cx="104" cy="105" r="3" fill="' + ST + '"/>' +
      '<circle cx="146" cy="100" r="17" fill="' + WH + '"' + s() + "/>" +
      '<circle cx="146" cy="100" r="7.5" fill="' + SO + '"/>' +
      '<path d="M150 83V62"' + s(5) + "/>" +
      "</g>"),

    lamp: A(halo +
      '<path d="M72 50v-9M100 60l7-8M44 60l-7-8M34 92h-9" fill="none" stroke="' + AC + '" stroke-width="4.6" stroke-linecap="round"/>' +
      '<circle cx="72" cy="92" r="27" fill="' + WH + '"' + s() + "/>" +
      '<circle cx="72" cy="92" r="13" fill="' + SO + '"' + s(4) + "/>" +
      '<rect x="96" y="80" width="58" height="24" rx="12" fill="' + WH + '"' + s() + "/>" +
      '<path d="M104 104l-9 42a11 11 0 0 0 11 13h12" fill="' + WH + '"' + s() + "/>" +
      '<circle cx="112" cy="92" r="4" fill="' + AC + '"/>'),

    autoclave: A(halo +
      '<rect x="54" y="52" width="92" height="96" rx="16" fill="' + WH + '"' + s() + "/>" +
      '<circle cx="98" cy="98" r="26" fill="' + PA + '"' + s() + "/>" +
      '<path d="M98 84v28"' + s(6) + "/>" +
      '<circle cx="130" cy="66" r="6.5" fill="' + SO + '"' + s(3.4) + "/>" +
      '<path d="M66 132h12M86 132h12M106 132h12" fill="none"' + s(4) + "/>"),

    /* --- Универсальная коробка (fallback) --- */
    box: A(halo +
      '<path d="M56 118l44-20 44 20v38l-44 20-44-20z" fill="' + WH + '"' + s() + "/>" +
      '<path d="M56 118l44 20 44-20M100 138v38" fill="none"' + s() + "/>" +
      '<path d="M56 118V80l44-20 44 20v38" fill="' + SO + '" fill-opacity=".55"' + s() + "/>" +
      '<path d="M100 60v58" fill="none" stroke="' + AC + '" stroke-width="4.6"/>')
  };

  MMS.ART = ART;
  MMS.art = function (key) { return ART[key] || ART.box; };

  /* ---------- Иконки категорий (24×24) ---------- */
  const CAT = {
    terapiya: 'M12 3c-2.4 0-3.4 1.5-5.8 1.5-1.9 0-3 1.6-2.2 4.2.6 1.8.8 4 1.7 6.4.6 1.8 2.3 1.6 2.7-.4.2-1.1.3-2.7 1.3-2.7s1.1 1.6 1.3 2.7c.4 2 2.1 2.2 2.7.4.9-2.4 1.1-4.6 1.7-6.4.8-2.6-.3-4.2-2.2-4.2C15.4 4.5 14.4 3 12 3z',
    endo: 'M12 2.5c-2.4 0-3.4 1.5-5.8 1.5-1.9 0-3 1.6-2.2 4.2.6 1.8.8 4 1.7 6.4.6 1.8 2.3 1.6 2.7-.4.2-1.1.3-2.7 1.3-2.7s1.1 1.6 1.3 2.7c.4 2 2.1 2.2 2.7.4.9-2.4 1.1-4.6 1.7-6.4.8-2.6-.3-4.2-2.2-4.2C15.4 4 14.4 2.5 12 2.5z|M12 7.5v9.5',
    ortopediya: 'M4 8.5l4.2 3L12 6l3.8 5.5L20 8.5 18 19H6z',
    ortodontiya: 'M4 12h16|M8 9.8a2.4 2.4 0 1 0 .01 4.4A2.4 2.4 0 0 0 8 9.8z|M16 9.8a2.4 2.4 0 1 0 .01 4.4A2.4 2.4 0 0 0 16 9.8z|M8 12h8',
    instrumenty: 'M5 19 17 7|M14 4l6 6|M19 19 7 5|M4 10l6-6',
    bory: 'M12 3v7|M9.8 10h4.4a2.4 2.4 0 0 1 2.4 2.4v6.2a2.4 2.4 0 0 1-2.4 2.4h-4.4a2.4 2.4 0 0 1-2.4-2.4v-6.2A2.4 2.4 0 0 1 9.8 10z|M9.6 14h4.8',
    anesteziya: 'M18 4 9 13|M14.5 2.5 21 9|M12 8l3.5 3.5|M10.5 11 6 15.5V19h3.5L14 14.5',
    rashodniki: 'M3 8l9-5 9 5v8l-9 5-9-5z|M3 8l9 5 9-5|M12 13v8',
    dezinfekciya: 'M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.4l-1.9-5.6L4.5 10.9 10.1 9z|M19 3v3M17.5 4.5h3',
    oborudovanie: 'M4 8h16v11H4z|M8 8V5h8v3|M8 19v2M16 19v2|M8 12h8'
  };
  MMS.caticon = function (name, size) {
    const raw = CAT[name] || CAT.rashodniki;
    const paths = raw.split("|").map((d) => '<path d="' + d + '"/>').join("");
    return '<svg width="' + (size || 24) + '" height="' + (size || 24) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
  };
})();
