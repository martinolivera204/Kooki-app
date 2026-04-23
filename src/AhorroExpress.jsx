import { useState, useMemo, useEffect } from "react";

const AHORROEXPRESS_LOGO = "https://cdn.shopify.com/s/files/1/0983/2857/6366/files/AhorroExpresssin_fondo.png?v=1776911049";

const CATS = [
  { k:"super", l:"Súper", e:"🛒", c:"#FFE600", cL:"rgba(255,230,0,0.15)" },
  { k:"verdu", l:"Verdulería", e:"🥬", c:"#34D399", cL:"rgba(52,211,153,0.15)" },
  { k:"hogar", l:"Hogar", e:"🏠", c:"#60A5FA", cL:"rgba(96,165,250,0.15)" },
  { k:"delivery", l:"Delivery", e:"🍽️", c:"#FB923C", cL:"rgba(251,146,60,0.15)" },
  { k:"tarjetas", l:"Tarjetas", e:"💳", c:"#F472B6", cL:"rgba(244,114,182,0.15)" },
  { k:"compras", l:"Compras", e:"🛍️", c:"#E879F9", cL:"rgba(232,121,249,0.15)" },
  { k:"mascotas", l:"Mascotas", e:"🐾", c:"#FBBF24", cL:"rgba(251,191,36,0.15)" },
  { k:"servicios", l:"Servicios", e:"📱", c:"#38BDF8", cL:"rgba(56,189,248,0.15)" },
  { k:"transporte", l:"Transporte", e:"🚌", c:"#4ADE80", cL:"rgba(74,222,128,0.15)" },
  { k:"salud", l:"Salud", e:"💊", c:"#F87171", cL:"rgba(248,113,113,0.15)" },
  { k:"otros", l:"Otros", e:"📦", c:"#A78BFA", cL:"rgba(167,139,250,0.15)" },
];
const catMap = Object.fromEntries(CATS.map(c => [c.k, c]));
const MN = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function fmt(n) { return "$" + Math.round(n).toLocaleString("es-AR"); }
function pct(a, b) { return b > 0 ? Math.round((a / b) * 100) : 0; }

const hoy = new Date();
const mesActual = hoy.getMonth();
const diaHoy = hoy.getDate();

function mkSample() {
  let id = 1;
  const data = [];
  const items = [
    { cat:"super", desc:"Coto" }, { cat:"super", desc:"Carrefour" },
    { cat:"verdu", desc:"Verdulería del barrio" }, { cat:"delivery", desc:"PedidosYa" },
    { cat:"hogar", desc:"Ferretería" }, { cat:"tarjetas", desc:"Visa cuota" },
    { cat:"compras", desc:"Ropa hijos" }, { cat:"mascotas", desc:"Veterinaria" },
    { cat:"servicios", desc:"Luz + Gas" }, { cat:"transporte", desc:"SUBE + nafta" },
    { cat:"salud", desc:"Farmacia" }, { cat:"otros", desc:"Librería" },
  ];
  for (let offset = 5; offset >= 0; offset--) {
    const m = mesActual - offset;
    items.forEach((it, i) => {
      const monto = 3000 + Math.floor(Math.random() * 15000);
      data.push({ id: id++, monto, cat: it.cat, desc: it.desc, dia: Math.max(1, 28 - i * 2), mes: m });
    });
  }
  return data;
}

let nextId = 500;
const F = "'Plus Jakarta Sans',sans-serif";
const ACCESS_KEY = "kooki_access_v1";
const CHECKOUT_URL = "https://impulsoebooks.online/cart/53627712930158:1";

export default function AhorroExpress() {
  const [gastos, setGastos] = useState(() => []);
  const [showForm, setShowForm] = useState(false);
  const [monto, setMonto] = useState("");
  const [catSel, setCatSel] = useState("super");
  const [desc, setDesc] = useState("");
  const [filtro, setFiltro] = useState("todo");
  const [presupuesto, setPresupuesto] = useState(200000);
  const [editPres, setEditPres] = useState(false);
  const [presInput, setPresInput] = useState("200000");
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState([]);

  const premium = (() => { try { return !!localStorage.getItem(ACCESS_KEY); } catch(e) { return false; } })();

  useEffect(() => { setMounted(true); }, []);

  if (!premium) {
    return (
      <div style={{ background: "#0A0A0F", minHeight: "100vh", fontFamily: F, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <img src={AHORROEXPRESS_LOGO} alt="AhorroExpress" style={{ height: 100, objectFit: "contain", marginBottom: 24 }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, letterSpacing: "-0.03em" }}>Contenido <span style={{ color: "#FFE600" }}>Premium</span></h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 28 }}>AhorroExpress es exclusivo para usuarios Premium de Kooki. Desbloqueá todas las herramientas con un único pago.</p>
          <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 32px", borderRadius: 14, background: "#FFE600", color: "#0A0A0F", fontSize: 16, fontWeight: 700, textDecoration: "none", marginBottom: 16 }}>Quiero Premium · $20.900</a>
          <br />
          <a href="/" style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", fontWeight: 600, textDecoration: "none" }}>← Volver a Kooki</a>
        </div>
      </div>
    );
  }

  function datosMes(m) {
    const g = gastos.filter(x => x.mes === m);
    const total = g.reduce((s, x) => s + x.monto, 0);
    const pc = {};
    CATS.forEach(c => { pc[c.k] = 0; });
    g.forEach(x => { pc[x.cat] = (pc[x.cat] || 0) + x.monto; });
    return { gastos: g, total, porCat: pc };
  }

  const actual = useMemo(() => datosMes(mesActual), [gastos]);
  const prev = useMemo(() => datosMes(mesActual - 1), [gastos]);
  const diff = prev.total > 0 ? Math.round(((actual.total - prev.total) / prev.total) * 100) : 0;
  const restante = presupuesto - actual.total;
  const pctUsado = pct(actual.total, presupuesto);
  const totalParaBar = Math.max(actual.total, 1);

  const historial = useMemo(() => {
    const h = [];
    for (let i = 5; i >= 0; i--) {
      const m = mesActual - i;
      const d = datosMes(m);
      h.push({ mes: m, nombre: MN[m < 0 ? m + 12 : m], total: d.total });
    }
    return h;
  }, [gastos]);
  const maxHist = Math.max(...historial.map(h => h.total), 1);

  const alertas = useMemo(() => {
    const a = [];
    if (pctUsado >= 100) a.push({ id:"over", tipo:"danger", icon:"🚨", msg:"Superaste tu presupuesto de " + fmt(presupuesto) + ". Gastaste " + fmt(Math.abs(restante)) + " de más." });
    else if (pctUsado >= 80) a.push({ id:"warn", tipo:"warning", icon:"⚠️", msg:"Ya usaste el " + pctUsado + "% de tu presupuesto. Te quedan " + fmt(restante) + "." });
    CATS.forEach(cat => {
      const p = pct(actual.porCat[cat.k], actual.total);
      if (p > 35 && actual.porCat[cat.k] > 20000) {
        a.push({ id:"cat-" + cat.k, tipo:"info", icon: cat.e, msg: cat.l + " representa el " + p + "% de tu gasto total. Revisá si podés reducirlo." });
      }
    });
    if (actual.porCat.delivery > (prev.porCat?.delivery || 0) * 1.3 && actual.porCat.delivery > 5000) {
      a.push({ id:"deliv", tipo:"warning", icon:"🍽️", msg:"Delivery subió mucho vs el mes pasado. Cocinar en casa ahorra hasta 60%." });
    }
    return a.filter(x => !dismissed.includes(x.id));
  }, [gastos, presupuesto, dismissed]);

  const tips = useMemo(() => {
    const t = [];
    const sorted = [...CATS].sort((a, b) => actual.porCat[b.k] - actual.porCat[a.k]);
    const top = sorted[0];
    if (top && actual.porCat[top.k] > 0) t.push("Tu mayor gasto es " + top.e + " " + top.l + " (" + fmt(actual.porCat[top.k]) + "). Buscá ofertas o comprá en cantidad.");
    if (actual.porCat.delivery > actual.total * 0.12) t.push("Delivery es más del 12% de tu gasto. Cocinando más en casa ahorrás ~" + fmt(Math.round(actual.porCat.delivery * 0.4)) + "/mes.");
    if (actual.porCat.tarjetas > actual.total * 0.2) t.push("Tarjetas se lleva " + pct(actual.porCat.tarjetas, actual.total) + "% de tu plata. Revisá si podés cancelar cuotas o refinanciar.");
    if (restante > 0 && restante < presupuesto * 0.3) {
      const dias = Math.max(30 - diaHoy, 1);
      t.push("Te quedan " + fmt(restante) + " para " + dias + " días. Eso es ~" + fmt(Math.round(restante / dias)) + " por día.");
    }
    if (diff > 10) t.push("Vas " + diff + "% arriba vs " + MESES[mesActual - 1 < 0 ? 11 : mesActual - 1].toLowerCase() + ". Revisá gastos que puedas postergar.");
    else if (diff < -5) t.push("Vas " + Math.abs(diff) + "% abajo vs el mes pasado. Buen ritmo, seguí así.");
    t.push("Registrá gastos apenas llegás a casa. 5 min/día = control total.");
    return t.slice(0, 3);
  }, [gastos, presupuesto]);

  const lista = useMemo(() => {
    let l = [...actual.gastos].sort((a, b) => b.dia - a.dia);
    if (filtro !== "todo") l = l.filter(g => g.cat === filtro);
    return l.slice(0, 12);
  }, [actual.gastos, filtro]);

  function agregar() {
    const m = parseInt(monto);
    if (!m || m <= 0) return;
    setGastos([{ id: nextId++, monto: m, cat: catSel, desc: desc || catMap[catSel].l, dia: diaHoy, mes: mesActual }, ...gastos]);
    setMonto(""); setDesc(""); setShowForm(false);
  }
  function borrar(id) { setGastos(gastos.filter(g => g.id !== id)); }
  function labelDia(d) {
    if (d === diaHoy) return "Hoy";
    if (d === diaHoy - 1) return "Ayer";
    return d + " " + MESES[mesActual].slice(0, 3);
  }
  function guardarPres() {
    const v = parseInt(presInput);
    if (v && v > 0) setPresupuesto(v);
    setEditPres(false);
  }

  const mesAntNom = MESES[mesActual - 1 < 0 ? 11 : mesActual - 1];
  const bg = "#0A0A0F"; const sf = "#12121A"; const sf2 = "#1A1A25";
  const brd = "rgba(255,255,255,0.06)"; const w = "#FFFFFF";
  const mu = "rgba(255,255,255,0.45)"; const mu2 = "rgba(255,255,255,0.6)";
  const yel = "#FFE600";

  const css = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideDown{from{opacity:0;max-height:0}to{opacity:1;max-height:800px}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
.fu{animation:fadeUp .5s ease both}
.sd{animation:slideDown .3s ease both;overflow:hidden}
.no-sb::-webkit-scrollbar{display:none}.no-sb{-ms-overflow-style:none;scrollbar-width:none}`;

  const ringPct = Math.min(pctUsado, 100);
  const ringDeg = (ringPct / 100) * 360;
  const ringColor = pctUsado >= 100 ? "#F87171" : pctUsado >= 80 ? "#FB923C" : yel;

  // Categorías ordenadas por monto (desc) para distribución
  const catsSorted = useMemo(() => {
    return [...CATS].sort((a, b) => actual.porCat[b.k] - actual.porCat[a.k]).filter(c => actual.porCat[c.k] > 0);
  }, [actual.porCat]);

  return (
    <div style={{ background: bg, minHeight: "100vh", fontFamily: F, color: w, WebkitFontSmoothing: "antialiased", paddingBottom: 40 }}>
      <style>{css}</style>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, background: "radial-gradient(circle, rgba(255,230,0,0.06), transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -100, left: -200, width: 500, height: 500, background: "radial-gradient(circle, rgba(96,165,250,0.04), transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      <header style={{ position: "sticky", top: 0, zIndex: 50, background: bg + "ee", backdropFilter: "blur(16px)", borderBottom: "1px solid " + brd }}>
        <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={AHORROEXPRESS_LOGO} alt="AhorroExpress" style={{ height: 44, objectFit: "contain" }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: mu, letterSpacing: "0.06em", textTransform: "uppercase" }}>{MESES[mesActual]}</span>
        </div>
      </header>

      <main style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", padding: "20px 20px 0" }}>

        {/* Hero */}
        <section className={mounted ? "fu" : ""} style={{ background: "linear-gradient(135deg, " + sf + ", " + sf2 + ")", borderRadius: 20, padding: "24px 20px", marginBottom: 16, border: "1px solid " + brd }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: yel, animation: "pulse 2s ease infinite" }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: mu, textTransform: "uppercase", letterSpacing: "0.1em" }}>{"Gasto del mes"}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: diff <= 0 ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)", color: diff <= 0 ? "#34D399" : "#F87171" }}>
                  {(diff <= 0 ? diff : "+" + diff) + "%"}
                </span>
              </div>
              <h2 style={{ fontWeight: 800, fontSize: "clamp(32px, 9vw, 44px)", letterSpacing: "-0.04em", margin: "0 0 4px", lineHeight: 1 }}>{fmt(actual.total)}</h2>
              <p style={{ fontSize: 12, color: mu, margin: 0, fontWeight: 500 }}>{"de " + fmt(presupuesto) + " presupuestado"}</p>
            </div>
            <div style={{ width: 100, height: 100, borderRadius: "50%", position: "relative", background: "conic-gradient(" + ringColor + " " + ringDeg + "deg, rgba(255,255,255,0.06) " + ringDeg + "deg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: sf, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontWeight: 800, fontSize: 20, color: pctUsado >= 100 ? "#F87171" : w, letterSpacing: "-0.03em" }}>{pctUsado + "%"}</span>
                <span style={{ fontSize: 9, color: mu, fontWeight: 600 }}>usado</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, padding: "12px 14px", background: restante > 0 ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: restante > 0 ? "#34D399" : "#F87171" }}>
              {restante > 0 ? "Te quedan " + fmt(restante) : "Te pasaste " + fmt(Math.abs(restante))}
            </span>
            <button onClick={() => { setEditPres(!editPres); setPresInput(String(presupuesto)); }} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: mu2, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 8, cursor: "pointer" }}>
              {editPres ? "Cancelar" : "Editar"}
            </button>
          </div>

          {editPres && (
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <input type="number" value={presInput} onChange={e => setPresInput(e.target.value)} style={{ flex: 1, padding: "10px 14px", fontFamily: F, fontWeight: 700, fontSize: 16, background: sf2, border: "1px solid " + brd, borderRadius: 10, color: w, outline: "none", boxSizing: "border-box" }} />
              <button onClick={guardarPres} style={{ padding: "10px 18px", background: yel, color: bg, fontWeight: 700, fontSize: 13, borderRadius: 10, border: "none", cursor: "pointer" }}>OK</button>
            </div>
          )}

          <div className="no-sb" style={{ display: "flex", gap: 8, marginTop: 16, overflowX: "auto", paddingBottom: 4 }}>
            {CATS.filter(c => actual.porCat[c.k] > 0).slice(0, 5).map(cat => (
              <div key={cat.k} style={{ display: "flex", alignItems: "center", gap: 6, background: cat.cL, borderRadius: 100, padding: "5px 12px 5px 8px", flexShrink: 0 }}>
                <span style={{ fontSize: 13 }}>{cat.e}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: cat.c, whiteSpace: "nowrap" }}>{fmt(actual.porCat[cat.k])}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Alertas */}
        {alertas.length > 0 && (
          <section className={mounted ? "fu" : ""} style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16, animationDelay: "60ms" }}>
            {alertas.map(a => (
              <div key={a.id} style={{
                background: a.tipo === "danger" ? "rgba(248,113,113,0.1)" : a.tipo === "warning" ? "rgba(251,146,60,0.1)" : "rgba(96,165,250,0.08)",
                border: "1px solid " + (a.tipo === "danger" ? "rgba(248,113,113,0.2)" : a.tipo === "warning" ? "rgba(251,146,60,0.2)" : "rgba(96,165,250,0.15)"),
                borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{a.icon}</span>
                <p style={{ fontSize: 13, color: mu2, margin: 0, flex: 1, lineHeight: 1.4 }}>{a.msg}</p>
                <button onClick={() => setDismissed([...dismissed, a.id])} style={{ background: "none", border: "none", color: mu, cursor: "pointer", fontSize: 14, padding: 0, flexShrink: 0 }}>{"✕"}</button>
              </div>
            ))}
          </section>
        )}

        {/* Add */}
        <section className={mounted ? "fu" : ""} style={{ marginBottom: 16, animationDelay: "120ms" }}>
          <button onClick={() => setShowForm(!showForm)} style={{
            width: "100%", background: showForm ? sf2 : "linear-gradient(135deg, " + yel + ", #FFC800)",
            color: showForm ? mu2 : bg, fontWeight: 800, fontSize: 15, padding: "16px 0",
            borderRadius: 14, border: showForm ? "1px solid " + brd : "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: showForm ? "none" : "0 4px 20px rgba(255,230,0,0.2), 0 0 0 1px rgba(255,230,0,0.3)",
            transition: "all 0.3s",
          }}>
            <span style={{ fontSize: 18, transition: "transform 0.3s", transform: showForm ? "rotate(45deg)" : "none" }}>{"+"}</span>
            {showForm ? "Cancelar" : "Agregar gasto"}
          </button>

          {showForm && (
            <div className="sd" style={{ background: sf, borderRadius: 16, border: "1px solid " + brd, padding: 20, marginTop: 10 }}>
              <div style={{ position: "relative", marginBottom: 14 }}>
                <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontWeight: 800, fontSize: 28, color: yel }}>$</span>
                <input type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder="0"
                  style={{ width: "100%", paddingLeft: 44, paddingRight: 16, paddingTop: 16, paddingBottom: 16, fontFamily: F, fontWeight: 800, fontSize: 28, background: sf2, border: "1px solid " + brd, borderRadius: 12, color: w, outline: "none", boxSizing: "border-box", letterSpacing: "-0.02em" }} />
              </div>
              <div className="no-sb" style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14, maxHeight: 120, overflowY: "auto" }}>
                {CATS.map(cat => (
                  <button key={cat.k} onClick={() => setCatSel(cat.k)} style={{
                    padding: "7px 12px", borderRadius: 10, fontSize: 11, fontWeight: 700,
                    border: catSel === cat.k ? "2px solid " + cat.c : "1px solid " + brd,
                    background: catSel === cat.k ? cat.cL : "transparent", color: catSel === cat.k ? cat.c : mu2, cursor: "pointer",
                  }}>{cat.e + " " + cat.l}</button>
                ))}
              </div>
              <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder={"Descripción (opcional)"}
                style={{ width: "100%", padding: "12px 16px", fontFamily: F, fontSize: 14, background: sf2, border: "1px solid " + brd, borderRadius: 10, color: w, outline: "none", marginBottom: 14, boxSizing: "border-box" }} />
              <button onClick={agregar} style={{ width: "100%", background: "linear-gradient(135deg, " + yel + ", #FFC800)", color: bg, fontWeight: 800, fontSize: 15, padding: "14px 0", borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(255,230,0,0.2)" }}>{"Guardar"}</button>
            </div>
          )}
        </section>

        {/* Distribución - ordenada por monto */}
        <section className={mounted ? "fu" : ""} style={{ background: sf, borderRadius: 16, border: "1px solid " + brd, padding: 20, marginBottom: 16, animationDelay: "180ms" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>{"Distribución"}</h3>
            <span style={{ fontSize: 11, color: mu, fontWeight: 500 }}>{catsSorted.length + " categorías"}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {catsSorted.map(cat => {
              const p = totalParaBar > 0 ? (actual.porCat[cat.k] / totalParaBar) * 100 : 0;
              const pcTotal = pct(actual.porCat[cat.k], actual.total);
              return (
                <div key={cat.k}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 15 }}>{cat.e}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: mu2 }}>{cat.l}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: mu, background: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: 4 }}>{pcTotal + "%"}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{fmt(actual.porCat[cat.k])}</span>
                  </div>
                  <div style={{ height: 6, width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: 100, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: p + "%", background: "linear-gradient(90deg, " + cat.c + ", " + cat.c + "88)", borderRadius: 100, transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Historial */}
        <section className={mounted ? "fu" : ""} style={{ background: sf, borderRadius: 16, border: "1px solid " + brd, padding: 20, marginBottom: 16, animationDelay: "240ms" }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, margin: "0 0 18px" }}>{"Tendencia"}</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
            {historial.map((h, i) => {
              const barH = Math.max((h.total / maxHist) * 100, 4);
              const isA = h.mes === mesActual;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: isA ? yel : mu }}>{(h.total / 1000).toFixed(0) + "k"}</span>
                  <div style={{ width: "100%", height: barH, borderRadius: 6, background: isA ? "linear-gradient(180deg, " + yel + ", #FFA500)" : "rgba(255,255,255,0.08)", transition: "height 0.5s ease" }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: isA ? yel : mu }}>{h.nombre}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Gastos recientes */}
        <section className={mounted ? "fu" : ""} style={{ marginBottom: 16, animationDelay: "300ms" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>{"Gastos recientes"}</h3>
            <span style={{ fontSize: 11, color: mu, fontWeight: 500 }}>{actual.gastos.length + " este mes"}</span>
          </div>
          <div className="no-sb" style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto" }}>
            <button onClick={() => setFiltro("todo")} style={{ padding: "6px 14px", borderRadius: 100, border: "none", flexShrink: 0, background: filtro === "todo" ? "rgba(255,255,255,0.1)" : "transparent", color: filtro === "todo" ? w : mu, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Todo</button>
            {CATS.map(cat => (
              <button key={cat.k} onClick={() => setFiltro(cat.k)} style={{ padding: "6px 12px", borderRadius: 100, border: "none", flexShrink: 0, background: filtro === cat.k ? cat.cL : "transparent", color: filtro === cat.k ? cat.c : mu, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>{cat.e}</button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {lista.length === 0 && <div style={{ textAlign: "center", padding: 32, color: mu, fontSize: 13 }}>{"Sin gastos en esta categoría"}</div>}
            {lista.map((g, idx) => (
              <div key={g.id} className={mounted ? "fu" : ""} style={{
                background: sf, borderRadius: 14, border: "1px solid " + brd, padding: "14px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between", animationDelay: (360 + idx * 40) + "ms",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: catMap[g.cat]?.cL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{catMap[g.cat]?.e}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{g.desc}</p>
                    <p style={{ fontSize: 11, color: mu, margin: "2px 0 0", fontWeight: 500 }}>{labelDia(g.dia) + " · " + catMap[g.cat]?.l}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em" }}>{fmt(g.monto)}</span>
                  <button onClick={() => borrar(g.id)} style={{ background: "none", border: "none", color: "#F87171", opacity: 0.3, cursor: "pointer", fontSize: 16, padding: 0 }}>{"✕"}</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className={mounted ? "fu" : ""} style={{ background: "linear-gradient(135deg, rgba(255,230,0,0.08), rgba(255,200,0,0.03))", borderRadius: 16, border: "1px solid rgba(255,230,0,0.12)", padding: "18px 20px", marginBottom: 16, animationDelay: "420ms" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, " + yel + ", #FFA500)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{"⚡"}</div>
            <h4 style={{ fontWeight: 700, fontSize: 15, color: yel, margin: 0 }}>{"Tips para vos"}</h4>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tips.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: 11, color: yel, fontWeight: 800, marginTop: 2, flexShrink: 0 }}>{"0" + (i + 1)}</span>
                <p style={{ fontSize: 13, color: mu2, margin: 0, lineHeight: 1.5 }}>{t}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className={mounted ? "fu" : ""} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16, animationDelay: "480ms" }}>
          <div style={{ background: sf, borderRadius: 14, border: "1px solid " + brd, padding: "16px 14px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, " + yel + ", #FFC800)" }} />
            <p style={{ fontSize: 11, fontWeight: 600, color: mu, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{MESES[mesActual]}</p>
            <p style={{ fontWeight: 800, fontSize: 20, margin: 0, letterSpacing: "-0.02em" }}>{fmt(actual.total)}</p>
          </div>
          <div style={{ background: sf, borderRadius: 14, border: "1px solid " + brd, padding: "16px 14px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.1)" }} />
            <p style={{ fontSize: 11, fontWeight: 600, color: mu, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{mesAntNom}</p>
            <p style={{ fontWeight: 800, fontSize: 20, margin: 0, color: mu2, letterSpacing: "-0.02em" }}>{fmt(prev.total)}</p>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ textAlign: "center", padding: "32px 0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
            <img src={AHORROEXPRESS_LOGO} alt="AhorroExpress" style={{ height: 40, objectFit: "contain" }} />
          </div>
          <p style={{ fontSize: 11, color: mu, margin: 0, fontWeight: 500 }}>{"Un bono de Kooki · kookiapp.com"}</p>
        </footer>
      </main>
    </div>
  );
}
