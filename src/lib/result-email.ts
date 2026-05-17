import { questions, type Question } from "@/data/questions";

type StoredAnswer = string | string[] | number | null;

type ResultPayload = {
  answers: Record<string, StoredAnswer>;
  finishedAt?: number;
  timeUsed?: number;
};

type RuntimeEnv = Record<string, unknown>;

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
  to: string;
};

function getRuntimeValue(env: unknown, key: string): string | undefined {
  if (env && typeof env === "object" && key in env) {
    const value = (env as RuntimeEnv)[key];
    if (typeof value === "string" && value.trim() !== "") return value;
  }

  const processEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env;
  const value = processEnv?.[key];
  return value && value.trim() !== "" ? value : undefined;
}

function getSmtpConfig(env: unknown): SmtpConfig | null {
  const host = getRuntimeValue(env, "SMTP_HOST");
  const user = getRuntimeValue(env, "SMTP_USER");
  const pass = getRuntimeValue(env, "SMTP_PASS");
  const to = getRuntimeValue(env, "RESULT_EMAIL_TO") ?? "saugat.codes@gmail.com";
  const from = getRuntimeValue(env, "SMTP_FROM") ?? user;
  const port = Number(getRuntimeValue(env, "SMTP_PORT") ?? "587");
  const secureValue = getRuntimeValue(env, "SMTP_SECURE");
  const secure = secureValue ? secureValue === "true" || secureValue === "1" : port === 465;

  if (!host || !from) return null;
  if ((user && !pass) || (!user && pass)) return null;

  return { host, port, secure, user, pass, from, to };
}

function isCorrect(question: Question, answer: StoredAnswer): boolean {
  if (question.type === "mcq") return answer === question.correct;
  if (question.type === "multi") {
    if (!Array.isArray(answer)) return false;
    if (answer.length !== question.correct.length) return false;
    return question.correct.every((correct) => answer.includes(correct));
  }
  if (question.type === "numeric") {
    if (typeof answer !== "number") return false;
    return Math.abs(answer - question.correct) <= (question.tolerance ?? 0);
  }
  return false;
}

function formatAnswer(question: Question, answer: StoredAnswer): string {
  if (answer === null || answer === undefined || (Array.isArray(answer) && answer.length === 0)) {
    return "Not answered";
  }
  if (question.type === "mcq") {
    const option = question.options.find((item) => item.key === answer);
    return option ? `${option.key}. ${option.text}` : String(answer);
  }
  if (question.type === "multi") {
    return [...(answer as string[])]
      .sort()
      .map((key) => {
        const option = question.options.find((item) => item.key === key);
        return option ? `${option.key}. ${option.text}` : key;
      })
      .join("; ");
  }
  if (question.type === "long") return String(answer).trim() || "Not answered";
  return `${question.unit ?? ""}${typeof answer === "number" ? answer.toLocaleString() : answer}`;
}

function correctAnswerText(question: Question): string {
  if (question.type === "mcq") {
    const option = question.options.find((item) => item.key === question.correct);
    return option ? `${option.key}. ${option.text}` : question.correct;
  }
  if (question.type === "multi") {
    return question.correct
      .map((key) => {
        const option = question.options.find((item) => item.key === key);
        return option ? `${option.key}. ${option.text}` : key;
      })
      .join("; ");
  }
  if (question.type === "long") return question.markingGuide;
  return `${question.unit ?? ""}${question.correct.toLocaleString()}`;
}

function questionBodyHtml(question: Question): string {
  const prompt = "title" in question ? `<p><strong>${escapeHtml(question.title)}</strong></p>` : "";
  const questionText = `<p>${paragraph(question.prompt)}</p>`;

  if (question.type === "mcq" || question.type === "multi") {
    const options = question.options
      .map(
        (option) =>
          `<li><strong>${escapeHtml(option.key)}.</strong> ${escapeHtml(option.text)}</li>`,
      )
      .join("");
    return `${prompt}${questionText}<p><strong>Options</strong></p><ol style="margin-top:0">${options}</ol>`;
  }

  if (question.type === "long") {
    const requirements = question.requirements
      .map(
        (requirement) =>
          `<li><strong>${escapeHtml(requirement.label)}</strong> ${escapeHtml(requirement.text)} [${requirement.marks} marks]</li>`,
      )
      .join("");
    return `${prompt}${questionText}<p><strong>Requirements</strong></p><ul>${requirements}</ul>`;
  }

  return `${prompt}${questionText}`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function paragraph(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

function formatDuration(seconds = 0): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}m ${remainder}s`;
}

function buildResultEmail(payload: ResultPayload): { subject: string; html: string; text: string } {
  const objectiveQuestions = questions.filter((question) => question.type !== "long");
  const correctCount = objectiveQuestions.filter((question) =>
    isCorrect(question, payload.answers[String(question.id)] ?? payload.answers[question.id]),
  ).length;
  const objectiveMarks = correctCount * 2;
  const totalObjectiveMarks = objectiveQuestions.reduce(
    (sum, question) => sum + (question.marks ?? 2),
    0,
  );
  const percent = Math.round((objectiveMarks / totalObjectiveMarks) * 100);
  const submittedAt = payload.finishedAt ? new Date(payload.finishedAt) : new Date();

  const rows = questions
    .map((question) => {
      const answer = payload.answers[String(question.id)] ?? payload.answers[question.id];
      const manual = question.type === "long";
      const status = manual
        ? "Manual review"
        : isCorrect(question, answer)
          ? "Correct"
          : "Incorrect";

      return `<section style="border-top:1px solid #ddd;padding:16px 0">
        <h3 style="margin:0 0 8px">Section ${escapeHtml(question.section ?? "A")} Q${question.id}: ${escapeHtml(status)}</h3>
        <div><strong>Question:</strong>${questionBodyHtml(question)}</div>
        <p><strong>Submitted answer:</strong><br>${paragraph(formatAnswer(question, answer))}</p>
        <p><strong>${manual ? "Official answer / marking guide" : "Correct answer"}:</strong><br>${paragraph(correctAnswerText(question))}</p>
        ${question.type !== "long" ? `<p><strong>Explanation:</strong><br>${paragraph(question.explanation)}</p>` : ""}
      </section>`;
    })
    .join("");

  const subject = `ACCA FA mock result: ${percent}% Section A`;
  const html = `<!doctype html>
    <html>
      <body style="font-family:Arial,sans-serif;line-height:1.45;color:#222">
        <h1>ACCA FA mock result</h1>
        <p><strong>Section A auto-marked score:</strong> ${objectiveMarks} / ${totalObjectiveMarks} (${percent}%)</p>
        <p><strong>Correct Section A answers:</strong> ${correctCount} / ${objectiveQuestions.length}</p>
        <p><strong>Time used:</strong> ${formatDuration(payload.timeUsed)}</p>
        <p><strong>Submitted at:</strong> ${escapeHtml(submittedAt.toISOString())}</p>
        <p>Section B long answers are included below for manual marking.</p>
        ${rows}
      </body>
    </html>`;
  const text = html
    .replace(/<br>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { subject, html, text };
}

function base64(value: string): string {
  return Buffer.from(value, "utf8").toString("base64");
}

function dotStuff(value: string): string {
  return value.replace(/^\./gm, "..");
}

async function sendSmtpMail(
  config: SmtpConfig,
  message: { subject: string; html: string; text: string },
) {
  const net = await import("node:net");
  const tls = await import("node:tls");
  type SocketLike = import("node:net").Socket | import("node:tls").TLSSocket;

  let socket: SocketLike = config.secure
    ? tls.connect(config.port, config.host, { servername: config.host })
    : net.connect(config.port, config.host);
  let buffer = "";

  socket.setEncoding("utf8");
  socket.on("data", (chunk) => {
    buffer += chunk;
  });

  function readResponse(): Promise<string> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error("Timed out waiting for SMTP response"));
      }, 15000);

      const cleanup = () => {
        clearTimeout(timeout);
        socket.off("data", onData);
        socket.off("error", onError);
      };

      const tryRead = () => {
        const lines = buffer.split(/\r?\n/).filter(Boolean);
        const completeIndex = lines.findIndex((line) => /^\d{3} /.test(line));
        if (completeIndex === -1) return;

        const responseLines = lines.slice(0, completeIndex + 1);
        buffer = lines.slice(completeIndex + 1).join("\r\n");
        cleanup();
        resolve(responseLines.join("\n"));
      };

      const onData = () => tryRead();
      const onError = (error: Error) => {
        cleanup();
        reject(error);
      };

      socket.on("data", onData);
      socket.on("error", onError);
      tryRead();
    });
  }

  async function expect(codes: number[]): Promise<string> {
    const response = await readResponse();
    const code = Number(response.match(/^(\d{3})/m)?.[1]);
    if (!codes.includes(code)) {
      throw new Error(`Unexpected SMTP response: ${response}`);
    }
    return response;
  }

  async function command(value: string, codes: number[]): Promise<string> {
    socket.write(`${value}\r\n`);
    return expect(codes);
  }

  await expect([220]);
  await command("EHLO localhost", [250]);

  if (!config.secure) {
    await command("STARTTLS", [220]);
    socket = tls.connect({ socket, servername: config.host });
    buffer = "";
    socket.setEncoding("utf8");
    socket.on("data", (chunk) => {
      buffer += chunk;
    });
    await command("EHLO localhost", [250]);
  }

  if (config.user && config.pass) {
    await command("AUTH LOGIN", [334]);
    await command(base64(config.user), [334]);
    await command(base64(config.pass), [235]);
  }

  const date = new Date().toUTCString();
  const email = [
    `From: ${config.from}`,
    `To: ${config.to}`,
    `Subject: ${message.subject}`,
    `Date: ${date}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "",
    message.html,
  ].join("\r\n");

  await command(`MAIL FROM:<${config.from}>`, [250]);
  await command(`RCPT TO:<${config.to}>`, [250, 251]);
  await command("DATA", [354]);
  socket.write(`${dotStuff(email)}\r\n.\r\n`);
  await expect([250]);
  await command("QUIT", [221]);
  socket.end();
}

export async function handleResultEmail(request: Request, env: unknown): Promise<Response> {
  let payload: ResultPayload;
  try {
    payload = (await request.json()) as ResultPayload;
  } catch {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    !payload.answers ||
    typeof payload.answers !== "object"
  ) {
    return Response.json({ error: "Invalid exam result payload" }, { status: 400 });
  }

  const config = getSmtpConfig(env);
  if (!config) {
    console.warn("Exam result email not sent because SMTP environment variables are incomplete.");
    return Response.json({ sent: false, configured: false }, { status: 202 });
  }

  try {
    await sendSmtpMail(config, buildResultEmail(payload));
    return Response.json({ sent: true, configured: true });
  } catch (error) {
    console.error("Exam result email failed", error);
    return Response.json({ sent: false, configured: true }, { status: 502 });
  }
}
