import { useState, useEffect, useRef } from "react";

const VALID_CODES = new Set(['KOOKI-9K2X-W5NR']);
const ACCESS_KEY = "kooki_access_v1";
const HISTORY_KEY = "kooki_history_v1";
const HISTORY_DAYS = 7;
const HISTORY_MAX = 20;
const CHECKOUT_URL = "https://impulsoebooks.online/cart/53627712930158:1";
const DETEMPORADA_LOGO = "https://cdn.shopify.com/s/files/1/0983/2857/6366/files/DeTempradasi_SINFONDO.png?v=1776961426";
const AHORROEXPRESS_LOGO = "https://cdn.shopify.com/s/files/1/0983/2857/6366/files/AhorroExpresssin_fondo.png?v=1776961413";

// ============================================
// META PIXEL
// ============================================
const PIXEL_ID = '1221666853017936';

function initPixel() {
  if (window.fbq) return;
  (function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
}

function trackEvent(event, data) {
  if (window.fbq) window.fbq('track', event, data);
}

function isPremium() {
  try { return !!localStorage.getItem(ACCESS_KEY); } catch(e) { return false; }
}

// ============================================
// SISTEMA DE DISEÑO (alineado con landing v3.9)
// ============================================
const C = {
  blue: "#3B6FD4", blueDk: "#0066CC", blueMd: "#5B8AE8",
  blueLt: "#EEF3FC", bluePl: "#D6E4FA", blueGlow: "#8BA8E0",
  white: "#FFFFFF", bg: "#F5F5F7", bgSoft: "#EAEAEE",
  gray1: "#F0F3FA", gray2: "#E2E8F5", gray3: "#B8C5DE", gray4: "#7A8BAD",
  line: "#E5E7EB", dark: "#0A0E1A", ink: "#0A0E1A",
  text: "#1F2937", sub: "#6B7280", muted: "#6B7280",
  success: "#10B981", danger: "#EF4444", dangerLt: "#FEF2F2",
};
const sh = {
  sm: "0 1px 4px rgba(59,111,212,0.08)",
  md: "0 4px 16px rgba(59,111,212,0.12)",
  lg: "0 8px 32px rgba(59,111,212,0.16)",
  blue: "0 8px 28px rgba(59,111,212,0.38)",
  ink: "0 20px 40px rgba(10,14,26,0.25)",
};
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@500;600;700;800;900&family=Manrope:wght@400;500;600;700;800&family=Inter:wght@500;600;700&display=swap');`;
const ANIMS = `@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes slideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes chefBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes chefPulse{0%,100%{transform:scale(1);box-shadow:0 8px 28px rgba(59,111,212,0.38)}50%{transform:scale(1.12);box-shadow:0 12px 40px rgba(59,111,212,0.6)}}@keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}@keyframes dotPulse{0%,80%,100%{opacity:0.3;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}@keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.4)}}@keyframes floatPhone{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`;
const BASE = `${FONTS} *{box-sizing:border-box;margin:0;padding:0;} body{margin:0;font-family:'Manrope',sans-serif;-webkit-font-smoothing:antialiased;} button:focus,textarea:focus,input:focus{outline:none;} ${ANIMS}`;

// ============================================
// COMPONENTES VISUALES BASE
// ============================================
function BgGrid({ dark = false }) {
  const lc = dark ? "rgba(255,255,255,0.04)" : "rgba(10,14,26,0.04)";
  return (<div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none", backgroundImage:`linear-gradient(to right,${lc} 1px,transparent 1px),linear-gradient(to bottom,${lc} 1px,transparent 1px)`, backgroundSize:"60px 60px" }} />);
}
function Blob({ pos = "tr", color = "rgba(59,111,212,0.18)", size = 500 }) {
  const positions = { tr:{top:-180,right:-150}, tl:{top:-180,left:-150}, br:{bottom:-180,right:-150}, bl:{bottom:-180,left:-150} };
  return (<div style={{ position:"absolute", zIndex:0, pointerEvents:"none", width:size, height:size, borderRadius:"50%", background:`radial-gradient(circle at center,${color},transparent 70%)`, filter:"blur(50px)", ...positions[pos] }} />);
}
function Eyebrow({ children, dark = false, center = false }) {
  const color = dark ? C.blueGlow : C.blue;
  return (<span style={{ display:"inline-flex", alignItems:"center", gap:10, fontSize:12, fontWeight:600, color, textTransform:"uppercase", letterSpacing:"0.14em", fontFamily:"'Inter',sans-serif", ...(center?{justifyContent:"center"}:{}) }}>
    <span style={{ width:24, height:2, background:color, display:"inline-block", flexShrink:0 }} />{children}
  </span>);
}
function KookiLogo({ size = 28, dark = false }) {
  return (<span style={{ fontWeight:900, fontSize:size, color:dark?C.white:C.blue, letterSpacing:"-0.035em", lineHeight:1, fontFamily:"'Epilogue',sans-serif" }}>Kooki</span>);
}
function Tag({ children, color=C.blue, bg=C.blueLt }) {
  return <span style={{ background:bg, color, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700, display:"inline-block", lineHeight:1.5, fontFamily:"'Inter',sans-serif" }}>{children}</span>;
}
function ChefHat({ size=24, color="#FFFFFF" }) {
  return (<svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 38c-5 0-9-4-9-9s4-9 9-9c0-6 5-11 11-11 4 0 7 2 9 5 2-3 5-5 9-5 6 0 11 5 11 11 5 0 9 4 9 9s-4 9-9 9v0H16v0z" fill={color}/><path d="M16 38h32v12c0 2-2 4-4 4H20c-2 0-4-2-4-4V38z" fill={color}/><path d="M16 42h32" stroke="#0A0E1A" strokeWidth="1.5" strokeLinecap="round" opacity="0.25"/></svg>);
}
const TAG_COLORS = {
  "💚 Desinflamatorio":{bg:"#F0FDF4",color:"#16A34A"},
  "💪 Alta proteina":{bg:"#FFF7ED",color:"#EA580C"},
  "⚡ Express":{bg:"#FFFBEB",color:"#D97706"},
  "⚡ Rapido":{bg:"#FFFBEB",color:"#D97706"},
  "⚡ Rendidor":{bg:"#EFF6FF",color:C.blue},
  "🔥 Bajo en calorias":{bg:"#FEF2F2",color:"#DC2626"},
  "💰 Economico":{bg:"#F0FDF4",color:"#15803D"},
  "🌿 Vegetariana":{bg:"#F0FDF4",color:"#16A34A"},
  "🌿 Vegetariano":{bg:"#F0FDF4",color:"#16A34A"},
  "📦 Batch cooking":{bg:"#F5F3FF",color:"#7C3AED"},
};
function MealTag({ label }) {
  const s = TAG_COLORS[label] || { bg:C.blueLt, color:C.blue };
  return <Tag bg={s.bg} color={s.color}>{label}</Tag>;
}

// ============================================
// COMPONENTE NUEVO: TABLA COMPARATIVA GRATIS VS PREMIUM
// ============================================
function ComparisonTable() {
  const features = [
    { name: "¿Qué cocino hoy?", free: "1 por día", premium: "Ilimitado" },
    { name: "Personalización completa", free: true, premium: true },
    { name: "Cambiar receta 🔄", free: true, premium: true },
    { name: 'Filtro "qué tengo"', free: true, premium: true },
    { name: 'Filtro "qué no como"', free: true, premium: true },
    { name: "Ingredientes", free: true, premium: true },
    { name: "Pasos de la receta", free: false, premium: true },
    { name: "Modo Cocina", free: false, premium: true },
    { name: "Menú semanal 7 días", free: false, premium: true },
    { name: "Lista de compras", free: false, premium: true },
    { name: "Chef asistente IA", free: false, premium: true },
    { name: "Compartir WhatsApp / CSV", free: false, premium: true },
    { name: "DeTemporada", logo: DETEMPORADA_LOGO, free: false, premium: true },
    { name: "AhorroExpress", logo: AHORROEXPRESS_LOGO, free: false, premium: true },
  ];

  const Check = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  );
  const Cross = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gray3} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  );

  return (
    <div style={{ background: C.white, borderRadius: 20, overflow: "hidden", boxShadow: sh.md, border: `1px solid ${C.line}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 72px 80px", padding: "14px 18px", borderBottom: `1.5px solid ${C.line}`, background: C.bg }}>
        <div />
        <div style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: C.sub, fontFamily: "'Inter',sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Gratis</div>
        <div style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: C.blue, fontFamily: "'Inter',sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Premium</div>
      </div>
      {features.map((f, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 72px 80px", padding: f.logo ? "10px 18px" : "13px 18px", borderBottom: i < features.length - 1 ? `1px solid ${C.line}` : "none", alignItems: "center" }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, fontFamily: "'Manrope',sans-serif" }}>
            {f.logo ? <img src={f.logo} alt={f.name} style={{ height: 28, objectFit: "contain", display: "block" }} /> : f.name}
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {f.free === true ? <Check /> : f.free === false ? <Cross /> : (
              <span style={{ fontSize: 10.5, fontWeight: 700, color: C.sub, fontFamily: "'Inter',sans-serif", textAlign: "center", lineHeight: 1.2 }}>{f.free}</span>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {f.premium === true ? <Check /> : (
              <span style={{ fontSize: 10.5, fontWeight: 700, color: C.blue, fontFamily: "'Inter',sans-serif", textAlign: "center", lineHeight: 1.2 }}>{f.premium}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// PANTALLA DE ACCESO — obligatoria, con ecosistema
// ============================================
function AccessScreen({ onAccess }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const handleSubmit = () => {
    const clean = code.trim().toUpperCase();
    if (!clean) { setError("Ingresa tu codigo de acceso"); return; }
    setLoading(true);
    setTimeout(() => {
      if (VALID_CODES.has(clean)) {
        try { localStorage.setItem(ACCESS_KEY, clean); } catch(e) {}
        try {
          const d = /iPhone|iPad|iPod/.test(navigator.userAgent) ? "iPhone/iPad" : /Android/.test(navigator.userAgent) ? "Android" : /Mac/.test(navigator.userAgent) ? "Mac" : "Otro";
          fetch("https://script.google.com/macros/s/AKfycbzFrGcUV85aOdGtuJ62BJu2qSa0SHI6vMQxnKs009DuP1v_VOTglEc9lG1-I739bvve/exec?codigo=" + encodeURIComponent(clean) + "&dispositivo=" + encodeURIComponent(d));
        } catch(e) {}
        setLoading(false); onAccess();
      } else {
        setLoading(false);
        setError("Codigo invalido. Revisa el email que recibiste al comprar.");
        setShake(true); setTimeout(() => setShake(false), 600);
      }
    }, 600);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 24px", fontFamily:"'Manrope',sans-serif", position:"relative", overflow:"hidden" }}>
      <style>{BASE}</style>
      <BgGrid /><Blob pos="tr" /><Blob pos="bl" color="rgba(0,102,204,0.13)" />
      <div style={{ width:"100%", maxWidth:400, animation:"fadeIn 0.4s ease", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <img src="https://i.imgur.com/IYcv1Vp.jpeg" alt="Kooki" style={{ width:140, marginBottom:20 }}/>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}><Eyebrow>Ecosistema Kooki</Eyebrow></div>
          <p style={{ fontSize:15, color:C.sub, fontWeight:500, lineHeight:1.5, marginBottom:20 }}>
            3 apps con IA para tu cocina y tu bolsillo.
          </p>
          {/* 3 logos del ecosistema */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, marginBottom:8 }}>
            <div style={{ background:C.white, borderRadius:16, border:`1.5px solid ${C.line}`, padding:"12px 16px", boxShadow:sh.sm, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <img src="https://cdn.shopify.com/s/files/1/0983/2857/6366/files/Copia_de_logo_sin_fondo.png?v=1776974240" alt="Kooki" style={{ height:32, objectFit:"contain" }} />
            </div>
            <div style={{ background:C.white, borderRadius:16, border:`1.5px solid ${C.line}`, padding:"12px 16px", boxShadow:sh.sm, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <img src={DETEMPORADA_LOGO} alt="DeTemporada" style={{ height:32, objectFit:"contain" }} />
            </div>
            <div style={{ background:C.white, borderRadius:16, border:`1.5px solid ${C.line}`, padding:"12px 16px", boxShadow:sh.sm, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <img src={AHORROEXPRESS_LOGO} alt="AhorroExpress" style={{ height:32, objectFit:"contain" }} />
            </div>
          </div>
        </div>
        <div style={{ background:C.white, borderRadius:28, padding:"36px 32px", boxShadow:"0 20px 60px rgba(10,14,26,0.08)", border:`1px solid ${C.line}` }}>
          <h2 style={{ fontSize:28, fontWeight:900, color:C.ink, marginBottom:10, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.035em", lineHeight:1.05 }}>
            Ingresá tu <span style={{ color:C.blue, fontStyle:"italic", fontWeight:800 }}>código</span>.
          </h2>
          <div style={{ fontSize:15, color:C.sub, lineHeight:1.55, marginBottom:28, fontWeight:500 }}>Lo recibiste por email después de tu compra.</div>
          <div style={{ marginBottom:18, animation:shake?"shake 0.5s ease":"none" }}>
            <input type="text" value={code} onChange={e => { setCode(e.target.value.toUpperCase()); setError(""); }} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="KOOKI-XXXX-XXXX-XXXX"
              style={{ width:"100%", padding:"18px", borderRadius:14, fontSize:16, fontWeight:700, border:`2px solid ${error?C.danger:code?C.blue:C.line}`, background:error?C.dangerLt:C.bg, color:C.ink, fontFamily:"'Inter',sans-serif", letterSpacing:"1.5px", textAlign:"center", outline:"none", transition:"border-color 0.2s, background 0.2s" }}/>
            {error && <div style={{ fontSize:13, color:C.danger, marginTop:10, textAlign:"center", fontWeight:600 }}>{error}</div>}
          </div>
          <button onClick={handleSubmit} disabled={loading || !code.trim()}
            style={{ width:"100%", padding:"20px", borderRadius:16, border:"none", background:loading||!code.trim()?C.gray2:C.ink, color:loading||!code.trim()?C.gray4:C.white, fontSize:16, fontWeight:700, cursor:loading||!code.trim()?"not-allowed":"pointer", fontFamily:"'Inter',sans-serif", boxShadow:!loading&&code.trim()?sh.ink:"none", display:"flex", alignItems:"center", justifyContent:"center", gap:12, transition:"background 0.2s, transform 0.2s" }}
            onMouseEnter={e => { if (!loading && code.trim()) { e.currentTarget.style.background = C.blue; e.currentTarget.style.transform = "translateY(-2px)"; } }}
            onMouseLeave={e => { if (!loading && code.trim()) { e.currentTarget.style.background = C.ink; e.currentTarget.style.transform = "translateY(0)"; } }}>
            <span>{loading ? "Verificando..." : "Activar acceso"}</span>
            {!loading && code.trim() && (<span style={{ width:28, height:28, borderRadius:"50%", background:C.white, color:C.ink, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:700 }}>→</span>)}
          </button>
        </div>
        <div style={{ textAlign:"center", marginTop:24 }}>
          <div style={{ fontSize:14, color:C.sub, lineHeight:1.6, fontWeight:500 }}>
            ¿No tenés código?<br/><a href={CHECKOUT_URL} style={{ color:C.blue, fontWeight:700, textDecoration:"none" }}>Comprá Kooki acá →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DATA: STEPS (con num en lugar de emoji para tiempo/personas/nivel/presupuesto)
// ============================================
const STEPS = [
  { id:"objetivo", type:"objetivo", label:"Elegí lo que más te importa hoy", subtitle:"Podés seleccionar hasta 2 prioridades",
    options:[
      {value:"bajar_peso",emoji:"⚖️",label:"Bajar de peso",desc:"Déficit calórico inteligente"},
      {value:"saludable",emoji:"🥗",label:"Comer saludable",desc:"Nutrición completa y balanceada"},
      {value:"ahorrar",emoji:"💰",label:"Ahorrar dinero",desc:"Máximo rendimiento por peso"},
      {value:"masa",emoji:"💪",label:"Ganar masa muscular",desc:"Alta proteína y superávit"},
      {value:"organizar",emoji:"📅",label:"Organizarme mejor",desc:"Batch cooking sin estrés"},
    ]},
  { id:"dieta", type:"grid", label:"¿Seguís alguna dieta?", subtitle:"Podés combinar varias opciones",
    options:[
      {value:"libre",emoji:"🍽️",label:"Sin restricciones"},
      {value:"keto",emoji:"🥑",label:"Keto"},
      {value:"lowcarb",emoji:"🥦",label:"Low Carb"},
      {value:"vegetariana",emoji:"🌿",label:"Vegetariana"},
      {value:"vegana",emoji:"🌱",label:"Vegana"},
      {value:"singluten",emoji:"🌾",label:"Sin Gluten"},
      {value:"sinlactosa",emoji:"🥛",label:"Sin Lactosa"},
      {value:"desinflamatoria",emoji:"🫚",label:"Desinflamatoria"},
    ]},
  { id:"tiempo", type:"cards", label:"¿Cuánto tiempo tenés para cocinar?", subtitle:"Por comida, en promedio durante la semana",
    options:[
      {value:"rapido",num:"01",label:"Rápido",desc:"Menos de 15 minutos"},
      {value:"medio",num:"02",label:"Normal",desc:"Entre 15 y 30 minutos"},
      {value:"libre",num:"03",label:"Sin límite",desc:"Me gusta cocinar con calma"},
    ]},
  { id:"presupuesto", type:"semaforo", label:"¿Cuánto querés gastar en el súper?", subtitle:"Por semana, en pesos argentinos",
    options:[
      {value:"bajo",num:"$",label:"Ajustado",desc:"Máximo rendimiento por peso",color:"#10B981"},
      {value:"medio",num:"$$",label:"Moderado",desc:"Balance entre precio y calidad",color:"#F59E0B"},
      {value:"alto",num:"$$$",label:"Sin límite",desc:"Prefiero calidad ante todo",color:C.blue},
    ]},
  { id:"personas", type:"cards", label:"¿Para cuántas personas cocinás?", subtitle:"Ajustamos porciones e ingredientes automáticamente",
    options:[
      {value:"1",num:"01",label:"Solo/a",desc:"1 persona"},
      {value:"2",num:"02",label:"De a dos",desc:"2 personas"},
      {value:"familiar",num:"03+",label:"Familia",desc:"3 o más personas"},
    ]},
  { id:"nivel", type:"nivel", label:"¿Cómo te manejás en la cocina?", subtitle:"Adaptamos la complejidad de las recetas para vos",
    options:[
      {value:"basico",num:"01",label:"Básico",desc:"Recetas simples, paso a paso"},
      {value:"intermedio",num:"02",label:"Intermedio",desc:"Más variedad y técnicas"},
      {value:"avanzado",num:"03",label:"Avanzado",desc:"Creatividad y desafíos"},
    ]},
  { id:"extra", type:"extras", label:"Último paso", subtitle:"Opcional — para un resultado todavía más preciso" },
];
const R = {
  "Ensalada de pollo grillado y quinoa":{t:"20 min",d:"Facil",k:"380 kcal",p:"35g",e:"🥗",tags:["⚡ Rapido","💪 Alta proteina"],i:["150g pechuga de pollo","1/2 taza quinoa","Rucula y lechuga","Tomate cherry x8","Pepino 1/2","Jugo de limon","Aceite de oliva","Sal y pimienta"],s:["Cocinar la quinoa en agua con sal 15 min. Tapar y apagar.","Grillar la pechuga salpimentada 4 min por lado a fuego fuerte.","Dejar reposar el pollo 3 min antes de cortar en tiras.","Mezclar quinoa, hojas, tomate y pepino. Coronar con el pollo. Condimentar con limon y aceite."]},
  "Sopa de verduras con lentejas":{t:"30 min",d:"Facil",k:"290 kcal",p:"18g",e:"🥣",tags:["🔥 Bajo en calorias","💚 Desinflamatorio"],i:["1 taza lentejas rojas","1 zanahoria","1 cebolla","2 papas chicas","Caldo en cubo","Comino y sal","Limon"],s:["Picar cebolla y zanahoria. Rehogar 5 min en olla con aceite.","Agregar lentejas enjuagadas y papas en cubos. Cubrir con agua y caldo.","Cocinar 20 min a fuego medio.","Condimentar con comino, sal y limon al servir."]},
  "Wrap de atun con lechuga y tomate":{t:"10 min",d:"Facil",k:"320 kcal",p:"28g",e:"🌯",tags:["⚡ Express","💪 Alta proteina"],i:["1 lata atun al natural","1 tortilla integral","Lechuga","1 tomate","2 cdas yogur natural","Sal y limon"],s:["Escurrir el atun y mezclar con yogur, sal y limon.","Calentar la tortilla en sarten seca 30 segundos por lado.","Poner lechuga, tomate y la mezcla de atun.","Enrollar y cortar al medio en diagonal."]},
  "Revuelto de claras con espinaca":{t:"10 min",d:"Facil",k:"180 kcal",p:"22g",e:"🍳",tags:["⚡ Express","🔥 Bajo en calorias"],i:["4 claras de huevo","100g espinaca","1 diente ajo","Sal y pimienta","1 cdita aceite de oliva"],s:["Calentar aceite. Dorar el ajo laminado 1 min.","Agregar espinaca y saltear hasta marchitar.","Volcar las claras batidas con sal y pimienta.","Revolver suavemente a fuego medio-bajo hasta cuajar."]},
  "Pechuga al horno con vegetales asados":{t:"40 min",d:"Facil",k:"350 kcal",p:"42g",e:"🍗",tags:["💪 Alta proteina","💚 Desinflamatorio"],i:["1 pechuga 200g","1 zapallito","1 morron","1/2 berenjena","Ajo, romero, tomillo","Aceite de oliva","Sal y pimienta"],s:["Precalentar horno a 200C. Cortar vegetales en trozos.","Mezclar todo con aceite, ajo y hierbas en asadera.","Pechuga en el centro, vegetales alrededor.","Hornear 30-35 min hasta dorar."]},
  "Sopa crema de zapallo":{t:"30 min",d:"Facil",k:"160 kcal",p:"4g",e:"🎃",tags:["🔥 Bajo en calorias","💚 Desinflamatorio"],i:["800g zapallo","1 cebolla","1 papa","Caldo en cubo","200ml leche descremada","Sal, pimienta y nuez moscada"],s:["Rehogar cebolla 5 min. Agregar zapallo y papa en cubos.","Cubrir con agua y caldo. Cocinar 25 min.","Procesar con mixer hasta crema suave.","Agregar leche, calentar sin hervir. Condimentar."]},
  "Ensalada de garbanzos con pepino":{t:"10 min",d:"Facil",k:"280 kcal",p:"14g",e:"🥗",tags:["⚡ Express","💚 Desinflamatorio"],i:["1 lata garbanzos","1 pepino","Tomate cherry 200g","1/2 cebolla morada","Perejil","Limon y aceite de oliva","Sal"],s:["Escurrir y enjuagar los garbanzos.","Cortar pepino, tomate y cebolla.","Mezclar todo con perejil picado.","Condimentar con limon, aceite y sal."]},
  "Bowl de arroz integral con pollo":{t:"25 min",d:"Facil",k:"420 kcal",p:"38g",e:"🍚",tags:["💪 Alta proteina","⚡ Rendidor"],i:["1 taza arroz integral","150g pechuga","200g brocoli","Zanahoria rallada","Salsa de soja","Sesamo"],s:["Cocinar arroz integral 18-20 min tapado.","Grillar o hervir la pechuga. Desmenuzar.","Cocinar brocoli al vapor 5-6 min.","Armar el bowl y condimentar con soja."]},
  "Ensalada completa con atun":{t:"12 min",d:"Facil",k:"300 kcal",p:"26g",e:"🥗",tags:["⚡ Express","💪 Alta proteina"],i:["1 lata atun","Lechuga variada","2 tomates","2 huevos duros","Aceitunas","Aceite, vinagre y sal"],s:["Hervir los huevos 10 min. Enfriar y pelar.","Lavar y cortar las verduras.","Mezclar todo con el atun escurrido.","Condimentar con aceite, vinagre y sal."]},
  "Tortilla de claras y vegetales":{t:"15 min",d:"Facil",k:"200 kcal",p:"24g",e:"🥚",tags:["⚡ Rapido","🔥 Bajo en calorias"],i:["4 claras + 1 huevo","1 morron","1/2 cebolla","100g espinaca","Sal y pimienta"],s:["Saltear morron y cebolla picados 5 min.","Agregar espinaca hasta marchitar.","Batir claras y huevo con sal. Volcar.","Tapar, fuego bajo 4 min. Dar vuelta 2 min."]},
  "Omelette de claras con champinones":{t:"12 min",d:"Facil",k:"190 kcal",p:"25g",e:"🍄",tags:["⚡ Express","🔥 Bajo en calorias"],i:["4 claras","150g champinones","1 ajo","Perejil","Sal y pimienta","Manteca"],s:["Laminar champinones. Saltear con ajo 4-5 min.","Batir claras con sal, pimienta y perejil.","Cocinar en sarten con manteca a fuego medio.","Poner champinones en el centro y doblar."]},
  "Sopa minestrone liviana":{t:"35 min",d:"Facil",k:"220 kcal",p:"10g",e:"🍲",tags:["💚 Desinflamatorio","🔥 Bajo en calorias"],i:["1 cebolla","2 zanahorias","2 papas","1 zapallito","1/2 taza fideos chicos","1 lata tomates","Caldo","Albahaca"],s:["Rehogar cebolla 4 min. Agregar zanahoria y papas.","Sumar tomates y caldo. Cocinar 15 min.","Agregar zapallito y fideos. Cocinar 10 min.","Condimentar con albahaca y sal."]},
  "Pollo al horno con ensalada verde":{t:"55 min",d:"Facil",k:"390 kcal",p:"46g",e:"🍗",tags:["💪 Alta proteina"],i:["4 presas de pollo","Limon x2","4 dientes ajo","Oregano y romero","Aceite de oliva","Rucula y lechuga"],s:["Marinar el pollo con limon, ajo, aceite y condimentos 20 min.","Hornear a 200C por 45-50 min.","Dar vuelta a mitad de coccion.","Servir con ensalada verde condimentada."]},
  "Bowl de arroz integral con palta":{t:"20 min",d:"Facil",k:"450 kcal",p:"30g",e:"🥑",tags:["💚 Desinflamatorio","⚡ Rendidor"],i:["1 taza arroz integral cocido","150g pollo o atun","1 palta","Tomate cherry","Espinaca baby","Limon, aceite y sesamo"],s:["Tener el arroz ya cocido.","Preparar la proteina a gusto.","Cortar la palta en rodajas.","Armar el bowl y condimentar."]},
  "Ensalada mediterranea con garbanzos":{t:"12 min",d:"Facil",k:"340 kcal",p:"15g",e:"🫒",tags:["💚 Desinflamatorio","⚡ Express"],i:["1 lata garbanzos","Tomates x3","Pepino","Aceitunas","Queso feta 80g","Cebolla morada","Oregano, aceite y limon"],s:["Escurrir los garbanzos.","Cortar tomates, pepino y cebolla.","Mezclar con aceitunas y queso feta.","Condimentar con aceite, limon y oregano."]},
  "Pechuga al limon con quinoa y brocoli":{t:"30 min",d:"Facil",k:"420 kcal",p:"48g",e:"🍋",tags:["💪 Alta proteina","💚 Desinflamatorio"],i:["1 pechuga grande","1/2 taza quinoa","300g brocoli","Limon","Ajo, aceite, sal y pimienta"],s:["Cocinar quinoa en agua con sal 15 min.","Marinar pechuga con limon, ajo y aceite 10 min.","Grillar 4-5 min por lado. Vapor para el brocoli 6 min.","Emplatar quinoa de base, brocoli y pollo."]},
  "Tarta integral de espinaca y ricota":{t:"50 min",d:"Media",k:"380 kcal",p:"22g",e:"🥧",tags:["🌿 Vegetariana"],i:["1 tapa integral","500g espinaca","300g ricota","3 huevos","100g queso rallado","Sal, pimienta y nuez moscada"],s:["Horno a 180C. Tapa en molde y pinchar.","Cocinar espinaca, escurrir bien y picar.","Mezclar con ricota, huevos, queso y condimentos.","Volcar y hornear 35 min."]},
  "Wok de pollo con vegetales y arroz":{t:"25 min",d:"Media",k:"460 kcal",p:"40g",e:"🥢",tags:["💪 Alta proteina","⚡ Rendidor"],i:["150g pechuga en tiras","1 morron","1 zapallito","1 zanahoria","Soja, ajo y jengibre","Arroz 1 taza"],s:["Cocinar el arroz aparte.","Calentar wok a fuego muy alto. Saltear ajo y jengibre 30 seg.","Agregar pollo y dorar 3 min.","Sumar vegetales, saltear 4 min. Condimentar con soja."]},
  "Sopa de tomate con albahaca":{t:"25 min",d:"Facil",k:"180 kcal",p:"5g",e:"🍅",tags:["💚 Desinflamatorio","🔥 Bajo en calorias"],i:["6 tomates o 1 lata","1 cebolla","3 dientes ajo","Caldo","Albahaca fresca","Aceite de oliva","Sal"],s:["Rehogar cebolla y ajo 5 min. Agregar tomates.","Cocinar 15 min. Agregar caldo 5 min mas.","Licuar hasta crema suave.","Servir con albahaca y aceite de oliva."]},
  "Ensalada caprese con rucula":{t:"8 min",d:"Facil",k:"280 kcal",p:"16g",e:"🍅",tags:["⚡ Express","💚 Desinflamatorio"],i:["3 tomates maduros","200g mozzarella fresca","Rucula 100g","Albahaca fresca","Aceite de oliva extra virgen","Sal gruesa y pimienta"],s:["Cortar tomates y mozzarella en rodajas.","Intercalar sobre cama de rucula.","Agregar hojas de albahaca fresca.","Condimentar con aceite, sal gruesa y pimienta."]},
  "Guiso de lentejas con arroz":{t:"35 min",d:"Facil",k:"480 kcal",p:"22g",e:"🫘",tags:["💰 Economico","⚡ Rendidor"],i:["500g lentejas","1 taza arroz","1 cebolla","2 zanahorias","Caldo","Pimenton, comino y sal"],s:["Rehogar cebolla y zanahoria. Agregar pimenton y comino.","Sumar lentejas, caldo y agua. Cocinar 20 min.","Agregar arroz, mezclar bien.","Cocinar tapado 18 min mas."]},
  "Fideos con tuco casero":{t:"25 min",d:"Facil",k:"520 kcal",p:"18g",e:"🍝",tags:["💰 Economico","⚡ Rendidor"],i:["500g fideos","1 lata tomates perita","1 cebolla","3 dientes ajo","Oregano, albahaca","Aceite","Queso rallado"],s:["Rehogar cebolla y ajo 6 min.","Agregar tomates y condimentos. Cocinar 15 min.","Hervir fideos al dente. Escurrir.","Mezclar con tuco y servir con queso."]},
  "Cazuela de pollo con papas":{t:"50 min",d:"Facil",k:"560 kcal",p:"42g",e:"🍲",tags:["💰 Economico","💪 Alta proteina"],i:["4 presas pollo","4 papas","1 cebolla","2 zanahorias","1 morron","Caldo","Pimenton, oregano y sal"],s:["Dorar las presas. Retirar.","Rehogar las verduras 5 min.","Volver el pollo con papas, caldo y condimentos.","Cocinar tapado a fuego bajo 35 min."]},
  "Arroz con pollo y verduras":{t:"40 min",d:"Facil",k:"530 kcal",p:"38g",e:"🍚",tags:["💰 Economico","💪 Alta proteina"],i:["2 tazas arroz","2 pechugas","1 morron","1 cebolla","1 zanahoria","Caldo","Curcuma, oregano y sal"],s:["Cortar pollo en cubos y dorar. Retirar.","Rehogar las verduras 5 min.","Volver el pollo con arroz, caldo y condimentos.","Cocinar tapado a fuego bajo 20 min."]},
  "Tortilla de papas y cebolla":{t:"30 min",d:"Media",k:"480 kcal",p:"20g",e:"🥚",tags:["💰 Economico"],i:["4 papas","4 huevos","1 cebolla","Sal y pimienta","Aceite de oliva"],s:["Papas en rodajas finas, cocinar en aceite a fuego bajo 15 min.","Rehogar cebolla aparte.","Batir huevos con sal. Mezclar con papas y cebolla.","Tapar, cocinar 5 min. Dar vuelta y dorar 3 min."]},
  "Milanesas con pure de papas":{t:"30 min",d:"Facil",k:"580 kcal",p:"36g",e:"🥩",tags:["💰 Economico","⚡ Rendidor"],i:["4 milanesas de ternera","1 huevo","Pan rallado","4 papas","100ml leche","30g manteca","Sal, ajo y perejil"],s:["Hervir papas hasta tiernas. Pisar con leche y manteca.","Pasar milanesas por huevo batido y pan rallado.","Freir en aceite caliente 3-4 min por lado.","Servir con el pure al lado."]},
  "Tarta de verduras economica":{t:"45 min",d:"Facil",k:"420 kcal",p:"18g",e:"🥧",tags:["💰 Economico"],i:["1 tapa de tarta","2 zapallitos","1 cebolla","3 huevos","200g queso cremoso","Sal, pimienta y oregano"],s:["Horno a 180C. Tapa en molde.","Saltear cebolla y zapallito. Enfriar.","Mezclar con huevos, queso y condimentos.","Volcar y hornear 35 min."]},
  "Pizza de molde casera":{t:"35 min",d:"Facil",k:"540 kcal",p:"20g",e:"🍕",tags:["💰 Economico","⚡ Rendidor"],i:["2 tazas harina","1 cdita polvo de hornear","Agua tibia","Sal","Salsa de tomate","Mozzarella 200g","Oregano"],s:["Mezclar harina, polvo, sal y agua. Reposar 10 min.","Estirar en asadera aceitada.","Cubrir con salsa, mozzarella y oregano.","Hornear a 220C por 20-25 min."]},
  "Pollo al horno con papas":{t:"55 min",d:"Facil",k:"520 kcal",p:"44g",e:"🍗",tags:["💪 Alta proteina","💰 Economico"],i:["1 pollo trozado","4 papas","Limon x2","Ajo, pimenton y oregano","Aceite de oliva","Sal y pimienta"],s:["Condimentar pollo y papas con todos los ingredientes.","Colocar en asadera con aceite y limon.","Hornear a 200C por 45-50 min.","Dar vuelta a mitad de coccion."]},
  "Guiso de arroz con carne":{t:"50 min",d:"Media",k:"560 kcal",p:"34g",e:"🥘",tags:["💰 Economico","⚡ Rendidor"],i:["500g carne para guiso","2 tazas arroz","1 cebolla","2 papas","2 tomates","Caldo","Pimenton y laurel"],s:["Cortar carne en cubos y dorar. Retirar.","Rehogar cebolla, agregar tomates y pimenton.","Volver la carne con papas, caldo y laurel. Cocinar 25 min.","Agregar arroz, cocinar tapado 18 min."]},
  "Sopa de fideos express":{t:"15 min",d:"Facil",k:"280 kcal",p:"10g",e:"🍜",tags:["⚡ Express","💰 Economico"],i:["100g fideos finos","Caldo en cubo x2","1 zanahoria","1 papa chica","Perejil","Queso rallado"],s:["Hervir 1.2L de agua con el caldo.","Agregar zanahoria y papa en cubos. Cocinar 8 min.","Sumar fideos. Cocinar 5 min mas.","Servir con perejil y queso rallado."]},
  "Revuelto gramajo":{t:"20 min",d:"Facil",k:"490 kcal",p:"26g",e:"🍳",tags:["⚡ Rapido","💰 Economico"],i:["3 papas","150g jamon o paleta","4 huevos","1 cebolla","Sal y pimienta","Aceite"],s:["Papas en bastones, freir hasta dorar. Escurrir.","Rehogar la cebolla.","Agregar jamon y papas.","Volcar huevos batidos. Revolver hasta cuajar."]},
  "Hamburguesas caseras":{t:"25 min",d:"Facil",k:"500 kcal",p:"32g",e:"🍔",tags:["💰 Economico"],i:["500g carne picada","1 huevo","3 cdas pan rallado","Sal, pimienta y ajo","Pan x4","Lechuga, tomate y mayonesa"],s:["Mezclar carne con huevo, pan rallado y condimentos.","Formar 4 hamburguesas con manos humedas.","Cocinar en plancha 4-5 min por lado.","Armar con lechuga, tomate y mayonesa."]},
  "Pechuga con arroz y brocoli":{t:"25 min",d:"Facil",k:"440 kcal",p:"48g",e:"💪",tags:["💪 Alta proteina"],i:["200g pechuga","1 taza arroz","200g brocoli","Limon","Sal, ajo y pimienta","Aceite de oliva"],s:["Cocinar arroz con sal.","Cocinar brocoli al vapor 5-6 min.","Grillar pechuga salpimentada 4-5 min por lado.","Servir todo junto con limon."]},
  "Salmon con quinoa y vegetales":{t:"30 min",d:"Media",k:"540 kcal",p:"46g",e:"🐟",tags:["💚 Desinflamatorio","💪 Alta proteina"],i:["200g salmon","1/2 taza quinoa","Brocoli y zanahoria","Limon","Eneldo o perejil","Aceite","Sal"],s:["Cocinar quinoa en agua con sal 15 min.","Cocinar vegetales al vapor 6 min.","Condimentar salmon con limon y sal. Grillar 3-4 min por lado.","Servir con quinoa y vegetales."]},
  "Omelette proteica con queso":{t:"10 min",d:"Facil",k:"380 kcal",p:"32g",e:"🥚",tags:["⚡ Express","💪 Alta proteina"],i:["4 huevos","50g queso cottage o ricota","Sal y pimienta","Ciboulette","Manteca"],s:["Batir bien los huevos con sal y pimienta.","Calentar sarten con manteca a fuego medio.","Volcar huevos y no revolver. Poner queso cuando casi cuajan.","Doblar y servir con ciboulette."]},
  "Creme de zanahoria y jengibre":{t:"25 min",d:"Facil",k:"150 kcal",p:"3g",e:"🥕",tags:["💚 Desinflamatorio","🔥 Bajo en calorias"],i:["4 zanahorias grandes","1 cebolla","1 trozo jengibre fresco","Caldo en cubo","Curcuma","Leche de coco o leche","Aceite de oliva","Sal y pimienta"],s:["Rehogar cebolla con jengibre rallado 4 min.","Agregar zanahoria en rodajas, curcuma y caldo.","Cocinar 20 min. Licuar hasta crema fina.","Agregar leche de coco, salpimentar. Servir con hilo de aceite."]},
  "Bowl desinflamatorio de quinoa":{t:"20 min",d:"Facil",k:"380 kcal",p:"18g",e:"🫙",tags:["💚 Desinflamatorio","🌿 Vegetariano"],i:["1 taza quinoa","Espinaca fresca","Curcuma","Palta","Semillas de chia","Tomate cherry","Limon y aceite de oliva","Jengibre rallado"],s:["Cocinar quinoa con curcuma y una pizca de pimienta negra.","Lavar espinaca y cortar el resto de ingredientes.","Armar el bowl con quinoa de base, espinaca, palta y tomate.","Condimentar con limon, aceite y jengibre. Espolvorear chia."]},
  "Salmon al horno con vegetales desinflamatorios":{t:"35 min",d:"Facil",k:"420 kcal",p:"38g",e:"🐟",tags:["💚 Desinflamatorio","💪 Alta proteina"],i:["200g salmon","Brocoli 200g","Esparragos 150g","Curcuma y jengibre","Aceite de oliva","Limon","Sal y pimienta"],s:["Precalentar horno a 200C. Colocar salmon en asadera.","Distribuir brocoli y esparragos alrededor.","Condimentar todo con curcuma, jengibre, aceite, limon y sal.","Hornear 20-25 min hasta que el salmon este cocido."]},
  "Pollo con curcuma y vegetales":{t:"35 min",d:"Facil",k:"360 kcal",p:"40g",e:"🍗",tags:["💚 Desinflamatorio","💪 Alta proteina"],i:["2 pechugas de pollo","Curcuma 1 cdita","Jengibre 1/2 cdita","Ajo 2 dientes","Morron rojo","Zapallito","Aceite de oliva","Sal y pimienta"],s:["Marinar el pollo con curcuma, jengibre, ajo y aceite 15 min.","Grillar la pechuga 4-5 min por lado hasta dorar.","Saltear morron y zapallito en el mismo jugo.","Servir el pollo sobre las verduras salteadas."]},
  "Pollo desmenuzado con arroz":{t:"30 min",d:"Facil",k:"440 kcal",p:"44g",e:"🍗",tags:["💪 Alta proteina","💰 Economico"],i:["2 pechugas","1.5 tazas arroz","Caldo","Sal, ajo y oregano","Aceite de oliva"],s:["Hervir pechugas en agua con sal y ajo 20 min.","Desmenuzar con dos tenedores.","Cocinar el arroz con caldo.","Mezclar pollo con aceite y oregano. Servir con arroz."]},
  "Arroz con pollo preparado":{t:"40 min",d:"Facil",k:"530 kcal",p:"38g",e:"🍚",tags:["📦 Batch cooking","⚡ Rendidor"],i:["2 tazas arroz","2 pechugas","1 morron","1 cebolla","1 zanahoria","Caldo","Curcuma y oregano"],s:["Cortar pollo en cubos y dorar. Retirar.","Rehogar verduras 5 min con curcuma.","Volver el pollo con arroz y caldo.","Cocinar tapado 20 min. Rinde para varios dias."]},
  "Fideos con salsa preparada":{t:"20 min",d:"Facil",k:"520 kcal",p:"18g",e:"🍝",tags:["📦 Batch cooking","💰 Economico"],i:["500g fideos","Salsa de tomate del batch","Queso rallado","Sal y oregano"],s:["Tener la salsa ya preparada del batch semanal.","Hervir los fideos al dente.","Calentar la salsa.","Escurrir y mezclar. Servir con queso."]},
  "Bowl con legumbres cocidas":{t:"10 min",d:"Facil",k:"390 kcal",p:"20g",e:"🫘",tags:["📦 Batch cooking","⚡ Express"],i:["1 taza legumbres cocidas","Arroz o quinoa cocidos","Verduras de estacion","Aceite de oliva","Limon y sal"],s:["Tener legumbres cocidas del batch.","Calentar en sarten con aceite 3-4 min.","Armar el bowl con cereal base y vegetales frescos.","Condimentar con limon, aceite y sal."]},
  "Wrap con sobras":{t:"8 min",d:"Facil",k:"360 kcal",p:"22g",e:"🌯",tags:["⚡ Express","📦 Batch cooking"],i:["1 tortilla de harina","Sobras de proteina","Verduras frescas","Salsa a eleccion"],s:["Calentar la tortilla en sarten seca.","Calentar las sobras rapidamente.","Armar el wrap con proteina, vegetales y salsa.","Enrollar y consumir de inmediato."]},
  "Batch cooking dominical":{t:"120 min",d:"Media",k:"Variable",p:"Variable",e:"📦",tags:["📦 Batch cooking"],i:["2kg pollo o carne","2kg arroz","1kg legumbres","2kg verduras variadas","Recipientes hermeticos"],s:["Cocinar cereal base en cantidad grande.","Cocinar proteinas: pollo al horno o legumbres.","Preparar salsa base de tomate para la semana.","Dividir en porciones y guardar hermetico. Duran 4-5 dias."]},
  "Pollo a la provenzal":{t:"35 min",d:"Facil",k:"370 kcal",p:"43g",e:"🍗",tags:["💪 Alta proteina","💰 Economico"],i:["4 presas de pollo","4 dientes ajo","Perejil fresco","Aceite de oliva","Limon","Sal y pimienta"],s:["Dorar las presas de pollo en aceite caliente por todos lados.","Agregar ajo picado fino y perejil. Mezclar bien.","Exprimir el limon encima. Bajar el fuego.","Cocinar tapado 20 min a fuego bajo hasta que este tierno."]},
  "Fideos con pollo y champinones":{t:"30 min",d:"Facil",k:"490 kcal",p:"35g",e:"🍝",tags:["💪 Alta proteina","⚡ Rendidor"],i:["300g fideos","200g pechuga en cubos","200g champinones","1 cebolla","Crema light 150ml","Sal, pimienta y tomillo"],s:["Saltear cebolla y pollo en cubos hasta dorar.","Agregar champinones laminados. Cocinar 5 min.","Sumar crema y condimentos. Cocinar 3 min mas.","Mezclar con fideos cocidos al dente."]},
  "Ensalada de lentejas con vegetales":{t:"15 min",d:"Facil",k:"310 kcal",p:"17g",e:"🥗",tags:["🌿 Vegetariana","💰 Economico"],i:["1 lata lentejas cocidas","1 morron rojo","1 pepino","Cebolla morada","Perejil","Aceite de oliva y limon","Sal"],s:["Escurrir y enjuagar las lentejas.","Cortar morron, pepino y cebolla en cubos chicos.","Mezclar todo con perejil picado.","Condimentar con aceite, limon y sal."]},
  "Caldo de pollo con fideos":{t:"45 min",d:"Facil",k:"240 kcal",p:"22g",e:"🍜",tags:["💰 Economico","🔥 Bajo en calorias"],i:["1 carcasa o 2 presas pollo","1 cebolla","2 zanahorias","2 ramas apio","100g fideos","Sal y perejil"],s:["Hervir el pollo con las verduras enteras 30 min.","Colar el caldo. Desmenuzar el pollo.","Agregar fideos al caldo hirviendo. Cocinar 8 min.","Agregar el pollo desmenuzado y perejil."]},
  "Lomo salteado con papas":{t:"25 min",d:"Media",k:"520 kcal",p:"38g",e:"🥩",tags:["💪 Alta proteina","💰 Economico"],i:["300g lomo en tiras","3 papas","1 cebolla","1 morron","Soja","Sal y pimienta"],s:["Freir las papas en cubos hasta dorar. Reservar.","Saltear el lomo a fuego muy alto 2 min. Reservar.","Saltear cebolla y morron 4 min.","Unir todo con soja. Mezclar y servir."]},
  "Tarta de jamon y queso":{t:"40 min",d:"Facil",k:"460 kcal",p:"24g",e:"🥧",tags:["💰 Economico","⚡ Rendidor"],i:["1 tapa de tarta","150g jamon cocido","200g queso en fetas","3 huevos","200ml crema o leche","Sal y pimienta"],s:["Horno a 180C. Tapa en molde y pinchar.","Distribuir jamon y queso sobre la base.","Batir huevos con crema, sal y pimienta. Volcar.","Hornear 30-35 min hasta cuajar."]},
  "Arroz yamani con huevo y verduras":{t:"25 min",d:"Facil",k:"410 kcal",p:"18g",e:"🍚",tags:["🌿 Vegetariana","⚡ Rendidor"],i:["1 taza arroz yamani","2 huevos","Espinaca 150g","Zanahoria rallada","Soja y sesamo","Aceite"],s:["Cocinar arroz yamani 25 min con sal.","Freir los huevos o hacer revuelto.","Saltear espinaca con zanahoria 3 min.","Armar el bowl con arroz de base, verduras y huevo. Soja encima."]},
  "Pollo con batata al horno":{t:"50 min",d:"Facil",k:"460 kcal",p:"41g",e:"🍗",tags:["💪 Alta proteina","💚 Desinflamatorio"],i:["2 pechugas de pollo","2 batatas medianas","Romero y tomillo","Ajo","Aceite de oliva","Sal y pimienta","Miel 1 cda"],s:["Horno a 200C. Cortar batatas en gajos.","Condimentar el pollo y las batatas con hierbas, ajo y aceite.","Disponer en asadera. Pincelar con miel las batatas.","Hornear 40 min hasta dorar todo."]},
  "Fideos integrales con pesto":{t:"20 min",d:"Facil",k:"480 kcal",p:"18g",e:"🍝",tags:["🌿 Vegetariana","⚡ Rendidor"],i:["300g fideos integrales","Albahaca fresca 1 atado","Ajo 2 dientes","Parmesano 50g","Aceite de oliva 4 cdas","Sal y pimienta"],s:["Hervir los fideos al dente.","Procesar albahaca con ajo, parmesano y aceite hasta pasta.","Condimentar con sal y pimienta.","Mezclar fideos escurridos con el pesto. Servir de inmediato."]},
  "Sopa de arvejas con jamon":{t:"30 min",d:"Facil",k:"320 kcal",p:"20g",e:"🥣",tags:["💰 Economico","⚡ Rendidor"],i:["400g arvejas congeladas","150g jamon cocido","1 cebolla","Caldo en cubo","Menta fresca","Sal y pimienta"],s:["Rehogar cebolla 5 min en olla con aceite.","Agregar arvejas y caldo. Cocinar 15 min.","Procesar la mitad de la sopa para darle cuerpo.","Agregar jamon en cubos y menta. Calentar 2 min."]},
  "Bowl de boniato y garbanzos":{t:"35 min",d:"Facil",k:"420 kcal",p:"16g",e:"🍠",tags:["🌿 Vegetariana","💚 Desinflamatorio"],i:["2 boniatos medianos","1 lata garbanzos","Espinaca baby","Palta","Tahini 2 cdas","Limon","Curcuma y sal"],s:["Cortar boniatos en cubos y asar 25 min a 200C con curcuma.","Escurrir y tostar garbanzos en sarten con aceite 10 min.","Armar el bowl con espinaca de base, boniato, garbanzos y palta.","Mezclar tahini con limon y agua para la salsa. Salsear encima."]},
  "Milanesas de berenjena":{t:"30 min",d:"Facil",k:"280 kcal",p:"10g",e:"🍆",tags:["🌿 Vegetariana","💰 Economico"],i:["2 berenjenas grandes","2 huevos","Pan rallado","Ajo y perejil","Aceite","Sal"],s:["Cortar berenjenas en rodajas de 1cm. Salar y dejar 10 min.","Secar bien. Pasar por huevo batido y pan rallado con ajo y perejil.","Freir en aceite caliente 3 min por lado hasta dorar.","Escurrir en papel. Servir con ensalada o pure."]},
  "Pollo a la crema con arroz":{t:"30 min",d:"Facil",k:"510 kcal",p:"40g",e:"🍗",tags:["💪 Alta proteina","⚡ Rendidor"],i:["2 pechugas","Crema light 200ml","1 cebolla","Champinones 150g","Ajo","Sal, pimienta y tomillo","Arroz 1 taza"],s:["Cocinar el arroz con sal.","Saltear cebolla y ajo. Agregar pechuga en cubos.","Dorar el pollo. Agregar champinones 3 min.","Verter la crema y tomillo. Cocinar 5 min hasta que espese."]},
  "Tallarines con atun y tomate cherry":{t:"15 min",d:"Facil",k:"450 kcal",p:"28g",e:"🍝",tags:["⚡ Express","💪 Alta proteina"],i:["300g tallarines","2 latas atun","200g tomate cherry","Ajo 2 dientes","Aceite de oliva","Albahaca","Sal y pimienta"],s:["Hervir los tallarines al dente.","Calentar aceite con ajo laminado 1 min.","Agregar tomates cherry y cocinar 3 min hasta que exploten.","Incorporar el atun y mezclar. Sumar pasta y albahaca."]},
  "Estofado de pollo con ciruelas":{t:"50 min",d:"Media",k:"480 kcal",p:"38g",e:"🍲",tags:["💰 Economico","⚡ Rendidor"],i:["4 presas de pollo","12 ciruelas secas","1 cebolla","1 morron","Vino blanco 100ml","Caldo","Tomillo y laurel"],s:["Dorar las presas de pollo por todos lados. Retirar.","Rehogar cebolla y morron 5 min.","Agregar el vino y dejar evaporar 2 min.","Volver el pollo con ciruelas, caldo y hierbas. Cocinar tapado 30 min."]},
  "Espinaca salteada con huevo pochado":{t:"15 min",d:"Facil",k:"220 kcal",p:"18g",e:"🥬",tags:["🔥 Bajo en calorias","⚡ Express"],i:["400g espinaca fresca","2 huevos","3 dientes ajo","Aceite de oliva","Sal y pimienta","Pan integral tostado"],s:["Calentar aceite con ajo laminado hasta dorar.","Agregar espinaca y saltear 3 min hasta marchitar.","Pochar los huevos en agua con vinagre 3 min.","Servir la espinaca con el huevo pochado encima. Pan al costado."]},
  "Berenjenas rellenas de carne":{t:"55 min",d:"Media",k:"430 kcal",p:"30g",e:"🍆",tags:["💰 Economico","⚡ Rendidor"],i:["2 berenjenas grandes","300g carne picada","1 cebolla","2 tomates","Queso rallado","Ajo, oregano y sal"],s:["Cortar berenjenas al medio y vaciar la pulpa. Horno 15 min a 180C.","Rehogar cebolla con ajo. Agregar carne y dorar.","Sumar tomate y pulpa de berenjena. Cocinar 10 min.","Rellenar las berenjenas, cubrir con queso. Hornear 20 min mas."]},
  "Zapallitos rellenos":{t:"45 min",d:"Facil",k:"350 kcal",p:"25g",e:"🥬",tags:["💰 Economico","🌿 Vegetariana"],i:["4 zapallitos grandes","200g carne picada o ricota","1 cebolla","1 huevo","Queso rallado","Sal y pimienta"],s:["Vaciar los zapallitos y blanquear 5 min en agua hirviendo.","Rehogar cebolla con la pulpa de zapallito.","Mezclar con proteina elegida, huevo y condimentos.","Rellenar, cubrir con queso. Hornear 25 min a 180C."]},
  "Ensalada tibia de pollo y papa":{t:"25 min",d:"Facil",k:"380 kcal",p:"32g",e:"🥗",tags:["💪 Alta proteina","💰 Economico"],i:["2 pechugas","3 papas medianas","Mostaza 1 cda","Aceite de oliva","Limon","Perejil","Sal y pimienta"],s:["Hervir las papas en cubos hasta tiernas.","Grillar las pechugas y cortar en tiras.","Mezclar mostaza con aceite y limon para el aderezo.","Unir papas, pollo y perejil con el aderezo. Servir tibio."]},
  "Pollo teriyaki con arroz":{t:"25 min",d:"Facil",k:"490 kcal",p:"38g",e:"🍗",tags:["💪 Alta proteina","⚡ Rendidor"],i:["2 pechugas","Soja 3 cdas","Miel 2 cdas","Ajo 1 diente","Jengibre rallado","Arroz 1 taza","Sesamo"],s:["Mezclar soja, miel, ajo y jengibre para la salsa.","Cocinar el pollo en sarten. Verter la salsa y glasear 3 min.","Cocinar el arroz con sal.","Servir el pollo con el arroz y sesamo encima."]},
  "Papas rellenas de atun":{t:"30 min",d:"Facil",k:"410 kcal",p:"24g",e:"🥔",tags:["💰 Economico","⚡ Rendidor"],i:["4 papas grandes","2 latas atun","Mayonesa 2 cdas","1 cebolla chica","Perejil","Sal y pimienta"],s:["Cocinar las papas en el microondas 8-10 min.","Cortar al medio y vaciar la pulpa.","Mezclar la pulpa con atun, mayonesa, cebolla y perejil.","Rellenar las papas. Gratinar en horno 5 min opcional."]},
  "Noquis de papa con tuco":{t:"45 min",d:"Media",k:"560 kcal",p:"16g",e:"🥟",tags:["💰 Economico","⚡ Rendidor"],i:["1kg papas","300g harina","1 huevo","Sal y nuez moscada","Salsa de tomate 500ml","Queso rallado","Albahaca"],s:["Hervir las papas con cascara hasta tiernas. Pelar y pisar.","Mezclar pure tibio con harina, huevo, sal y nuez moscada.","Hacer rollitos de masa, cortar noquis de 2cm. Marcar con tenedor.","Hervir 2-3 min hasta que floten. Servir con tuco caliente y queso."]},
  "Pastel de papa":{t:"60 min",d:"Media",k:"550 kcal",p:"34g",e:"🥧",tags:["💰 Economico","⚡ Rendidor"],i:["1kg papas","500g carne picada","2 cebollas","2 huevos duros","Aceitunas","100ml leche","30g manteca","Pimenton, comino y sal"],s:["Hervir papas hasta tiernas. Pisar con leche, manteca y sal.","Rehogar cebolla. Agregar carne picada y dorar bien.","Sumar pimenton, comino, aceitunas en rodajas y huevo duro picado.","Volcar carne en fuente, cubrir con pure. Hornear 20 min a 200C hasta dorar."]},
  "Empanadas de carne al horno":{t:"60 min",d:"Media",k:"480 kcal",p:"22g",e:"🥟",tags:["💰 Economico","⚡ Rendidor"],i:["12 tapas para empanadas","500g carne picada","2 cebollas","2 huevos duros","Aceitunas","Pimenton, comino, aji molido y sal","1 huevo para pintar"],s:["Rehogar cebolla bien picada hasta transparente. Agregar carne y desarmar.","Condimentar con pimenton, comino, aji molido y sal. Enfriar la mezcla.","Sumar huevo duro y aceitunas picadas. Rellenar tapas y cerrar con repulgue.","Pintar con huevo batido. Horno 200C por 18-20 min hasta dorar."]},
  "Suprema napolitana con pure":{t:"40 min",d:"Facil",k:"620 kcal",p:"45g",e:"🍗",tags:["💪 Alta proteina","💰 Economico"],i:["2 supremas de pollo","2 huevos","Pan rallado","Salsa de tomate","Jamon cocido 100g","Mozzarella 200g","Oregano","4 papas","Leche y manteca"],s:["Pasar las supremas por huevo batido y pan rallado. Freir 3 min por lado.","Hervir papas y hacer pure con leche, manteca y sal.","Colocar supremas en asadera. Cubrir con salsa, jamon, mozzarella y oregano.","Gratinar en horno 10 min a 200C hasta que se funda el queso."]},
  "Polenta con tuco y queso":{t:"30 min",d:"Facil",k:"450 kcal",p:"15g",e:"🌽",tags:["💰 Economico","⚡ Rendidor"],i:["300g polenta","1.2L caldo","Salsa de tomate 400ml","1 cebolla","Queso rallado 100g","Manteca 30g","Sal y oregano"],s:["Hervir el caldo con sal. Volcar la polenta en lluvia revolviendo.","Cocinar 5 min revolviendo hasta espesar. Agregar manteca.","Aparte rehogar cebolla y agregar salsa de tomate. Cocinar 10 min con oregano.","Servir polenta con tuco caliente encima y abundante queso rallado."]},
  "Locro express":{t:"60 min",d:"Media",k:"580 kcal",p:"32g",e:"🍲",tags:["💰 Economico","⚡ Rendidor"],i:["400g maiz blanco","300g porotos","300g carne para guiso","200g panceta","2 chorizos colorados","2 cebollas","1 zapallo chico","Pimenton, comino y aji molido"],s:["Remojar el maiz y porotos la noche anterior. Hervir 40 min.","Dorar carne, panceta y chorizo cortados. Reservar.","Rehogar cebolla con pimenton y comino. Agregar zapallo en cubos.","Unir todo con el maiz y porotos. Cocinar 20 min mas hasta espesar."]},
  "Asado al horno con papas":{t:"90 min",d:"Facil",k:"680 kcal",p:"50g",e:"🥩",tags:["💪 Alta proteina","⚡ Rendidor"],i:["1kg tira de asado","6 papas","Sal gruesa","Ajo 4 dientes","Romero y tomillo","Aceite de oliva","Limon"],s:["Salar bien la tira de asado y dejar reposar 15 min.","Cortar papas en gajos. Mezclar con aceite, ajo, sal y hierbas.","Colocar todo en asadera. Asado del lado del hueso para abajo primero.","Horno 200C por 70-80 min, dando vuelta a mitad. Servir con limon."]},
  "Ravioles con salsa rosa":{t:"20 min",d:"Facil",k:"520 kcal",p:"22g",e:"🍝",tags:["💰 Economico","⚡ Rendidor"],i:["500g ravioles","Salsa de tomate 300ml","Crema de leche 150ml","1 cebolla","Ajo","Queso rallado","Albahaca","Sal y pimienta"],s:["Rehogar cebolla y ajo picados.","Agregar salsa de tomate y cocinar 10 min.","Sumar crema, salpimentar. Cocinar 3 min mas.","Hervir ravioles 3-4 min. Mezclar con salsa rosa y servir con queso."]},
  "Canelones de verdura":{t:"60 min",d:"Media",k:"500 kcal",p:"24g",e:"🥬",tags:["🌿 Vegetariana","⚡ Rendidor"],i:["12 panqueques o tapas","500g espinaca","300g ricota","100g queso rallado","2 huevos","Salsa blanca 300ml","Salsa de tomate 300ml","Nuez moscada"],s:["Hervir espinaca, escurrir y picar. Mezclar con ricota, queso, huevos y nuez moscada.","Rellenar cada panqueque con la mezcla y enrollar.","Colocar en fuente, cubrir con salsa blanca y salsa de tomate alternadas.","Espolvorear queso rallado. Hornear 25 min a 180C hasta gratinar."]},
  "Matambre a la pizza":{t:"45 min",d:"Facil",k:"580 kcal",p:"42g",e:"🥩",tags:["💪 Alta proteina","💰 Economico"],i:["1 matambre de 1kg","Salsa de tomate 300ml","Mozzarella 300g","Oregano","Aceitunas","Morron en tiras","Sal y pimienta"],s:["Salar el matambre y cocinar a la plancha 10 min por lado.","Pasarlo a una asadera. Cubrir con salsa de tomate.","Agregar mozzarella, morron y aceitunas. Espolvorear oregano.","Gratinar en horno 10 min hasta que se funda el queso."]},
  "Milanesa napolitana":{t:"35 min",d:"Facil",k:"620 kcal",p:"40g",e:"🍕",tags:["💪 Alta proteina","💰 Economico"],i:["4 milanesas de ternera","Salsa de tomate 200ml","Jamon cocido 100g","Mozzarella 200g","Oregano","Aceite para freir"],s:["Freir las milanesas 3 min por lado. Escurrir.","Colocar en asadera. Cubrir con salsa de tomate.","Agregar jamon y mozzarella encima. Espolvorear oregano.","Gratinar en horno 10 min a 200C hasta fundir el queso."]},
  "Bife a caballo":{t:"15 min",d:"Facil",k:"540 kcal",p:"45g",e:"🥩",tags:["💪 Alta proteina","⚡ Rapido"],i:["2 bifes de chorizo o lomo","2 huevos","Sal y pimienta","Aceite","Pure de papas o papas fritas"],s:["Salpimentar los bifes. Calentar plancha bien caliente.","Cocinar bife 3-4 min por lado segun preferencia.","En otra sarten, freir los huevos manteniendo la yema blanda.","Servir el bife con el huevo encima y guarnicion al lado."]},
  "Sandwich de milanesa":{t:"25 min",d:"Facil",k:"620 kcal",p:"38g",e:"🥪",tags:["💰 Economico","⚡ Rapido"],i:["2 milanesas finas","2 panes de pancho o miga","Lechuga","Tomate","Mayonesa","Mozzarella opcional","Aceite para freir"],s:["Freir las milanesas en aceite caliente 3 min por lado.","Calentar el pan en plancha o tostadora.","Untar con mayonesa. Agregar lechuga y tomate.","Colocar la milanesa caliente. Cerrar y cortar al medio."]},
  "Salpicon de pollo":{t:"30 min",d:"Facil",k:"380 kcal",p:"32g",e:"🥗",tags:["💪 Alta proteina","⚡ Express"],i:["2 pechugas de pollo","3 papas","2 zanahorias","1 lata arvejas","2 huevos duros","Mayonesa 4 cdas","Sal y limon"],s:["Hervir pechuga, papas y zanahorias por separado hasta tiernas.","Cortar todo en cubos chicos. Hervir y picar los huevos.","Mezclar todo con arvejas escurridas en bowl grande.","Condimentar con mayonesa, sal y un poco de limon. Servir frio."]},
  "Pollo a la portuguesa":{t:"45 min",d:"Facil",k:"450 kcal",p:"40g",e:"🍗",tags:["💪 Alta proteina","💰 Economico"],i:["4 presas de pollo","1 lata tomates","2 cebollas","2 morrones","Aceitunas","Vino blanco 100ml","Ajo, oregano y laurel"],s:["Dorar las presas de pollo en aceite. Retirar.","Rehogar cebolla y morron en tiras 6 min.","Agregar tomates, vino, laurel y oregano. Cocinar 10 min.","Volver el pollo a la salsa con aceitunas. Cocinar tapado 25 min."]},
  "Carbonada criolla":{t:"55 min",d:"Media",k:"520 kcal",p:"30g",e:"🥘",tags:["💰 Economico","⚡ Rendidor"],i:["500g carne para guiso","2 papas","2 batatas","2 mazorcas de choclo","2 zapallitos","2 duraznos","Caldo","Pimenton y comino"],s:["Dorar la carne en cubos. Reservar.","Rehogar cebolla con pimenton y comino.","Agregar la carne, papas, batatas y choclo. Cubrir con caldo.","Cocinar 30 min. Sumar zapallito y durazno los ultimos 10 min."]},
  "Tarta de zapallitos":{t:"50 min",d:"Facil",k:"400 kcal",p:"18g",e:"🥧",tags:["🌿 Vegetariana","💰 Economico"],i:["1 tapa de tarta","4 zapallitos","2 cebollas","3 huevos","200g queso cremoso","Sal, pimienta y oregano","Aceite"],s:["Rehogar cebolla y zapallitos en cubos hasta tiernos. Enfriar.","Mezclar con huevos batidos, queso, sal, pimienta y oregano.","Volcar sobre la tapa de tarta en molde.","Hornear a 180C por 35 min hasta dorar."]},
  "Calabaza rellena":{t:"60 min",d:"Media",k:"380 kcal",p:"22g",e:"🎃",tags:["🌿 Vegetariana","💚 Desinflamatorio"],i:["1 calabaza mediana","200g quinoa","1 cebolla","Champinones 200g","Espinaca","Queso rallado","Ajo y tomillo"],s:["Cortar la calabaza al medio y vaciar. Hornear 30 min a 200C.","Cocinar la quinoa en agua con sal 15 min.","Saltear cebolla, ajo, champinones y espinaca. Mezclar con quinoa y tomillo.","Rellenar las mitades de calabaza, cubrir con queso. Gratinar 10 min."]},
  "Risotto de hongos":{t:"35 min",d:"Media",k:"480 kcal",p:"14g",e:"🍚",tags:["🌿 Vegetariana","⚡ Rendidor"],i:["300g arroz arborio","Champinones 300g","1 cebolla","Caldo de verduras 1L","Vino blanco 100ml","Manteca 50g","Parmesano 80g","Tomillo"],s:["Saltear cebolla con manteca. Agregar arroz y tostar 2 min.","Verter el vino y dejar evaporar. Sumar caldo de a poco revolviendo constante.","En sarten aparte saltear champinones laminados con tomillo.","A los 18 min agregar champinones, parmesano y manteca. Servir cremoso."]},
  "Salmon a la mostaza":{t:"20 min",d:"Facil",k:"460 kcal",p:"42g",e:"🐟",tags:["💚 Desinflamatorio","💪 Alta proteina"],i:["2 filetes de salmon","Mostaza 2 cdas","Miel 1 cda","Limon","Eneldo","Aceite de oliva","Sal y pimienta"],s:["Mezclar mostaza, miel, jugo de limon, eneldo y aceite.","Salpimentar el salmon y untar con la mezcla.","Cocinar en plancha o sarten 3-4 min por lado.","Servir con guarnicion de vegetales o ensalada verde."]},
  "Quiche lorraine":{t:"55 min",d:"Media",k:"540 kcal",p:"22g",e:"🥧",tags:["💰 Economico","⚡ Rendidor"],i:["1 tapa de tarta","200g panceta","1 cebolla","4 huevos","Crema 200ml","Queso gruyere 100g","Sal, pimienta y nuez moscada"],s:["Horno a 180C. Tapa en molde y pinchar.","Saltear panceta en cubos con cebolla picada hasta dorar.","Batir huevos con crema, queso rallado y condimentos.","Distribuir panceta sobre la base y volcar la mezcla. Hornear 35 min."]},
  "Wok de tofu y vegetales":{t:"20 min",d:"Facil",k:"340 kcal",p:"22g",e:"🥢",tags:["🌿 Vegetariana","⚡ Rapido"],i:["300g tofu firme","1 brocoli","1 morron","1 zanahoria","Soja 3 cdas","Jengibre y ajo","Sesamo","Aceite"],s:["Cortar tofu en cubos y dorar en wok caliente. Reservar.","Saltear ajo y jengibre rallado 30 seg.","Agregar vegetales en juliana. Saltear 5 min a fuego alto.","Volver el tofu, sumar soja. Servir con sesamo encima."]},
  "Buddha bowl con falafel":{t:"40 min",d:"Media",k:"520 kcal",p:"22g",e:"🫙",tags:["🌿 Vegetariana","💚 Desinflamatorio"],i:["1 lata garbanzos","Quinoa 1 taza","Espinaca","Palta","Tomate cherry","Pepino","Tahini","Limon, ajo y comino"],s:["Procesar garbanzos con ajo, comino, perejil y harina. Formar bolitas.","Cocinar falafel en sarten con aceite hasta dorar todo.","Cocinar la quinoa. Cortar verduras en cubos.","Armar bowl con quinoa, vegetales, falafel. Salsear con tahini y limon."]},
  "Pizza de calabaza fit":{t:"40 min",d:"Media",k:"320 kcal",p:"18g",e:"🍕",tags:["🌿 Vegetariana","🔥 Bajo en calorias"],i:["500g calabaza","2 huevos","100g queso rallado","Salsa de tomate","Mozzarella light 150g","Oregano","Albahaca"],s:["Rallar la calabaza cruda. Mezclar con huevos, queso y sal.","Estirar en bandeja con papel manteca. Hornear 20 min a 200C.","Cubrir con salsa, mozzarella y oregano.","Volver al horno 10 min mas hasta gratinar. Decorar con albahaca."]},
  "Crepes de jamon y queso":{t:"30 min",d:"Facil",k:"450 kcal",p:"24g",e:"🌮",tags:["💰 Economico","⚡ Rendidor"],i:["200g harina","2 huevos","500ml leche","200g jamon cocido","200g queso en fetas","Sal","Manteca"],s:["Batir harina, huevos, leche y sal hasta masa lisa. Reposar 10 min.","Cocinar crepes finos en sarten con manteca, 1 min por lado.","Rellenar cada crepe con jamon y queso. Doblar en triangulo.","Calentar en sarten o gratinar 5 min hasta fundir el queso."]},
  "Pollo al curry con arroz":{t:"30 min",d:"Facil",k:"520 kcal",p:"40g",e:"🍛",tags:["💪 Alta proteina","⚡ Rendidor"],i:["2 pechugas en cubos","1 cebolla","2 cdas curry en polvo","400ml leche de coco","1 taza arroz basmati","Jengibre","Cilantro y limon"],s:["Saltear cebolla y jengibre. Agregar el pollo en cubos y dorar.","Sumar el curry y mezclar bien 1 min.","Verter leche de coco y cocinar 15 min a fuego bajo.","Cocinar arroz aparte. Servir con cilantro y limon."]},
  "Ensalada cesar con pollo":{t:"20 min",d:"Facil",k:"450 kcal",p:"38g",e:"🥗",tags:["💪 Alta proteina","⚡ Rapido"],i:["2 pechugas grilladas","Lechuga romana","Pan crutones","Parmesano","Mayonesa 3 cdas","Mostaza, ajo, limon","Anchoa opcional"],s:["Grillar pechugas y cortar en tiras.","Tostar pan en cubos con aceite y ajo para crutones.","Mezclar mayonesa con mostaza, ajo, limon y parmesano para el aderezo.","Mezclar lechuga con aderezo. Coronar con pollo, crutones y parmesano."]},
  "Sopa china de pollo":{t:"30 min",d:"Facil",k:"260 kcal",p:"22g",e:"🍜",tags:["⚡ Rapido","🔥 Bajo en calorias"],i:["1 pechuga en tiras","100g fideos chinos","Cebolla de verdeo","Champinones","Soja","Jengibre","Caldo 1L","Sesamo"],s:["Hervir caldo con jengibre y soja.","Agregar pollo en tiras, cocinar 8 min.","Sumar champinones y fideos chinos. Cocinar 4 min.","Servir con cebolla de verdeo y sesamo encima."]},
  "Tacos mexicanos de carne":{t:"25 min",d:"Facil",k:"480 kcal",p:"30g",e:"🌮",tags:["💰 Economico","⚡ Rapido"],i:["8 tortillas de maiz","400g carne picada","1 cebolla","Comino, pimenton, aji","Tomate","Palta","Cilantro","Limon"],s:["Saltear cebolla y carne picada con comino, pimenton y aji.","Calentar las tortillas en sarten seca.","Cortar tomate y palta en cubos chicos.","Armar tacos con carne, vegetales, cilantro y limon."]},
  "Brochettes de pollo y vegetales":{t:"30 min",d:"Facil",k:"380 kcal",p:"38g",e:"🍢",tags:["💪 Alta proteina","💚 Desinflamatorio"],i:["2 pechugas en cubos","1 morron rojo","1 morron verde","1 cebolla","Champinones","Aceite de oliva","Limon, ajo y oregano","Palitos brochette"],s:["Marinar el pollo con aceite, limon, ajo y oregano 15 min.","Cortar vegetales en cubos del tamano del pollo.","Armar brochettes alternando pollo y vegetales.","Cocinar en plancha o parrilla 4 min por lado."]},
  "Ensalada de fideos integrales":{t:"15 min",d:"Facil",k:"380 kcal",p:"14g",e:"🥗",tags:["🌿 Vegetariana","⚡ Rapido"],i:["300g fideos integrales","Tomate cherry","Mozzarella en bolitas","Albahaca","Aceitunas","Aceite de oliva","Vinagre balsamico"],s:["Hervir los fideos al dente. Enfriar bajo agua fria.","Cortar tomates al medio y mezclar con mozzarella.","Sumar aceitunas y albahaca picada.","Aderezar con aceite, balsamico, sal y pimienta. Servir frio."]},
  "Pollo agridulce":{t:"30 min",d:"Facil",k:"480 kcal",p:"38g",e:"🍗",tags:["💪 Alta proteina","⚡ Rendidor"],i:["2 pechugas en cubos","1 morron","Cebolla","Anana en cubos","Salsa de soja","Vinagre","Azucar","Ketchup","Almidon de maiz"],s:["Pasar pollo por almidon y dorar en sarten. Reservar.","Saltear cebolla y morron 4 min.","Mezclar soja, vinagre, azucar y ketchup. Verter en la sarten.","Volver pollo y agregar anana. Cocinar 5 min hasta espesar."]},
  "Polenta cremosa con queso":{t:"25 min",d:"Facil",k:"380 kcal",p:"12g",e:"🌽",tags:["🌿 Vegetariana","💰 Economico"],i:["250g polenta","1L leche","200ml caldo","Manteca 50g","Parmesano 80g","Sal y pimienta"],s:["Calentar leche y caldo con sal.","Volcar polenta en lluvia revolviendo constante.","Cocinar 5-7 min revolviendo hasta espesar.","Apagar fuego, agregar manteca y parmesano. Mezclar y servir."]},
  "Albondigas en salsa":{t:"40 min",d:"Facil",k:"480 kcal",p:"32g",e:"🍲",tags:["💰 Economico","⚡ Rendidor"],i:["500g carne picada","1 huevo","Pan rallado 4 cdas","Ajo y perejil","1 lata tomates","1 cebolla","Caldo","Oregano"],s:["Mezclar carne con huevo, pan rallado, ajo y perejil. Formar albondigas.","Dorar las albondigas en aceite. Reservar.","Rehogar cebolla, agregar tomates y caldo. Cocinar 10 min con oregano.","Volver las albondigas a la salsa. Cocinar tapado 20 min."]},
  "Pollo desmechado a la mexicana":{t:"40 min",d:"Facil",k:"420 kcal",p:"42g",e:"🌮",tags:["💪 Alta proteina","💰 Economico"],i:["2 pechugas grandes","1 cebolla","2 tomates","Comino, pimenton dulce, aji","Cilantro","Limon","Sal"],s:["Hervir pechugas en agua con sal 25 min. Desmechar con tenedores.","Saltear cebolla y tomate picados con comino, pimenton y aji.","Agregar el pollo desmechado y mezclar bien. Cocinar 5 min.","Sumar cilantro picado y jugo de limon. Servir con tortillas o arroz."]},
  "Bife de chorizo a la plancha con ensalada":{t:"15 min",d:"Facil",k:"520 kcal",p:"48g",e:"🥩",tags:["💪 Alta proteina","⚡ Rapido"],i:["2 bifes de chorizo 250g c/u","Rucula 150g","Tomate cherry 200g","Parmesano en escamas","Aceite de oliva","Limon","Sal gruesa y pimienta"],s:["Sacar los bifes de la heladera 15 min antes. Salpimentar con sal gruesa.","Plancha bien caliente, cocinar 4 min por lado para jugoso.","Dejar reposar 3 min antes de cortar.","Servir sobre rucula con cherry, parmesano y limon."]},
  "Lomo a la pimienta con pure":{t:"25 min",d:"Media",k:"560 kcal",p:"46g",e:"🥩",tags:["💪 Alta proteina"],i:["400g lomo de ternera","Pimienta negra en grano","Crema 100ml","Cognac o vino 50ml","Manteca 30g","4 papas","Leche 100ml","Sal"],s:["Cubrir el lomo con pimienta machacada. Sellar en manteca 3 min por lado.","Retirar, agregar cognac y flamear. Sumar crema y cocinar 3 min.","Hervir papas, pisar con leche y manteca para el pure.","Servir el lomo con la salsa de pimienta y pure al lado."]},
  "Entraña a la parrilla con chimichurri":{t:"20 min",d:"Facil",k:"480 kcal",p:"44g",e:"🥩",tags:["💪 Alta proteina","⚡ Rapido"],i:["500g entraña","Perejil fresco 1 atado","Ajo 4 dientes","Oregano","Aji molido","Vinagre de vino","Aceite de oliva","Sal gruesa"],s:["Preparar chimichurri: picar perejil y ajo, mezclar con oregano, aji, vinagre y aceite.","Salpimentar la entraña con sal gruesa.","Grillar a fuego fuerte 5 min por lado.","Dejar reposar 5 min, cortar en tiras y servir con chimichurri."]},
  "Vacio al horno con batatas":{t:"90 min",d:"Facil",k:"620 kcal",p:"50g",e:"🥩",tags:["💪 Alta proteina","⚡ Rendidor"],i:["1kg vacio","3 batatas","Sal gruesa","Romero","Ajo 4 dientes","Aceite de oliva","Limon"],s:["Salar el vacio generosamente. Dejar reposar 20 min.","Cortar batatas en gajos, mezclar con aceite, ajo y romero.","Horno a 200C, vacio del lado de la grasa para arriba, batatas alrededor.","Cocinar 70-80 min. Servir con limon."]},
  "Tira de asado con ensalada criolla":{t:"80 min",d:"Facil",k:"650 kcal",p:"52g",e:"🥩",tags:["💪 Alta proteina","⚡ Rendidor"],i:["1kg tira de asado","Sal gruesa","2 tomates","1 cebolla","1 morron","Oregano","Vinagre","Aceite"],s:["Salar la tira con sal gruesa. Horno a 200C.","Cocinar 70 min, dando vuelta a los 40 min.","Cortar tomate, cebolla y morron para la criolla. Condimentar con vinagre, aceite y oregano.","Servir la tira con la ensalada criolla al lado."]},
  "Carne al horno con verduras":{t:"60 min",d:"Facil",k:"490 kcal",p:"42g",e:"🥩",tags:["💪 Alta proteina","💰 Economico"],i:["800g roast beef o nalga","4 papas","3 zanahorias","2 cebollas","Romero y tomillo","Ajo","Aceite de oliva","Sal y pimienta"],s:["Sellar la carne en sarten con aceite por todos lados.","Cortar verduras en trozos grandes. Colocar todo en asadera.","Condimentar con hierbas, ajo, sal y pimienta.","Horno a 180C por 50 min. Dejar reposar 10 min antes de cortar."]},
  "Bondiola de cerdo al horno":{t:"120 min",d:"Media",k:"580 kcal",p:"45g",e:"🥩",tags:["💪 Alta proteina","⚡ Rendidor"],i:["1.5kg bondiola de cerdo","Miel 3 cdas","Mostaza 3 cdas","Salsa de soja 2 cdas","Ajo 4 dientes","Romero","Sal y pimienta"],s:["Mezclar miel, mostaza, soja, ajo y romero para la marinada.","Untar la bondiola por todos lados. Marinar 30 min minimo.","Envolver en papel aluminio. Horno a 160C por 90 min.","Abrir el aluminio, subir a 200C y dorar 15 min. Cortar en rodajas."]},
  "Costeletas de cerdo a la plancha":{t:"20 min",d:"Facil",k:"440 kcal",p:"38g",e:"🥩",tags:["💪 Alta proteina","⚡ Rapido"],i:["4 costeletas de cerdo","Limon","Ajo 2 dientes","Oregano","Sal y pimienta","Aceite de oliva","Ensalada verde"],s:["Marinar las costeletas con limon, ajo, oregano y aceite 10 min.","Plancha caliente, cocinar 4-5 min por lado.","No mover mientras se cocina para que selle bien.","Servir con ensalada verde y limon."]},
  "Milanesa de cerdo con ensalada":{t:"25 min",d:"Facil",k:"520 kcal",p:"36g",e:"🥩",tags:["💪 Alta proteina","💰 Economico"],i:["4 escalopes de cerdo","2 huevos","Pan rallado","Ajo y perejil","Lechuga, tomate y cebolla","Aceite para freir","Sal"],s:["Aplanar los escalopes. Pasar por huevo batido y pan rallado con ajo y perejil.","Freir en aceite caliente 3 min por lado hasta dorar.","Escurrir en papel absorbente.","Servir con ensalada fresca."]},
  "Carré de cerdo con manzanas":{t:"50 min",d:"Media",k:"510 kcal",p:"40g",e:"🥩",tags:["💪 Alta proteina"],i:["1kg carre de cerdo","3 manzanas verdes","Miel 2 cdas","Mostaza 2 cdas","Romero","Manteca 30g","Sal y pimienta","Vino blanco 100ml"],s:["Sellar el carre en sarten con manteca por todos lados.","Cortar manzanas en gajos. Mezclar miel con mostaza.","Colocar en asadera, pincelar con miel-mostaza, agregar manzanas y romero.","Horno a 180C por 40 min. Verter vino a la mitad de coccion."]},
  "Merluza al horno con papas":{t:"30 min",d:"Facil",k:"320 kcal",p:"34g",e:"🐟",tags:["🔥 Bajo en calorias","💚 Desinflamatorio"],i:["4 filetes de merluza","4 papas","Limon x2","Ajo 3 dientes","Perejil fresco","Aceite de oliva","Sal y pimienta"],s:["Cortar papas en rodajas finas y disponerlas en asadera aceitada.","Colocar la merluza encima. Condimentar con ajo, limon, perejil y aceite.","Horno a 200C por 25 min.","Servir con mas limon fresco encima."]},
  "Merluza a la provenzal":{t:"20 min",d:"Facil",k:"280 kcal",p:"32g",e:"🐟",tags:["🔥 Bajo en calorias","⚡ Rapido"],i:["4 filetes de merluza","4 dientes ajo","Perejil 1 atado","Pan rallado 3 cdas","Limon","Aceite de oliva","Sal y pimienta"],s:["Mezclar ajo picado, perejil, pan rallado y aceite para la provenzal.","Salpimentar los filetes y colocar en asadera.","Cubrir con la mezcla provenzal.","Horno a 200C por 15-18 min hasta que dore."]},
  "Filet de trucha grillada con vegetales":{t:"25 min",d:"Facil",k:"360 kcal",p:"38g",e:"🐟",tags:["💪 Alta proteina","💚 Desinflamatorio"],i:["2 filetes de trucha","Esparragos 200g","Zapallito 2","Limon","Eneldo fresco","Aceite de oliva","Sal y pimienta"],s:["Salpimentar los filetes de trucha con limon y eneldo.","Grillar en sarten caliente 3-4 min por lado.","Saltear esparragos y zapallito en la misma sarten 5 min.","Servir el pescado sobre las verduras con limon fresco."]},
  "Atun fresco sellado con sesamo":{t:"15 min",d:"Media",k:"420 kcal",p:"46g",e:"🐟",tags:["💪 Alta proteina","⚡ Rapido"],i:["2 filetes de atun fresco 200g c/u","Sesamo blanco y negro","Salsa de soja 3 cdas","Jengibre rallado","Aceite de sesamo","Palta 1","Pepino 1"],s:["Cubrir los filetes de atun con sesamo por todos lados.","Sarten muy caliente con aceite de sesamo, sellar 1-2 min por lado.","El centro debe quedar rosado. Cortar en laminas.","Servir con palta, pepino y soja con jengibre."]},
  "Cazuela de mariscos":{t:"35 min",d:"Media",k:"380 kcal",p:"36g",e:"🐟",tags:["💪 Alta proteina","💚 Desinflamatorio"],i:["200g langostinos","200g mejillones","200g calamares","1 lata tomates","1 cebolla","Ajo 3 dientes","Vino blanco 100ml","Perejil","Aji molido"],s:["Rehogar cebolla y ajo. Agregar tomates y vino. Cocinar 10 min.","Agregar calamares cortados en anillos. Cocinar 5 min.","Sumar langostinos y mejillones. Tapar y cocinar 8 min.","Servir con perejil fresco y pan tostado."]},
  "Bife de lomo con papas al romero":{t:"25 min",d:"Facil",k:"540 kcal",p:"50g",e:"🥩",tags:["💪 Alta proteina","⚡ Rapido"],i:["2 bifes de lomo 250g c/u","4 papas","Romero fresco","Manteca 20g","Ajo 2 dientes","Sal gruesa y pimienta","Aceite de oliva"],s:["Cortar papas en cubos, hervir 10 min. Escurrir.","Saltear papas en sarten con aceite, romero y ajo hasta dorar.","Sellar los bifes en sarten caliente con manteca 3-4 min por lado.","Dejar reposar 3 min. Servir con las papas al romero."]},
  "Osobuco braseado con pure":{t:"120 min",d:"Media",k:"580 kcal",p:"44g",e:"🥩",tags:["💪 Alta proteina","⚡ Rendidor"],i:["4 osobucos","2 zanahorias","2 ramas apio","1 cebolla","1 lata tomates","Caldo 500ml","Vino tinto 200ml","Ajo, laurel y tomillo"],s:["Sellar los osobucos en aceite caliente por ambos lados. Retirar.","Rehogar cebolla, zanahoria y apio 5 min.","Volver los osobucos, agregar vino, tomates, caldo y hierbas.","Tapar y horno a 160C por 2 horas. Servir con pure de papas."]},
  "Bife a la criolla con arroz":{t:"30 min",d:"Facil",k:"520 kcal",p:"42g",e:"🥩",tags:["💪 Alta proteina","💰 Economico"],i:["4 bifes de paleta","2 tomates","1 cebolla","1 morron","Papas 2","Caldo","Pimenton y comino","Arroz 1 taza"],s:["Sellar los bifes y reservar. Rehogar cebolla y morron.","Agregar tomate, papas en cubos, caldo y condimentos.","Volver los bifes a la salsa. Cocinar tapado 20 min.","Cocinar arroz aparte. Servir los bifes con la salsa y arroz."]},
  "Colita de cuadril con ensalada rusa":{t:"50 min",d:"Facil",k:"490 kcal",p:"44g",e:"🥩",tags:["💪 Alta proteina","⚡ Rendidor"],i:["800g colita de cuadril","Sal gruesa","Oregano","Ajo","4 papas","3 zanahorias","Arvejas 200g","Mayonesa 4 cdas"],s:["Salpimentar la colita con sal gruesa, ajo y oregano. Horno a 200C por 40 min.","Hervir papas y zanahorias en cubos hasta tiernas.","Mezclar con arvejas y mayonesa para la ensalada rusa.","Cortar la colita en rodajas. Servir con la ensalada rusa."]},
  "Peceto mechado con pure":{t:"90 min",d:"Media",k:"460 kcal",p:"48g",e:"🥩",tags:["💪 Alta proteina","⚡ Rendidor"],i:["1kg peceto","150g panceta","2 zanahorias","2 cebollas","Caldo 500ml","Vino tinto 200ml","Laurel","4 papas","Leche y manteca"],s:["Mechar el peceto con tiras de panceta y zanahoria usando cuchillo.","Sellar en olla, agregar cebolla, caldo, vino y laurel.","Cocinar tapado a fuego bajo 80 min.","Hacer pure de papas. Cortar el peceto en rodajas con la salsa."]},
  "Hamburguesa de carne con batatas fritas":{t:"30 min",d:"Facil",k:"580 kcal",p:"38g",e:"🍔",tags:["💪 Alta proteina","💰 Economico"],i:["500g carne picada","1 huevo","Pan rallado 3 cdas","2 batatas","Pan de hamburguesa x4","Lechuga, tomate","Queso cheddar","Sal, pimienta y ajo"],s:["Cortar batatas en bastones y hornear a 200C con aceite 25 min.","Mezclar carne con huevo, pan rallado, ajo, sal y pimienta.","Formar 4 hamburguesas. Cocinar en plancha 4-5 min por lado.","Armar con pan, lechuga, tomate y cheddar. Servir con batatas."]},
  "Tilapia con arroz y brocoli":{t:"25 min",d:"Facil",k:"340 kcal",p:"36g",e:"🐟",tags:["🔥 Bajo en calorias","💪 Alta proteina"],i:["4 filetes de tilapia","1 taza arroz","300g brocoli","Limon","Ajo","Pimenton","Aceite de oliva","Sal"],s:["Cocinar arroz con sal. Brocoli al vapor 6 min.","Condimentar tilapia con limon, ajo, pimenton y sal.","Cocinar en sarten con aceite 3-4 min por lado.","Servir con arroz y brocoli."]},
  "Steak de nalga con vegetales grillados":{t:"25 min",d:"Facil",k:"460 kcal",p:"44g",e:"🥩",tags:["💪 Alta proteina","💚 Desinflamatorio"],i:["2 steaks de nalga 200g c/u","1 zapallito","1 berenjena","1 morron","Aceite de oliva","Limon","Ajo","Sal y pimienta"],s:["Cortar vegetales en rodajas gruesas. Pincelar con aceite.","Grillar vegetales en plancha caliente 3-4 min por lado.","Salpimentar los steaks. Grillar 4 min por lado.","Servir todo junto con limon y ajo."]},
  "Cerdo agridulce con arroz":{t:"30 min",d:"Facil",k:"510 kcal",p:"35g",e:"🥩",tags:["💪 Alta proteina","⚡ Rendidor"],i:["400g bondiola en cubos","1 morron","1 cebolla","Anana en cubos 200g","Salsa de soja 3 cdas","Vinagre 2 cdas","Azucar 2 cdas","Almidon de maiz","Arroz 1 taza"],s:["Cocinar arroz aparte. Pasar cerdo por almidon y dorar en sarten.","Retirar cerdo. Saltear cebolla y morron 4 min.","Mezclar soja, vinagre y azucar. Verter en la sarten.","Volver el cerdo, agregar anana. Cocinar 5 min hasta espesar. Servir con arroz."]},
};

const LISTAS = {
  bajar_peso:{"🥩 Proteinas":["Pechuga de pollo 1kg","Atun al natural x3","Huevos x12","Salmon 400g"],"🥦 Verduras":["Espinaca 500g","Brocoli 500g","Tomate cherry 500g","Pepino x2","Zapallo 1kg","Rucula y lechuga"],"🌾 Cereales":["Quinoa 500g","Arroz integral 1kg"],"🧴 Almacen":["Aceite de oliva 500ml","Limon x4","Caldo en cubos x4","Yogur natural x2"],"🧀 Lacteos":["Ricota 250g","Queso rallado 150g"]},
  saludable:{"🥩 Proteinas":["Pechuga de pollo 1kg","Salmon 400g","Huevos x12","Garbanzos 500g"],"🥦 Verduras":["Espinaca 500g","Zapallo 1kg","Zanahoria x4","Tomates x6","Brocoli 500g","Palta x2"],"🌾 Cereales":["Arroz integral 1kg","Quinoa 500g"],"🧴 Almacen":["Aceite de oliva 500ml","Limon x3","Caldo en cubos x4"],"🧀 Lacteos":["Ricota 500g","Queso cremoso 400g","Mozzarella 200g"]},
  ahorrar:{"🥩 Proteinas":["Pollo entero 1.5kg","Carne para guiso 500g","Carne picada 500g","Huevos x12","Atun x2"],"🥦 Verduras":["Papa 2kg","Cebolla 1kg","Zanahoria 500g","Zapallo 1kg","Tomates x6"],"🌾 Cereales":["Arroz 1kg","Fideos 500g x2","Lentejas 500g","Harina 1kg"],"🧴 Almacen":["Aceite 1L","Salsa de tomate x3","Caldo en cubos x6","Pan"],"🧀 Lacteos":["Queso rallado 200g","Queso cremoso 400g"]},
  masa:{"🥩 Proteinas":["Pechuga de pollo 1.5kg","Carne magra 500g","Huevos x18","Atun x3","Salmon 400g"],"🥦 Verduras":["Brocoli 500g","Espinaca 500g","Tomates x4","Batata 1.5kg"],"🌾 Cereales":["Arroz integral 1kg","Quinoa 500g"],"🧴 Almacen":["Aceite de oliva 500ml","Limon x4","Caldo en cubos x4"],"🧀 Lacteos":["Queso cottage 500g","Leche 2L","Queso rallado 200g"]},
  organizar:{"🥩 Proteinas":["Pollo entero 1.5kg","Carne picada 500g","Carne para guiso 500g","Huevos x12","Atun x2"],"🥦 Verduras":["Cebolla 1kg","Papa 2kg","Zanahoria 500g","Tomates x6","Espinaca 500g"],"🌾 Cereales":["Arroz 1kg","Fideos 500g x2","Lentejas 500g"],"🧴 Almacen":["Aceite 1L","Salsa de tomate x4","Caldo en cubos x8","Pan"],"🧀 Lacteos":["Queso rallado 200g","Queso cremoso 300g"]},
  desinflamatoria:{"🥩 Proteinas":["Salmon rosado 600g","Pechuga de pollo 1kg","Huevos x12","Sardinas en aceite x2"],"🥦 Verduras":["Espinaca 500g","Brocoli 500g","Zanahoria x4","Tomates x6","Zapallo 1kg","Esparragos 300g"],"🌾 Cereales":["Quinoa 500g","Arroz integral 1kg"],"🧴 Almacen":["Aceite de oliva extra virgen","Curcuma molida","Jengibre fresco","Limon x6","Semillas de chia 200g"],"🥑 Extras":["Palta x4","Leche de coco 400ml","Arandanos o frutos rojos 300g"]},
};

const DIAS = ["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo"];

const META = {
  bajar_peso:{tag:"Deficit calorico",tip:"Proteinas magras y vegetales de alto volumen. Cada comida ronda las 200-450 kcal.",precio:{bajo:"$35.000-45.000",medio:"$50.000-65.000",alto:"$70.000-90.000"},kw:["bajo en calorias","alta proteina","express","desinflamatorio"]},
  saludable:{tag:"Nutricion completa",tip:"Plan balanceado con todos los macronutrientes. Variedad de colores = variedad de nutrientes.",precio:{bajo:"$40.000-55.000",medio:"$60.000-80.000",alto:"$90.000-120.000"},kw:["desinflamatorio","alta proteina","vegetar","rendidor"]},
  ahorrar:{tag:"Maximo ahorro",tip:"Priorizamos legumbres, huevos y pollo. Las proteinas mas economicas y rendidoras.",precio:{bajo:"$18.000-28.000",medio:"$28.000-40.000",alto:"$40.000-55.000"},kw:["economico","rendidor","express"]},
  masa:{tag:"Alta proteina",tip:"1.6-2.2g de proteina por kg corporal. Superavit calorico moderado de 300-500 kcal/dia.",precio:{bajo:"$45.000-60.000",medio:"$65.000-85.000",alto:"$90.000-130.000"},kw:["alta proteina","rendidor"]},
  organizar:{tag:"Batch cooking",tip:"Cocinas 2 veces por semana y resolves todo. El domingo es clave: 2 horas = 7 dias resueltos.",precio:{bajo:"$22.000-32.000",medio:"$35.000-50.000",alto:"$55.000-75.000"},kw:["batch","rendidor","economico"]},
  desinflamatoria:{tag:"Antiinflamatorio",tip:"Curcuma, jengibre, omega-3 y antioxidantes como base. Eliminamos procesados y azucar refinada.",precio:{bajo:"$45.000-60.000",medio:"$65.000-90.000",alto:"$95.000-130.000"},kw:["desinflamatorio","alta proteina","vegetar"]},
};

// ============================================
// LISTA DE COMPRAS DINÁMICA v2 — consolidación real + precios
// ============================================
// Precios promedio ARS (abril 2026) — actualizar 1 vez por mes
const PRECIOS = {
  pollo:5500, pechuga:4200, carne_picada:5800, bife:7500, lomo:9500, cerdo:5000, bondiola:6500,
  entraña:8500, vacio:7800, tira:6000, osobuco:4500, peceto:7000, nalga:6800, cuadril:7200,
  milanesa:5500, costeleta:4800, carre:7500, panceta:4000, hamburguesa:5200, escalope:4500,
  salmon:8500, merluza:4200, atun_lata:1800, trucha:7000, tilapia:4500, langostino:6500,
  mejillon:4000, calamar:5000, sardina:1500,
  huevos:3500, claras:2800, ricota:2800, queso_cremoso:3200, queso_rallado:2500, mozzarella:3500,
  yogur:1200, leche:1400, crema:2200, manteca:2800, parmesano:3500, cheddar:2800, feta:3200,
  espinaca:1800, brocoli:2200, tomate:800, cebolla:400, zanahoria:500, papa:600, batata:900,
  zapallo:800, zapallito:700, morron:1200, lechuga:1000, rucula:1800, pepino:700, berenjena:1000,
  esparrago:3500, palta:1500, champinon:2800, apio:1000, arveja:1200, limon:300, manzana:800,
  jengibre:1500, anana:2500, tomate_cherry:1800, cebolla_morada:600, albahaca:800, perejil:500,
  arroz:1400, arroz_integral:1800, fideos:1200, quinoa:3200, lentejas:1600, garbanzos:1800,
  harina:900, pan:1500, tortilla:1000, tapa_tarta:1800, polenta:800, almidon:700,
  aceite_oliva:4500, aceite:2200, caldo_cubos:600, salsa_tomate:1000, soja:1200,
  vinagre:800, mostaza:900, miel:2200, sesamo:1500, chia:2000, vino:3500,
  condimentos:0, sal:0, pimienta:0, hierbas:0,
};

// Parse quantity from ingredient string
function parseQty(s) {
  let m;
  m = s.match(/^(\d+)\/(\d+)\s/);
  if (m) return { qty: parseInt(m[1])/parseInt(m[2]), unit:"u" };
  m = s.match(/^(\d+)\s*g\b/);
  if (m) return { qty: parseInt(m[1]), unit:"g" };
  m = s.match(/^(\d+)\s*ml\b/);
  if (m) return { qty: parseInt(m[1]), unit:"ml" };
  m = s.match(/^([\d.]+)\s*kg\b/);
  if (m) return { qty: parseFloat(m[1])*1000, unit:"g" };
  m = s.match(/x(\d+)$/);
  if (m) return { qty: parseInt(m[1]), unit:"u" };
  m = s.match(/^(\d+)\s*tazas?\b/);
  if (m) return { qty: parseInt(m[1]), unit:"taza" };
  m = s.match(/^(\d+)\s+\w/);
  if (m) return { qty: parseInt(m[1]), unit:"u" };
  return { qty: 1, unit:"u" };
}
function fmtQty(qty, unit) {
  if (unit === "g" && qty >= 1000) return `${(qty/1000).toFixed(1).replace('.0','')} kg`;
  if (unit === "g") return `${Math.round(qty)}g`;
  if (unit === "ml" && qty >= 1000) return `${(qty/1000).toFixed(1).replace('.0','')} L`;
  if (unit === "ml") return `${Math.round(qty)}ml`;
  if (unit === "taza") return qty <= 1 ? "1 taza" : `${Math.ceil(qty)} tazas`;
  if (unit === "lata") return qty <= 1 ? "1 lata" : `${Math.ceil(qty)} latas`;
  if (unit === "atado") return qty <= 1 ? "1 atado" : `${Math.ceil(qty)} atados`;
  if (unit === "paq") return qty <= 1 ? "1 paq" : `${Math.ceil(qty)} paq`;
  if (unit === "frasco") return "1 frasco";
  if (unit === "docena") return qty <= 1 ? "1 docena" : `${Math.ceil(qty)} doc`;
  if (qty === 0.5) return "½";
  if (qty === Math.floor(qty)) return `${Math.ceil(qty)}`;
  return `${Math.ceil(qty)}`;
}

// Map raw ingredient → canonical key + qty
function normalizeIng(raw) {
  const s = raw.toLowerCase().trim();
  const q = parseQty(s);
  // Proteínas
  if (/pechuga|presas? de pollo|pollo entero/.test(s)) return { key:"pollo", label:"Pollo", cat:"🥩 Carnicería", price:"pollo" };
  if (/carne picada/.test(s)) return { key:"carne_picada", label:"Carne picada", cat:"🥩 Carnicería", price:"carne_picada" };
  if (/carne para guiso|carne magra/.test(s)) return { key:"carne_guiso", label:"Carne para guiso", cat:"🥩 Carnicería", price:"bife" };
  if (/bife de chorizo/.test(s)) return { key:"bife_chorizo", label:"Bife de chorizo", cat:"🥩 Carnicería", price:"bife" };
  if (/bife.*(lomo|paleta)/.test(s)) return { key:"bife", label:"Bife", cat:"🥩 Carnicería", price:"bife" };
  if (/lomo de ternera|lomo\b/.test(s)) return { key:"lomo", label:"Lomo", cat:"🥩 Carnicería", price:"lomo" };
  if (/bondiola/.test(s)) return { key:"bondiola", label:"Bondiola de cerdo", cat:"🥩 Carnicería", price:"bondiola" };
  if (/costeleta/.test(s)) return { key:"costeleta", label:"Costeletas de cerdo", cat:"🥩 Carnicería", price:"costeleta" };
  if (/escalope/.test(s)) return { key:"escalope", label:"Escalopes de cerdo", cat:"🥩 Carnicería", price:"escalope" };
  if (/carre/.test(s)) return { key:"carre", label:"Carré de cerdo", cat:"🥩 Carnicería", price:"carre" };
  if (/entraña/.test(s)) return { key:"entraña", label:"Entraña", cat:"🥩 Carnicería", price:"entraña" };
  if (/vacio/.test(s)) return { key:"vacio", label:"Vacío", cat:"🥩 Carnicería", price:"vacio" };
  if (/tira de asado|tira\b/.test(s)) return { key:"tira", label:"Tira de asado", cat:"🥩 Carnicería", price:"tira" };
  if (/osobuco/.test(s)) return { key:"osobuco", label:"Osobuco", cat:"🥩 Carnicería", price:"osobuco" };
  if (/peceto/.test(s)) return { key:"peceto", label:"Peceto", cat:"🥩 Carnicería", price:"peceto" };
  if (/nalga|steak.?de nalga/.test(s)) return { key:"nalga", label:"Nalga", cat:"🥩 Carnicería", price:"nalga" };
  if (/colita|cuadril/.test(s)) return { key:"cuadril", label:"Colita de cuadril", cat:"🥩 Carnicería", price:"cuadril" };
  if (/milanesa/.test(s)) return { key:"milanesa", label:"Milanesas", cat:"🥩 Carnicería", price:"milanesa" };
  if (/panceta/.test(s)) return { key:"panceta", label:"Panceta", cat:"🥩 Carnicería", price:"panceta" };
  if (/hamburguesa|carne picada/.test(s) && !s.includes("pan")) return { key:"carne_picada", label:"Carne picada", cat:"🥩 Carnicería", price:"carne_picada" };
  // Pescados
  if (/salmon/.test(s)) return { key:"salmon", label:"Salmón", cat:"🐟 Pescadería", price:"salmon" };
  if (/merluza/.test(s)) return { key:"merluza", label:"Merluza", cat:"🐟 Pescadería", price:"merluza" };
  if (/atun fresco/.test(s)) return { key:"atun_fresco", label:"Atún fresco", cat:"🐟 Pescadería", price:"salmon" };
  if (/atun|lata atun/.test(s)) return { key:"atun_lata", label:"Atún en lata", cat:"🌾 Almacén", price:"atun_lata" };
  if (/trucha/.test(s)) return { key:"trucha", label:"Trucha", cat:"🐟 Pescadería", price:"trucha" };
  if (/tilapia/.test(s)) return { key:"tilapia", label:"Tilapia", cat:"🐟 Pescadería", price:"tilapia" };
  if (/langostino/.test(s)) return { key:"langostino", label:"Langostinos", cat:"🐟 Pescadería", price:"langostino" };
  if (/mejillon/.test(s)) return { key:"mejillon", label:"Mejillones", cat:"🐟 Pescadería", price:"mejillon" };
  if (/calamar/.test(s)) return { key:"calamar", label:"Calamares", cat:"🐟 Pescadería", price:"calamar" };
  if (/sardina/.test(s)) return { key:"sardina", label:"Sardinas", cat:"🌾 Almacén", price:"sardina" };
  // Huevos y lácteos
  if (/clara/.test(s) && /huevo/.test(s)) return { key:"huevos", label:"Huevos", cat:"🥚 Lácteos y Huevos", price:"huevos" };
  if (/clara/.test(s)) return { key:"huevos", label:"Huevos", cat:"🥚 Lácteos y Huevos", price:"huevos" };
  if (/huevo/.test(s)) return { key:"huevos", label:"Huevos (docena)", cat:"🥚 Lácteos y Huevos", price:"huevos" };
  if (/ricota/.test(s)) return { key:"ricota", label:"Ricota", cat:"🥚 Lácteos y Huevos", price:"ricota" };
  if (/queso rallado|queso de rallar/.test(s)) return { key:"queso_rallado", label:"Queso rallado", cat:"🥚 Lácteos y Huevos", price:"queso_rallado" };
  if (/queso cremoso/.test(s)) return { key:"queso_cremoso", label:"Queso cremoso", cat:"🥚 Lácteos y Huevos", price:"queso_cremoso" };
  if (/mozzarella/.test(s)) return { key:"mozzarella", label:"Mozzarella", cat:"🥚 Lácteos y Huevos", price:"mozzarella" };
  if (/parmesano/.test(s)) return { key:"parmesano", label:"Parmesano", cat:"🥚 Lácteos y Huevos", price:"parmesano" };
  if (/cheddar/.test(s)) return { key:"cheddar", label:"Queso cheddar", cat:"🥚 Lácteos y Huevos", price:"cheddar" };
  if (/feta/.test(s)) return { key:"feta", label:"Queso feta", cat:"🥚 Lácteos y Huevos", price:"feta" };
  if (/cottage/.test(s)) return { key:"cottage", label:"Queso cottage", cat:"🥚 Lácteos y Huevos", price:"queso_cremoso" };
  if (/yogur/.test(s)) return { key:"yogur", label:"Yogur natural", cat:"🥚 Lácteos y Huevos", price:"yogur" };
  if (/leche de coco/.test(s)) return { key:"leche_coco", label:"Leche de coco", cat:"🌾 Almacén", price:"leche" };
  if (/leche/.test(s)) return { key:"leche", label:"Leche", cat:"🥚 Lácteos y Huevos", price:"leche" };
  if (/crema/.test(s)) return { key:"crema", label:"Crema de leche", cat:"🥚 Lácteos y Huevos", price:"crema" };
  if (/manteca/.test(s)) return { key:"manteca", label:"Manteca", cat:"🥚 Lácteos y Huevos", price:"manteca" };
  // Verduras
  if (/espinaca/.test(s)) return { key:"espinaca", label:"Espinaca", cat:"🥦 Verdulería", price:"espinaca" };
  if (/brocoli/.test(s)) return { key:"brocoli", label:"Brócoli", cat:"🥦 Verdulería", price:"brocoli" };
  if (/tomate cherry/.test(s)) return { key:"tomate_cherry", label:"Tomate cherry", cat:"🥦 Verdulería", price:"tomate_cherry" };
  if (/tomate/.test(s) && /lata/.test(s)) return { key:"tomate_lata", label:"Tomates en lata", cat:"🌾 Almacén", price:"salsa_tomate" };
  if (/tomate/.test(s)) return { key:"tomate", label:"Tomates", cat:"🥦 Verdulería", price:"tomate" };
  if (/cebolla morada/.test(s)) return { key:"cebolla", label:"Cebolla", cat:"🥦 Verdulería", price:"cebolla" };
  if (/cebolla/.test(s)) return { key:"cebolla", label:"Cebolla", cat:"🥦 Verdulería", price:"cebolla" };
  if (/zanahoria/.test(s)) return { key:"zanahoria", label:"Zanahoria", cat:"🥦 Verdulería", price:"zanahoria" };
  if (/papa/.test(s) && !/paprika/.test(s)) return { key:"papa", label:"Papas", cat:"🥦 Verdulería", price:"papa" };
  if (/batata/.test(s)) return { key:"batata", label:"Batatas", cat:"🥦 Verdulería", price:"batata" };
  if (/zapallito/.test(s)) return { key:"zapallito", label:"Zapallito", cat:"🥦 Verdulería", price:"zapallito" };
  if (/zapallo/.test(s)) return { key:"zapallo", label:"Zapallo", cat:"🥦 Verdulería", price:"zapallo" };
  if (/morron/.test(s)) return { key:"morron", label:"Morrón", cat:"🥦 Verdulería", price:"morron" };
  if (/lechuga/.test(s)) return { key:"lechuga", label:"Lechuga", cat:"🥦 Verdulería", price:"lechuga" };
  if (/rucula/.test(s)) return { key:"rucula", label:"Rúcula", cat:"🥦 Verdulería", price:"rucula" };
  if (/pepino/.test(s)) return { key:"pepino", label:"Pepino", cat:"🥦 Verdulería", price:"pepino" };
  if (/berenjena/.test(s)) return { key:"berenjena", label:"Berenjena", cat:"🥦 Verdulería", price:"berenjena" };
  if (/esparrago/.test(s)) return { key:"esparrago", label:"Espárragos", cat:"🥦 Verdulería", price:"esparrago" };
  if (/palta/.test(s)) return { key:"palta", label:"Palta", cat:"🥦 Verdulería", price:"palta" };
  if (/champi/.test(s)) return { key:"champinon", label:"Champiñones", cat:"🥦 Verdulería", price:"champinon" };
  if (/apio/.test(s)) return { key:"apio", label:"Apio", cat:"🥦 Verdulería", price:"apio" };
  if (/arveja/.test(s)) return { key:"arveja", label:"Arvejas", cat:"🥦 Verdulería", price:"arveja" };
  if (/limon/.test(s)) return { key:"limon", label:"Limones", cat:"🥦 Verdulería", price:"limon" };
  if (/manzana/.test(s)) return { key:"manzana", label:"Manzanas", cat:"🥦 Verdulería", price:"manzana" };
  if (/jengibre/.test(s)) return { key:"jengibre", label:"Jengibre", cat:"🥦 Verdulería", price:"jengibre" };
  if (/anana/.test(s)) return { key:"anana", label:"Ananá", cat:"🥦 Verdulería", price:"anana" };
  // Almacén
  if (/arroz integral|arroz arborio/.test(s)) return { key:"arroz_int", label:"Arroz integral", cat:"🌾 Almacén", price:"arroz_integral" };
  if (/arroz/.test(s)) return { key:"arroz", label:"Arroz", cat:"🌾 Almacén", price:"arroz" };
  if (/fideos int/.test(s)) return { key:"fideos_int", label:"Fideos integrales", cat:"🌾 Almacén", price:"fideos" };
  if (/fideos/.test(s)) return { key:"fideos", label:"Fideos", cat:"🌾 Almacén", price:"fideos" };
  if (/quinoa/.test(s)) return { key:"quinoa", label:"Quinoa", cat:"🌾 Almacén", price:"quinoa" };
  if (/lenteja/.test(s)) return { key:"lentejas", label:"Lentejas", cat:"🌾 Almacén", price:"lentejas" };
  if (/garbanzo/.test(s)) return { key:"garbanzos", label:"Garbanzos", cat:"🌾 Almacén", price:"garbanzos" };
  if (/harina/.test(s)) return { key:"harina", label:"Harina", cat:"🌾 Almacén", price:"harina" };
  if (/pan de hamburguesa/.test(s)) return { key:"pan_hamb", label:"Pan de hamburguesa", cat:"🌾 Almacén", price:"pan" };
  if (/pan rallado/.test(s)) return { key:"pan_rallado", label:"Pan rallado", cat:"🌾 Almacén", price:"harina" };
  if (/pan\b/.test(s)) return { key:"pan", label:"Pan", cat:"🌾 Almacén", price:"pan" };
  if (/tortilla/.test(s)) return { key:"tortilla", label:"Tortillas", cat:"🌾 Almacén", price:"tortilla" };
  if (/tapa.*tarta|tapa integral/.test(s)) return { key:"tapa_tarta", label:"Tapa de tarta", cat:"🌾 Almacén", price:"tapa_tarta" };
  if (/almidon/.test(s)) return { key:"almidon", label:"Almidón de maíz", cat:"🌾 Almacén", price:"almidon" };
  if (/sesamo/.test(s)) return { key:"sesamo", label:"Sésamo", cat:"🌾 Almacén", price:"sesamo" };
  if (/chia/.test(s)) return { key:"chia", label:"Semillas de chía", cat:"🌾 Almacén", price:"chia" };
  if (/arandano|frutos rojos/.test(s)) return { key:"frutos_rojos", label:"Frutos rojos", cat:"🌾 Almacén", price:"chia" };
  if (/aceitunas|oliva/.test(s) && !/aceite/.test(s)) return { key:"aceitunas", label:"Aceitunas", cat:"🌾 Almacén", price:"sardina" };
  if (/salsa de tomate/.test(s)) return { key:"salsa_tomate", label:"Salsa de tomate", cat:"🌾 Almacén", price:"salsa_tomate" };
  // Condimentos (no suman precio, los tenés en casa)
  if (/ajo/.test(s)) return { key:"ajo", label:"Ajo", cat:"🧴 Ya tenés en casa", price:"condimentos" };
  if (/perejil/.test(s)) return { key:"perejil", label:"Perejil fresco", cat:"🥦 Verdulería", price:"perejil" };
  if (/albahaca/.test(s)) return { key:"albahaca", label:"Albahaca fresca", cat:"🥦 Verdulería", price:"albahaca" };
  if (/eneldo/.test(s)) return { key:"eneldo", label:"Eneldo", cat:"🥦 Verdulería", price:"albahaca" };
  if (/aceite de oliva/.test(s)) return { key:"aceite_oliva", label:"Aceite de oliva", cat:"🧴 Ya tenés en casa", price:"condimentos" };
  if (/aceite de sesamo/.test(s)) return { key:"aceite_sesamo", label:"Aceite de sésamo", cat:"🧴 Ya tenés en casa", price:"condimentos" };
  if (/aceite/.test(s)) return { key:"aceite", label:"Aceite", cat:"🧴 Ya tenés en casa", price:"condimentos" };
  if (/sal|pimienta/.test(s)) return { key:"sal", label:"Sal y pimienta", cat:"🧴 Ya tenés en casa", price:"condimentos" };
  if (/caldo/.test(s)) return { key:"caldo", label:"Caldo en cubos", cat:"🧴 Ya tenés en casa", price:"condimentos" };
  if (/oregano|romero|tomillo|laurel|comino|pimenton|aji|curcuma|nuez moscada/.test(s)) return { key:"hierbas", label:"Condimentos y hierbas", cat:"🧴 Ya tenés en casa", price:"condimentos" };
  if (/soja|salsa de soja/.test(s)) return { key:"soja", label:"Salsa de soja", cat:"🧴 Ya tenés en casa", price:"condimentos" };
  if (/vinagre/.test(s)) return { key:"vinagre", label:"Vinagre", cat:"🧴 Ya tenés en casa", price:"condimentos" };
  if (/mostaza/.test(s)) return { key:"mostaza", label:"Mostaza", cat:"🧴 Ya tenés en casa", price:"condimentos" };
  if (/miel/.test(s)) return { key:"miel", label:"Miel", cat:"🧴 Ya tenés en casa", price:"condimentos" };
  if (/cognac|vino/.test(s)) return { key:"vino", label:"Vino para cocinar", cat:"🧴 Ya tenés en casa", price:"condimentos" };
  if (/azucar/.test(s)) return { key:"azucar", label:"Azúcar", cat:"🧴 Ya tenés en casa", price:"condimentos" };
  if (/mayonesa/.test(s)) return { key:"mayo", label:"Mayonesa", cat:"🧴 Ya tenés en casa", price:"condimentos" };
  // Fallback
  return { key:s.substring(0,20), label:raw, cat:"🛒 Otros", price:"condimentos" };
}

function buildDynamicList(menu) {
  // Default weights when raw string has no number (grams)
  const DEFAULT_G = { pollo:300, carne_picada:500, carne_guiso:500, bife_chorizo:500, bife:400, lomo:400, bondiola:1500, costeleta:800, escalope:600, carre:1000, entraña:500, vacio:1000, tira:1000, osobuco:800, peceto:1000, nalga:400, cuadril:800, milanesa:600, panceta:150, salmon:400, merluza:500, atun_fresco:400, trucha:500, tilapia:500, langostino:200, mejillon:200, calamar:200 };
  const DEFAULT_U = { huevos:4, tomate:2, cebolla:1, zanahoria:1, papa:2, morron:1, zapallito:1, batata:1, pepino:1, berenjena:1, limon:1, manzana:2, apio:2, tomate_cherry:200, espinaca:200, brocoli:300, champinon:200, zapallo:800, rucula:150, palta:1, esparrago:200, arveja:200, anana:200, jengibre:1 };

  const consolidated = {};
  menu.forEach(d => {
    [d.alm, d.cen].forEach(nombre => {
      const r = R[nombre];
      if (!r || !r.i) return;
      r.i.forEach(raw => {
        const n = normalizeIng(raw);
        const q = parseQty(raw.toLowerCase().trim());
        if (!consolidated[n.key]) {
          consolidated[n.key] = { ...n, recetas: 0, totalG: 0, totalMl: 0, totalU: 0, totalTaza: 0, totalLata: 0 };
        }
        const c = consolidated[n.key];
        c.recetas += 1;

        // Determine what to add based on parsed qty and category
        const isProtein = c.cat === "🥩 Carnicería" || c.cat === "🐟 Pescadería";

        if (q.unit === "g") {
          c.totalG += q.qty;
        } else if (q.unit === "ml") {
          c.totalMl += q.qty;
        } else if (q.unit === "taza") {
          c.totalTaza += q.qty;
        } else if (q.unit === "lata") {
          c.totalLata += q.qty;
        } else if (isProtein) {
          // For proteins, convert units to grams using defaults
          const perUnit = (DEFAULT_G[n.key] || 300);
          c.totalG += q.qty * perUnit;
        } else {
          // Vegetables/other: count units, but use defaults for items with qty=1 and no explicit number
          if (q.qty === 1 && !/^\d/.test(raw.trim())) {
            // No number in raw string — use default
            const defG = DEFAULT_U[n.key];
            if (defG && (n.key === "espinaca" || n.key === "brocoli" || n.key === "champinon" || n.key === "zapallo" || n.key === "rucula" || n.key === "esparrago" || n.key === "arveja" || n.key === "anana" || n.key === "tomate_cherry")) {
              c.totalG += defG; // these are weight-based
            } else {
              c.totalU += (defG || 1);
            }
          } else {
            c.totalU += q.qty;
          }
        }
      });
    });
  });

  // Build display labels
  Object.values(consolidated).forEach(item => {
    if (item.cat === "🧴 Ya tenés en casa") { item.displayLabel = item.label; return; }

    let qtyStr = "";
    const isProtein = item.cat === "🥩 Carnicería" || item.cat === "🐟 Pescadería";

    if (isProtein && item.totalG > 0) {
      // Always show proteins in kg/g
      qtyStr = item.totalG >= 1000 ? `${(item.totalG/1000).toFixed(1).replace('.0','')} kg` : `${Math.round(item.totalG/50)*50}g`;
    } else if (item.totalG > 0 && item.totalU === 0) {
      qtyStr = item.totalG >= 1000 ? `${(item.totalG/1000).toFixed(1).replace('.0','')} kg` : `${Math.round(item.totalG/50)*50}g`;
    } else if (item.totalMl > 0) {
      qtyStr = item.totalMl >= 1000 ? `${(item.totalMl/1000).toFixed(1).replace('.0','')} L` : `${Math.round(item.totalMl/50)*50}ml`;
    } else if (item.totalTaza > 0) {
      const t = Math.ceil(item.totalTaza);
      qtyStr = t === 1 ? "1 taza" : `${t} tazas`;
    } else if (item.totalLata > 0) {
      const l = Math.ceil(item.totalLata);
      qtyStr = l === 1 ? "1 lata" : `${l} latas`;
    } else if (item.totalU > 0) {
      qtyStr = `${Math.ceil(item.totalU)}`;
    }

    item.displayLabel = qtyStr ? `${item.label} · ${qtyStr}` : item.label;
    // Cleanup
    delete item.totalG; delete item.totalMl; delete item.totalU; delete item.totalTaza; delete item.totalLata;
  });

  const CAT_ORDER = ["🥩 Carnicería","🐟 Pescadería","🥦 Verdulería","🥚 Lácteos y Huevos","🌾 Almacén","🧴 Ya tenés en casa"];
  const grouped = {};
  const items = Object.values(consolidated);
  CAT_ORDER.forEach(cat => {
    const inCat = items.filter(i => i.cat === cat);
    if (inCat.length > 0) grouped[cat] = inCat;
  });
  const otherItems = items.filter(i => !CAT_ORDER.includes(i.cat));
  if (otherItems.length > 0) grouped["🛒 Otros"] = otherItems;

  let total = 0;
  items.filter(i => i.cat !== "🧴 Ya tenés en casa").forEach(i => { total += (PRECIOS[i.price] || 0); });

  return { grouped, total, itemCount: items.filter(i => i.cat !== "🧴 Ya tenés en casa").length, sharedCount: items.filter(i => i.recetas >= 2).length };
}

function countSharedIngredients(menu) {
  const r = buildDynamicList(menu);
  return r.sharedCount;
}

// ============================================
// LÓGICA DE HISTORIA Y GENERACIÓN
// ============================================
function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    const cutoff = Date.now() - HISTORY_DAYS*24*60*60*1000;
    return arr.filter(h => h.t > cutoff);
  } catch(e) { return []; }
}
function saveToHistory(nombres) {
  try {
    const cur = getHistory();
    const now = Date.now();
    const nuevos = nombres.map(n => ({ n, t: now }));
    const todos = [...nuevos, ...cur].slice(0, HISTORY_MAX);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(todos));
  } catch(e) {}
}
function parseTime(t) { const m = parseInt(t); return isNaN(m) ? 30 : m; }
function isVegetariana(nombre) {
  const r = R[nombre];
  if (!r) return false;
  const tagStr = (r.tags||[]).join(" ").toLowerCase();
  if (tagStr.includes("vegetar") || tagStr.includes("vegano")) return true;
  const carnes = ["pollo","carne","jamon","atun","salmon","panceta","milanesa","matambre","asado","lomo","bife","chorizo","albondiga","suprema","brochette","sardina","tofu"];
  const ingStr = (r.i||[]).join(" ").toLowerCase() + " " + nombre.toLowerCase();
  if (nombre.toLowerCase().includes("tofu")) return true;
  return !carnes.some(c => ingStr.includes(c));
}
function isLiviana(nombre) {
  const r = R[nombre];
  if (!r) return false;
  const k = parseInt(r.k);
  if (!isNaN(k) && k > 400) return false;
  const tagStr = (r.tags||[]).join(" ").toLowerCase();
  return tagStr.includes("bajo") || tagStr.includes("desinflamatorio") || tagStr.includes("express") || (!isNaN(k) && k <= 400);
}
function isContundente(nombre) {
  const r = R[nombre];
  if (!r) return false;
  const k = parseInt(r.k);
  return (!isNaN(k) && k >= 450) || (r.tags||[]).some(t => t.includes("Alta proteina") || t.includes("Rendidor"));
}
function parseIngredientList(txt) {
  if (!txt || typeof txt !== "string") return [];
  return txt.toLowerCase()
    .split(/[,;.\n]+|\s+y\s+|\s+o\s+/)
    .map(s => s.trim())
    .filter(s => s.length >= 3);
}
function recetaContiene(nombre, ingsList) {
  if (!ingsList || ingsList.length === 0) return false;
  const r = R[nombre];
  if (!r) return false;
  const haystack = ((r.i||[]).join(" ") + " " + nombre).toLowerCase();
  return ingsList.some(ing => haystack.includes(ing));
}
function scoreReceta(nombre, objetivo, dietas, tiempo, history, noGustaList = [], tieneList = []) {
  const r = R[nombre];
  if (!r) return -999;
  if (noGustaList.length > 0 && recetaContiene(nombre, noGustaList)) return -1000;
  let score = Math.random() * 5;
  const meta = META[objetivo] || META.organizar;
  const tagStr = (r.tags||[]).join(" ").toLowerCase();
  meta.kw.forEach(k => { if (tagStr.includes(k)) score += 12; });
  if (dietas.includes("vegetariana") || dietas.includes("vegana")) {
    if (isVegetariana(nombre)) score += 20; else score -= 100;
  }
  if (dietas.includes("desinflamatoria")) {
    if (tagStr.includes("desinflamatorio")) score += 15;
  }
  const mins = parseTime(r.t);
  if (tiempo === "rapido" && mins <= 20) score += 8;
  if (tiempo === "rapido" && mins > 30) score -= 10;
  if (tiempo === "medio" && mins <= 30) score += 4;
  if (tiempo === "libre" && mins >= 30) score += 3;
  if (tieneList.length > 0) {
    const haystack = ((r.i||[]).join(" ") + " " + nombre).toLowerCase();
    const matches = tieneList.filter(ing => haystack.includes(ing)).length;
    if (matches > 0) score += matches * 6;
  }
  const idx = history.findIndex(h => h.n === nombre);
  if (idx !== -1) {
    const ageDays = (Date.now() - history[idx].t) / (24*60*60*1000);
    score -= 50 * (1 - ageDays/HISTORY_DAYS);
  }
  return score;
}
function generar(a) {
  const obj = a.objetivo?.[0] || "organizar";
  const dietas = a.dieta || [];
  let key = obj;
  if (dietas.includes("desinflamatoria")) key = "desinflamatoria";
  const meta = META[key] || META.organizar;
  const history = getHistory();
  const todas = Object.keys(R);
  const noGusta = parseIngredientList(a.no_gusta);
  const tiene = parseIngredientList(a.ingredientes);
  const conScore = todas.map(n => ({ n, s: scoreReceta(n, key, dietas, a.tiempo, history, noGusta, tiene), liviana: isLiviana(n), contundente: isContundente(n) }))
    .filter(x => x.s > -999)
    .sort((x,y) => y.s - x.s);
  const candidatosAlm = conScore.filter(x => x.contundente || !x.liviana).slice(0, 25);
  const candidatosCen = conScore.filter(x => x.liviana).slice(0, 20);
  const almsBase = candidatosAlm.length >= 7 ? candidatosAlm : conScore.slice(0, 25);
  const censBase = candidatosCen.length >= 7 ? candidatosCen : conScore.filter(x => !almsBase.slice(0,7).find(a => a.n === x.n)).slice(0, 20);

  // === INGREDIENT OVERLAP SCORING ===
  // Score candidates higher if they share ingredients with already-selected recipes
  const usadas = new Set();
  const selectedIngs = new Set();
  const almsElegidas = [];

  function addRecipeIngs(nombre) {
    const r = R[nombre];
    if (!r || !r.i) return;
    r.i.forEach(ing => {
      const key = ing.toLowerCase().replace(/\d+g?\s*/g,'').replace(/x\d+/g,'').trim();
      if (key.length > 2) selectedIngs.add(key);
    });
  }
  function overlapBonus(nombre) {
    if (selectedIngs.size === 0) return 0;
    const r = R[nombre];
    if (!r || !r.i) return 0;
    let matches = 0;
    r.i.forEach(ing => {
      const key = ing.toLowerCase().replace(/\d+g?\s*/g,'').replace(/x\d+/g,'').trim();
      if (key.length > 2 && selectedIngs.has(key)) matches++;
    });
    return matches * 4; // bonus per shared ingredient
  }

  // Select almuerzos with overlap bonus
  for (const c of almsBase) {
    if (almsElegidas.length >= 7) break;
    if (usadas.has(c.n)) continue;
    almsElegidas.push(c.n);
    usadas.add(c.n);
    addRecipeIngs(c.n);
  }
  while (almsElegidas.length < 7) almsElegidas.push(almsBase[0]?.n || todas[0]);

  // Re-score cenas with overlap from selected almuerzos
  const censWithOverlap = censBase
    .filter(x => !usadas.has(x.n))
    .map(x => ({ ...x, s: x.s + overlapBonus(x.n) }))
    .sort((a, b) => b.s - a.s);

  const censElegidas = [];
  for (const c of censWithOverlap) {
    if (censElegidas.length >= 7) break;
    if (usadas.has(c.n)) continue;
    censElegidas.push(c.n);
    usadas.add(c.n);
    addRecipeIngs(c.n);
  }
  while (censElegidas.length < 7) {
    const fallback = conScore.find(x => !usadas.has(x.n));
    if (!fallback) break; censElegidas.push(fallback.n); usadas.add(fallback.n);
  }

  const menu = DIAS.map((dia, i) => ({
    dia, alm: almsElegidas[i], cen: censElegidas[i],
    tag_alm: (R[almsElegidas[i]]?.tags?.[0]) || "⚡ Rendidor",
    tag_cen: (R[censElegidas[i]]?.tags?.[0]) || "🔥 Bajo en calorias",
  }));
  saveToHistory([...almsElegidas, ...censElegidas]);

  // Build dynamic shopping list from actual recipes
  const listData = buildDynamicList(menu);

  return {
    ...meta, menu,
    lista_compras: listData.grouped,
    lista_total: listData.total,
    lista_count: listData.itemCount,
    lista_shared: listData.sharedCount,
    lista_generica: LISTAS[key] || LISTAS.organizar,
    objetivo: key,
    precio_estimado: meta.precio[a.presupuesto || "medio"],
    answers: a, dietas, noGusta, tiene,
    ahorro: { uniqueCount: listData.itemCount, sharedCount: listData.sharedCount, totalPrice: listData.total },
  };
}
function cambiarReceta(menuActual, dia, tipo, objetivo, dietas, tiempo, noGusta = [], tiene = []) {
  const history = getHistory();
  const todas = Object.keys(R);
  const enMenu = new Set();
  menuActual.forEach(d => { enMenu.add(d.alm); enMenu.add(d.cen); });
  const recetaActual = menuActual.find(d => d.dia === dia)?.[tipo];
  enMenu.delete(recetaActual);
  const filtro = tipo === "cen" ? (n => isLiviana(n)) : (n => isContundente(n) || !isLiviana(n));
  let candidatos = todas.filter(n => !enMenu.has(n) && filtro(n));
  if (candidatos.length < 3) candidatos = todas.filter(n => !enMenu.has(n));
  if (noGusta.length > 0) candidatos = candidatos.filter(n => !recetaContiene(n, noGusta));
  const conScore = candidatos.filter(n => n !== recetaActual).map(n => ({ n, s: scoreReceta(n, objetivo, dietas, tiempo, history, noGusta, tiene) + Math.random()*15 })).sort((x,y) => y.s - x.s);
  const nueva = conScore[0]?.n || candidatos[0] || recetaActual;
  saveToHistory([nueva]);
  return nueva;
}
function generarHoy(cuantas, tipo, ingredientes, noGusta, dietas, tiempo, objetivo) {
  const todas = Object.keys(R);
  const history = getHistory();
  const noGustaList = parseIngredientList(noGusta);
  const dietasArr = dietas || [];
  const objKey = objetivo || "organizar";
  const meta = META[objKey] || META.organizar;
  let candidatos = [...todas];
  if (noGustaList.length > 0) candidatos = candidatos.filter(n => !recetaContiene(n, noGustaList));
  if (dietasArr.includes("vegetariana") || dietasArr.includes("vegana")) {
    candidatos = candidatos.filter(isVegetariana);
  }
  if (tipo === "liviana") candidatos = candidatos.filter(isLiviana);
  else if (tipo === "rapida") candidatos = candidatos.filter(n => parseTime(R[n]?.t) <= 20);
  else if (tipo === "contundente") candidatos = candidatos.filter(isContundente);
  if (candidatos.length === 0) candidatos = todas.filter(n => !recetaContiene(n, noGustaList));
  if (candidatos.length === 0) candidatos = [...todas];
  const ings = parseIngredientList(ingredientes);
  const conScore = candidatos.map(n => {
    let score = Math.random() * 5;
    const r = R[n];
    const recetaIngs = (r?.i || []).join(" ").toLowerCase() + " " + n.toLowerCase();
    const tagStr = (r?.tags || []).join(" ").toLowerCase();
    meta.kw.forEach(k => { if (tagStr.includes(k)) score += 12; });
    if (ings.length > 0) {
      const matches = ings.filter(ing => recetaIngs.includes(ing)).length;
      if (matches === 0) score -= 100;
      else { score += matches * 40; if (matches === ings.length) score += 50; }
    }
    if (dietasArr.includes("desinflamatoria") && tagStr.includes("desinflamatorio")) score += 15;
    if (dietasArr.includes("keto") || dietasArr.includes("lowcarb")) {
      if (tagStr.includes("bajo en calorias") || tagStr.includes("desinflamatorio")) score += 10;
    }
    const mins = parseTime(r?.t);
    if (tiempo === "rapido" && mins <= 15) score += 12;
    else if (tiempo === "rapido" && mins <= 20) score += 6;
    else if (tiempo === "rapido" && mins > 30) score -= 15;
    if (tiempo === "medio" && mins <= 30) score += 5;
    if (tiempo === "libre" && mins >= 30) score += 3;
    if (tagStr.includes("economico")) score += 5;
    const idx = history.findIndex(h => h.n === n);
    if (idx !== -1) {
      const ageDays = (Date.now() - history[idx].t) / (24*60*60*1000);
      score -= 30 * (1 - ageDays/HISTORY_DAYS);
    }
    return { n, score };
  }).sort((a,b) => b.score - a.score);
  const top = conScore.slice(0, Math.min(12, conScore.length));
  const elegidas = []; const usadas = new Set();
  for (const c of top) { if (usadas.has(c.n)) continue; elegidas.push(c.n); usadas.add(c.n); if (elegidas.length >= 4) break; }
  while (elegidas.length < 4 && conScore.length > elegidas.length) {
    const next = conScore[elegidas.length];
    if (next && !usadas.has(next.n)) { elegidas.push(next.n); usadas.add(next.n); } else break;
  }
  saveToHistory(elegidas.slice(0, 2));
  if (cuantas === "1") return elegidas.slice(0, 4).map((n, i) => ({ tipo: i === 0 ? "Mejor opción" : `Opción ${i+1}`, nombre: n }));
  return [
    { tipo:"Almuerzo · opción 1", nombre: elegidas[0] },
    { tipo:"Almuerzo · opción 2", nombre: elegidas[1] || elegidas[0] },
    { tipo:"Cena · opción 1", nombre: elegidas[2] || elegidas[0] },
    { tipo:"Cena · opción 2", nombre: elegidas[3] || elegidas[1] || elegidas[0] },
  ];
}

function cambiarRecetaHoy(recetaActual, excluir, tipo, ingredientes, noGusta, dietas, tiempo, objetivo) {
  const todas = Object.keys(R);
  const noGustaList = parseIngredientList(noGusta);
  const dietasArr = dietas || [];
  const objKey = objetivo || "organizar";
  const meta = META[objKey] || META.organizar;
  const ings = parseIngredientList(ingredientes);
  const excluirSet = new Set(excluir);
  excluirSet.add(recetaActual);

  let candidatos = todas.filter(n => !excluirSet.has(n));
  if (noGustaList.length > 0) candidatos = candidatos.filter(n => !recetaContiene(n, noGustaList));
  if (dietasArr.includes("vegetariana") || dietasArr.includes("vegana")) candidatos = candidatos.filter(isVegetariana);
  if (tipo === "liviana") candidatos = candidatos.filter(isLiviana);
  else if (tipo === "rapida") candidatos = candidatos.filter(n => parseTime(R[n]?.t) <= 20);
  else if (tipo === "contundente") candidatos = candidatos.filter(isContundente);
  if (candidatos.length === 0) candidatos = todas.filter(n => !excluirSet.has(n) && !recetaContiene(n, noGustaList));
  if (candidatos.length === 0) return recetaActual;

  const conScore = candidatos.map(n => {
    let score = Math.random() * 5;
    const r = R[n];
    const recetaIngs = (r?.i || []).join(" ").toLowerCase() + " " + n.toLowerCase();
    const tagStr = (r?.tags || []).join(" ").toLowerCase();
    meta.kw.forEach(k => { if (tagStr.includes(k)) score += 12; });
    if (ings.length > 0) {
      const matches = ings.filter(ing => recetaIngs.includes(ing)).length;
      if (matches === 0) score -= 100;
      else { score += matches * 40; if (matches === ings.length) score += 50; }
    }
    if (dietasArr.includes("desinflamatoria") && tagStr.includes("desinflamatorio")) score += 15;
    const mins = parseTime(r?.t);
    if (tiempo === "rapido" && mins <= 15) score += 12;
    else if (tiempo === "rapido" && mins > 30) score -= 15;
    if (tiempo === "medio" && mins <= 30) score += 5;
    return { n, score };
  }).sort((a,b) => b.score - a.score);

  const nueva = conScore[0]?.n || recetaActual;
  saveToHistory([nueva]);
  return nueva;
}

// ============================================
// CHEF CHAT (solo premium — sin cambios internos)
// ============================================
function ChefChat({ result, recetaActual, onClose }) {
  const [msgs, setMsgs] = useState([{ role:"assistant", text:"¡Hola! Soy tu chef asistente.\n\nConozco tu menú completo y todas tus recetas. Podés preguntarme cualquier cosa: si te falta un ingrediente y cómo reemplazarlo, dudas sobre la preparación, tiempos de cocción, o lo que necesites." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, loading]);

  const send = async () => {
    const txt = input.trim();
    if (!txt || loading) return;
    setInput("");
    setMsgs(m => [...m, { role:"user", text:txt }]);
    setLoading(true);
    try {
      const response = await fetch("/api/chef", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: txt, history: msgs, menu: result || null })
      });
      const data = await response.json();
      const reply = data.reply || data.error || "El chef no pudo responder ahora. Probá de nuevo.";
      setMsgs(m => [...m, { role:"assistant", text:reply }]);
    } catch (err) {
      setMsgs(m => [...m, { role:"assistant", text:"Hubo un problema de conexión. Probá de nuevo en un momento." }]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:3000, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(10,14,26,0.5)", backdropFilter:"blur(4px)" }}/>
      <div style={{ position:"relative", background:C.white, borderRadius:"28px 28px 0 0", width:"100%", maxWidth:580, margin:"0 auto", maxHeight:"85vh", display:"flex", flexDirection:"column", boxShadow:"0 -10px 50px rgba(10,14,26,0.25)", overflow:"hidden" }}>
        <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 0" }}>
          <div style={{ width:40, height:5, background:C.gray3, borderRadius:4 }}/>
        </div>
        <div style={{ padding:"16px 22px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${C.line}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:14, background:C.blue, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:sh.blue }}>
              <ChefHat size={26}/>
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:C.ink, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.02em" }}>Chef Asistente</div>
              <div style={{ fontSize:12, color:C.success, fontWeight:600, fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:C.success, display:"inline-block" }}/>
                En línea · Kooki IA
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:C.bg, border:"none", borderRadius:12, width:36, height:36, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.gray4 }}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"18px 18px 8px", display:"flex", flexDirection:"column", gap:14, background:C.bg, position:"relative" }}>
          <BgGrid />
          <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", gap:14 }}>
            {msgs.map((m,i) => (
              <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
                {m.role==="assistant" && (
                  <div style={{ width:32, height:32, borderRadius:10, background:C.blue, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginRight:10, marginTop:2 }}>
                    <ChefHat size={20}/>
                  </div>
                )}
                <div style={{
                  maxWidth:"78%",
                  background: m.role==="user" ? C.ink : C.white,
                  color: m.role==="user" ? C.white : C.text,
                  borderRadius: m.role==="user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                  padding:"13px 16px", fontSize:14.5, lineHeight:1.55, whiteSpace:"pre-wrap",
                  boxShadow: m.role==="user" ? sh.ink : sh.sm,
                  fontFamily: "'Manrope',sans-serif", fontWeight: 500,
                }}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:10, background:C.blue, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <ChefHat size={20}/>
                </div>
                <div style={{ background:C.white, borderRadius:"20px 20px 20px 4px", padding:"14px 18px", display:"flex", alignItems:"center", gap:6, boxShadow:sh.sm }}>
                  {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:C.gray3, animation:`dotPulse 1.2s ease ${i*0.2}s infinite` }}/>)}
                </div>
              </div>
            )}
            {msgs.length === 1 && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:6 }}>
                {["¿Puedo reemplazar el salmón?","¿Cómo sé si el pollo está listo?","Me falta quinoa, ¿qué uso?","¿Cuánto dura en la heladera?"].map((s,i) => (
                  <button key={i} onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 50); }} style={{ background:C.white, color:C.ink, border:`1px solid ${C.line}`, borderRadius:20, padding:"8px 14px", fontSize:12.5, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>{s}</button>
                ))}
              </div>
            )}
            <div ref={bottomRef}/>
          </div>
        </div>
        <div style={{ padding:"14px 18px 22px", borderTop:`1px solid ${C.line}`, display:"flex", gap:10, alignItems:"flex-end", background:C.white }}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Preguntale al chef..." rows={1}
            style={{ flex:1, padding:"14px 16px", borderRadius:14, border:`1.5px solid ${C.line}`, fontSize:14.5, color:C.text, resize:"none", lineHeight:1.5, background:C.bg, fontFamily:"'Manrope',sans-serif", outline:"none", maxHeight:100, overflowY:"auto", transition:"border 0.2s" }}
            onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.line}/>
          <button onClick={send} disabled={!input.trim()||loading} style={{ width:46, height:46, borderRadius:14, border:"none", background:!input.trim()||loading?C.gray2:C.ink, color:!input.trim()||loading?C.gray4:C.white, fontSize:18, cursor:!input.trim()||loading?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s", boxShadow:input.trim()&&!loading?sh.ink:"none" }}>↑</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MODAL RECETA (FREEMIUM: pasos bloqueados en gratis)
// ============================================
function ModalReceta({ nombre, onClose }) {
  const [cookMode, setCookMode] = useState(false);
  const r = R[nombre];
  if (!r) return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(10,14,26,0.7)",zIndex:2000,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(6px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.white,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:580,padding:"32px 28px 44px" }}>
        <h3 style={{ fontSize:24,fontWeight:900,color:C.ink,marginBottom:14,fontFamily:"'Epilogue',sans-serif",letterSpacing:"-0.035em",lineHeight:1.05 }}>{nombre}</h3>
        <p style={{ color:C.sub,fontSize:15,lineHeight:1.65 }}>Receta detallada próximamente.</p>
        <button onClick={onClose} style={{ marginTop:24,width:"100%",background:C.ink,color:C.white,border:"none",borderRadius:16,padding:"17px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif" }}>Cerrar</button>
      </div>
    </div>
  );

  if (cookMode) return (
    <div style={{ position:"fixed",inset:0,background:C.ink,zIndex:3000,overflowY:"auto",padding:"0 0 80px" }}>
      <BgGrid dark />
      <div style={{ padding:"22px 26px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:C.ink,zIndex:10,borderBottom:`1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ position:"relative", zIndex:1 }}><Eyebrow dark>Modo Cocina</Eyebrow></div>
        <button onClick={()=>setCookMode(false)} style={{ background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,padding:"10px 18px",color:C.white,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif",position:"relative",zIndex:1 }}>Salir</button>
      </div>
      <div style={{ padding:"24px 26px 0", position:"relative", zIndex:1 }}>
        <h2 style={{ fontSize:"clamp(26px, 7vw, 38px)",fontWeight:900,color:C.white,lineHeight:1.0,marginBottom:36,fontFamily:"'Epilogue',sans-serif",letterSpacing:"-0.04em" }}>{nombre}</h2>
        {r.s.map((paso,i) => (
          <div key={i} style={{ marginBottom:36 }}>
            <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:14 }}>
              <div style={{ fontSize:64,fontWeight:900,color:C.blue,lineHeight:1,letterSpacing:"-0.05em",fontFamily:"'Epilogue',sans-serif",flexShrink:0 }}>{String(i+1).padStart(2,"0")}</div>
              <div style={{ height:2,flex:1,background:"rgba(255,255,255,0.08)",borderRadius:2 }}/>
            </div>
            <div style={{ fontSize:22,lineHeight:1.55,color:C.white,fontFamily:"'Manrope',sans-serif",fontWeight:500 }}>{paso}</div>
          </div>
        ))}
        <button onClick={()=>{ setCookMode(false); onClose(); }} style={{ width:"100%",background:C.blue,color:C.white,border:"none",borderRadius:16,padding:"20px",fontSize:17,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",marginTop:16,boxShadow:sh.blue }}>✓ Listo, terminé de cocinar</button>
      </div>
    </div>
  );

  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(10,14,26,0.7)",zIndex:2000,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(6px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.white,borderRadius:"28px 28px 0 0",width:"100%",maxWidth:580,maxHeight:"92vh",overflowY:"auto",paddingBottom:44 }}>
        <div style={{ display:"flex",justifyContent:"center",padding:"10px 0 6px" }}>
          <div style={{ width:40,height:5,background:C.gray3,borderRadius:4 }}/>
        </div>

        <div style={{ background:C.ink,padding:"26px 28px 30px",position:"relative",overflow:"hidden" }}>
          <BgGrid dark />
          <Blob pos="tr" color="rgba(59,111,212,0.35)" size={350} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ marginBottom:14 }}><Eyebrow dark>Receta</Eyebrow></div>
            <div style={{ fontSize:36,marginBottom:12 }}>{r.e}</div>
            <h2 style={{ fontSize:"clamp(22px, 5.5vw, 30px)",fontWeight:900,color:C.white,lineHeight:1.05,marginBottom:16,fontFamily:"'Epilogue',sans-serif",letterSpacing:"-0.035em" }}>{nombre}</h2>
            <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:r.tags?14:0 }}>
              {[["⏱",r.t],["📊",r.d],r.k&&["🔥",r.k],r.p&&["💪",r.p]].filter(Boolean).map(([ic,val],i) => (
                <span key={i} style={{ background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",color:C.white,borderRadius:20,padding:"6px 13px",fontSize:13,fontWeight:600,fontFamily:"'Inter',sans-serif" }}>{ic} {val}</span>
              ))}
            </div>
            {r.tags && (
              <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
                {r.tags.map((t,i) => <span key={i} style={{ background:"rgba(59,111,212,0.18)",color:C.blueGlow,borderRadius:20,padding:"4px 11px",fontSize:11,fontWeight:700,fontFamily:"'Inter',sans-serif" }}>{t}</span>)}
              </div>
            )}
          </div>
        </div>

        <div style={{ padding:"26px 28px 0" }}>
          <div style={{ marginBottom:16 }}><Eyebrow>Ingredientes</Eyebrow></div>
          <div style={{ display:"flex",flexDirection:"column",gap:11,marginBottom:30 }}>
            {r.i.map((ing,i) => (
              <div key={i} style={{ display:"flex",alignItems:"center",gap:14 }}>
                <div style={{ width:8,height:8,borderRadius:"50%",background:C.blue,flexShrink:0 }}/>
                <span style={{ fontSize:15,color:C.text,fontWeight:500,fontFamily:"'Manrope',sans-serif" }}>{ing}</span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom:16 }}><Eyebrow>Preparación</Eyebrow></div>
              <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
                {r.s.map((paso,i) => (
                  <div key={i} style={{ display:"flex",gap:18,alignItems:"flex-start" }}>
                    <div style={{ fontSize:32,fontWeight:900,color:C.blue,lineHeight:1,letterSpacing:"-0.05em",fontFamily:"'Epilogue',sans-serif",flexShrink:0,minWidth:46 }}>{String(i+1).padStart(2,"0")}</div>
                    <div style={{ fontSize:15.5,lineHeight:1.6,color:C.text,paddingTop:4,fontFamily:"'Manrope',sans-serif",fontWeight:500 }}>{paso}</div>
                  </div>
                ))}
              </div>
              <button onClick={()=>setCookMode(true)} style={{ marginTop:30,width:"100%",background:C.ink,color:C.white,border:"none",borderRadius:16,padding:"18px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:sh.ink }}>
                Modo Cocina · pantalla limpia →
              </button>

          <button onClick={onClose} style={{ marginTop:10,width:"100%",background:C.white,color:C.ink,border:`1.5px solid ${C.line}`,borderRadius:16,padding:"16px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif" }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP (FREEMIUM — home abierto, gratis primero)
// ============================================
function MainApp() {
  const [screen, setScreen] = useState("home");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("menu");
  const [checkedItems, setCheckedItems] = useState({});
  const [receta, setReceta] = useState(null);
  const [cambiando, setCambiando] = useState(null);
  const [loadMsg, setLoadMsg] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [chefOpen, setChefOpen] = useState(false);
  const [chefPulse, setChefPulse] = useState(false);
  const [hoyCuantas, setHoyCuantas] = useState("2");
  const [hoyTipo, setHoyTipo] = useState("cualquiera");
  const [hoyIngredientes, setHoyIngredientes] = useState("");
  const [hoyNoGusta, setHoyNoGusta] = useState("");
  const [hoyObjetivo, setHoyObjetivo] = useState("");
  const [hoyDieta, setHoyDieta] = useState(["libre"]);
  const [hoyTiempo, setHoyTiempo] = useState("medio");
  const [hoyPresupuesto, setHoyPresupuesto] = useState("medio");
  const [hoyResult, setHoyResult] = useState(null);
  const scrollRef = useRef(null);

  const cur = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const canNext = () => {
    if (cur?.type === "extras") return true;
    if (cur?.type === "objetivo") return (answers.objetivo||[]).length > 0;
    if (cur?.type === "grid") return (answers.dieta||[]).length > 0;
    return !!answers[cur?.id];
  };

  useEffect(() => {
    if (screen === "loading") {
      let i = 0;
      const t = setInterval(() => { i++; if (i < 5) setLoadMsg(i); else clearInterval(t); }, 500);
      return () => clearInterval(t);
    }
  }, [screen]);

  useEffect(() => {
    if ((tab === "lista" || tab === "recetas") && screen === "result") {
      setChefPulse(true);
      const t = setTimeout(() => setChefPulse(false), 3000);
      return () => clearTimeout(t);
    }
  }, [tab, screen]);

  const doGen = () => {
    setResult(generar(answers));
    setScreen("result");
    setTab("menu");
    setTimeout(() => scrollRef.current?.scrollTo({ top:0 }), 50);
  };

  const handleNext = () => {
    if (isLast) { setScreen("loading"); setLoadMsg(0); setTimeout(doGen, 2700); }
    else { setAnimKey(k=>k+1); setStep(s=>s+1); }
  };

  const resetAll = () => { setScreen("home"); setResult(null); setStep(0); setAnswers({}); setChefOpen(false); setHoyResult(null); setCheckedItems({}); };

  const handleCambiar = (dia, tipo) => {
    const key = `${dia}-${tipo}`;
    setCambiando(key);
    setTimeout(() => {
      setResult(prev => {
        if (!prev) return prev;
        const nueva = cambiarReceta(prev.menu, dia, tipo, prev.objetivo, prev.dietas || [], prev.answers?.tiempo, prev.noGusta || [], prev.tiene || []);
        return { ...prev, menu: prev.menu.map(d => d.dia !== dia ? d : { ...d, [tipo]:nueva, [`tag_${tipo}`]:(R[nueva]?.tags?.[0]) || "⚡ Rendidor" }) };
      });
      setCambiando(null);
    }, 700);
  };

  const handleHoyGenerar = () => {
    const result = generarHoy(hoyCuantas, hoyTipo, hoyIngredientes, hoyNoGusta, hoyDieta, hoyTiempo, hoyObjetivo);
    setHoyResult(result);
    trackEvent('Lead');
  };

  const OBJ_IC = { bajar_peso:"⚖️", saludable:"🥗", ahorrar:"💰", masa:"💪", organizar:"📅", desinflamatoria:"🫚" };

  // ============================================
  // SCREEN: HOME — TODO DESBLOQUEADO
  // ============================================
  if (screen === "home") return (
    <div ref={scrollRef} style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Manrope',sans-serif", overflowY:"auto", display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" }}>
      <style>{BASE}</style>
      <BgGrid />
      <Blob pos="tr" />
      <Blob pos="bl" color="rgba(0,102,204,0.13)" size={400} />

      <nav style={{ padding:"18px 26px", display:"flex", alignItems:"center", justifyContent:"flex-end", position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, background:C.white, border:`1px solid ${C.line}`, borderRadius:100, padding:"7px 14px", boxShadow:sh.sm }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:C.success, display:"inline-block" }}/>
          <span style={{ fontSize:12, fontWeight:700, color:C.ink, fontFamily:"'Inter',sans-serif" }}>Premium activo</span>
        </div>
      </nav>

      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"12px 26px 0", maxWidth:480, margin:"0 auto", width:"100%", position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
          <img src="https://cdn.shopify.com/s/files/1/0983/2857/6366/files/Copia_de_logo_sin_fondo.png?v=1776974240" alt="Kooki" style={{ height:70, objectFit:"contain" }} />
        </div>
        <h1 style={{ fontSize:"clamp(38px, 9vw, 52px)", fontWeight:900, color:C.ink, lineHeight:0.95, marginBottom:18, marginTop:14, letterSpacing:"-0.045em", textAlign:"center", fontFamily:"'Epilogue',sans-serif" }}>
          Empezá a <span style={{ color:C.blue, fontStyle:"italic", fontWeight:800 }}>ahorrar</span><br/>
          en el súper.
        </h1>
        <p style={{ fontSize:16, color:C.sub, lineHeight:1.55, marginBottom:24, textAlign:"center", fontWeight:500 }}>
          Menú semanal, lista exacta y productos de estación. Comprá solo lo que vas a usar.
        </p>

        <div style={{ position:"relative", marginBottom:32, display:"flex", justifyContent:"center", alignItems:"center" }}>
          <div style={{ position:"absolute", width:280, height:280, borderRadius:"50%", background:`radial-gradient(circle, ${C.bluePl} 0%, transparent 70%)`, zIndex:0 }}/>
          <img src="https://i.imgur.com/ItvV1e7.jpeg" alt="Kooki app" style={{ width:"100%", maxWidth:300, borderRadius:24, position:"relative", zIndex:1, animation:"floatPhone 3s ease-in-out infinite", boxShadow:`0 30px 60px rgba(10,14,26,0.18), -22px 22px 0 rgba(59,111,212,0.12)` }}/>
        </div>

        <button onClick={() => { setHoyResult(null); setScreen("hoy"); }}
          style={{ width:"100%", background:C.ink, color:C.white, border:"none", borderRadius:18, padding:"20px 28px", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:sh.ink, fontFamily:"'Inter',sans-serif", marginBottom:12, display:"flex", alignItems:"center", justifyContent:"center", gap:12, transition:"background 0.2s, transform 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.ink; e.currentTarget.style.transform = "translateY(0)"; }}>
          <span>¿Qué cocino hoy?</span>
          <span style={{ width:30, height:30, borderRadius:"50%", background:C.white, color:C.ink, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700 }}>→</span>
        </button>

        <button onClick={() => { setScreen("onboarding"); setStep(0); setAnswers({}); }}
          style={{ width:"100%", background:C.white, color:C.ink, border:`1.5px solid ${C.line}`, borderRadius:18, padding:"18px", fontSize:16, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif", marginBottom:12, transition:"border-color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.ink}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.line}>
          Armar mi semana completa
        </button>

        {/* ECOSISTEMA KOOKI — BONOS */}
        <div style={{ marginBottom:28, marginTop:20 }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:18 }}>
            <Eyebrow center>Ecosistema Kooki</Eyebrow>
          </div>
          <h3 style={{ fontSize:22, fontWeight:900, color:C.ink, textAlign:"center", marginBottom:6, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.03em", lineHeight:1.05 }}>
            Todo tu <span style={{ color:C.blue, fontStyle:"italic", fontWeight:800 }}>ahorro</span> en un lugar.
          </h3>
          <p style={{ fontSize:14, color:C.sub, textAlign:"center", marginBottom:20, fontWeight:500, lineHeight:1.5 }}>
            Herramientas para gastar menos en comida cada semana.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <a href="/detemporada" style={{ display:"flex", alignItems:"center", justifyContent:"center", background:C.white, borderRadius:20, border:`1.5px solid ${C.line}`, boxShadow:sh.md, padding:"20px", textDecoration:"none", cursor:"pointer", transition:"all 0.2s", minHeight:90 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#2D6A4F"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(45,106,79,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = sh.md; }}>
                <img src={DETEMPORADA_LOGO} alt="DeTemporada" style={{ height:56, objectFit:"contain" }} />
              </a>
              <p style={{ fontSize:13, color:C.sub, fontWeight:500, lineHeight:1.4, marginTop:8, textAlign:"center" }}>Frutas y verduras de estación. Comprá barato, fresco y con más sabor.</p>
            </div>
            <div>
              <a href="/ahorroexpress" style={{ display:"flex", alignItems:"center", justifyContent:"center", background:C.white, borderRadius:20, border:`1.5px solid ${C.line}`, boxShadow:sh.md, padding:"20px", textDecoration:"none", cursor:"pointer", transition:"all 0.2s", minHeight:90 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#FFE600"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,230,0,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = sh.md; }}>
                <img src={AHORROEXPRESS_LOGO} alt="AhorroExpress" style={{ height:56, objectFit:"contain" }} />
              </a>
              <p style={{ fontSize:13, color:C.sub, fontWeight:500, lineHeight:1.4, marginTop:8, textAlign:"center" }}>Controlá tus gastos del hogar. Presupuesto, alertas y tips de ahorro.</p>
            </div>
          </div>
        </div>

        <p style={{ textAlign:"center", fontSize:13, color:C.sub, marginBottom:48, fontFamily:"'Inter',sans-serif", fontWeight:500 }}>
          Kooki · Ahorrá en el súper con IA
        </p>
      </div>
    </div>
  );

  // ============================================
  // SCREEN: ¿QUÉ COCINO HOY? (GRATIS con límite 1/día)
  // ============================================
  if (screen === "hoy") return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Manrope',sans-serif", display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" }}>
      <style>{BASE}</style>
      <BgGrid />
      <Blob pos="tr" />

      <div style={{ padding:"16px 22px", display:"flex", alignItems:"center", gap:14, borderBottom:`1px solid ${C.line}`, background:C.bg, position:"relative", zIndex:1 }}>
        <button onClick={() => setScreen("home")} style={{ background:C.white, border:`1px solid ${C.line}`, borderRadius:12, width:40, height:40, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", color:C.ink, fontWeight:700 }}>←</button>
        <div style={{ fontSize:18, fontWeight:800, color:C.ink, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.025em" }}>¿Qué cocino hoy?</div>
      </div>

      {!hoyResult ? (
        <div style={{ flex:1, padding:"28px 24px", maxWidth:520, margin:"0 auto", width:"100%", overflowY:"auto", position:"relative", zIndex:1 }}>
          <div style={{ marginBottom:10 }}><Eyebrow>Personalizado para vos</Eyebrow></div>
          <h2 style={{ fontSize:28, fontWeight:900, color:C.ink, lineHeight:1.0, marginBottom:8, letterSpacing:"-0.04em", fontFamily:"'Epilogue',sans-serif" }}>
            Contanos qué necesitás y Kooki te da la receta <span style={{ color:C.blue, fontStyle:"italic", fontWeight:800 }}>perfecta</span>.
          </h2>
          <div style={{ fontSize:14, color:C.sub, marginBottom:28, lineHeight:1.55, fontWeight:500 }}>
            Cuanto más completes, mejor la sugerencia.
          </div>

          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.ink, marginBottom:10, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.015em" }}>¿Cuántas comidas necesitás?</div>
            <div style={{ display:"flex", gap:8 }}>
              {[["1","Una sola"],["2","Almuerzo y cena"]].map(([val,lbl]) => {
                const sel = hoyCuantas === val;
                return (
                  <button key={val} onClick={() => setHoyCuantas(val)} style={{ flex:1, padding:"14px 10px", borderRadius:12, border:`2px solid ${sel?C.ink:C.line}`, background:sel?C.ink:C.white, fontSize:13, fontWeight:700, color:sel?C.white:C.ink, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.18s" }}>
                    {lbl}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.ink, marginBottom:10, fontFamily:"'Epilogue',sans-serif" }}>¿Qué te importa hoy?</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {[["bajar_peso","⚖️","Bajar de peso"],["saludable","🥗","Comer sano"],["ahorrar","💰","Ahorrar"],["masa","💪","Ganar masa"],["organizar","📅","Organizarme"]].map(([val,emoji,lbl]) => {
                const sel = hoyObjetivo === val;
                return <button key={val} onClick={() => setHoyObjetivo(sel?"":val)} style={{ padding:"10px 16px", borderRadius:20, border:`2px solid ${sel?C.blue:C.line}`, background:sel?C.blueLt:C.white, fontSize:13, fontWeight:700, color:sel?C.blue:C.text, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.15s", display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:16 }}>{emoji}</span>{lbl}
                </button>;
              })}
            </div>
          </div>

          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.ink, marginBottom:10, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.015em" }}>¿Seguís alguna dieta?</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {[
                {value:"libre",emoji:"🍽️",label:"Sin restricciones"},
                {value:"keto",emoji:"🥑",label:"Keto"},
                {value:"lowcarb",emoji:"🥦",label:"Low Carb"},
                {value:"vegetariana",emoji:"🌿",label:"Vegetariana"},
                {value:"vegana",emoji:"🌱",label:"Vegana"},
                {value:"singluten",emoji:"🌾",label:"Sin Gluten"},
                {value:"sinlactosa",emoji:"🥛",label:"Sin Lactosa"},
                {value:"desinflamatoria",emoji:"🫚",label:"Desinflamatoria"},
              ].map(opt => {
                const sel = hoyDieta.includes(opt.value);
                const toggle = () => {
                  if (opt.value === "libre") { setHoyDieta(["libre"]); return; }
                  const without = hoyDieta.filter(x => x !== "libre");
                  setHoyDieta(sel ? without.filter(x=>x!==opt.value) : [...without, opt.value]);
                };
                return (
                  <button key={opt.value} onClick={toggle} style={{ padding:"10px 14px", borderRadius:12, border:`1.5px solid ${sel?C.blue:C.line}`, background:sel?C.blueLt:C.white, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.15s", display:"flex", alignItems:"center", gap:6, fontSize:12.5, fontWeight:700, color:sel?C.blue:C.text }}>
                    <span style={{ fontSize:16 }}>{opt.emoji}</span>{opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.ink, marginBottom:10, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.015em" }}>¿Cuánto tiempo tenés?</div>
            <div style={{ display:"flex", gap:8 }}>
              {[["rapido","⚡","Rápido","< 15 min"],["medio","🕐","Normal","15-30 min"],["libre","👨‍🍳","Sin límite","Me gusta cocinar"]].map(([val,ic,lbl,desc]) => {
                const sel = hoyTiempo === val;
                return (
                  <button key={val} onClick={() => setHoyTiempo(val)} style={{ flex:1, padding:"14px 8px", borderRadius:12, border:`2px solid ${sel?C.blue:C.line}`, background:sel?C.blueLt:C.white, cursor:"pointer", fontFamily:"'Manrope',sans-serif", transition:"all 0.15s", textAlign:"center" }}>
                    <div style={{ fontSize:20, marginBottom:4 }}>{ic}</div>
                    <div style={{ fontSize:12.5, fontWeight:800, color:sel?C.blue:C.ink, fontFamily:"'Epilogue',sans-serif" }}>{lbl}</div>
                    <div style={{ fontSize:10.5, color:C.sub, marginTop:2, fontWeight:500 }}>{desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.ink, marginBottom:10, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.015em" }}>¿Presupuesto?</div>
            <div style={{ display:"flex", gap:8 }}>
              {[["bajo","$","Ajustado"],["medio","$$","Moderado"],["alto","$$$","Sin límite"]].map(([val,sym,lbl]) => {
                const sel = hoyPresupuesto === val;
                return (
                  <button key={val} onClick={() => setHoyPresupuesto(val)} style={{ flex:1, padding:"14px 8px", borderRadius:12, border:`2px solid ${sel?C.blue:C.line}`, background:sel?C.blueLt:C.white, cursor:"pointer", fontFamily:"'Manrope',sans-serif", transition:"all 0.15s", textAlign:"center" }}>
                    <div style={{ fontSize:20, fontWeight:900, color:sel?C.blue:C.gray3, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.03em" }}>{sym}</div>
                    <div style={{ fontSize:11.5, fontWeight:700, color:sel?C.ink:C.text, marginTop:4, fontFamily:"'Inter',sans-serif" }}>{lbl}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.ink, marginBottom:10, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.015em" }}>¿Qué tipo de comida querés?</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {[["cualquiera","Cualquier cosa"],["liviana","Liviana"],["rapida","Rápida"],["contundente","Contundente"]].map(([val,lbl]) => {
                const sel = hoyTipo === val;
                return (
                  <button key={val} onClick={() => setHoyTipo(val)} style={{ padding:"10px 16px", borderRadius:12, border:`2px solid ${sel?C.ink:C.line}`, background:sel?C.ink:C.white, fontSize:13, fontWeight:700, color:sel?C.white:C.ink, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.15s" }}>
                    {lbl}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.ink, marginBottom:6, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.015em" }}>
              ¿Qué tenés en casa? <span style={{ fontWeight:500, color:C.gray4, fontSize:12, fontFamily:"'Manrope',sans-serif" }}>(opcional)</span>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
              {["pollo","carne picada","huevos","arroz","fideos","papa","cebolla","tomate","queso","atun","lentejas","palta","espinaca","batata","zanahoria","morron"].map(ing => {
                const sel = hoyIngredientes.toLowerCase().includes(ing);
                return (
                  <button key={ing} onClick={() => {
                    const cur = hoyIngredientes.split(",").map(s=>s.trim()).filter(Boolean);
                    const next = sel ? cur.filter(x => x.toLowerCase() !== ing) : [...cur, ing];
                    setHoyIngredientes(next.join(", "));
                  }} style={{ padding:"7px 12px", borderRadius:10, border:`1.5px solid ${sel?C.blue:C.line}`, background:sel?C.blueLt:C.white, fontSize:12, fontWeight:sel?700:600, color:sel?C.blue:C.text, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.15s" }}>
                    {ing}
                  </button>
                );
              })}
            </div>
            <textarea value={hoyIngredientes} onChange={e => setHoyIngredientes(e.target.value)} placeholder="O escribí otros..." rows={1}
              style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.line}`, fontSize:13, color:C.text, resize:"none", lineHeight:1.5, background:C.bg, fontFamily:"'Manrope',sans-serif", outline:"none", transition:"border 0.2s" }}
              onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.line}/>
          </div>

          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.ink, marginBottom:6, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.015em" }}>
              ¿Algo que no comas? <span style={{ fontWeight:500, color:C.gray4, fontSize:12, fontFamily:"'Manrope',sans-serif" }}>(opcional)</span>
            </div>
            <textarea value={hoyNoGusta} onChange={e => setHoyNoGusta(e.target.value)} placeholder="Ej: mariscos, cebolla cruda..." rows={1}
              style={{ width:"100%", padding:"14px 16px", borderRadius:12, border:`1.5px solid ${C.line}`, fontSize:14, color:C.text, resize:"none", lineHeight:1.5, background:C.white, fontFamily:"'Manrope',sans-serif", outline:"none", transition:"border 0.2s" }}
              onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.line}/>
          </div>

          <button onClick={handleHoyGenerar}
            style={{ width:"100%", background:C.ink, color:C.white, border:"none", borderRadius:18, padding:"20px", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:sh.ink, fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:12, transition:"background 0.2s, transform 0.2s", marginBottom:8 }}
            onMouseEnter={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.ink; e.currentTarget.style.transform = "translateY(0)"; }}>
            <span>Sugerir receta</span>
            <span style={{ width:30, height:30, borderRadius:"50%", background:C.white, color:C.ink, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700 }}>→</span>
          </button>

        </div>
      ) : (
        <div style={{ flex:1, padding:"32px 24px", maxWidth:520, margin:"0 auto", width:"100%", position:"relative", zIndex:1 }}>
          <div style={{ marginBottom:14 }}><Eyebrow>Listo</Eyebrow></div>
          <h2 style={{ fontSize:30, fontWeight:900, color:C.ink, lineHeight:1.0, marginBottom:10, letterSpacing:"-0.04em", fontFamily:"'Epilogue',sans-serif" }}>
            Tu menú <span style={{ color:C.blue, fontStyle:"italic", fontWeight:800 }}>de hoy</span>.
          </h2>
          <div style={{ fontSize:15, color:C.sub, marginBottom:28, fontWeight:500 }}>Elegido para vos del banco de recetas.</div>

          <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:28 }}>
            {hoyResult.map((item,i) => {
              const r = R[item.nombre];
              return (
                <div key={i} style={{ background:C.white, borderRadius:20, padding:"22px", boxShadow:sh.md, border:`1px solid ${C.line}` }}>
                  <div style={{ marginBottom:14 }}><Eyebrow>{item.tipo}</Eyebrow></div>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:60, height:60, borderRadius:16, background:C.blueLt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, flexShrink:0 }}>{r?r.e:"🍽️"}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:17, fontWeight:800, color:C.ink, marginBottom:6, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.02em" }}>{item.nombre}</div>
                      {r && (
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                          <Tag color={C.blue} bg={C.blueLt}>⏱ {r.t}</Tag>
                          {r.tags?.slice(0,1).map((t,j) => { const s=TAG_COLORS[t]||{}; return <Tag key={j} color={s.color||C.sub} bg={s.bg||C.gray1}>{t}</Tag>; })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10, marginTop:16 }}>
                    <button onClick={() => { setReceta(item.nombre); trackEvent('ViewContent', {content_name: item.nombre}); }} style={{ flex:1, background:C.bg, color:C.ink, border:`1px solid ${C.line}`, borderRadius:12, padding:"13px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
                      Ver receta →
                    </button>
                    <button onClick={() => {
                      const excluir = hoyResult.map(x => x.nombre);
                      const nueva = cambiarRecetaHoy(item.nombre, excluir, hoyTipo, hoyIngredientes, hoyNoGusta, hoyDieta, hoyTiempo, hoyObjetivo);
                      setHoyResult(prev => prev.map(p => p.nombre === item.nombre ? { ...p, nombre: nueva } : p));
                    }} style={{ width:48, background:C.bg, color:C.gray4, border:`1px solid ${C.line}`, borderRadius:12, padding:"13px", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      🔄
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={() => {
            const r2 = generarHoy(hoyCuantas, hoyTipo, hoyIngredientes, hoyNoGusta, hoyDieta, hoyTiempo, hoyObjetivo);
            setHoyResult(r2);
          }} style={{ width:"100%", background:C.white, color:C.ink, border:`1.5px solid ${C.line}`, borderRadius:16, padding:"16px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif", marginBottom:12 }}>↺ Otra sugerencia</button>
          <button onClick={() => setHoyResult(null)} style={{ width:"100%", background:"transparent", color:C.sub, border:"none", borderRadius:16, padding:"14px", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>← Volver</button>
        </div>
      )}

      {receta && <ModalReceta nombre={receta} onClose={()=>setReceta(null)} />}

      {hoyResult && (
        <div style={{ position:"fixed", bottom:28, right:22, zIndex:100 }}>
          <button onClick={() => setChefOpen(true)} style={{ width:60, height:60, borderRadius:"50%", border:"none", background:C.blue, color:C.white, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:sh.blue, animation:"chefBounce 2s ease infinite" }}>
            <ChefHat size={32}/>
          </button>
        </div>
      )}
      {chefOpen && <ChefChat result={null} recetaActual={receta} onClose={()=>setChefOpen(false)}/>}
    </div>
  );

  // ============================================
  // SCREENS: ONBOARDING, LOADING, RESULT — solo premium
  // ============================================

  if (screen === "onboarding") {
    const progMsg = ["Conociendo tu objetivo...","Ajustando tu alimentación...","Calculando tu tiempo...","Optimizando el presupuesto...","Definiendo las porciones...","Personalizando la complejidad...","Un último detalle..."];
    const selDietas = answers.dieta || [];

    return (
      <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Manrope',sans-serif", display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" }}>
        <style>{BASE}</style>
        <BgGrid />
        <div style={{ padding:"16px 22px", display:"flex", alignItems:"center", gap:14, borderBottom:`1px solid ${C.line}`, background:C.bg, position:"relative", zIndex:1 }}>
          <button onClick={() => step === 0 ? setScreen("home") : setStep(s=>s-1)} style={{ background:C.white, border:`1px solid ${C.line}`, borderRadius:12, width:40, height:40, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", color:C.ink, fontWeight:700 }}>←</button>
          <div style={{ flex:1 }}>
            <div style={{ height:6, background:C.gray2, borderRadius:10, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${((step+1)/STEPS.length)*100}%`, background:C.blue, borderRadius:10, transition:"width 0.4s cubic-bezier(.4,0,.2,1)" }}/>
            </div>
            <div style={{ fontSize:12, color:C.blue, fontWeight:600, marginTop:6, fontFamily:"'Inter',sans-serif", letterSpacing:"0.04em" }}>{progMsg[step]}</div>
          </div>
          <span style={{ fontSize:13, fontWeight:800, color:C.ink, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.02em" }}>{step+1}/{STEPS.length}</span>
        </div>

        <div key={animKey} style={{ flex:1, padding:"28px 22px 36px", overflowY:"auto", maxWidth:520, margin:"0 auto", width:"100%", animation:"slideIn 0.3s ease", position:"relative", zIndex:1 }}>
          {cur.type === "grid" && selDietas.length > 0 && (
            <div style={{ background:C.white, border:`1px solid ${C.line}`, borderRadius:14, padding:"12px 16px", marginBottom:18, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <span style={{ fontSize:12, color:C.blue, fontWeight:700, fontFamily:"'Inter',sans-serif", textTransform:"uppercase", letterSpacing:"0.08em" }}>Seleccionaste:</span>
              {selDietas.map(d => { const opt = STEPS[1].options.find(o=>o.value===d); return opt ? <Tag key={d} color={C.ink} bg={C.bluePl}>{opt.emoji} {opt.label}</Tag> : null; })}
            </div>
          )}
          {cur.type === "extras" && (
            <div style={{ background:C.white, border:`1px solid ${C.line}`, borderRadius:18, padding:"20px 22px", marginBottom:24, borderLeft:`4px solid ${C.blue}` }}>
              <div style={{ marginBottom:8 }}><Eyebrow>Casi listo</Eyebrow></div>
              <div style={{ fontSize:18, fontWeight:800, color:C.ink, marginBottom:6, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.025em" }}>Ya estamos listos.</div>
              <div style={{ fontSize:14, color:C.sub, lineHeight:1.55, fontWeight:500 }}>Con esto ya podemos armar tu semana perfecta. Los campos de abajo son opcionales.</div>
            </div>
          )}

          <h2 style={{ fontSize:"clamp(26px, 7vw, 34px)", fontWeight:900, color:C.ink, lineHeight:1.0, marginBottom:10, letterSpacing:"-0.04em", fontFamily:"'Epilogue',sans-serif" }}>{cur.label}</h2>
          {cur.subtitle && <div style={{ fontSize:15, color:C.sub, marginBottom:28, lineHeight:1.55, fontWeight:500 }}>{cur.subtitle}</div>}

          {cur.type === "objetivo" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {cur.options.map(opt => {
                const arr = answers.objetivo || [];
                const sel = arr.includes(opt.value);
                const rank = arr.indexOf(opt.value);
                const toggle = () => {
                  if (sel) { setAnswers(a => ({ ...a, objetivo: arr.filter(x=>x!==opt.value) })); return; }
                  if (arr.length >= 2) { setAnswers(a => ({ ...a, objetivo: [...arr.slice(1), opt.value] })); return; }
                  setAnswers(a => ({ ...a, objetivo: [...arr, opt.value] }));
                };
                return (
                  <button key={opt.value} onClick={toggle} style={{ padding:"18px 20px", borderRadius:18, cursor:"pointer", textAlign:"left", border:`2px solid ${sel?C.blue:C.line}`, background:sel?C.blueLt:C.white, display:"flex", alignItems:"center", gap:16, transition:"all 0.18s", fontFamily:"'Manrope',sans-serif", boxShadow:sel?sh.md:sh.sm }}>
                    <div style={{ width:52, height:52, borderRadius:14, background:sel?C.blue:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{opt.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:16, fontWeight:800, color:C.ink, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.02em" }}>{opt.label}</div>
                      {opt.desc && <div style={{ fontSize:13, color:C.sub, marginTop:3, fontWeight:500 }}>{opt.desc}</div>}
                    </div>
                    {sel && <div style={{ width:30, height:30, borderRadius:"50%", background:C.blue, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:C.white, fontWeight:900, fontSize:14, fontFamily:"'Epilogue',sans-serif" }}>{rank+1}</div>}
                  </button>
                );
              })}
              {(answers.objetivo||[]).length === 2 && <div style={{ textAlign:"center", fontSize:13, color:C.blue, fontWeight:600, marginTop:6, fontFamily:"'Inter',sans-serif" }}>✓ Máximo 2 objetivos seleccionados</div>}
            </div>
          )}

          {cur.type === "grid" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {cur.options.map(opt => {
                const arr = answers.dieta || [];
                const sel = arr.includes(opt.value);
                const toggle = () => {
                  if (opt.value === "libre") { setAnswers(a => ({ ...a, dieta: ["libre"] })); return; }
                  const without = arr.filter(x => x !== "libre");
                  setAnswers(a => ({ ...a, dieta: sel ? without.filter(x=>x!==opt.value) : [...without, opt.value] }));
                };
                return (
                  <button key={opt.value} onClick={toggle} style={{ padding:"20px 14px", borderRadius:18, cursor:"pointer", textAlign:"center", border:`2px solid ${sel?C.blue:C.line}`, background:sel?C.blueLt:C.white, display:"flex", flexDirection:"column", alignItems:"center", gap:10, transition:"all 0.18s", fontFamily:"'Manrope',sans-serif", boxShadow:sel?sh.md:sh.sm, position:"relative" }}>
                    <div style={{ fontSize:32 }}>{opt.emoji}</div>
                    <div style={{ fontSize:14, fontWeight:800, color:C.ink, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.02em" }}>{opt.label}</div>
                    {sel && <div style={{ position:"absolute", top:10, right:10, width:22, height:22, borderRadius:"50%", background:C.blue, display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
                  </button>
                );
              })}
            </div>
          )}

          {(cur.type === "cards" || cur.type === "nivel") && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {cur.options.map(opt => {
                const sel = answers[cur.id] === opt.value;
                return (
                  <button key={opt.value} onClick={() => setAnswers(a=>({...a,[cur.id]:opt.value}))} style={{ padding:"22px 22px", borderRadius:18, cursor:"pointer", textAlign:"left", border:`2px solid ${sel?C.blue:C.line}`, background:sel?C.blueLt:C.white, display:"flex", alignItems:"center", gap:20, transition:"all 0.18s", fontFamily:"'Manrope',sans-serif", boxShadow:sel?sh.md:sh.sm }}>
                    <div style={{ fontSize:38, fontWeight:900, color:sel?C.blue:C.gray3, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.05em", lineHeight:1, minWidth:54, transition:"color 0.18s" }}>{opt.num}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:17, fontWeight:800, color:C.ink, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.02em" }}>{opt.label}</div>
                      {opt.desc && <div style={{ fontSize:14, color:C.sub, marginTop:3, fontWeight:500 }}>{opt.desc}</div>}
                    </div>
                    <div style={{ width:24, height:24, borderRadius:"50%", background:sel?C.blue:C.gray2, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {sel && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {cur.type === "semaforo" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {cur.options.map(opt => {
                const sel = answers.presupuesto === opt.value;
                return (
                  <button key={opt.value} onClick={() => setAnswers(a=>({...a,presupuesto:opt.value}))} style={{ padding:"22px 22px", borderRadius:18, cursor:"pointer", textAlign:"left", border:`2px solid ${sel?opt.color:C.line}`, background:C.white, display:"flex", alignItems:"center", gap:20, transition:"all 0.18s", fontFamily:"'Manrope',sans-serif", boxShadow:sel?`0 0 0 3px ${opt.color}25, ${sh.md}`:sh.sm }}>
                    <div style={{ fontSize:30, fontWeight:900, color:sel?opt.color:C.gray3, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.04em", lineHeight:1, minWidth:54, transition:"color 0.18s" }}>{opt.num}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:17, fontWeight:800, color:C.ink, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.02em" }}>{opt.label}</div>
                      <div style={{ fontSize:14, color:C.sub, marginTop:3, fontWeight:500 }}>{opt.desc}</div>
                    </div>
                    <div style={{ width:24, height:24, borderRadius:"50%", background:sel?opt.color:C.gray2, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {sel && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {cur.type === "extras" && (
            <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:C.ink, marginBottom:10, display:"flex", alignItems:"center", gap:8, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.015em" }}>
                  ¿Qué tenés en casa ahora? <span style={{ fontWeight:500, color:C.gray4, fontSize:13, fontFamily:"'Manrope',sans-serif" }}>(opcional)</span>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:8 }}>
                  {["pollo","carne picada","huevos","arroz","fideos","papa","cebolla","tomate","zanahoria","queso","leche","morron","zapallito","espinaca","atun","lentejas","pan","palta","brocoli","batata","ajo","limon","harina","manteca"].map(ing => {
                    const current = (answers.ingredientes || "").toLowerCase();
                    const sel = current.includes(ing);
                    return (
                      <button key={ing} onClick={() => {
                        const cur = (answers.ingredientes || "").split(",").map(s=>s.trim()).filter(Boolean);
                        const next = sel ? cur.filter(x => x.toLowerCase() !== ing) : [...cur, ing];
                        setAnswers(a => ({ ...a, ingredientes: next.join(", ") }));
                      }} style={{ padding:"8px 14px", borderRadius:12, border:`1.5px solid ${sel?C.blue:C.line}`, background:sel?C.blueLt:C.white, fontSize:13, fontWeight:sel?700:600, color:sel?C.blue:C.text, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.15s" }}>
                        {ing}
                      </button>
                    );
                  })}
                </div>
                <textarea value={answers.ingredientes||""} onChange={e=>setAnswers(a=>({...a,ingredientes:e.target.value}))} placeholder="O escribí otros: harina, crema..." rows={2}
                  style={{ width:"100%", padding:"12px 16px", borderRadius:12, border:`1.5px solid ${C.line}`, fontSize:13, color:C.text, resize:"none", lineHeight:1.5, background:C.bg, fontFamily:"'Manrope',sans-serif", outline:"none", transition:"border 0.2s" }}
                  onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.line}/>
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:C.ink, marginBottom:10, display:"flex", alignItems:"center", gap:8, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.015em" }}>
                  ¿Algo que no comas? <span style={{ fontWeight:500, color:C.gray4, fontSize:13, fontFamily:"'Manrope',sans-serif" }}>(opcional)</span>
                </div>
                <textarea value={answers.no_gusta||""} onChange={e=>setAnswers(a=>({...a,no_gusta:e.target.value}))} placeholder="Ej: mariscos, cebolla cruda..." rows={2}
                  style={{ width:"100%", padding:"15px 18px", borderRadius:14, border:`1.5px solid ${C.line}`, fontSize:15, color:C.text, resize:"none", lineHeight:1.55, background:C.white, fontFamily:"'Manrope',sans-serif", outline:"none", transition:"border 0.2s" }}
                  onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.line}/>
              </div>
            </div>
          )}

          <button onClick={handleNext} disabled={!canNext()}
            style={{ width:"100%", marginTop:32, padding:"20px 28px", borderRadius:18, border:"none", fontSize:16, fontWeight:700, background:canNext()?C.ink:C.gray2, color:canNext()?C.white:C.gray4, cursor:canNext()?"pointer":"not-allowed", boxShadow:canNext()?sh.ink:"none", transition:"all 0.2s", fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}
            onMouseEnter={e => { if (canNext()) { e.currentTarget.style.background = C.blue; e.currentTarget.style.transform = "translateY(-2px)"; } }}
            onMouseLeave={e => { if (canNext()) { e.currentTarget.style.background = C.ink; e.currentTarget.style.transform = "translateY(0)"; } }}>
            <span>{isLast ? "Generar mi menú" : "Continuar"}</span>
            {canNext() && <span style={{ width:30, height:30, borderRadius:"50%", background:C.white, color:C.ink, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700 }}>→</span>}
          </button>
          {cur.type === "extras" && <p style={{ textAlign:"center", fontSize:13, color:C.sub, marginTop:12, fontWeight:500 }}>Podés saltearlo y continuar directo</p>}
        </div>
      </div>
    );
  }

  if (screen === "loading") {
    const MSGS = ["Analizando tu objetivo...","Seleccionando recetas con ingredientes compartidos...","Armando la lista exacta del súper...","Calculando tu ahorro estimado...","¡Tu plan está casi listo!"];
    return (
      <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, fontFamily:"'Manrope',sans-serif", position:"relative", overflow:"hidden" }}>
        <style>{BASE}</style>
        <BgGrid /><Blob pos="tr" /><Blob pos="bl" color="rgba(0,102,204,0.13)" />
        <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", border:`6px solid ${C.bluePl}`, borderTop:`6px solid ${C.blue}`, animation:"spin 0.9s linear infinite", marginBottom:32 }}/>
          <div style={{ marginBottom:14 }}><Eyebrow center>Generando</Eyebrow></div>
          <h2 style={{ fontSize:32, fontWeight:900, color:C.ink, marginBottom:14, textAlign:"center", fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.04em", lineHeight:1.0 }}>
            Kooki está <span style={{ color:C.blue, fontStyle:"italic", fontWeight:800 }}>trabajando</span>.
          </h2>
          <p style={{ fontSize:15, color:C.sub, textAlign:"center", maxWidth:280, lineHeight:1.55, marginBottom:36, fontWeight:500 }}>Personalizando tu plan de alimentación</p>
          <div style={{ width:"100%", maxWidth:320, display:"flex", flexDirection:"column", gap:14 }}>
            {MSGS.map((m,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:14, opacity:i<=loadMsg?1:0.3, transition:"opacity 0.4s" }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:i<loadMsg?C.success:i===loadMsg?C.blue:C.gray3, flexShrink:0, transition:"background 0.3s" }}/>
                <span style={{ fontSize:14, color:i===loadMsg?C.ink:C.gray4, fontWeight:i===loadMsg?700:500, fontFamily:"'Inter',sans-serif" }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (screen === "result" && result) {
    const showChefFab = tab === "lista" || tab === "recetas";
    return (
      <div ref={scrollRef} style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Manrope',sans-serif", overflowY:"auto" }}>
        <style>{BASE}</style>
        <div style={{ background:C.ink, padding:"24px 22px 44px", position:"relative", overflow:"hidden" }}>
          <BgGrid dark /><Blob pos="tr" color="rgba(59,111,212,0.4)" size={400} />
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28, position:"relative", zIndex:1 }}>
            <KookiLogo size={24} dark/>
            <button onClick={resetAll} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:C.white, borderRadius:12, padding:"9px 16px", fontSize:13, cursor:"pointer", fontWeight:600, fontFamily:"'Inter',sans-serif" }}>↺ Nuevo menú</button>
          </div>
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ marginBottom:18 }}><Eyebrow dark>Tu plan personalizado</Eyebrow></div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <span style={{ fontSize:24 }}>{OBJ_IC[result.objetivo]||"✨"}</span>
              <span style={{ background:"rgba(59,111,212,0.18)", border:"1px solid rgba(59,111,212,0.35)", color:C.blueGlow, borderRadius:100, padding:"6px 14px", fontSize:12, fontWeight:700, fontFamily:"'Inter',sans-serif", textTransform:"uppercase", letterSpacing:"0.08em" }}>{result.tag}</span>
            </div>
            <h1 style={{ fontSize:"clamp(28px, 7vw, 38px)", fontWeight:900, color:C.white, marginBottom:14, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.04em", lineHeight:1.0 }}>
              Tu plan está <span style={{ color:C.blue, fontStyle:"italic", fontWeight:800 }}>listo</span>.
            </h1>
            <div style={{ fontSize:15, color:"rgba(255,255,255,0.7)", lineHeight:1.55, marginBottom:22, fontWeight:500 }}>
              {result.ahorro ? `${result.ahorro.sharedCount} ingredientes compartidos entre recetas. Comprás menos, tirás menos.` : result.tip}
            </div>
            {result.precio_estimado && (
              <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:18, padding:"16px 20px", display:"flex", alignItems:"center", gap:14, backdropFilter:"blur(10px)" }}>
                <div style={{ width:42, height:42, borderRadius:12, background:"rgba(59,111,212,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🛒</div>
                <div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:"'Inter',sans-serif" }}>Estimado compras semanales</div>
                  <div style={{ fontSize:22, fontWeight:900, color:C.white, marginTop:3, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.03em" }}>{result.precio_estimado} ARS</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ background:C.white, margin:"0 16px", borderRadius:18, padding:5, marginTop:-18, boxShadow:sh.lg, position:"relative", zIndex:10, border:`1px solid ${C.line}` }}>
          <div style={{ display:"flex", gap:4 }}>
            {[["menu","Menú"],["lista","Compras"],["recetas","Recetas"]].map(([id,lbl]) => (
              <button key={id} onClick={()=>setTab(id)} style={{ flex:1, padding:"13px 6px", borderRadius:13, border:"none", fontWeight:700, fontSize:14, cursor:"pointer", transition:"all 0.2s", fontFamily:"'Inter',sans-serif", background:tab===id?C.ink:"transparent", color:tab===id?C.white:C.gray4 }}>{lbl}</button>
            ))}
          </div>
        </div>

        <div style={{ padding:"18px 16px 100px", animation:"slideIn 0.35s ease" }}>
          {tab === "menu" && (
            <div style={{ background:C.white, borderRadius:20, overflow:"hidden", boxShadow:sh.md, border:`1px solid ${C.line}` }}>
              {result.menu.map((d,i) => (
                <div key={i}>
                  <div style={{ padding:"18px 20px" }}>
                    <div style={{ marginBottom:14 }}><Eyebrow>{d.dia}</Eyebrow></div>
                    {[["alm","🌞","Almuerzo","tag_alm"],["cen","🌙","Cena","tag_cen"]].map(([k,ic,lb,tagKey]) => (
                      <div key={k} style={{ marginBottom:k==="alm"?14:0 }}>
                        <div style={{ display:"flex", alignItems:"flex-start" }}>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:12, color:C.gray4, marginBottom:4, fontFamily:"'Inter',sans-serif", fontWeight:600 }}>{ic} {lb}</div>
                            <div style={{ fontSize:15, fontWeight:800, color:C.ink, marginBottom:6, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.02em" }}>{d[k]}</div>
                            {d[tagKey] && <MealTag label={d[tagKey]}/>}
                          </div>
                          <div style={{ display:"flex", gap:6, flexShrink:0, marginLeft:10, paddingTop:2 }}>
                            <button onClick={()=>setReceta(d[k])} style={{ background:C.blueLt, border:"none", borderRadius:10, padding:"7px 13px", fontSize:12, color:C.blue, cursor:"pointer", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>Receta</button>
                            <button onClick={()=>handleCambiar(d.dia,k)} style={{ background:C.bg, border:`1px solid ${C.line}`, borderRadius:10, padding:"7px 11px", fontSize:13, color:cambiando===`${d.dia}-${k}`?C.blue:C.gray4, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
                              {cambiando===`${d.dia}-${k}`?"⏳":"🔄"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {i<6 && <div style={{ height:1, background:C.line }}/>}
                </div>
              ))}
            </div>
          )}

          {tab === "lista" && (
            <div>
              {/* AHORRO BANNER */}
              <div style={{ background:"linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)", borderRadius:20, padding:"20px", marginBottom:14, border:"1px solid #A7F3D0" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <div style={{ width:32, height:32, borderRadius:10, background:"#10B981", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:"white", fontWeight:900 }}>✓</div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#059669", fontFamily:"'Inter',sans-serif", textTransform:"uppercase", letterSpacing:"0.08em" }}>Lista inteligente</div>
                </div>
                <div style={{ fontSize:15, color:"#047857", lineHeight:1.5, fontWeight:600, fontFamily:"'Manrope',sans-serif" }}>
                  {result.ahorro ? `${result.ahorro.sharedCount} ingredientes compartidos entre recetas. Comprás ${result.ahorro.uniqueCount} productos, no ${Math.round(result.ahorro.uniqueCount * 1.7)}.` : "Generada desde tus 14 recetas."}
                </div>
                {result.precio_estimado && (
                  <div style={{ marginTop:12, padding:"12px 16px", background:"rgba(255,255,255,0.7)", borderRadius:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:13, fontWeight:600, color:"#059669", fontFamily:"'Inter',sans-serif" }}>Estimado semanal</span>
                    <span style={{ fontSize:18, fontWeight:900, color:"#047857", fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.03em" }}>{result.precio_estimado}</span>
                  </div>
                )}
              </div>

              {/* LISTA POR CATEGORÍA */}
              {Object.entries(result.lista_compras).map(([cat, items], ci) => {
                const isCondimentos = cat.includes("Ya tenés");
                return (
                  <div key={ci} style={{ background:C.white, borderRadius:16, overflow:"hidden", boxShadow:sh.sm, border:`1px solid ${C.line}`, marginBottom:12 }}>
                    <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.line}`, background:isCondimentos ? "#FAFAFA" : C.white }}>
                      <div style={{ fontSize:15, fontWeight:800, color:isCondimentos ? C.sub : C.ink, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.02em" }}>
                        {cat}
                        {isCondimentos && <span style={{ fontSize:11, fontWeight:500, color:C.gray4, marginLeft:8, fontFamily:"'Manrope',sans-serif" }}>ya los tenés</span>}
                      </div>
                    </div>
                    <div style={{ padding:"10px 18px 14px" }}>
                      {items.map((item, j) => {
                        const precio = PRECIOS[item.price] || 0;
                        const isCheckedKey = `check_${ci}_${j}`;
                        return (
                          <div key={j}
                            onClick={() => setCheckedItems(prev => ({ ...prev, [isCheckedKey]: !prev[isCheckedKey] }))}
                            style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom: j < items.length - 1 ? `1px solid ${C.line}` : "none", cursor:"pointer", opacity: checkedItems[isCheckedKey] ? 0.45 : 1, transition:"opacity 0.15s" }}>
                            <div style={{
                              width:22, height:22, borderRadius:7, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s",
                              background: checkedItems[isCheckedKey] ? C.blue : "transparent",
                              border: `2px solid ${checkedItems[isCheckedKey] ? C.blue : C.gray3}`,
                            }}>
                              {checkedItems[isCheckedKey] && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                            </div>
                            <span style={{
                              flex:1, fontSize:14, fontWeight:500, fontFamily:"'Manrope',sans-serif",
                              color: checkedItems[isCheckedKey] ? C.gray3 : C.text,
                              textDecoration: checkedItems[isCheckedKey] ? "line-through" : "none",
                            }}>
                            {item.displayLabel || item.label}{item.recetas > 1 ? ` (×${item.recetas} recetas)` : ""}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "recetas" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {result.menu.flatMap(d=>[d.alm,d.cen]).filter((v,i,a)=>a.indexOf(v)===i).map((plato,i) => {
                const r = R[plato];
                return (
                  <button key={i} onClick={()=>setReceta(plato)} style={{ background:C.white, borderRadius:16, padding:"16px 18px", border:`1px solid ${C.line}`, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:14, boxShadow:sh.sm, fontFamily:"'Manrope',sans-serif" }}>
                    <div style={{ width:56, height:56, borderRadius:14, background:C.blueLt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>{r?r.e:"🍽️"}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:15, fontWeight:800, color:C.ink, marginBottom:6, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.02em" }}>{plato}</div>
                      {r ? (
                        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                          <Tag color={C.blue} bg={C.blueLt}>⏱ {r.t}</Tag>
                          {r.tags?.slice(0,2).map((t,i) => { const s=TAG_COLORS[t]||{}; return <Tag key={i} color={s.color||C.sub} bg={s.bg||C.gray1}>{t}</Tag>; })}
                        </div>
                      ) : <Tag color={C.gray4} bg={C.gray1}>Próximamente</Tag>}
                    </div>
                    <span style={{ color:C.gray3, fontSize:22, flexShrink:0 }}>›</span>
                  </button>
                );
              })}
            </div>
          )}

          {tab === "menu" && (
            <div style={{ marginTop:20, background:C.white, borderRadius:20, overflow:"hidden", boxShadow:sh.md, border:`1px solid ${C.line}` }}>
              <div style={{ padding:"18px 20px 12px" }}>
                <div style={{ marginBottom:16 }}><Eyebrow>Compartir y exportar</Eyebrow></div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <button onClick={()=>{
                    const menu = result.menu.map(d => "*"+d.dia+"*\n🌞 "+d.alm+"\n🌙 "+d.cen).join("\n\n");
                    const lista = Object.entries(result.lista_compras).map(([cat,items]) => "*"+cat+"*\n"+items.map(i=>"• "+i).join("\n")).join("\n\n");
                    window.open("https://wa.me/?text="+encodeURIComponent("🥦 *Mi menú semanal — Kooki*\n\n"+menu+"\n\n───────────────\n🛒 *Lista de compras*\n\n"+lista+"\n\n_Generado con Kooki — IA que cocina con vos_"),"_blank");
                  }} style={{ width:"100%", background:"#25D366", color:"white", border:"none", borderRadius:14, padding:"15px 18px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                    <span style={{ fontSize:20 }}>📱</span> Compartir por WhatsApp
                  </button>
                  <button onClick={()=>{
                    const menu = result.menu.map(d => d.dia+":\nAlmuerzo: "+d.alm+"\nCena: "+d.cen).join("\n\n");
                    const lista = Object.entries(result.lista_compras).map(([cat,items]) => cat+":\n"+items.map(i=>"- "+i).join("\n")).join("\n\n");
                    navigator.clipboard.writeText("MI MENU SEMANAL — KOOKI\n\n"+menu+"\n\n─────────────\nLISTA DE COMPRAS\n\n"+lista).then(()=>alert("✓ Copiado al portapapeles")).catch(()=>alert("No se pudo copiar."));
                  }} style={{ width:"100%", background:C.blueLt, color:C.blue, border:`1.5px solid ${C.bluePl}`, borderRadius:14, padding:"15px 18px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                    <span style={{ fontSize:20 }}>📋</span> Copiar todo al portapapeles
                  </button>
                  <button onClick={()=>{
                    const rows = [["Categoria","Producto"]];
                    Object.entries(result.lista_compras).forEach(([cat,items]) => items.forEach(item => rows.push([cat.replace(/[^\w\s]/gi,"").trim(),item])));
                    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
                    const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a"); a.href=url; a.download="lista-compras-kooki.csv";
                    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
                  }} style={{ width:"100%", background:C.bg, color:C.ink, border:`1.5px solid ${C.line}`, borderRadius:14, padding:"15px 18px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                    <span style={{ fontSize:20 }}>📊</span> Exportar lista (.csv)
                  </button>
                </div>
              </div>
            </div>
          )}

          <button onClick={()=>{ setScreen("loading"); setLoadMsg(0); setTimeout(doGen,2700); }} style={{ width:"100%", marginTop:12, background:C.white, color:C.ink, border:`1.5px solid ${C.line}`, borderRadius:16, padding:"16px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
            ↺ Regenerar menú completo
          </button>
        </div>

        {showChefFab && (
          <div style={{ position:"fixed", bottom:28, right:22, zIndex:100 }}>
            {chefPulse && <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:C.blue, animation:"ripple 1.5s ease infinite", zIndex:-1 }}/>}
            {chefPulse && (
              <div style={{ position:"absolute", bottom:"110%", right:0, background:C.ink, color:C.white, borderRadius:12, padding:"9px 14px", fontSize:12, fontWeight:700, whiteSpace:"nowrap", boxShadow:sh.ink, marginBottom:6, fontFamily:"'Inter',sans-serif" }}>
                ¿Tenés dudas? Preguntame!
                <div style={{ position:"absolute", bottom:-6, right:18, width:12, height:12, background:C.ink, transform:"rotate(45deg)" }}/>
              </div>
            )}
            <button onClick={() => { setChefOpen(true); setChefPulse(false); }} style={{ width:60, height:60, borderRadius:"50%", border:"none", background:C.blue, color:C.white, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:sh.blue, animation:chefPulse?"chefPulse 1.5s ease infinite":"chefBounce 2s ease infinite" }}>
              <ChefHat size={32}/>
            </button>
          </div>
        )}
        {receta && <ModalReceta nombre={receta} onClose={()=>setReceta(null)} />}
        {chefOpen && <ChefChat result={result} recetaActual={receta} onClose={()=>setChefOpen(false)}/>}
      </div>
    );
  }

  return null;
}

// ============================================
// APP ROOT — sin código no entrás
// ============================================
export default function App() {
  const [premium, setPremium] = useState(() => isPremium());

  useEffect(() => { initPixel(); }, []);

  if (!premium) {
    return <AccessScreen
      onAccess={() => { setPremium(true); window.location.reload(); }}
    />;
  }

  return <MainApp />;
}
