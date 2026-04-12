// Kenai Borough Network — Local LLM Client
// Connects to Qwen3.5-9B via llama-server (OpenAI-compatible API)

export interface LLMConfig {
  endpoint: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const DEFAULT_CONFIG: LLMConfig = {
  endpoint: 'http://localhost:8095/v1/chat/completions',
  model: 'qwen3.5-9b',
  maxTokens: 2048,
  temperature: 0.7,
};

const TIMEOUT_MS = 30_000;
const FALLBACK_MESSAGE =
  'AI advisor is offline, please proceed manually. If you need help, contact the Kenai Borough office directly.';

function mergeConfig(overrides?: Partial<LLMConfig>): LLMConfig {
  return { ...DEFAULT_CONFIG, ...overrides };
}

function buildRequestBody(
  messages: ChatMessage[],
  config: LLMConfig,
  stream: boolean,
) {
  return {
    model: config.model,
    messages,
    max_tokens: config.maxTokens,
    temperature: config.temperature,
    stream,
  };
}

/** Non-streaming completion — returns the full assistant reply. */
export async function complete(
  messages: ChatMessage[],
  config?: Partial<LLMConfig>,
): Promise<string> {
  const cfg = mergeConfig(config);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(cfg.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildRequestBody(messages, cfg, false)),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`LLM request failed: ${res.status} ${res.statusText}`);
      return FALLBACK_MESSAGE;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? FALLBACK_MESSAGE;
  } catch (err) {
    console.error('LLM completion error:', err);
    return FALLBACK_MESSAGE;
  }
}

/** Streaming completion — yields text chunks as they arrive via SSE. */
export async function* streamComplete(
  messages: ChatMessage[],
  config?: Partial<LLMConfig>,
): AsyncGenerator<string> {
  const cfg = mergeConfig(config);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(cfg.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildRequestBody(messages, cfg, true)),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    console.error('LLM stream connection error:', err);
    yield FALLBACK_MESSAGE;
    return;
  }

  clearTimeout(timeout);

  if (!res.ok || !res.body) {
    console.error(`LLM stream failed: ${res.status}`);
    yield FALLBACK_MESSAGE;
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const payload = trimmed.slice(6);
        if (payload === '[DONE]') return;

        try {
          const parsed = JSON.parse(payload);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) yield delta;
        } catch {
          // skip malformed SSE frames
        }
      }
    }
  } catch (err) {
    console.error('LLM stream read error:', err);
  } finally {
    reader.releaseLock();
  }
}

/** Returns true if the LLM server is reachable and healthy. */
export async function isAvailable(endpoint?: string): Promise<boolean> {
  const base = (endpoint ?? DEFAULT_CONFIG.endpoint).replace(
    /\/v1\/chat\/completions$/,
    '',
  );

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);
    const res = await fetch(`${base}/health`, { signal: controller.signal });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

/** Build a system prompt, optionally enriched with transaction context. */
export function buildSystemPrompt(
  basePrompt: string,
  context?: { type: string; data: any },
): string {
  if (!context) return basePrompt;

  const contextBlock = [
    `\n\nCurrent context — the user is viewing a ${context.type}:`,
    '```json',
    JSON.stringify(context.data, null, 2),
    '```',
    'Use this context to give specific, relevant advice.',
  ].join('\n');

  return basePrompt + contextBlock;
}
