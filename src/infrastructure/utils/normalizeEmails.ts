export function normalizeAndDedupEmails(raw: string[]): string[] {
  const clean = (raw || [])
    .map((e) => (e || "").toString().trim().toLowerCase())
    .filter((e) => !!e && /\S+@\S+\.\S+/.test(e));
  return Array.from(new Set(clean));
}
