import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Brain, FileText, FolderKanban, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, Stat, DocRow, Pill, Initials } from "@/components/app/ui-bits";
import { useStore } from "@/lib/store";
import { activity, agents, knowledge } from "@/lib/data";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/")({
  head: () => meta("Dashboard", "Your UniHive workspace: courses, group projects, knowledge and AI agents at a glance."),
  component: Dashboard,
});

const statusTone = { active: "success", processing: "primary", idle: "muted" } as const;

function Dashboard() {
  const { docs, courses, projects } = useStore();
  const openTasks = projects.flatMap((p) => p.tasks).filter((t) => t.status !== "done").length;
  return (
    <>
      <div className="surface relative mb-8 overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 bg-glow opacity-80" />
        <div className="absolute -right-20 -top-20 h-64 w-64 animate-pulse rounded-full bg-lilac blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-56 w-56 animate-pulse rounded-full bg-sun blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-sun px-3 py-1 text-xs font-medium">Friday, 20 November · Autumn term</span>
            <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Welcome back, <em>Ahyan</em></h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">You have {openTasks} open tasks across {projects.length} projects. The Review Agent flagged one item for your Market Entry report.</p>
          </div>
          <Button variant="brand" size="lg" asChild><Link to="/chat"><MessageSquareText /> Ask UniHive</Link></Button>
        </div>
      </div>

      <div className="stagger mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Courses" value={courses.length} icon={<FileText className="h-4 w-4" />} hint="Autumn 2026" />
        <Stat label="Documents" value={docs.length} icon={<FileText className="h-4 w-4" />} hint="+3 this week" tone="violet" />
        <Stat label="Knowledge items" value={knowledge.length} icon={<Brain className="h-4 w-4" />} hint="+6 extracted today" />
        <Stat label="Active projects" value={projects.length} icon={<FolderKanban className="h-4 w-4" />} tone="violet" hint="2 due in December" />
      </div>

      <div className="stagger grid gap-6 lg:grid-cols-3">
        <Panel title="Recent documents" className="lg:col-span-2" action={<Link to="/courses" className="text-xs text-primary">View all</Link>}>
          <div className="space-y-1">{docs.slice(0, 5).map((d) => <DocRow key={d.id} doc={d} />)}</div>
        </Panel>
        <Panel title="Active agents" action={<Link to="/agents" className="text-xs text-primary">Monitor</Link>}>
          <div className="space-y-3">
            {agents.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-lg border p-3 transition-all hover:border-violet/50 hover:bg-violet/5">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-violet"><Bot className="h-4 w-4" /></div>
                <div className="flex-1"><div className="text-sm font-medium">{a.name}</div><div className="text-xs text-muted-foreground">{a.tasksToday} tasks today</div></div>
                <Pill tone={statusTone[a.status]}>{a.status}</Pill>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Latest knowledge" className="lg:col-span-2" action={<Link to="/knowledge" className="text-xs text-primary">Knowledge Base</Link>}>
          <div className="grid gap-3 sm:grid-cols-2">
            {knowledge.slice(0, 4).map((k) => (
              <div key={k.id} className="rounded-lg border p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5">
                <Pill tone="violet">{k.category}</Pill>
                <div className="mt-2 text-sm font-medium">{k.title}</div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{k.content}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Recent activity">
          <ol className="space-y-4">
            {activity.map((a) => (
              <li key={a.id} className="flex gap-3">
                <Initials name={a.who} className="h-7 w-7 text-[10px]" />
                <div className="text-sm"><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.action}</span> {a.target}<div className="text-xs text-muted-foreground">{a.time}</div></div>
              </li>
            ))}
          </ol>
          <Link to="/projects" className="mt-4 inline-flex items-center gap-1 text-xs text-primary">Open projects <ArrowRight className="h-3 w-3" /></Link>
        </Panel>
      </div>
    </>
  );
}
