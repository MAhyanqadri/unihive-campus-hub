import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Upload, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { PageHeader, Panel, DocRow, Pill } from "@/components/app/ui-bits";
import { useStore } from "@/lib/store";
import type { Course, Doc } from "@/lib/data";
import { cn } from "@/lib/utils";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/courses")({
  head: () => meta("My Courses", "Create courses and upload lecture notes and PDFs for AI-assisted learning."),
  component: Courses,
});

const colors: Course["color"][] = ["primary", "violet", "success", "warning"];
const bar = { primary: "bg-primary", violet: "bg-violet", success: "bg-success", warning: "bg-warning" };

function NewCourse() {
  const { addCourse } = useStore();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ code: "", title: "", lecturer: "" });
  const submit = () => {
    if (!f.code.trim() || !f.title.trim()) { toast.error("Add a course code and title"); return; }
    addCourse({ ...f, term: "Autumn 2026", color: colors[Math.floor(Math.random() * 4)]! });
    toast.success(`${f.code} created`);
    setF({ code: "", title: "", lecturer: "" }); setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="brand"><Plus /> New course</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create course</DialogTitle></DialogHeader>
        <div className="space-y-3">
          {(["code", "title", "lecturer"] as const).map((k) => (
            <div key={k} className="space-y-1.5"><Label className="capitalize">{k}</Label><Input value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} placeholder={k === "code" ? "CS3001" : k === "title" ? "Computer Vision" : "Dr. Jane Doe"} /></div>
          ))}
        </div>
        <DialogFooter><Button variant="brand" onClick={submit}>Create</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Courses() {
  const { courses, docs, addDoc } = useStore();
  const [sel, setSel] = useState(courses[0]?.id ?? "");
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const course = courses.find((c) => c.id === sel) ?? courses[0];
  const courseDocs = docs.filter((d) => d.courseId === course?.id);

  const upload = (files: FileList | null) => {
    if (!files || !course) return;
    Array.from(files).forEach((file) => {
      const type: Doc["type"] = file.name.endsWith(".pdf") ? "pdf" : /\.(pptx?|key)$/.test(file.name) ? "slides" : "notes";
      addDoc({ name: file.name, type, size: `${(file.size / 1024 / 1024).toFixed(1)} MB`, courseId: course.id, pages: Math.max(1, Math.round(file.size / 60000)) });
    });
    toast.success(`${files.length} file(s) uploaded — Knowledge Agent is extracting key ideas`);
  };

  return (
    <>
      <PageHeader title="My Courses" subtitle="Your modules, lecture materials and study progress." action={<NewCourse />} />
      <div className="stagger mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {courses.map((c) => (
          <button key={c.id} onClick={() => setSel(c.id)} className={cn("surface p-5 text-left transition-all hover:-translate-y-0.5", course?.id === c.id && "ring-2 ring-primary shadow-glow")}>
            <div className={cn("mb-4 h-1.5 w-10 rounded-full", bar[c.color])} />
            <Pill tone={c.color}>{c.code}</Pill>
            <div className="mt-2 font-display font-semibold">{c.title}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><User className="h-3 w-3" />{c.lecturer || "—"}</div>
            <div className="mt-4 flex items-center gap-2"><Progress value={c.progress} className="h-1.5" /><span className="text-xs text-muted-foreground">{c.progress}%</span></div>
            <div className="mt-2 text-xs text-muted-foreground">{docs.filter((d) => d.courseId === c.id).length} documents</div>
          </button>
        ))}
      </div>
      {course && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel title={`${course.code} · Materials`} className="lg:col-span-2">
            {courseDocs.length ? <div className="space-y-1">{courseDocs.map((d) => <DocRow key={d.id} doc={d} />)}</div> : <p className="py-8 text-center text-sm text-muted-foreground">No materials yet. Upload your first lecture.</p>}
          </Panel>
          <Panel title="Upload lecture material">
            <div
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files); }}
              onClick={() => input.current?.click()}
              className={cn("grid cursor-pointer place-items-center rounded-xl border-2 border-dashed p-8 text-center transition-colors", drag ? "border-primary bg-primary/10" : "hover:border-primary/60")}
            >
              <Upload className="mb-3 h-6 w-6 text-primary" />
              <div className="text-sm font-medium">Drop PDFs, slides or notes</div>
              <div className="mt-1 text-xs text-muted-foreground">or click to browse</div>
              <input ref={input} type="file" multiple accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.md" className="hidden" onChange={(e) => upload(e.target.files)} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Files are analysed by the Knowledge Agent and added to your Knowledge Base.</p>
          </Panel>
        </div>
      )}
    </>
  );
}
