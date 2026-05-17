import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { questions, EXAM_DURATION_SECONDS, type Question } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flag, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/exam")({
  head: () => ({
    meta: [
      { title: "Exam in progress — ACCA FA Mock" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ExamPage,
});

type Answer = string | string[] | number | null;

function ExamPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, Answer>>(() => {
    const init: Record<number, Answer> = {};
    questions.forEach((q) => (init[q.id] = q.type === "multi" ? [] : null));
    return init;
  });
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_DURATION_SECONDS);
  const [showSubmit, setShowSubmit] = useState(false);
  const submittedRef = useRef(false);

  const current = questions[currentIdx];

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          submit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setAnswer(qId: number, value: Answer) {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }

  function toggleFlag(qId: number) {
    setFlagged((prev) => {
      const n = new Set(prev);
      n.has(qId) ? n.delete(qId) : n.add(qId);
      return n;
    });
  }

  function submit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    sessionStorage.setItem(
      "acca-fa-result",
      JSON.stringify({ answers, finishedAt: Date.now(), timeUsed: EXAM_DURATION_SECONDS - secondsLeft }),
    );
    navigate({ to: "/results" });
  }

  const answeredCount = useMemo(
    () =>
      questions.filter((q) => {
        const a = answers[q.id];
        if (q.type === "multi") return Array.isArray(a) && a.length > 0;
        return a !== null && a !== "" && a !== undefined;
      }).length,
    [answers],
  );

  const hh = Math.floor(secondsLeft / 3600);
  const mm = Math.floor((secondsLeft % 3600) / 60);
  const ss = secondsLeft % 60;
  const timeStr = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  const timeWarning = secondsLeft < 5 * 60;

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="text-sm font-semibold">
            ACCA Mock <span className="text-muted-foreground">/ FA</span>
          </Link>
          <div className="flex items-center gap-3">
            <div
              className={`rounded-md border px-3 py-1.5 font-mono text-sm ${
                timeWarning ? "border-destructive bg-destructive/10 text-destructive" : "bg-background"
              }`}
            >
              {timeStr}
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowSubmit(true)}>
              Submit
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[1fr_300px]">
        {/* Question */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand">
              Section A · Question {currentIdx + 1} of {questions.length}
            </div>
            <button
              onClick={() => toggleFlag(current.id)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                flagged.has(current.id)
                  ? "border-warning bg-warning/15 text-warning-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Flag className="h-3.5 w-3.5" />
              {flagged.has(current.id) ? "Flagged" : "Flag for review"}
            </button>
          </div>

          <div className="mt-5">
            <p className="whitespace-pre-line text-[15px] leading-relaxed">{current.prompt}</p>
            <div className="mt-2 text-xs text-muted-foreground">[2 marks]</div>
          </div>

          <div className="mt-6">
            <QuestionInput
              question={current}
              answer={answers[current.id]}
              onChange={(v) => setAnswer(current.id, v)}
            />
          </div>

          <div className="mt-8 flex items-center justify-between border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            <div className="text-xs text-muted-foreground">
              {answeredCount} of {questions.length} answered
            </div>
            <Button
              onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
              disabled={currentIdx === questions.length - 1}
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigator */}
        <aside className="rounded-xl border bg-card p-5 shadow-sm lg:sticky lg:top-[68px] lg:self-start">
          <div className="text-sm font-semibold">Question navigator</div>
          <div className="mt-3 grid grid-cols-7 gap-1.5 lg:grid-cols-5">
            {questions.map((q, idx) => {
              const isAnswered = (() => {
                const a = answers[q.id];
                if (q.type === "multi") return Array.isArray(a) && a.length > 0;
                return a !== null && a !== "" && a !== undefined;
              })();
              const isCurrent = idx === currentIdx;
              const isFlagged = flagged.has(q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`relative h-9 rounded-md border text-xs font-medium transition ${
                    isCurrent
                      ? "border-brand bg-brand text-brand-foreground"
                      : isAnswered
                        ? "border-brand/30 bg-brand/10 text-foreground hover:bg-brand/20"
                        : "bg-background hover:bg-muted"
                  }`}
                >
                  {q.id}
                  {isFlagged && (
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-warning" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
            <LegendDot className="bg-brand" label="Current" />
            <LegendDot className="bg-brand/20 border border-brand/40" label="Answered" />
            <LegendDot className="bg-background border" label="Unanswered" />
            <LegendDot className="bg-warning" label="Flagged" />
          </div>
          <Button className="mt-5 w-full" onClick={() => setShowSubmit(true)}>
            Submit exam
          </Button>
        </aside>
      </div>

      {showSubmit && (
        <SubmitDialog
          answered={answeredCount}
          total={questions.length}
          flaggedCount={flagged.size}
          onCancel={() => setShowSubmit(false)}
          onConfirm={submit}
        />
      )}
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block h-3 w-3 rounded ${className}`} />
      {label}
    </div>
  );
}

function QuestionInput({
  question,
  answer,
  onChange,
}: {
  question: Question;
  answer: Answer;
  onChange: (v: Answer) => void;
}) {
  if (question.type === "mcq") {
    return (
      <div className="space-y-2">
        {question.options.map((opt) => {
          const selected = answer === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onChange(opt.key)}
              className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${
                selected ? "border-brand bg-brand/5 ring-1 ring-brand" : "hover:bg-muted/60"
              }`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                  selected ? "border-brand bg-brand text-brand-foreground" : ""
                }`}
              >
                {opt.key}
              </span>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>
    );
  }
  if (question.type === "multi") {
    const arr = Array.isArray(answer) ? answer : [];
    return (
      <div className="space-y-2">
        <div className="mb-1 text-xs font-medium text-muted-foreground">Select TWO answers.</div>
        {question.options.map((opt) => {
          const selected = arr.includes(opt.key);
          return (
            <button
              key={opt.key}
              onClick={() => {
                let next = selected ? arr.filter((x) => x !== opt.key) : [...arr, opt.key];
                if (next.length > 2) next = next.slice(-2);
                onChange(next);
              }}
              className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${
                selected ? "border-brand bg-brand/5 ring-1 ring-brand" : "hover:bg-muted/60"
              }`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border text-xs font-semibold ${
                  selected ? "border-brand bg-brand text-brand-foreground" : ""
                }`}
              >
                {selected ? "✓" : opt.key}
              </span>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>
    );
  }
  // numeric
  return (
    <div className="max-w-xs">
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
        Your answer {question.unit ? `(${question.unit})` : ""}
      </label>
      <Input
        type="number"
        inputMode="decimal"
        value={answer === null || answer === undefined ? "" : String(answer)}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? null : Number(v));
        }}
        placeholder="e.g. 12300"
        className="text-base"
      />
    </div>
  );
}

function SubmitDialog({
  answered,
  total,
  flaggedCount,
  onCancel,
  onConfirm,
}: {
  answered: number;
  total: number;
  flaggedCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const unanswered = total - answered;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-elegant">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/15 text-warning-foreground">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Submit your exam?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You have answered <b>{answered}</b> of <b>{total}</b> questions
              {unanswered > 0 && <> · <b className="text-destructive">{unanswered} unanswered</b></>}
              {flaggedCount > 0 && <> · {flaggedCount} flagged</>}.
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Keep working</Button>
          <Button onClick={onConfirm}>Submit & see results</Button>
        </div>
      </div>
    </div>
  );
}
