import { knowledge, type Knowledge } from "./data";

export type Answer = { text: string; sources: Knowledge[] };

// Demo retriever over sample knowledge. Swap for a server function that calls the AI Gateway
// (keys stay server-side) and returns the same { text, sources } shape.
export async function askUniHive(question: string): Promise<Answer> {
  await new Promise((r) => setTimeout(r, 900));
  const words = question.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  const scored = knowledge
    .map((k) => ({ k, score: words.filter((w) => `${k.title} ${k.content}`.toLowerCase().includes(w)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.k);
  if (!scored.length) {
    return { text: "I couldn't find that in your course documents or project knowledge yet. Try uploading the relevant lecture notes, or rephrase with a key term from the material.", sources: [] };
  }
  const [top, ...rest] = scored;
  const text = `Based on your materials: **${top!.title}** — ${top!.content}` + (rest.length ? `\n\nRelated: ${rest.map((r) => r.title).join(", ")}.` : "");
  return { text, sources: scored };
}
