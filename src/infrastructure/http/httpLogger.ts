import { ApiError, addApiInterceptor } from '@/src/infrastructure/http/apiClient';

function formatMs(ms: number): string {
  if (!Number.isFinite(ms)) return '';
  return `${Math.max(0, Math.round(ms))}ms`;
}

export function installHttpLogger(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? (__DEV__ as boolean);
  if (!enabled) return () => {};

  return addApiInterceptor({
    onRequest: (ctx) => {
      console.log(`[HTTP] → ${ctx.method} ${ctx.url}`);
    },
    onResponse: (ctx) => {
      const ms = Date.now() - ctx.request.startedAt;
      console.log(`[HTTP] ← ${ctx.response.status} ${ctx.request.method} ${ctx.request.url} (${formatMs(ms)})`);
    },
    onError: ({ request, error }) => {
      const ms = Date.now() - request.startedAt;
      if (error instanceof ApiError) {
        console.log(`[HTTP] ← ${error.status} ${request.method} ${request.url} (${formatMs(ms)})`);
        return;
      }
      console.log(`[HTTP] × ${request.method} ${request.url} (${formatMs(ms)})`);
    },
  });
}
