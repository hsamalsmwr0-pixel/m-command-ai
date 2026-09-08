export interface Env {
  ASSETS: Fetcher;
  AI: Ai;
}

type Goal = {
  title?: string;
  description?: string;
  progress?: number;
  status?: string;
};

type Task = {
  title?: string;
  description?: string;
  priority?: string;
  completed?: boolean;
  status?: string;
};

type Project = {
  title?: string;
  description?: string;
  progress?: number;
  status?: string;
};

type Note = {
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

function buildGoalsContext(goals: Goal[]): string {
  if (goals.length === 0) {
    return 'لا توجد أهداف.';
  }

  return goals
    .map(
      (goal, index) =>
        `${index + 1}) ${goal.title || 'بدون اسم'} | ` +
        `الوصف: ${goal.description || 'لا يوجد'} | ` +
        `التقدم: ${
          typeof goal.progress === 'number'
            ? `${goal.progress}%`
            : 'غير محدد'
        } | ` +
        `الحالة: ${goal.status || 'غير محددة'}`
    )
    .join('\n');
}

function buildTasksContext(tasks: Task[]): string {
  if (tasks.length === 0) {
    return 'لا توجد مهام.';
  }

  return tasks
    .map(
      (task, index) =>
        `${index + 1}) ${task.title || 'بدون اسم'} | ` +
        `الوصف: ${task.description || 'لا يوجد'} | ` +
        `الأولوية: ${task.priority || 'غير محددة'} | ` +
        `الحالة: ${
          typeof task.completed === 'boolean'
            ? task.completed
              ? 'مكتملة'
              : 'غير مكتملة'
            : task.status || 'غير محددة'
        }`
    )
    .join('\n');
}

function buildProjectsContext(projects: Project[]): string {
  if (projects.length === 0) {
    return 'لا توجد مشاريع.';
  }

  return projects
    .map(
      (project, index) =>
        `${index + 1}) ${project.title || 'بدون اسم'} | ` +
        `الوصف: ${project.description || 'لا يوجد'} | ` +
        `التقدم: ${
          typeof project.progress === 'number'
            ? `${project.progress}%`
            : 'غير محدد'
        } | ` +
        `الحالة: ${project.status || 'غير محددة'}`
    )
    .join('\n');
}

function buildNotesContext(notes: Note[]): string {
  if (notes.length === 0) {
    return 'لا توجد ملاحظات.';
  }

  return notes
    .map(
      (note, index) =>
        `${index + 1}) ${note.title || 'بدون عنوان'} | ` +
        `${note.content || 'لا يوجد محتوى'}`
    )
    .join('\n');
}

const SYSTEM_PROMPT = `
أنت M-Command AI داخل منصة لإدارة الأهداف والمهام والمشاريع والتعلم والملاحظات.

مهمتك تحليل البيانات المرسلة والإجابة بالعربية بشكل مباشر ودقيق وعملي.

مصدر بيانات المستخدم:
استخدم فقط الأهداف والمهام والمشاريع والملاحظات الموجودة في الطلب.
لا تخترع أي بيانات أو علاقات أو نسب أو حالات أو أولويات.
لا تستخدم معلومات قديمة عن المستخدم كبديل عن البيانات الحالية.
البيانات الحالية لها الأولوية.

الدقة:
- فرّق بين البيانات الفعلية والتحليل والاقتراح.
- لا تقدم اقتراحًا على أنه حقيقة.
- تشابه الكلمات لا يثبت وجود علاقة.
- لا تفترض علاقة بين هدف ومشروع ومهمة وملاحظة إلا إذا ذكرتها البيانات صراحة.
- لا تدّعي أن مشروعًا يعتمد على مشروع آخر أو يعطله إلا إذا ثبت ذلك من البيانات.

التقدم:
- النسبة رقم فقط.
- لا تستخدم نسبة التقدم وحدها لتحديد الأهمية أو الأولوية.
- عند المقارنة الرقمية، اذكر الرقمين والفرق بالنقاط المئوية.
- لا تستخدم أوصافًا مثل متأخر أو قريب من الإنجاز أو متقدم إلا إذا كانت البيانات أو المقارنة تدعمها.

الأولوية:
- الأولوية المكتوبة صراحةً في المهمة هي الدليل المباشر.
- عالية أعلى من متوسطة، ومتوسطة أعلى من منخفضة.
- لا تحول كلمات مثل مهم أو ضروري أو فكرة إلى أولوية تنفيذية ما لم تصنفها البيانات كذلك.
- الوصف الطويل أو وجود خطوات في الملاحظة أو نسبة التقدم لا يجعل العنصر أولوية.
- عند سؤال المستخدم عن أهم 3 أشياء:
  1. استخدم الأولويات الصريحة أولًا.
  2. إذا وُجد عنصران مؤكدان فقط، اذكرهما فقط.
  3. إذا لم توجد بيانات كافية للعنصر الثالث، قل: لا توجد بيانات كافية لتحديد أولوية ثالثة بدقة.
  4. يمكن تقديم اقتراح منفصل، ويجب تسميته بوضوح "الاقتراح".
- لا ترتب المشاريع أو الأهداف أو الملاحظات من عندك دون أساس كافٍ.

الملاحظات:
استخدم العنوان والمحتوى فقط.
إذا ذكرت الملاحظة صراحةً أن شيئًا مهم أو له أولوية، يمكنك نقل ذلك كبيان موجود، لكن لا تحول ذلك تلقائيًا إلى أولوية تنفيذية عامة.

المحادثة:
يمكن استخدام الرسائل السابقة لفهم سياق السؤال.
لكن الرسائل السابقة لا تصبح بيانات جديدة عن المستخدم.
إذا تعارضت مع البيانات الحالية، اعتمد البيانات الحالية.

الأسلوب:
- العربية الطبيعية والواضحة.
- مباشر ومختصر.
- استخدم عناوين بسيطة مثل: البيانات، التحليل، الاقتراح.
- استخدم القوائم عند الحاجة.
- لا تكرر الأفكار.
- لا تستخدم لغة تسويقية مبالغًا فيها.
- لا تدّعي تنفيذ أي إجراء داخل المنصة.
- أنت تحلل وتجيب فقط.
`;

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

        if (!message) {
          return Response.json(
            {
              success: false,
              error: 'الرسالة مطلوبة',
            },
            { status: 400 }
          );
        }

        const goals = Array.isArray(body.goals)
          ? body.goals
          : [];

        const tasks = Array.isArray(body.tasks)
          ? body.tasks
          : [];

        const projects = Array.isArray(body.projects)
          ? body.projects
          : [];

        const notes = Array.isArray(body.notes)
          ? body.notes
          : [];

        const history = Array.isArray(body.history)
          ? body.history
              .filter(
                (item) =>
                  (item.role === 'user' ||
                    item.role === 'assistant') &&
                  typeof item.content === 'string' &&
                  item.content.trim().length > 0
              )
              .slice(-6)
          : [];

        const dataContext = `
بيانات المستخدم الحالية:

الأهداف:
${buildGoalsContext(goals)}

المهام:
${buildTasksContext(tasks)}

المشاريع:
${buildProjectsContext(projects)}

الملاحظات:
${buildNotesContext(notes)}
`;

        const modelMessages = [
          {
            role: 'system' as const,
            content:
              SYSTEM_PROMPT + '\n' + dataContext,
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
