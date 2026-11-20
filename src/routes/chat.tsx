import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUp, FileText, Hexagon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Panel, Pill } from "@/components/app/ui-bits";
import { askUniHive } from "@/lib/ask";
import { docs, type Knowledge } from "@/lib/data";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/chat")({
  head: () => meta("Ask UniHive", "Ask questions about your course documents and group project knowledge, with sources."),
  component: Chat,
});

type Msg = { role: "user" | "assistant"; text: string; sources?: Knowledge[] };
const suggestions = ["How does gradient descent update parameters?", "What are Porter's Five Forces?", "What is the word limit for our market entry report?", "Explain loss aversion"];

function Bold({ text }: { text: string }) {
  return <>{text.split(/(\*\*[^*]+\*\*)/).map((p, i) => (p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>))}</>;
}

function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, busy]);
  const latestSources = [...msgs].reverse().find((m) => m.sources?.length)?.sources ?? [];

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    setMsgs((m) => [...m, { role: "user", text }]); setQ(""); setBusy(true);
    try {
      const a = await askUniHive(text);
      setMsgs((m) => [...m, { role: "assistant", text: a.text, sources: a.sources }]);
    } finally { setBusy(false); }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="surface flex h-[calc(100vh-10rem)] flex-col">
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {!msgs.length && (
            <div className="grid h-full place-items-center text-center">
              <div>
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand shadow-glow"><Hexagon className="h-6 w-6 text-primary-foreground" /></div>
                <h1 className="text-2xl font-semibold">Ask UniHive</h1>
                <p className="mt-1 text-sm text-muted-foreground">Answers grounded in your lecture notes and project knowledge.</p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">{suggestions.map((s) => <button key={s} onClick={() => send(s)} className="rounded-lg border p-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground">{s}</button>)}</div>
              </div>
            </div>
          )}
          {msgs.map((m, i) => m.role === "user" ? (
            <div key={i} className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">{m.text}</div>
          ) : (
            <div key={i} className="flex gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand"><Hexagon className="h-4 w-4 text-primary-foreground" /></div>
              <div className="max-w-[85%]">
                <p className="whitespace-pre-line text-sm leading-relaxed"><Bold text={m.text} /></p>
                {!!m.sources?.length && <div className="mt-3 flex flex-wrap gap-2">{m.sources.map((s, j) => <Pill key={s.id} tone="primary"><FileText className="h-3 w-3" />[{j + 1}] {docs.find((d) => d.id === s.sourceDocId)?.name}</Pill>)}</div>}
              </div>
            </div>
          ))}
          {busy && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Searching your documents…</div>}
          <div ref={end} />
        </div>
        <form className="border-t p-4" onSubmit={(e) => { e.preventDefault(); send(q); }}>
          <div className="relative">
            <Textarea value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(q); } }} placeholder="Ask about your courses or projects…" rows={2} className="resize-none pr-14" />
            <Button type="submit" size="icon" variant="brand" disabled={busy || !q.trim()} className="absolute bottom-2 right-2"><ArrowUp /></Button>
          </div>
        </form>
      </div>
      <Panel title="Sources" className="h-fit">
        {latestSources.length ? (
          <div className="space-y-3">
            {latestSources.map((s, i) => (
              <div key={s.id} className="rounded-lg border p-3">
                <div className="text-xs text-primary">[{i + 1}] {docs.find((d) => d.id === s.sourceDocId)?.name}</div>
                <div className="mt-1 text-sm font-medium">{s.title}</div>
                <p className="mt-1 text-xs text-muted-foreground">{s.content}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-muted-foreground">Sources for each answer appear here.</p>}
      </Panel>
    </div>
  );
}
