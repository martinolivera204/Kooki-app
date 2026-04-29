// /api/subscribe.js
// Crea una suscripción en Mercado Pago y devuelve el init_point (URL de checkout)
// Planes: mensual $3.500, anual $19.900, lifetime $29.900

const PLANS = {
  mensual: {
    reason: "Kooki Premium — Mensual",
    frequency: 1,
    frequency_type: "months",
    transaction_amount: 3500,
  },
  anual: {
    reason: "Kooki Premium — Anual",
    frequency: 12,
    frequency_type: "months",
    transaction_amount: 19900,
  },
};

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email, plan } = req.body;

    if (!email || !plan) {
      return res.status(400).json({ error: "Faltan email o plan" });
    }

    // Lifetime = pago único via Checkout Pro (no suscripción)
    if (plan === "lifetime") {
      const prefResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          items: [{
            title: "Kooki Premium — De por vida",
            quantity: 1,
            unit_price: 29900,
            currency_id: "ARS",
          }],
          payer: { email },
          back_urls: {
            success: "https://kookiapp.com?status=ok",
            failure: "https://kookiapp.com?status=error",
            pending: "https://kookiapp.com?status=pending",
          },
          auto_return: "approved",
          external_reference: `lifetime_${email}_${Date.now()}`,
          notification_url: "https://kookiapp.com/api/webhook",
        }),
      });

      const prefData = await prefResponse.json();

      if (!prefResponse.ok) {
        console.error("MP Preference error:", prefData);
        return res.status(500).json({ error: "Error creando preferencia", detail: prefData });
      }

      return res.status(200).json({
        init_point: prefData.init_point,
        type: "lifetime",
      });
    }

    // Suscripción mensual o anual
    const planConfig = PLANS[plan];
    if (!planConfig) {
      return res.status(400).json({ error: "Plan inválido. Usá: mensual, anual, o lifetime" });
    }

    const body = {
      reason: planConfig.reason,
      auto_recurring: {
        frequency: planConfig.frequency,
        frequency_type: planConfig.frequency_type,
        transaction_amount: planConfig.transaction_amount,
        currency_id: "ARS",
      },
      payer_email: email,
      back_url: "https://kookiapp.com?status=ok",
      status: "pending",
    };

    const response = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("MP Subscription error:", data);
      return res.status(500).json({ error: "Error creando suscripción", detail: data });
    }

    return res.status(200).json({
      init_point: data.init_point,
      subscription_id: data.id,
      type: "subscription",
      plan,
    });

  } catch (err) {
    console.error("Subscribe error:", err);
    return res.status(500).json({ error: "Error interno" });
  }
}
