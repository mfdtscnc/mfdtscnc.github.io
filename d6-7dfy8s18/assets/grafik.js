/*
 * Abbildungen als SVG, passend zu hell/dunkel (Farben aus kurs.css). Einbinden:
 *   <script src="../assets/grafik.js" defer></script>
 *
 *   <figure class="grafik" data-grafik="pflanze"></figure>
 *   <figure class="grafik" data-grafik="pflanzenzelle" data-modus="nummern"></figure>
 *
 * data-grafik: pflanze | bluete | pflanzenzelle | glocke
 * data-modus="nummern": statt der Namen stehen Nummern da (zum Abfragen).
 *   Die Reihenfolge der Nummern steht bei jeder Grafik unten in BESCHRIFTUNG.
 *
 * Glocke (Priestley): <figure data-grafik="glocke" data-inhalt="maus kerze pflanze" data-licht="aus">
 *   Gezeigt wird immer der Anfang des Versuchs (Kerze brennt), nie das Ergebnis.
 */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";

  // Beschriftungen: [Text, Text-x, Text-y, Ziel-x, Ziel-y, Anker]
  const BESCHRIFTUNG = {
    pflanze: [
      ["Blüte", 300, 52, 178, 52, "start"],
      ["Laubblatt", 300, 108, 193, 106, "start"],
      ["Sprossachse", 300, 170, 156, 170, "start"],
      ["Wurzel", 300, 268, 178, 262, "start"],
    ],
    bluete: [
      ["Kronblatt", 98, 60, 140, 92, "end"],
      ["Staubblatt (♂)", 98, 150, 168, 128, "end"],
      ["Fruchtblatt (♀)", 302, 150, 208, 178, "start"],
    ],
    pflanzenzelle: [
      ["Zellkern", 108, 76, 148, 86, "end"],
      ["Mitochondrium", 108, 146, 142, 150, "end"],
      ["Zellplasma", 108, 212, 146, 186, "end"],
      ["Chloroplast", 372, 66, 336, 80, "start"],
      ["Vakuole", 372, 122, 296, 132, "start"],
      ["Zellmembran", 372, 172, 342, 172, "start"],
      ["Zellwand", 372, 226, 351, 226, "start"],
    ],
  };

  function s(tag, attrs, eltern) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (eltern) eltern.appendChild(e);
    return e;
  }

  function svg(breite, hoehe, titel) {
    const e = s("svg", { viewBox: "0 0 " + breite + " " + hoehe, role: "img", "aria-label": titel });
    s("title", {}, e).textContent = titel;
    return e;
  }

  function beschriften(e, art, nummern) {
    BESCHRIFTUNG[art].forEach(([text, tx, ty, zx, zy, anker], i) => {
      const linieEnde = anker === "end" ? tx + 4 : tx - 4;
      s("line", { x1: linieEnde, y1: ty - 5, x2: zx, y2: zy, stroke: "var(--tinte-2)", "stroke-width": 1.2 }, e);
      s("circle", { cx: zx, cy: zy, r: 2.5, fill: "var(--tinte)" }, e);
      if (nummern) {
        const cx = anker === "end" ? tx - 11 : tx + 11;
        s("circle", { cx, cy: ty - 5, r: 11, fill: "var(--papier)", stroke: "var(--akzent)", "stroke-width": 2 }, e);
        const t = s("text", { x: cx, y: ty, "text-anchor": "middle", "font-family": "var(--sans)", "font-size": 14, "font-weight": 700, fill: "var(--akzent)" }, e);
        t.textContent = String(i + 1);
      } else {
        const t = s("text", { x: tx, y: ty, "text-anchor": anker, "font-family": "var(--sans)", "font-size": 15, fill: "var(--tinte)" }, e);
        t.textContent = text;
      }
    });
  }

  function blatt(e, x, y, laenge, winkel) {
    const g = s("g", { transform: "translate(" + x + " " + y + ") rotate(" + winkel + ")" }, e);
    s("path", { d: "M0 0 Q" + laenge / 2 + " -" + laenge / 3.2 + " " + laenge + " 0 Q" + laenge / 2 + " " + laenge / 3.2 + " 0 0Z",
      fill: "var(--pflanze-hell)", stroke: "var(--pflanze)", "stroke-width": 2 }, g);
    s("line", { x1: 0, y1: 0, x2: laenge * 0.9, y2: 0, stroke: "var(--pflanze)", "stroke-width": 1.2 }, g);
  }

  const ZEICHNE = {
    pflanze(nummern) {
      const e = svg(400, 320, "Bau einer Samenpflanze: Blüte, Laubblatt, Sprossachse, Wurzel");
      s("rect", { x: 20, y: 210, width: 270, height: 100, fill: "var(--erde)", opacity: 0.18 }, e);
      s("line", { x1: 20, y1: 210, x2: 290, y2: 210, stroke: "var(--erde)", "stroke-width": 2 }, e);
      // Wurzel
      [["M150 210 C150 240 148 270 152 300"], ["M150 222 C135 235 115 245 98 262"], ["M151 230 C170 245 185 252 205 268"],
       ["M149 255 C135 268 128 280 120 296"], ["M152 262 C165 272 172 285 180 298"]].forEach(([d]) =>
        s("path", { d, fill: "none", stroke: "var(--erde)", "stroke-width": 3, "stroke-linecap": "round" }, e));
      // Sprossachse
      s("path", { d: "M150 210 C148 160 152 110 150 66", fill: "none", stroke: "var(--pflanze)", "stroke-width": 6, "stroke-linecap": "round" }, e);
      blatt(e, 150, 175, 70, 200);
      blatt(e, 151, 120, 72, -20);
      blatt(e, 150, 145, 58, 160);
      // Blüte
      for (let i = 0; i < 6; i++) {
        s("ellipse", { cx: 150, cy: 34, rx: 9, ry: 20, fill: "var(--bluete)", stroke: "var(--tinte-2)", "stroke-width": 1,
          transform: "rotate(" + i * 60 + " 150 52)" }, e);
      }
      s("circle", { cx: 150, cy: 52, r: 9, fill: "var(--mitte)", stroke: "var(--tinte-2)", "stroke-width": 1 }, e);
      beschriften(e, "pflanze", nummern);
      return e;
    },

    bluete(nummern) {
      const e = svg(400, 250, "Blüte im Längsschnitt: Kronblatt, Staubblatt (männlich), Fruchtblatt (weiblich)");
      s("line", { x1: 200, y1: 205, x2: 200, y2: 245, stroke: "var(--pflanze)", "stroke-width": 6 }, e);
      s("path", { d: "M165 205 Q200 222 235 205 Z", fill: "var(--pflanze)" }, e);
      // Kronblätter
      s("path", { d: "M170 202 C120 190 100 120 128 70 C150 110 168 160 182 200 Z", fill: "var(--bluete)", stroke: "var(--tinte-2)", "stroke-width": 1, opacity: 0.85 }, e);
      s("path", { d: "M230 202 C280 190 300 120 272 70 C250 110 232 160 218 200 Z", fill: "var(--bluete)", stroke: "var(--tinte-2)", "stroke-width": 1, opacity: 0.85 }, e);
      // Staubblätter
      [[186, 168, 118], [214, 232, 118]].forEach(([fx, ax, ay]) => {
        s("path", { d: "M" + fx + " 200 Q" + (fx + ax) / 2 + " 160 " + ax + " " + (ay + 8), fill: "none", stroke: "var(--mitte)", "stroke-width": 2.5 }, e);
        s("ellipse", { cx: ax, cy: ay, rx: 6, ry: 10, fill: "var(--mitte)", stroke: "var(--tinte-2)", "stroke-width": 1 }, e);
      });
      // Fruchtblatt: Fruchtknoten, Griffel, Narbe
      s("ellipse", { cx: 200, cy: 180, rx: 16, ry: 22, fill: "var(--pflanze-hell)", stroke: "var(--pflanze)", "stroke-width": 2 }, e);
      s("line", { x1: 200, y1: 158, x2: 200, y2: 100, stroke: "var(--pflanze)", "stroke-width": 4 }, e);
      s("ellipse", { cx: 200, cy: 96, rx: 9, ry: 5, fill: "var(--pflanze)" }, e);
      beschriften(e, "bluete", nummern);
      return e;
    },

    pflanzenzelle(nummern) {
      const e = svg(480, 270, "Pflanzenzelle mit Zellwand, Zellmembran, Zellplasma, Zellkern, Vakuole, Chloroplasten und Mitochondrien");
      s("rect", { x: 120, y: 40, width: 230, height: 196, rx: 10, fill: "var(--plasma)", stroke: "var(--pflanze)", "stroke-width": 8, "stroke-opacity": 0.55 }, e);
      s("rect", { x: 128, y: 48, width: 214, height: 180, rx: 6, fill: "none", stroke: "var(--tinte-2)", "stroke-width": 1.5 }, e);
      s("path", { d: "M190 100 C210 80 290 82 305 108 C318 132 300 178 262 182 C225 186 186 176 182 146 C179 125 180 110 190 100 Z",
        fill: "var(--vakuole)", stroke: "var(--tinte-2)", "stroke-width": 1.2 }, e);
      s("circle", { cx: 160, cy: 88, r: 20, fill: "var(--kern)", "fill-opacity": 0.35, stroke: "var(--kern)", "stroke-width": 2 }, e);
      s("circle", { cx: 165, cy: 93, r: 6, fill: "var(--kern)" }, e);
      [[320, 80, 20], [318, 205, -25], [172, 210, 10], [252, 64, 0], [222, 206, -10], [300, 165, 70]].forEach(([x, y, w]) => {
        const g = s("g", { transform: "translate(" + x + " " + y + ") rotate(" + w + ")" }, e);
        s("ellipse", { cx: 0, cy: 0, rx: 15, ry: 8, fill: "var(--pflanze)", "fill-opacity": 0.75, stroke: "var(--pflanze)", "stroke-width": 1.5 }, g);
        [-7, 0, 7].forEach((dx) => s("line", { x1: dx, y1: -4, x2: dx, y2: 4, stroke: "var(--papier)", "stroke-width": 1.2 }, g));
      });
      [[155, 150, 0], [282, 212, 15]].forEach(([x, y, w]) => {
        const g = s("g", { transform: "translate(" + x + " " + y + ") rotate(" + w + ")" }, e);
        s("ellipse", { cx: 0, cy: 0, rx: 13, ry: 7, fill: "var(--mito)", "fill-opacity": 0.35, stroke: "var(--mito)", "stroke-width": 1.8 }, g);
        s("path", { d: "M-9 0 L-6 -4 L-3 3 L0 -4 L3 3 L6 -4 L9 0", fill: "none", stroke: "var(--mito)", "stroke-width": 1.2 }, g);
      });
      beschriften(e, "pflanzenzelle", nummern);
      return e;
    },

    glocke(_, fig) {
      const inhalt = (fig.dataset.inhalt || "").split(/\s+/).filter(Boolean);
      const licht = fig.dataset.licht !== "aus";
      const e = svg(120, 145, "Glasglocke mit " + (inhalt.join(", ") || "nichts") + (licht ? ", im Licht" : ", im Dunkeln"));
      if (!licht) {
        s("rect", { x: 0, y: 0, width: 120, height: 145, rx: 8, fill: "var(--tinte)", opacity: 0.22 }, e);
        s("path", { d: "M14 8 A9 9 0 1 0 24 22 A7 7 0 1 1 14 8 Z", fill: "var(--tinte-2)" }, e);
      } else {
        s("circle", { cx: 14, cy: 14, r: 7, fill: "var(--mitte)" }, e);
        for (let i = 0; i < 8; i++) {
          const w = (i * Math.PI) / 4;
          s("line", { x1: 14 + Math.cos(w) * 10, y1: 14 + Math.sin(w) * 10, x2: 14 + Math.cos(w) * 14, y2: 14 + Math.sin(w) * 14,
            stroke: "var(--mitte)", "stroke-width": 2, "stroke-linecap": "round" }, e);
        }
      }
      const xs = { 1: [60], 2: [44, 78], 3: [34, 58, 82] }[inhalt.length] || [];
      inhalt.forEach((art, i) => {
        const x = xs[i];
        if (art === "maus") {
          s("path", { d: "M" + (x - 11) + " 124 C" + (x - 18) + " 122 " + (x - 20) + " 116 " + (x - 16) + " 112", fill: "none", stroke: "var(--tinte-2)", "stroke-width": 1.5 }, e);
          s("ellipse", { cx: x, cy: 124, rx: 11, ry: 6.5, fill: "var(--tinte-2)" }, e);
          s("circle", { cx: x + 10, cy: 120, r: 5, fill: "var(--tinte-2)" }, e);
          s("circle", { cx: x + 8, cy: 115, r: 2.8, fill: "var(--tinte-2)" }, e);
        } else if (art === "kerze") {
          s("rect", { x: x - 4, y: 106, width: 8, height: 24, fill: "var(--papier-2)", stroke: "var(--tinte-2)", "stroke-width": 1.2 }, e);
          s("line", { x1: x, y1: 106, x2: x, y2: 102, stroke: "var(--tinte)", "stroke-width": 1 }, e);
          s("path", { d: "M" + x + " 88 C" + (x + 5) + " 95 " + (x + 4) + " 102 " + x + " 102 C" + (x - 4) + " 102 " + (x - 5) + " 95 " + x + " 88 Z", fill: "#f29a2e" }, e);
        } else if (art === "pflanze") {
          s("path", { d: "M" + (x - 9) + " 116 H" + (x + 9) + " L" + (x + 7) + " 130 H" + (x - 7) + " Z", fill: "var(--erde)" }, e);
          s("line", { x1: x, y1: 116, x2: x, y2: 66, stroke: "var(--pflanze)", "stroke-width": 2.5 }, e);
          blatt(e, x, 102, 18, -30);
          blatt(e, x, 90, 18, 210);
          blatt(e, x, 76, 15, -40);
          blatt(e, x, 68, 13, 220);
        }
      });
      // Glocke und Platte
      s("path", { d: "M18 131 V62 Q18 30 60 30 Q102 30 102 62 V131", fill: "var(--glas)", "fill-opacity": 0.12, stroke: "var(--glas)", "stroke-width": 2.5 }, e);
      s("circle", { cx: 60, cy: 25, r: 5, fill: "var(--glas)" }, e);
      s("rect", { x: 8, y: 131, width: 104, height: 6, rx: 2, fill: "var(--tinte-2)" }, e);
      return e;
    },
  };

  function start() {
    document.querySelectorAll("[data-grafik]").forEach((fig) => {
      const art = fig.dataset.grafik;
      if (!ZEICHNE[art]) return;
      fig.prepend(ZEICHNE[art](fig.dataset.modus === "nummern", fig));
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
