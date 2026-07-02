const TO_EMAIL = "bettertogetherleadership@gmail.com";
const FROM_EMAIL =
  process.env.CONTACT_FROM || "Better Together Leadership <onboarding@resend.dev>";
const RESEND_API_KEY =
  process.env.RESEND_API_KEY ||
  process.env.RESEND_API ||
  process.env.resend_API ||
  process.env.RESEND_KEY;

function json(response, statusCode) {
  return { response, statusCode };
}

function clean(value, maxLength = 2000) {
  return String(value || "").trim().slice(0, maxLength);
}

export default async function handler(request, response) {
  response.setHeader("Content-Type", "application/json");

  if (request.method !== "POST") {
    const result = json({ ok: false, message: "Method not allowed." }, 405);
    return response.status(result.statusCode).json(result.response);
  }

  let payload;
  try {
    payload =
      typeof request.body === "string" ? JSON.parse(request.body) : request.body || {};
  } catch {
    const result = json({ ok: false, message: "Invalid request body." }, 400);
    return response.status(result.statusCode).json(result.response);
  }

  if (payload.website) {
    const result = json({ ok: true, message: "Thanks. Your message has been sent." }, 200);
    return response.status(result.statusCode).json(result.response);
  }

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 180);
  const organization = clean(payload.organization, 180);
  const supportType = clean(payload.support_type, 180);
  const message = clean(payload.message, 4000);

  if (!name || !email || !message) {
    const result = json({ ok: false, message: "Please complete the required fields." }, 400);
    return response.status(result.statusCode).json(result.response);
  }

  if (!RESEND_API_KEY) {
    const result = json(
      {
        ok: false,
        message:
          "Email is not configured yet. In Vercel, add RESEND_API_KEY and redeploy the site.",
      },
      500
    );
    return response.status(result.statusCode).json(result.response);
  }

  const text = [
    "New Better Together Leadership website inquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `School or Organization: ${organization || "Not provided"}`,
    `Type of Support Needed: ${supportType || "Not provided"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <h2>New Better Together Leadership website inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>School or Organization:</strong> ${escapeHtml(organization || "Not provided")}</p>
    <p><strong>Type of Support Needed:</strong> ${escapeHtml(supportType || "Not provided")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: email,
      subject: `Website inquiry from ${name}`,
      text,
      html,
    }),
  });

  if (!resendResponse.ok) {
    const errorMessage = await getResendErrorMessage(resendResponse);
    const result = json(
      {
        ok: false,
        message: `The message could not be sent through Resend. Please email bettertogetherleadership@gmail.com directly. Resend detail: ${errorMessage}`,
      },
      502
    );
    return response.status(result.statusCode).json(result.response);
  }

  const result = json({ ok: true, message: "Thanks. Your message has been sent." }, 200);
  return response.status(result.statusCode).json(result.response);
}

async function getResendErrorMessage(resendResponse) {
  try {
    const details = await resendResponse.json();
    return clean(
      details.message || details.error || "Check that CONTACT_FROM is verified in Resend.",
      400
    );
  } catch {
    return "Check that CONTACT_FROM is verified in Resend.";
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
