import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Bot, Brain, FolderKanban, LayoutDashboard, MessageSquareText, Search, Settings, Hexagon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Initials } from "./ui-bits";

const nav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "My Courses", url: "/courses", icon: BookOpen },
  { title: "Group Projects", url: "/projects", icon: FolderKanban },
  { title: "Knowledge Base", url: "/knowledge", icon: Brain },
  { title: "AI Agents", url: "/agents", icon: Bot },
  { title: "Ask UniHive", url: "/chat", icon: MessageSquareText },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const active = (u: string) => (u === "/" ? path === "/" : path.startsWith(u));
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2.5 px-2 py-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand gradient-move shadow-glow"><Hexagon className="h-4 w-4 text-primary-foreground" /></div>
          {!collapsed && <span className="font-display text-lg font-semibold">UniHive</span>}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((n) => (
                <SidebarMenuItem key={n.url}>
                  <SidebarMenuButton asChild isActive={active(n.url)} tooltip={n.title}>
                    <Link to={n.url} className="data-[active=true]:text-primary data-[active=true]:shadow-[inset_2px_0_0_var(--primary)]"><n.icon /><span>{n.title}</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2.5 p-2">
          <Initials name="Ahyan Qadri" />
          {!collapsed && <div className="min-w-0"><div className="truncate text-sm font-medium">Ahyan Qadri</div><div className="text-xs text-muted-foreground">BSc Computer Science</div></div>}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col bg-glow">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/70 px-4 backdrop-blur">
            <SidebarTrigger />
            <Link to="/knowledge" className="flex h-9 max-w-md flex-1 items-center gap-2 rounded-lg border bg-card/60 px-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <Search className="h-4 w-4" /> Search knowledge, documents, projects…
            </Link>
          </header>
          <main className="relative mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-8">
            <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-96" />
            <div key={path} className="fade-up relative">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
