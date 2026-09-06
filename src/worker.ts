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

        // ================================
        // التحقق من الرسالة
        // ================================

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

        let goalsContext =
          'لا توجد أهداف مسجلة حاليًا.';

        if (goals.length > 0) {
          goalsContext = goals
            .map(
              (goal, index) => {
                return `
الهدف ${index + 1}:
الاسم: ${goal.title || 'بدون اسم'}
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
                }
`;
              }
            )
            .join('\n');
        }

        // ================================
        // System Prompt
        // ================================

        const systemPrompt = `
أنت M-Command AI، المساعد الذكي داخل منصة
M-Command AI.

أنت متخصص في إدارة وتحليل:
- الأهداف
- المهام
- المشاريع
- التعلم
- الملاحظات

بيانات أهداف المستخدم الحالية:

${goalsContext}

قواعد العمل:

1. إذا سأل المستخدم عن أهدافه، استخدم البيانات
   الموجودة في "بيانات أهداف المستخدم الحالية".

2. لا تخترع أي هدف غير موجود في البيانات.

3. إذا كانت هناك أهداف، اذكر أسماءها وحالتها
   ونسبة تقدمها عند الحاجة.

4. إذا لم توجد أهداف، أخبر المستخدم أنه لا توجد
   أهداف مسجلة حاليًا.

5. إذا طلب المستخدم تحليل أهدافه، قدم تحليلًا
   عمليًا ومختصرًا.

6. إذا كان السؤال لا يتعلق بالأهداف، أجب بشكل
   طبيعي اعتمادًا على معرفتك.

7. أجب باللغة العربية.

8. لا تقل إنك لا تستطيع الوصول إلى بيانات المستخدم
   إذا كانت البيانات موجودة في السياق أعلاه.

9. لا تذكر تفاصيل تقنية مثل localStorage أو API
   أو Worker للمستخدم.

رسالة المستخدم:
${message}
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
        // استخراج إجابة النموذج
        // ================================

        let answer = '';

        const aiResponse =
          response as any;

        // الصيغة الأولى
        if (
          aiResponse?.choices?.[0]?.message?.content
        ) {
          answer =
            aiResponse.choices[0].message.content;
        }

        // صيغة بديلة
        else if (aiResponse?.response) {
          answer = aiResponse.response;
        }

        // صيغة بديلة أخرى
        else if (
          aiResponse?.choices?.[0]?.text
        ) {
          answer =
            aiResponse.choices[0].text;
        }

        // التأكد من أن الإجابة نص
        if (typeof answer !== 'string') {
          answer = String(answer || '');
        }

        answer = answer.trim();

        // ================================
        // التحقق النهائي
        // ================================

        if (!answer) {
          return Response.json(
            {
              success: false,
              error:
                'لم يتمكن النموذج من إنتاج إجابة.',
            },
            { status: 502 }
          );
        }

        // ================================
        // إرسال الإجابة
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
    // React / Static Assets
    // ================================

    return env.ASSETS.fetch(request);
  },
};
