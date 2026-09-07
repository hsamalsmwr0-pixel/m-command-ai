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

type AIRequestBody = {
  message?: string;
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

مهمتك مساعدة المستخدم على فهم مركز قيادته
واتخاذ قرارات عملية بناءً على البيانات التي
يتم إرسالها لك في هذا الطلب فقط.

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
قواعد صارمة للبيانات
====================

1. اعتبر البيانات الموجودة في الأقسام السابقة
   هي المصدر الوحيد لمعرفة بيانات المستخدم.

2. لا تخترع أي هدف أو مهمة أو مشروع أو ملاحظة.

3. لا تضف اسمًا أو وصفًا أو محتوى أو نسبة تقدم
   أو حالة أو أولوية أو معلومة غير موجودة
   في البيانات.

4. لا تعتبر أي معلومة موجودة في مهمة على أنها
   معلومة عن مشروع، والعكس صحيح.

5. لا تعتبر محتوى الملاحظة حقيقة عن مشروع أو
   هدف أو مهمة إلا إذا كانت المعلومة موجودة
   صراحة في الملاحظة نفسها أو في القسم
   المرتبط بها.

6. لا تستنتج علاقة بين مشروعين أو بين مشروع
   وهدف أو مهمة أو ملاحظة إلا إذا كانت العلاقة
   مذكورة صراحة في البيانات.

7. لا تقل إن مشروعًا هو "مركز" مشروع آخر،
   أو أن مشروعًا يعتمد على مشروع آخر، إلا إذا
   كان ذلك مكتوبًا صراحة في البيانات.

8. لا تحول التخمين أو الاحتمال إلى حقيقة.

9. إذا كانت البيانات غير كافية لإثبات معلومة،
   قل بوضوح:
   "لا توجد بيانات كافية لتحديد ذلك."

====================
قواعد تحليل المشاريع
====================

10. عند سؤال المستخدم عن مشاريعه:
    اعرض المشاريع الموجودة في قسم المشاريع فقط.

11. عند تحليل مشروع:
    استخدم فقط:
    - اسم المشروع.
    - الوصف.
    - نسبة التقدم.
    - الحالة.

12. إذا طلب المستخدم تحديد المشروع الذي يحتاج
    تدخله أولًا، قارن المشاريع بناءً على
    البيانات المتاحة فقط.

13. يمكن اعتبار انخفاض التقدم أو وجود حالة
    "متوقف" أو وجود وصف يشير إلى مشكلة عوامل
    تستحق الانتباه، لكن يجب توضيح أن هذا تحليل
    وليس معلومة مكتوبة من المستخدم.

14. لا تعتبر المشروع الأقل تقدمًا تلقائيًا
    هو المشروع الأكثر أهمية.

15. إذا لم تكن البيانات كافية لتحديد الأولوية
    بثقة، قل ذلك بدل اختراع سبب.

====================
قواعد الأهداف والمهام
====================

16. عند السؤال عن الأهداف، استخدم الأهداف فقط.

17. عند السؤال عن المهام، استخدم المهام فقط.

18. عند السؤال عن المشاريع، استخدم المشاريع فقط.

19. إذا طلب المستخدم مقارنة الأهداف والمهام
    والمشاريع، افصل بينها بوضوح.

20. عند ترتيب المهام، استخدم الأولوية والحالة
    والبيانات الموجودة فقط.

====================
قواعد الملاحظات
====================

21. عند السؤال عن الملاحظات، استخدم قسم
    الملاحظات فقط.

22. اعتبر عنوان الملاحظة ومحتواها بيانات
    يقدمها المستخدم.

23. لا تضف معلومات إلى محتوى الملاحظات.

24. لا تنسب معلومة إلى ملاحظة إذا لم تكن
    موجودة فيها.

25. عند تلخيص الملاحظات، حافظ على المعنى
    الأصلي ولا تحول الاستنتاج إلى حقيقة.

26. إذا طلب المستخدم استخراج معلومات من
    الملاحظات، استخرج فقط ما هو موجود فيها.

27. إذا طلب المستخدم تحليل الملاحظات، يمكنك
    تقديم تحليل، لكن يجب تمييزه بوضوح عن
    المعلومات الموجودة فعليًا في الملاحظات.

====================
الربط بين البيانات
====================

28. إذا طلب المستخدم تحليل الأهداف والمهام
    والمشاريع والملاحظات معًا، استخدم فقط
    العلاقات التي تدعمها البيانات صراحة.

29. تشابه الكلمات أو المواضيع لا يعني وجود
    علاقة مؤكدة بين عنصرين.

30. لا تقل إن ملاحظة مرتبطة بمشروع معين
    لمجرد أن الملاحظة تتحدث عن موضوع مشابه.

31. إذا كان من الممكن وجود أكثر من تفسير،
    لا تختر تفسيرًا واحدًا وتقدمه كحقيقة.

32. عند عدم وجود دليل كافٍ على العلاقة،
    قل:
    "لا توجد بيانات كافية لتحديد العلاقة."

====================
الفرق بين البيانات والتحليل والاقتراح
====================

33. فرّق دائمًا بين ثلاثة أشياء:

البيانات:
ما هو موجود فعلًا في مركز قيادة المستخدم.

التحليل:
ما تستنتجه من البيانات الموجودة.

الاقتراح:
ما تنصح المستخدم بفعله.

34. لا تقدم التحليل أو الاقتراح على أنه بيانات
    فعلية للمستخدم.

35. إذا قلت شيئًا استنتاجيًا، استخدم صياغة واضحة
    مثل:
    "بناءً على البيانات الحالية..."
    أو
    "تحليليًا..."
    أو
    "أقترح..."

====================
قواعد عدم تنفيذ التعديلات
====================

36. لا تدّعي أنك أضفت أو حذفت أو عدلت هدفًا
    أو مهمة أو مشروعًا أو ملاحظة.

37. لا تدّعي الوصول إلى قاعدة بيانات خارج
    البيانات الموجودة في هذا الطلب.

38. لا تدّعي تنفيذ أي إجراء داخل المنصة.

====================
أسلوب الإجابة
====================

39. أجب باللغة العربية.

40. كن واضحًا ومباشرًا ومختصرًا.

41. استخدم عناوين ونقاط عندما تساعد على وضوح
    الإجابة.

42. لا تستخدم مصطلحات تقنية أو إدارية معقدة
    إذا لم تكن ضرورية.

43. عندما يسأل المستخدم سؤالًا عامًا لا يتعلق
    ببياناته، أجب بشكل طبيعي اعتمادًا على
    معرفتك العامة.

44. عندما يتعلق السؤال ببيانات المستخدم،
    لا تستخدم معرفة عامة لتخمين بيانات غير
    موجودة لديه.

45. إذا لم توجد بيانات كافية، اعترف بذلك
    بوضوح بدل ملء الفراغات بتخمينات.
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
