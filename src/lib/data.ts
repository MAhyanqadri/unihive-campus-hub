// Sample demo data. Shapes mirror future Lovable Cloud tables so the store can be swapped for queries.
export type Doc = { id: string; name: string; type: "pdf" | "notes" | "slides"; size: string; uploadedAt: string; courseId?: string; projectId?: string; pages: number };
export type Course = { id: string; code: string; title: string; lecturer: string; term: string; color: "primary" | "violet" | "success" | "warning"; progress: number };
export type Task = { id: string; title: string; assignee: string; status: "todo" | "doing" | "done"; due: string };
export type Decision = { id: string; title: string; detail: string; date: string; by: string };
export type Project = { id: string; name: string; courseId: string; deadline: string; members: string[]; requirements: string[]; tasks: Task[]; decisions: Decision[]; knowledge: string[] };
export type Knowledge = { id: string; title: string; content: string; category: "Concept" | "Definition" | "Formula" | "Decision" | "Requirement" | "Summary"; sourceDocId: string; date: string };
export type Activity = { id: string; who: string; action: string; target: string; time: string };
export type AgentMsg = { id: string; from: AgentId; to: AgentId | "user"; text: string; time: string };
export type AgentId = "knowledge" | "collaboration" | "review";
export type Agent = { id: AgentId; name: string; status: "active" | "idle" | "processing"; description: string; responsibilities: string[]; tasksToday: number; accuracy: number };

export const courses: Course[] = [
  { id: "c1", code: "CS2041", title: "Machine Learning Foundations", lecturer: "Dr. Amara Okafor", term: "Autumn 2026", color: "primary", progress: 64 },
  { id: "c2", code: "BUS1120", title: "Strategic Management", lecturer: "Prof. Liam Hartley", term: "Autumn 2026", color: "violet", progress: 48 },
  { id: "c3", code: "ECO2210", title: "Behavioural Economics", lecturer: "Dr. Sofia Lindqvist", term: "Autumn 2026", color: "success", progress: 72 },
  { id: "c4", code: "CS2230", title: "Database Systems", lecturer: "Dr. Kenji Watanabe", term: "Autumn 2026", color: "warning", progress: 35 },
];

export const docs: Doc[] = [
  { id: "d1", name: "Week 5 – Gradient Descent.pdf", type: "pdf", size: "2.4 MB", uploadedAt: "2026-11-18", courseId: "c1", pages: 38 },
  { id: "d2", name: "Week 6 – Regularisation notes", type: "notes", size: "120 KB", uploadedAt: "2026-11-19", courseId: "c1", pages: 6 },
  { id: "d3", name: "Porter's Five Forces – Lecture 4.pdf", type: "slides", size: "5.1 MB", uploadedAt: "2026-11-15", courseId: "c2", pages: 42 },
  { id: "d4", name: "Prospect Theory Reading.pdf", type: "pdf", size: "1.8 MB", uploadedAt: "2026-11-12", courseId: "c3", pages: 24 },
  { id: "d5", name: "Normalisation & 3NF.pdf", type: "pdf", size: "3.2 MB", uploadedAt: "2026-11-17", courseId: "c4", pages: 30 },
  { id: "d6", name: "Coursework Brief – Market Entry.pdf", type: "pdf", size: "640 KB", uploadedAt: "2026-11-10", projectId: "p1", pages: 8 },
  { id: "d7", name: "ML Project Spec – Churn Model.pdf", type: "pdf", size: "910 KB", uploadedAt: "2026-11-11", projectId: "p2", pages: 11 },
];

export const projects: Project[] = [
  {
    id: "p1", name: "Market Entry Strategy: Oatly in India", courseId: "c2", deadline: "2026-12-08",
    members: ["Ahyan Qadri", "Priya Nair", "Tom Becker", "Lena Müller"],
    requirements: ["3,000-word group report", "Apply Porter's Five Forces and PESTLE", "10-minute presentation with Q&A", "Individual peer-assessment form"],
    tasks: [
      { id: "t1", title: "PESTLE analysis draft", assignee: "Priya Nair", status: "done", due: "2026-11-18" },
      { id: "t2", title: "Five Forces competitor table", assignee: "Ahyan Qadri", status: "doing", due: "2026-11-24" },
      { id: "t3", title: "Entry mode recommendation", assignee: "Tom Becker", status: "todo", due: "2026-11-30" },
      { id: "t4", title: "Slide deck design", assignee: "Lena Müller", status: "todo", due: "2026-12-04" },
    ],
    decisions: [
      { id: "de1", title: "Focus on urban Tier-1 cities", detail: "Mumbai, Delhi and Bangalore have highest plant-milk adoption.", date: "2026-11-14", by: "Team vote" },
      { id: "de2", title: "Joint venture entry mode", detail: "JV with local dairy distributor reduces regulatory risk.", date: "2026-11-17", by: "Tom Becker" },
    ],
    knowledge: ["k3", "k5"],
  },
  {
    id: "p2", name: "Customer Churn Prediction", courseId: "c1", deadline: "2026-12-15",
    members: ["Ahyan Qadri", "Omar Haddad", "Mei Chen"],
    requirements: ["Train and compare at least 3 models", "Report precision/recall and ROC-AUC", "Reproducible notebook", "2-page executive summary"],
    tasks: [
      { id: "t5", title: "Clean telecom dataset", assignee: "Mei Chen", status: "done", due: "2026-11-16" },
      { id: "t6", title: "Baseline logistic regression", assignee: "Omar Haddad", status: "doing", due: "2026-11-22" },
      { id: "t7", title: "Gradient boosting + tuning", assignee: "Ahyan Qadri", status: "todo", due: "2026-11-29" },
    ],
    decisions: [{ id: "de3", title: "Use ROC-AUC as primary metric", detail: "Classes are imbalanced (14% churn).", date: "2026-11-15", by: "Mei Chen" }],
    knowledge: ["k1", "k2"],
  },
];

export const knowledge: Knowledge[] = [
  { id: "k1", title: "Gradient descent update rule", category: "Formula", content: "Parameters are updated as θ ← θ − η∇J(θ), where η is the learning rate. Too large η causes divergence; too small slows convergence.", sourceDocId: "d1", date: "2026-11-18" },
  { id: "k2", title: "L2 regularisation (Ridge)", category: "Concept", content: "Adds λ‖w‖² to the loss, shrinking weights toward zero to reduce overfitting without producing sparse solutions.", sourceDocId: "d2", date: "2026-11-19" },
  { id: "k3", title: "Porter's Five Forces", category: "Concept", content: "Industry attractiveness is shaped by rivalry, threat of new entrants, threat of substitutes, buyer power and supplier power.", sourceDocId: "d3", date: "2026-11-15" },
  { id: "k4", title: "Loss aversion", category: "Definition", content: "In prospect theory, losses weigh roughly twice as heavily as equivalent gains, shaping risk-seeking behaviour in the loss domain.", sourceDocId: "d4", date: "2026-11-12" },
  { id: "k5", title: "Coursework: report requirements", category: "Requirement", content: "The market entry report must be 3,000 words (±10%), apply two strategic frameworks and include a justified entry-mode recommendation.", sourceDocId: "d6", date: "2026-11-10" },
  { id: "k6", title: "Third Normal Form (3NF)", category: "Definition", content: "A relation is in 3NF if it is in 2NF and no non-key attribute is transitively dependent on the primary key.", sourceDocId: "d5", date: "2026-11-17" },
  { id: "k7", title: "Churn project evaluation", category: "Requirement", content: "Models must be compared on precision, recall and ROC-AUC with a reproducible notebook and a 2-page executive summary.", sourceDocId: "d7", date: "2026-11-11" },
];

export const activity: Activity[] = [
  { id: "a1", who: "Priya Nair", action: "completed", target: "PESTLE analysis draft", time: "12m ago" },
  { id: "a2", who: "Knowledge Agent", action: "extracted 6 items from", target: "Week 6 – Regularisation notes", time: "1h ago" },
  { id: "a3", who: "Tom Becker", action: "logged decision", target: "Joint venture entry mode", time: "3h ago" },
  { id: "a4", who: "Review Agent", action: "flagged a word-count risk in", target: "Market Entry report", time: "5h ago" },
  { id: "a5", who: "Mei Chen", action: "uploaded", target: "telecom_churn_clean.csv", time: "Yesterday" },
];

export const agents: Agent[] = [
  { id: "knowledge", name: "Knowledge Agent", status: "active", description: "Reads uploaded documents and turns them into structured, searchable knowledge.", responsibilities: ["Parse PDFs, slides and notes", "Extract concepts, formulas and definitions", "Link knowledge to source pages", "Answer questions with citations"], tasksToday: 42, accuracy: 96 },
  { id: "collaboration", name: "Collaboration Agent", status: "processing", description: "Keeps group workspaces aligned on tasks, deadlines and decisions.", responsibilities: ["Track task progress and blockers", "Log team decisions automatically", "Send deadline nudges", "Summarise meeting notes"], tasksToday: 18, accuracy: 92 },
  { id: "review", name: "Review Agent", status: "idle", description: "Checks drafts against coursework requirements and marking criteria.", responsibilities: ["Compare drafts with the brief", "Flag missing frameworks or sections", "Check word counts and referencing", "Suggest improvements before submission"], tasksToday: 7, accuracy: 94 },
];

export const agentMessages: AgentMsg[] = [
  { id: "m1", from: "knowledge", to: "collaboration", text: "Extracted 4 requirements from 'Coursework Brief – Market Entry'. Sharing with project workspace.", time: "09:12" },
  { id: "m2", from: "collaboration", to: "user", text: "Created tasks for each requirement and assigned owners based on last week's split.", time: "09:13" },
  { id: "m3", from: "collaboration", to: "review", text: "Draft v2 of the report uploaded. Please check against the brief.", time: "11:40" },
  { id: "m4", from: "review", to: "knowledge", text: "Need the exact word-count tolerance from the brief.", time: "11:41" },
  { id: "m5", from: "knowledge", to: "review", text: "3,000 words ±10% (source: Coursework Brief p.2).", time: "11:41" },
  { id: "m6", from: "review", to: "user", text: "Draft is 3,410 words — 110 over the limit. Section 4 is the best place to trim.", time: "11:43" },
];
