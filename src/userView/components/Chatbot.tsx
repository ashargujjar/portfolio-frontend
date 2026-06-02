import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Bot, AlertCircle } from "lucide-react";

const apiUrl = import.meta.env.VITE_BACKEND_URL ?? "";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hi there! I'm Ashar's AI assistant. Ask me anything about his projects, experience, or skills!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  const getWordCount = (text: string) => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };

  const handleSendMessage = async (e?: React.FormEvent, customQuestion?: string) => {
    if (e) e.preventDefault();

    const question = customQuestion !== undefined ? customQuestion.trim() : inputValue.trim();
    if (!question || isLoading) return;

    // Reset input if sent via input field
    if (customQuestion === undefined) {
      setInputValue("");
    }

    // Word count check
    const words = question.split(/\s+/).filter(Boolean);
    if (words.length > 60) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          sender: "user",
          text: question,
        },
        {
          id: String(Date.now() + 1),
          sender: "bot",
          text: "Oops! Please limit your question to 60 words.",
        },
      ]);
      return;
    }

    // Add user message to UI
    const userMsgId = String(Date.now());
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: "user",
        text: question,
      },
    ]);

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const payload = await response.json();
      if (payload.success && payload.data) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            sender: "bot",
            text: payload.data,
          },
        ]);
      } else {
        throw new Error(payload.message || "Failed to fetch answer");
      }
    } catch (error) {
      console.error("Chatbot API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          sender: "bot",
          text: "Sorry, I encountered an issue processing that. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (query: string) => {
    handleSendMessage(undefined, query);
  };

  const suggestions = [
    { label: "🚀 Flagship Project: RABTA", query: "Tell me about your flagship project RABTA." },
    { label: "💻 Full-Stack Stack", query: "What is your complete technical stack?" },
    { label: "🎓 Education Details", query: "Tell me about your education and BSCS degree." },
    { label: "📩 Contact/Hire Info", query: "How can I get in touch with you or hire you?" },
  ];

  const wordCount = getWordCount(inputValue);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 flex h-[500px] w-80 flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/95 backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-5 duration-300 md:w-96">
          {/* Chat Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-md">
                <Bot size={18} className="animate-pulse" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-slate-900 bg-emerald-500">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-none flex items-center gap-1.5">
                  Ashar's AI Assistant
                  <Sparkles size={12} className="text-amber-400" />
                </h3>
                <span className="text-[10px] text-indigo-200/80 font-medium">Online • Responds instantly</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto bg-slate-50/50 p-4 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-sm">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${msg.sender === "user"
                      ? "rounded-tr-none bg-gradient-to-br from-indigo-600 to-blue-600 text-white"
                      : "rounded-tl-none bg-white border border-slate-100 text-slate-800 chatbot-response-bubble"
                    }`}
                >
                  {msg.sender === "bot" ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                      className="text-[13px] text-slate-800 space-y-2
                        [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-indigo-950 [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:leading-tight [&_h3]:border-b [&_h3]:border-slate-100 [&_h3]:pb-0.5
                        [&_hr]:my-2 [&_hr]:border-t [&_hr]:border-slate-100
                        [&_strong]:text-slate-900 [&_strong]:font-semibold
                        [&_br]:my-1
                        [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-1.5 [&_ul]:space-y-1
                        [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:my-1.5 [&_ol]:space-y-1
                        [&_li]:text-slate-700
                        [&_p]:mb-1
                      "
                    />
                  ) : (
                    <p className="whitespace-pre-wrap text-[13px]">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex w-full gap-2.5 justify-start">
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-sm animate-pulse">
                  <Bot size={14} />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-white border border-slate-100 p-3 text-sm text-slate-600 flex items-center gap-1.5 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s]"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="flex gap-2 overflow-x-auto border-t border-slate-100 bg-slate-50 px-4 py-2 no-scrollbar">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isLoading}
                onClick={() => handleSuggestionClick(suggestion.query)}
                className="shrink-0 rounded-full border border-slate-250 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-indigo-500 hover:bg-indigo-50/50 hover:text-indigo-600 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {suggestion.label}
              </button>
            ))}
          </div>

          {/* Character/Word Counter Info bar */}
          {wordCount > 0 && (
            <div className="flex justify-between items-center px-4 py-1 text-[10px] text-slate-400 bg-white border-t border-slate-50">
              <span className="flex items-center gap-1">
                {wordCount > 60 && <AlertCircle size={10} className="text-red-500" />}
                {wordCount > 60 ? "Word limit exceeded" : "Max 60 words limit"}
              </span>
              <span className={wordCount > 60 ? "text-red-500 font-semibold" : wordCount > 50 ? "text-amber-500 font-medium" : ""}>
                {wordCount}/60 words
              </span>
            </div>
          )}

          {/* Chat Form */}
          <form
            onSubmit={(e) => handleSendMessage(e)}
            className="flex gap-2 border-t border-slate-100 bg-white p-3.5"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim() || wordCount > 60}
              className="rounded-xl bg-indigo-600 p-2.5 text-white transition hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Chat Trigger Button */}
      <div className="relative">
        {badgeVisible && !isOpen && (
          <div className="absolute -top-12 right-0 hidden md:block whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg animate-bounce">
            Ask Ashar's AI! 👋
            <span className="absolute bottom-0 right-5 h-2 w-2 translate-y-1/2 rotate-45 bg-slate-900"></span>
          </div>
        )}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setBadgeVisible(false);
          }}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          {/* Pulsing glow background */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 opacity-20 blur-sm group-hover:opacity-40 transition-opacity animate-pulse"></span>

          <span className="relative z-10">
            {isOpen ? (
              <X size={22} className="transition-transform duration-300" />
            ) : (
              <MessageSquare
                size={22}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            )}
          </span>

          {badgeVisible && !isOpen && (
            <span className="absolute -top-0.5 -right-0.5 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
              <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-75"></span>
              <span className="relative">1</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default AIChatbot;
