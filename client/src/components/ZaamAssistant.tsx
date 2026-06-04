import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Send, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Msg {
  role: "user" | "zaam";
  text: string;
  suggestions?: string[];
}

export function ZaamAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "zaam",
      text: "Hi, I'm Zaam — your Kugoo food assistant! 🍔 Ask me to recommend meals, find restaurants, or track an order.",
      suggestions: ["Recommend food", "Show nearby restaurants", "Today's promotion"],
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/zaam", { message: text });
      setMessages((m) => [...m, { role: "zaam", text: res.reply, suggestions: res.suggestions }]);
    } catch {
      setMessages((m) => [...m, { role: "zaam", text: "Sorry, I had trouble responding. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-kugoo-orange text-white shadow-glow"
        aria-label="Open Zaam assistant"
      >
        {open ? <X className="h-7 w-7" /> : <Sparkles className="h-7 w-7" />}
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-kugoo-orange/40" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-5 z-50 flex h-[32rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center gap-3 bg-kugoo-green px-5 py-4 text-white">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-kugoo-orange">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display font-600">Zaam</p>
                <p className="text-xs text-white/70">Kugoo AI Assistant</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-kugoo-nude-light p-4">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className="max-w-[85%]">
                    <div
                      className={
                        m.role === "user"
                          ? "rounded-2xl rounded-br-sm bg-kugoo-orange px-4 py-2.5 text-sm text-white"
                          : "whitespace-pre-line rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-sm text-kugoo-ink shadow-sm"
                      }
                    >
                      {m.text}
                    </div>
                    {m.suggestions && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.suggestions.map((s) => (
                          <button
                            key={s}
                            onClick={() => send(s)}
                            className="rounded-full border border-kugoo-green/20 bg-white px-3 py-1 text-xs font-semibold text-kugoo-green hover:bg-kugoo-nude"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl bg-white px-4 py-3 shadow-sm">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-kugoo-green/50" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-2 border-t border-kugoo-nude-dark bg-white p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Zaam anything..."
                className="flex-1 rounded-full bg-kugoo-nude-light px-4 py-2.5 text-sm outline-none"
              />
              <button type="submit" disabled={loading} className="grid h-10 w-10 place-items-center rounded-full bg-kugoo-orange text-white disabled:opacity-50">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
