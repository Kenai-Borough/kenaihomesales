'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Brain, Sparkles, Send, X, ChevronDown, Loader2 } from 'lucide-react';
import {
  streamComplete,
  isAvailable,
  buildSystemPrompt,
  type ChatMessage,
} from '../../lib/llm-client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ContextType = 'property' | 'vehicle' | 'land' | 'listing';

interface AdvisorContext {
  type: ContextType;
  data: any;
}

interface TransactionAdvisorProps {
  context?: AdvisorContext;
  transactionId?: string;
  userRole?: 'buyer' | 'seller';
}

interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BASE_SYSTEM_PROMPT = `You are the Kenai Borough Network AI Advisor, a knowledgeable assistant specializing in Alaska real estate, land transactions, vehicle sales, and property law. You help buyers and sellers on the Kenai Peninsula navigate direct sales without traditional agents.

Your expertise includes:
- Alaska real estate disclosure requirements
- Property valuation factors for the Kenai Peninsula
- Title search and clear title processes
- Escrow procedures and buyer protection
- Vehicle title transfer in Alaska
- DMV requirements for vehicle sales
- Borough zoning and land use regulations
- Closing costs estimation
- Inspection recommendations
- Fair Housing Act compliance

Always be helpful, professional, and encourage users to verify critical information with licensed professionals when appropriate. You are an advisor, not a lawyer or licensed agent.`;

const QUICK_ACTIONS: Record<ContextType | 'default', { label: string; prompt: string }[]> = {
  property: [
    { label: 'Estimate value', prompt: 'Can you help me estimate the value of this property based on what you see?' },
    { label: 'Disclosures needed?', prompt: 'What disclosures are required for selling residential property in Alaska?' },
    { label: 'Review closing costs', prompt: 'What are the typical closing costs for a property transaction on the Kenai Peninsula?' },
  ],
  vehicle: [
    { label: 'Fair market price', prompt: 'How can I check the fair market value for this vehicle?' },
    { label: 'Paperwork needed?', prompt: 'What paperwork do I need for a private vehicle sale in Alaska?' },
    { label: 'Transfer fees', prompt: 'What are the title transfer fees and taxes for a vehicle sale in Alaska?' },
  ],
  land: [
    { label: 'Explain zoning', prompt: 'Can you explain the zoning regulations that might apply to this land parcel?' },
    { label: 'Title search checklist', prompt: 'What does a title search involve and what should I look for?' },
    { label: 'Survey requirements', prompt: 'When is a land survey required and what does it typically cost on the Kenai Peninsula?' },
  ],
  listing: [
    { label: 'Current status', prompt: 'Can you explain the current status of this listing and what it means?' },
    { label: 'What happens next?', prompt: 'What are the next steps in this transaction process?' },
    { label: 'Estimate timeline', prompt: 'How long does a typical transaction like this take to close?' },
  ],
  default: [
    { label: 'How does this work?', prompt: 'How does buying or selling directly on the Kenai Borough Network work?' },
    { label: 'What fees apply?', prompt: 'What fees and costs should I expect when buying or selling on this platform?' },
    { label: 'Get started', prompt: 'I\'m new here. What should I know before listing or buying?' },
  ],
};

// ---------------------------------------------------------------------------
// Markdown renderer (lightweight)
// ---------------------------------------------------------------------------

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    let node: React.ReactNode;

    if (line.startsWith('### ')) {
      node = <h4 key={i} className="font-semibold text-sm text-cyan-300 mt-2 mb-1">{line.slice(4)}</h4>;
    } else if (line.startsWith('## ')) {
      node = <h3 key={i} className="font-semibold text-base text-cyan-200 mt-3 mb-1">{line.slice(3)}</h3>;
    } else if (line.startsWith('# ')) {
      node = <h2 key={i} className="font-bold text-lg text-cyan-100 mt-3 mb-1">{line.slice(2)}</h2>;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      node = (
        <li key={i} className="ml-4 list-disc text-slate-200 text-sm leading-relaxed">
          {renderInline(line.slice(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const content = line.replace(/^\d+\.\s/, '');
      node = (
        <li key={i} className="ml-4 list-decimal text-slate-200 text-sm leading-relaxed">
          {renderInline(content)}
        </li>
      );
    } else if (line.trim() === '') {
      node = <div key={i} className="h-2" />;
    } else {
      node = <p key={i} className="text-slate-200 text-sm leading-relaxed">{renderInline(line)}</p>;
    }

    elements.push(node);
  });

  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TransactionAdvisor({
  context,
  transactionId,
  userRole,
}: TransactionAdvisorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [online, setOnline] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Health check on mount & periodically
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const ok = await isAvailable();
      if (!cancelled) setOnline(ok);
    };
    check();
    const interval = setInterval(check, 30_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Build full system prompt with context
  const systemPrompt = React.useMemo(() => {
    let prompt = BASE_SYSTEM_PROMPT;
    if (userRole) prompt += `\n\nThe user is a ${userRole}.`;
    if (transactionId) prompt += `\nTransaction ID: ${transactionId}`;
    return buildSystemPrompt(prompt, context);
  }, [context, transactionId, userRole]);

  // Determine which quick actions to show
  const quickActions = QUICK_ACTIONS[context?.type ?? 'default'];

  // --------------------------------------------------
  // Send a message and stream the response
  // --------------------------------------------------
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: DisplayMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      const assistantMsg: DisplayMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput('');
      setIsStreaming(true);

      // Build chat history for the API
      const history: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        { role: 'user' as const, content: text.trim() },
      ];

      try {
        for await (const chunk of streamComplete(history)) {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === 'assistant') {
              updated[updated.length - 1] = { ...last, content: last.content + chunk };
            }
            return updated;
          });
        }
      } catch (err) {
        console.error('Stream error:', err);
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === 'assistant' && !last.content) {
            updated[updated.length - 1] = {
              ...last,
              content: 'AI advisor is offline, please proceed manually.',
            };
          }
          return updated;
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, messages, systemPrompt],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // --------------------------------------------------
  // Status indicator dot
  // --------------------------------------------------
  const statusDot = (
    <span
      className={`inline-block h-2 w-2 rounded-full ${
        online === null ? 'bg-yellow-400 animate-pulse' : online ? 'bg-emerald-400' : 'bg-red-400'
      }`}
      title={online === null ? 'Checking…' : online ? 'Online' : 'Offline'}
    />
  );

  // --------------------------------------------------
  // Collapsed trigger button
  // --------------------------------------------------
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full
                   bg-slate-900/90 backdrop-blur-xl border border-white/10
                   px-5 py-3 text-sm font-medium text-slate-100 shadow-lg shadow-black/40
                   hover:border-cyan-500/30 hover:shadow-cyan-900/20 transition-all duration-300"
      >
        <Brain className="h-5 w-5 text-cyan-400" />
        <span>Kenai AI Advisor</span>
        {statusDot}
      </button>
    );
  }

  // --------------------------------------------------
  // Expanded panel
  // --------------------------------------------------
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col w-[380px] max-h-[600px]
                 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10
                 shadow-2xl shadow-black/50 animate-in slide-in-from-bottom-4 duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <h2 className="text-sm font-semibold text-slate-100">Kenai AI Advisor</h2>
          {statusDot}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Minimize"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            onClick={() => { setIsOpen(false); setMessages([]); }}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[200px] max-h-[400px]">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Brain className="h-10 w-10 text-cyan-500/40 mx-auto mb-3" />
            <p className="text-sm text-slate-400">
              Ask me anything about Kenai Peninsula real estate, land, or vehicle transactions.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-slate-700/80 text-slate-100 rounded-br-sm'
                  : 'bg-cyan-950/40 border border-cyan-500/10 text-slate-200 rounded-bl-sm'
              }`}
            >
              {msg.role === 'assistant' ? (
                msg.content ? (
                  renderMarkdown(msg.content)
                ) : (
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Thinking…
                  </span>
                )
              ) : (
                <span>{msg.content}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      {messages.length === 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => sendMessage(action.prompt)}
              disabled={isStreaming || !online}
              className="rounded-full px-3 py-1 text-xs font-medium
                         bg-slate-800/80 border border-white/5 text-cyan-300
                         hover:bg-cyan-950/50 hover:border-cyan-500/20
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-colors duration-200"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-3 py-3 border-t border-white/5">
        <div className="flex items-center gap-2 rounded-xl bg-slate-800/60 border border-white/5 px-3 py-1.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={online ? 'Ask about your transaction…' : 'Advisor offline'}
            disabled={isStreaming || !online}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500
                       outline-none disabled:cursor-not-allowed"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming || !online}
            className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10
                       disabled:text-slate-600 disabled:hover:bg-transparent
                       transition-colors"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        {!online && online !== null && (
          <p className="text-xs text-red-400/80 mt-1.5 px-1">
            AI advisor is offline, please proceed manually.
          </p>
        )}
      </div>
    </div>
  );
}
