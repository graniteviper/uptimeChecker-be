export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) && !!parsed.hostname;
  } catch {
    return false;
  }
}

export function isPublicUrl(url: string): boolean {
  const parsed = new URL(url);
  const hostname = parsed.hostname;

  // Block localhost, IPs, internal ranges
  const isPrivateIP =
    /^(127\.0\.0\.1|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1]))/.test(
      hostname
    );
  const isBlocked = hostname === "localhost" || isPrivateIP;

  return !isBlocked;
}
