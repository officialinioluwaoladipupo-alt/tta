const SENSITIVE_FIELD = /email|password|token|secret|authorization|cookie/i;

function scrubValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(scrubValue);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [key, SENSITIVE_FIELD.test(key) ? "[Filtered]" : scrubValue(nested)]),
  );
}

export function scrubSentryEvent<T extends object>(event: T): T {
  const clean = scrubValue(event) as Record<string, unknown>;
  const request = clean.request;

  if (request && typeof request === "object") {
    const safeRequest = request as Record<string, unknown>;
    delete safeRequest.data;
    delete safeRequest.cookies;
    delete safeRequest.headers;
    delete safeRequest.query_string;
    if (typeof safeRequest.url === "string") {
      try {
        const url = new URL(safeRequest.url);
        safeRequest.url = `${url.origin}${url.pathname}`;
      } catch {
        safeRequest.url = "[Filtered URL]";
      }
    }
  }

  return clean as T;
}
