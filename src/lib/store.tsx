import { createContext, useContext, useState, type ReactNode } from "react";
import * as seed from "./data";
import type { Course, Doc, Project, Task } from "./data";

// Client-side demo store. Replace these setters with Lovable Cloud queries/mutations later.
type Store = {
  courses: Course[]; docs: Doc[]; projects: Project[];
  addCourse: (c: Omit<Course, "id" | "progress">) => void;
  addDoc: (d: Omit<Doc, "id" | "uploadedAt">) => void;
  addProject: (p: Pick<Project, "name" | "courseId" | "deadline">) => string;
  addTask: (projectId: string, t: Omit<Task, "id" | "status">) => void;
  setTaskStatus: (projectId: string, taskId: string, status: Task["status"]) => void;
  addDecision: (projectId: string, title: string, detail: string) => void;
};
const Ctx = createContext<Store | null>(null);
const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState(seed.courses);
  const [docs, setDocs] = useState(seed.docs);
  const [projects, setProjects] = useState(seed.projects);
  const patch = (id: string, fn: (p: Project) => Project) => setProjects((ps) => ps.map((p) => (p.id === id ? fn(p) : p)));
  const value: Store = {
    courses, docs, projects,
    addCourse: (c) => setCourses((cs) => [...cs, { ...c, id: uid(), progress: 0 }]),
    addDoc: (d) => setDocs((ds) => [{ ...d, id: uid(), uploadedAt: today() }, ...ds]),
    addProject: (p) => {
      const id = uid();
      setProjects((ps) => [...ps, { ...p, id, members: ["Ahyan Qadri"], requirements: [], tasks: [], decisions: [], knowledge: [] }]);
      return id;
    },
    addTask: (pid, t) => patch(pid, (p) => ({ ...p, tasks: [...p.tasks, { ...t, id: uid(), status: "todo" }] })),
    setTaskStatus: (pid, tid, status) => patch(pid, (p) => ({ ...p, tasks: p.tasks.map((t) => (t.id === tid ? { ...t, status } : t)) })),
    addDecision: (pid, title, detail) => patch(pid, (p) => ({ ...p, decisions: [{ id: uid(), title, detail, date: today(), by: "Ahyan Qadri" }, ...p.decisions] })),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be inside StoreProvider");
  return s;
}
