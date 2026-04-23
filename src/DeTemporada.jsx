import { useState, useMemo, useRef, useEffect } from "react";

const LOGO = "https://cdn.shopify.com/s/files/1/0983/2857/6366/files/DeTempradasi_SINFONDO.png?v=1776909845";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const MC = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const EST = { verano:[12,1,2], otono:[3,4,5], invierno:[6,7,8], primavera:[9,10,11] };
const EL = { verano:"Verano", otono:"Otoño", invierno:"Invierno", primavera:"Primavera" };
const EE = { verano:"☀️", otono:"🍂", invierno:"❄️", primavera:"🌸" };
function gE(m) { for (const [e, ms] of Object.entries(EST)) if (ms.includes(m)) return e; return "otono"; }

// Verduras con info nutricional
const V = [
  { n:"Acelga", e:"🥬", m:[1,2,3,4,5,6,7,8,9,10,11,12], t:"Hojas en papel húmedo, bolsa en heladera. Dura 5 días.", r:"Tarta de acelga con huevo y queso", nut:"Vitamina A, K, hierro. Muy baja en calorías." },
  { n:"Apio", e:"🥒", m:[5,6,7,8,9], t:"Tallos en vaso con agua en heladera. Crocante 2 semanas.", r:"Sopa crema de apio y puerro", nut:"Fibra, potasio, vitamina K. Solo 16 cal/100g." },
  { n:"Batata", e:"🍠", m:[3,4,5,6,7,8], t:"Lugar fresco, seco y oscuro. No heladera. Dura 2 semanas.", r:"Puré de batata con manteca y nuez moscada", nut:"Vitamina A (betacaroteno), fibra, potasio. 90 cal/100g." },
  { n:"Berenjena", e:"🍆", m:[1,2,3,4,5], t:"No lavar hasta usar. Heladera en bolsa perforada. 1 semana.", r:"Berenjenas rellenas al horno con carne", nut:"Fibra, antioxidantes, baja en calorías. 25 cal/100g." },
  { n:"Brócoli", e:"🥦", m:[4,5,6,7,8,9], t:"Bolsa abierta en heladera. No lavar antes. 5-7 días.", r:"Brócoli salteado con ajo y limón", nut:"Vitamina C, K, ácido fólico. Anticancerígeno natural." },
  { n:"Calabaza", e:"🎃", m:[3,4,5,6,7,8,9,10,11,12], t:"Entera dura meses. Cortada, film y usar en 5 días.", r:"Ñoquis de calabaza con salsa fileto", nut:"Vitamina A, C, fibra. Solo 26 cal/100g." },
  { n:"Cebolla", e:"🧅", m:[1,2,3,11,12], t:"Lugar fresco, seco y ventilado. Lejos de papas. Semanas.", r:"Sopa de cebolla gratinada", nut:"Quercetina (antioxidante), vitamina C, prebiótico." },
  { n:"Chaucha", e:"🫛", m:[1,2,3,4,6,10], t:"Bolsa cerrada en heladera. Se pueden blanquear y freezar.", r:"Chauchas salteadas con tomate y huevo", nut:"Fibra, vitamina C, K, ácido fólico. 31 cal/100g." },
  { n:"Choclo", e:"🌽", m:[1,2,3,4,5,6], t:"Con chala dura más. Consumir el mismo día. Freezar hervido.", r:"Humita en olla con choclo fresco", nut:"Carbohidratos, fibra, vitamina B. 86 cal/100g." },
  { n:"Coliflor", e:"🥦", m:[5,6,7,8,9], t:"Bolsa abierta en heladera. No lavar hasta usar. 1 semana.", r:"Coliflor gratinada con bechamel", nut:"Vitamina C, K, fibra. Solo 25 cal/100g." },
  { n:"Espinaca", e:"🍃", m:[4,5,6,7,8,9], t:"Bolsa con papel absorbente. Sacar el aire. 4-5 días.", r:"Canelones de espinaca y ricota", nut:"Hierro, calcio, vitamina A, K. Superalimento." },
  { n:"Lechuga", e:"🥬", m:[1,2,3,4,5,6,7,8,9,10,11,12], t:"Lavar, secar bien, tupper con papel de cocina. 1 semana.", r:"Ensalada caesar con pollo grillado", nut:"Vitamina A, K, ácido fólico. Solo 15 cal/100g." },
  { n:"Pepino", e:"🥒", m:[1,2,3,4,5,6,10,11,12], t:"Envolver en film o bolsa. No congelar. 1 semana.", r:"Ensalada de pepino con limón y menta", nut:"95% agua, vitamina K. Hidratante. 12 cal/100g." },
  { n:"Pimiento", e:"🫑", m:[1,2,3,4], t:"Heladera sin lavar, en bolsa. Entero dura 2 semanas.", r:"Pimientos rellenos de arroz y carne", nut:"Vitamina C (más que la naranja), A, B6. 31 cal/100g." },
  { n:"Puerro", e:"🧅", m:[1,5,6,7,8,9,10,12], t:"Heladera envuelto en papel. 10-14 días. Usar parte verde.", r:"Tarta de puerro y queso", nut:"Vitamina K, C, ácido fólico, manganeso." },
  { n:"Remolacha", e:"🟤", m:[1,2,3,4,5,6,7,8,9,10,11,12], t:"Sin hojas dura 2-3 semanas en heladera. Hojas comestibles.", r:"Ensalada de remolacha asada con rúcula", nut:"Ácido fólico, hierro, nitratos naturales. Mejora circulación." },
  { n:"Repollo", e:"🥬", m:[5,6,7,8,9], t:"Entero en heladera hasta 2 meses. Cortado, 1 semana.", r:"Repollo colorado salteado con manzana", nut:"Vitamina C, K, fibra. Antiinflamatorio. 25 cal/100g." },
  { n:"Rúcula", e:"🌿", m:[1,9,10,11,12], t:"Tupper con papel absorbente. Consumir rápido, 3-4 días.", r:"Pizza con rúcula, jamón crudo y parmesano", nut:"Calcio, vitamina K, A. Sabor picante = glucosinolatos." },
  { n:"Zanahoria", e:"🥕", m:[1,2,3,4,5,6,7,8,9,10,11,12], t:"Sacar hojas. Bolsa en heladera, 3-4 semanas.", r:"Zanahoria glaseada con miel y manteca", nut:"Betacaroteno (vitamina A), fibra. Buena para la vista." },
  { n:"Zapallito", e:"🟢", m:[1,2,3,4,5,6,10,11,12], t:"Heladera sin lavar. 1 semana. Se puede rallar y freezar.", r:"Zapallitos rellenos al horno", nut:"Vitamina C, potasio, baja en calorías. 17 cal/100g." },
  { n:"Zapallo", e:"🎃", m:[3,4,5,6,7,8,9], t:"Entero dura meses. Cortado, film y usar en la semana.", r:"Sopa crema de zapallo con croutones", nut:"Vitamina A, C, potasio. Fibra. 26 cal/100g." },
  { n:"Papa", e:"🥔", m:[1,2,3,10,11,12], t:"Lugar oscuro y seco. No heladera. Lejos de cebollas.", r:"Tortilla de papas española", nut:"Potasio, vitamina C, B6, carbohidratos. 77 cal/100g." },
  { n:"Alcaucil", e:"🌱", m:[9,10,11,12], t:"Heladera en bolsa. Consumir rápido, 3-4 días.", r:"Alcauciles a la provenzal", nut:"Fibra, ácido fólico, vitamina C, K. Protege el hígado." },
  { n:"Radicheta", e:"🥬", m:[1,2,3,4,5,6], t:"En agua como flores. Heladera 3-4 días.", r:"Radicheta salteada con ajo", nut:"Vitamina A, K, hierro. Amarga = buena para digestión." },
];

const FR = [
  { n:"Ciruela", e:"🟣", m:[1,2,3,4], t:"Temperatura ambiente hasta madurar. Heladera, 5 días.", r:"Tarta de ciruelas con crumble", nut:"Vitamina C, K, fibra. Ayuda al tránsito intestinal." },
  { n:"Durazno", e:"🍑", m:[1,2,3,11,12], t:"Madurar afuera. Maduro, heladera hasta 5 días.", r:"Duraznos asados con helado de crema", nut:"Vitamina C, A, potasio. 39 cal/100g." },
  { n:"Frutilla", e:"🍓", m:[1,2,3,10,11,12], t:"No lavar hasta consumir. Heladera sin tapar. 3-4 días.", r:"Frutillas con crema y merengue", nut:"Vitamina C (más que la naranja), manganeso, antioxidantes." },
  { n:"Kiwi", e:"🥝", m:[4,5,6], t:"Verde: temperatura ambiente. Maduro: heladera 2 semanas.", r:"Ensalada de frutas con kiwi y naranja", nut:"Vitamina C (el doble de la naranja), K, fibra." },
  { n:"Limón", e:"🍋", m:[4,5,6,7,8,9,10,11], t:"Temperatura ambiente 1 semana. Heladera hasta 1 mes.", r:"Lemon pie casero", nut:"Vitamina C, flavonoides. Alcalinizante natural." },
  { n:"Mandarina", e:"🍊", m:[4,5,6,7,8], t:"Temperatura ambiente 1 semana. Heladera hasta 2 semanas.", r:"Jugo de mandarina natural exprimido", nut:"Vitamina C, A, fibra. 53 cal/100g." },
  { n:"Manzana", e:"🍎", m:[1,2,3,4,5,6,7,8,9,10,11,12], t:"Heladera lejos de otras frutas (genera etileno). Semanas.", r:"Tarta de manzana con canela", nut:"Fibra (pectina), vitamina C, antioxidantes. 52 cal/100g." },
  { n:"Melón", e:"🍈", m:[1,2,3,12], t:"Entero temperatura ambiente. Cortado, film, 3 días.", r:"Melón con jamón crudo", nut:"Vitamina A, C, potasio. 90% agua. 34 cal/100g." },
  { n:"Membrillo", e:"🍐", m:[4,5,6], t:"Temperatura ambiente. Cocinado (dulce) dura meses.", r:"Dulce de membrillo casero con queso", nut:"Fibra, vitamina C, pectina. Bajo en calorías crudo." },
  { n:"Naranja", e:"🍊", m:[1,2,3,4,5,6,7,8,9,10,11,12], t:"Temperatura ambiente 1 semana. Exprimida, tomar enseguida.", r:"Bizcochuelo de naranja esponjoso", nut:"Vitamina C, ácido fólico, fibra. 47 cal/100g." },
  { n:"Palta", e:"🥑", m:[4,5,6,7,10,11,12], t:"Verde: afuera. Madura: heladera 3 días. Abierta: limón y film.", r:"Guacamole con nachos", nut:"Grasas saludables (omega 9), potasio, vitamina E, K." },
  { n:"Pera", e:"🍐", m:[1,2,3,4,5,6,7,8,9,10,11,12], t:"Madurar a temperatura ambiente. Blanda, heladera 3-5 días.", r:"Peras al vino tinto con canela", nut:"Fibra, vitamina C, K, cobre. 57 cal/100g." },
  { n:"Pomelo", e:"🍊", m:[4,5,6,7,8], t:"Temperatura ambiente 1 semana. Heladera hasta 3 semanas.", r:"Jugo de pomelo con jengibre", nut:"Vitamina C, A, licopeno. Bajo en calorías. 42 cal/100g." },
  { n:"Sandía", e:"🍉", m:[1,2,3,12], t:"Entera temperatura ambiente. Cortada, film, 3 días.", r:"Agua saborizada de sandía con menta", nut:"Licopeno, vitamina C, 92% agua. 30 cal/100g." },
  { n:"Uva", e:"🍇", m:[1,2,3,4], t:"Sin lavar en heladera. Bolsa abierta. 1-2 semanas.", r:"Uvas congeladas como snack (probalo)", nut:"Resveratrol (antioxidante), vitamina K, C. 69 cal/100g." },
  { n:"Banana", e:"🍌", m:[1,2,3,4,5,6,7,8,9,10,11,12], t:"Temperatura ambiente. Separar del racimo para que dure más.", r:"Licuado de banana con avena", nut:"Potasio, vitamina B6, magnesio. Energía rápida. 89 cal/100g." },
  { n:"Ananá", e:"🍍", m:[10,11,12,1,2,3], t:"Temperatura ambiente 2 días. Pelado, heladera 3 días en tupper.", r:"Ananá grillado con helado", nut:"Bromelina (antiinflamatorio), vitamina C, manganeso." },
];

const catMap = Object.fromEntries(CATS_DATA());
function CATS_DATA() { return [...V.map(v => [v.n, { ...v, tipo: "verdura" }]), ...FR.map(f => [f.n, { ...f, tipo: "fruta" }])]; }

// Colors
const g = "#2D6A4F", gD = "#1B4332", gL = "#95D5B2", gP = "#B0F1CC", gB = "#E8F5EE", gBg = "rgba(45,106,79,0.06)";
const te = "#8D4D4E", cr = "#FEFAF6", w = "#FFFFFF", ink = "#1B1B1B", tx = "#404943", mu = "#707973";
const li = "#BFC9C1", lL = "#E5E2E1", sL = "#F6F3F2";
const F = "'Plus Jakarta Sans',sans-serif";

const ACCESS_KEY = "kooki_access_v1";
const CHECKOUT_URL = "https://impulsoebooks.online/cart/53627712930158:1";

export default function DeTemporada() {
  const mA = new Date().getMonth() + 1;
  const [mes, setMes] = useState(mA);
  const [filtro, setFiltro] = useState("todo");
  const [showF, setShowF] = useState(false);
  const [sel, setSel] = useState(null);
  const [mt, setMt] = useState(false);
  const sR = useRef(null);

  const premium = (() => { try { return !!localStorage.getItem(ACCESS_KEY); } catch(e) { return false; } })();

  useEffect(() => { setMt(true); }, []);

  if (!premium) {
    return (
      <div style={{ background: cr, minHeight: "100vh", fontFamily: F, color: ink, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <img src={LOGO} alt="DeTemporada" style={{ height: 80, objectFit: "contain", marginBottom: 20 }} />
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10, letterSpacing: "-0.03em" }}>Contenido <span style={{ color: g }}>Premium</span></h2>
          <p style={{ fontSize: 15, color: mu, lineHeight: 1.6, marginBottom: 28 }}>DeTemporada es exclusivo para usuarios Premium de Kooki. Desbloqueá todas las herramientas con un único pago.</p>
          <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 32px", borderRadius: 14, background: g, color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none", marginBottom: 16 }}>Quiero Premium · $20.900</a>
          <br />
          <a href="/" style={{ fontSize: 14, color: mu, fontWeight: 600, textDecoration: "none" }}>← Volver a Kooki</a>
        </div>
      </div>
    );
  }
  useEffect(() => {
    if (sR.current) {
      const b = sR.current.children[mes - 1];
      if (b) b.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [mes]);

  const est = gE(mes);

  const items = useMemo(() => {
    let l = [];
    if (filtro === "todo" || filtro === "verduras") l.push(...V.map(v => ({ ...v, tipo: "verdura" })));
    if (filtro === "todo" || filtro === "frutas") l.push(...FR.map(f => ({ ...f, tipo: "fruta" })));
    return l;
  }, [filtro]);

  const eT = useMemo(() => items.filter(i => i.m.includes(mes)), [items, mes]);
  const fT = useMemo(() => items.filter(i => !i.m.includes(mes)), [items, mes]);
  const rec = useMemo(() => {
    const p = eT.filter(i => i.r);
    return [...p].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [mes, filtro]);

  // Stats
  const totalV = useMemo(() => eT.filter(i => i.tipo === "verdura").length, [eT]);
  const totalFr = useMemo(() => eT.filter(i => i.tipo === "fruta").length, [eT]);

  const css = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.fu{animation:fadeUp .5s ease both}
.no-sb::-webkit-scrollbar{display:none}.no-sb{-ms-overflow-style:none;scrollbar-width:none}`;

  return (
    <div style={{ background: cr, minHeight: "100vh", fontFamily: F, color: ink, WebkitFontSmoothing: "antialiased", paddingBottom: 40 }}>
      <style>{css}</style>

      {/* Background decoration */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -200, right: -150, width: 500, height: 500, background: "radial-gradient(circle, rgba(45,106,79,0.07), transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -150, left: -200, width: 600, height: 600, background: "radial-gradient(circle, rgba(141,77,78,0.04), transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: 300, left: "50%", width: 400, height: 400, background: "radial-gradient(circle, rgba(149,213,178,0.06), transparent 70%)", borderRadius: "50%", transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(45,106,79,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: cr + "ee", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(45,106,79,0.08)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={LOGO} alt="DeTemporada" style={{ height: 44, objectFit: "contain" }} onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
            <div style={{ display: "none", width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, " + g + ", " + gD + ")", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{"🌿"}</div>
            <span style={{ fontWeight: 800, fontSize: 18, color: g, letterSpacing: "-0.03em" }}>DeTemporada</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: mu, letterSpacing: "0.04em" }}>{"Argentina 🇦🇷"}</span>
        </div>
      </header>

      <main style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "20px 20px 0" }}>

        {/* Hero */}
        <section className={mt ? "fu" : ""} style={{
          background: "linear-gradient(135deg, " + gD + ", " + g + ")",
          borderRadius: 24, padding: "32px 24px", marginBottom: 20,
          position: "relative", overflow: "hidden",
          boxShadow: "0 12px 40px rgba(27,67,50,0.3)",
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: gL, animation: "pulse 2s ease infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{"Calendario de estación"}</span>
            </div>

            <h2 style={{ fontWeight: 800, fontSize: "clamp(28px, 8vw, 42px)", letterSpacing: "-0.04em", color: w, margin: "0 0 6px", lineHeight: 1.05 }}>
              {"¿Qué está de "}
              <span style={{ color: gL }}>temporada</span>
              {"?"}
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", margin: "0 0 24px", lineHeight: 1.5, maxWidth: 400 }}>
              {"Frutas y verduras de estación en Argentina. Comprá lo que está barato, fresco y con más sabor."}
            </p>

            {/* Season badge + stats */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 18px", borderRadius: 100 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: w }}>{MESES[mes - 1]}</span>
                <span style={{ fontSize: 16 }}>{EE[est]}</span>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.6)" }}>{EL[est]}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ background: "rgba(176,241,204,0.15)", color: gP, fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 100 }}>{"🥬 " + totalV + " verduras"}</span>
                <span style={{ background: "rgba(141,77,78,0.2)", color: "#FFB3B3", fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 100 }}>{"🍎 " + totalFr + " frutas"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Month selector */}
        <section className={mt ? "fu" : ""} style={{ marginBottom: 20, animationDelay: "60ms" }}>
          <div ref={sR} className="no-sb" style={{ display: "flex", gap: 6, overflowX: "auto", padding: "4px 0" }}>
            {MC.map((m, i) => {
              const num = i + 1, sel2 = num === mes, hoy = num === mA && !sel2;
              return (
                <button key={m} onClick={() => { setMes(num); setSel(null); }} style={{
                  flexShrink: 0, padding: "10px 20px", borderRadius: 14, cursor: "pointer", transition: "all 0.25s",
                  border: sel2 ? "none" : hoy ? "2px solid " + te : "1px solid " + li,
                  background: sel2 ? "linear-gradient(135deg, " + g + ", " + gD + ")" : "rgba(255,255,255,0.7)",
                  color: sel2 ? w : hoy ? te : tx,
                  fontFamily: F, fontSize: 13, fontWeight: 700, letterSpacing: "0.02em",
                  boxShadow: sel2 ? "0 4px 16px rgba(45,106,79,0.25)" : "0 1px 4px rgba(0,0,0,0.04)",
                  backdropFilter: "blur(8px)",
                }}>{m}</button>
              );
            })}
          </div>
        </section>

        {/* Filters */}
        <section className={mt ? "fu" : ""} style={{ display: "flex", gap: 8, marginBottom: 16, justifyContent: "center", animationDelay: "120ms" }}>
          {[{ k: "todo", l: "Todo" }, { k: "verduras", l: "🥬 Verduras" }, { k: "frutas", l: "🍎 Frutas" }].map(f => (
            <button key={f.k} onClick={() => { setFiltro(f.k); setSel(null); }} style={{
              padding: "9px 22px", borderRadius: 100, border: "none", cursor: "pointer", transition: "all 0.25s",
              background: filtro === f.k ? "linear-gradient(135deg, " + g + ", " + gD + ")" : "rgba(255,255,255,0.7)",
              color: filtro === f.k ? w : tx,
              fontFamily: F, fontSize: 13, fontWeight: 700,
              boxShadow: filtro === f.k ? "0 4px 16px rgba(45,106,79,0.2)" : "0 1px 4px rgba(0,0,0,0.04)",
              backdropFilter: "blur(8px)",
            }}>{f.l}</button>
          ))}
        </section>

        {/* Count + legend */}
        <div className={mt ? "fu" : ""} style={{ animationDelay: "160ms" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 22, color: ink, letterSpacing: "-0.02em" }}>{MESES[mes - 1]}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: gB, color: gD, padding: "5px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: g }} />
              {eT.length + " en temporada"}
            </span>
          </div>

          {/* Legend */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16, marginBottom: 10, padding: "10px 14px",
            background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)",
            borderRadius: 12, fontSize: 11, color: mu, fontWeight: 600,
            border: "1px solid rgba(45,106,79,0.06)",
          }}>
            <span style={{ fontWeight: 700, color: tx }}>12 puntos = 12 meses</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: g }} /> Disponible
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: lL }} /> No disponible
            </span>
          </div>

          <p style={{ fontSize: 12, color: mu, marginBottom: 16, textAlign: "center", fontStyle: "italic", fontWeight: 500 }}>
            {"Tocá un producto para ver info nutricional, conservación y receta"}
          </p>
        </div>

        {/* Grid */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 32 }}>
          {eT.map((it, idx) => {
            const op = sel?.n === it.n;
            return (
              <div key={it.n + mes} className={mt ? "fu" : ""} onClick={() => setSel(op ? null : it)} style={{
                background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
                padding: 18, borderRadius: 18,
                border: op ? "2px solid " + g : "1px solid rgba(45,106,79,0.08)",
                boxShadow: op ? "0 8px 32px rgba(45,106,79,0.15)" : "0 2px 12px rgba(0,0,0,0.04)",
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
                animationDelay: (200 + idx * 35) + "ms", cursor: "pointer",
                transition: "border 0.2s, box-shadow 0.3s, transform 0.2s",
                transform: op ? "scale(1.02)" : "scale(1)",
              }}>
                <span style={{ fontSize: 40, marginBottom: 8, display: "block" }}>{it.e}</span>
                <h3 style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.2, color: ink, margin: "0 0 6px" }}>{it.n}</h3>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 12px", borderRadius: 100,
                  background: it.tipo === "verdura" ? gB : "rgba(141,77,78,0.12)",
                  color: it.tipo === "verdura" ? gD : te,
                  textTransform: "uppercase", letterSpacing: "0.05em",
                }}>{it.tipo === "verdura" ? "Verdura" : "Fruta"}</span>

                {/* Mini dots */}
                <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 12, width: "100%" }}>
                  {Array.from({ length: 12 }, (_, di) => {
                    const eM = it.m.includes(di + 1), eS = di + 1 === mes;
                    return <div key={di} style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: eM ? g : lL,
                      boxShadow: eS && eM ? "0 0 0 2px " + w + ", 0 0 0 3.5px " + gD : "none",
                      transition: "all 0.2s",
                    }} />;
                  })}
                </div>

                {/* Expanded detail */}
                {op && (
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid " + lL, width: "100%", textAlign: "left" }}>
                    {/* Nutricional */}
                    <div style={{ marginBottom: 12, background: gBg, borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                        <span style={{ fontSize: 13 }}>{"💪"}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: g, textTransform: "uppercase", letterSpacing: "0.06em" }}>{"Info nutricional"}</span>
                      </div>
                      <p style={{ fontSize: 12, lineHeight: 1.5, color: tx, margin: 0, fontWeight: 500 }}>{it.nut}</p>
                    </div>
                    {/* Conservación */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                        <span style={{ fontSize: 13 }}>{"🧊"}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: gD, textTransform: "uppercase", letterSpacing: "0.06em" }}>{"Conservación"}</span>
                      </div>
                      <p style={{ fontSize: 12, lineHeight: 1.5, color: tx, margin: 0, fontWeight: 500 }}>{it.t}</p>
                    </div>
                    {/* Receta */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                        <span style={{ fontSize: 13 }}>{"👩‍🍳"}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: te, textTransform: "uppercase", letterSpacing: "0.06em" }}>Receta sugerida</span>
                      </div>
                      <p style={{ fontSize: 12, lineHeight: 1.5, color: tx, margin: 0, fontStyle: "italic", fontWeight: 500 }}>{it.r}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Recetas del mes */}
        <section className={mt ? "fu" : ""} style={{ marginBottom: 32, animationDelay: "400ms" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, " + g + ", " + gD + ")", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{"👩‍🍳"}</div>
            <h3 style={{ fontWeight: 800, fontSize: 18, color: ink, margin: 0, letterSpacing: "-0.02em" }}>
              {"Ideas para cocinar en "}
              <span style={{ color: g }}>{MESES[mes - 1]}</span>
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rec.map((r, i) => (
              <div key={r.n} className={mt ? "fu" : ""} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
                background: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)",
                borderRadius: 16, border: "1px solid rgba(45,106,79,0.06)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                animationDelay: (440 + i * 50) + "ms",
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: gB, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{r.e}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: ink, margin: "0 0 2px" }}>{r.r}</p>
                  <p style={{ fontSize: 12, color: mu, margin: 0, fontWeight: 500 }}>{"Con " + r.n.toLowerCase() + " de temporada"}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tip card */}
        <section className={mt ? "fu" : ""} style={{ marginBottom: 32, animationDelay: "500ms" }}>
          <div style={{
            background: "linear-gradient(135deg, " + te + ", #6B3637)",
            padding: "22px 24px", borderRadius: 20,
            color: w, position: "relative", overflow: "hidden",
            boxShadow: "0 12px 40px rgba(141,77,78,0.25)",
          }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{"💡"}</div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: 14, color: w, margin: "0 0 6px" }}>Tip de ahorro</h4>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.5 }}>
                  {"Comprá lo que está en temporada y ahorrás hasta 40% en la verdulería. Más sabor, más nutrientes, menos plata."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Fuera de temporada */}
        {fT.length > 0 && (
          <section className={mt ? "fu" : ""} style={{ marginBottom: 40, animationDelay: "560ms" }}>
            <button onClick={() => setShowF(!showF)} style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 18px", borderRadius: 16, cursor: "pointer", transition: "all 0.25s",
              background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(45,106,79,0.08)", color: mu,
              fontFamily: F, fontSize: 13, fontWeight: 700,
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}>
              <span>{"Ver lo que NO está de temporada (" + fT.length + ")"}</span>
              <span style={{ transform: showF ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s", fontSize: 18 }}>{"▾"}</span>
            </button>
            {showF && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 14 }}>
                {fT.map((it, idx) => (
                  <div key={it.n} className={mt ? "fu" : ""} style={{
                    background: "rgba(255,255,255,0.4)", padding: "12px 8px", borderRadius: 14,
                    border: "1px solid rgba(0,0,0,0.04)", display: "flex", flexDirection: "column",
                    alignItems: "center", textAlign: "center", filter: "grayscale(50%)", opacity: 0.5,
                    animationDelay: (600 + idx * 20) + "ms",
                  }}>
                    <span style={{ fontSize: 24, marginBottom: 4 }}>{it.e}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: ink }}>{it.n}</span>
                    <span style={{ fontSize: 9, color: mu, fontWeight: 600 }}>{it.tipo === "verdura" ? "Verdura" : "Fruta"}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(45,106,79,0.08)", padding: "40px 20px", textAlign: "center", background: cr }}>
        <img src={LOGO} alt="DeTemporada" style={{ height: 28, objectFit: "contain", marginBottom: 10 }} onError={e => { e.target.style.display = "none"; }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: g }}>DeTemporada</span>
        </div>
        <p style={{ fontSize: 11, color: mu, margin: 0, fontWeight: 500 }}>{"Un bono de Kooki · kookiapp.com"}</p>
      </footer>
    </div>
  );
}
