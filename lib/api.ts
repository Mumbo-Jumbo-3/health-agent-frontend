const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface StreamChatOptions {
  message: string;
  sessionId: string | null;
  onToken: (token: string) => void;
  onDone: (sessionId: string) => void;
  onError: (error: Error) => void;
  signal?: AbortSignal;
}

export async function streamChat({
  message,
  sessionId,
  onToken,
  onDone,
  onError,
  signal,
}: StreamChatOptions): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, session_id: sessionId }),
      signal,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n").map((l) => l.replace(/\r$/, ""));
      buffer = lines.pop() || "";

      let currentEvent = "";
      for (const line of lines) {
        if (line.startsWith("event:")) {
          currentEvent = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          const data = line.startsWith("data: ") ? line.slice(6) : line.slice(5);
          if (currentEvent === "token") {
            onToken(data.replace(/\\n/g, "\n"));
          } else if (currentEvent === "done") {
            try {
              const parsed = JSON.parse(data);
              onDone(parsed.session_id);
            } catch {
              onDone(data);
            }
          }
          currentEvent = "";
        }
      }
    }
  } catch (err) {
    if ((err as Error).name === "AbortError") return;
    onError(err as Error);
  }
}
