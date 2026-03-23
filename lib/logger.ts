type LogLevel = 'info' | 'warn' | 'error';

interface LogExtra {
  [key: string]: unknown;
}

function sanitize(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replace(/key=[^&\s]*/gi, 'key=***').replace(/token=[^&\s]*/gi, 'token=***');
  }
  return value;
}

function log(level: LogLevel, context: string, message: string, extra?: LogExtra) {
  const timestamp = new Date().toISOString();
  const sanitizedExtra = extra
    ? Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, sanitize(v)]))
    : undefined;

  const entry = {
    timestamp,
    level,
    context,
    message,
    ...(sanitizedExtra ? { extra: sanitizedExtra } : {}),
  };

  if (level === 'error') {
    console.error(JSON.stringify(entry));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export function logError(context: string, error: unknown, extra?: LogExtra) {
  const message =
    error instanceof Error ? error.message : 'An unknown error occurred';
  log('error', context, message, extra);
}

export function logWarn(context: string, message: string, extra?: LogExtra) {
  log('warn', context, message, extra);
}

export function logInfo(context: string, message: string, extra?: LogExtra) {
  log('info', context, message, extra);
}
