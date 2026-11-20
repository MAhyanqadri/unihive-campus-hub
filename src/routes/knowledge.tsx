import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader, Panel, Pill } from "@/components/app/ui-bits";
import { knowledge, type Knowledge } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/knowledge")({
  head: () => meta("Knowledge Base", "Search concepts, definitions and requirements extracted from your documents."),
  component: KnowledgeBase,
});

const cats = ["All", "Concept", "Definition", "Formula", "Requirement", "Decision", "Summary"] as const;

function KnowledgeBase() {
  const { docs } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const items = knowledge.filter((k: Knowledge) => (cat === "All" || k.category === cat) && `${k.title} ${k.content}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Knowledge Base" subtitle={`${knowledge.length} items extracted from your course and project documents.`} />
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search e.g. regularisation, Five Forces, 3NF…" className="h-11 pl-10" />
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={cn("rounded-full border px-3 py-1 text-xs transition-colors", cat === c ? "border-primary bg-primary/15" : "text-muted-foreground hover:text-foreground")}>{c}</button>)}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((k) => {
          const doc = docs.find((d) => d.id === k.sourceDocId);
          return (
            <Panel key={k.id}>
              <div className="flex items-center justify-between"><Pill tone="violet">{k.category}</Pill><span className="text-xs text-muted-foreground">{k.date}</span></div>
              <h3 className="mt-3 font-semibold">{k.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{k.content}</p>
              <div className="mt-4 flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground"><FileText className="h-3.5 w-3.5 text-primary" />{doc?.name}</div>
            </Panel>
          );
        })}
      </div>
      {!items.length && <p className="py-16 text-center text-sm text-muted-foreground">No knowledge matches “{q}”.</p>}
    </>
  );
}
