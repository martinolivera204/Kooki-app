// /api/check-subscription.js
// Verifica si un email tiene suscripción activa en Mercado Pago
// La app React llama acá para saber si dar acceso

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Falta email" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Buscar suscripciones activas (mensual/anual)
    const subResponse = await fetch(
      `https://api.mercadopago.com/preapproval/search?payer_email=${encodeURIComponent(normalizedEmail)}&status=authorized`,
      {
        headers: {
          "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );
    const subData = await subResponse.json();

    if (subData.results && subData.results.length > 0) {
      const activeSub = subData.results[0];
      return res.status(200).json({
        active: true,
        type: "subscription",
        plan: activeSub.auto_recurring?.frequency === 12 ? "anual" : "mensual",
        reason: activeSub.reason,
        next_payment: activeSub.next_payment_date,
      });
    }

    // 2. Buscar pagos aprobados de lifetime
    const payResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/search?payer.email=${encodeURIComponent(normalizedEmail)}&status=approved&external_reference=lifetime_`,
      {
        headers: {
          "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );
    const payData = await payResponse.json();

    if (payData.results && payData.results.length > 0) {
      // Verificar que alguno tenga external_reference que empiece con "lifetime_"
      const lifetimePayment = payData.results.find(p =>
        p.external_reference && p.external_reference.startsWith("lifetime_")
      );

      if (lifetimePayment) {
        return res.status(200).json({
          active: true,
          type: "lifetime",
          plan: "lifetime",
          paid_at: lifetimePayment.date_approved,
        });
      }
    }

    // 3. También verificar el código legacy (KOOKI-9K2X-W5NR)
    // Esto permite que los usuarios que ya compraron con el sistema viejo sigan accediendo
    // TODO: remover cuando ya no haya usuarios legacy

    // No tiene acceso
    return res.status(200).json({
      active: false,
    });

  } catch (err) {
    console.error("Check subscription error:", err);
    return res.status(500).json({ error: "Error verificando suscripción" });
  }
}
