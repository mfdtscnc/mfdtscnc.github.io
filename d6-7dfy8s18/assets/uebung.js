/*
 * Übungs-Komponenten für alle Lektionen. Einbinden:
 *   <link rel="stylesheet" href="../assets/kurs.css">
 *   <script src="../assets/uebung.js" defer></script>
 *
 * Jede Aufgabe ist ein Element mit class="aufgabe" und einem Typ. Gewertet wird
 * immer der ERSTE Versuch (Abrufübung), danach darf verbessert werden.
 *
 * 1) Ankreuzen:
 *   <div class="aufgabe mc" data-id="W1">
 *     <p class="frage">…</p>
 *     <div class="optionen">
 *       <button data-richtig>…</button><button>…</button>
 *     </div>
 *     <p class="erklaerung">Wird nach der richtigen Antwort gezeigt.</p>
 *   </div>
 *   Die Optionen werden gemischt (außer bei data-fest).
 *
 * 2) Wörter markieren: Die gesuchten Wörter stehen im <mark>.
 *   <div class="aufgabe markieren" data-id="A1">
 *     <p class="frage">Markiere den Nebensatz.</p>
 *     <p class="satz">Wir gingen heim, <mark>weil es regnete</mark>.</p>
 *   </div>
 *
 * 3) Kommas setzen: Ein | direkt nach einem Wort bedeutet „hier gehört ein Komma hin“.
 *   <div class="aufgabe komma" data-id="B1">
 *     <p class="frage">Setze die Kommas.</p>
 *     <p class="satz">Ich weiß| dass du recht hast.</p>
 *   </div>
 *
 * 4) Selbst eintragen: data-loesung enthält die erlaubten Antworten, getrennt durch |.
 *    Groß-/Kleinschreibung zählt, Pünktchen (… oder ...) und Leerzeichen nicht.
 *   <div class="aufgabe eingabe" data-id="T1" data-loesung="hat … angemeldet">
 *     <p class="frage">Perfekt</p>
 *     <p class="satz">Waterman (anmelden) den Füller.</p>
 *     <p class="erklaerung">…</p>
 *   </div>
 *   Nach zwei falschen Versuchen erscheint „Lösung zeigen“.
 *   Optional data-muster: regulärer Ausdruck (ohne Groß/klein), der auch ganze
 *   Antwortsätze gelten lässt, z. B. data-muster="^\D*82([,.]0+)?\s*(kg)?\D*$"
 *   für „Um 82 kg schwerer“.
 *
 * 5) Zuordnen: Jeder Begriff bekommt eine der Kategorien aus data-kategorien.
 *   <div class="aufgabe zuordnen" data-id="Z1" data-kategorien="Ausgangsstoff|Produkt">
 *     <p class="frage">Ordne zu.</p>
 *     <ul class="paare">
 *       <li data-kategorie="Ausgangsstoff">Wasser</li>
 *       <li data-kategorie="Produkt">Sauerstoff</li>
 *     </ul>
 *   </div>
 *   Die Begriffe werden gemischt (außer bei data-fest).
 *
 * 6) Selbst erklären: freie Antwort schreiben, dann die Kernpunkte selbst abhaken.
 *   <div class="aufgabe selbst" data-id="S1" data-mindestens="2">
 *     <p class="frage">Nenne zwei Fehlerquellen.</p>
 *     <ul class="kernpunkte"><li>…</li><li>…</li><li>…</li></ul>
 *   </div>
 *   Richtig, wenn alle Kernpunkte abgehakt sind (bzw. mindestens data-mindestens).
 *
 * 7) Energiestufenmodell bauen: Elektronen mit + und − auf die Stufen setzen.
 *   <div class="aufgabe stufen" data-id="E1" data-loesung="2,8,1" data-stufen="4">
 *     <p class="frage">Zeichne das Energiestufenmodell von Natrium (Na, Ordnungszahl 11).</p>
 *   </div>
 *   data-stufen = wie viele Stufen angeboten werden (Standard 4). Leere Stufen
 *   oben zählen nicht. data-gesamt (optional) = erwartete Gesamtzahl für Hinweise,
 *   sonst die Summe aus data-loesung.
 *
 * Fortschritt: <div id="fortschritt"></div> irgendwo auf der Seite zeigt den Stand
 * und bietet „Ergebnis kopieren“ an (zum Einfügen in den Chat mit Claude).
 */
(function () {
  "use strict";

  const ergebnisse = new Map(); // id -> { ok: bool, notiz: string }
  let aufgabenZahl = 0;

  function erfasse(id, ok, notiz) {
    if (!ergebnisse.has(id)) ergebnisse.set(id, { ok, notiz: notiz || "" });
    zeigeFortschritt();
  }

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function mischen(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function rueckmeldung(aufgabe) {
    let r = aufgabe.querySelector(".rueckmeldung");
    if (!r) {
      r = el("p", "rueckmeldung");
      r.setAttribute("aria-live", "polite");
      const erkl = aufgabe.querySelector(".erklaerung");
      aufgabe.insertBefore(r, erkl || null);
    }
    return r;
  }

  function nummeriere(aufgabe) {
    const frage = aufgabe.querySelector(".frage");
    if (frage && aufgabe.dataset.id && !frage.querySelector(".nummer")) {
      frage.prepend(el("span", "nummer", aufgabe.dataset.id));
    }
  }

  /* ---------- 1) Ankreuzen ---------- */
  function initMC(aufgabe) {
    const box = aufgabe.querySelector(".optionen");
    const knoepfe = Array.from(box.querySelectorAll("button"));
    if (!aufgabe.hasAttribute("data-fest")) mischen(knoepfe).forEach((b) => box.appendChild(b));
    const r = rueckmeldung(aufgabe);
    knoepfe.forEach((b) => {
      b.type = "button";
      b.addEventListener("click", () => {
        const id = aufgabe.dataset.id;
        if (b.hasAttribute("data-richtig")) {
          b.classList.add("richtig");
          knoepfe.forEach((k) => (k.disabled = true));
          aufgabe.classList.add("geloest");
          r.className = "rueckmeldung ok";
          r.textContent = "Richtig!";
          erfasse(id, true);
        } else {
          b.classList.add("falsch");
          b.disabled = true;
          r.className = "rueckmeldung nein";
          r.textContent = "Nicht ganz. Lies noch einmal genau und probier es nochmal.";
          erfasse(id, false, "gewählt: „" + b.textContent.trim() + "“");
        }
      });
    });
  }

  /* ---------- Zerlegen in Wörter und Satzzeichen ---------- */
  const VORNE = /^[„"‚'(»]+/;
  const HINTEN = /[,.;:!?"“‘'»)]+$/;

  function zerlege(text, soll, ziel, woerter) {
    text.split(/(\s+)/).forEach((stueck) => {
      if (!stueck) return;
      if (/^\s+$/.test(stueck)) { ziel.appendChild(document.createTextNode(" ")); return; }
      let kern = stueck;
      const vorne = (kern.match(VORNE) || [""])[0];
      kern = kern.slice(vorne.length);
      const hinten = (kern.match(HINTEN) || [""])[0];
      kern = kern.slice(0, kern.length - hinten.length);
      if (vorne) ziel.appendChild(el("span", "zeichen", vorne));
      if (kern) {
        const b = el("button", "wort", kern);
        b.type = "button";
        b.dataset.soll = soll ? "1" : "0";
        ziel.appendChild(b);
        woerter.push(b);
      }
      if (hinten) ziel.appendChild(el("span", "zeichen", hinten));
    });
  }

  /* ---------- 2) Wörter markieren ---------- */
  function initMarkieren(aufgabe) {
    const satz = aufgabe.querySelector(".satz");
    const quelle = Array.from(satz.childNodes);
    satz.textContent = "";
    const woerter = [];
    quelle.forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) zerlege(n.textContent, false, satz, woerter);
      else if (n.nodeName === "MARK") zerlege(n.textContent, true, satz, woerter);
      else zerlege(n.textContent, false, satz, woerter);
    });

    const r = rueckmeldung(aufgabe);
    const knopf = el("button", "pruefen", "Prüfen");
    knopf.type = "button";
    aufgabe.insertBefore(knopf, r);

    function aufraeumen() {
      woerter.forEach((w) => w.classList.remove("treffer", "zuviel", "fehlt"));
      r.textContent = "";
    }

    woerter.forEach((w) => {
      w.setAttribute("aria-pressed", "false");
      w.addEventListener("click", () => {
        if (aufgabe.classList.contains("geloest")) return;
        aufraeumen();
        w.classList.toggle("an");
        w.setAttribute("aria-pressed", String(w.classList.contains("an")));
      });
    });

    knopf.addEventListener("click", () => {
      aufraeumen();
      let fehlt = 0, zuviel = 0;
      woerter.forEach((w) => {
        const an = w.classList.contains("an"), soll = w.dataset.soll === "1";
        if (an && soll) w.classList.add("treffer");
        else if (an && !soll) { w.classList.add("zuviel"); zuviel++; }
        else if (!an && soll) { w.classList.add("fehlt"); fehlt++; }
      });
      const markiert = woerter.filter((w) => w.classList.contains("an")).map((w) => w.textContent).join(" ");
      if (!fehlt && !zuviel) {
        aufgabe.classList.add("geloest");
        knopf.disabled = true;
        r.className = "rueckmeldung ok";
        r.textContent = "Genau richtig!";
        erfasse(aufgabe.dataset.id, true);
      } else {
        const teile = [];
        if (fehlt) teile.push(fehlt === 1 ? "1 Wort fehlt (gestrichelt)" : fehlt + " Wörter fehlen (gestrichelt)");
        if (zuviel) teile.push(zuviel === 1 ? "1 Wort ist zu viel (durchgestrichen)" : zuviel + " Wörter sind zu viel (durchgestrichen)");
        r.className = "rueckmeldung nein";
        r.textContent = teile.join(", ") + ". Verbessere und prüfe nochmal.";
        erfasse(aufgabe.dataset.id, false, "markiert: „" + (markiert || "nichts") + "“");
      }
    });
  }

  /* ---------- 3) Kommas setzen ---------- */
  function initKomma(aufgabe) {
    const satz = aufgabe.querySelector(".satz");
    const stuecke = satz.textContent.trim().split(/\s+/);
    satz.textContent = "";
    const luecken = [];
    stuecke.forEach((st, i) => {
      const soll = st.endsWith("|");
      const wort = soll ? st.slice(0, -1) : st;
      satz.appendChild(document.createTextNode(wort));
      const letztes = i === stuecke.length - 1;
      const satzende = /[.!?:]["“]?$/.test(wort);
      if (!letztes && !satzende) {
        const l = el("button", "luecke");
        l.type = "button";
        l.dataset.soll = soll ? "1" : "0";
        l.dataset.nach = wort;
        l.setAttribute("aria-label", "Komma nach „" + wort + "“");
        l.setAttribute("aria-pressed", "false");
        satz.appendChild(l);
        luecken.push(l);
      }
      if (!letztes) satz.appendChild(document.createTextNode(" "));
    });

    const r = rueckmeldung(aufgabe);
    const knopf = el("button", "pruefen", "Prüfen");
    knopf.type = "button";
    aufgabe.insertBefore(knopf, r);

    function aufraeumen() {
      luecken.forEach((l) => {
        l.classList.remove("treffer", "zuviel", "fehlt");
        l.textContent = l.classList.contains("an") ? "," : "";
      });
      r.textContent = "";
    }

    luecken.forEach((l) => {
      l.addEventListener("click", () => {
        if (aufgabe.classList.contains("geloest")) return;
        aufraeumen();
        l.classList.toggle("an");
        l.textContent = l.classList.contains("an") ? "," : "";
        l.setAttribute("aria-pressed", String(l.classList.contains("an")));
      });
    });

    knopf.addEventListener("click", () => {
      aufraeumen();
      const fehlend = [], zuviel = [];
      luecken.forEach((l) => {
        const an = l.classList.contains("an"), soll = l.dataset.soll === "1";
        if (an && soll) l.classList.add("treffer");
        else if (an && !soll) { l.classList.add("zuviel"); zuviel.push(l.dataset.nach); }
        else if (!an && soll) { l.classList.add("fehlt"); l.textContent = ","; fehlend.push(l.dataset.nach); }
      });
      if (!fehlend.length && !zuviel.length) {
        aufgabe.classList.add("geloest");
        knopf.disabled = true;
        r.className = "rueckmeldung ok";
        r.textContent = "Alle Kommas sitzen!";
        erfasse(aufgabe.dataset.id, true);
      } else {
        const teile = [];
        if (fehlend.length) teile.push(fehlend.length === 1 ? "1 Komma fehlt (gestrichelt)" : fehlend.length + " Kommas fehlen (gestrichelt)");
        if (zuviel.length) teile.push(zuviel.length === 1 ? "1 Komma ist zu viel (rot)" : zuviel.length + " Kommas sind zu viel (rot)");
        r.className = "rueckmeldung nein";
        r.textContent = teile.join(", ") + ". Verbessere und prüfe nochmal.";
        const notiz = [];
        if (fehlend.length) notiz.push("fehlte nach: " + fehlend.join(", "));
        if (zuviel.length) notiz.push("zu viel nach: " + zuviel.join(", "));
        erfasse(aufgabe.dataset.id, false, notiz.join("; "));
      }
    });
  }

  /* ---------- 4) Selbst eintragen ---------- */
  function normalisiere(s) {
    return s.replace(/…|\.\.\./g, " ").replace(/[.!]+\s*$/, "").replace(/\s+/g, " ").trim();
  }

  function initEingabe(aufgabe) {
    const loesungen = aufgabe.dataset.loesung.split("|").map(normalisiere);
    const zeile = el("div", "eingabe-zeile");
    const feld = el("input");
    feld.type = "text";
    feld.autocomplete = "off";
    feld.spellcheck = false;
    feld.setAttribute("autocapitalize", "off");
    feld.setAttribute("aria-label", "Deine Antwort");
    const knopf = el("button", "pruefen", "Prüfen");
    knopf.type = "button";
    zeile.append(feld, knopf);
    const r = rueckmeldung(aufgabe);
    aufgabe.insertBefore(zeile, r);
    let fehlversuche = 0;

    function loesen(text) {
      aufgabe.classList.add("geloest");
      feld.disabled = true;
      knopf.disabled = true;
      r.className = "rueckmeldung ok";
      r.textContent = text;
      const zeige = aufgabe.querySelector(".zeige-loesung");
      if (zeige) zeige.remove();
    }

    function pruefen() {
      const antwort = normalisiere(feld.value);
      if (!antwort || aufgabe.classList.contains("geloest")) return;
      const muster = aufgabe.dataset.muster && new RegExp(aufgabe.dataset.muster, "i");
      if (loesungen.includes(antwort) || (muster && muster.test(feld.value.trim()))) {
        loesen("Richtig!");
        erfasse(aufgabe.dataset.id, true);
        return;
      }
      fehlversuche++;
      erfasse(aufgabe.dataset.id, false, "geschrieben: „" + feld.value.trim() + "“");
      const kleinGleich = loesungen.some((l) => l.toLowerCase() === antwort.toLowerCase());
      r.className = "rueckmeldung nein";
      r.textContent = kleinGleich
        ? "Fast! Achte auf die Groß- und Kleinschreibung."
        : "Nicht ganz. Geh es noch einmal Schritt für Schritt durch und probier es nochmal.";
      if (fehlversuche >= 2 && !aufgabe.querySelector(".zeige-loesung")) {
        const zeige = el("button", "zeige-loesung", "Lösung zeigen");
        zeige.type = "button";
        zeige.addEventListener("click", () => {
          feld.value = aufgabe.dataset.loesung.split("|")[0];
          loesen("Die Lösung steht jetzt im Feld. Schreib sie einmal auf ein Blatt ab, dann bleibt sie hängen.");
        });
        zeile.appendChild(zeige);
      }
    }

    knopf.addEventListener("click", pruefen);
    feld.addEventListener("keydown", (e) => { if (e.key === "Enter") pruefen(); });
  }

  /* ---------- 5) Zuordnen ---------- */
  function initZuordnen(aufgabe) {
    const kategorien = aufgabe.dataset.kategorien.split("|");
    const liste = aufgabe.querySelector(".paare");
    const zeilen = Array.from(liste.querySelectorAll("li"));
    if (!aufgabe.hasAttribute("data-fest")) mischen(zeilen).forEach((z) => liste.appendChild(z));
    zeilen.forEach((z) => {
      const begriff = z.textContent.trim();
      z.textContent = "";
      z.dataset.begriff = begriff;
      z.appendChild(el("span", "begriff", begriff));
      const wahl = el("span", "wahl");
      wahl.setAttribute("role", "group");
      wahl.setAttribute("aria-label", begriff);
      kategorien.forEach((k) => {
        const b = el("button", "", k);
        b.type = "button";
        b.setAttribute("aria-pressed", "false");
        b.addEventListener("click", () => {
          if (aufgabe.classList.contains("geloest")) return;
          z.classList.remove("ok", "nein");
          r.textContent = "";
          wahl.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
          z.dataset.gewaehlt = k;
        });
        wahl.appendChild(b);
      });
      z.appendChild(wahl);
    });

    const r = rueckmeldung(aufgabe);
    const knopf = el("button", "pruefen", "Prüfen");
    knopf.type = "button";
    aufgabe.insertBefore(knopf, r);

    knopf.addEventListener("click", () => {
      const offen = zeilen.filter((z) => !z.dataset.gewaehlt);
      if (offen.length) {
        r.className = "rueckmeldung nein";
        r.textContent = "Ordne zuerst alle Begriffe zu (noch " + offen.length + " offen).";
        return;
      }
      const falsch = [];
      zeilen.forEach((z) => {
        const ok = z.dataset.gewaehlt === z.dataset.kategorie;
        z.classList.toggle("ok", ok);
        z.classList.toggle("nein", !ok);
        if (!ok) falsch.push(z.dataset.begriff + " → " + z.dataset.gewaehlt);
      });
      if (!falsch.length) {
        aufgabe.classList.add("geloest");
        knopf.disabled = true;
        r.className = "rueckmeldung ok";
        r.textContent = "Alles richtig zugeordnet!";
        erfasse(aufgabe.dataset.id, true);
      } else {
        r.className = "rueckmeldung nein";
        r.textContent = (falsch.length === 1 ? "1 Begriff ist" : falsch.length + " Begriffe sind") +
          " falsch zugeordnet (rot). Verbessere und prüfe nochmal.";
        erfasse(aufgabe.dataset.id, false, falsch.join(", "));
      }
    });
  }

  /* ---------- 6) Selbst erklären ---------- */
  function initSelbst(aufgabe) {
    const kern = aufgabe.querySelector(".kernpunkte");
    const punkte = Array.from(kern.querySelectorAll("li"));
    const mindestens = Number(aufgabe.dataset.mindestens) || punkte.length;
    kern.hidden = true;

    const feld = el("textarea");
    feld.rows = 3;
    feld.setAttribute("aria-label", "Deine Antwort");
    feld.placeholder = "Schreib deine Antwort in ganzen Sätzen.";
    const zeige = el("button", "pruefen", "Fertig – Lösung zeigen");
    zeige.type = "button";
    const r = rueckmeldung(aufgabe);
    aufgabe.insertBefore(feld, kern);
    aufgabe.insertBefore(zeige, kern);

    const anleitung = el("p", "klein",
      mindestens < punkte.length
        ? "Hake ab, was in deiner Antwort vorkommt. Du brauchst mindestens " + mindestens + "."
        : "Hake ab, was in deiner Antwort vorkommt. Sei ehrlich zu dir!");
    const kaesten = punkte.map((p) => {
      const label = el("label");
      const kasten = el("input");
      kasten.type = "checkbox";
      label.appendChild(kasten);
      label.appendChild(document.createTextNode(" " + p.textContent.trim()));
      p.textContent = "";
      p.appendChild(label);
      return kasten;
    });
    const auswerten = el("button", "pruefen", "Auswerten");
    auswerten.type = "button";

    zeige.addEventListener("click", () => {
      if (feld.value.trim().length < 8) {
        r.className = "rueckmeldung nein";
        r.textContent = "Schreib erst eine eigene Antwort – auch wenn du unsicher bist. Genau das trainiert dein Gedächtnis.";
        return;
      }
      r.textContent = "";
      feld.readOnly = true;
      zeige.remove();
      kern.hidden = false;
      kern.before(anleitung);
      kern.after(auswerten);
    });

    auswerten.addEventListener("click", () => {
      const fehlt = punkte.filter((p, i) => !kaesten[i].checked).map((p) => p.textContent.trim());
      const ok = punkte.length - fehlt.length >= mindestens;
      kaesten.forEach((k) => (k.disabled = true));
      auswerten.disabled = true;
      aufgabe.classList.add("geloest");
      if (!ok) aufgabe.classList.add("nicht-ganz");
      punkte.forEach((p, i) => { if (!kaesten[i].checked) p.classList.add("fehlt"); });
      r.className = ok ? "rueckmeldung ok" : "rueckmeldung nein";
      r.textContent = ok
        ? "Stark! Deine Antwort hat alles Wichtige."
        : "Da fehlt noch etwas. Lies die fehlenden Punkte laut vor und schreib die Antwort einmal vollständig ab.";
      const notiz = "geschrieben: „" + feld.value.trim().replace(/\s+/g, " ").slice(0, 160) + "“";
      erfasse(aufgabe.dataset.id, ok, ok ? "" : notiz + (fehlt.length ? "; nicht abgehakt: " + fehlt.join(" / ") : ""));
    });
  }

  /* ---------- 7) Energiestufenmodell bauen ---------- */
  function initStufen(aufgabe) {
    const soll = aufgabe.dataset.loesung.split(",").map(Number);
    const gesamt = Number(aufgabe.dataset.gesamt) || soll.reduce((a, b) => a + b, 0);
    const stufen = Number(aufgabe.dataset.stufen) || 4;
    const ist = new Array(stufen).fill(0);
    const box = el("div", "stufen-modell");
    box.appendChild(el("span", "achse", "E"));
    const zeilen = [];
    for (let i = stufen - 1; i >= 0; i--) {
      const z = el("div", "stufe");
      const minus = el("button", "", "−");
      const plus = el("button", "", "+");
      minus.type = plus.type = "button";
      minus.setAttribute("aria-label", "Ein Elektron weniger auf Stufe n = " + (i + 1));
      plus.setAttribute("aria-label", "Ein Elektron mehr auf Stufe n = " + (i + 1));
      const linie = el("span", "linie");
      const zahl = el("span", "zahl", "0");
      z.append(el("span", "n", "n = " + (i + 1)), minus, linie, plus, zahl);
      minus.addEventListener("click", () => setze(i, -1));
      plus.addEventListener("click", () => setze(i, 1));
      zeilen[i] = { linie, zahl };
      box.appendChild(z);
    }
    const r = rueckmeldung(aufgabe);
    const knopf = el("button", "pruefen", "Prüfen");
    knopf.type = "button";
    aufgabe.insertBefore(box, r);
    aufgabe.insertBefore(knopf, r);

    function setze(i, d) {
      if (aufgabe.classList.contains("geloest")) return;
      ist[i] = Math.max(0, Math.min(18, ist[i] + d));
      zeilen[i].zahl.textContent = String(ist[i]);
      zeilen[i].linie.textContent = "";
      for (let k = 0; k < ist[i]; k++) zeilen[i].linie.appendChild(el("span", "e", "−"));
      r.textContent = "";
    }

    knopf.addEventListener("click", () => {
      const ohneLeer = (a) => { const b = a.slice(); while (b.length && !b[b.length - 1]) b.pop(); return b; };
      const a = ohneLeer(ist), b = ohneLeer(soll);
      const summe = ist.reduce((x, y) => x + y, 0);
      if (a.join(",") === b.join(",")) {
        aufgabe.classList.add("geloest");
        knopf.disabled = true;
        r.className = "rueckmeldung ok";
        r.textContent = "Richtig! Elektronenkonfiguration: " + b.map((z, i) => (i + 1) + hoch(z)).join(" ");
        erfasse(aufgabe.dataset.id, true);
        return;
      }
      r.className = "rueckmeldung nein";
      if (summe !== gesamt) r.textContent = "Du hast " + summe + " Elektronen gesetzt. Wie viele hat das Atom? Schau auf die Ordnungszahl.";
      else if (ist.some((z, i) => z > 2 * (i + 1) * (i + 1))) r.textContent = "Die Anzahl stimmt, aber eine Stufe ist zu voll. Höchstens 2 · n² Elektronen pro Stufe!";
      else r.textContent = "Die Anzahl stimmt, aber die Verteilung nicht. Fülle von unten nach oben und denk an die Sonderregel (Stufe 3 erst mal nur 8).";
      erfasse(aufgabe.dataset.id, false, "gesetzt: " + ohneLeer(ist).join(","));
    });
  }

  function hoch(z) {
    return String(z).replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);
  }

  /* ---------- Fortschritt & Ergebnis kopieren ---------- */
  function bericht() {
    const ok = Array.from(ergebnisse.values()).filter((e) => e.ok).length;
    const zeilen = [
      document.title + " (" + new Date().toLocaleDateString("de-DE") + ")",
      "Beim ersten Versuch richtig: " + ok + " von " + aufgabenZahl +
        (ergebnisse.size < aufgabenZahl ? " (bearbeitet: " + ergebnisse.size + ")" : ""),
    ];
    ergebnisse.forEach((e, id) => { if (!e.ok) zeilen.push("✗ " + id + ": " + e.notiz); });
    return zeilen.join("\n");
  }

  function zeigeFortschritt() {
    const box = document.getElementById("fortschritt");
    if (!box) return;
    const ok = Array.from(ergebnisse.values()).filter((e) => e.ok).length;
    box.querySelector(".zahl").textContent = ok + " / " + aufgabenZahl;
    box.querySelector(".stand").textContent =
      ergebnisse.size < aufgabenZahl
        ? "Noch " + (aufgabenZahl - ergebnisse.size) + " Aufgaben offen."
        : "Alles bearbeitet! Kopiere dein Ergebnis und zeig es deinen Eltern oder füge es im Chat mit Claude ein.";
  }

  function initFortschritt() {
    const box = document.getElementById("fortschritt");
    if (!box) return;
    box.innerHTML = "";
    box.appendChild(el("div", "", "Beim ersten Versuch richtig"));
    box.appendChild(el("div", "zahl", "0 / " + aufgabenZahl));
    box.appendChild(el("div", "stand klein", ""));
    const knopf = el("button", "pruefen", "Ergebnis kopieren");
    knopf.type = "button";
    const meldung = el("span", "klein", "");
    meldung.style.marginLeft = ".6rem";
    knopf.addEventListener("click", async () => {
      const text = bericht();
      try {
        await navigator.clipboard.writeText(text);
        meldung.textContent = "Kopiert ✓";
      } catch (_) {
        const ta = el("textarea");
        ta.value = text; ta.rows = 6; ta.style.width = "100%";
        box.appendChild(ta); ta.select();
        meldung.textContent = "Bitte den Text unten markieren und kopieren.";
      }
    });
    box.appendChild(knopf);
    box.appendChild(meldung);
    zeigeFortschritt();
  }

  function start() {
    const aufgaben = document.querySelectorAll(".aufgabe");
    aufgaben.forEach((a, i) => {
      if (!a.dataset.id) a.dataset.id = String(i + 1);
      nummeriere(a);
      if (a.classList.contains("mc")) initMC(a);
      else if (a.classList.contains("markieren")) initMarkieren(a);
      else if (a.classList.contains("komma")) initKomma(a);
      else if (a.classList.contains("eingabe")) initEingabe(a);
      else if (a.classList.contains("zuordnen")) initZuordnen(a);
      else if (a.classList.contains("selbst")) initSelbst(a);
      else if (a.classList.contains("stufen")) initStufen(a);
    });
    aufgabenZahl = aufgaben.length;
    initFortschritt();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
