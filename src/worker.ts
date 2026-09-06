export interface Env {
  ASSETS: Fetcher;
  AI: Ai;
}

type Goal = {
  id?: number;
  title?: string;
  description?: string;
  progress?: number;
  status?: string;
};

type AIRequestBody = {
  message?: string;
  goals?: Goal[];
};

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
    if (
      url.pathname === '/api/ai' &&
      request.method === 'POST'
    ) {
      try {
        const body =
          await request.json<AIRequestBody>();

        const message = body.message?.trim();
        const goals = Array.isArray(body.goals)
          ? body.goals
          : [];

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

        // ================================
        // تجهيز بيانات الأهداف
        // ================================

        const goalsContext =
          goals.length > 0
            ? goals
                .map(
                  (goal, index) =>
                    `${index + 1}. الهدف: ${
                      goal.title || 'بدون اسم'
                    }
الوصف: ${
                      goal.description ||
                      'لا يوجد وصف'
                    }
التقدم: ${
                      typeof goal.progress === 'number'
                        ? `${goal.progress}%`
                        : 'غير محدد'
                    }
الحالة: ${
                      goal.status || 'غير محددة'
                    }`
                )
                .join('\n\n')
            : 'لا توجد أهداف مسجلة حاليًا.';

        // ================================
        // سياق M-Command AI
        // ================================

        const systemPrompt = `
أنت M-Command AI، المساعد الذكي داخل منصة
M-Command AI لإدارة الأهداف والمهام والمشاريع
والتعلم والملاحظات.

مهمتك أن تساعد المستخدم في اتخاذ قرارات عملية
وتحليل بيانات مركز القيادة.

بيانات أهداف المستخدم الحالية:

${goalsContext}

قواعد مهمة:

1. عندما يسأل المستخدم عن أهدافه، استخدم البيانات
   الموجودة أعلاه ولا تخترع أهدافًا غير موجودة.

2. عندما يطلب تحليل أهدافه، حلل نسبة التقدم
   والحالة والوصف الموجود لكل هدف.

3. عندما لا توجد أهداف، أخبر المستخدم بوضوح
   أنه لا توجد أهداف مسجلة حاليًا.

4. لا تدّعي أنك ترى بيانات غير موجودة في السياق.

5. أجب باللغة العربية بوضوح واختصار.

6. اجعل النصائح عملية وقابلة للتنفيذ.

7. إذا كان السؤال لا يتعلق بالأهداف، أجب عنه
   بشكل طبيعي اعتمادًا على معرفتك العامة.
`;

        // ================================
        // تشغيل Workers AI
        // ================================

        const response = await env.AI.run(
          '@cf/zai-org/glm-4.7-flash',
          {
            messages: [
              {
                role: 'system',
                content: systemPrompt,
              },
              {
                role: 'user',
                content: message,
              },
            ],
          }
        );

        // ================================
        // استخراج الإجابة
        // ================================

        const answer =
          response?.choices?.[0]?.message?.content ||
          'لم أتمكن من الحصول على إجابة.';

        // ================================
        // إرسال النتيجة
        // ================================

        return Response.json({
          success: true,
          message: answer,
        });
      } catch (error) {
        console.error(
          'M-Command AI Error:',
          error
        );

        return Response.json(
          {
            success: false,
            error:
              'حدث خطأ أثناء تشغيل الذكاء الاصطناعي.',
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
