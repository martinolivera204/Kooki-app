// /api/webhook.js
// Recibe webhooks de Mercado Pago y notifica por email cada venta

async function notifyEmail(subject, html) {
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Kooki <onboarding@resend.dev>",
        to: "kookiapp.ia@gmail.com",
        subject,
        html,
      }),
    });
  } catch (err) {
    console.error("Error enviando email:", err);
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") return res.status(200).send("OK");
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { type, data, action } = req.body;
    console.log("Webhook received:", { type, action, data_id: data?.id });

    // Notificación de suscripción (preapproval)
    if (type === "subscription_preapproval" || type === "preapproval") {
      const subscriptionId = data?.id;
      if (!subscriptionId) return res.status(200).send("OK");

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
        const plan = subData.auto_recurring?.frequency === 12 ? "Anual" : "Mensual";
        console.log(`✅ SUSCRIPCIÓN ACTIVA: ${email} — ${subData.reason}`);

        await notifyEmail(
          `💰 Nueva suscripción ${plan} — Kooki`,
          `<h2>Nueva suscripción en Kooki</h2>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Plan:</strong> ${plan}</p>
           <p><strong>Monto:</strong> $${subData.auto_recurring?.transaction_amount}</p>
           <p><strong>ID:</strong> ${subData.id}</p>
           <p><strong>Fecha:</strong> ${new Date().toLocaleString("es-AR")}</p>`
        );
      }
    }

    // Notificación de pago (lifetime y pagos de suscripción)
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
        const tipo = isLifetime ? "Lifetime (de por vida)" : "Pago de suscripción";
        console.log(`✅ PAGO APROBADO: ${email} — $${payData.transaction_amount} ${isLifetime ? "(LIFETIME)" : ""}`);

        await notifyEmail(
          `💰 ${isLifetime ? "Venta Lifetime" : "Pago recibido"} — $${payData.transaction_amount} — Kooki`,
          `<h2>Nuevo pago en Kooki</h2>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Tipo:</strong> ${tipo}</p>
           <p><strong>Monto:</strong> $${payData.transaction_amount}</p>
           <p><strong>Referencia:</strong> ${payData.external_reference || "N/A"}</p>
           <p><strong>Medio de pago:</strong> ${payData.payment_type_id}</p>
           <p><strong>ID pago:</strong> ${payData.id}</p>
           <p><strong>Fecha:</strong> ${new Date().toLocaleString("es-AR")}</p>`
        );
      }
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(200).send("OK");
  }
}
