import type { ReactNode } from "react";
import { FileText, NotebookPen, Presentation } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Doc } from "@/lib/data";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("surface p-5", className)}>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, hint, icon }: { label: string; value: string | number; hint?: string; icon: ReactNode }) {
  return (
    <div className="surface relative overflow-hidden p-5">
      <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-accent text-primary">{icon}</div>
      <div className="font-display text-2xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      {hint && <div className="mt-2 text-xs text-success">{hint}</div>}
    </div>
  );
}

const toneMap = {
  primary: "bg-primary/15 text-primary",
  violet: "bg-violet/15 text-violet",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  muted: "bg-muted text-muted-foreground",
  destructive: "bg-destructive/15 text-destructive",
} as const;
export type Tone = keyof typeof toneMap;
export function Pill({ tone = "muted", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", toneMap[tone])}>{children}</span>;
}

export function DocIcon({ type }: { type: Doc["type"] }) {
  const Icon = type === "pdf" ? FileText : type === "slides" ? Presentation : NotebookPen;
  return <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-primary"><Icon className="h-4 w-4" /></div>;
}

export function DocRow({ doc, meta }: { doc: Doc; meta?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50">
      <DocIcon type={doc.type} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{doc.name}</div>
        <div className="text-xs text-muted-foreground">{meta ?? `${doc.pages} pages · ${doc.size}`}</div>
      </div>
      <span className="text-xs text-muted-foreground">{doc.uploadedAt.slice(5)}</span>
    </div>
  );
}

export function Initials({ name, className }: { name: string; className?: string }) {
  const i = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return <div className={cn("grid h-8 w-8 place-items-center rounded-full bg-brand text-xs font-semibold text-primary-foreground ring-2 ring-background", className)}>{i}</div>;
}
