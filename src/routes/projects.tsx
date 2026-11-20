import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, Circle, Gavel, ListChecks, Plus, Timer, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader, Panel, Pill, Initials, DocRow } from "@/components/app/ui-bits";
import { useStore } from "@/lib/store";
import { knowledge, type Task } from "@/lib/data";
import { cn } from "@/lib/utils";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/projects")({
  head: () => meta("Group Projects", "Shared workspaces for coursework requirements, tasks, team knowledge and decisions."),
  component: Projects,
});

const cols: { key: Task["status"]; label: string; icon: typeof Circle }[] = [
  { key: "todo", label: "To do", icon: Circle },
  { key: "doing", label: "In progress", icon: Timer },
  { key: "done", label: "Done", icon: CheckCircle2 },
];
const next: Record<Task["status"], Task["status"]> = { todo: "doing", doing: "done", done: "todo" };

function NewProject({ onCreated }: { onCreated: (id: string) => void }) {
  const { courses, addProject } = useStore();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", courseId: courses[0]?.id ?? "", deadline: "" });
  const submit = () => {
    if (!f.name.trim()) { toast.error("Give the project a name"); return; }
    onCreated(addProject({ ...f, deadline: f.deadline || "2026-12-20" }));
    toast.success("Workspace created"); setOpen(false); setF({ ...f, name: "" });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="brand"><Plus /> New workspace</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create project workspace</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5"><Label>Project name</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Sustainability audit" /></div>
          <div className="space-y-1.5"><Label>Course</Label>
            <Select value={f.courseId} onValueChange={(v) => setF({ ...f, courseId: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.code} · {c.title}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Deadline</Label><Input type="date" value={f.deadline} onChange={(e) => setF({ ...f, deadline: e.target.value })} /></div>
        </div>
        <DialogFooter><Button variant="brand" onClick={submit}>Create</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Projects() {
  const { projects, courses, docs, addTask, setTaskStatus, addDecision } = useStore();
  const [sel, setSel] = useState(projects[0]?.id ?? "");
  const [task, setTask] = useState("");
  const [dec, setDec] = useState({ title: "", detail: "" });
  const p = projects.find((x) => x.id === sel) ?? projects[0];
  if (!p) return null;
  const course = courses.find((c) => c.id === p.courseId);
  const done = p.tasks.filter((t) => t.status === "done").length;

  return (
    <>
      <PageHeader title="Group Projects" subtitle="Collaborative workspaces for your coursework teams." action={<NewProject onCreated={setSel} />} />
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {projects.map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)} className={cn("shrink-0 rounded-full border px-4 py-2 text-sm transition-colors", x.id === p.id ? "border-primary bg-primary/15 text-foreground" : "text-muted-foreground hover:text-foreground")}>{x.name}</button>
        ))}
      </div>

      <div className="surface mb-6 flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Pill tone="primary">{course?.code}</Pill>
          <h2 className="mt-2 text-xl font-semibold">{p.name}</h2>
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> Due {p.deadline}</span>
            <span className="flex items-center gap-1"><ListChecks className="h-3.5 w-3.5" /> {done}/{p.tasks.length} tasks done</span>
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {p.members.length} members</span>
          </div>
        </div>
        <div className="flex -space-x-2">{p.members.map((m) => <Initials key={m} name={m} />)}</div>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList className="mb-4"><TabsTrigger value="tasks">Tasks</TabsTrigger><TabsTrigger value="requirements">Requirements</TabsTrigger><TabsTrigger value="knowledge">Team knowledge</TabsTrigger><TabsTrigger value="decisions">Decisions</TabsTrigger></TabsList>

        <TabsContent value="tasks">
          <form className="mb-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!task.trim()) return; addTask(p.id, { title: task, assignee: "Ahyan Qadri", due: p.deadline }); setTask(""); }}>
            <Input value={task} onChange={(e) => setTask(e.target.value)} placeholder="Add a task…" /><Button type="submit" variant="brand"><Plus /> Add</Button>
          </form>
          <div className="grid gap-4 md:grid-cols-3">
            {cols.map((c) => (
              <Panel key={c.key} title={`${c.label} · ${p.tasks.filter((t) => t.status === c.key).length}`}>
                <div className="space-y-2">
                  {p.tasks.filter((t) => t.status === c.key).map((t) => (
                    <button key={t.id} onClick={() => setTaskStatus(p.id, t.id, next[t.status])} className="w-full rounded-lg border bg-background/40 p-3 text-left transition-colors hover:border-primary/60">
                      <div className="flex items-start gap-2"><c.icon className={cn("mt-0.5 h-4 w-4 shrink-0", c.key === "done" ? "text-success" : c.key === "doing" ? "text-primary" : "text-muted-foreground")} /><span className={cn("text-sm", c.key === "done" && "text-muted-foreground line-through")}>{t.title}</span></div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground"><span>{t.assignee}</span><span>{t.due.slice(5)}</span></div>
                    </button>
                  ))}
                </div>
              </Panel>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Tip: click a task to move it to the next stage.</p>
        </TabsContent>

        <TabsContent value="requirements">
          <Panel title="Coursework requirements">
            {p.requirements.length ? <ul className="space-y-3">{p.requirements.map((r) => <li key={r} className="flex gap-3 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{r}</li>)}</ul> : <p className="text-sm text-muted-foreground">Upload the coursework brief and the Knowledge Agent will extract the requirements.</p>}
            <div className="mt-5 space-y-1 border-t pt-4">{docs.filter((d) => d.projectId === p.id).map((d) => <DocRow key={d.id} doc={d} />)}</div>
          </Panel>
        </TabsContent>

        <TabsContent value="knowledge">
          <div className="grid gap-4 sm:grid-cols-2">
            {knowledge.filter((k) => p.knowledge.includes(k.id)).map((k) => (
              <Panel key={k.id}><Pill tone="violet">{k.category}</Pill><div className="mt-2 font-medium">{k.title}</div><p className="mt-1 text-sm text-muted-foreground">{k.content}</p></Panel>
            ))}
            {!p.knowledge.length && <p className="text-sm text-muted-foreground">No shared knowledge yet.</p>}
          </div>
        </TabsContent>

        <TabsContent value="decisions">
          <div className="grid gap-6 lg:grid-cols-3">
            <Panel title="Decision log" className="lg:col-span-2">
              <ol className="space-y-4">
                {p.decisions.map((d) => (
                  <li key={d.id} className="flex gap-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet/15 text-violet"><Gavel className="h-4 w-4" /></div><div><div className="text-sm font-medium">{d.title}</div><p className="text-sm text-muted-foreground">{d.detail}</p><div className="mt-1 text-xs text-muted-foreground">{d.by} · {d.date}</div></div></li>
                ))}
                {!p.decisions.length && <p className="text-sm text-muted-foreground">No decisions logged yet.</p>}
              </ol>
            </Panel>
            <Panel title="Log a decision">
              <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (!dec.title.trim()) return; addDecision(p.id, dec.title, dec.detail); setDec({ title: "", detail: "" }); toast.success("Decision logged"); }}>
                <Input value={dec.title} onChange={(e) => setDec({ ...dec, title: e.target.value })} placeholder="What did the team decide?" />
                <Textarea value={dec.detail} onChange={(e) => setDec({ ...dec, detail: e.target.value })} placeholder="Why?" rows={3} />
                <Button type="submit" variant="brand" className="w-full">Save decision</Button>
              </form>
            </Panel>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
