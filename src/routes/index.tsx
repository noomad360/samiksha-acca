import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, FileCheck, GraduationCap, ListChecks, Target } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ACCA FA Mock Exam — Financial Accounting Simulator" },
      {
        name: "description",
        content:
          "Simulate the real ACCA FA / FFA Financial Accounting exam. 35 Section A questions, 2 Section B long questions, 2-hour timer, instant marking and full explanations.",
      },
      { property: "og:title", content: "ACCA FA Mock Exam Simulator" },
      {
        property: "og:description",
        content: "Free ACCA Financial Accounting mock with timer and explanations.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-brand text-brand-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">ACCA Mock</div>
              <div className="text-xs text-muted-foreground leading-tight">
                Financial Accounting
              </div>
            </div>
          </Link>
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            <a href="#about" className="hover:text-foreground">
              About
            </a>
            <a href="#format" className="hover:text-foreground">
              Exam format
            </a>
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
          </nav>
          <Link to="/exam">
            <Button size="sm">Start mock</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-brand opacity-[0.04]" />
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-medium text-brand">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                FA / FFA · Sep 2020 – Aug 2021 Mock
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
                Sit a realistic <span className="text-brand">ACCA Financial Accounting</span> mock
                exam.
              </h1>
              <p className="mt-4 max-w-xl text-balance text-muted-foreground md:text-lg">
                35 Section A questions, 2 Section B long questions, 2-hour timer, instant marking
                and worked explanations — built to mirror the computer-based exam environment.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/exam">
                  <Button size="lg" className="bg-gradient-brand shadow-elegant">
                    Start the mock exam
                  </Button>
                </Link>
                <a href="#format">
                  <Button size="lg" variant="outline">
                    View exam format
                  </Button>
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand" /> 2 hours
                </div>
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-brand" /> 37 questions
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-brand" /> 100 marks
                </div>
              </div>
            </div>

            {/* Decorative exam card */}
            <div className="relative">
              <div className="rounded-2xl border bg-card p-6 shadow-elegant">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-brand">
                    Question 1 of 35
                  </div>
                  <div className="rounded-md bg-muted px-2 py-1 font-mono text-xs">01:58:42</div>
                </div>
                <p className="mt-4 text-sm">
                  Ink Co issued 100,000 $1 ordinary shares for $4 each. What was the balance on the
                  share premium account at 31 December 20X1?
                </p>
                <div className="mt-4 space-y-2 text-sm">
                  {["$50,000", "$350,000", "$450,000", "$150,000"].map((o, i) => (
                    <div
                      key={o}
                      className={`flex items-center gap-3 rounded-md border px-3 py-2 ${
                        i === 1 ? "border-brand bg-brand/5" : ""
                      }`}
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {o}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -right-3 -top-3 h-24 w-24 rounded-full bg-brand/10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Format */}
      <section id="format" className="border-t bg-card">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold">Exam format</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Mirrors the official ACCA FA / FFA computer-based exam.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <FormatCard
              title="Section A"
              meta="35 questions · 2 marks each · 70 marks"
              body="Multiple-choice, multiple-response and numeric entry questions covering the entire FA syllabus."
              live
            />
            <FormatCard
              title="Section B"
              meta="2 questions · 15 marks each · 30 marks"
              body="Long-form constructed-response questions for consolidation and financial statements. Answers are captured for manual marking."
              live
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold">Built to feel like the real exam</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Feature
            icon={<Clock className="h-5 w-5" />}
            title="Strict 2-hour timer"
            body="Auto-submit when time runs out, exactly like the CBE."
          />
          <Feature
            icon={<ListChecks className="h-5 w-5" />}
            title="Question navigator"
            body="Jump between questions, flag for review, see your progress."
          />
          <Feature
            icon={<FileCheck className="h-5 w-5" />}
            title="Instant marking"
            body="Full breakdown with explanations for every question."
          />
          <Feature
            icon={<BookOpen className="h-5 w-5" />}
            title="Authentic syllabus"
            body="Sourced from a Kaplan ACCA FA mock paper."
          />
          <Feature
            icon={<Target className="h-5 w-5" />}
            title="Pass mark 50%"
            body="Track your score against the official pass threshold."
          />
          <Feature
            icon={<GraduationCap className="h-5 w-5" />}
            title="No sign-up"
            body="Free, anonymous and runs in your browser."
          />
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="bg-gradient-brand text-brand-foreground">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">Ready to sit the mock?</h2>
          <p className="mx-auto mt-3 max-w-xl opacity-90">
            Find a quiet place, set aside 2 hours, and treat it like the real thing. Good luck.
          </p>
          <Link to="/exam">
            <Button size="lg" variant="secondary" className="mt-6">
              Begin exam
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t bg-card">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-muted-foreground">
          Independent study tool. Not affiliated with or endorsed by ACCA. Question content adapted
          from a Kaplan FA mock (Sep 2020 – Aug 2021) for educational purposes.
        </div>
      </footer>
    </div>
  );
}

function FormatCard({
  title,
  meta,
  body,
  live,
}: {
  title: string;
  meta: string;
  body: string;
  live?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-background p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        {live ? (
          <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
            Simulated here
          </span>
        ) : (
          <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            Practise offline
          </span>
        )}
      </div>
      <div className="mt-1 text-sm font-medium text-brand">{meta}</div>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand/10 text-brand">
        {icon}
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
