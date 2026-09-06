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

type Task = {
  id?: number;
  title?: string;
  description?: string;
  priority?: string;
  completed?: boolean;
  status?: string;
};

type AIRequestBody = {
  message?: string;
  goals?: Goal[];
  tasks?: Task[];
};

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

        const tasks = Array.isArray(body.tasks)
          ? body.tasks
          : [];

        if (!message) {
          return Response.json(
            {
              success: false,
              error: 'الرسالة مطلوبة',
            },
            { status: 400 }
          );
        }

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

        const tasksContext =
          tasks.length > 0
            ? tasks
                .map(
                  (task, index) =>
                    `${index + 1}. المهمة: ${
                      task.title || 'بدون اسم'
                    }
الوصف: ${
                      task.description ||
                      'لا يوجد وصف'
                    }
الأولوية: ${
                      task.priority || 'غير محددة'
                    }
الحالة: ${
                      typeof task.completed === 'boolean'
                        ? task.completed
                          ? 'مكتملة'
                          : 'غير مكتملة'
                        : task.status ||
                          'غير محددة'
                    }`
                )
                .join('\n\n')
            : 'لا توجد مهام مسجلة حاليًا.';

        const systemPrompt = `
أنت M-Command AI، المساعد الذكي داخل منصة
M-Command AI لإدارة الأهداف والمهام والمشاريع
والتعلم والملاحظات.

مهمتك أن تساعد المستخدم في اتخاذ قرارات عملية
وتحليل بيانات مركز القيادة.

====================
أهداف المستخدم
====================

${goalsContext}

====================
مهام المستخدم
====================

${tasksContext}

====================
القواعد
====================

1. عندما يسأل المستخدم عن أهدافه، استخدم بيانات
الأهداف الموجودة أعلاه فقط.

2. عندما يسأل المستخدم عن مهامه، استخدم بيانات
المهام الموجودة أعلاه فقط.

3. لا تخترع أهدافًا أو مهامًا غير موجودة.

4. عندما لا توجد أهداف، أخبر المستخدم بوضوح
أنه لا توجد أهداف مسجلة حاليًا.

5. عندما لا توجد مهام، أخبر المستخدم بوضوح
أنه لا توجد مهام مسجلة حاليًا.

6. عندما يطلب المستخدم تحليل أهدافه، حلل الاسم
والوصف والتقدم والحالة.

7. عندما يطلب المستخدم تحليل مهامه، حلل المهمة
والوصف والأولوية والحالة.

8. لا تدّعي أنك ترى بيانات غير موجودة في السياق.

9. إذا كان السؤال لا يتعلق بالأهداف أو المهام،
أجب عنه بشكل طبيعي اعتمادًا على معرفتك العامة.

10. أجب باللغة العربية بوضوح واختصار.

11. اجعل النصائح عملية وقابلة للتنفيذ.

12. إذا سأل المستخدم "ما هي أهدافي ومهامي"،
اعرض الأهداف والمهام المسجلة بشكل منظم.

13. لا تخلط بين الأهداف والمهام.

14. لا تغير أو تعدل بيانات المستخدم. أنت تقوم
بالتحليل والإجابة فقط.
`;

        const aiResponse = await env.AI.run(
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

        const responseData =
          aiResponse as any;

        let answer = '';

        const content =
          responseData?.choices?.[0]?.message
            ?.content;

        if (typeof content === 'string') {
          answer = content;
        } else if (Array.isArray(content)) {
          answer = content
            .map((part: any) =>
              typeof part === 'string'
                ? part
                : part?.text || ''
            )
            .join('');
        }

        if (!answer && typeof responseData?.response === 'string') {
          answer = responseData.response;
        }

        if (
          !answer &&
          typeof responseData?.choices?.[0]?.text ===
            'string'
        ) {
          answer =
            responseData.choices[0].text;
        }

        answer = answer.trim();

        if (!answer) {
          return Response.json(
            {
              success: false,
              error:
                'تم الاتصال بالذكاء الاصطناعي ولكن لم يتم استلام إجابة.',
            },
            { status: 502 }
          );
        }

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

    return env.ASSETS.fetch(request);
  },
};
