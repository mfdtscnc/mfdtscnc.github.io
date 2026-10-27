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
 *
 * Chemie:
 *   Energiestufenmodell: <figure data-grafik="energiestufen" data-elektronen="2,8,1" data-symbol="Na">
 *     data-elektronen="0,0,0" zeichnet leere Stufen (zum Selbsteinzeichnen).
 *     data-valenz hebt die Valenzelektronen farbig hervor.
 *   Anregung (Grundzustand ↔ angeregter Zustand): <figure data-grafik="anregung">
 *   Spektrum: <figure data-grafik="spektrum" data-linien="589,589.6"> (Wellenlängen in nm)
 *     oder data-linien="kontinuierlich" für den Regenbogen.
 *   Diagramm: <figure data-grafik="diagramm" data-werte="H:13.6,He:24.6" data-art="saeulen|linie"
 *     data-einheit="eV" data-markiert="He,Ne" data-xtitel="Element">
 *   Gekürztes PSE: <figure data-grafik="pse" data-perioden="4" data-markiert="Na,Cl">
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

    energiestufen(_, fig) {
      const zahlen = (fig.dataset.elektronen || "").split(",").map(Number);
      const symbol = fig.dataset.symbol || "";
      const valenz = fig.hasAttribute("data-valenz");
      const abstand = [0, 74, 58, 48, 42]; // Stufen rücken nach oben zusammen
      const hoehe = 40 + abstand.slice(1, zahlen.length).reduce((a, b) => a + b, 0) + (symbol ? 58 : 36);
      const titel = zahlen.some((z) => z > 0)
        ? "Energiestufenmodell" + (symbol ? " von " + symbol : "") + ": " + zahlen.map((z, i) => "n=" + (i + 1) + ": " + z).join(", ")
        : "Leeres Energiestufenmodell mit " + zahlen.length + " Stufen";
      const e = svg(320, hoehe, titel);
      const unten = hoehe - (symbol ? 50 : 28);
      s("line", { x1: 26, y1: unten + 14, x2: 26, y2: 14, stroke: "var(--tinte)", "stroke-width": 2 }, e);
      s("path", { d: "M20 20 L26 6 L32 20 Z", fill: "var(--tinte)" }, e);
      const et = s("text", { x: 38, y: 18, "font-family": "var(--sans)", "font-size": 15, "font-weight": 700, fill: "var(--tinte)" }, e);
      et.textContent = "E";
      let y = unten;
      zahlen.forEach((anzahl, i) => {
        if (i > 0) y -= abstand[i];
        s("line", { x1: 54, y1: y, x2: 248, y2: y, stroke: "var(--tinte)", "stroke-width": 2 }, e);
        const lt = s("text", { x: 256, y: y + 5, "font-family": "var(--sans)", "font-size": 14, fill: "var(--tinte-2)" }, e);
        lt.textContent = "n = " + (i + 1);
        const breite = 21;
        const start = 151 - ((anzahl - 1) * breite) / 2;
        const aussen = valenz && i === zahlen.length - 1;
        for (let k = 0; k < anzahl; k++) {
          const cx = start + k * breite;
          s("circle", { cx, cy: y - 11, r: 9, fill: aussen ? "var(--elektron-hell)" : "var(--papier)",
            stroke: aussen ? "var(--elektron)" : "var(--tinte)", "stroke-width": 1.6 }, e);
          s("line", { x1: cx - 4.5, y1: y - 11, x2: cx + 4.5, y2: y - 11, stroke: aussen ? "var(--elektron)" : "var(--tinte)", "stroke-width": 1.8 }, e);
        }
      });
      if (symbol) {
        const st = s("text", { x: 151, y: hoehe - 14, "text-anchor": "middle", "font-family": "var(--sans)", "font-size": 17, "font-weight": 700, fill: "var(--tinte)" }, e);
        st.textContent = symbol;
      }
      return e;
    },

    anregung() {
      const e = svg(440, 230, "Ein Elektron nimmt Energie auf (z. B. Wärme) und springt in den angeregten Zustand. Beim Zurückfallen in den Grundzustand gibt es die Energie als Licht ab.");
      s("line", { x1: 26, y1: 214, x2: 26, y2: 16, stroke: "var(--tinte)", "stroke-width": 2 }, e);
      s("path", { d: "M20 22 L26 8 L32 22 Z", fill: "var(--tinte)" }, e);
      const et = s("text", { x: 38, y: 20, "font-family": "var(--sans)", "font-size": 15, "font-weight": 700, fill: "var(--tinte)" }, e);
      et.textContent = "E";
      [[52, "angeregter Zustand"], [186, "Grundzustand"]].forEach(([y, text]) => {
        s("line", { x1: 50, y1: y, x2: 290, y2: y, stroke: "var(--tinte-2)", "stroke-width": 1.8, "stroke-dasharray": "7 6" }, e);
        const t = s("text", { x: 298, y: y + 5, "font-family": "var(--sans)", "font-size": 14, fill: "var(--tinte)" }, e);
        t.textContent = text;
      });
      [[170, 41], [170, 175]].forEach(([cx, cy]) => {
        s("circle", { cx, cy, r: 9, fill: "var(--papier)", stroke: "var(--tinte)", "stroke-width": 1.6 }, e);
        s("line", { x1: cx - 4.5, y1: cy, x2: cx + 4.5, y2: cy, stroke: "var(--tinte)", "stroke-width": 1.8 }, e);
      });
      s("path", { d: "M156 170 C120 140 120 80 156 50", fill: "none", stroke: "var(--waerme)", "stroke-width": 2.5 }, e);
      s("path", { d: "M148 56 L158 47 L160 61 Z", fill: "var(--waerme)" }, e);
      s("path", { d: "M184 48 C220 78 220 138 184 168", fill: "none", stroke: "var(--elektron)", "stroke-width": 2.5 }, e);
      s("path", { d: "M182 158 L183 172 L194 164 Z", fill: "var(--elektron)" }, e);
      [["Energie-", 108, 104], ["aufnahme", 108, 121], ["(z. B. Wärme)", 108, 138]].forEach(([t, x, y]) => {
        const te = s("text", { x, y, "text-anchor": "end", "font-family": "var(--sans)", "font-size": 13, fill: "var(--waerme)" }, e);
        te.textContent = t;
      });
      [["Energie-", 226, 104], ["abgabe", 226, 121], ["als Licht", 226, 138]].forEach(([t, x, y]) => {
        const te = s("text", { x, y, "font-family": "var(--sans)", "font-size": 13, fill: "var(--elektron)" }, e);
        te.textContent = t;
      });
      return e;
    },

    spektrum(_, fig) {
      const art = fig.dataset.linien || "";
      const kont = art === "kontinuierlich";
      const linien = kont ? [] : art.split(",").map(Number).filter(Boolean);
      const e = svg(420, 74, kont ? "Kontinuierliches Spektrum: lückenloser Regenbogen von Violett bis Rot"
        : "Linienspektrum mit " + linien.length + " Linien bei " + linien.join(", ") + " nm");
      const x = (nm) => 10 + ((nm - 380) / (750 - 380)) * 400;
      s("rect", { x: 10, y: 4, width: 400, height: 46, rx: 3, fill: "#111" }, e);
      if (kont) {
        const id = "regenbogen-" + Math.random().toString(36).slice(2, 8);
        const defs = s("defs", {}, e);
        const g = s("linearGradient", { id, x1: 0, x2: 1, y1: 0, y2: 0 }, defs);
        for (let nm = 380; nm <= 750; nm += 10) s("stop", { offset: (nm - 380) / 370, "stop-color": farbe(nm) }, g);
        s("rect", { x: 10, y: 4, width: 400, height: 46, rx: 3, fill: "url(#" + id + ")" }, e);
      }
      linien.forEach((nm) => s("rect", { x: x(nm) - 1.5, y: 4, width: 3, height: 46, fill: farbe(nm) }, e));
      [400, 500, 600, 700].forEach((nm) => {
        s("line", { x1: x(nm), y1: 50, x2: x(nm), y2: 55, stroke: "var(--tinte-2)", "stroke-width": 1 }, e);
        const t = s("text", { x: x(nm), y: 68, "text-anchor": "middle", "font-family": "var(--sans)", "font-size": 11, fill: "var(--tinte-2)" }, e);
        t.textContent = nm + " nm";
      });
      return e;
    },

    pse(_, fig) {
      const perioden = Number(fig.dataset.perioden) || 4;
      const markiert = (fig.dataset.markiert || "").split(",").map((t) => t.trim());
      const e = svg(40 + 8 * 54, 30 + perioden * 48, "Gekürztes Periodensystem, Hauptgruppen I bis VIII, Perioden 1 bis " + perioden);
      ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].forEach((g, i) => {
        const t = s("text", { x: 40 + i * 54 + 26, y: 18, "text-anchor": "middle", "font-family": "var(--sans)", "font-size": 12, "font-weight": 700, fill: "var(--tinte-2)" }, e);
        t.textContent = g;
      });
      PSE.slice(0, perioden).forEach((zeile, p) => {
        const t = s("text", { x: 16, y: 30 + p * 48 + 29, "text-anchor": "middle", "font-family": "var(--sans)", "font-size": 12, "font-weight": 700, fill: "var(--tinte-2)" }, e);
        t.textContent = String(p + 1);
        zeile.forEach((zelle, g) => {
          if (!zelle) return;
          const [symbol, oz] = zelle;
          const x = 40 + g * 54, y = 30 + p * 48;
          const hervor = markiert.includes(symbol);
          s("rect", { x: x + 1, y: y + 1, width: 52, height: 44, rx: 4, fill: hervor ? "var(--elektron-hell)" : "var(--papier-2)",
            stroke: hervor ? "var(--elektron)" : "var(--linie)", "stroke-width": hervor ? 2 : 1 }, e);
          const n = s("text", { x: x + 6, y: y + 14, "font-family": "var(--sans)", "font-size": 10, fill: "var(--tinte-2)" }, e);
          n.textContent = String(oz);
          const st = s("text", { x: x + 27, y: y + 36, "text-anchor": "middle", "font-family": "var(--sans)", "font-size": 17, "font-weight": 700, fill: "var(--tinte)" }, e);
          st.textContent = symbol;
        });
      });
      return e;
    },

    diagramm(_, fig) {
      const paare = (fig.dataset.werte || "").split(",").map((p) => p.split(":")).map(([n, w]) => [n.trim(), Number(w)]);
      const linie = fig.dataset.art === "linie";
      const markiert = (fig.dataset.markiert || "").split(",").map((t) => t.trim());
      const einheit = fig.dataset.einheit || "";
      const max = Math.max(...paare.map(([, w]) => w));
      const schritt = max > 40 ? 10 : 5;
      const oben = Math.ceil(max / schritt) * schritt;
      const B = 540, H = 270, L = 44, R = 10, T = 16, U = 40;
      const e = svg(B, H, (linie ? "Liniendiagramm" : "Säulendiagramm") + ": " + paare.map(([n, w]) => n + " " + w + " " + einheit).join(", "));
      const y = (w) => T + (H - T - U) * (1 - w / oben);
      for (let w = 0; w <= oben; w += schritt) {
        s("line", { x1: L, y1: y(w), x2: B - R, y2: y(w), stroke: "var(--linie)", "stroke-width": 1 }, e);
        const t = s("text", { x: L - 6, y: y(w) + 4, "text-anchor": "end", "font-family": "var(--sans)", "font-size": 11, fill: "var(--tinte-2)" }, e);
        t.textContent = w;
      }
      const yt = s("text", { x: 4, y: T - 4, "font-family": "var(--sans)", "font-size": 11, "font-weight": 700, fill: "var(--tinte-2)" }, e);
      yt.textContent = einheit;
      const feld = (B - L - R) / paare.length;
      const punkte = [];
      paare.forEach(([name, w], i) => {
        const cx = L + feld * (i + 0.5);
        const hervor = markiert.includes(name);
        if (linie) {
          punkte.push(cx + "," + y(w));
        } else {
          s("rect", { x: cx - feld * 0.32, y: y(w), width: feld * 0.64, height: y(0) - y(w),
            fill: hervor ? "var(--akzent)" : "var(--tinte-2)", "fill-opacity": hervor ? 0.95 : 0.55 }, e);
        }
        const t = s("text", { x: cx, y: H - U + 16, "text-anchor": "middle", "font-family": "var(--sans)", "font-size": 11.5,
          "font-weight": hervor ? 700 : 400, fill: hervor ? "var(--akzent)" : "var(--tinte)" }, e);
        t.textContent = name;
      });
      if (linie) {
        s("polyline", { points: punkte.join(" "), fill: "none", stroke: "var(--tinte-2)", "stroke-width": 1.8 }, e);
        punkte.forEach((p, i) => {
          const [cx, cy] = p.split(",").map(Number);
          const hervor = markiert.includes(paare[i][0]);
          s("circle", { cx, cy, r: 4, fill: hervor ? "var(--akzent)" : "var(--tinte)" }, e);
        });
      }
      if (fig.dataset.xtitel) {
        const xt = s("text", { x: B - R, y: H - 4, "text-anchor": "end", "font-family": "var(--sans)", "font-size": 11, fill: "var(--tinte-2)" }, e);
        xt.textContent = fig.dataset.xtitel;
      }
      return e;
    },
  };

  // Gekürztes Periodensystem: [Symbol, Ordnungszahl] je Hauptgruppe I–VIII
  const PSE = [
    [["H", 1], null, null, null, null, null, null, ["He", 2]],
    [["Li", 3], ["Be", 4], ["B", 5], ["C", 6], ["N", 7], ["O", 8], ["F", 9], ["Ne", 10]],
    [["Na", 11], ["Mg", 12], ["Al", 13], ["Si", 14], ["P", 15], ["S", 16], ["Cl", 17], ["Ar", 18]],
    [["K", 19], ["Ca", 20], ["Ga", 31], ["Ge", 32], ["As", 33], ["Se", 34], ["Br", 35], ["Kr", 36]],
    [["Rb", 37], ["Sr", 38], ["In", 49], ["Sn", 50], ["Sb", 51], ["Te", 52], ["I", 53], ["Xe", 54]],
    [["Cs", 55], ["Ba", 56], ["Tl", 81], ["Pb", 82], ["Bi", 83], ["Po", 84], ["At", 85], ["Rn", 86]],
  ];

  // Ungefähre Lichtfarbe zu einer Wellenlänge (380–750 nm)
  function farbe(nm) {
    let r = 0, g = 0, b = 0;
    if (nm < 440) { r = (440 - nm) / 60; b = 1; }
    else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = (645 - nm) / 65; }
    else { r = 1; }
    const hell = nm < 420 ? 0.3 + (0.7 * (nm - 380)) / 40 : nm > 700 ? 0.3 + (0.7 * (750 - nm)) / 50 : 1;
    const k = (c) => Math.round(255 * Math.pow(c * hell, 0.8));
    return "rgb(" + k(r) + "," + k(g) + "," + k(b) + ")";
  }

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
