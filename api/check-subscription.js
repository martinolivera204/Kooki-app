// /api/check-subscription.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Falta email" });

    const normalizedEmail = email.trim().toLowerCase();

    // 0. Acceso manual para usuarios verificados
    const MANUAL_ACCESS = ['kevinzarriello@gmail.com'];
    if (MANUAL_ACCESS.includes(normalizedEmail)) {
      return res.status(200).json({ active: true, type: "lifetime", plan: "lifetime" });
    }

    const headers = { "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}` };

    // 1. Buscar suscripciones activas (mensual/anual) por email
    try {
      const subRes = await fetch(
        `https://api.mercadopago.com/preapproval/search?payer_email=${encodeURIComponent(normalizedEmail)}&status=authorized`,
        { headers }
      );
      const subData = await subRes.json();
      if (subData.results && subData.results.length > 0) {
        const sub = subData.results[0];
        return res.status(200).json({
          active: true, type: "subscription",
          plan: sub.auto_recurring?.frequency === 12 ? "anual" : "mensual",
          reason: sub.reason, next_payment: sub.next_payment_date,
        });
      }
    } catch (e) { console.error("Sub search error:", e); }

    // 2. Buscar pagos lifetime por email del payer (MP puede tener email distinto)
    try {
      const payRes = await fetch(
        `https://api.mercadopago.com/v1/payments/search?payer.email=${encodeURIComponent(normalizedEmail)}&status=approved`,
        { headers }
      );
      const payData = await payRes.json();
      if (payData.results && payData.results.length > 0) {
        const lt = payData.results.find(p => p.external_reference && p.external_reference.startsWith("lifetime_"));
        if (lt) {
          return res.status(200).json({ active: true, type: "lifetime", plan: "lifetime", paid_at: lt.date_approved });
        }
      }
    } catch (e) { console.error("Pay search by email error:", e); }

    // 3. Buscar pagos lifetime por external_reference (contiene el email de la app)
    try {
      const refRes = await fetch(
        `https://api.mercadopago.com/v1/payments/search?status=approved&sort=date_created&criteria=desc&range=date_created&begin_date=NOW-3MONTHS&end_date=NOW`,
        { headers }
      );
      const refData = await refRes.json();
      if (refData.results && refData.results.length > 0) {
        const lt = refData.results.find(p =>
          p.external_reference &&
          p.external_reference.startsWith("lifetime_") &&
          p.external_reference.includes(normalizedEmail)
        );
        if (lt) {
          return res.status(200).json({ active: true, type: "lifetime", plan: "lifetime", paid_at: lt.date_approved });
        }
      }
    } catch (e) { console.error("Pay search by ref error:", e); }

    return res.status(200).json({ active: false });

  } catch (err) {
    console.error("Check subscription error:", err);
    return res.status(500).json({ error: "Error verificando suscripción" });
  }
}
