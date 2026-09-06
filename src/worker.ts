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

    // ================================
    // API Health Check
    // ================================
    if (url.pathname === '/api/health') {
      return Response.json({
        status: 'ok',
        service: 'M-Command AI API',
        workers_ai: 'connected',
      });
    }

    // ================================
    // M-Command AI API
    // ================================
    if (url.pathname === '/api/ai' && request.method === 'POST') {
      try {
        // قراءة البيانات القادمة من المستخدم
        const body = await request.json<{ message?: string }>();

        const message = body.message?.trim();

        // التحقق من وجود الرسالة
        if (!message) {
          return Response.json(
            {
              success: false,
              error: 'الرسالة مطلوبة',
            },
            { status: 400 }
          );
        }

        // تشغيل نموذج Workers AI
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

        // استخراج النص النهائي فقط من إجابة النموذج
        const answer =
          response?.choices?.[0]?.message?.content ||
          'لم أتمكن من الحصول على إجابة.';

        // إرسال النص النهائي فقط إلى الواجهة
        return Response.json({
          success: true,
          message: answer,
        });
      } catch (error) {
        // التعامل مع أي خطأ في API أو Workers AI
        return Response.json(
          {
            success: false,
            error: 'حدث خطأ أثناء تشغيل الذكاء الاصطناعي.',
          },
          { status: 500 }
        );
      }
    }

    // ================================
    // Static Assets / React Application
    // ================================
    return env.ASSETS.fetch(request);
  },
};
