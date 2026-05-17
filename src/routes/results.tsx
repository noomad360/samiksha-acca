import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { questions } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ChevronDown, Trophy, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your results — ACCA FA Mock" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResultsPage,
});

type StoredAnswer = string | string[] | number | null;

function isCorrect(qId: number, ans: StoredAnswer): boolean {
  const q = questions.find((x) => x.id === qId);
  if (!q) return false;
  if (q.type === "mcq") return ans === q.correct;
  if (q.type === "multi") {
    if (!Array.isArray(ans)) return false;
    if (ans.length !== q.correct.length) return false;
    return q.correct.every((c) => ans.includes(c));
  }
  if (q.type === "numeric") {
    if (typeof ans !== "number") return false;
    return Math.abs(ans - q.correct) <= (q.tolerance ?? 0);
  }
  return false;
}

function ResultsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<{
    answers: Record<number, StoredAnswer>;
    timeUsed: number;
  } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("acca-fa-result");
    if (!raw) {
      navigate({ to: "/" });
      return;
    }
    setData(JSON.parse(raw));
  }, [navigate]);

  const summary = useMemo(() => {
    if (!data) return null;
    let correct = 0;
    questions.forEach((q) => {
      if (isCorrect(q.id, data.answers[q.id])) correct += 1;
    });
    const marks = correct * 2;
    const total = questions.length * 2;
    const pct = Math.round((marks / total) * 100);
    return { correct, marks, total, pct, passed: pct >= 50 };
  }, [data]);

  if (!data || !summary) return null;

  const minutes = Math.floor(data.timeUsed / 60);
  const seconds = data.timeUsed % 60;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-sm font-semibold">
            ACCA Mock <span className="text-muted-foreground">/ FA · Results</span>
          </Link>
          <Link to="/exam">
            <Button size="sm" variant="outline">
              <RotateCcw className="mr-1.5 h-4 w-4" /> Retake
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Score card */}
        <div className="overflow-hidden rounded-2xl border bg-card shadow-elegant">
          <div className="bg-gradient-brand px-6 py-8 text-brand-foreground">
            <div className="flex items-center gap-3 text-sm opacity-90">
              <Trophy className="h-5 w-5" />
              Section A Result
            </div>
            <div className="mt-3 flex items-end gap-3">
              <div className="text-6xl font-bold tabular-nums">{summary.pct}%</div>
              <div className="pb-2 text-sm opacity-90">
                {summary.marks} / {summary.total} marks
              </div>
            </div>
            <div className="mt-2 text-sm opacity-90">
              {summary.correct} of {questions.length} questions correct · {minutes}m {seconds}s used
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 px-6 py-4">
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  summary.passed
                    ? "bg-success/15 text-success"
                    : "bg-destructive/15 text-destructive"
                }`}
              >
                {summary.passed ? "Pass (≥50%)" : "Fail (<50%)"}
              </span>
              <span className="text-muted-foreground">Official ACCA pass mark is 50%.</span>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">Home</Button>
            </Link>
          </div>
        </div>

        {/* Review */}
        <div className="mt-8">
          <h2 className="text-xl font-bold">Review your answers</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Each question shows your answer, the correct answer, and a worked explanation.
          </p>
          <div className="mt-5 space-y-3">
            {questions.map((q) => (
              <ReviewItem key={q.id} qId={q.id} userAnswer={data.answers[q.id]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatAnswer(q: ReturnType<typeof questions.find> & {}, a: StoredAnswer): string {
  if (a === null || a === undefined || (Array.isArray(a) && a.length === 0)) return "Not answered";
  if (q.type === "mcq") {
    const opt = q.options.find((o) => o.key === a);
    return opt ? `${opt.key}. ${opt.text}` : String(a);
  }
  if (q.type === "multi") {
    const arr = (a as string[]).sort();
    return arr
      .map((k) => {
        const opt = q.options.find((o) => o.key === k);
        return opt ? `${opt.key}. ${opt.text}` : k;
      })
      .join("  ·  ");
  }
  return `${q.unit ?? ""}${typeof a === "number" ? a.toLocaleString() : a}`;
}

function correctAnswerText(q: ReturnType<typeof questions.find> & {}): string {
  if (q.type === "mcq") {
    const opt = q.options.find((o) => o.key === q.correct);
    return opt ? `${opt.key}. ${opt.text}` : q.correct;
  }
  if (q.type === "multi") {
    return q.correct
      .map((k) => {
        const opt = q.options.find((o) => o.key === k);
        return opt ? `${opt.key}. ${opt.text}` : k;
      })
      .join("  ·  ");
  }
  return `${q.unit ?? ""}${q.correct.toLocaleString()}`;
}

function ReviewItem({ qId, userAnswer }: { qId: number; userAnswer: StoredAnswer }) {
  const q = questions.find((x) => x.id === qId)!;
  const correct = isCorrect(qId, userAnswer);
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border bg-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-3 px-5 py-4 text-left"
      >
        <div
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
            correct ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
          }`}
        >
          {correct ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Q{q.id}</span>
            <span>·</span>
            <span className={correct ? "text-success" : "text-destructive"}>
              {correct ? "Correct" : "Incorrect"}
            </span>
          </div>
          <div className="mt-1 line-clamp-2 text-sm">{q.prompt}</div>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t px-5 py-4 text-sm">
          <p className="whitespace-pre-line leading-relaxed">{q.prompt}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border bg-background p-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your answer
              </div>
              <div className={`mt-1 ${correct ? "text-success" : "text-destructive"}`}>
                {formatAnswer(q, userAnswer)}
              </div>
            </div>
            <div className="rounded-md border bg-background p-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Correct answer
              </div>
              <div className="mt-1 text-success">{correctAnswerText(q)}</div>
            </div>
          </div>
          <div className="mt-4 rounded-md bg-muted p-3 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Explanation
            </div>
            <p className="mt-1 leading-relaxed">{q.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
