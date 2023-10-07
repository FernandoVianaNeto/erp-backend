export class RetryDto {
  maxRetries: number;

  statusCodeRetry: number[];

  delayRetryInMs: number;

  retryCount: number;
}
