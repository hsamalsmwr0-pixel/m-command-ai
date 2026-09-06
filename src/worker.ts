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

type Project = {
  id?: number;
  title?: string;
  description?: string;
  progress?: number;
  status?: string;
};

type AIRequestBody = {
  message?: string;
  goals?: Goal[];
  tasks?: Task[];
  projects?: Project[];
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

        const projects = Array.isArray(
          body.projects
        )
          ? body.projects
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

        const projectsContext =
          projects.length > 0
            ? projects
                .map(
                  (project, index) =>
                    `${index + 1}. المشروع: ${
                      project.title || 'بدون اسم'
                    }
الوصف: ${
                      project.description ||
                      'لا يوجد وصف'
                    }
التقدم: ${
                      typeof project.progress === 'number'
                        ? `${project.progress}%`
                        : 'غير محدد'
                    }
الحالة: ${
                      project.status || 'غير محددة'
                    }`
                )
                .join('\n\n')
            : 'لا توجد مشاريع مسجلة حاليًا.';

        const systemPrompt = `
أنت M-Command AI، المساعد الذكي داخل منصة
M-Command AI لإدارة الأهداف والمهام والمشاريع
والتعلم والملاحظات.

مهمتك مساعدة المستخدم على فهم مركز قيادته
واتخاذ قرارات عملية بناءً على بياناته الحالية.

====================
الأهداف
====================

${goalsContext}

====================
المهام
====================

${tasksContext}

====================
المشاريع
====================

${projectsContext}

====================
القواعد الأساسية
====================

1. استخدم بيانات المستخدم الموجودة في السياق
عندما يكون السؤال متعلقًا بأهدافه أو مهامه أو
مشاريعه.

2. لا تخترع هدفًا أو مهمة أو مشروعًا غير موجود.

3. لا تخلط بين الهدف والمهمة والمشروع.

4. عند السؤال عن المشاريع، اعرض المشاريع المسجلة
فقط، مع الاسم والوصف والتقدم والحالة عند توفرها.

5. عند تحليل المشاريع، استخدم نسبة التقدم والحالة
والوصف لتقديم تحليل عملي.

6. إذا سأل المستخدم عن المشروع الذي يحتاج تدخله
أولًا، استخدم البيانات الموجودة لتحديد المشروع
الأكثر حاجة للانتباه، واشرح السبب.

7. إذا سأل المستخدم عن جميع أهدافه ومهامه
ومشاريعه، افصل بينها بوضوح.

8. لا تدّعي الوصول إلى بيانات غير موجودة في
السياق.

9. لا تغيّر بيانات المستخدم ولا تدّعي تنفيذ أي
تعديل عليها.

10. إذا كان السؤال عامًا ولا يتعلق ببيانات
المستخدم، أجب بشكل طبيعي اعتمادًا على معرفتك.

11. أجب باللغة العربية بوضوح واختصار.

12. اجعل النصائح عملية وقابلة للتنفيذ.

13. عند ترتيب العناصر، اذكر سبب الترتيب بناءً
على البيانات المتاحة.

14. فرّق دائمًا بين:
- البيانات الفعلية للمستخدم.
- تحليلك لهذه البيانات.
- اقتراحاتك للمستخدم.

15. لا تستخدم مصطلحات تقنية أو إدارية معقدة
إذا لم تكن ضرورية للإجابة.
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

        if (
          !answer &&
          typeof responseData?.response ===
            'string'
        ) {
          answer = responseData.response;
        }

        if (
          !answer &&
          typeof responseData?.choices?.[0]
            ?.text === 'string'
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
