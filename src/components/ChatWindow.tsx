import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';
import { aiService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import { useRoadmapProgress } from '../hooks/useRoadmapProgress';

const SUGGESTED_PROMPTS = [
  'Explain the difference between AI Engineer and ML Engineer',
  'What should I learn next based on my roadmap progress?',
  'Suggest a beginner project for my skill level',
  'Help me understand Gradient Descent & Backpropagation intuitively',
  'How do I prepare for 3rd-year internship technical rounds?',
  'Recommend resources for my current learning module',
];

export const ChatWindow: React.FC = () => {
  const { user, studentPrefs } = useAuth();
  const { progressSummary, roadmap } = useRoadmapProgress();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: `👋 Hello ${user?.fullName || 'there'}! I'm your **SkillBridge AI Career Assistant**.

I'm loaded with context about your **${studentPrefs?.academicYear || '2nd Year'}** curriculum targeting **${studentPrefs?.careerTrack || 'Machine Learning Engineer'}**.

You've completed **${progressSummary.completedRequired} of ${progressSummary.totalRequired} required topics (${progressSummary.percentage}%)**. How can I help you accelerate your technical learning today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const studentContext = {
      name: user?.fullName || 'Student',
      year: studentPrefs?.academicYear || '2nd Year',
      careerTrack: studentPrefs?.careerTrack || 'Machine Learning Engineer',
      currentModule: roadmap.modules[0]?.title || 'Machine Learning Foundations',
      completedTopicsCount: progressSummary.completedRequired,
      totalTopicsCount: progressSummary.totalRequired,
    };

    const res = await aiService.sendMessage(textToSend, messages, studentContext);

    const botMessage: ChatMessage = {
      id: 'bot-' + Date.now(),
      role: 'assistant',
      content: res.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDemo: res.isDemo,
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'msg-cleared',
        role: 'assistant',
        content: `Conversation reset. Ask me anything about your ${studentPrefs?.careerTrack || 'AI/ML'} roadmap, project architectures, or concepts!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[750px] rounded-2xl bg-white dark:bg-zinc-900/90 border border-rose-200/80 dark:border-zinc-800 shadow-sm dark:shadow-2xl overflow-hidden transition-colors">
      {/* Header */}
      <div className="p-4 bg-rose-50/70 dark:bg-zinc-950/80 border-b border-rose-200/80 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white shadow-md shadow-rose-950/30">
            <Bot className="w-5 h-5 text-rose-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#27272A] dark:text-zinc-100">AI Career Assistant</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800/60">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[11px] text-[#76516B] dark:text-zinc-400">
              Context: {studentPrefs?.academicYear} • {studentPrefs?.careerTrack} • {progressSummary.percentage}% Completed
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={clearChat}
          className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-[#9F1239] dark:hover:text-rose-300 hover:bg-rose-100/60 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
          title="Reset Chat History"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Suggested Chips */}
      <div className="px-4 py-2 bg-rose-50/40 dark:bg-zinc-950/40 border-b border-rose-200/60 dark:border-zinc-800/80 overflow-x-auto flex gap-2 no-scrollbar">
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full bg-white dark:bg-zinc-800/80 hover:bg-rose-100/60 dark:hover:bg-zinc-800 text-[#76516B] dark:text-zinc-300 hover:text-[#9F1239] dark:hover:text-rose-200 border border-rose-200/80 dark:border-zinc-700/60 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3 h-3 text-[#9F1239] dark:text-rose-400" />
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-4 h-4 text-rose-200" />
              </div>
            )}

            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'gradient-brand text-white shadow-md shadow-rose-950/20 dark:shadow-rose-950/40 rounded-tr-none'
                  : 'bg-rose-50/60 dark:bg-zinc-800/90 border border-rose-200/80 dark:border-zinc-700/70 text-[#27272A] dark:text-zinc-200 shadow-xs rounded-tl-none'
              }`}
            >
              {/* Formatted body */}
              <div className="whitespace-pre-wrap font-sans space-y-2">
                {msg.content}
              </div>

              <div
                className={`mt-2 pt-1.5 flex items-center justify-between text-[10px] ${
                  msg.role === 'user' ? 'text-rose-200/80' : 'text-zinc-500 dark:text-zinc-400 border-t border-rose-200/60 dark:border-zinc-700/50'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2">
                    {msg.isDemo && (
                      <span className="text-amber-600 dark:text-amber-400 font-medium">Demo Guidance</span>
                    )}
                    <button
                      type="button"
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="hover:text-[#9F1239] dark:hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-[#9F1239] dark:bg-zinc-800 border border-rose-200 dark:border-zinc-700 flex items-center justify-center dark:text-zinc-300 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white shrink-0 mt-0.5">
              <Bot className="w-4 h-4 text-rose-200 animate-pulse" />
            </div>
            <div className="bg-rose-50/60 dark:bg-zinc-800/90 border border-rose-200/80 dark:border-zinc-700/70 rounded-2xl rounded-tl-none p-4 text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#9F1239] dark:text-rose-400" />
              <span>Analyzing your roadmap curriculum and formulating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white dark:bg-zinc-950/80 border-t border-rose-200/80 dark:border-zinc-800 transition-colors">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about concepts, code snippets, project architectures, or career decisions..."
            className="flex-1 bg-rose-50/40 dark:bg-zinc-900 border border-rose-200/80 dark:border-zinc-700/80 focus:border-[#9F1239] dark:focus:border-rose-500 rounded-xl px-4 py-3 text-xs md:text-sm text-[#27272A] dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="gradient-brand text-white p-3 rounded-xl hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-rose-950/20 dark:shadow-rose-950/40 shrink-0 flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
