// api/send-phish-email.js
import { google } from "googleapis";

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getGmailClient(impersonateUser) {
  const jwt = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/gmail.send"],
    subject: impersonateUser, // impersonated user (must be in your domain)
  });
  await jwt.authorize();
  return google.gmail({ version: "v1", auth: jwt });
}

function buildMessage({ from, to, subject, html, text, replyTo }) {
  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="boundary123"`,
    replyTo ? `Reply-To: ${replyTo}` : null,
  ].filter(Boolean).join("\r\n");

  const body = [
    `--boundary123`,
    `Content-Type: text/plain; charset="UTF-8"`,
    ``,
    text,
    ``,
    `--boundary123`,
    `Content-Type: text/html; charset="UTF-8"`,
    ``,
    html,
    ``,
    `--boundary123--`
  ].join("\r\n");

  return base64UrlEncode(`${headers}\r\n\r\n${body}`);
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

    const { userEmail } = req.body || {};
    if (!userEmail) return res.status(400).json({ error: "Missing userEmail" });

    const gmail = await getGmailClient(userEmail);

    const subject = "Security training: You triggered a phishing test";
    const text = `Hi,

This was a controlled phishing simulation run by Hostfully to raise awareness.
No credentials were captured and no personal data was stored.

If you have questions, contact security@hostfully.com.`;

    const html = `<div style="font-family:Arial, sans-serif;max-width:560px">
      <h2 style="color:#b00020">This was a phishing test ⚠️</h2>
      <p>No personal data was collected and no real login occurred.</p>
      <p>If you have questions contact <a href="mailto:security@hostfully.com">security@hostfully.com</a>.</p>
      <p style="color:#6b7280">— Hostfully Security Team</p>
    </div>`;

    const raw = buildMessage({
      from: userEmail,
      to: userEmail,
      subject,
      html,
      text,
      replyTo: "security@hostfully.com"
    });

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw }
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("send-phish-email error:", err?.message || err);
    // return the error message for debugging (remove in prod)
    return res.status(500).json({ error: "send_failed", detail: err?.message || String(err) });
  }
}
