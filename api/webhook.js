// /api/webhook.js
// Recibe notificaciones (webhooks) de Mercado Pago
// Cuando un pago se confirma, logea el email del suscriptor
// TODO: guardar en base de datos (Supabase, Vercel KV, etc.)

export default async function handler(req, res) {
  // MP manda GET para verificar y POST con datos
  if (req.method === "GET") return res.status(200).send("OK");
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { type, data, action } = req.body;

    console.log("Webhook received:", { type, action, data_id: data?.id });

    // Notificación de suscripción (preapproval)
    if (type === "subscription_preapproval" || type === "preapproval") {
      const subscriptionId = data?.id;
      if (!subscriptionId) return res.status(200).send("OK");

      // Consultar estado de la suscripción
      const subResponse = await fetch(
        `https://api.mercadopago.com/preapproval/${subscriptionId}`,
        {
          headers: {
            "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );
      const subData = await subResponse.json();

      console.log("Subscription status:", {
        id: subData.id,
        status: subData.status,
        payer_email: subData.payer_email || subData.payer?.email,
        reason: subData.reason,
      });

      if (subData.status === "authorized") {
        const email = subData.payer_email || subData.payer?.email;
        console.log(`✅ SUSCRIPCIÓN ACTIVA: ${email} — ${subData.reason}`);
        // TODO: guardar en DB
        // await saveSubscriber(email, subData);
      }
    }

    // Notificación de pago (para lifetime y pagos de suscripción)
    if (type === "payment") {
      const paymentId = data?.id;
      if (!paymentId) return res.status(200).send("OK");

      const payResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );
      const payData = await payResponse.json();

      console.log("Payment status:", {
        id: payData.id,
        status: payData.status,
        email: payData.payer?.email,
        amount: payData.transaction_amount,
        external_reference: payData.external_reference,
      });

      if (payData.status === "approved") {
        const email = payData.payer?.email;
        const isLifetime = payData.external_reference?.startsWith("lifetime_");

        console.log(`✅ PAGO APROBADO: ${email} — $${payData.transaction_amount} ${isLifetime ? "(LIFETIME)" : ""}`);
        // TODO: guardar en DB
        // await saveSubscriber(email, { type: isLifetime ? 'lifetime' : 'subscription', payData });
      }
    }

    return res.status(200).send("OK");

  } catch (err) {
    console.error("Webhook error:", err);
    // Siempre devolver 200 para que MP no reintente infinitamente
    return res.status(200).send("OK");
  }
}
