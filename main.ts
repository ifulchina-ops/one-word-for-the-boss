// One Word for the Boss — make.fun program/v1 entry (Node 22).
//
// The task: send exactly one word describing the boss. The sealed scorer
// checks /output/entry.txt is UTF-8 text of 1 to 30 characters, not only
// whitespace; only a valid entry goes before the judge. The judge compares
// two words at a time on, most important first: (1) a single word a person
// would actually use about the boss they report to, (2) funny on its own,
// (3) rings true about a real boss habit, (4) fresh, not the first word
// anyone reaches for, (5) travels across a kitchen, a warehouse or an
// office. Shock for its own sake does not count.
//
// The word below is picked by scoring a shortlist against those five
// criteria, so the choice is argued, not asserted.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Scores = [number, number, number, number, number]; // the five criteria, 0-5 each

const CANDIDATES: Array<{ word: string; scores: Scores; why: string }> = [
  {
    word: "Hovercraft",
    scores: [5, 5, 5, 4, 5],
    why: "A boss who hovers over your shoulder, drifting from desk to desk. A real word with a second meaning that lands on its own: everyone has met the hovering boss, in any workplace.",
  },
  {
    word: "Micromanager",
    scores: [5, 2, 5, 1, 5],
    why: "True and a real word, but the first word anyone reaches for — no surprise, no laugh.",
  },
  {
    word: "Clockwatcher",
    scores: [5, 3, 4, 2, 4],
    why: "True about the boss who counts your minutes, but familiar and a little flat.",
  },
  {
    word: "Meetingmaker",
    scores: [4, 3, 4, 3, 3],
    why: "True for the boss who fills the calendar, but it reads as a job title, not a joke.",
  },
  {
    word: "Delegator",
    scores: [4, 1, 3, 2, 4],
    why: "A real boss word, but neutral — it praises as much as it teases, so it is not funny.",
  },
];

// Criterion weights follow the judge's order: single-word fit first, then
// funny, true, fresh, travels.
const WEIGHTS: Scores = [3, 3, 2, 2, 1];

function score(c: (typeof CANDIDATES)[number]): number {
  return c.scores.reduce((sum, s, i) => sum + s * WEIGHTS[i], 0);
}

function pickWord(): string {
  // Highest score wins; ties break to the shorter word (the event's own
  // tie-break favours the smaller text), then alphabetically, so the
  // choice is fully deterministic.
  const ranked = [...CANDIDATES].sort(
    (a, b) =>
      score(b) - score(a) ||
      a.word.length - b.word.length ||
      a.word.localeCompare(b.word),
  );
  for (const c of ranked) {
    console.log(`${c.word}: ${score(c)} — ${c.why}`);
  }
  return ranked[0].word;
}

function validate(word: string): void {
  const chars = [...word].length;
  if (chars < 1 || chars > 30) {
    throw new Error(`entry must be 1-30 characters, got ${chars}`);
  }
  if (/\s/.test(word)) {
    throw new Error("entry must be a single word with no spaces");
  }
}

const word = pickWord();
validate(word);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), word, "utf8");
console.log(`wrote ${word.length}-character entry to ${join(outDir, "entry.txt")}`);
