import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { questions, EXAM_DURATION_SECONDS, type Question } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Flag, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/exam")({
  head: () => ({
    meta: [{ title: "Exam in progress — ACCA FA Mock" }, { name: "robots", content: "noindex" }],
  }),
  component: ExamPage,
});

type Answer = string | string[] | number | null;

function ExamPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, Answer>>(() => {
    const init: Record<number, Answer> = {};
    questions.forEach(
      (q) => (init[q.id] = q.type === "multi" ? [] : q.type === "long" ? "" : null),
    );
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
          void submit();
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
      if (n.has(qId)) {
        n.delete(qId);
      } else {
        n.add(qId);
      }
      return n;
    });
  }

  async function submit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const result = {
      answers,
      finishedAt: Date.now(),
      timeUsed: EXAM_DURATION_SECONDS - secondsLeft,
    };
    sessionStorage.setItem("acca-fa-result", JSON.stringify(result));
    try {
      await fetch("/api/exam-results", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(result),
      });
    } catch (error) {
      console.error("Unable to send exam result email", error);
    }
    navigate({ to: "/results" });
  }

  const answeredCount = useMemo(
    () =>
      questions.filter((q) => {
        const a = answers[q.id];
        if (q.type === "multi") return Array.isArray(a) && a.length > 0;
        if (q.type === "long") return typeof a === "string" && a.trim().length > 0;
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
                timeWarning
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : "bg-background"
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
              Section {current.section ?? "A"} · Question {currentIdx + 1} of {questions.length}
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
            {current.type === "long" ? (
              <SectionBQuestionPaper
                question={current}
                answer={answers[current.id]}
                onChange={(v) => setAnswer(current.id, v)}
              />
            ) : (
              <p className="whitespace-pre-line text-[15px] leading-relaxed">{current.prompt}</p>
            )}
            <div className="mt-2 text-xs text-muted-foreground">[{current.marks ?? 2} marks]</div>
          </div>

          {current.type !== "long" && (
            <div className="mt-6">
              <QuestionInput
                question={current}
                answer={answers[current.id]}
                onChange={(v) => setAnswer(current.id, v)}
              />
            </div>
          )}

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
                if (q.type === "long") return typeof a === "string" && a.trim().length > 0;
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

function SectionBQuestionPaper({
  question,
  answer,
  onChange,
}: {
  question: Extract<Question, { type: "long" }>;
  answer: Answer;
  onChange: (value: Answer) => void;
}) {
  return (
    <>
      {question.id === 36 ? <PoodlePaper /> : <BuzzardPaper />}
      <SectionBAnswerBooklet question={question} answer={answer} onChange={onChange} />
    </>
  );
}

function PaperPage({ pageNo, children }: { pageNo: number; children: ReactNode }) {
  return (
    <div className="mx-auto mb-6 w-full max-w-[760px] bg-white px-7 py-6 font-serif text-[11px] leading-snug text-black shadow-sm ring-1 ring-border">
      <div className="mb-3 flex items-center justify-between border-b border-black pb-1 text-[9px] uppercase tracking-wide">
        <span>FA and FFA: Financial Accounting</span>
        <span>Mock Questions</span>
      </div>
      {children}
      <div className="mt-5 flex items-center justify-between border-t border-black pt-1 text-[9px] uppercase tracking-wide">
        <span>{pageNo}</span>
        <span>Kaplan Publishing</span>
      </div>
    </div>
  );
}

function SectionBAnswerBooklet({
  question,
  answer,
  onChange,
}: {
  question: Extract<Question, { type: "long" }>;
  answer: Answer;
  onChange: (value: Answer) => void;
}) {
  return (
    <div className="mx-auto mt-6 w-full max-w-[760px] bg-white px-7 py-6 text-black shadow-sm ring-1 ring-border">
      <div className="mb-4 flex items-center justify-between border-b border-black pb-2 font-serif text-[10px] uppercase tracking-wide">
        <span>Section B answer booklet</span>
        <span>
          Question {question.id === 36 ? "1" : "2"} / {question.marks} marks
        </span>
      </div>
      <label className="block text-sm font-semibold text-foreground">
        Write your answer for {question.title}
      </label>
      <Textarea
        value={typeof answer === "string" ? answer : ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Type your workings, selected options, true/false answers, and final figures here."
        className="mt-3 min-h-[360px] resize-y border-black/40 bg-white font-mono text-sm leading-relaxed text-black"
      />
      <div className="mt-2 text-xs text-muted-foreground">
        This answer is saved with the submission and sent in the result email for manual marking.
      </div>
    </div>
  );
}

function MoneyTable({
  headings,
  rows,
  total,
}: {
  headings: string[];
  rows: [string, string, string][];
  total?: [string, string, string];
}) {
  return (
    <table className="mt-2 w-full border-collapse text-[11px]">
      <thead>
        <tr>
          <th className="w-1/2 text-left font-normal"></th>
          {headings.map((heading) => (
            <th key={heading} className="text-right font-normal">
              {heading}
            </th>
          ))}
        </tr>
        <tr>
          <th></th>
          {headings.map((heading) => (
            <th
              key={`${heading}-currency`}
              className="border-b border-black text-right font-normal"
            >
              $
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(([label, first, second]) => (
          <tr key={label}>
            <td className="py-0.5">{label}</td>
            <td className="py-0.5 text-right">{first}</td>
            <td className="py-0.5 text-right">{second}</td>
          </tr>
        ))}
        {total && (
          <tr className="font-semibold">
            <td className="border-t border-black py-0.5">{total[0]}</td>
            <td className="border-t border-black py-0.5 text-right">{total[1]}</td>
            <td className="border-t border-black py-0.5 text-right">{total[2]}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function AnswerBoxTable({ rows, marks }: { rows: [string, string, string][]; marks: string }) {
  return (
    <div className="mt-3">
      <div className="mb-1 flex justify-end text-[10px]">({marks})</div>
      <table className="w-full border-collapse text-[10px]">
        <thead>
          <tr>
            <th className="border border-black px-1 py-1 text-left font-normal">Answer</th>
            <th className="border border-black px-1 py-1 text-left font-normal">
              Calculation / description
            </th>
            <th className="border border-black px-1 py-1 text-center font-normal">$</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, text, value]) => (
            <tr key={label}>
              <td className="w-10 border border-black px-1 py-1 align-top">{label}</td>
              <td className="border border-black px-1 py-1 align-top">{text}</td>
              <td className="w-28 border border-black px-1 py-1 text-right align-top">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OptionTable({
  label,
  marks,
  rows,
}: {
  label: string;
  marks: string;
  rows: [string, string][];
}) {
  return (
    <div className="mt-3">
      <div className="mb-1 flex justify-between">
        <span>{label}</span>
        <span>({marks})</span>
      </div>
      <table className="w-full border-collapse text-[10px]">
        <thead>
          <tr>
            <th className="w-10 border border-black px-1 py-1 text-left font-normal"></th>
            <th className="border border-black px-1 py-1 text-left font-normal">
              Calculation / formula
            </th>
            <th className="w-28 border border-black px-1 py-1 text-center font-normal">
              Selected answer
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([key, text]) => (
            <tr key={key}>
              <td className="border border-black px-1 py-1 align-top">{key}</td>
              <td className="border border-black px-1 py-1 align-top">{text}</td>
              <td className="border border-black px-1 py-1"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PoodlePaper() {
  return (
    <div className="overflow-x-auto bg-muted/20 py-4">
      <PaperPage pageNo={12}>
        <h2 className="mb-2 text-[12px] font-bold uppercase">Section B</h2>
        <p className="font-bold uppercase">Both questions are compulsory and must be attempted</p>
        <p className="mt-2">
          Please write your answer within the answer booklet in accordance with the detailed
          instructions provided within each of the questions in this section of the exam paper.
        </p>
        <p className="mt-3">
          <strong>1</strong> On 1 January 20X1, Poodle acquired 80% of the ordinary shares of Setter
          for $270,000. The statements of financial position for the two entities as at 30 June 20X4
          were as follows:
        </p>
        <MoneyTable
          headings={["Poodle", "Setter"]}
          rows={[
            ["Assets", "", ""],
            ["Non-current assets", "", ""],
            ["Property, plant and equipment", "450,000", "321,825"],
            ["Investments", "300,000", ""],
            ["Current assets", "", ""],
            ["Inventories", "75,000", "45,500"],
            ["Trade and other receivables", "32,000", "43,175"],
            ["Cash and cash equivalents", "3,000", ""],
          ]}
          total={["Total assets", "860,000", "410,500"]}
        />
        <MoneyTable
          headings={["Poodle", "Setter"]}
          rows={[
            ["Equity and liabilities", "", ""],
            ["Equity", "", ""],
            ["Issued share capital", "100,000", "50,000"],
            ["Share premium", "20,000", "10,000"],
            ["Retained earnings", "490,000", "250,500"],
            ["Non-current liabilities", "", ""],
            ["Loans", "150,000", "17,500"],
            ["Current liabilities", "", ""],
            ["Trade and other payables", "100,000", "71,425"],
            ["Bank overdraft", "", "11,075"],
          ]}
          total={["Total equity and liabilities", "860,000", "410,500"]}
        />
        <p className="mt-3">
          The following information is relevant to the preparation of the consolidated financial
          statements for the year ended 30 June 20X4:
        </p>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>
            On 1 January 20X1, the retained earnings of Setter were $157,500 and the fair value of
            the non-controlling interest was $63,500.
          </li>
          <li>
            At the acquisition date, the fair value of land owned by Setter exceeded its carrying
            amount by $100,000. This land was still owned by Setter at 30 June 20X4.
          </li>
          <li>
            During the year ended 30 June 20X4, Poodle sold goods to Setter for $20,000 at a mark-up
            on cost of 25%. All of the goods remain in the inventory of Setter at the year end. The
            sale was made on credit and payment had not been made by Setter at 30 June 20X4.
          </li>
        </ul>
      </PaperPage>

      <PaperPage pageNo={13}>
        <p className="font-bold">Required:</p>
        <p className="mt-1">
          <strong>(a)</strong> In relation to the consolidated statement of financial position of
          the Poodle group as at 30 June 20X4, calculate the following:
        </p>
        <AnswerBoxTable
          marks="8.5 marks"
          rows={[
            ["(i)", "Property, plant and equipment", ""],
            ["(ii)", "Inventories", ""],
            ["(iii)", "Receivables", ""],
            ["(iv)", "Retained earnings", ""],
            ["(v)", "Payables", ""],
          ]}
        />
        <OptionTable
          label="(b) Choose the correct calculation of investments to include in the consolidated statement of financial position."
          marks="1 mark"
          rows={[
            ["(i)", "$300,000 + $270,000"],
            ["(ii)", "$300,000 - $270,000"],
            ["(iii)", "$300,000"],
          ]}
        />
        <OptionTable
          label="(c) Choose the correct formula to calculate goodwill on consolidation for inclusion in the consolidated statement of financial position."
          marks="2 marks"
          rows={[
            [
              "(i)",
              "Fair value of consideration paid less fair value of the non-controlling interest at acquisition date plus fair value of net assets at the acquisition date.",
            ],
            [
              "(ii)",
              "Fair value of consideration paid less fair value of the non-controlling interest at acquisition date less fair value of net assets at the acquisition date.",
            ],
            [
              "(iii)",
              "Fair value of consideration paid plus fair value of the non-controlling interest at acquisition date less fair value of net assets at the acquisition date.",
            ],
          ]}
        />
      </PaperPage>

      <PaperPage pageNo={14}>
        <OptionTable
          label="(d) Choose the correct formula to calculate the non-controlling interest for inclusion in the consolidated statement of financial position."
          marks="1.5 marks"
          rows={[
            [
              "(i)",
              "Fair value of non-controlling interest at acquisition plus NCI% change in fair value of net assets between acquisition date and reporting date.",
            ],
            [
              "(ii)",
              "Fair value of non-controlling interest at acquisition plus NCI% fair value of net assets at reporting date.",
            ],
            [
              "(iii)",
              "Fair value of non-controlling interest at acquisition plus NCI% at acquisition date.",
            ],
          ]}
        />
        <div className="mt-4 flex justify-between">
          <p>
            <strong>(e)</strong> State whether each of the following statements are true or false:
          </p>
          <span>(2 marks)</span>
        </div>
        <table className="mt-2 w-full border-collapse text-[10px]">
          <tbody>
            {[
              "Goodwill arising on consolidation of a subsidiary is accounted for as a tangible non-current asset.",
              "Non-controlling interest is classified as a liability in the consolidated statement of financial position.",
            ].map((text) => (
              <tr key={text}>
                <td className="border border-black px-1 py-2">{text}</td>
                <td className="w-28 border border-black px-1 py-2 text-center">True/False</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-right font-bold">(Total: 15 marks)</p>
      </PaperPage>
    </div>
  );
}

function BuzzardPaper() {
  return (
    <div className="overflow-x-auto bg-muted/20 py-4">
      <PaperPage pageNo={14}>
        <p>
          <strong>2</strong> The trial balance for Buzzard Co as at 30 September 20X6 is presented
          below:
        </p>
        <table className="mt-3 w-full border-collapse text-[10px]">
          <thead>
            <tr>
              <th className="text-left font-normal"></th>
              <th className="text-right font-normal">
                Dr
                <br />$
              </th>
              <th className="text-right font-normal">
                Cr
                <br />$
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Revenue", "", "360,250"],
              ["Retained earnings", "", "64,000"],
              ["Purchases", "145,380", ""],
              ["Administrative expenses", "67,300", ""],
              ["Distribution costs", "42,815", ""],
              ["Plant and machinery - cost", "199,850", ""],
              ["Plant and machinery - accumulated depreciation at 1 October 20X5", "", "48,000"],
              ["Trade receivables", "47,450", ""],
              ["Allowance for receivables - 1 October 20X5", "", "2,500"],
              ["Inventory - 1 October 20X5", "20,000", ""],
              ["Dividend paid", "3,000", ""],
              ["Trade payables", "", "27,795"],
              ["Issued share capital @ $1 shares", "", "20,000"],
              ["Income tax", "1,000", ""],
              ["Bank overdraft", "", "2,250"],
            ].map(([label, dr, cr]) => (
              <tr key={label}>
                <td className="py-0.5">{label}</td>
                <td className="py-0.5 text-right">{dr}</td>
                <td className="py-0.5 text-right">{cr}</td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td></td>
              <td className="border-t border-black py-0.5 text-right">525,795</td>
              <td className="border-t border-black py-0.5 text-right">525,795</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3">
          The following information is relevant to the preparation of the financial statements:
        </p>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>
            Inventory at 30 September 20X6 had a cost of $23,500. Within this, there were several
            items which had cost $5,000 but which could be sold for only $3,500.
          </li>
          <li>
            The allowance for receivables should be increased to $6,000. The increase should be
            charged as an administrative cost.
          </li>
          <li>
            Plant and machinery is depreciated on a reducing balance basis at a rate of 20% per
            annum. Depreciation should be charged to cost of sales.
          </li>
          <li>
            The income tax charge based upon the profit for the year was estimated at $15,000.
          </li>
        </ul>
      </PaperPage>

      <PaperPage pageNo={15}>
        <p className="font-bold">Required:</p>
        <p className="mt-1">
          <strong>(a)</strong> Prepare the statement of profit or loss of Buzzard Co for the year
          ended 30 September 20X6. <span className="float-right">(6.5 marks)</span>
        </p>
        <div className="mt-3 text-center font-bold">BUZZARD CO</div>
        <div className="text-center">
          Statement of profit or loss for the year ended 30 September 20X6
        </div>
        <table className="mt-2 w-full border-collapse text-[10px]">
          <tbody>
            {[
              ["Revenue", "insert value"],
              ["Cost of sales", "Item 1"],
              ["Gross profit", "N/A"],
              ["Administrative expenses", "Item 2"],
              ["Distribution costs", "insert value"],
              ["Profit before tax", "N/A"],
              ["Income tax charge", "Item 3"],
              ["Profit after tax for the year", "N/A"],
            ].map(([label, value]) => (
              <tr key={label}>
                <td className="border border-black px-1 py-1">{label}</td>
                <td className="w-36 border border-black px-1 py-1 text-center">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <OptionTable
          label="Item 1 - Choose the correct calculation of cost of sales"
          marks=""
          rows={[
            ["(i)", "$20,000 + $145,380 + $23,500 - $30,370"],
            ["(ii)", "$20,000 + $145,380 - $23,500 + $30,370"],
            ["(iii)", "$20,000 + $145,380 - $22,000 + $30,370"],
          ]}
        />
        <OptionTable
          label="Item 2 - Choose the correct calculation of administrative expenses"
          marks=""
          rows={[
            ["(i)", "$67,300 + $2,500 - $6,000"],
            ["(ii)", "$67,300 + $6,000 - $3,500"],
            ["(iii)", "$67,300 + $6,000"],
          ]}
        />
        <OptionTable
          label="Item 3 - Choose the correct calculation of the income tax charge"
          marks=""
          rows={[
            ["(i)", "$15,000"],
            ["(ii)", "$15,000 + $1,000"],
            ["(iii)", "$15,000 - $1,000"],
          ]}
        />
      </PaperPage>

      <PaperPage pageNo={16}>
        <p>
          <strong>(b)</strong> Prepare the statement of financial position of Buzzard Co as at 30
          September 20X6. <span className="float-right">(8.5 marks)</span>
        </p>
        <div className="mt-3 text-center">
          Statement of financial position as at 30 September 20X6
        </div>
        <table className="mt-2 w-full border-collapse text-[10px]">
          <tbody>
            {[
              ["Non-current assets", ""],
              ["Property, plant and equipment", "(Insert value)"],
              ["Current assets", ""],
              ["Inventories", "Item 1"],
              ["Receivables", "Item 2"],
              ["Total assets", "N/A"],
              ["Equity and liabilities", ""],
              ["Issued share capital @ $1 shares", "(Insert value)"],
              ["Retained earnings", "(Insert value)"],
              ["Current liabilities", ""],
              ["Trade and other payables", "(Insert value)"],
              ["Income tax liability", "Item 3"],
              ["Bank overdraft", "(Insert value)"],
              ["Total equity and liabilities", "N/A"],
            ].map(([label, value]) => (
              <tr key={label}>
                <td className="border border-black px-1 py-1">{label}</td>
                <td className="w-36 border border-black px-1 py-1 text-center">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <OptionTable
          label="Item 1 - Choose the correct calculation of inventories"
          marks=""
          rows={[
            ["(i)", "$23,500 - $5,000 + $3,500"],
            ["(ii)", "$23,500 + $5,000 - $3,500"],
            ["(iii)", "$23,500 - $5,000 + $3,500"],
          ]}
        />
        <OptionTable
          label="Item 2 - Choose the correct calculation of receivables"
          marks=""
          rows={[
            ["(i)", "$47,450 - $6,000 + $2,500"],
            ["(ii)", "$47,450 - $6,000"],
            ["(iii)", "$47,450 + $6,000 - $2,500"],
          ]}
        />
        <OptionTable
          label="Item 3 - Choose the correct calculation of the income tax liability"
          marks=""
          rows={[
            ["(i)", "$15,000 - $1,000"],
            ["(ii)", "$15,000"],
            ["(iii)", "$15,000 + $1,000"],
          ]}
        />
        <p className="mt-3 text-right font-bold">(Total: 15 marks)</p>
      </PaperPage>
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
  if (question.type === "long") {
    return (
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Your answer
        </label>
        <Textarea
          value={typeof answer === "string" ? answer : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your workings and final answers here."
          className="min-h-[260px] resize-y text-sm leading-relaxed"
        />
        <div className="mt-2 text-xs text-muted-foreground">
          Section B is saved for manual marking and included in the submitted result email.
        </div>
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
              {unanswered > 0 && (
                <>
                  {" "}
                  · <b className="text-destructive">{unanswered} unanswered</b>
                </>
              )}
              {flaggedCount > 0 && <> · {flaggedCount} flagged</>}.
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Keep working
          </Button>
          <Button onClick={() => void onConfirm()}>Submit & see results</Button>
        </div>
      </div>
    </div>
  );
}
