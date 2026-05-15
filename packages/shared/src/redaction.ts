const SECRET_PATTERNS: RegExp[] = [
  /\b(password|passwd|pwd|secret|token|api[_-]?key|access[_-]?key|private[_-]?key)\b\s*[:=]\s*["']?([^"'\s,}]+)/gi,
  /\b[A-Za-z0-9_]*_(TOKEN|SECRET|PASSWORD|API_KEY|KEY)\b\s*=\s*["']?([^"'\s]+)/g,
  /\b(sk-[A-Za-z0-9_-]{12,})\b/g,
  /\b(eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)\b/g
];

export function redactString(value: string): { value: string; redactionApplied: boolean } {
  let redactionApplied = false;
  let redacted = value;

  for (const pattern of SECRET_PATTERNS) {
    redacted = redacted.replace(pattern, (match, keyOrSecret: string) => {
      redactionApplied = true;
      if (match.includes("=") || match.includes(":")) {
        return match.replace(/([:=]\s*["']?)([^"'\s,}]+)/, "$1[REDACTED]");
      }
      return keyOrSecret ? "[REDACTED]" : match;
    });
  }

  return { value: redacted, redactionApplied };
}

export function redactJson<T>(input: T): { value: T; redactionApplied: boolean } {
  let redactionApplied = false;

  function walk(value: unknown): unknown {
    if (typeof value === "string") {
      const redacted = redactString(value);
      redactionApplied ||= redacted.redactionApplied;
      return redacted.value;
    }

    if (Array.isArray(value)) {
      return value.map(walk);
    }

    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([key, child]) => {
          if (/password|secret|token|api[_-]?key|private[_-]?key/i.test(key)) {
            redactionApplied = true;
            return [key, "[REDACTED]"];
          }
          return [key, walk(child)];
        })
      );
    }

    return value;
  }

  return { value: walk(input) as T, redactionApplied };
}
