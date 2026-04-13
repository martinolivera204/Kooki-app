import { useState, useEffect, useRef } from "react";

/* ─── CÓDIGOS DE ACCESO ───────────────────────────────────────────────────── */
const VALID_CODES = new Set(['KOOKI-4Y8R-MPYF-H6PY', 'KOOKI-PL8G-NIY1-QUPC', 'KOOKI-DZ8V-D2P7-6EO7', 'KOOKI-C7PD-3NMM-1GNO', 'KOOKI-Y8X2-3YBA-DFK8', 'KOOKI-HRTG-P9I3-N2LP', 'KOOKI-17LV-J7VR-9F8Q', 'KOOKI-6OUN-4M28-DANK', 'KOOKI-CAS2-XKYD-25C6', 'KOOKI-86JF-KWFJ-9JN1', 'KOOKI-VQ3M-XWDH-L4DB', 'KOOKI-MO0B-AAHG-PT54', 'KOOKI-S093-U3S0-V1TN', 'KOOKI-XK1U-OQEX-M9IU', 'KOOKI-EH84-VUG9-MTWO', 'KOOKI-60KA-AFQR-XS9C', 'KOOKI-AI2B-2X13-62RG', 'KOOKI-J3CG-7WW4-X4MI', 'KOOKI-UNX2-EH4C-4821', 'KOOKI-WYDK-HDLS-U0N2', 'KOOKI-VA69-X9S9-9GHX', 'KOOKI-0TUM-64BV-TP05', 'KOOKI-ZLGI-BGT3-FP7E', 'KOOKI-SSYC-2JOM-E5HZ', 'KOOKI-35MC-0HEE-MXJG', 'KOOKI-IRMD-KCTV-F2QV', 'KOOKI-VYS8-ADE2-DL4L', 'KOOKI-CYEA-3G00-DI95', 'KOOKI-3002-BRVV-0LN8', 'KOOKI-72E8-1IJO-557Z', 'KOOKI-SU0W-TI9R-KQM8', 'KOOKI-X9P5-S82Y-P1XV', 'KOOKI-H1TS-WNLP-A8VM', 'KOOKI-AC7V-YYYP-70GN', 'KOOKI-ZUS2-8COW-V90B', 'KOOKI-6QQ9-0GPV-PYO3', 'KOOKI-CDNG-3ZUY-PFR6', 'KOOKI-KJ97-OO78-DDC9', 'KOOKI-3TWJ-9638-XX2M', 'KOOKI-O7BO-FABQ-OD00', 'KOOKI-R3B1-DYH0-FEO4', 'KOOKI-H01E-BKNX-SJAR', 'KOOKI-WJUF-ITI9-9PTG', 'KOOKI-760Y-38IJ-CFBX', 'KOOKI-NBUC-FW8W-61AK', 'KOOKI-TUQS-OD4V-UYKU', 'KOOKI-PIGV-FDEF-4322', 'KOOKI-QS0T-XQJ3-K66F', 'KOOKI-FIZ9-5R4G-4KJX', 'KOOKI-2NBL-Z6AQ-094H', 'KOOKI-CXDK-QAIN-FAZ6', 'KOOKI-2ZSG-HOA2-FZZD', 'KOOKI-UMDU-ELF6-0P22', 'KOOKI-CR18-V8LS-08O0', 'KOOKI-GFMT-SJJU-VPAN', 'KOOKI-ULGG-IT8W-SWU2', 'KOOKI-O6WL-5MKU-7MZK', 'KOOKI-YPFG-3EY5-HOXN', 'KOOKI-ZPCT-NS6R-GRQN', 'KOOKI-DOY8-4YEA-L49S', 'KOOKI-69WJ-MWRA-YO2Y', 'KOOKI-2Z3A-STFG-PV5L', 'KOOKI-35QA-93GV-WXRN', 'KOOKI-AACG-T6C4-0G1E', 'KOOKI-E9TB-FZ0J-XAIR', 'KOOKI-Q04N-AX6T-WADW', 'KOOKI-7X3Q-4Q2O-6LNA', 'KOOKI-1IN3-O6DY-822Z', 'KOOKI-FGFF-UT6K-A4OQ', 'KOOKI-KK2G-NHQL-6N1U', 'KOOKI-U8B7-RTUG-AIGB', 'KOOKI-MRY0-53GJ-OPHA', 'KOOKI-O7YC-7ZFF-B5DK', 'KOOKI-RO2H-2O9I-X4O6', 'KOOKI-DG68-PPIZ-U6V0', 'KOOKI-EPOZ-ELCG-O0V1', 'KOOKI-L4AB-SMQD-V9ZB', 'KOOKI-D1N4-WRUE-LDCP', 'KOOKI-KGGU-SQVO-APDR', 'KOOKI-X304-TJBA-V8BY', 'KOOKI-PGPA-EGWZ-2ARK', 'KOOKI-YLIV-U0KQ-M98K', 'KOOKI-5XIU-NW02-YAYS', 'KOOKI-PO0M-F9AD-KF8G', 'KOOKI-OFMK-VJE3-76PP', 'KOOKI-8H64-3ELD-6N96', 'KOOKI-M349-HUNH-13W8', 'KOOKI-MZZV-PHCT-F14O', 'KOOKI-TE5P-LGHQ-L45E', 'KOOKI-542B-RUWO-LAZS', 'KOOKI-M3QA-SIXI-VERU', 'KOOKI-VX7H-YMF3-ZP03', 'KOOKI-61RJ-7269-J6VA', 'KOOKI-IBIL-7X5P-3IQ0', 'KOOKI-WG95-R6Q7-W185', 'KOOKI-MJGA-M73C-PXGT', 'KOOKI-WETL-QND7-7XHJ', 'KOOKI-7U0K-FWYO-IND4', 'KOOKI-Z2D4-K7S8-VJJY', 'KOOKI-0LSN-1R19-E5LG']);
const ACCESS_KEY = "kooki_access_v1";

function AccessScreen({ onAccess }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    const clean = code.trim().toUpperCase();
    if (!clean) { setError("Ingresá tu código de acceso"); return; }
    setLoading(true);
    setTimeout(() => {
      if (VALID_CODES.has(clean)) {
        localStorage.setItem(ACCESS_KEY, clean);
        onAccess();
      } else {
        setError("Código inválido. Revisá el email que recibiste al comprar.");
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
      setLoading(false);
    }, 800);
  };

  const C2 = {
    blue:"#3B6FD4", blueDk:"#2A52A8", blueLt:"#EEF3FC",
    white:"#FFFFFF", gray1:"#F0F3FA", gray2:"#E2E8F5",
    gray4:"#7A8BAD", dark:"#111827", text:"#1E2D4A", sub:"#5A6E8C",
    danger:"#EF4444", dangerLt:"#FEF2F2",
  };

  return (
    <div style={{ minHeight:"100vh", background:C2.white, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 24px", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&family=Nunito:wght@800;900&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}} @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ width:"100%", maxWidth:380, animation:"fadeIn 0.4s ease" }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <span style={{ fontWeight:800, fontSize:36, color:C2.blue, letterSpacing:"-1px", fontFamily:"'Nunito','DM Sans',sans-serif" }}>Kooki</span>
          <div style={{ fontSize:14, color:C2.sub, marginTop:6 }}>IA que cocina con vos</div>
        </div>

        {/* Card */}
        <div style={{ background:C2.white, borderRadius:24, padding:"32px 28px", boxShadow:"0 8px 40px rgba(59,111,212,0.12)", border:`1px solid ${C2.gray2}` }}>
          <div style={{ fontSize:22, fontWeight:800, color:C2.dark, marginBottom:8, letterSpacing:"-0.5px" }}>Ingresá tu código</div>
          <div style={{ fontSize:14, color:C2.sub, lineHeight:1.6, marginBottom:28 }}>
            Encontrás el código en el email que recibiste después de tu compra.
          </div>

          <div style={{ marginBottom:16, animation:shake?"shake 0.5s ease":"none" }}>
            <input
              type="text"
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="KOOKI-XXXX-XXXX-XXXX"
              style={{
                width:"100%", padding:"16px", borderRadius:14, fontSize:16, fontWeight:600,
                border:`2px solid ${error ? C2.danger : code ? C2.blue : C2.gray2}`,
                background:error ? C2.dangerLt : C2.gray1,
                color:C2.dark, fontFamily:"'DM Sans',sans-serif",
                letterSpacing:"1px", textAlign:"center", outline:"none",
                transition:"border 0.2s, background 0.2s",
              }}
            />
            {error && (
              <div style={{ fontSize:13, color:C2.danger, marginTop:8, textAlign:"center", fontWeight:600 }}>
                ⚠️ {error}
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !code.trim()}
            style={{
              width:"100%", padding:"18px", borderRadius:16, border:"none",
              background:loading || !code.trim() ? C2.gray2 : `linear-gradient(135deg,${C2.blue},${C2.blueDk})`,
              color:loading || !code.trim() ? C2.gray4 : C2.white,
              fontSize:17, fontWeight:800, cursor:loading || !code.trim() ? "not-allowed" : "pointer",
              fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s",
              boxShadow:!loading && code.trim() ? "0 8px 28px rgba(59,111,212,0.38)" : "none",
            }}
          >
            {loading ? "Verificando..." : "Acceder →"}
          </button>
        </div>

        <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:C2.sub, lineHeight:1.6 }}>
          ¿No tenés código? <br/>
          <a href="https://impulsoebooks.online" style={{ color:C2.blue, fontWeight:700, textDecoration:"none" }}>
            Comprá tu acceso acá →
          </a>
        </div>
      </div>
    </div>
  );
}



const C = {
  blue:"#3B6FD4", blueDk:"#2A52A8", blueMd:"#5B8AE8", blueLt:"#EEF3FC",
  bluePl:"#D6E4FA", white:"#FFFFFF", bg:"#F4F7FF", gray1:"#F0F3FA",
  gray2:"#E2E8F5", gray3:"#B8C5DE", gray4:"#7A8BAD", dark:"#111827",
  text:"#1E2D4A", sub:"#5A6E8C", success:"#10B981", warn:"#F59E0B",
  purple:"#8B5CF6", purpleLt:"#F3F0FF",
};
const sh = {
  sm:"0 1px 4px rgba(59,111,212,0.08)",
  md:"0 4px 16px rgba(59,111,212,0.12)",
  lg:"0 8px 32px rgba(59,111,212,0.16)",
  blue:"0 8px 28px rgba(59,111,212,0.38)",
  card:"0 2px 12px rgba(30,45,74,0.08)",
};

/* ─── LOGO ────────────────────────────────────────────────────────────────── */
function KookiLogo({ size=28, dark=false }) {
  return (
    <span style={{ fontWeight:800, fontSize:size, color:dark?"#FFF":C.blue,
      letterSpacing:"-1px", lineHeight:1, fontFamily:"'Nunito','DM Sans',sans-serif" }}>
      Kooki
    </span>
  );
}

/* ─── STEPS CONFIG ────────────────────────────────────────────────────────── */
const STEPS = [
  { id:"objetivo", type:"objetivo",
    label:"Elegí lo que más te importa hoy",
    subtitle:"Podés seleccionar hasta 2 prioridades",
    options:[
      {value:"bajar_peso", emoji:"⚖️", label:"Bajar de peso",       desc:"Déficit calórico inteligente",  color:"#EFF6FF"},
      {value:"saludable",  emoji:"🥗", label:"Comer saludable",     desc:"Nutrición completa y balanceada",color:"#F0FDF4"},
      {value:"ahorrar",    emoji:"💰", label:"Ahorrar dinero",      desc:"Máximo rendimiento por peso",   color:"#FFFBEB"},
      {value:"masa",       emoji:"💪", label:"Ganar masa muscular", desc:"Alta proteína y superávit",     color:"#FFF7ED"},
      {value:"organizar",  emoji:"📅", label:"Organizarme mejor",   desc:"Batch cooking sin estrés",      color:"#F5F3FF"},
    ]},
  { id:"dieta", type:"grid",
    label:"¿Seguís alguna dieta?",
    subtitle:"Podés combinar varias opciones",
    options:[
      {value:"libre",           emoji:"🍽️", label:"Sin restricciones"},
      {value:"keto",            emoji:"🥑", label:"Keto"},
      {value:"lowcarb",         emoji:"🥦", label:"Low Carb"},
      {value:"vegetariana",     emoji:"🌿", label:"Vegetariana"},
      {value:"vegana",          emoji:"🌱", label:"Vegana"},
      {value:"singluten",       emoji:"🌾", label:"Sin Gluten"},
      {value:"sinlactosa",      emoji:"🥛", label:"Sin Lactosa"},
      {value:"desinflamatoria", emoji:"🫚", label:"Desinflamatoria"},
    ]},
  { id:"tiempo", type:"cards",
    label:"¿Cuánto tiempo tenés para cocinar?",
    subtitle:"Por comida, en promedio durante la semana",
    options:[
      {value:"rapido", emoji:"⚡", label:"Rápido",     desc:"Menos de 15 minutos", accent:"#FFF7ED"},
      {value:"medio",  emoji:"🕐", label:"Normal",     desc:"Entre 15 y 30 minutos",accent:"#EFF6FF"},
      {value:"libre",  emoji:"🧑‍🍳", label:"Sin límite", desc:"Me gusta cocinar con calma",accent:"#F0FDF4"},
    ]},
  { id:"presupuesto", type:"semaforo",
    label:"¿Cuánto querés gastar en el súper?",
    subtitle:"Por semana, en pesos argentinos",
    options:[
      {value:"bajo",  emoji:"🟢", label:"Ajustado",   desc:"Máximo rendimiento por peso", color:"#10B981", bg:"#F0FDF4"},
      {value:"medio", emoji:"🟡", label:"Moderado",   desc:"Balance entre precio y calidad",color:"#F59E0B",bg:"#FFFBEB"},
      {value:"alto",  emoji:"🔵", label:"Sin límite", desc:"Prefiero calidad ante todo",   color:"#3B6FD4",bg:"#EEF3FC"},
    ]},
  { id:"personas", type:"cards",
    label:"¿Para cuántas personas cocinás?",
    subtitle:"Ajustamos porciones e ingredientes automáticamente",
    options:[
      {value:"1",        emoji:"🙋",    label:"Solo/a",   desc:"1 persona"},
      {value:"2",        emoji:"👫",    label:"De a dos", desc:"2 personas"},
      {value:"familiar", emoji:"👨‍👩‍👧‍👦", label:"Familia",  desc:"3 o más personas"},
    ]},
  { id:"nivel", type:"nivel",
    label:"¿Cómo te manejás en la cocina?",
    subtitle:"Adaptamos la complejidad de las recetas para vos",
    options:[
      {value:"basico",     emoji:"🌱",  label:"Básico",     desc:"Recetas simples, paso a paso"},
      {value:"intermedio", emoji:"🍳",  label:"Intermedio", desc:"Más variedad y técnicas"},
      {value:"avanzado",   emoji:"🧑‍🍳", label:"Avanzado",   desc:"Creatividad y desafíos"},
    ]},
  { id:"extra", type:"extras",
    label:"Último paso",
    subtitle:"Opcional — para un resultado todavía más preciso" },
];

/* ─── RECETAS ─────────────────────────────────────────────────────────────── */
const R = {
  "Ensalada de pollo grillado y quinoa":{t:"20 min",d:"Fácil",k:"380 kcal",p:"35g",e:"🥗",tags:["⚡ Rápido","💪 Alta proteína"],i:["150g pechuga de pollo","½ taza quinoa","Rúcula y lechuga","Tomate cherry x8","Pepino ½","Jugo de limón","Aceite de oliva","Sal y pimienta"],s:["Cocinar la quinoa en agua con sal 15 min. Tapar y apagar.","Grillar la pechuga salpimentada 4 min por lado a fuego fuerte.","Dejar reposar el pollo 3 min antes de cortar en tiras.","Mezclar quinoa, hojas, tomate y pepino. Coronar con el pollo. Condimentar con limón y aceite."]},
  "Sopa de verduras con lentejas":{t:"30 min",d:"Fácil",k:"290 kcal",p:"18g",e:"🥣",tags:["🔥 Bajo en calorías","💚 Desinflamatorio"],i:["1 taza lentejas rojas","1 zanahoria","1 cebolla","2 papas chicas","Caldo en cubo","Comino y sal","Limón"],s:["Picar cebolla y zanahoria. Rehogar 5 min en olla con aceite.","Agregar lentejas enjuagadas y papas en cubos. Cubrir con agua y caldo.","Cocinar 20 min a fuego medio.","Condimentar con comino, sal y limón al servir."]},
  "Wrap de atún con lechuga y tomate":{t:"10 min",d:"Fácil",k:"320 kcal",p:"28g",e:"🌯",tags:["⚡ Express","💪 Alta proteína"],i:["1 lata atún al natural","1 tortilla integral","Lechuga","1 tomate","2 cdas yogur natural","Sal y limón"],s:["Escurrir el atún y mezclar con yogur, sal y limón.","Calentar la tortilla en sartén seca 30 segundos por lado.","Poner lechuga, tomate y la mezcla de atún.","Enrollar y cortar al medio en diagonal."]},
  "Revuelto de claras con espinaca":{t:"10 min",d:"Fácil",k:"180 kcal",p:"22g",e:"🍳",tags:["⚡ Express","🔥 Bajo en calorías"],i:["4 claras de huevo","100g espinaca","1 diente ajo","Sal y pimienta","1 cdita aceite de oliva"],s:["Calentar aceite. Dorar el ajo laminado 1 min.","Agregar espinaca y saltear hasta marchitar.","Volcar las claras batidas con sal y pimienta.","Revolver suavemente a fuego medio-bajo hasta cuajar."]},
  "Pechuga al horno con vegetales asados":{t:"40 min",d:"Fácil",k:"350 kcal",p:"42g",e:"🍗",tags:["💪 Alta proteína","💚 Desinflamatorio"],i:["1 pechuga 200g","1 zapallito","1 morrón","½ berenjena","Ajo, romero, tomillo","Aceite de oliva","Sal y pimienta"],s:["Precalentar horno a 200°C. Cortar vegetales en trozos.","Mezclar todo con aceite, ajo y hierbas en asadera.","Pechuga en el centro, vegetales alrededor.","Hornear 30-35 min hasta dorar."]},
  "Sopa crema de zapallo":{t:"30 min",d:"Fácil",k:"160 kcal",p:"4g",e:"🎃",tags:["🔥 Bajo en calorías","💚 Desinflamatorio"],i:["800g zapallo","1 cebolla","1 papa","Caldo en cubo","200ml leche descremada","Sal, pimienta y nuez moscada"],s:["Rehogar cebolla 5 min. Agregar zapallo y papa en cubos.","Cubrir con agua y caldo. Cocinar 25 min.","Procesar con mixer hasta crema suave.","Agregar leche, calentar sin hervir. Condimentar."]},
  "Ensalada de garbanzos con pepino":{t:"10 min",d:"Fácil",k:"280 kcal",p:"14g",e:"🥗",tags:["⚡ Express","💚 Desinflamatorio"],i:["1 lata garbanzos","1 pepino","Tomate cherry 200g","½ cebolla morada","Perejil","Limón y aceite de oliva","Sal"],s:["Escurrir y enjuagar los garbanzos.","Cortar pepino, tomate y cebolla.","Mezclar todo con perejil picado.","Condimentar con limón, aceite y sal."]},
  "Bowl de arroz integral con pollo":{t:"25 min",d:"Fácil",k:"420 kcal",p:"38g",e:"🍚",tags:["💪 Alta proteína","⚡ Rendidor"],i:["1 taza arroz integral","150g pechuga","200g brócoli","Zanahoria rallada","Salsa de soja","Sésamo"],s:["Cocinar arroz integral 18-20 min tapado.","Grillar o hervir la pechuga. Desmenuzar.","Cocinar brócoli al vapor 5-6 min.","Armar el bowl y condimentar con soja."]},
  "Ensalada completa con atún":{t:"12 min",d:"Fácil",k:"300 kcal",p:"26g",e:"🥗",tags:["⚡ Express","💪 Alta proteína"],i:["1 lata atún","Lechuga variada","2 tomates","2 huevos duros","Aceitunas","Aceite, vinagre y sal"],s:["Hervir los huevos 10 min. Enfriar y pelar.","Lavar y cortar las verduras.","Mezclar todo con el atún escurrido.","Condimentar con aceite, vinagre y sal."]},
  "Tortilla de claras y vegetales":{t:"15 min",d:"Fácil",k:"200 kcal",p:"24g",e:"🥚",tags:["⚡ Rápido","🔥 Bajo en calorías"],i:["4 claras + 1 huevo","1 morrón","½ cebolla","100g espinaca","Sal y pimienta"],s:["Saltear morrón y cebolla picados 5 min.","Agregar espinaca hasta marchitar.","Batir claras y huevo con sal. Volcar.","Tapar, fuego bajo 4 min. Dar vuelta 2 min."]},
  "Omelette de claras con champiñones":{t:"12 min",d:"Fácil",k:"190 kcal",p:"25g",e:"🍄",tags:["⚡ Express","🔥 Bajo en calorías"],i:["4 claras","150g champiñones","1 ajo","Perejil","Sal y pimienta","Manteca"],s:["Laminar champiñones. Saltear con ajo 4-5 min.","Batir claras con sal, pimienta y perejil.","Cocinar en sartén con manteca a fuego medio.","Poner champiñones en el centro y doblar."]},
  "Sopa minestrone liviana":{t:"35 min",d:"Fácil",k:"220 kcal",p:"10g",e:"🍲",tags:["💚 Desinflamatorio","🔥 Bajo en calorías"],i:["1 cebolla","2 zanahorias","2 papas","1 zapallito","½ taza fideos chicos","1 lata tomates","Caldo","Albahaca"],s:["Rehogar cebolla 4 min. Agregar zanahoria y papas.","Sumar tomates y caldo. Cocinar 15 min.","Agregar zapallito y fideos. Cocinar 10 min.","Condimentar con albahaca y sal."]},
  "Pollo al horno con ensalada verde":{t:"55 min",d:"Fácil",k:"390 kcal",p:"46g",e:"🍗",tags:["💪 Alta proteína"],i:["4 presas de pollo","Limón x2","4 dientes ajo","Orégano y romero","Aceite de oliva","Rúcula y lechuga"],s:["Marinar el pollo con limón, ajo, aceite y condimentos 20 min.","Hornear a 200°C por 45-50 min.","Dar vuelta a mitad de cocción.","Servir con ensalada verde condimentada."]},
  "Bowl de arroz integral con palta":{t:"20 min",d:"Fácil",k:"450 kcal",p:"30g",e:"🥑",tags:["💚 Desinflamatorio","⚡ Rendidor"],i:["1 taza arroz integral cocido","150g pollo o atún","1 palta","Tomate cherry","Espinaca baby","Limón, aceite y sésamo"],s:["Tener el arroz ya cocido.","Preparar la proteína a gusto.","Cortar la palta en rodajas.","Armar el bowl y condimentar."]},
  "Ensalada mediterránea con garbanzos":{t:"12 min",d:"Fácil",k:"340 kcal",p:"15g",e:"🫒",tags:["💚 Desinflamatorio","⚡ Express"],i:["1 lata garbanzos","Tomates x3","Pepino","Aceitunas","Queso feta 80g","Cebolla morada","Orégano, aceite y limón"],s:["Escurrir los garbanzos.","Cortar tomates, pepino y cebolla.","Mezclar con aceitunas y queso feta.","Condimentar con aceite, limón y orégano."]},
  "Pechuga al limón con quinoa y brócoli":{t:"30 min",d:"Fácil",k:"420 kcal",p:"48g",e:"🍋",tags:["💪 Alta proteína","💚 Desinflamatorio"],i:["1 pechuga grande","½ taza quinoa","300g brócoli","Limón","Ajo, aceite, sal y pimienta"],s:["Cocinar quinoa en agua con sal 15 min.","Marinar pechuga con limón, ajo y aceite 10 min.","Grillar 4-5 min por lado. Vapor para el brócoli 6 min.","Emplatar quinoa de base, brócoli y pollo."]},
  "Tarta integral de espinaca y ricota":{t:"50 min",d:"Media",k:"380 kcal",p:"22g",e:"🥧",tags:["🌿 Vegetariana"],i:["1 tapa integral","500g espinaca","300g ricota","3 huevos","100g queso rallado","Sal, pimienta y nuez moscada"],s:["Horno a 180°C. Tapa en molde y pinchar.","Cocinar espinaca, escurrir bien y picar.","Mezclar con ricota, huevos, queso y condimentos.","Volcar y hornear 35 min."]},
  "Wok de pollo con vegetales y arroz":{t:"25 min",d:"Media",k:"460 kcal",p:"40g",e:"🥢",tags:["💪 Alta proteína","⚡ Rendidor"],i:["150g pechuga en tiras","1 morrón","1 zapallito","1 zanahoria","Soja, ajo y jengibre","Arroz 1 taza"],s:["Cocinar el arroz aparte.","Calentar wok a fuego muy alto. Saltear ajo y jengibre 30 seg.","Agregar pollo y dorar 3 min.","Sumar vegetales, saltear 4 min. Condimentar con soja."]},
  "Sopa de tomate con albahaca":{t:"25 min",d:"Fácil",k:"180 kcal",p:"5g",e:"🍅",tags:["💚 Desinflamatorio","🔥 Bajo en calorías"],i:["6 tomates o 1 lata","1 cebolla","3 dientes ajo","Caldo","Albahaca fresca","Aceite de oliva","Sal"],s:["Rehogar cebolla y ajo 5 min. Agregar tomates.","Cocinar 15 min. Agregar caldo 5 min más.","Licuar hasta crema suave.","Servir con albahaca y aceite de oliva."]},
  "Ensalada caprese con rúcula":{t:"8 min",d:"Fácil",k:"280 kcal",p:"16g",e:"🍅",tags:["⚡ Express","💚 Desinflamatorio"],i:["3 tomates maduros","200g mozzarella fresca","Rúcula 100g","Albahaca fresca","Aceite de oliva extra virgen","Sal gruesa y pimienta"],s:["Cortar tomates y mozzarella en rodajas.","Intercalar sobre cama de rúcula.","Agregar hojas de albahaca fresca.","Condimentar con aceite, sal gruesa y pimienta."]},
  "Guiso de lentejas con arroz":{t:"35 min",d:"Fácil",k:"480 kcal",p:"22g",e:"🫘",tags:["💰 Económico","⚡ Rendidor"],i:["500g lentejas","1 taza arroz","1 cebolla","2 zanahorias","Caldo","Pimentón, comino y sal"],s:["Rehogar cebolla y zanahoria. Agregar pimentón y comino.","Sumar lentejas, caldo y agua. Cocinar 20 min.","Agregar arroz, mezclar bien.","Cocinar tapado 18 min más."]},
  "Fideos con tuco casero":{t:"25 min",d:"Fácil",k:"520 kcal",p:"18g",e:"🍝",tags:["💰 Económico","⚡ Rendidor"],i:["500g fideos","1 lata tomates perita","1 cebolla","3 dientes ajo","Orégano, albahaca","Aceite","Queso rallado"],s:["Rehogar cebolla y ajo 6 min.","Agregar tomates y condimentos. Cocinar 15 min.","Hervir fideos al dente. Escurrir.","Mezclar con tuco y servir con queso."]},
  "Cazuela de pollo con papas":{t:"50 min",d:"Fácil",k:"560 kcal",p:"42g",e:"🍲",tags:["💰 Económico","💪 Alta proteína"],i:["4 presas pollo","4 papas","1 cebolla","2 zanahorias","1 morrón","Caldo","Pimentón, orégano y sal"],s:["Dorar las presas. Retirar.","Rehogar las verduras 5 min.","Volver el pollo con papas, caldo y condimentos.","Cocinar tapado a fuego bajo 35 min."]},
  "Arroz con pollo y verduras":{t:"40 min",d:"Fácil",k:"530 kcal",p:"38g",e:"🍚",tags:["💰 Económico","💪 Alta proteína"],i:["2 tazas arroz","2 pechugas","1 morrón","1 cebolla","1 zanahoria","Caldo","Cúrcuma, orégano y sal"],s:["Cortar pollo en cubos y dorar. Retirar.","Rehogar las verduras 5 min.","Volver el pollo con arroz, caldo y condimentos.","Cocinar tapado a fuego bajo 20 min."]},
  "Tortilla de papas y cebolla":{t:"30 min",d:"Media",k:"480 kcal",p:"20g",e:"🥚",tags:["💰 Económico"],i:["4 papas","4 huevos","1 cebolla","Sal y pimienta","Aceite de oliva"],s:["Papas en rodajas finas, cocinar en aceite a fuego bajo 15 min.","Rehogar cebolla aparte.","Batir huevos con sal. Mezclar con papas y cebolla.","Tapar, cocinar 5 min. Dar vuelta y dorar 3 min."]},
  "Milanesas con puré de papas":{t:"30 min",d:"Fácil",k:"580 kcal",p:"36g",e:"🥩",tags:["💰 Económico","⚡ Rendidor"],i:["4 milanesas de ternera","1 huevo","Pan rallado","4 papas","100ml leche","30g manteca","Sal, ajo y perejil"],s:["Hervir papas hasta tiernas. Pisar con leche y manteca.","Pasar milanesas por huevo batido y pan rallado.","Freír en aceite caliente 3-4 min por lado.","Servir con el puré al lado."]},
  "Tarta de verduras económica":{t:"45 min",d:"Fácil",k:"420 kcal",p:"18g",e:"🥧",tags:["💰 Económico"],i:["1 tapa de tarta","2 zapallitos","1 cebolla","3 huevos","200g queso cremoso","Sal, pimienta y orégano"],s:["Horno a 180°C. Tapa en molde.","Saltear cebolla y zapallito. Enfriar.","Mezclar con huevos, queso y condimentos.","Volcar y hornear 35 min."]},
  "Pizza de molde casera":{t:"35 min",d:"Fácil",k:"540 kcal",p:"20g",e:"🍕",tags:["💰 Económico","⚡ Rendidor"],i:["2 tazas harina","1 cdita polvo de hornear","Agua tibia","Sal","Salsa de tomate","Mozzarella 200g","Orégano"],s:["Mezclar harina, polvo, sal y agua. Reposar 10 min.","Estirar en asadera aceitada.","Cubrir con salsa, mozzarella y orégano.","Hornear a 220°C por 20-25 min."]},
  "Pollo al horno con papas":{t:"55 min",d:"Fácil",k:"520 kcal",p:"44g",e:"🍗",tags:["💪 Alta proteína","💰 Económico"],i:["1 pollo trozado","4 papas","Limón x2","Ajo, pimentón y orégano","Aceite de oliva","Sal y pimienta"],s:["Condimentar pollo y papas con todos los ingredientes.","Colocar en asadera con aceite y limón.","Hornear a 200°C por 45-50 min.","Dar vuelta a mitad de cocción."]},
  "Guiso de arroz con carne":{t:"50 min",d:"Media",k:"560 kcal",p:"34g",e:"🥘",tags:["💰 Económico","⚡ Rendidor"],i:["500g carne para guiso","2 tazas arroz","1 cebolla","2 papas","2 tomates","Caldo","Pimentón y laurel"],s:["Cortar carne en cubos y dorar. Retirar.","Rehogar cebolla, agregar tomates y pimentón.","Volver la carne con papas, caldo y laurel. Cocinar 25 min.","Agregar arroz, cocinar tapado 18 min."]},
  "Sopa de fideos express":{t:"15 min",d:"Fácil",k:"280 kcal",p:"10g",e:"🍜",tags:["⚡ Express","💰 Económico"],i:["100g fideos finos","Caldo en cubo x2","1 zanahoria","1 papa chica","Perejil","Queso rallado"],s:["Hervir 1.2L de agua con el caldo.","Agregar zanahoria y papa en cubos. Cocinar 8 min.","Sumar fideos. Cocinar 5 min más.","Servir con perejil y queso rallado."]},
  "Revuelto gramajo":{t:"20 min",d:"Fácil",k:"490 kcal",p:"26g",e:"🍳",tags:["⚡ Rápido","💰 Económico"],i:["3 papas","150g jamón o paleta","4 huevos","1 cebolla","Sal y pimienta","Aceite"],s:["Papas en bastones, freír hasta dorar. Escurrir.","Rehogar la cebolla.","Agregar jamón y papas.","Volcar huevos batidos. Revolver hasta cuajar."]},
  "Hamburguesas caseras":{t:"25 min",d:"Fácil",k:"500 kcal",p:"32g",e:"🍔",tags:["💰 Económico"],i:["500g carne picada","1 huevo","3 cdas pan rallado","Sal, pimienta y ajo","Pan x4","Lechuga, tomate y mayonesa"],s:["Mezclar carne con huevo, pan rallado y condimentos.","Formar 4 hamburguesas con manos húmedas.","Cocinar en plancha 4-5 min por lado.","Armar con lechuga, tomate y mayonesa."]},
  "Pechuga con arroz y brócoli":{t:"25 min",d:"Fácil",k:"440 kcal",p:"48g",e:"💪",tags:["💪 Alta proteína"],i:["200g pechuga","1 taza arroz","200g brócoli","Limón","Sal, ajo y pimienta","Aceite de oliva"],s:["Cocinar arroz con sal.","Cocinar brócoli al vapor 5-6 min.","Grillar pechuga salpimentada 4-5 min por lado.","Servir todo junto con limón."]},
  "Salmon con quinoa y vegetales":{t:"30 min",d:"Media",k:"540 kcal",p:"46g",e:"🐟",tags:["💚 Desinflamatorio","💪 Alta proteína"],i:["200g salmón","½ taza quinoa","Brócoli y zanahoria","Limón","Eneldo o perejil","Aceite","Sal"],s:["Cocinar quinoa en agua con sal 15 min.","Cocinar vegetales al vapor 6 min.","Condimentar salmón con limón y sal. Grillar 3-4 min por lado.","Servir con quinoa y vegetales."]},
  "Omelette proteica con queso":{t:"10 min",d:"Fácil",k:"380 kcal",p:"32g",e:"🥚",tags:["⚡ Express","💪 Alta proteína"],i:["4 huevos","50g queso cottage o ricota","Sal y pimienta","Ciboulette","Manteca"],s:["Batir bien los huevos con sal y pimienta.","Calentar sartén con manteca a fuego medio.","Volcar huevos y no revolver. Poner queso cuando casi cuajan.","Doblar y servir con ciboulette."]},
  "Creme de zanahoria y jengibre":{t:"25 min",d:"Fácil",k:"150 kcal",p:"3g",e:"🥕",tags:["💚 Desinflamatorio","🔥 Bajo en calorías"],i:["4 zanahorias grandes","1 cebolla","1 trozo jengibre fresco","Caldo en cubo","Cúrcuma","Leche de coco o leche","Aceite de oliva","Sal y pimienta"],s:["Rehogar cebolla con jengibre rallado 4 min.","Agregar zanahoria en rodajas, cúrcuma y caldo.","Cocinar 20 min. Licuar hasta crema fina.","Agregar leche de coco, salpimentar. Servir con hilo de aceite."]},
  "Bowl desinflamatorio de quinoa":{t:"20 min",d:"Fácil",k:"380 kcal",p:"18g",e:"🫙",tags:["💚 Desinflamatorio","🌿 Vegetariano"],i:["1 taza quinoa","Espinaca fresca","Cúrcuma","Palta","Semillas de chía","Tomate cherry","Limón y aceite de oliva","Jengibre rallado"],s:["Cocinar quinoa con cúrcuma y una pizca de pimienta negra.","Lavar espinaca y cortar el resto de ingredientes.","Armar el bowl con quinoa de base, espinaca, palta y tomate.","Condimentar con limón, aceite y jengibre. Espolvorear chía."]},
  "Salmón al horno con vegetales desinflamatorios":{t:"35 min",d:"Fácil",k:"420 kcal",p:"38g",e:"🐟",tags:["💚 Desinflamatorio","💪 Alta proteína"],i:["200g salmón","Brócoli 200g","Espárragos 150g","Cúrcuma y jengibre","Aceite de oliva","Limón","Sal y pimienta"],s:["Precalentar horno a 200°C. Colocar salmón en asadera.","Distribuir brócoli y espárragos alrededor.","Condimentar todo con cúrcuma, jengibre, aceite, limón y sal.","Hornear 20-25 min hasta que el salmón esté cocido."]},
  "Pollo con cúrcuma y vegetales":{t:"35 min",d:"Fácil",k:"360 kcal",p:"40g",e:"🍗",tags:["💚 Desinflamatorio","💪 Alta proteína"],i:["2 pechugas de pollo","Cúrcuma 1 cdita","Jengibre ½ cdita","Ajo 2 dientes","Morrón rojo","Zapallito","Aceite de oliva","Sal y pimienta"],s:["Marinar el pollo con cúrcuma, jengibre, ajo y aceite 15 min.","Grillar la pechuga 4-5 min por lado hasta dorar.","Saltear morrón y zapallito en el mismo jugo.","Servir el pollo sobre las verduras salteadas."]},
  "Pollo desmenuzado con arroz":{t:"30 min",d:"Fácil",k:"440 kcal",p:"44g",e:"🍗",tags:["💪 Alta proteína","💰 Económico"],i:["2 pechugas","1.5 tazas arroz","Caldo","Sal, ajo y orégano","Aceite de oliva"],s:["Hervir pechugas en agua con sal y ajo 20 min.","Desmenuzar con dos tenedores.","Cocinar el arroz con caldo.","Mezclar pollo con aceite y orégano. Servir con arroz."]},
  "Arroz con pollo preparado":{t:"40 min",d:"Fácil",k:"530 kcal",p:"38g",e:"🍚",tags:["📦 Batch cooking","⚡ Rendidor"],i:["2 tazas arroz","2 pechugas","1 morrón","1 cebolla","1 zanahoria","Caldo","Cúrcuma y orégano"],s:["Cortar pollo en cubos y dorar. Retirar.","Rehogar verduras 5 min con cúrcuma.","Volver el pollo con arroz y caldo.","Cocinar tapado 20 min. Rinde para varios días."]},
  "Fideos con salsa preparada":{t:"20 min",d:"Fácil",k:"520 kcal",p:"18g",e:"🍝",tags:["📦 Batch cooking","💰 Económico"],i:["500g fideos","Salsa de tomate del batch","Queso rallado","Sal y orégano"],s:["Tener la salsa ya preparada del batch semanal.","Hervir los fideos al dente.","Calentar la salsa.","Escurrir y mezclar. Servir con queso."]},
  "Bowl con legumbres cocidas":{t:"10 min",d:"Fácil",k:"390 kcal",p:"20g",e:"🫘",tags:["📦 Batch cooking","⚡ Express"],i:["1 taza legumbres cocidas","Arroz o quinoa cocidos","Verduras de estación","Aceite de oliva","Limón y sal"],s:["Tener legumbres cocidas del batch.","Calentar en sartén con aceite 3-4 min.","Armar el bowl con cereal base y vegetales frescos.","Condimentar con limón, aceite y sal."]},
  "Wrap con sobras":{t:"8 min",d:"Fácil",k:"360 kcal",p:"22g",e:"🌯",tags:["⚡ Express","📦 Batch cooking"],i:["1 tortilla de harina","Sobras de proteína","Verduras frescas","Salsa a elección"],s:["Calentar la tortilla en sartén seca.","Calentar las sobras rápidamente.","Armar el wrap con proteína, vegetales y salsa.","Enrollar y consumir de inmediato."]},
  "Batch cooking dominical":{t:"120 min",d:"Media",k:"Variable",p:"Variable",e:"📦",tags:["📦 Batch cooking"],i:["2kg pollo o carne","2kg arroz","1kg legumbres","2kg verduras variadas","Recipientes herméticos"],s:["Cocinar cereal base en cantidad grande.","Cocinar proteínas: pollo al horno o legumbres.","Preparar salsa base de tomate para la semana.","Dividir en porciones y guardar hermético. Duran 4-5 días."]},
};

/* ─── MENUS ───────────────────────────────────────────────────────────────── */
const MENUS = {
  bajar_peso:{tag:"Déficit calórico",tip:"Proteínas magras y vegetales de alto volumen. Cada comida ronda las 200-450 kcal.",precio:{bajo:"$35.000–45.000",medio:"$50.000–65.000",alto:"$70.000–90.000"},
    menu:[
      {dia:"Lunes",    alm:"Ensalada de pollo grillado y quinoa",  cen:"Sopa de verduras con lentejas",    tag_alm:"💪 Alta proteína",  tag_cen:"🔥 Bajo en calorías"},
      {dia:"Martes",   alm:"Wrap de atún con lechuga y tomate",    cen:"Revuelto de claras con espinaca",  tag_alm:"⚡ Express",        tag_cen:"⚡ Express"},
      {dia:"Miércoles",alm:"Pechuga al horno con vegetales asados",cen:"Sopa crema de zapallo",            tag_alm:"💪 Alta proteína",  tag_cen:"🔥 Bajo en calorías"},
      {dia:"Jueves",   alm:"Ensalada de garbanzos con pepino",     cen:"Omelette de claras con champiñones",tag_alm:"💚 Desinflamatorio",tag_cen:"⚡ Express"},
      {dia:"Viernes",  alm:"Bowl de arroz integral con pollo",     cen:"Ensalada completa con atún",       tag_alm:"💪 Alta proteína",  tag_cen:"⚡ Express"},
      {dia:"Sábado",   alm:"Pollo al horno con ensalada verde",    cen:"Sopa minestrone liviana",          tag_alm:"💪 Alta proteína",  tag_cen:"🔥 Bajo en calorías"},
      {dia:"Domingo",  alm:"Pechuga al limón con quinoa y brócoli",cen:"Tortilla de claras y vegetales",   tag_alm:"💪 Alta proteína",  tag_cen:"🔥 Bajo en calorías"},
    ]},
  saludable:{tag:"Nutrición completa",tip:"Plan balanceado con todos los macronutrientes. Variedad de colores = variedad de nutrientes.",precio:{bajo:"$40.000–55.000",medio:"$60.000–80.000",alto:"$90.000–120.000"},
    menu:[
      {dia:"Lunes",    alm:"Bowl de arroz integral con palta",    cen:"Sopa de verduras con lentejas",    tag_alm:"💚 Desinflamatorio", tag_cen:"🔥 Bajo en calorías"},
      {dia:"Martes",   alm:"Ensalada mediterránea con garbanzos", cen:"Tortilla de papas y cebolla",      tag_alm:"💚 Desinflamatorio", tag_cen:"💰 Económico"},
      {dia:"Miércoles",alm:"Pechuga al limón con quinoa y brócoli",cen:"Sopa crema de zapallo",           tag_alm:"💪 Alta proteína",   tag_cen:"🔥 Bajo en calorías"},
      {dia:"Jueves",   alm:"Tarta integral de espinaca y ricota", cen:"Ensalada de garbanzos con pepino", tag_alm:"🌿 Vegetariana",      tag_cen:"💚 Desinflamatorio"},
      {dia:"Viernes",  alm:"Salmon con quinoa y vegetales",       cen:"Revuelto de claras con espinaca",  tag_alm:"💚 Desinflamatorio", tag_cen:"⚡ Express"},
      {dia:"Sábado",   alm:"Wok de pollo con vegetales y arroz",  cen:"Sopa de tomate con albahaca",      tag_alm:"💪 Alta proteína",   tag_cen:"💚 Desinflamatorio"},
      {dia:"Domingo",  alm:"Pollo al horno con ensalada verde",   cen:"Ensalada caprese con rúcula",      tag_alm:"💪 Alta proteína",   tag_cen:"💚 Desinflamatorio"},
    ]},
  ahorrar:{tag:"Máximo ahorro",tip:"Priorizamos legumbres, huevos y pollo. Las proteínas más económicas y rendidoras.",precio:{bajo:"$18.000–28.000",medio:"$28.000–40.000",alto:"$40.000–55.000"},
    menu:[
      {dia:"Lunes",    alm:"Guiso de lentejas con arroz",  cen:"Fideos con tuco casero",     tag_alm:"💰 Económico", tag_cen:"💰 Económico"},
      {dia:"Martes",   alm:"Cazuela de pollo con papas",   cen:"Sopa de fideos express",     tag_alm:"💰 Económico", tag_cen:"⚡ Express"},
      {dia:"Miércoles",alm:"Arroz con pollo y verduras",   cen:"Tortilla de papas y cebolla",tag_alm:"💰 Económico", tag_cen:"💰 Económico"},
      {dia:"Jueves",   alm:"Milanesas con puré de papas",  cen:"Revuelto gramajo",           tag_alm:"💰 Económico", tag_cen:"⚡ Rápido"},
      {dia:"Viernes",  alm:"Tarta de verduras económica",  cen:"Pizza de molde casera",      tag_alm:"💰 Económico", tag_cen:"💰 Económico"},
      {dia:"Sábado",   alm:"Pollo al horno con papas",     cen:"Hamburguesas caseras",       tag_alm:"💰 Económico", tag_cen:"💰 Económico"},
      {dia:"Domingo",  alm:"Guiso de arroz con carne",     cen:"Fideos con tuco casero",     tag_alm:"💰 Económico", tag_cen:"💰 Económico"},
    ]},
  masa:{tag:"Alta proteína",tip:"1.6–2.2g de proteína por kg corporal. Superávit calórico moderado de 300–500 kcal/día.",precio:{bajo:"$45.000–60.000",medio:"$65.000–85.000",alto:"$90.000–130.000"},
    menu:[
      {dia:"Lunes",    alm:"Pechuga con arroz y brócoli",       cen:"Omelette proteica con queso",     tag_alm:"💪 Alta proteína", tag_cen:"💪 Alta proteína"},
      {dia:"Martes",   alm:"Salmon con quinoa y vegetales",      cen:"Pollo desmenuzado con arroz",    tag_alm:"💚 Desinflamatorio",tag_cen:"💪 Alta proteína"},
      {dia:"Miércoles",alm:"Bowl de arroz integral con pollo",   cen:"Revuelto de claras con espinaca",tag_alm:"💪 Alta proteína", tag_cen:"⚡ Express"},
      {dia:"Jueves",   alm:"Milanesas con puré de papas",        cen:"Ensalada completa con atún",     tag_alm:"💪 Alta proteína", tag_cen:"💪 Alta proteína"},
      {dia:"Viernes",  alm:"Pechuga al horno con vegetales asados",cen:"Pechuga con arroz y brócoli", tag_alm:"💪 Alta proteína", tag_cen:"💪 Alta proteína"},
      {dia:"Sábado",   alm:"Pollo al horno con papas",           cen:"Omelette proteica con queso",    tag_alm:"💪 Alta proteína", tag_cen:"💪 Alta proteína"},
      {dia:"Domingo",  alm:"Pechuga al limón con quinoa y brócoli",cen:"Pollo desmenuzado con arroz", tag_alm:"💪 Alta proteína", tag_cen:"💪 Alta proteína"},
    ]},
  organizar:{tag:"Batch cooking",tip:"Cocinás 2 veces por semana y resolvés todo. El domingo es clave: 2 horas = 7 días resueltos.",precio:{bajo:"$22.000–32.000",medio:"$35.000–50.000",alto:"$55.000–75.000"},
    menu:[
      {dia:"Lunes",    alm:"Arroz con pollo preparado",   cen:"Sopa de verduras con lentejas",tag_alm:"📦 Batch cooking",tag_cen:"🔥 Bajo en calorías"},
      {dia:"Martes",   alm:"Ensalada completa con atún",  cen:"Fideos con salsa preparada",   tag_alm:"⚡ Express",      tag_cen:"📦 Batch cooking"},
      {dia:"Miércoles",alm:"Milanesas con puré de papas", cen:"Sopa de fideos express",        tag_alm:"💰 Económico",    tag_cen:"⚡ Express"},
      {dia:"Jueves",   alm:"Bowl con legumbres cocidas",  cen:"Guiso de lentejas con arroz",  tag_alm:"📦 Batch cooking",tag_cen:"💰 Económico"},
      {dia:"Viernes",  alm:"Wrap con sobras",             cen:"Pizza de molde casera",         tag_alm:"⚡ Express",      tag_cen:"💰 Económico"},
      {dia:"Sábado",   alm:"Pollo al horno con papas",    cen:"Hamburguesas caseras",          tag_alm:"💪 Alta proteína",tag_cen:"💰 Económico"},
      {dia:"Domingo",  alm:"Batch cooking dominical",     cen:"Fideos con tuco casero",        tag_alm:"📦 Batch cooking",tag_cen:"💰 Económico"},
    ]},
  desinflamatoria:{tag:"Antiinflamatorio",tip:"Cúrcuma, jengibre, omega-3 y antioxidantes como base. Eliminamos procesados, azúcar refinada y gluten reducido.",precio:{bajo:"$45.000–60.000",medio:"$65.000–90.000",alto:"$95.000–130.000"},
    menu:[
      {dia:"Lunes",    alm:"Bowl desinflamatorio de quinoa",            cen:"Sopa de tomate con albahaca",      tag_alm:"💚 Desinflamatorio",tag_cen:"💚 Desinflamatorio"},
      {dia:"Martes",   alm:"Salmón al horno con vegetales desinflamatorios",cen:"Creme de zanahoria y jengibre",tag_alm:"💚 Desinflamatorio",tag_cen:"💚 Desinflamatorio"},
      {dia:"Miércoles",alm:"Ensalada mediterránea con garbanzos",       cen:"Sopa minestrone liviana",          tag_alm:"💚 Desinflamatorio",tag_cen:"💚 Desinflamatorio"},
      {dia:"Jueves",   alm:"Pollo con cúrcuma y vegetales",             cen:"Bowl de arroz integral con palta", tag_alm:"💚 Desinflamatorio",tag_cen:"💚 Desinflamatorio"},
      {dia:"Viernes",  alm:"Pechuga al limón con quinoa y brócoli",     cen:"Ensalada caprese con rúcula",      tag_alm:"💚 Desinflamatorio",tag_cen:"💚 Desinflamatorio"},
      {dia:"Sábado",   alm:"Salmon con quinoa y vegetales",             cen:"Sopa de verduras con lentejas",    tag_alm:"💚 Desinflamatorio",tag_cen:"💚 Desinflamatorio"},
      {dia:"Domingo",  alm:"Ensalada de pollo grillado y quinoa",       cen:"Creme de zanahoria y jengibre",    tag_alm:"💚 Desinflamatorio",tag_cen:"💚 Desinflamatorio"},
    ]},
};

const LISTAS = {
  bajar_peso:{"🥩 Proteínas":["Pechuga de pollo 1kg","Atún al natural x3","Huevos x12","Salmon 400g"],"🥦 Verduras":["Espinaca 500g","Brócoli 500g","Tomate cherry 500g","Pepino x2","Zapallo 1kg","Rúcula y lechuga"],"🌾 Cereales":["Quinoa 500g","Arroz integral 1kg"],"🧴 Almacén":["Aceite de oliva 500ml","Limón x4","Caldo en cubos x4","Yogur natural x2"],"🧀 Lácteos":["Ricota 250g","Queso rallado 150g"]},
  saludable:{"🥩 Proteínas":["Pechuga de pollo 1kg","Salmon 400g","Huevos x12","Garbanzos 500g"],"🥦 Verduras":["Espinaca 500g","Zapallo 1kg","Zanahoria x4","Tomates x6","Brócoli 500g","Palta x2"],"🌾 Cereales":["Arroz integral 1kg","Quinoa 500g"],"🧴 Almacén":["Aceite de oliva 500ml","Limón x3","Caldo en cubos x4"],"🧀 Lácteos":["Ricota 500g","Queso cremoso 400g","Mozzarella 200g"]},
  ahorrar:{"🥩 Proteínas":["Pollo entero 1.5kg","Carne para guiso 500g","Carne picada 500g","Huevos x12","Atún x2"],"🥦 Verduras":["Papa 2kg","Cebolla 1kg","Zanahoria 500g","Zapallo 1kg","Tomates x6"],"🌾 Cereales":["Arroz 1kg","Fideos 500g x2","Lentejas 500g","Harina 1kg"],"🧴 Almacén":["Aceite 1L","Salsa de tomate x3","Caldo en cubos x6","Pan"],"🧀 Lácteos":["Queso rallado 200g","Queso cremoso 400g"]},
  masa:{"🥩 Proteínas":["Pechuga de pollo 1.5kg","Carne magra 500g","Huevos x18","Atún x3","Salmon 400g"],"🥦 Verduras":["Brócoli 500g","Espinaca 500g","Tomates x4","Batata 1.5kg"],"🌾 Cereales":["Arroz integral 1kg","Quinoa 500g"],"🧴 Almacén":["Aceite de oliva 500ml","Limón x4","Caldo en cubos x4"],"🧀 Lácteos":["Queso cottage 500g","Leche 2L","Queso rallado 200g"]},
  organizar:{"🥩 Proteínas":["Pollo entero 1.5kg","Carne picada 500g","Carne para guiso 500g","Huevos x12","Atún x2"],"🥦 Verduras":["Cebolla 1kg","Papa 2kg","Zanahoria 500g","Tomates x6","Espinaca 500g"],"🌾 Cereales":["Arroz 1kg","Fideos 500g x2","Lentejas 500g"],"🧴 Almacén":["Aceite 1L","Salsa de tomate x4","Caldo en cubos x8","Pan"],"🧀 Lácteos":["Queso rallado 200g","Queso cremoso 300g"]},
  desinflamatoria:{"🥩 Proteínas":["Salmon rosado 600g","Pechuga de pollo 1kg","Huevos x12","Sardinas en aceite x2"],"🥦 Verduras":["Espinaca 500g","Brócoli 500g","Zanahoria x4","Tomates x6","Zapallo 1kg","Espárragos 300g"],"🌾 Cereales":["Quinoa 500g","Arroz integral 1kg"],"🧴 Almacén":["Aceite de oliva extra virgen","Cúrcuma molida","Jengibre fresco","Limón x6","Semillas de chía 200g"],"🥑 Extras":["Palta x4","Leche de coco 400ml","Arándanos o frutos rojos 300g"]},
};

function generar(a) {
  const obj = a.objetivo?.[0] || "organizar";
  const dietas = a.dieta || [];
  let key = obj;
  if (dietas.includes("desinflamatoria")) key = "desinflamatoria";
  const data = MENUS[key] || MENUS.organizar;
  return { ...data, lista_compras: LISTAS[key]||LISTAS.organizar, objetivo:key, precio_estimado:data.precio[a.presupuesto||"medio"], answers:a };
}

/* ─── MINI COMPONENTS ─────────────────────────────────────────────────────── */
function Tag({ children, color=C.blue, bg=C.blueLt }) {
  return <span style={{ background:bg, color, borderRadius:20, padding:"2px 9px", fontSize:11, fontWeight:700, display:"inline-block", lineHeight:1.5 }}>{children}</span>;
}

const TAG_COLORS = {
  "💚 Desinflamatorio": { bg:"#F0FDF4", color:"#16A34A" },
  "💪 Alta proteína":   { bg:"#FFF7ED", color:"#EA580C" },
  "⚡ Express":         { bg:"#FFFBEB", color:"#D97706" },
  "⚡ Rápido":          { bg:"#FFFBEB", color:"#D97706" },
  "⚡ Rendidor":        { bg:"#EFF6FF", color:C.blue },
  "🔥 Bajo en calorías":{ bg:"#FEF2F2", color:"#DC2626" },
  "💰 Económico":       { bg:"#F0FDF4", color:"#15803D" },
  "🌿 Vegetariana":     { bg:"#F0FDF4", color:"#16A34A" },
  "📦 Batch cooking":   { bg:"#F5F3FF", color:"#7C3AED" },
};

function MealTag({ label }) {
  const s = TAG_COLORS[label] || { bg: C.blueLt, color: C.blue };
  return <Tag bg={s.bg} color={s.color}>{label}</Tag>;
}

/* ─── MODAL RECETA ────────────────────────────────────────────────────────── */
function ModalReceta({ nombre, onClose }) {
  const [cookMode, setCookMode] = useState(false);
  const r = R[nombre];
  if (!r) return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(10,15,30,0.7)",zIndex:2000,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(6px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.white,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:580,padding:"28px 24px 40px" }}>
        <div style={{ fontSize:22,fontWeight:800,color:C.dark,marginBottom:12 }}>{nombre}</div>
        <p style={{ color:C.sub,fontSize:15,lineHeight:1.65 }}>Receta detallada próximamente.</p>
        <button onClick={onClose} style={{ marginTop:20,width:"100%",background:C.blue,color:C.white,border:"none",borderRadius:16,padding:"15px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>Cerrar</button>
      </div>
    </div>
  );

  /* MODO COCINA */
  if (cookMode) return (
    <div style={{ position:"fixed",inset:0,background:C.dark,zIndex:3000,overflowY:"auto",padding:"0 0 60px" }}>
      <div style={{ padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:C.dark,zIndex:10 }}>
        <span style={{ color:C.white,fontSize:18,fontWeight:800,fontFamily:"'DM Sans',sans-serif" }}>Modo Cocina 🍳</span>
        <button onClick={()=>setCookMode(false)} style={{ background:"rgba(255,255,255,0.12)",border:"none",borderRadius:10,padding:"8px 16px",color:C.white,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>Salir</button>
      </div>
      <div style={{ padding:"8px 24px 0" }}>
        <div style={{ fontSize:28,marginBottom:8 }}>{r.e}</div>
        <div style={{ fontSize:24,fontWeight:800,color:C.white,lineHeight:1.2,marginBottom:24 }}>{nombre}</div>
        {r.s.map((paso, i) => (
          <div key={i} style={{ marginBottom:28 }}>
            <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:12 }}>
              <div style={{ width:44,height:44,borderRadius:"50%",background:C.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:C.white,flexShrink:0 }}>{i+1}</div>
              <div style={{ height:2,flex:1,background:"rgba(255,255,255,0.1)",borderRadius:2 }}/>
            </div>
            <div style={{ fontSize:22,lineHeight:1.65,color:C.white,fontFamily:"'DM Sans',sans-serif",paddingLeft:4 }}>{paso}</div>
          </div>
        ))}
        <button onClick={()=>{ setCookMode(false); onClose(); }} style={{ width:"100%",background:C.blue,color:C.white,border:"none",borderRadius:16,padding:"18px",fontSize:17,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginTop:8 }}>
          ✓ Listo, terminé de cocinar
        </button>
      </div>
    </div>
  );

  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(10,15,30,0.7)",zIndex:2000,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(6px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.white,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:580,maxHeight:"90vh",overflowY:"auto",paddingBottom:40 }}>
        <div style={{ display:"flex",justifyContent:"center",padding:"10px 0 6px" }}>
          <div style={{ width:40,height:5,background:C.gray3,borderRadius:4 }}/>
        </div>
        <div style={{ background:`linear-gradient(140deg,${C.blue},${C.blueDk})`,padding:"22px 24px 26px",position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.06)" }}/>
          <div style={{ fontSize:44,marginBottom:10 }}>{r.e}</div>
          <div style={{ fontSize:20,fontWeight:800,color:C.white,lineHeight:1.25,marginBottom:12 }}>{nombre}</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:7,marginBottom:12 }}>
            {[["⏱",r.t],["👨‍🍳",r.d],r.k&&["🔥",r.k],r.p&&["💪",r.p]].filter(Boolean).map(([ic,val],i) => (
              <span key={i} style={{ background:"rgba(255,255,255,0.18)",color:C.white,borderRadius:20,padding:"5px 12px",fontSize:13,fontWeight:600 }}>{ic} {val}</span>
            ))}
          </div>
          {r.tags && (
            <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
              {r.tags.map((t,i) => { const s=TAG_COLORS[t]||{}; return <span key={i} style={{ background:"rgba(255,255,255,0.15)",color:C.white,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700 }}>{t}</span>; })}
            </div>
          )}
        </div>
        <div style={{ padding:"20px 24px 0" }}>
          <div style={{ fontSize:12,fontWeight:800,color:C.blue,letterSpacing:"1px",textTransform:"uppercase",marginBottom:12 }}>Ingredientes</div>
          <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:24 }}>
            {r.i.map((ing,i) => (
              <div key={i} style={{ display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:8,height:8,borderRadius:"50%",background:C.blue,flexShrink:0 }}/>
                <span style={{ fontSize:15,color:C.text }}>{ing}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize:12,fontWeight:800,color:C.blue,letterSpacing:"1px",textTransform:"uppercase",marginBottom:12 }}>Preparación</div>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            {r.s.map((paso,i) => (
              <div key={i} style={{ display:"flex",gap:14,alignItems:"flex-start" }}>
                <div style={{ width:32,height:32,borderRadius:"50%",background:C.blueLt,border:`2px solid ${C.bluePl}`,color:C.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,flexShrink:0 }}>{i+1}</div>
                <div style={{ fontSize:15,lineHeight:1.65,color:C.text,paddingTop:5 }}>{paso}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>setCookMode(true)} style={{ marginTop:24,width:"100%",background:C.dark,color:C.white,border:"none",borderRadius:16,padding:"15px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
            🍳 Modo cocina — pantalla limpia
          </button>
          <button onClick={onClose} style={{ marginTop:10,width:"100%",background:`linear-gradient(135deg,${C.blue},${C.blueDk})`,color:C.white,border:"none",borderRadius:16,padding:"15px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:sh.blue }}>
            ✓ Listo, entendido
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── APP ─────────────────────────────────────────────────────────────────── */
export default function App() {
  const [hasAccess, setHasAccess] = useState(() => {
    try { return !!localStorage.getItem(ACCESS_KEY); } catch { return false; }
  });
  const [screen, setScreen]     = useState("home");
  const [step, setStep]         = useState(0);
  const [answers, setAnswers]   = useState({});
  const [result, setResult]     = useState(null);
  const [tab, setTab]           = useState("menu");
  const [receta, setReceta]     = useState(null);
  const [cambiando, setCambiando] = useState(null);
  const [loadMsg, setLoadMsg]   = useState(0);
  const [animKey, setAnimKey]   = useState(0);
  const scrollRef = useRef(null);

  if (!hasAccess) return <AccessScreen onAccess={() => setHasAccess(true)} />;

  const cur    = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const getVal = () => {
    if (cur?.type === "objetivo") return answers.objetivo || [];
    if (cur?.type === "grid") return answers.dieta || [];
    return answers[cur?.id] ?? "";
  };
  const val = getVal();

  const canNext = () => {
    if (cur?.type === "extras") return true;
    if (cur?.type === "objetivo") return (answers.objetivo||[]).length > 0;
    if (cur?.type === "grid") return (answers.dieta||[]).length > 0;
    const v = answers[cur?.id];
    if (!v) return false;
    return true;
  };

  useEffect(() => {
    if (screen === "loading") {
      const msgs = ["Analizando tu objetivo...","Seleccionando recetas ideales...","Calculando tu lista de compras...","Optimizando el presupuesto...","¡Tu menú está casi listo!"];
      let i = 0;
      const t = setInterval(() => { i++; if (i < msgs.length) setLoadMsg(i); else clearInterval(t); }, 500);
      return () => clearInterval(t);
    }
  }, [screen]);

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

  const resetAll = () => { setScreen("home"); setResult(null); setStep(0); setAnswers({}); };

  const handleCambiar = (dia, tipo) => {
    const key = `${dia}-${tipo}`;
    setCambiando(key);
    setTimeout(() => {
      setResult(prev => {
        const pool = MENUS[prev.objetivo]?.menu || [];
        return { ...prev, menu: prev.menu.map(d => {
          if (d.dia !== dia) return d;
          const otros = pool.filter(p => p.dia !== dia && p[tipo] !== d[tipo]);
          const nuevo = otros[Math.floor(Math.random() * otros.length)];
          return nuevo ? { ...d, [tipo]:nuevo[tipo], [`tag_${tipo}`]:nuevo[`tag_${tipo}`] } : d;
        })};
      });
      setCambiando(null);
    }, 700);
  };

  const OBJ_IC = { bajar_peso:"⚖️", saludable:"🥗", ahorrar:"💰", masa:"💪", organizar:"📅", desinflamatoria:"🫚" };
  const GFONT  = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Nunito:wght@700;800;900&display=swap');`;
  const BASE   = `${GFONT} *{box-sizing:border-box;margin:0;padding:0;} body{margin:0;font-family:'DM Sans',sans-serif;} button:focus,textarea:focus{outline:none;} @keyframes slideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} @keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.06)}100%{transform:scale(1)}}`;

  /* ── HOME ── */
  if (screen === "home") return (
    <div ref={scrollRef} style={{ minHeight:"100vh", background:C.white, fontFamily:"'DM Sans',sans-serif", overflowY:"auto", display:"flex", flexDirection:"column" }}>
      <style>{`${BASE} @keyframes floatPhone{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>

      {/* NAV */}
      <nav style={{ padding:"20px 28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <KookiLogo size={28}/>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:C.blueLt, borderRadius:20, padding:"6px 12px" }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:C.success, display:"inline-block" }}/>
          <span style={{ fontSize:12, fontWeight:700, color:C.blue }}>Acceso activo</span>
        </div>
      </nav>

      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"16px 28px 0", maxWidth:480, margin:"0 auto", width:"100%" }}>
        <h1 style={{ fontSize:38, fontWeight:800, color:C.dark, lineHeight:1.1, marginBottom:14, letterSpacing:"-1.5px" }}>
          Tu semana<br/>resuelta en<br/><span style={{ color:C.blue }}>2 minutos.</span>
        </h1>
        <p style={{ fontSize:15, color:C.sub, lineHeight:1.7, marginBottom:16, maxWidth:320 }}>
          Vos respondés. Kooki resuelve.
        </p>

        {/* MOCKUP FOTO REAL */}
        <div style={{ position:"relative", marginBottom:28, display:"flex", justifyContent:"center", alignItems:"center" }}>
          <div style={{ position:"absolute", width:280, height:280, borderRadius:"50%", background:`radial-gradient(circle, ${C.bluePl} 0%, transparent 70%)`, zIndex:0 }}/>
          <img
            src="data:image/jpeg;base64,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"
            alt="Kooki app"
            style={{ width:"100%", maxWidth:300, borderRadius:24, position:"relative", zIndex:1, animation:"floatPhone 3s ease-in-out infinite", boxShadow:`0 20px 60px rgba(59,111,212,0.18)` }}
          />
        </div>

        {/* BENEFICIOS */}
        <div style={{ background:C.bg, borderRadius:20, padding:"24px 24px", marginBottom:28, border:`1px solid ${C.gray2}` }}>
          <div style={{ fontSize:12, fontWeight:800, color:C.gray4, letterSpacing:"1px", textTransform:"uppercase", marginBottom:14 }}>Esto es lo que Kooki hace por vos:</div>
          {[
            ["✔️","Menú completo de lunes a domingo"],
            ["✔️","Lista de compras organizada por sección"],
            ["✔️","Recetas paso a paso con modo cocina"],
            ["✔️","Optimizado según tu objetivo y presupuesto"],
          ].map(([ic,txt],i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:i<3?11:0 }}>
              <span style={{ fontSize:14, flexShrink:0 }}>{ic}</span>
              <span style={{ fontSize:14, fontWeight:600, color:C.text }}>{txt}</span>
            </div>
          ))}
        </div>

        <button onClick={() => { setScreen("onboarding"); setStep(0); setAnswers({}); }} style={{ width:"100%", background:`linear-gradient(135deg,${C.blue},${C.blueDk})`, color:C.white, border:"none", borderRadius:18, padding:"20px", fontSize:18, fontWeight:800, cursor:"pointer", boxShadow:sh.blue, letterSpacing:"-0.3px", fontFamily:"'DM Sans',sans-serif", marginBottom:12 }}>
          Comenzar →
        </button>
        <p style={{ textAlign:"center", fontSize:13, color:C.gray4, marginBottom:48 }}>✓ Listo en 2 minutos · ✓ Personalizado para vos</p>
      </div>
    </div>
  );
  /* ── ONBOARDING ── */
  if (screen === "onboarding") {
    const progMsg = ["Conociendo tu objetivo…","Ajustando tu alimentación…","Calculando tu tiempo…","Optimizando el presupuesto…","Definiendo las porciones…","Personalizando la complejidad…","Un último detalle…"];
    const selDietas = answers.dieta || [];

    return (
      <div style={{ minHeight:"100vh", background:C.white, fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column" }}>
        <style>{BASE}</style>

        {/* NAV */}
        <div style={{ padding:"14px 20px", display:"flex", alignItems:"center", gap:14, borderBottom:`1px solid ${C.gray2}` }}>
          <button onClick={() => step === 0 ? setScreen("home") : setStep(s=>s-1)} style={{ background:C.gray1, border:"none", borderRadius:12, width:38, height:38, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", color:C.text, fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>←</button>
          <div style={{ flex:1 }}>
            <div style={{ height:5, background:C.gray2, borderRadius:10, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${((step+1)/STEPS.length)*100}%`, background:`linear-gradient(90deg,${C.blue},${C.blueMd||C.blueMd})`, borderRadius:10, transition:"width 0.4s cubic-bezier(.4,0,.2,1)" }}/>
            </div>
            <div style={{ fontSize:12, color:C.blue, fontWeight:600, marginTop:5 }}>{progMsg[step]}</div>
          </div>
          <span style={{ fontSize:13, fontWeight:700, color:C.sub }}>{step+1}/{STEPS.length}</span>
        </div>

        <div key={animKey} style={{ flex:1, padding:"24px 20px 32px", overflowY:"auto", maxWidth:520, margin:"0 auto", width:"100%", animation:"slideIn 0.3s ease" }}>

          {/* Feedback dietas seleccionadas */}
          {cur.type === "grid" && selDietas.length > 0 && (
            <div style={{ background:C.blueLt, borderRadius:12, padding:"10px 14px", marginBottom:16, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <span style={{ fontSize:13, color:C.blue, fontWeight:700 }}>Seleccionaste:</span>
              {selDietas.map(d => {
                const opt = STEPS[1].options.find(o=>o.value===d);
                return opt ? <Tag key={d} color={C.blue} bg={C.bluePl}>{opt.emoji} {opt.label}</Tag> : null;
              })}
            </div>
          )}

          {/* Cierre emocional en último paso */}
          {cur.type === "extras" && (
            <div style={{ background:`linear-gradient(135deg,${C.blueLt},${C.bluePl})`, borderRadius:16, padding:"16px 18px", marginBottom:20, borderLeft:`4px solid ${C.blue}` }}>
              <div style={{ fontSize:16, fontWeight:800, color:C.dark, marginBottom:4 }}>¡Ya estamos listos! 🎉</div>
              <div style={{ fontSize:14, color:C.sub, lineHeight:1.55 }}>Con esto ya podemos armar tu semana perfecta. Los campos de abajo son opcionales.</div>
            </div>
          )}

          <div style={{ fontSize:24, fontWeight:800, color:C.dark, lineHeight:1.25, marginBottom:6, letterSpacing:"-0.5px" }}>{cur.label}</div>
          {cur.subtitle && <div style={{ fontSize:15, color:C.sub, marginBottom:24, lineHeight:1.55 }}>{cur.subtitle}</div>}

          {/* OBJETIVO — hasta 2 opciones */}
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
                  <button key={opt.value} onClick={toggle} style={{ padding:"16px 18px", borderRadius:16, cursor:"pointer", textAlign:"left", border:`2px solid ${sel?C.blue:C.gray2}`, background:sel?opt.color||C.blueLt:C.white, display:"flex", alignItems:"center", gap:14, transition:"all 0.18s", fontFamily:"'DM Sans',sans-serif", boxShadow:sel?`0 0 0 3px ${C.blue}22,${sh.md}`:sh.sm, animation:sel?"pop 0.25s ease":"none" }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:sel?C.blue:C.gray1, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0, transition:"all 0.15s" }}>{opt.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:16, fontWeight:700, color:sel?C.blueDk:C.dark }}>{opt.label}</div>
                      {opt.desc && <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>{opt.desc}</div>}
                    </div>
                    {sel && <div style={{ width:26, height:26, borderRadius:"50%", background:C.blue, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:C.white, fontWeight:800, fontSize:13 }}>{rank+1}</div>}
                  </button>
                );
              })}
              {(answers.objetivo||[]).length === 2 && (
                <div style={{ textAlign:"center", fontSize:13, color:C.blue, fontWeight:600, marginTop:4 }}>✓ Máximo 2 objetivos seleccionados</div>
              )}
            </div>
          )}

          {/* GRID — dietas */}
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
                  <button key={opt.value} onClick={toggle} style={{ padding:"18px 12px", borderRadius:16, cursor:"pointer", textAlign:"center", border:`2px solid ${sel?C.blue:C.gray2}`, background:sel?C.blueLt:C.white, display:"flex", flexDirection:"column", alignItems:"center", gap:8, transition:"all 0.18s", boxShadow:sel?`0 0 0 3px ${C.blue}22,${sh.md}`:sh.sm, fontFamily:"'DM Sans',sans-serif", animation:sel?"pop 0.25s ease":"none" }}>
                    <div style={{ fontSize:30 }}>{opt.emoji}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:sel?C.blueDk:C.dark }}>{opt.label}</div>
                    {sel && <Tag color={C.blue} bg={C.bluePl}>✓</Tag>}
                  </button>
                );
              })}
            </div>
          )}

          {/* CARDS estándar */}
          {cur.type === "cards" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {cur.options.map(opt => {
                const sel = answers[cur.id] === opt.value;
                return (
                  <button key={opt.value} onClick={() => setAnswers(a=>({...a,[cur.id]:opt.value}))} style={{ padding:"16px 18px", borderRadius:16, cursor:"pointer", textAlign:"left", border:`2px solid ${sel?C.blue:C.gray2}`, background:sel?opt.accent||C.blueLt:C.white, display:"flex", alignItems:"center", gap:14, transition:"all 0.18s", fontFamily:"'DM Sans',sans-serif", boxShadow:sel?`0 0 0 3px ${C.blue}22,${sh.md}`:sh.sm, animation:sel?"pop 0.25s ease":"none" }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:sel?C.blue:C.gray1, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0, transition:"all 0.15s" }}>{opt.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:16, fontWeight:700, color:sel?C.blueDk:C.dark }}>{opt.label}</div>
                      {opt.desc && <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>{opt.desc}</div>}
                    </div>
                    <div style={{ width:24, height:24, borderRadius:"50%", background:sel?C.blue:C.gray2, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s" }}>
                      {sel && <span style={{ color:C.white, fontSize:13, fontWeight:800 }}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* NIVEL */}
          {cur.type === "nivel" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {cur.options.map(opt => {
                const sel = answers.nivel === opt.value;
                return (
                  <button key={opt.value} onClick={() => setAnswers(a=>({...a,nivel:opt.value}))} style={{ padding:"16px 18px", borderRadius:16, cursor:"pointer", textAlign:"left", border:`2px solid ${sel?C.blue:C.gray2}`, background:sel?C.blueLt:C.white, display:"flex", alignItems:"center", gap:14, transition:"all 0.18s", fontFamily:"'DM Sans',sans-serif", boxShadow:sel?`0 0 0 3px ${C.blue}22,${sh.md}`:sh.sm, animation:sel?"pop 0.25s ease":"none" }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:sel?C.blue:C.gray1, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0, transition:"all 0.15s" }}>{opt.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:16, fontWeight:700, color:sel?C.blueDk:C.dark }}>{opt.label}</div>
                      <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>{opt.desc}</div>
                    </div>
                    <div style={{ width:24, height:24, borderRadius:"50%", background:sel?C.blue:C.gray2, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s" }}>
                      {sel && <span style={{ color:C.white, fontSize:13, fontWeight:800 }}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* SEMAFORO presupuesto */}
          {cur.type === "semaforo" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {cur.options.map(opt => {
                const sel = answers.presupuesto === opt.value;
                return (
                  <button key={opt.value} onClick={() => setAnswers(a=>({...a,presupuesto:opt.value}))} style={{ padding:"18px 20px", borderRadius:16, cursor:"pointer", textAlign:"left", border:`2px solid ${sel?opt.color:C.gray2}`, background:sel?opt.bg:C.white, display:"flex", alignItems:"center", gap:16, transition:"all 0.18s", fontFamily:"'DM Sans',sans-serif", boxShadow:sel?`0 0 0 3px ${opt.color}30,${sh.md}`:sh.sm, animation:sel?"pop 0.25s ease":"none" }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", background:opt.color, boxShadow:`0 0 0 4px ${opt.color}30`, flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:16, fontWeight:700, color:sel?C.dark:C.dark }}>{opt.label}</div>
                      <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>{opt.desc}</div>
                    </div>
                    <div style={{ width:24, height:24, borderRadius:"50%", background:sel?opt.color:C.gray2, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s" }}>
                      {sel && <span style={{ color:C.white, fontSize:13, fontWeight:800 }}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* EXTRAS */}
          {cur.type === "extras" && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {[{id:"ingredientes",label:"¿Qué tenés en casa ahora?",ph:"Ej: arroz, huevos, pollo, tomates...",e:"🧺"},{id:"no_gusta",label:"¿Algo que no comás?",ph:"Ej: cebolla cruda, mariscos...",e:"🚫"}].map(f => (
                <div key={f.id}>
                  <div style={{ fontSize:15, fontWeight:700, color:C.dark, marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
                    <span>{f.e}</span>{f.label}<span style={{ fontWeight:500, color:C.gray4, fontSize:13 }}>(opcional)</span>
                  </div>
                  <textarea value={answers[f.id]||""} onChange={e=>setAnswers(a=>({...a,[f.id]:e.target.value}))} placeholder={f.ph} rows={3}
                    style={{ width:"100%", padding:"14px 16px", borderRadius:14, border:`2px solid ${C.gray2}`, fontSize:15, color:C.text, resize:"none", lineHeight:1.6, background:C.gray1, fontFamily:"'DM Sans',sans-serif" }}
                    onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.gray2}
                  />
                </div>
              ))}
            </div>
          )}

          <button onClick={handleNext} disabled={!canNext()} style={{ width:"100%", marginTop:28, padding:"18px", borderRadius:16, border:"none", fontSize:17, fontWeight:800, background:canNext()?`linear-gradient(135deg,${C.blue},${C.blueDk})`:C.gray2, color:canNext()?C.white:C.gray4, cursor:canNext()?"pointer":"not-allowed", boxShadow:canNext()?sh.blue:"none", transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif", letterSpacing:"-0.2px" }}>
            {isLast ? "✨ Generar mi menú" : "Continuar →"}
          </button>
          {cur.type === "extras" && <p style={{ textAlign:"center", fontSize:13, color:C.gray4, marginTop:10 }}>Podés saltearlo y continuar directo</p>}
        </div>
      </div>
    );
  }

  /* ── LOADING ── */
  if (screen === "loading") {
    const MSGS = ["Analizando tu objetivo...","Seleccionando las mejores recetas...","Calculando la lista de compras...","Optimizando el presupuesto...","¡Tu menú está casi listo!"];
    return (
      <div style={{ minHeight:"100vh", background:C.white, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, fontFamily:"'DM Sans',sans-serif" }}>
        <style>{BASE}</style>
        <div style={{ width:80, height:80, borderRadius:"50%", border:`6px solid ${C.blueLt}`, borderTop:`6px solid ${C.blue}`, animation:"spin 0.9s linear infinite", marginBottom:32 }}/>
        <h2 style={{ fontSize:26, fontWeight:800, color:C.dark, marginBottom:10, textAlign:"center", letterSpacing:"-0.5px" }}>Kooki está trabajando...</h2>
        <p style={{ fontSize:15, color:C.sub, textAlign:"center", maxWidth:260, lineHeight:1.65, marginBottom:32 }}>Personalizando tu plan de alimentación</p>
        <div style={{ width:"100%", maxWidth:300, display:"flex", flexDirection:"column", gap:12 }}>
          {MSGS.map((m,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, opacity:i<=loadMsg?1:0.2, transition:"opacity 0.4s", animation:i===loadMsg?"fadeUp 0.4s ease":"none" }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:i<loadMsg?C.success:i===loadMsg?C.blue:C.gray3, flexShrink:0, transition:"background 0.3s" }}/>
              <span style={{ fontSize:14, color:i===loadMsg?C.text:C.gray4, fontWeight:i===loadMsg?600:400 }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── RESULT ── */
  if (screen === "result" && result) return (
    <div ref={scrollRef} style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif", overflowY:"auto" }}>
      <style>{BASE}</style>

      {/* HEADER */}
      <div style={{ background:`linear-gradient(140deg,${C.blue},${C.blueDk})`, padding:"22px 22px 36px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-50, right:-50, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }}/>
        <div style={{ position:"absolute", bottom:-70, left:-30, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}/>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22, position:"relative" }}>
          <KookiLogo size={26} dark/>
          <button onClick={resetAll} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", color:C.white, borderRadius:12, padding:"8px 16px", fontSize:13, cursor:"pointer", fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>↺ Nuevo menú</button>
        </div>
        <div style={{ position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <span style={{ fontSize:22 }}>{OBJ_IC[result.objetivo]||"✨"}</span>
            <span style={{ background:"rgba(255,255,255,0.18)", color:C.white, borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:700 }}>{result.tag}</span>
          </div>
          <div style={{ fontSize:24, fontWeight:800, color:C.white, marginBottom:8, letterSpacing:"-0.5px" }}>Tu plan está listo 🎉</div>
          <div style={{ fontSize:14, color:"rgba(255,255,255,0.82)", lineHeight:1.6, marginBottom:18 }}>{result.tip}</div>
          {result.precio_estimado && (
            <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:16, padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:26 }}>🛒</span>
              <div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase" }}>Estimado compras semanales</div>
                <div style={{ fontSize:20, fontWeight:800, color:C.white, marginTop:2 }}>{result.precio_estimado} ARS</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TABS */}
      <div style={{ background:C.white, margin:"0 16px", borderRadius:18, padding:5, marginTop:-16, boxShadow:sh.lg, position:"relative", zIndex:10 }}>
        <div style={{ display:"flex", gap:4 }}>
          {[["menu","📅 Menú"],["lista","🛒 Compras"],["recetas","👨‍🍳 Recetas"]].map(([id,lbl]) => (
            <button key={id} onClick={()=>setTab(id)} style={{ flex:1, padding:"12px 6px", borderRadius:13, border:"none", fontWeight:700, fontSize:13, cursor:"pointer", transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif", background:tab===id?C.blue:"transparent", color:tab===id?C.white:C.gray4 }}>{lbl}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px 16px 44px", animation:"slideIn 0.35s ease" }}>

        {/* TAB MENÚ */}
        {tab === "menu" && (
          <div style={{ background:C.white, borderRadius:18, overflow:"hidden", boxShadow:sh.md }}>
            {result.menu.map((d,i) => (
              <div key={i}>
                <div style={{ padding:"14px 18px 14px" }}>
                  <div style={{ fontWeight:800, color:C.blue, fontSize:11, textTransform:"uppercase", letterSpacing:"1px", marginBottom:12 }}>{d.dia}</div>
                  {[["alm","🌞","Almuerzo","tag_alm"],["cen","🌙","Cena","tag_cen"]].map(([k,ic,lb,tagKey]) => (
                    <div key={k} style={{ marginBottom:k==="alm"?12:0 }}>
                      <div style={{ display:"flex", alignItems:"flex-start" }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12, color:C.gray4, marginBottom:3 }}>{ic} {lb}</div>
                          <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:5 }}>{d[k]}</div>
                          {d[tagKey] && <MealTag label={d[tagKey]}/>}
                        </div>
                        <div style={{ display:"flex", gap:6, flexShrink:0, marginLeft:10, paddingTop:2 }}>
                          <button onClick={()=>setReceta(d[k])} style={{ background:C.blueLt, border:"none", borderRadius:8, padding:"5px 11px", fontSize:12, color:C.blue, cursor:"pointer", fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>Receta</button>
                          <button onClick={()=>handleCambiar(d.dia,k)} style={{ background:C.gray1, border:`1px solid ${C.gray2}`, borderRadius:8, padding:"5px 9px", fontSize:13, color:cambiando===`${d.dia}-${k}`?C.blue:C.gray4, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s" }}>
                            {cambiando===`${d.dia}-${k}`?"⏳":"🔄"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {i<6 && <div style={{ height:1, background:C.gray2 }}/>}
              </div>
            ))}
          </div>
        )}

        {/* TAB LISTA */}
        {tab === "lista" && (
          <div style={{ background:C.white, borderRadius:18, overflow:"hidden", boxShadow:sh.md }}>
            {Object.entries(result.lista_compras).map(([cat,items],i,arr) => (
              <div key={i}>
                <div style={{ padding:"16px 18px" }}>
                  <div style={{ fontSize:14, fontWeight:800, color:C.dark, marginBottom:12 }}>{cat}</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {items.map((item,j) => (
                      <label key={j} style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
                        <div style={{ width:22, height:22, borderRadius:7, border:`2px solid ${C.gray3}`, flexShrink:0 }}/>
                        <span style={{ fontSize:14, color:C.text, fontWeight:500 }}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {i<arr.length-1 && <div style={{ height:1, background:C.gray2 }}/>}
              </div>
            ))}
          </div>
        )}

        {/* TAB RECETAS */}
        {tab === "recetas" && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {result.menu.flatMap(d=>[d.alm,d.cen]).filter((v,i,a)=>a.indexOf(v)===i).map((plato,i) => {
              const r = R[plato];
              return (
                <button key={i} onClick={()=>setReceta(plato)} style={{ background:C.white, borderRadius:16, padding:"16px 18px", border:"none", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:14, boxShadow:sh.sm, fontFamily:"'DM Sans',sans-serif" }}>
                  <div style={{ width:52, height:52, borderRadius:14, background:C.blueLt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{r?r.e:"🍽️"}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:C.dark, marginBottom:5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{plato}</div>
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

        {/* ── EXPORTAR ── */}
        <div style={{ marginTop:20, background:C.white, borderRadius:18, overflow:"hidden", boxShadow:sh.md }}>
          <div style={{ padding:"16px 18px 10px" }}>
            <div style={{ fontSize:12, fontWeight:800, color:C.gray4, letterSpacing:"1px", textTransform:"uppercase", marginBottom:14 }}>Compartir y exportar</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>

              {/* WhatsApp */}
              <button onClick={()=>{
                const menu = result.menu.map(d =>
                  `*${d.dia}*\n🌞 ${d.alm}\n🌙 ${d.cen}`
                ).join("\n\n");
                const lista = Object.entries(result.lista_compras).map(([cat, items]) =>
                  `*${cat}*\n${items.map(i => `• ${i}`).join("\n")}`
                ).join("\n\n");
                const texto = `🥦 *Mi menú semanal — Kooki*\n\n${menu}\n\n───────────────\n🛒 *Lista de compras*\n\n${lista}\n\n_Generado con Kooki — IA que cocina con vos_`;
                window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank");
              }} style={{ width:"100%", background:"#25D366", color:"white", border:"none", borderRadius:14, padding:"15px 18px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                <span style={{ fontSize:20 }}>📱</span> Compartir por WhatsApp
              </button>

              {/* Copiar al portapapeles */}
              <button onClick={()=>{
                const menu = result.menu.map(d =>
                  `${d.dia}:\nAlmuerzo: ${d.alm}\nCena: ${d.cen}`
                ).join("\n\n");
                const lista = Object.entries(result.lista_compras).map(([cat, items]) =>
                  `${cat}:\n${items.map(i => `- ${i}`).join("\n")}`
                ).join("\n\n");
                const texto = `MI MENÚ SEMANAL — KOOKI\n\n${menu}\n\n─────────────\nLISTA DE COMPRAS\n\n${lista}`;
                navigator.clipboard.writeText(texto).then(()=>{
                  alert("✓ Copiado al portapapeles");
                }).catch(()=>{
                  alert("No se pudo copiar. Probá con el botón de WhatsApp.");
                });
              }} style={{ width:"100%", background:C.blueLt, color:C.blue, border:`2px solid ${C.bluePl}`, borderRadius:14, padding:"15px 18px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                <span style={{ fontSize:20 }}>📋</span> Copiar todo al portapapeles
              </button>

              {/* Exportar lista de compras CSV */}
              <button onClick={()=>{
                const rows = [["Categoría","Producto"]];
                Object.entries(result.lista_compras).forEach(([cat, items]) => {
                  items.forEach(item => rows.push([cat.replace(/[^\w\s]/gi,"").trim(), item]));
                });
                const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
                const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = "lista-compras-kooki.csv";
                document.body.appendChild(a); a.click();
                document.body.removeChild(a); URL.revokeObjectURL(url);
              }} style={{ width:"100%", background:C.gray1, color:C.text, border:`1px solid ${C.gray2}`, borderRadius:14, padding:"15px 18px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                <span style={{ fontSize:20 }}>📊</span> Exportar lista de compras (.csv)
              </button>

            </div>
          </div>
        </div>

        <button onClick={()=>{ setScreen("loading"); setLoadMsg(0); setTimeout(doGen,2700); }} style={{ width:"100%", marginTop:12, background:C.white, color:C.blue, border:`2px solid ${C.blue}`, borderRadius:16, padding:"16px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
          ↺ Regenerar menú completo
        </button>
      </div>

      {receta && <ModalReceta nombre={receta} onClose={()=>setReceta(null)}/>}
    </div>
  );

  return null;
}
