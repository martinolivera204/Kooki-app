// /api/chef.js
// Función serverless de Vercel que conecta el Chef Asistente con Claude.
// La API key se lee de la variable de entorno ANTHROPIC_API_KEY (configurada en Vercel).
// Nunca se expone al navegador del usuario.

export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history = [], menu = null } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Falta el mensaje" });
    }

    // Construir el contexto del menú del usuario para que Claude lo conozca
    let menuContext = "";
    if (menu && menu.menu) {
      const dias = menu.menu
        .map(d => `${d.dia}: Almuerzo - ${d.alm} | Cena - ${d.cen}`)
        .join("\n");
      menuContext = `\n\nMENU SEMANAL DEL USUARIO:\n${dias}\n\nObjetivo del plan: ${menu.tag || "general"}`;
    }

    // System prompt: define la personalidad y reglas del chef
    const systemPrompt = `Sos el Chef Asistente de Kooki, una app argentina de planificación de comidas con IA.

Tu rol es ayudar al usuario con dudas concretas de cocina:
- Reemplazos de ingredientes cuando le falta algo
- Tiempos de cocción y puntos justos
- Conservación de comidas (heladera, freezer)
- Trucos prácticos y consejos rápidos
- Adaptaciones de recetas a dietas o preferencias

REGLAS DE ESTILO:
- Hablás en español rioplatense (vos, podés, tenés, querés)
- Respuestas cortas y directas, máximo 2-3 oraciones
- Cálido pero no empalagoso
- Usás 1 emoji al final de la respuesta, no más
- Si te preguntan algo que no es de cocina, redirigís amablemente al tema
- Nunca inventes datos nutricionales específicos si no estás seguro
- Si el usuario te dice "no tengo X" o "se me acabó X", entendelo como pedido de reemplazo${menuContext}`;

    // Construir el array de mensajes (historia + nuevo mensaje)
    const messages = [
      ...history.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text || m.content || ""
      })),
      { role: "user", content: message }
    ];

    // Llamada a la API de Claude
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: systemPrompt,
        messages: messages
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Error de Anthropic:", response.status, errText);
      return res.status(500).json({
        error: "El chef no pudo responder ahora. Probá de nuevo en un momento."
      });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Disculpá, no entendí. ¿Podés reformular la pregunta?";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Error en /api/chef:", err);
    return res.status(500).json({
      error: "Hubo un error técnico. Probá de nuevo."
    });
  }
}
