import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpenCheck, CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { PageHeader, Panel, Pill } from "@/components/app/ui-bits";
import { agentMessages, agents, type AgentId } from "@/lib/data";
import { cn } from "@/lib/utils";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/agents")({
  head: () => meta("AI Agents", "Monitor the Knowledge, Collaboration and Review agents working across your workspace."),
  component: Agents,
});

const icons = { knowledge: BookOpenCheck, collaboration: Users, review: ShieldCheck };
const tint = { knowledge: "text-primary bg-primary/15", collaboration: "text-violet bg-violet/15", review: "text-success bg-success/15" };
const statusTone = { active: "success", processing: "primary", idle: "muted" } as const;
const name = (id: AgentId | "user") => (id === "user" ? "You" : agents.find((a) => a.id === id)!.name);

function Agents() {
  return (
    <>
      <PageHeader title="AI Agents" subtitle="Three specialised agents collaborate to keep your learning and group work on track." />
      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        {agents.map((a) => {
          const Icon = icons[a.id];
          return (
            <Panel key={a.id} className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className={cn("grid h-11 w-11 place-items-center rounded-xl", tint[a.id])}><Icon className="h-5 w-5" /></div>
                <Pill tone={statusTone[a.status]}><span className={cn("h-1.5 w-1.5 rounded-full bg-current", a.status !== "idle" && "pulse-dot")} />{a.status}</Pill>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{a.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
              <ul className="mt-4 space-y-2">{a.responsibilities.map((r) => <li key={r} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{r}</li>)}</ul>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4">
                <div><div className="font-display text-xl font-semibold">{a.tasksToday}</div><div className="text-xs text-muted-foreground">Tasks today</div></div>
                <div><div className="font-display text-xl font-semibold">{a.accuracy}%</div><div className="text-xs text-muted-foreground">Accuracy</div></div>
              </div>
            </Panel>
          );
        })}
      </div>
      <Panel title="Communication history">
        <ol className="relative space-y-5 border-l pl-6">
          {agentMessages.map((m) => {
            const Icon = icons[m.from];
            return (
              <li key={m.id} className="relative">
                <div className={cn("absolute -left-[37px] grid h-7 w-7 place-items-center rounded-full ring-4 ring-card", tint[m.from])}><Icon className="h-3.5 w-3.5" /></div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"><span className="font-medium text-foreground">{name(m.from)}</span><ArrowRight className="h-3 w-3" /><span>{name(m.to)}</span><span>· {m.time}</span></div>
                <p className="mt-1 rounded-lg bg-background/50 p-3 text-sm">{m.text}</p>
              </li>
            );
          })}
        </ol>
      </Panel>
    </>
  );
}
