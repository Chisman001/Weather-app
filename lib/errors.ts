export class WeatherApiError extends Error {
  name = 'WeatherApiError';
  code?: string;
  cause?: unknown;

  constructor(message: string, code?: string, cause?: unknown) {
    super(message);
    this.code = code;
    this.cause = cause;
  }
}

export class LocationValidationError extends Error {
  name = 'LocationValidationError';
  cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.cause = cause;
  }
}

export class RateLimitError extends Error {
  name = 'RateLimitError';
  retryAfter?: number;

  constructor(message: string, retryAfter?: number) {
    super(message);
    this.retryAfter = retryAfter;
  }
}

export class UnexpectedWeatherDataError extends Error {
  name = 'UnexpectedWeatherDataError';
  cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.cause = cause;
  }
}
