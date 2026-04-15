/* =========================================================
   KOOKI APP — Override de tipografías para títulos
   =========================================================
   Este archivo aplica Epilogue (la fuente de los títulos 
   de la landing) a los títulos principales de la app sin 
   necesidad de tocar App.jsx. 
   
   Cómo funciona: 
   - Importa Epilogue desde Google Fonts
   - Selecciona los elementos que tienen fontSize grande y 
     fontWeight 800 (los patrones que usa App.jsx para 
     marcar títulos) y les aplica Epilogue con !important
   - El !important es necesario porque App.jsx usa estilos
     inline, que por defecto tienen prioridad sobre el CSS. 
     Con !important el CSS gana.
   ========================================================= */

@import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@500;600;700;800;900&display=swap');

/* Aplicar Epilogue a cualquier <h1>, <h2>, <h3> que React genere */
h1, h2, h3, h4 {
  font-family: 'Epilogue', sans-serif !important;
  letter-spacing: -0.025em !important;
}

/* 
   App.jsx no usa <h1>/<h2> nativos, usa <div> con estilo inline.
   Entonces apuntamos a los patrones visuales típicos de títulos:
   divs con font-weight 800 y font-size grande.
   
   Los selectores de abajo agarran los elementos cuyo style inline 
   contiene fontWeight 800, que es como App.jsx marca los títulos.
*/
div[style*="font-weight: 800"],
div[style*="fontWeight:800"],
span[style*="font-weight: 800"],
span[style*="fontWeight:800"] {
  font-family: 'Epilogue', sans-serif !important;
  letter-spacing: -0.025em !important;
}

/* El logo "Kooki" del componente KookiLogo usa Nunito.
   Lo forzamos a Epilogue también. */
span[style*="Nunito"] {
  font-family: 'Epilogue', sans-serif !important;
  letter-spacing: -0.025em !important;
}
