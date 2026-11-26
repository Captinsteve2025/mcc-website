import "server-only";

const logoUrl = "https://mcc-website-one.vercel.app/_next/image?url=%2Fimages%2Fbrand%2Fmcc-logo-light.png&w=256&q=75";
const escaped: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => escaped[character]);
}

type GuestReceipt = {
  kind: "hold" | "proposal";
  fullName: string;
  yachtName: string;
  dates: string;
  guests: number;
  reference: string;
};

export function guestRequestReceipt({ kind, fullName, yachtName, dates, guests, reference }: GuestReceipt) {
  const title = kind === "hold" ? "We’ve received your hold request" : "We’ve received your proposal request";
  const subjectName = yachtName.replace(/\s+/g, " ").trim();
  const subject = kind === "hold" ? `Hold request received for ${subjectName}` : `Charter proposal request received for ${subjectName}`;
  const firstName = fullName.trim().split(/\s+/)[0];
  const displayName = firstName === firstName.toLowerCase() ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : firstName;
  const greeting = `Hi ${displayName},`;
  const nextStep = kind === "hold"
    ? "Thanks for getting in touch with My Caribbean Charters. Our charter team will check availability and follow up by email. Your dates are subject to confirmation."
    : "Thanks for getting in touch with My Caribbean Charters. Our charter team will check availability and follow up by email about your personalised proposal. Your dates are subject to confirmation.";
  const followUp = "If your plans change or you’d like to add a detail, just reply to this email.";
  const details = [
    ["Yacht", yachtName],
    ["Requested dates", dates],
    ["Guests", String(guests)],
  ];
  const text = [
    title,
    greeting,
    nextStep,
    details.map(([label, value]) => `${label}: ${value}`).join("\n"),
    followUp,
    "My Caribbean Charters",
    `Reference: ${reference}`,
  ].join("\n\n");

  const rows = details.map(([label, value]) => `<tr>
    <th scope="row" align="left" width="41%" style="padding:8px 12px 8px 16px;font-weight:normal;color:#455362;vertical-align:top">${label}</th>
    <td style="padding:8px 16px 8px 0;color:#061625;font-weight:bold;overflow-wrap:anywhere">${escapeHtml(value)}</td>
  </tr>`).join("");

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f8f7f4;color:#061625;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f8f7f4">
<tr><td align="center" style="padding:16px 10px">
<!--[if mso]><table role="presentation" width="560" cellspacing="0" cellpadding="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="max-width:560px;width:100%">
<tr><td bgcolor="#061625" style="padding:12px 24px;border-bottom:3px solid #ee9739">
  <img src="${escapeHtml(logoUrl)}" width="128" height="78" alt="My Caribbean Charters" style="display:block;color:#ffffff;font-size:14px;line-height:20px;border:0">
</td></tr>
<tr><td style="padding:24px;font-size:16px;line-height:1.6">
  <h1 style="margin:0 0 16px;color:#061625;font:italic 28px/1.2 Georgia,'Times New Roman',serif">${title}</h1>
  <p style="margin:0 0 12px">${escapeHtml(greeting)}</p>
  <p style="margin:0 0 18px">${nextStep}</p>
  <table width="100%" cellspacing="0" cellpadding="0" bgcolor="#f8f7f4" aria-label="Request details" style="font-size:15px;line-height:1.45">${rows}</table>
  <p style="margin:18px 0 0">${followUp}</p>
</td></tr>
<tr><td style="padding:16px 24px 20px;border-top:1px solid #e2ded6;font-size:13px;line-height:1.5;color:#455362">
  <strong style="color:#061625">My Caribbean Charters</strong><br>
  Reference · <span style="overflow-wrap:anywhere;word-break:break-word">${escapeHtml(reference)}</span>
</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body></html>`;
  return { subject, text, html };
}

export function formatHoldEmailDates(start: string, end: string): string {
  const from = new Date(`${start.slice(0, 10)}T00:00:00Z`);
  const to = new Date(`${end.slice(0, 10)}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).formatRange(from, to);
}
