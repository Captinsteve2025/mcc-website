import "server-only";

type Email = {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendResendEmail(apiKey: string, key: string, email: Email, earlierTemplate?: Email): Promise<Response> {
  const signal = AbortSignal.timeout(8_000);
  const send = (body: Email) => fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": key,
    },
    body: JSON.stringify(body),
    signal,
  });

  const response = await send(email);
  if (response.status === 409 && earlierTemplate) {
    const failure = await response.clone().json().catch(() => null);
    // Recover an existing delivery ID if this request was first attempted before branding was released.
    if (failure?.name === "invalid_idempotent_request") return send(earlierTemplate);
  }
  return response;
}
