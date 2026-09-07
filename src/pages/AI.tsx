import { useEffect, useState } from 'react';
import '../styles.css';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type Goal = {
  id: number;
  title: string;
  description: string;
  progress: number;
  status: 'قيد التنفيذ' | 'مكتمل' | 'متوقف';
};

type Task = {
  id: number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
};

type Project = {
  id: number;
  title: string;
  description: string;
  progress: number;
  status: 'قيد التنفيذ' | 'مكتمل' | 'متوقف';
};

type Note = {
  id: number;
  title: string;
  content: string;
};

type Conversation = {
  id: number;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

const CONVERSATIONS_STORAGE_KEY =
  'm-command-ai-conversations';

const ACTIVE_CONVERSATION_STORAGE_KEY =
  'm-command-ai-active-conversation';

function createConversation(): Conversation {
  const now = Date.now();

  return {
    id: now,
    title: 'محادثة جديدة',
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

function renderInlineFormatting(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (
      part.startsWith('**') &&
      part.endsWith('**')
    ) {
      return (
        <strong key={index}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

function renderFormattedText(text: string) {
  const lines = text.split('\n');

  return lines.map((line, index) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      return (
        <div
          key={`space-${index}`}
          className="ai-text-space"
        />
      );
    }

    const isHeading =
      /^\*\*.+\*\*$/.test(trimmedLine);

    const isNumberedList =
      /^\d+\.\s+/.test(trimmedLine);

    const isBullet =
      /^[-•*]\s+/.test(trimmedLine);

    if (isHeading) {
      const cleanHeading = trimmedLine.replace(
        /^\*\*|\*\*$/g,
        ''
      );

      return (
        <h3
          key={index}
          className="ai-response-heading"
        >
          {cleanHeading}
        </h3>
      );
    }

    if (isNumberedList) {
      const match =
        trimmedLine.match(/^(\d+\.)\s+(.+)$/);

      if (match) {
        return (
          <div
            key={index}
            className="ai-response-list-item"
          >
            <span className="ai-response-number">
              {match[1]}
            </span>

            <span>
              {renderInlineFormatting(match[2])}
            </span>
          </div>
        );
      }
    }

    if (isBullet) {
      const cleanLine = trimmedLine.replace(
        /^[-•*]\s+/,
        ''
      );

      return (
        <div
          key={index}
          className="ai-response-list-item"
        >
          <span className="ai-response-bullet">
            •
          </span>

          <span>
            {renderInlineFormatting(cleanLine)}
          </span>
        </div>
      );
    }

    return (
      <p
        key={index}
        className="ai-response-paragraph"
      >
        {renderInlineFormatting(trimmedLine)}
      </p>
    );
  });
}

function extractStreamText(data: unknown): string {
  if (!data || typeof data !== 'object') {
    return '';
  }

  const item = data as any;

  if (
    typeof item.response === 'string'
  ) {
    return item.response;
  }

  if (
    typeof item.response?.response === 'string'
  ) {
    return item.response.response;
  }

  if (
    typeof item.choices?.[0]?.delta
      ?.content === 'string'
  ) {
    return item.choices[0].delta.content;
  }

  if (
    typeof item.choices?.[0]?.message
      ?.content === 'string'
  ) {
    return item.choices[0].message.content;
  }

  if (
    typeof item.choices?.[0]?.text === 'string'
  ) {
    return item.choices[0].text;
  }

  return '';
}

export default function AI() {
  const [conversations, setConversations] =
    useState<Conversation[]>(() => {
      try {
        const saved = localStorage.getItem(
          CONVERSATIONS_STORAGE_KEY
        );

        if (!saved) {
          return [];
        }

        const parsed = JSON.parse(saved);

        return Array.isArray(parsed)
          ? parsed
          : [];
      } catch {
        return [];
      }
    });

  const [activeConversationId, setActiveConversationId] =
    useState<number | null>(() => {
      try {
        const saved = localStorage.getItem(
          ACTIVE_CONVERSATION_STORAGE_KEY
        );

        return saved ? Number(saved) : null;
      } catch {
        return null;
      }
    });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const activeConversation =
    conversations.find(
      (conversation) =>
        conversation.id ===
        activeConversationId
    );

  const messages =
    activeConversation?.messages || [];

  useEffect(() => {
    localStorage.setItem(
      CONVERSATIONS_STORAGE_KEY,
      JSON.stringify(conversations)
    );
  }, [conversations]);

  useEffect(() => {
    if (activeConversationId !== null) {
      localStorage.setItem(
        ACTIVE_CONVERSATION_STORAGE_KEY,
        String(activeConversationId)
      );
    } else {
      localStorage.removeItem(
        ACTIVE_CONVERSATION_STORAGE_KEY
      );
    }
  }, [activeConversationId]);

  useEffect(() => {
    if (
      conversations.length > 0 &&
      activeConversationId === null
    ) {
      setActiveConversationId(
        conversations[0].id
      );
    }
  }, [
    conversations,
    activeConversationId,
  ]);

  const getGoals = (): Goal[] => {
    try {
      const savedGoals = localStorage.getItem(
        'm-command-goals'
      );

      if (!savedGoals) return [];

      const parsedGoals = JSON.parse(savedGoals);

      return Array.isArray(parsedGoals)
        ? parsedGoals
        : [];
    } catch {
      return [];
    }
  };

  const getTasks = (): Task[] => {
    try {
      const savedTasks = localStorage.getItem(
        'm-command-tasks'
      );

      if (!savedTasks) return [];

      const parsedTasks = JSON.parse(savedTasks);

      return Array.isArray(parsedTasks)
        ? parsedTasks
        : [];
    } catch {
      return [];
    }
  };

  const getProjects = (): Project[] => {
    try {
      const savedProjects = localStorage.getItem(
        'm-command-projects'
      );

      if (!savedProjects) return [];

      const parsedProjects =
        JSON.parse(savedProjects);

      return Array.isArray(parsedProjects)
        ? parsedProjects
        : [];
    } catch {
      return [];
    }
  };

  const getNotes = (): Note[] => {
    try {
      const savedNotes = localStorage.getItem(
        'm-command-notes'
      );

      if (!savedNotes) return [];

      const parsedNotes = JSON.parse(savedNotes);

      return Array.isArray(parsedNotes)
        ? parsedNotes
        : [];
    } catch {
      return [];
    }
  };

  const updateConversation = (
    id: number,
    newMessages: Message[],
    title?: string
  ) => {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id
          ? {
              ...conversation,
              messages: newMessages,
              title:
                title || conversation.title,
              updatedAt: Date.now(),
            }
          : conversation
      )
    );
  };

  const sendMessage = async () => {
    const message = input.trim();

    if (!message || loading) return;

    let conversationId =
      activeConversationId;

    if (conversationId === null) {
      const newConversation =
        createConversation();

      setConversations((current) => [
        newConversation,
        ...current,
      ]);

      conversationId =
        newConversation.id;

      setActiveConversationId(
        conversationId
      );
    }

    const currentConversation =
      conversations.find(
        (conversation) =>
          conversation.id === conversationId
      );

    const previousMessages =
      currentConversation?.messages || [];

    const goals = getGoals();
    const tasks = getTasks();
    const projects = getProjects();
    const notes = getNotes();

    const userMessage: Message = {
      role: 'user',
      content: message,
    };

    const messagesWithUser = [
      ...previousMessages,
      userMessage,
    ];

    updateConversation(
      conversationId,
      messagesWithUser,
      previousMessages.length === 0
        ? message.slice(0, 40)
        : undefined
    );

    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: previousMessages,
          goals,
          tasks,
          projects,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error(
          'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.'
        );
      }

      if (!response.body) {
        throw new Error(
          'الخادم لم يرسل Stream.'
        );
      }

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder('utf-8');

      let assistantText = '';
      let buffer = '';

      updateConversation(
        conversationId,
        [
          ...messagesWithUser,
          {
            role: 'assistant',
            content: '',
          },
        ]
      );

      while (true) {
        const { value, done } =
          await reader.read();

        if (done) {
          break;
        }

        const chunk =
          decoder.decode(value, {
            stream: true,
          });

        buffer += chunk;

        const lines =
          buffer.split('\n');

        buffer =
          lines.pop() || '';

        for (const line of lines) {
          const cleanLine = line.trim();

          if (!cleanLine) {
            continue;
          }

          if (
            !cleanLine.startsWith('data:')
          ) {
            continue;
          }

          const jsonText =
            cleanLine
              .slice(5)
              .trim();

          if (
            !jsonText ||
            jsonText === '[DONE]'
          ) {
            continue;
          }

          try {
            const parsed =
              JSON.parse(jsonText);

            const text =
              extractStreamText(parsed);

            if (!text) {
              continue;
            }

            assistantText += text;

            updateConversation(
              conversationId!,
              [
                ...messagesWithUser,
                {
                  role: 'assistant',
                  content: assistantText,
                },
              ]
            );
          } catch {
            continue;
          }
        }
      }

      const remaining =
        buffer.trim();

      if (
        remaining.startsWith('data:')
      ) {
        const jsonText =
          remaining
            .slice(5)
            .trim();

        if (
          jsonText &&
          jsonText !== '[DONE]'
        ) {
          try {
            const parsed =
              JSON.parse(jsonText);

            const text =
              extractStreamText(parsed);

            if (text) {
              assistantText += text;
            }
          } catch {
            // تجاهل الجزء غير المكتمل
          }
        }
      }

      const finalText =
        assistantText.trim();

      if (!finalText) {
        throw new Error(
          'لم يتم استلام إجابة من الذكاء الاصطناعي.'
        );
      }

      updateConversation(
        conversationId!,
        [
          ...messagesWithUser,
          {
            role: 'assistant',
            content: finalText,
          },
        ]
      );
    } catch {
      updateConversation(
        conversationId!,
        [
          ...messagesWithUser,
          {
            role: 'assistant',
            content:
              'حدث خطأ أثناء الاتصال بـ M-Command AI. حاول مرة أخرى.',
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const createNewConversation = () => {
    if (loading) return;

    const newConversation =
      createConversation();

    setConversations((current) => [
      newConversation,
      ...current,
    ]);

    setActiveConversationId(
      newConversation.id
    );

    setInput('');
  };

  const selectConversation = (
    id: number
  ) => {
    if (loading) return;

    setActiveConversationId(id);
    setInput('');
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <main className="page">
      <section className="ai-page">
        <div className="ai-header">
          <div>
            <span className="eyebrow">
              M-COMMAND AI
            </span>

            <h1>مساعدك الذكي</h1>

            <p>
              استخدم الذكاء الاصطناعي لتحليل أهدافك
              ومهامك ومشاريعك وملاحظاتك وتنظيم عملك
              من مكان واحد.
            </p>
          </div>

          <div className="ai-status">
            <span className="status-dot"></span>
            AI جاهز
          </div>
        </div>

        <section className="ai-chat-layout">
          <aside className="ai-conversations">
            <div className="ai-conversations-header">
              <h2>المحادثات</h2>

              <button
                type="button"
                className="primary-button"
                onClick={
                  createNewConversation
                }
                disabled={loading}
              >
                + محادثة جديدة
              </button>
            </div>

            <div className="ai-conversations-list">
              {conversations.length === 0 ? (
                <p className="ai-no-conversations">
                  لا توجد محادثات محفوظة.
                </p>
              ) : (
                conversations.map(
                  (conversation) => (
                    <button
                      type="button"
                      key={
                        conversation.id
                      }
                      className={`ai-conversation-item ${
                        conversation.id ===
                        activeConversationId
                          ? 'active'
                          : ''
                      }`}
                      onClick={() =>
                        selectConversation(
                          conversation.id
                        )
                      }
                      disabled={loading}
                    >
                      <strong>
                        {
                          conversation.title
                        }
                      </strong>

                      <span>
                        {
                          conversation
                            .messages.length
                        }{' '}
                        رسالة
                      </span>
                    </button>
                  )
                )
              )}
            </div>
          </aside>

          <section className="ai-chat-card">
            <div className="ai-chat-header">
              <div className="ai-avatar">
                🤖
              </div>

              <div>
                <strong>
                  M-Command AI
                </strong>

                <span>
                  مساعد مركز القيادة
                </span>
              </div>
            </div>

            <div className="ai-empty-state">
              {messages.length === 0 ? (
                <>
                  <div className="ai-large-icon">
                    🤖
                  </div>

                  <h2>
                    كيف يمكنني مساعدتك؟
                  </h2>

                  <p>
                    ابدأ بسؤال عن أهدافك أو
                    مهامك أو مشاريعك أو
                    ملاحظاتك أو خطتك اليومية.
                  </p>
                </>
              ) : (
                <div className="ai-messages">
                  {messages.map(
                    (message, index) => (
                      <div
                        key={index}
                        className={`ai-message ${
                          message.role ===
                          'user'
                            ? 'ai-message-user'
                            : 'ai-message-assistant'
                        }`}
                      >
                        <strong>
                          {message.role ===
                          'user'
                            ? 'أنت'
                            : 'M-Command AI'}
                        </strong>

                        {message.role ===
                        'assistant' ? (
                          <div className="ai-formatted-response">
                            {renderFormattedText(
                              message.content
                            )}

                            {loading &&
                              index ===
                                messages.length -
                                  1 && (
                                <span className="ai-streaming-cursor">
                                  ▌
                                </span>
                              )}
                          </div>
                        ) : (
                          <p>
                            {
                              message.content
                            }
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="ai-input-area">
              <input
                type="text"
                value={input}
                onChange={(event) =>
                  setInput(
                    event.target.value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                placeholder="اكتب سؤالك لـ M-Command AI..."
                disabled={loading}
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={
                  loading ||
                  !input.trim()
                }
              >
                {loading
                  ? 'جاري...'
                  : 'إرسال'}
              </button>
            </div>
          </section>
        </section>

        <section className="ai-tools">
          <div className="section-title">
            <h2>
              أدوات الذكاء الاصطناعي
            </h2>

            <span>V1.1</span>
          </div>

          <div className="ai-tools-grid">
            <article className="ai-tool-card">
              <span>🎯</span>

              <h3>تحليل الأهداف</h3>

              <p>
                تحليل أهدافك وتحويلها
                إلى خطوات عملية.
              </p>
            </article>

            <article className="ai-tool-card">
              <span>✓</span>

              <h3>تنظيم المهام</h3>

              <p>
                ترتيب المهام وتحديد
                الأولويات.
              </p>
            </article>

            <article className="ai-tool-card">
              <span>🚀</span>

              <h3>تحليل المشاريع</h3>

              <p>
                فهم حالة المشروع
                وتحديد الخطوات القادمة.
              </p>
            </article>

            <article className="ai-tool-card">
              <span>📋</span>

              <h3>توليد خطة</h3>

              <p>
                إنشاء خطة عملية بناءً
                على هدفك.
              </p>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
                   }
