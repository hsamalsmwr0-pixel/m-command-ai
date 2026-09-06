export interface Env {
  ASSETS: Fetcher;
  AI: Ai;
}

export default {
  async fetch(
    request: Request,
    env: Env
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return Response.json({
        status: 'ok',
        service: 'M-Command AI API',
        workers_ai: 'connected',
      });
    }

    if (url.pathname === '/api/ai' && request.method === 'POST') {
      try {
        const body = await request.json<{ message?: string }>();

        const message = body.message?.trim();

        if (!message) {
          return Response.json(
            {
              error: 'الرسالة مطلوبة',
            },
            { status: 400 }
          );
        }

        const response = await env.AI.run(
          '@cf/zai-org/glm-4.7-flash',
          {
            messages: [
              {
                role: 'system',
                content:
                  'أنت M-Command AI، مساعد ذكي لإدارة الأهداف والمهام والمشاريع والتعلم. أجب باللغة العربية بوضوح واختصار.',
              },
              {
                role: 'user',
                content: message,
              },
            ],
          }
        );

        return Response.json({
          success: true,
          response,
        });
      } catch (error) {
        return Response.json(
          {
            success: false,
            error: 'حدث خطأ أثناء تشغيل الذكاء الاصطناعي.',
          },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};
