import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader, Panel } from "@/components/app/ui-bits";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/settings")({
  head: () => meta("Settings", "Manage your UniHive profile, notifications and AI agent preferences."),
  component: Settings,
});

const prefs = [
  { label: "Deadline reminders", desc: "Collaboration Agent nudges before task due dates", on: true },
  { label: "Auto-extract knowledge", desc: "Knowledge Agent processes new uploads automatically", on: true },
  { label: "Draft reviews", desc: "Review Agent checks drafts against the brief", on: false },
  { label: "Weekly digest email", desc: "Summary of activity across your workspaces", on: true },
];

function Settings() {
  return (
    <>
      <PageHeader title="Settings" subtitle="Your profile and how UniHive's agents work for you." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Profile">
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Full name</Label><Input defaultValue="Ahyan Qadri" /></div>
            <div className="space-y-1.5"><Label>University email</Label><Input defaultValue="ahyan.qadri@university.ac.uk" /></div>
            <div className="space-y-1.5"><Label>Programme</Label><Input defaultValue="BSc Computer Science" /></div>
            <Button variant="brand" onClick={() => toast.success("Profile saved")}>Save changes</Button>
          </div>
        </Panel>
        <Panel title="Agents & notifications">
          <div className="divide-y">
            {prefs.map((p) => (
              <div key={p.label} className="flex items-center justify-between gap-4 py-3">
                <div><div className="text-sm font-medium">{p.label}</div><div className="text-xs text-muted-foreground">{p.desc}</div></div>
                <Switch defaultChecked={p.on} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
