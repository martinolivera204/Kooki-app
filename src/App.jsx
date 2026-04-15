import { useState, useEffect, useRef } from "react";

const VALID_CODES = new Set(['KOOKI-9K2X-W5NR']);
const ACCESS_KEY = "kooki_access_v1";

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
  const C2 = { blue:"#3B6FD4", blueDk:"#0066CC", blueLt:"#EEF3FC", white:"#FFFFFF", gray1:"#F0F3FA", gray2:"#E2E8F5", gray4:"#7A8BAD", dark:"#0A0E1A", text:"#1F2937", sub:"#6B7280", danger:"#EF4444", dangerLt:"#FEF2F2" };
  return (
    <div style={{ minHeight:"100vh", background:C2.white, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 24px", fontFamily:"'Manrope',sans-serif" }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@500;600;700;800;900&family=Manrope:wght@400;500;600;700;800&family=Inter:wght@500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}} @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}"}</style>
      <div style={{ width:"100%", maxWidth:380, animation:"fadeIn 0.4s ease" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <img src="https://i.imgur.com/IYcv1Vp.jpeg" alt="Kooki" style={{ width:160, borderRadius:0, marginBottom:8 }}/>
          <div style={{ fontSize:14, color:C2.sub, marginTop:2 }}>IA que cocina con vos</div>
        </div>
        <div style={{ background:C2.white, borderRadius:24, padding:"32px 28px", boxShadow:"0 8px 40px rgba(59,111,212,0.12)", border:`1px solid ${C2.gray2}` }}>
          <div style={{ fontSize:22, fontWeight:800, color:C2.dark, marginBottom:8, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.025em" }}>Ingresa tu codigo</div>
          <div style={{ fontSize:14, color:C2.sub, lineHeight:1.6, marginBottom:28 }}>Encontras el codigo en el email que recibiste despues de tu compra.</div>
          <div style={{ marginBottom:16, animation:shake?"shake 0.5s ease":"none" }}>
            <input type="text" value={code} onChange={e => { setCode(e.target.value.toUpperCase()); setError(""); }} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="KOOKI-XXXX-XXXX-XXXX"
              style={{ width:"100%", padding:"16px", borderRadius:14, fontSize:16, fontWeight:600, border:`2px solid ${error ? C2.danger : code ? C2.blue : C2.gray2}`, background:error ? C2.dangerLt : C2.gray1, color:C2.dark, fontFamily:"'Inter',sans-serif", letterSpacing:"1px", textAlign:"center", outline:"none" }}/>
            {error && <div style={{ fontSize:13, color:C2.danger, marginTop:8, textAlign:"center", fontWeight:600 }}>⚠️ {error}</div>}
          </div>
          <button onClick={handleSubmit} disabled={loading || !code.trim()} style={{ width:"100%", padding:"18px", borderRadius:16, border:"none", background:loading||!code.trim()?C2.gray2:`linear-gradient(135deg,${C2.blue},${C2.blueDk})`, color:loading||!code.trim()?C2.gray4:C2.white, fontSize:17, fontWeight:800, cursor:loading||!code.trim()?"not-allowed":"pointer", fontFamily:"'Inter',sans-serif", boxShadow:!loading&&code.trim()?"0 8px 28px rgba(59,111,212,0.38)":"none" }}>
            {loading ? "Verificando..." : "Acceder →"}
          </button>
        </div>
        <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:C2.sub, lineHeight:1.6 }}>
          No tenes codigo? <br/><a href="https://impulsoebooks.online" style={{ color:C2.blue, fontWeight:700, textDecoration:"none" }}>Compra tu acceso aca →</a>
        </div>
      </div>
    </div>
  );
}

const C = { blue:"#3B6FD4", blueDk:"#0066CC", blueMd:"#5B8AE8", blueLt:"#EEF3FC", bluePl:"#D6E4FA", white:"#FFFFFF", bg:"#F5F5F7", gray1:"#F0F3FA", gray2:"#E2E8F5", gray3:"#B8C5DE", gray4:"#7A8BAD", dark:"#0A0E1A", text:"#1F2937", sub:"#6B7280", success:"#10B981" };
const sh = { sm:"0 1px 4px rgba(59,111,212,0.08)", md:"0 4px 16px rgba(59,111,212,0.12)", lg:"0 8px 32px rgba(59,111,212,0.16)", blue:"0 8px 28px rgba(59,111,212,0.38)" };
function KookiLogo({ size=28, dark=false }) {
  return <span style={{ fontWeight:800, fontSize:size, color:dark?"#FFF":C.blue, letterSpacing:"-0.025em", lineHeight:1, fontFamily:"'Epilogue',sans-serif" }}>Kooki</span>;
}

const STEPS = [
  { id:"objetivo", type:"objetivo", label:"Elegi lo que mas te importa hoy", subtitle:"Podes seleccionar hasta 2 prioridades",
    options:[
      {value:"bajar_peso",emoji:"⚖️",label:"Bajar de peso",desc:"Deficit calorico inteligente",color:"#EFF6FF"},
      {value:"saludable",emoji:"🥗",label:"Comer saludable",desc:"Nutricion completa y balanceada",color:"#F0FDF4"},
      {value:"ahorrar",emoji:"💰",label:"Ahorrar dinero",desc:"Maximo rendimiento por peso",color:"#FFFBEB"},
      {value:"masa",emoji:"💪",label:"Ganar masa muscular",desc:"Alta proteina y superavit",color:"#FFF7ED"},
      {value:"organizar",emoji:"📅",label:"Organizarme mejor",desc:"Batch cooking sin estres",color:"#F5F3FF"},
    ]},
  { id:"dieta", type:"grid", label:"Seguis alguna dieta?", subtitle:"Podes combinar varias opciones",
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
  { id:"tiempo", type:"cards", label:"Cuanto tiempo tenes para cocinar?", subtitle:"Por comida, en promedio durante la semana",
    options:[
      {value:"rapido",emoji:"⚡",label:"Rapido",desc:"Menos de 15 minutos",accent:"#FFF7ED"},
      {value:"medio",emoji:"🕐",label:"Normal",desc:"Entre 15 y 30 minutos",accent:"#EFF6FF"},
      {value:"libre",emoji:"🧑‍🍳",label:"Sin limite",desc:"Me gusta cocinar con calma",accent:"#F0FDF4"},
    ]},
  { id:"presupuesto", type:"semaforo", label:"Cuanto queres gastar en el super?", subtitle:"Por semana, en pesos argentinos",
    options:[
      {value:"bajo",emoji:"🟢",label:"Ajustado",desc:"Maximo rendimiento por peso",color:"#10B981",bg:"#F0FDF4"},
      {value:"medio",emoji:"🟡",label:"Moderado",desc:"Balance entre precio y calidad",color:"#F59E0B",bg:"#FFFBEB"},
      {value:"alto",emoji:"🔵",label:"Sin limite",desc:"Prefiero calidad ante todo",color:"#3B6FD4",bg:"#EEF3FC"},
    ]},
  { id:"personas", type:"cards", label:"Para cuantas personas cocinas?", subtitle:"Ajustamos porciones e ingredientes automaticamente",
    options:[
      {value:"1",emoji:"🙋",label:"Solo/a",desc:"1 persona"},
      {value:"2",emoji:"👫",label:"De a dos",desc:"2 personas"},
      {value:"familiar",emoji:"👨‍👩‍👧‍👦",label:"Familia",desc:"3 o mas personas"},
    ]},
  { id:"nivel", type:"nivel", label:"Como te manejas en la cocina?", subtitle:"Adaptamos la complejidad de las recetas para vos",
    options:[
      {value:"basico",emoji:"🌱",label:"Basico",desc:"Recetas simples, paso a paso"},
      {value:"intermedio",emoji:"🍳",label:"Intermedio",desc:"Mas variedad y tecnicas"},
      {value:"avanzado",emoji:"🧑‍🍳",label:"Avanzado",desc:"Creatividad y desafios"},
    ]},
  { id:"extra", type:"extras", label:"Ultimo paso", subtitle:"Opcional — para un resultado todavia mas preciso" },
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
};

const POOLS = {
  bajar_peso:{tag:"Deficit calorico",tip:"Proteinas magras y vegetales de alto volumen. Cada comida ronda las 200-450 kcal.",precio:{bajo:"$35.000-45.000",medio:"$50.000-65.000",alto:"$70.000-90.000"},
    almuerzos:["Ensalada de pollo grillado y quinoa","Pechuga al horno con vegetales asados","Bowl de arroz integral con pollo","Pechuga al limon con quinoa y brocoli","Wrap de atun con lechuga y tomate","Ensalada completa con atun","Ensalada de garbanzos con pepino","Pollo al horno con ensalada verde","Ensalada tibia de pollo y papa","Salmon con quinoa y vegetales","Espinaca salteada con huevo pochado","Tallarines con atun y tomate cherry"],
    cenas:["Sopa de verduras con lentejas","Revuelto de claras con espinaca","Sopa crema de zapallo","Omelette de claras con champinones","Sopa minestrone liviana","Tortilla de claras y vegetales","Sopa de tomate con albahaca","Ensalada caprese con rucula","Creme de zanahoria y jengibre"]},
  saludable:{tag:"Nutricion completa",tip:"Plan balanceado con todos los macronutrientes. Variedad de colores = variedad de nutrientes.",precio:{bajo:"$40.000-55.000",medio:"$60.000-80.000",alto:"$90.000-120.000"},
    almuerzos:["Bowl de arroz integral con palta","Ensalada mediterranea con garbanzos","Pechuga al limon con quinoa y brocoli","Tarta integral de espinaca y ricota","Salmon con quinoa y vegetales","Wok de pollo con vegetales y arroz","Pollo al horno con ensalada verde","Arroz yamani con huevo y verduras","Bowl de boniato y garbanzos","Pollo con batata al horno","Fideos integrales con pesto","Ensalada de lentejas con vegetales"],
    cenas:["Sopa de verduras con lentejas","Tortilla de papas y cebolla","Sopa crema de zapallo","Ensalada de garbanzos con pepino","Revuelto de claras con espinaca","Sopa de tomate con albahaca","Ensalada caprese con rucula","Sopa minestrone liviana","Creme de zanahoria y jengibre"]},
  ahorrar:{tag:"Maximo ahorro",tip:"Priorizamos legumbres, huevos y pollo. Las proteinas mas economicas y rendidoras.",precio:{bajo:"$18.000-28.000",medio:"$28.000-40.000",alto:"$40.000-55.000"},
    almuerzos:["Guiso de lentejas con arroz","Cazuela de pollo con papas","Arroz con pollo y verduras","Milanesas con pure de papas","Tarta de verduras economica","Pollo al horno con papas","Guiso de arroz con carne","Tarta de jamon y queso","Berenjenas rellenas de carne","Zapallitos rellenos","Papas rellenas de atun","Pollo a la provenzal"],
    cenas:["Fideos con tuco casero","Sopa de fideos express","Tortilla de papas y cebolla","Revuelto gramajo","Pizza de molde casera","Hamburguesas caseras","Sopa de arvejas con jamon","Milanesas de berenjena","Caldo de pollo con fideos"]},
  masa:{tag:"Alta proteina",tip:"1.6-2.2g de proteina por kg corporal. Superavit calorico moderado de 300-500 kcal/dia.",precio:{bajo:"$45.000-60.000",medio:"$65.000-85.000",alto:"$90.000-130.000"},
    almuerzos:["Pechuga con arroz y brocoli","Salmon con quinoa y vegetales","Bowl de arroz integral con pollo","Milanesas con pure de papas","Pechuga al horno con vegetales asados","Pollo al horno con papas","Pechuga al limon con quinoa y brocoli","Lomo salteado con papas","Pollo teriyaki con arroz","Pollo a la crema con arroz","Estofado de pollo con ciruelas","Fideos con pollo y champinones"],
    cenas:["Omelette proteica con queso","Pollo desmenuzado con arroz","Revuelto de claras con espinaca","Ensalada completa con atun","Pechuga con arroz y brocoli","Wrap de atun con lechuga y tomate","Omelette de claras con champinones","Tortilla de claras y vegetales"]},
  organizar:{tag:"Batch cooking",tip:"Cocinas 2 veces por semana y resolves todo. El domingo es clave: 2 horas = 7 dias resueltos.",precio:{bajo:"$22.000-32.000",medio:"$35.000-50.000",alto:"$55.000-75.000"},
    almuerzos:["Arroz con pollo preparado","Ensalada completa con atun","Milanesas con pure de papas","Bowl con legumbres cocidas","Wrap con sobras","Pollo al horno con papas","Batch cooking dominical","Tarta de jamon y queso","Berenjenas rellenas de carne","Zapallitos rellenos","Pollo desmenuzado con arroz","Fideos con pollo y champinones"],
    cenas:["Sopa de verduras con lentejas","Fideos con salsa preparada","Sopa de fideos express","Guiso de lentejas con arroz","Pizza de molde casera","Hamburguesas caseras","Fideos con tuco casero","Caldo de pollo con fideos"]},
  desinflamatoria:{tag:"Antiinflamatorio",tip:"Curcuma, jengibre, omega-3 y antioxidantes como base. Eliminamos procesados y azucar refinada.",precio:{bajo:"$45.000-60.000",medio:"$65.000-90.000",alto:"$95.000-130.000"},
    almuerzos:["Bowl desinflamatorio de quinoa","Salmon al horno con vegetales desinflamatorios","Ensalada mediterranea con garbanzos","Pollo con curcuma y vegetales","Pechuga al limon con quinoa y brocoli","Salmon con quinoa y vegetales","Ensalada de pollo grillado y quinoa","Pollo con batata al horno","Bowl de boniato y garbanzos","Espinaca salteada con huevo pochado","Wok de pollo con vegetales y arroz","Tallarines con atun y tomate cherry"],
    cenas:["Sopa de tomate con albahaca","Creme de zanahoria y jengibre","Sopa minestrone liviana","Bowl de arroz integral con palta","Ensalada caprese con rucula","Sopa de verduras con lentejas","Revuelto de claras con espinaca","Omelette de claras con champinones"]},
};

const TAG_MAP = {
  "Ensalada de pollo grillado y quinoa":"💪 Alta proteina","Sopa de verduras con lentejas":"🔥 Bajo en calorias","Wrap de atun con lechuga y tomate":"⚡ Express","Revuelto de claras con espinaca":"⚡ Express","Pechuga al horno con vegetales asados":"💪 Alta proteina","Sopa crema de zapallo":"🔥 Bajo en calorias","Ensalada de garbanzos con pepino":"💚 Desinflamatorio","Bowl de arroz integral con pollo":"💪 Alta proteina","Ensalada completa con atun":"⚡ Express","Tortilla de claras y vegetales":"🔥 Bajo en calorias","Omelette de claras con champinones":"⚡ Express","Sopa minestrone liviana":"🔥 Bajo en calorias","Pollo al horno con ensalada verde":"💪 Alta proteina","Bowl de arroz integral con palta":"💚 Desinflamatorio","Ensalada mediterranea con garbanzos":"💚 Desinflamatorio","Pechuga al limon con quinoa y brocoli":"💪 Alta proteina","Tarta integral de espinaca y ricota":"🌿 Vegetariana","Wok de pollo con vegetales y arroz":"💪 Alta proteina","Sopa de tomate con albahaca":"💚 Desinflamatorio","Ensalada caprese con rucula":"💚 Desinflamatorio","Guiso de lentejas con arroz":"💰 Economico","Fideos con tuco casero":"💰 Economico","Cazuela de pollo con papas":"💰 Economico","Arroz con pollo y verduras":"💰 Economico","Tortilla de papas y cebolla":"💰 Economico","Milanesas con pure de papas":"💰 Economico","Tarta de verduras economica":"💰 Economico","Pizza de molde casera":"💰 Economico","Pollo al horno con papas":"💰 Economico","Guiso de arroz con carne":"💰 Economico","Sopa de fideos express":"⚡ Express","Revuelto gramajo":"⚡ Rapido","Hamburguesas caseras":"💰 Economico","Pechuga con arroz y brocoli":"💪 Alta proteina","Salmon con quinoa y vegetales":"💚 Desinflamatorio","Omelette proteica con queso":"💪 Alta proteina","Creme de zanahoria y jengibre":"💚 Desinflamatorio","Bowl desinflamatorio de quinoa":"💚 Desinflamatorio","Salmon al horno con vegetales desinflamatorios":"💚 Desinflamatorio","Pollo con curcuma y vegetales":"💚 Desinflamatorio","Pollo desmenuzado con arroz":"💪 Alta proteina","Arroz con pollo preparado":"📦 Batch cooking","Fideos con salsa preparada":"📦 Batch cooking","Bowl con legumbres cocidas":"📦 Batch cooking","Wrap con sobras":"⚡ Express","Batch cooking dominical":"📦 Batch cooking","Pollo a la provenzal":"💪 Alta proteina","Fideos con pollo y champinones":"💪 Alta proteina","Ensalada de lentejas con vegetales":"🌿 Vegetariana","Caldo de pollo con fideos":"💰 Economico","Lomo salteado con papas":"💪 Alta proteina","Tarta de jamon y queso":"💰 Economico","Arroz yamani con huevo y verduras":"🌿 Vegetariana","Pollo con batata al horno":"💚 Desinflamatorio","Fideos integrales con pesto":"🌿 Vegetariana","Sopa de arvejas con jamon":"💰 Economico","Bowl de boniato y garbanzos":"🌿 Vegetariana","Milanesas de berenjena":"🌿 Vegetariana","Pollo a la crema con arroz":"💪 Alta proteina","Tallarines con atun y tomate cherry":"⚡ Express","Estofado de pollo con ciruelas":"💰 Economico","Espinaca salteada con huevo pochado":"🔥 Bajo en calorias","Berenjenas rellenas de carne":"💰 Economico","Zapallitos rellenos":"💰 Economico","Ensalada tibia de pollo y papa":"💪 Alta proteina","Pollo teriyaki con arroz":"💪 Alta proteina","Papas rellenas de atun":"💰 Economico",
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

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generar(a) {
  const obj = a.objetivo?.[0] || "organizar";
  const dietas = a.dieta || [];
  let key = obj;
  if (dietas.includes("desinflamatoria")) key = "desinflamatoria";
  const pool = POOLS[key] || POOLS.organizar;
  const alms = shuffle(pool.almuerzos);
  const cens = shuffle(pool.cenas);
  const menu = DIAS.map((dia, i) => ({
    dia,
    alm: alms[i % alms.length],
    cen: cens[i % cens.length],
    tag_alm: TAG_MAP[alms[i % alms.length]] || "⚡ Rendidor",
    tag_cen: TAG_MAP[cens[i % cens.length]] || "🔥 Bajo en calorias",
  }));
  return { ...pool, menu, lista_compras:LISTAS[key]||LISTAS.organizar, objetivo:key, precio_estimado:pool.precio[a.presupuesto||"medio"], answers:a };
}

function generarHoy(cuantas, tipo, ingredientes) {
  const todas = Object.keys(R);
  let filtradas = todas;
  if (tipo === "vegetariana") {
    filtradas = todas.filter(n => {
      const tags = R[n]?.tags || [];
      const tagStr = tags.join(" ").toLowerCase();
      return tagStr.includes("vegetar") || tagStr.includes("vegano");
    });
    if (filtradas.length < 4) filtradas = todas.filter(n => !["lomo","milanesa","pollo","salmon","atun","carne","jamon"].some(p => n.toLowerCase().includes(p)));
  } else if (tipo === "liviana") {
    filtradas = todas.filter(n => {
      const tags = R[n]?.tags || [];
      return tags.some(t => t.includes("Bajo en calorias") || t.includes("Express") || t.includes("Desinflamatorio"));
    });
  } else if (tipo === "rapida") {
    filtradas = todas.filter(n => {
      const t = R[n]?.t || "";
      const mins = parseInt(t);
      return !isNaN(mins) && mins <= 20;
    });
  } else if (tipo === "contundente") {
    filtradas = todas.filter(n => {
      const tags = R[n]?.tags || [];
      return tags.some(t => t.includes("Alta proteina") || t.includes("Rendidor") || t.includes("Economico"));
    });
  }
  if (ingredientes && ingredientes.trim()) {
    const ings = ingredientes.toLowerCase().split(/[,\s]+/).filter(i => i.length > 2);
    const conIngredientes = filtradas.filter(n => {
      const recetaIngs = (R[n]?.i || []).join(" ").toLowerCase();
      return ings.some(ing => recetaIngs.includes(ing));
    });
    if (conIngredientes.length >= 2) filtradas = conIngredientes;
  }
  if (filtradas.length === 0) filtradas = todas;
  const shuffled = shuffle(filtradas);
  if (cuantas === "1") return [{ tipo:"Tu comida de hoy", nombre:shuffled[0] }];
  return [{ tipo:"Almuerzo", nombre:shuffled[0] }, { tipo:"Cena", nombre:shuffled[1] || shuffled[0] }];
}

function Tag({ children, color=C.blue, bg=C.blueLt }) {
  return <span style={{ background:bg, color, borderRadius:20, padding:"2px 9px", fontSize:11, fontWeight:700, display:"inline-block", lineHeight:1.5 }}>{children}</span>;
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

function ChefChat({ result, recetaActual, onClose }) {
  const [msgs, setMsgs] = useState([{ role:"assistant", text:"Hola! Soy tu chef asistente 👨‍🍳\n\nConozco tu menu completo y todas tus recetas. Podes preguntarme cualquier cosa: si te falta un ingrediente y como reemplazarlo, dudas sobre la preparacion, tiempos de coccion, o lo que necesites." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, loading]);

  const responder = (p) => {
    const q = p.toLowerCase();
    if (q.includes("reemplazar")||q.includes("sustituir")||q.includes("falta")||q.includes("sin ")) {
      if (q.includes("quinoa")) return "Si no tenes quinoa, podes usar arroz integral, arroz yamani o trigo burgol 👌";
      if (q.includes("salmon")) return "El salmon se puede reemplazar por atun fresco, caballa o merluza 💪";
      if (q.includes("pollo")) return "Podes reemplazar el pollo por pavo, cerdo magro o tofu firme 🍗";
      if (q.includes("palta")||q.includes("aguacate")) return "Si no tenes palta, proba con ricota o queso crema light 🥑";
      if (q.includes("brocoli")) return "El brocoli se puede cambiar por coliflor, chauchas o zapallito verde 🥦";
      if (q.includes("lentejas")) return "Las lentejas se pueden reemplazar por porotos, garbanzos o arvejas 🫘";
      if (q.includes("arroz")) return "Podes usar arroz blanco comun (15 min) o fideos integrales 🍚";
      if (q.includes("aceite")) return "Podes usar aceite de girasol o canola sin problema 🫒";
      if (q.includes("ricota")) return "La ricota se puede reemplazar por queso cottage o queso crema descremado 🧀";
      return "Que ingrediente especifico te falta? Te doy alternativas concretas 😊";
    }
    if (q.includes("tiempo")||q.includes("listo")||q.includes("cocido")||q.includes("cuando")) {
      if (q.includes("pollo")) return "El pollo esta listo cuando al pincharlo el jugo sale claro. Plancha: 4-5 min por lado. Horno 200C: 35-45 min 🍗";
      if (q.includes("arroz")) return "Arroz blanco: 15-18 min tapado. Arroz integral: 35-40 min. Apagar cuando aparecen agujeritos y reposar 5 min 🍚";
      if (q.includes("quinoa")) return "La quinoa tarda 15 min. Lista cuando aparece el hilito blanco (germen). Reposar 5 min tapada ✅";
      if (q.includes("lentejas")) return "Lentejas rojas: 15-20 min. Pardas o verdes: 25-30 min. Listas cuando se aplastan con el tenedor 🫘";
      if (q.includes("huevo")) return "Huevo duro: 10 min. Pasado por agua: 6 min. Revuelto: fuego bajo, retirar cuando casi cuajan 🥚";
      return "El punto justo es cuando cambia de color y se puede pinchar facilmente. Que alimento especifico? ⏱";
    }
    if (q.includes("dura")||q.includes("guardar")||q.includes("heladera")||q.includes("freezer")) {
      if (q.includes("pollo")||q.includes("carne")) return "La carne cocida dura 3-4 dias en heladera. En freezer hasta 3 meses 🧊";
      if (q.includes("arroz")||q.includes("quinoa")||q.includes("lentejas")) return "Cereales y legumbres cocidos duran 4-5 dias en heladera. Ideales para batch cooking 📦";
      if (q.includes("sopa")||q.includes("guiso")) return "Sopas y guisos duran 4-5 dias en heladera y se pueden freezar hasta 3 meses 🍲";
      return "Comidas cocidas duran 3-4 dias en heladera en recipiente hermetico ❄️";
    }
    if (q.includes("hola")||q.includes("gracias")||q==="ok"||q==="bien") return "Hola! Estoy aca para ayudarte con cualquier duda de cocina 👨‍🍳";
    return "Buena pregunta 👨‍🍳 Contame mas sobre que receta o ingrediente tenes dudas y te ayudo mejor 😊";
  };

  const send = async () => {
    const txt = input.trim();
    if (!txt || loading) return;
    setInput("");
    setMsgs(m => [...m, { role:"user", text:txt }]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setMsgs(m => [...m, { role:"assistant", text:responder(txt) }]);
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:3000, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(10,15,30,0.5)", backdropFilter:"blur(4px)" }}/>
      <div style={{ position:"relative", background:C.white, borderRadius:"24px 24px 0 0", width:"100%", maxWidth:580, margin:"0 auto", maxHeight:"80vh", display:"flex", flexDirection:"column", boxShadow:"0 -8px 40px rgba(59,111,212,0.2)" }}>
        <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 0" }}><div style={{ width:40, height:5, background:C.gray3, borderRadius:4 }}/></div>
        <div style={{ padding:"14px 20px 12px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${C.gray2}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:40, height:40, borderRadius:14, background:`linear-gradient(135deg,${C.blue},${C.blueDk})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👨‍🍳</div>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:C.dark }}>Chef Asistente</div>
              <div style={{ fontSize:12, color:C.success, fontWeight:600 }}>● En linea · Kooki IA</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:C.gray1, border:"none", borderRadius:10, width:34, height:34, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.gray4 }}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 8px", display:"flex", flexDirection:"column", gap:12 }}>
          {msgs.map((m,i) => (
            <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
              {m.role==="assistant" && <div style={{ width:30, height:30, borderRadius:10, background:`linear-gradient(135deg,${C.blue},${C.blueDk})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, marginRight:8, marginTop:2 }}>👨‍🍳</div>}
              <div style={{ maxWidth:"78%", background:m.role==="user"?`linear-gradient(135deg,${C.blue},${C.blueDk})`:C.gray1, color:m.role==="user"?C.white:C.text, borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"12px 14px", fontSize:14, lineHeight:1.6, whiteSpace:"pre-wrap", boxShadow:m.role==="user"?sh.blue:sh.sm }}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
              <div style={{ width:30, height:30, borderRadius:10, background:`linear-gradient(135deg,${C.blue},${C.blueDk})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>👨‍🍳</div>
              <div style={{ background:C.gray1, borderRadius:"18px 18px 18px 4px", padding:"12px 16px", display:"flex", alignItems:"center", gap:5 }}>
                {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:C.gray3, animation:`dotPulse 1.2s ease ${i*0.2}s infinite` }}/>)}
              </div>
            </div>
          )}
          {msgs.length === 1 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginTop:4 }}>
              {["Puedo reemplazar el salmon?","Como se si el pollo esta listo?","Me falta quinoa, que uso?","Cuanto dura en la heladera?"].map((s,i) => (
                <button key={i} onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 50); }} style={{ background:C.blueLt, color:C.blue, border:`1px solid ${C.bluePl}`, borderRadius:20, padding:"7px 13px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>{s}</button>
              ))}
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
        <div style={{ padding:"12px 16px 20px", borderTop:`1px solid ${C.gray2}`, display:"flex", gap:10, alignItems:"flex-end" }}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Preguntale al chef..." rows={1}
            style={{ flex:1, padding:"12px 14px", borderRadius:14, border:`2px solid ${C.gray2}`, fontSize:14, color:C.text, resize:"none", lineHeight:1.5, background:C.gray1, fontFamily:"'Manrope',sans-serif", outline:"none", maxHeight:80, overflowY:"auto", transition:"border 0.2s" }}
            onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.gray2}/>
          <button onClick={send} disabled={!input.trim()||loading} style={{ width:44, height:44, borderRadius:14, border:"none", background:!input.trim()||loading?C.gray2:`linear-gradient(135deg,${C.blue},${C.blueDk})`, color:!input.trim()||loading?C.gray4:C.white, fontSize:18, cursor:!input.trim()||loading?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s", boxShadow:input.trim()&&!loading?sh.blue:"none" }}>↑</button>
        </div>
      </div>
      <style>{"@keyframes dotPulse{0%,80%,100%{opacity:0.3;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}"}</style>
    </div>
  );
}

function ModalReceta({ nombre, onClose }) {
  const [cookMode, setCookMode] = useState(false);
  const r = R[nombre];
  if (!r) return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(10,15,30,0.7)",zIndex:2000,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(6px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.white,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:580,padding:"28px 24px 40px" }}>
        <div style={{ fontSize:22,fontWeight:800,color:C.dark,marginBottom:12,fontFamily:"'Epilogue',sans-serif",letterSpacing:"-0.025em" }}>{nombre}</div>
        <p style={{ color:C.sub,fontSize:15,lineHeight:1.65 }}>Receta detallada proximamente.</p>
        <button onClick={onClose} style={{ marginTop:20,width:"100%",background:C.blue,color:C.white,border:"none",borderRadius:16,padding:"15px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif" }}>Cerrar</button>
      </div>
    </div>
  );
  if (cookMode) return (
    <div style={{ position:"fixed",inset:0,background:C.dark,zIndex:3000,overflowY:"auto",padding:"0 0 60px" }}>
      <div style={{ padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:C.dark,zIndex:10 }}>
        <span style={{ color:C.white,fontSize:18,fontWeight:800,fontFamily:"'Epilogue',sans-serif" }}>Modo Cocina 🍳</span>
        <button onClick={()=>setCookMode(false)} style={{ background:"rgba(255,255,255,0.12)",border:"none",borderRadius:10,padding:"8px 16px",color:C.white,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif" }}>Salir</button>
      </div>
      <div style={{ padding:"8px 24px 0" }}>
        <div style={{ fontSize:28,marginBottom:8 }}>{r.e}</div>
        <div style={{ fontSize:24,fontWeight:800,color:C.white,lineHeight:1.2,marginBottom:24,fontFamily:"'Epilogue',sans-serif",letterSpacing:"-0.025em" }}>{nombre}</div>
        {r.s.map((paso,i) => (
          <div key={i} style={{ marginBottom:28 }}>
            <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:12 }}>
              <div style={{ width:44,height:44,borderRadius:"50%",background:C.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:C.white,flexShrink:0 }}>{i+1}</div>
              <div style={{ height:2,flex:1,background:"rgba(255,255,255,0.1)",borderRadius:2 }}/>
            </div>
            <div style={{ fontSize:22,lineHeight:1.65,color:C.white,fontFamily:"'Manrope',sans-serif",paddingLeft:4 }}>{paso}</div>
          </div>
        ))}
        <button onClick={()=>{ setCookMode(false); onClose(); }} style={{ width:"100%",background:C.blue,color:C.white,border:"none",borderRadius:16,padding:"18px",fontSize:17,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",marginTop:8 }}>✓ Listo, termine de cocinar</button>
      </div>
    </div>
  );
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(10,15,30,0.7)",zIndex:2000,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(6px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.white,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:580,maxHeight:"90vh",overflowY:"auto",paddingBottom:40 }}>
        <div style={{ display:"flex",justifyContent:"center",padding:"10px 0 6px" }}><div style={{ width:40,height:5,background:C.gray3,borderRadius:4 }}/></div>
        <div style={{ background:`linear-gradient(140deg,${C.blue},${C.blueDk})`,padding:"22px 24px 26px",position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.06)" }}/>
          <div style={{ fontSize:44,marginBottom:10 }}>{r.e}</div>
          <div style={{ fontSize:20,fontWeight:800,color:C.white,lineHeight:1.25,marginBottom:12,fontFamily:"'Epilogue',sans-serif",letterSpacing:"-0.025em" }}>{nombre}</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:7,marginBottom:12 }}>
            {[["⏱",r.t],["👨‍🍳",r.d],r.k&&["🔥",r.k],r.p&&["💪",r.p]].filter(Boolean).map(([ic,val],i) => (
              <span key={i} style={{ background:"rgba(255,255,255,0.18)",color:C.white,borderRadius:20,padding:"5px 12px",fontSize:13,fontWeight:600 }}>{ic} {val}</span>
            ))}
          </div>
          {r.tags && <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>{r.tags.map((t,i) => <span key={i} style={{ background:"rgba(255,255,255,0.15)",color:C.white,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700 }}>{t}</span>)}</div>}
        </div>
        <div style={{ padding:"20px 24px 0" }}>
          <div style={{ fontSize:12,fontWeight:800,color:C.blue,letterSpacing:"1px",textTransform:"uppercase",marginBottom:12,fontFamily:"'Inter',sans-serif" }}>Ingredientes</div>
          <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:24 }}>
            {r.i.map((ing,i) => <div key={i} style={{ display:"flex",alignItems:"center",gap:12 }}><div style={{ width:8,height:8,borderRadius:"50%",background:C.blue,flexShrink:0 }}/><span style={{ fontSize:15,color:C.text }}>{ing}</span></div>)}
          </div>
          <div style={{ fontSize:12,fontWeight:800,color:C.blue,letterSpacing:"1px",textTransform:"uppercase",marginBottom:12,fontFamily:"'Inter',sans-serif" }}>Preparacion</div>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            {r.s.map((paso,i) => (
              <div key={i} style={{ display:"flex",gap:14,alignItems:"flex-start" }}>
                <div style={{ width:32,height:32,borderRadius:"50%",background:C.blueLt,border:`2px solid ${C.bluePl}`,color:C.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,flexShrink:0 }}>{i+1}</div>
                <div style={{ fontSize:15,lineHeight:1.65,color:C.text,paddingTop:5 }}>{paso}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>setCookMode(true)} style={{ marginTop:24,width:"100%",background:C.dark,color:C.white,border:"none",borderRadius:16,padding:"15px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>🍳 Modo cocina — pantalla limpia</button>
          <button onClick={onClose} style={{ marginTop:10,width:"100%",background:`linear-gradient(135deg,${C.blue},${C.blueDk})`,color:C.white,border:"none",borderRadius:16,padding:"15px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",boxShadow:sh.blue }}>✓ Listo, entendido</button>
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const [screen, setScreen] = useState("home");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("menu");
  const [receta, setReceta] = useState(null);
  const [cambiando, setCambiando] = useState(null);
  const [loadMsg, setLoadMsg] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [chefOpen, setChefOpen] = useState(false);
  const [chefPulse, setChefPulse] = useState(false);
  const [hoyCuantas, setHoyCuantas] = useState("2");
  const [hoyTipo, setHoyTipo] = useState("cualquiera");
  const [hoyIngredientes, setHoyIngredientes] = useState("");
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
      const msgs = ["Analizando tu objetivo...","Seleccionando recetas...","Calculando la lista...","Optimizando presupuesto...","Listo!"];
      let i = 0;
      const t = setInterval(() => { i++; if (i < msgs.length) setLoadMsg(i); else clearInterval(t); }, 500);
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

  const resetAll = () => { setScreen("home"); setResult(null); setStep(0); setAnswers({}); setChefOpen(false); setHoyResult(null); };

  const handleCambiar = (dia, tipo) => {
    const key = `${dia}-${tipo}`;
    setCambiando(key);
    setTimeout(() => {
      setResult(prev => {
        const pool = POOLS[prev.objetivo];
        if (!pool) return prev;
        const lista = tipo === "alm" ? pool.almuerzos : pool.cenas;
        const actual = prev.menu.find(d => d.dia === dia)?.[tipo];
        const otras = lista.filter(r => r !== actual);
        const nueva = otras[Math.floor(Math.random() * otras.length)] || lista[0];
        return { ...prev, menu: prev.menu.map(d => d.dia !== dia ? d : { ...d, [tipo]:nueva, [`tag_${tipo}`]:TAG_MAP[nueva]||"⚡ Rendidor" }) };
      });
      setCambiando(null);
    }, 700);
  };

  const OBJ_IC = { bajar_peso:"⚖️", saludable:"🥗", ahorrar:"💰", masa:"💪", organizar:"📅", desinflamatoria:"🫚" };
  const GFONT = `@import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@500;600;700;800;900&family=Manrope:wght@400;500;600;700;800&family=Inter:wght@500;600;700&display=swap');`;
  const BASE = `${GFONT} *{box-sizing:border-box;margin:0;padding:0;} body{margin:0;font-family:'Manrope',sans-serif;} button:focus,textarea:focus{outline:none;} @keyframes slideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} @keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.06)}100%{transform:scale(1)}} @keyframes chefPulse{0%,100%{transform:scale(1);box-shadow:0 8px 28px rgba(59,111,212,0.38)}50%{transform:scale(1.12);box-shadow:0 12px 40px rgba(59,111,212,0.6)}} @keyframes chefBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}} @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}`;

  if (screen === "home") return (
    <div ref={scrollRef} style={{ minHeight:"100vh", background:C.white, fontFamily:"'Manrope',sans-serif", overflowY:"auto", display:"flex", flexDirection:"column" }}>
      <style>{`${BASE} @keyframes floatPhone{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      <nav style={{ padding:"16px 28px", display:"flex", alignItems:"center", justifyContent:"flex-end" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:C.blueLt, borderRadius:20, padding:"6px 12px" }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:C.success, display:"inline-block" }}/>
          <span style={{ fontSize:12, fontWeight:700, color:C.blue, fontFamily:"'Inter',sans-serif" }}>Acceso activo</span>
        </div>
      </nav>
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"8px 28px 0", maxWidth:480, margin:"0 auto", width:"100%" }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:4 }}>
          <img src="https://i.imgur.com/IYcv1Vp.jpeg" alt="Kooki" style={{ width:"60%", maxWidth:220, borderRadius:0 }}/>
        </div>
        <h1 style={{ fontSize:38, fontWeight:800, color:C.dark, lineHeight:1.1, marginBottom:14, letterSpacing:"-0.025em", textAlign:"center", fontFamily:"'Epilogue',sans-serif" }}>
          Tu semana<br/>resuelta en<br/><span style={{ color:C.blue }}>2 minutos.</span>
        </h1>
        <p style={{ fontSize:15, color:C.sub, lineHeight:1.7, marginBottom:16, textAlign:"center" }}>Vos respondes. Kooki resuelve.</p>
        <div style={{ position:"relative", marginBottom:28, display:"flex", justifyContent:"center", alignItems:"center" }}>
          <div style={{ position:"absolute", width:280, height:280, borderRadius:"50%", background:`radial-gradient(circle, ${C.bluePl} 0%, transparent 70%)`, zIndex:0 }}/>
          <img src="https://i.imgur.com/ItvV1e7.jpeg" alt="Kooki app" style={{ width:"100%", maxWidth:300, borderRadius:24, position:"relative", zIndex:1, animation:"floatPhone 3s ease-in-out infinite", boxShadow:`0 20px 60px rgba(59,111,212,0.18)` }}/>
        </div>
        <div style={{ background:C.bg, borderRadius:20, padding:"24px", marginBottom:28, border:`1px solid ${C.gray2}` }}>
          <div style={{ fontSize:12, fontWeight:800, color:C.gray4, letterSpacing:"1px", textTransform:"uppercase", marginBottom:14, fontFamily:"'Inter',sans-serif" }}>Esto es lo que Kooki hace por vos:</div>
          {[["✔️","Menu completo de lunes a domingo"],["✔️","Lista de compras organizada por seccion"],["✔️","Recetas paso a paso con modo cocina"],["✔️","Chef asistente para tus dudas"]].map(([ic,txt],i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:i<3?11:0 }}>
              <span style={{ fontSize:14, flexShrink:0 }}>{ic}</span>
              <span style={{ fontSize:14, fontWeight:600, color:C.text }}>{txt}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setScreen("onboarding"); setStep(0); setAnswers({}); }} style={{ width:"100%", background:`linear-gradient(135deg,${C.blue},${C.blueDk})`, color:C.white, border:"none", borderRadius:18, padding:"20px", fontSize:18, fontWeight:800, cursor:"pointer", boxShadow:sh.blue, fontFamily:"'Inter',sans-serif", marginBottom:12 }}>
          📅 Armar mi semana →
        </button>
        <button onClick={() => { setHoyResult(null); setScreen("hoy"); }} style={{ width:"100%", background:C.white, color:C.blue, border:`2px solid ${C.blue}`, borderRadius:18, padding:"18px", fontSize:17, fontWeight:800, cursor:"pointer", fontFamily:"'Inter',sans-serif", marginBottom:24 }}>
          🍳 ¿Que cocino hoy?
        </button>
        <p style={{ textAlign:"center", fontSize:13, color:C.gray4, marginBottom:48 }}>✓ Listo en 2 minutos · ✓ Personalizado para vos</p>
      </div>
    </div>
  );

  if (screen === "hoy") return (
    <div style={{ minHeight:"100vh", background:C.white, fontFamily:"'Manrope',sans-serif", display:"flex", flexDirection:"column" }}>
      <style>{BASE}</style>
      <div style={{ padding:"14px 20px", display:"flex", alignItems:"center", gap:14, borderBottom:`1px solid ${C.gray2}` }}>
        <button onClick={() => setScreen("home")} style={{ background:C.gray1, border:"none", borderRadius:12, width:38, height:38, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", color:C.text, fontWeight:700 }}>←</button>
        <div style={{ fontSize:17, fontWeight:800, color:C.dark, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.025em" }}>¿Que cocino hoy?</div>
      </div>
      {!hoyResult ? (
        <div style={{ flex:1, padding:"28px 24px", maxWidth:520, margin:"0 auto", width:"100%", overflowY:"auto" }}>
          <div style={{ fontSize:26, fontWeight:800, color:C.dark, marginBottom:6, letterSpacing:"-0.025em", fontFamily:"'Epilogue',sans-serif" }}>Rapido y sin vuelta 🍳</div>
          <div style={{ fontSize:14, color:C.sub, marginBottom:28, lineHeight:1.55 }}>3 preguntas y te doy la receta perfecta.</div>
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:15, fontWeight:700, color:C.dark, marginBottom:12 }}>Cuantas comidas necesitas?</div>
            <div style={{ display:"flex", gap:10 }}>
              {[["1","🍽️ Una sola"],["2","🌞🌙 Almuerzo y cena"]].map(([val,lbl]) => (
                <button key={val} onClick={() => setHoyCuantas(val)} style={{ flex:1, padding:"14px 10px", borderRadius:14, border:`2px solid ${hoyCuantas===val?C.blue:C.gray2}`, background:hoyCuantas===val?C.blueLt:C.white, fontSize:14, fontWeight:700, color:hoyCuantas===val?C.blueDk:C.dark, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.18s" }}>{lbl}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:15, fontWeight:700, color:C.dark, marginBottom:12 }}>Que tipo de comida queres?</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[["cualquiera","🍽️","Cualquier cosa"],["liviana","🥗","Liviana y sana"],["rapida","⚡","Rapida (menos de 20 min)"],["contundente","💪","Contundente"],["vegetariana","🌿","Vegetariana / Vegana"]].map(([val,emoji,lbl]) => (
                <button key={val} onClick={() => setHoyTipo(val)}
                  style={{ padding:"14px 10px", borderRadius:14, border:`2px solid ${hoyTipo===val?C.blue:C.gray2}`, background:hoyTipo===val?C.blueLt:C.white, fontSize:13, fontWeight:700, color:hoyTipo===val?C.blueDk:C.dark, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.18s", display:"flex", flexDirection:"column", alignItems:"center", gap:6, gridColumn:val==="vegetariana"?"span 2":"span 1" }}>
                  <span style={{ fontSize:22 }}>{emoji}</span>
                  <span>{lbl}</span>
                  {hoyTipo===val && <Tag color={C.blue} bg={C.bluePl}>✓</Tag>}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:15, fontWeight:700, color:C.dark, marginBottom:6 }}>
              Que tenes en casa? <span style={{ fontWeight:500, color:C.gray4, fontSize:13 }}>(opcional)</span>
            </div>
            <div style={{ fontSize:13, color:C.sub, marginBottom:10 }}>Te priorizamos recetas con lo que ya tenes</div>
            <textarea value={hoyIngredientes} onChange={e => setHoyIngredientes(e.target.value)} placeholder="Ej: pollo, arroz, huevos, tomates..." rows={2}
              style={{ width:"100%", padding:"14px 16px", borderRadius:14, border:`2px solid ${C.gray2}`, fontSize:15, color:C.text, resize:"none", lineHeight:1.6, background:C.gray1, fontFamily:"'Manrope',sans-serif", outline:"none" }}
              onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.gray2}/>
          </div>
          <button onClick={() => setHoyResult(generarHoy(hoyCuantas, hoyTipo, hoyIngredientes))} style={{ width:"100%", background:`linear-gradient(135deg,${C.blue},${C.blueDk})`, color:C.white, border:"none", borderRadius:18, padding:"20px", fontSize:18, fontWeight:800, cursor:"pointer", boxShadow:sh.blue, fontFamily:"'Inter',sans-serif" }}>
            ✨ Sugerir receta →
          </button>
        </div>
      ) : (
        <div style={{ flex:1, padding:"28px 24px", maxWidth:520, margin:"0 auto", width:"100%" }}>
          <div style={{ fontSize:24, fontWeight:800, color:C.dark, marginBottom:6, letterSpacing:"-0.025em", fontFamily:"'Epilogue',sans-serif" }}>Tu menu de hoy 🎉</div>
          <div style={{ fontSize:14, color:C.sub, marginBottom:24 }}>Elegido al azar del banco de recetas</div>
          <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:28 }}>
            {hoyResult.map((item,i) => {
              const r = R[item.nombre];
              return (
                <div key={i} style={{ background:C.white, borderRadius:18, padding:"20px", boxShadow:sh.md }}>
                  <div style={{ fontSize:12, fontWeight:800, color:C.blue, textTransform:"uppercase", letterSpacing:"1px", marginBottom:10, fontFamily:"'Inter',sans-serif" }}>{item.tipo}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:56, height:56, borderRadius:16, background:C.blueLt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>{r?r.e:"🍽️"}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:16, fontWeight:800, color:C.dark, marginBottom:6 }}>{item.nombre}</div>
                      {r && <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}><Tag color={C.blue} bg={C.blueLt}>⏱ {r.t}</Tag>{r.tags?.slice(0,1).map((t,j) => { const s=TAG_COLORS[t]||{}; return <Tag key={j} color={s.color||C.sub} bg={s.bg||C.gray1}>{t}</Tag>; })}</div>}
                    </div>
                  </div>
                  <button onClick={() => setReceta(item.nombre)} style={{ marginTop:14, width:"100%", background:C.blueLt, color:C.blue, border:"none", borderRadius:12, padding:"12px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>Ver receta completa →</button>
                </div>
              );
            })}
          </div>
          <button onClick={() => setHoyResult(generarHoy(hoyCuantas, hoyTipo, hoyIngredientes))} style={{ width:"100%", background:C.white, color:C.blue, border:`2px solid ${C.blue}`, borderRadius:16, padding:"16px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif", marginBottom:12 }}>↺ Otra sugerencia</button>
          <button onClick={() => setHoyResult(null)} style={{ width:"100%", background:C.gray1, color:C.sub, border:"none", borderRadius:16, padding:"14px", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>← Volver</button>
        </div>
      )}
      {receta && <ModalReceta nombre={receta} onClose={()=>setReceta(null)}/>}
    </div>
  );

  if (screen === "onboarding") {
    const progMsg = ["Conociendo tu objetivo...","Ajustando tu alimentacion...","Calculando tu tiempo...","Optimizando el presupuesto...","Definiendo las porciones...","Personalizando la complejidad...","Un ultimo detalle..."];
    const selDietas = answers.dieta || [];
    return (
      <div style={{ minHeight:"100vh", background:C.white, fontFamily:"'Manrope',sans-serif", display:"flex", flexDirection:"column" }}>
        <style>{BASE}</style>
        <div style={{ padding:"14px 20px", display:"flex", alignItems:"center", gap:14, borderBottom:`1px solid ${C.gray2}` }}>
          <button onClick={() => step === 0 ? setScreen("home") : setStep(s=>s-1)} style={{ background:C.gray1, border:"none", borderRadius:12, width:38, height:38, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", color:C.text, fontWeight:700 }}>←</button>
          <div style={{ flex:1 }}>
            <div style={{ height:5, background:C.gray2, borderRadius:10, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${((step+1)/STEPS.length)*100}%`, background:`linear-gradient(90deg,${C.blue},${C.blueMd})`, borderRadius:10, transition:"width 0.4s cubic-bezier(.4,0,.2,1)" }}/>
            </div>
            <div style={{ fontSize:12, color:C.blue, fontWeight:600, marginTop:5 }}>{progMsg[step]}</div>
          </div>
          <span style={{ fontSize:13, fontWeight:700, color:C.sub }}>{step+1}/{STEPS.length}</span>
        </div>
        <div key={animKey} style={{ flex:1, padding:"24px 20px 32px", overflowY:"auto", maxWidth:520, margin:"0 auto", width:"100%", animation:"slideIn 0.3s ease" }}>
          {cur.type === "grid" && selDietas.length > 0 && (
            <div style={{ background:C.blueLt, borderRadius:12, padding:"10px 14px", marginBottom:16, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <span style={{ fontSize:13, color:C.blue, fontWeight:700 }}>Seleccionaste:</span>
              {selDietas.map(d => { const opt = STEPS[1].options.find(o=>o.value===d); return opt ? <Tag key={d} color={C.blue} bg={C.bluePl}>{opt.emoji} {opt.label}</Tag> : null; })}
            </div>
          )}
          {cur.type === "extras" && (
            <div style={{ background:`linear-gradient(135deg,${C.blueLt},${C.bluePl})`, borderRadius:16, padding:"16px 18px", marginBottom:20, borderLeft:`4px solid ${C.blue}` }}>
              <div style={{ fontSize:16, fontWeight:800, color:C.dark, marginBottom:4 }}>Ya estamos listos! 🎉</div>
              <div style={{ fontSize:14, color:C.sub, lineHeight:1.55 }}>Con esto ya podemos armar tu semana perfecta. Los campos de abajo son opcionales.</div>
            </div>
          )}
          <div style={{ fontSize:24, fontWeight:800, color:C.dark, lineHeight:1.25, marginBottom:6, letterSpacing:"-0.025em", fontFamily:"'Epilogue',sans-serif" }}>{cur.label}</div>
          {cur.subtitle && <div style={{ fontSize:15, color:C.sub, marginBottom:24, lineHeight:1.55 }}>{cur.subtitle}</div>}

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
                  <button key={opt.value} onClick={toggle} style={{ padding:"16px 18px", borderRadius:16, cursor:"pointer", textAlign:"left", border:`2px solid ${sel?C.blue:C.gray2}`, background:sel?opt.color||C.blueLt:C.white, display:"flex", alignItems:"center", gap:14, transition:"all 0.18s", fontFamily:"'Manrope',sans-serif", boxShadow:sel?`0 0 0 3px ${C.blue}22,${sh.md}`:sh.sm }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:sel?C.blue:C.gray1, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{opt.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:16, fontWeight:700, color:sel?C.blueDk:C.dark }}>{opt.label}</div>
                      {opt.desc && <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>{opt.desc}</div>}
                    </div>
                    {sel && <div style={{ width:26, height:26, borderRadius:"50%", background:C.blue, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:C.white, fontWeight:800, fontSize:13 }}>{rank+1}</div>}
                  </button>
                );
              })}
              {(answers.objetivo||[]).length === 2 && <div style={{ textAlign:"center", fontSize:13, color:C.blue, fontWeight:600, marginTop:4 }}>✓ Maximo 2 objetivos seleccionados</div>}
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
                  <button key={opt.value} onClick={toggle} style={{ padding:"18px 12px", borderRadius:16, cursor:"pointer", textAlign:"center", border:`2px solid ${sel?C.blue:C.gray2}`, background:sel?C.blueLt:C.white, display:"flex", flexDirection:"column", alignItems:"center", gap:8, transition:"all 0.18s", fontFamily:"'Manrope',sans-serif", boxShadow:sel?`0 0 0 3px ${C.blue}22,${sh.md}`:sh.sm }}>
                    <div style={{ fontSize:30 }}>{opt.emoji}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:sel?C.blueDk:C.dark }}>{opt.label}</div>
                    {sel && <Tag color={C.blue} bg={C.bluePl}>✓</Tag>}
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
                  <button key={opt.value} onClick={() => setAnswers(a=>({...a,[cur.id]:opt.value}))} style={{ padding:"16px 18px", borderRadius:16, cursor:"pointer", textAlign:"left", border:`2px solid ${sel?C.blue:C.gray2}`, background:sel?opt.accent||C.blueLt:C.white, display:"flex", alignItems:"center", gap:14, transition:"all 0.18s", fontFamily:"'Manrope',sans-serif", boxShadow:sel?`0 0 0 3px ${C.blue}22,${sh.md}`:sh.sm }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:sel?C.blue:C.gray1, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{opt.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:16, fontWeight:700, color:sel?C.blueDk:C.dark }}>{opt.label}</div>
                      {opt.desc && <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>{opt.desc}</div>}
                    </div>
                    <div style={{ width:24, height:24, borderRadius:"50%", background:sel?C.blue:C.gray2, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {sel && <span style={{ color:C.white, fontSize:13, fontWeight:800 }}>✓</span>}
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
                  <button key={opt.value} onClick={() => setAnswers(a=>({...a,presupuesto:opt.value}))} style={{ padding:"18px 20px", borderRadius:16, cursor:"pointer", textAlign:"left", border:`2px solid ${sel?opt.color:C.gray2}`, background:sel?opt.bg:C.white, display:"flex", alignItems:"center", gap:16, transition:"all 0.18s", fontFamily:"'Manrope',sans-serif", boxShadow:sel?`0 0 0 3px ${opt.color}30,${sh.md}`:sh.sm }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", background:opt.color, boxShadow:`0 0 0 4px ${opt.color}30`, flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:16, fontWeight:700, color:C.dark }}>{opt.label}</div>
                      <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>{opt.desc}</div>
                    </div>
                    <div style={{ width:24, height:24, borderRadius:"50%", background:sel?opt.color:C.gray2, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {sel && <span style={{ color:C.white, fontSize:13, fontWeight:800 }}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          {cur.type === "extras" && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {[{id:"ingredientes",label:"Que tenes en casa ahora?",ph:"Ej: arroz, huevos, pollo...",e:"🧺"},{id:"no_gusta",label:"Algo que no comas?",ph:"Ej: cebolla cruda, mariscos...",e:"🚫"}].map(f2 => (
                <div key={f2.id}>
                  <div style={{ fontSize:15, fontWeight:700, color:C.dark, marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
                    <span>{f2.e}</span>{f2.label}<span style={{ fontWeight:500, color:C.gray4, fontSize:13 }}>(opcional)</span>
                  </div>
                  <textarea value={answers[f2.id]||""} onChange={e=>setAnswers(a=>({...a,[f2.id]:e.target.value}))} placeholder={f2.ph} rows={3}
                    style={{ width:"100%", padding:"14px 16px", borderRadius:14, border:`2px solid ${C.gray2}`, fontSize:15, color:C.text, resize:"none", lineHeight:1.6, background:C.gray1, fontFamily:"'Manrope',sans-serif" }}
                    onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.gray2}/>
                </div>
              ))}
            </div>
          )}
          <button onClick={handleNext} disabled={!canNext()} style={{ width:"100%", marginTop:28, padding:"18px", borderRadius:16, border:"none", fontSize:17, fontWeight:800, background:canNext()?`linear-gradient(135deg,${C.blue},${C.blueDk})`:C.gray2, color:canNext()?C.white:C.gray4, cursor:canNext()?"pointer":"not-allowed", boxShadow:canNext()?sh.blue:"none", transition:"all 0.2s", fontFamily:"'Inter',sans-serif" }}>
            {isLast ? "✨ Generar mi menu" : "Continuar →"}
          </button>
          {cur.type === "extras" && <p style={{ textAlign:"center", fontSize:13, color:C.gray4, marginTop:10 }}>Podes saltearlo y continuar directo</p>}
        </div>
      </div>
    );
  }

  if (screen === "loading") {
    const MSGS = ["Analizando tu objetivo...","Seleccionando las mejores recetas...","Calculando la lista de compras...","Optimizando el presupuesto...","Tu menu esta casi listo!"];
    return (
      <div style={{ minHeight:"100vh", background:C.white, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, fontFamily:"'Manrope',sans-serif" }}>
        <style>{BASE}</style>
        <div style={{ width:80, height:80, borderRadius:"50%", border:`6px solid ${C.blueLt}`, borderTop:`6px solid ${C.blue}`, animation:"spin 0.9s linear infinite", marginBottom:32 }}/>
        <h2 style={{ fontSize:26, fontWeight:800, color:C.dark, marginBottom:10, textAlign:"center", fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.025em" }}>Kooki esta trabajando...</h2>
        <p style={{ fontSize:15, color:C.sub, textAlign:"center", maxWidth:260, lineHeight:1.65, marginBottom:32 }}>Personalizando tu plan de alimentacion</p>
        <div style={{ width:"100%", maxWidth:300, display:"flex", flexDirection:"column", gap:12 }}>
          {MSGS.map((m,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, opacity:i<=loadMsg?1:0.2, transition:"opacity 0.4s" }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:i<loadMsg?C.success:i===loadMsg?C.blue:C.gray3, flexShrink:0, transition:"background 0.3s" }}/>
              <span style={{ fontSize:14, color:i===loadMsg?C.text:C.gray4, fontWeight:i===loadMsg?600:400 }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === "result" && result) {
    const showChefFab = tab === "lista" || tab === "recetas";
    return (
      <div ref={scrollRef} style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Manrope',sans-serif", overflowY:"auto" }}>
        <style>{BASE}</style>
        <div style={{ background:`linear-gradient(140deg,${C.blue},${C.blueDk})`, padding:"22px 22px 36px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-50, right:-50, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }}/>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22, position:"relative" }}>
            <KookiLogo size={26} dark/>
            <button onClick={resetAll} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", color:C.white, borderRadius:12, padding:"8px 16px", fontSize:13, cursor:"pointer", fontWeight:600, fontFamily:"'Inter',sans-serif" }}>↺ Nuevo menu</button>
          </div>
          <div style={{ position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ fontSize:22 }}>{OBJ_IC[result.objetivo]||"✨"}</span>
              <span style={{ background:"rgba(255,255,255,0.18)", color:C.white, borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:700 }}>{result.tag}</span>
            </div>
            <div style={{ fontSize:24, fontWeight:800, color:C.white, marginBottom:8, fontFamily:"'Epilogue',sans-serif", letterSpacing:"-0.025em" }}>Tu plan esta listo 🎉</div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.82)", lineHeight:1.6, marginBottom:18 }}>{result.tip}</div>
            {result.precio_estimado && (
              <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:16, padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:26 }}>🛒</span>
                <div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", fontWeight:700, letterSpacing:"0.8px", textTransform:"uppercase", fontFamily:"'Inter',sans-serif" }}>Estimado compras semanales</div>
                  <div style={{ fontSize:20, fontWeight:800, color:C.white, marginTop:2 }}>{result.precio_estimado} ARS</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={{ background:C.white, margin:"0 16px", borderRadius:18, padding:5, marginTop:-16, boxShadow:sh.lg, position:"relative", zIndex:10 }}>
          <div style={{ display:"flex", gap:4 }}>
            {[["menu","📅 Menu"],["lista","🛒 Compras"],["recetas","👨‍🍳 Recetas"]].map(([id,lbl]) => (
              <button key={id} onClick={()=>setTab(id)} style={{ flex:1, padding:"12px 6px", borderRadius:13, border:"none", fontWeight:700, fontSize:13, cursor:"pointer", transition:"all 0.2s", fontFamily:"'Inter',sans-serif", background:tab===id?C.blue:"transparent", color:tab===id?C.white:C.gray4 }}>{lbl}</button>
            ))}
          </div>
        </div>
        <div style={{ padding:"16px 16px 100px", animation:"slideIn 0.35s ease" }}>
          {tab === "menu" && (
            <div style={{ background:C.white, borderRadius:18, overflow:"hidden", boxShadow:sh.md }}>
              {result.menu.map((d,i) => (
                <div key={i}>
                  <div style={{ padding:"14px 18px" }}>
                    <div style={{ fontWeight:800, color:C.blue, fontSize:11, textTransform:"uppercase", letterSpacing:"1px", marginBottom:12, fontFamily:"'Inter',sans-serif" }}>{d.dia}</div>
                    {[["alm","🌞","Almuerzo","tag_alm"],["cen","🌙","Cena","tag_cen"]].map(([k,ic,lb,tagKey]) => (
                      <div key={k} style={{ marginBottom:k==="alm"?12:0 }}>
                        <div style={{ display:"flex", alignItems:"flex-start" }}>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:12, color:C.gray4, marginBottom:3 }}>{ic} {lb}</div>
                            <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:5 }}>{d[k]}</div>
                            {d[tagKey] && <MealTag label={d[tagKey]}/>}
                          </div>
                          <div style={{ display:"flex", gap:6, flexShrink:0, marginLeft:10, paddingTop:2 }}>
                            <button onClick={()=>setReceta(d[k])} style={{ background:C.blueLt, border:"none", borderRadius:8, padding:"5px 11px", fontSize:12, color:C.blue, cursor:"pointer", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>Receta</button>
                            <button onClick={()=>handleCambiar(d.dia,k)} style={{ background:C.gray1, border:`1px solid ${C.gray2}`, borderRadius:8, padding:"5px 9px", fontSize:13, color:cambiando===`${d.dia}-${k}`?C.blue:C.gray4, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
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
          {tab === "recetas" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {result.menu.flatMap(d=>[d.alm,d.cen]).filter((v,i,a)=>a.indexOf(v)===i).map((plato,i) => {
                const r = R[plato];
                return (
                  <button key={i} onClick={()=>setReceta(plato)} style={{ background:C.white, borderRadius:16, padding:"16px 18px", border:"none", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:14, boxShadow:sh.sm, fontFamily:"'Manrope',sans-serif" }}>
                    <div style={{ width:52, height:52, borderRadius:14, background:C.blueLt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{r?r.e:"🍽️"}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:15, fontWeight:700, color:C.dark, marginBottom:5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{plato}</div>
                      {r ? <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}><Tag color={C.blue} bg={C.blueLt}>⏱ {r.t}</Tag>{r.tags?.slice(0,2).map((t,i) => { const s=TAG_COLORS[t]||{}; return <Tag key={i} color={s.color||C.sub} bg={s.bg||C.gray1}>{t}</Tag>; })}</div> : <Tag color={C.gray4} bg={C.gray1}>Proximamente</Tag>}
                    </div>
                    <span style={{ color:C.gray3, fontSize:22, flexShrink:0 }}>›</span>
                  </button>
                );
              })}
            </div>
          )}
          {tab === "menu" && (
            <div style={{ marginTop:20, background:C.white, borderRadius:18, overflow:"hidden", boxShadow:sh.md }}>
              <div style={{ padding:"16px 18px 10px" }}>
                <div style={{ fontSize:12, fontWeight:800, color:C.gray4, letterSpacing:"1px", textTransform:"uppercase", marginBottom:14, fontFamily:"'Inter',sans-serif" }}>Compartir y exportar</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <button onClick={()=>{
                    const menu = result.menu.map(d => "*"+d.dia+"*\n🌞 "+d.alm+"\n🌙 "+d.cen).join("\n\n");
                    const lista = Object.entries(result.lista_compras).map(([cat,items]) => "*"+cat+"*\n"+items.map(i=>"• "+i).join("\n")).join("\n\n");
                    window.open("https://wa.me/?text="+encodeURIComponent("🥦 *Mi menu semanal — Kooki*\n\n"+menu+"\n\n───────────────\n🛒 *Lista de compras*\n\n"+lista+"\n\n_Generado con Kooki — IA que cocina con vos_"),"_blank");
                  }} style={{ width:"100%", background:"#25D366", color:"white", border:"none", borderRadius:14, padding:"15px 18px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                    <span style={{ fontSize:20 }}>📱</span> Compartir por WhatsApp
                  </button>
                  <button onClick={()=>{
                    const menu = result.menu.map(d => d.dia+":\nAlmuerzo: "+d.alm+"\nCena: "+d.cen).join("\n\n");
                    const lista = Object.entries(result.lista_compras).map(([cat,items]) => cat+":\n"+items.map(i=>"- "+i).join("\n")).join("\n\n");
                    navigator.clipboard.writeText("MI MENU SEMANAL — KOOKI\n\n"+menu+"\n\n─────────────\nLISTA DE COMPRAS\n\n"+lista).then(()=>alert("✓ Copiado al portapapeles")).catch(()=>alert("No se pudo copiar."));
                  }} style={{ width:"100%", background:C.blueLt, color:C.blue, border:`2px solid ${C.bluePl}`, borderRadius:14, padding:"15px 18px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
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
                  }} style={{ width:"100%", background:C.gray1, color:C.text, border:`1px solid ${C.gray2}`, borderRadius:14, padding:"15px 18px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                    <span style={{ fontSize:20 }}>📊</span> Exportar lista (.csv)
                  </button>
                </div>
              </div>
            </div>
          )}
          <button onClick={()=>{ setScreen("loading"); setLoadMsg(0); setTimeout(doGen,2700); }} style={{ width:"100%", marginTop:12, background:C.white, color:C.blue, border:`2px solid ${C.blue}`, borderRadius:16, padding:"16px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
            ↺ Regenerar menu completo
          </button>
        </div>
        {showChefFab && (
          <div style={{ position:"fixed", bottom:28, right:22, zIndex:100 }}>
            {chefPulse && <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:C.blue, animation:"ripple 1.5s ease infinite", zIndex:-1 }}/>}
            {chefPulse && (
              <div style={{ position:"absolute", bottom:"110%", right:0, background:C.dark, color:C.white, borderRadius:12, padding:"8px 12px", fontSize:12, fontWeight:700, whiteSpace:"nowrap", boxShadow:sh.md, marginBottom:4, fontFamily:"'Inter',sans-serif" }}>
                Tenes dudas? Preguntame! 👨‍🍳
                <div style={{ position:"absolute", bottom:-6, right:18, width:12, height:12, background:C.dark, transform:"rotate(45deg)" }}/>
              </div>
            )}
            <button onClick={() => { setChefOpen(true); setChefPulse(false); }} style={{ width:60, height:60, borderRadius:"50%", border:"none", background:`linear-gradient(135deg,${C.blue},${C.blueDk})`, color:C.white, fontSize:26, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:sh.blue, animation:chefPulse?"chefPulse 1.5s ease infinite":"chefBounce 2s ease infinite" }}>
              👨‍🍳
            </button>
          </div>
        )}
        {receta && <ModalReceta nombre={receta} onClose={()=>setReceta(null)}/>}
        {chefOpen && <ChefChat result={result} recetaActual={receta} onClose={()=>setChefOpen(false)}/>}
      </div>
    );
  }

  return null;
}

export default function App() {
  const [hasAccess, setHasAccess] = useState(() => {
    try { return !!localStorage.getItem(ACCESS_KEY); } catch(e) { return false; }
  });
  if (!hasAccess) return <AccessScreen onAccess={() => setHasAccess(true)} />;
  return <MainApp />;
}
