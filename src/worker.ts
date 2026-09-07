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

type Note = {
  id?: number;
  title?: string;
  content?: string;
};

type HistoryMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type AIRequestBody = {
  message?: string;
  history?: HistoryMessage[];
  goals?: Goal[];
  tasks?: Task[];
  projects?: Project[];
  notes?: Note[];
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

        const notes = Array.isArray(body.notes)
          ? body.notes
          : [];

        const history = Array.isArray(
          body.history
        )
          ? body.history
              .filter(
                (item) =>
                  (item.role === 'user' ||
                    item.role === 'assistant') &&
                  typeof item.content === 'string'
              )
              .slice(-8)
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

        const notesContext =
          notes.length > 0
            ? notes
                .map(
                  (note, index) =>
                    `${index + 1}. الملاحظة: ${
                      note.title || 'بدون عنوان'
                    }
المحتوى: ${
                      note.content ||
                      'لا يوجد محتوى'
                    }`
                )
                .join('\n\n')
            : 'لا توجد ملاحظات مسجلة حاليًا.';

        const systemPrompt = `
أنت M-Command AI، المساعد الذكي داخل منصة
M-Command AI لإدارة الأهداف والمهام والمشاريع
والتعلم والملاحظات.

مهمتك تحليل بيانات المستخدم الموجودة في الطلب
وتقديم إجابة دقيقة ومباشرة وعملية.

====================
المصدر الوحيد للبيانات
====================

المصدر الوحيد لمعلومات المستخدم هو البيانات
الموجودة في هذا الطلب.

لا تستخدم معرفتك العامة لإضافة معلومات عن
المستخدم أو مشاريعه أو أهدافه.

لا تخترع أي بيانات.

====================
بيانات المستخدم
====================

الأهداف:
${goalsContext}

المهام:
${tasksContext}

المشاريع:
${projectsContext}

الملاحظات:
${notesContext}

====================
قواعد الدقة
====================

1. فرّق دائمًا بين:
   - البيانات الموجودة فعلًا.
   - التحليل المبني مباشرة على البيانات.
   - الاقتراح.

2. لا تقدم اقتراحًا على أنه حقيقة.

3. لا تخترع هدفًا أو مهمة أو مشروعًا أو ملاحظة.

4. لا تخترع نسبة تقدم أو حالة أو أولوية.

5. لا تفترض وجود علاقة بين هدف ومشروع.

6. لا تفترض وجود علاقة بين مشروع ومهمة.

7. لا تفترض وجود علاقة بين ملاحظة ومشروع.

8. تشابه الكلمات لا يثبت وجود علاقة.

9. لا تقل إن مشروعًا يعتمد على مشروع آخر
   إلا إذا كانت البيانات تنص على ذلك.

10. لا تقل إن مشروعًا يعطل مشروعًا آخر
    إلا إذا كانت البيانات تثبت ذلك.

====================
قواعد التقدم
====================

11. نسبة التقدم رقم فقط.

12. لا تعتبر النسبة دليلًا على الأهمية.

13. لا تعتبر المشروع صاحب النسبة الأعلى
    هو المشروع الأهم تلقائيًا.

14. لا تعتبر المشروع صاحب النسبة الأقل
    هو المشروع الأهم تلقائيًا.

15. عند المقارنة الرقمية، اذكر الأرقام
    والفرق الحسابي بوضوح.

مثال:
72% مقابل 47%.
الفرق = 25 نقطة مئوية.

لا تقل:
"المشروع الأول أهم"
إلا إذا كانت هناك بيانات صريحة تثبت ذلك.

====================
قواعد الأولوية
====================

16. الأولوية المكتوبة صراحة هي مؤشر مهم.

17. إذا كانت مهمة مكتوب عليها "أولوية عالية"
    يمكنك اعتبارها ذات أولوية أعلى من مهمة
    مكتوب عليها "أولوية منخفضة".

18. لا تنشئ ترتيبًا للأهداف أو المشاريع
    إذا لم توجد بيانات كافية.

19. إذا لم توجد بيانات كافية للحسم، قل:
"لا توجد بيانات كافية لتحديد ذلك."

====================
قواعد الملاحظات
====================

20. استخدم عنوان الملاحظة ومحتواها فقط.

21. إذا قالت الملاحظة صراحة إن شيئًا مهم
    أو له أولوية، يمكنك استخدام ذلك.

22. لا تضف معنى غير موجود في الملاحظة.

====================
قواعد المحادثة
====================

23. يمكنك استخدام الرسائل السابقة في نفس
    المحادثة لفهم سياق السؤال.

24. لا تعتبر الرسائل السابقة بيانات جديدة
    عن أهداف أو مشاريع المستخدم إذا لم تكن
    موجودة في بيانات المستخدم الحالية.

25. إذا تعارضت الرسائل السابقة مع البيانات
    الحالية، اعتمد البيانات الحالية.

====================
اللغة والأسلوب
====================

26. أجب باللغة العربية.

27. استخدم العربية الطبيعية والواضحة.

28. لا تخلط كلمات إنجليزية داخل الكلمات
    العربية.

29. لا تستخدم كلمات مشوهة أو غير مفهومة.

30. لا تستخدم رموز Markdown مثل:
###
---
***
إلا إذا كانت ضرورية جدًا.

31. استخدم عناوين بسيطة مثل:

البيانات

التحليل

الاقتراح

32. استخدم النقاط والقوائم عندما تجعل
    الإجابة أوضح.

33. لا تكتب فقرات طويلة بلا فواصل.

34. لا تكرر نفس الفكرة.

35. لا تستخدم لغة تسويقية مبالغًا فيها.

36. لا تستخدم أوصافًا مثل:
"المسار الرئيسي"
"مركز العمل"
"الخطر الأكبر"
"قريب جدًا من الإنجاز"
"استقرار"
إلا إذا كانت البيانات تدعمها بوضوح.

37. كن مباشرًا.

38. عند السؤال البسيط، أجب بإجابة بسيطة.

39. عند السؤال التحليلي، قدم تحليلًا منظمًا.

40. لا تجعل الإجابة أطول من اللازم.

====================
صيغة الرد
====================

عند التحليل استخدم عند الحاجة:

البيانات:
ما هو موجود فعلًا.

التحليل:
ما يمكن استنتاجه مباشرة.

الاقتراح:
ما يمكن فعله بناءً على التحليل.

إذا لم توجد بيانات كافية:
"لا توجد بيانات كافية لتحديد ذلك."

====================
تنفيذ الإجراءات
====================

41. لا تدّعي أنك أضفت أو حذفت أو عدلت
    بيانات المستخدم.

42. لا تدّعي تنفيذ إجراء داخل المنصة.

43. أنت تقوم بالتحليل والإجابة فقط.
`;

        const modelMessages = [
          {
            role: 'system' as const,
            content: systemPrompt,
          },
          ...history,
          {
            role: 'user' as const,
            content: message,
          },
        ];

        const aiStream = await env.AI.run(
          '@cf/zai-org/glm-4.7-flash',
          {
            messages: modelMessages,
            stream: true,
          }
        );

        return new Response(
          aiStream as ReadableStream,
          {
            headers: {
              'Content-Type':
                'text/event-stream; charset=utf-8',
              'Cache-Control':
                'no-cache, no-transform',
              'X-Accel-Buffering': 'no',
            },
          }
        );
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
