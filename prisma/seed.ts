import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function daysAgo(n: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

function today() {
  return daysAgo(0);
}

async function isDatabaseEmpty() {
  const [taskCount, projectCount, bookCount, imageCount, noteCount, transactionCount] = await Promise.all([
    prisma.task.count(),
    prisma.project.count(),
    prisma.book.count(),
    prisma.visionImage.count(),
    prisma.note.count(),
    prisma.transaction.count(),
  ]);
  return taskCount + projectCount + bookCount + imageCount + noteCount + transactionCount === 0;
}

async function main() {
  // This seed is a first-run bootstrap only. It never touches a database that already
  // has real content — re-running it (e.g. after a schema migration) must be a safe no-op,
  // not a way to accidentally wipe everything a user has entered.
  if (!(await isDatabaseEmpty())) {
    console.log("Database already has data — skipping seed to avoid overwriting it.");
    return;
  }

  const oneThing = await prisma.task.create({
    data: {
      title: "Ship the Q3 client proposal",
      notes: "Final pass on pricing tiers before the 4pm call.",
      isUrgent: true,
      isImportant: true,
      timeframe: "TODAY",
      isOneThing: true,
    },
  });

  await prisma.timeBlock.create({
    data: { taskId: oneThing.id, startHour: 9, durationHours: 2 },
  });

  const todayTasks = await Promise.all(
    [
      { title: "Reply to Marta re: contract redlines", isUrgent: true, isImportant: true, hour: 11 },
      { title: "Book dentist appointment", isUrgent: true, isImportant: false, hour: null },
      { title: "Review PR #482", isUrgent: false, isImportant: true, hour: 14 },
      { title: "Tidy up inbox to zero", isUrgent: false, isImportant: false, hour: null },
    ].map((t) =>
      prisma.task.create({
        data: {
          title: t.title,
          isUrgent: t.isUrgent,
          isImportant: t.isImportant,
          timeframe: "TODAY",
          ...(t.hour
            ? { timeBlock: { create: { startHour: t.hour, durationHours: 1 } } }
            : {}),
        },
      })
    )
  );

  await Promise.all(
    [
      { title: "Plan Spanish lesson schedule", isUrgent: false, isImportant: true },
      { title: "Renew car insurance", isUrgent: true, isImportant: false },
      { title: "Draft Q3 OKRs", isUrgent: false, isImportant: true },
      { title: "Clean out garage", isUrgent: false, isImportant: false },
    ].map((t) =>
      prisma.task.create({
        data: { title: t.title, isUrgent: t.isUrgent, isImportant: t.isImportant, timeframe: "WEEK" },
      })
    )
  );

  await Promise.all(
    [
      { title: "Repaint the living room", isImportant: false },
      { title: "Research standing desks", isImportant: false },
      { title: "Learn to bake sourdough", isImportant: true },
    ].map((t) =>
      prisma.task.create({
        data: { title: t.title, isImportant: t.isImportant, timeframe: "SOMEDAY" },
      })
    )
  );

  const habitDefs = await Promise.all([
    prisma.habitDef.create({ data: { name: "Drink 2L of water", icon: "GlassWater", color: "secondary" } }),
    prisma.habitDef.create({ data: { name: "Read for 15 mins", icon: "BookOpen", color: "accent" } }),
    prisma.habitDef.create({ data: { name: "Move for 30 mins", icon: "Dumbbell", color: "warning" } }),
    prisma.habitDef.create({ data: { name: "No phone after 10pm", icon: "MoonStar", color: "primary" } }),
  ]);

  const streakPattern = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];
  for (const habit of habitDefs) {
    for (let i = 0; i < 30; i++) {
      const isStreakDay = i < streakPattern.length ? streakPattern[i] : Math.random() > 0.35;
      if (habit.name.includes("phone") && i >= 6 && i < 9) continue;
      await prisma.habitEntry.create({
        data: { habitId: habit.id, date: daysAgo(i), completed: isStreakDay },
      });
    }
  }

  const spanishProject = await prisma.project.create({
    data: {
      title: "Learn Spanish to B2 level",
      description: "Conversational fluency before the Madrid trip in October.",
      targetDate: new Date(2026, 9, 1),
      subtasks: {
        create: [
          { title: "Finish Duolingo tree", completed: true },
          { title: "Complete 20 iTalki conversation sessions", completed: true },
          { title: "Watch 10 movies with Spanish subtitles", completed: false },
          { title: "Pass B2 mock exam", completed: false },
          { title: "Read a novel in Spanish", completed: false },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      title: "Launch personal portfolio site",
      description: "Redesign and ship v2 of the personal site.",
      targetDate: new Date(2026, 7, 15),
      subtasks: {
        create: [
          { title: "Wireframe homepage", completed: true },
          { title: "Write 3 case studies", completed: true },
          { title: "Build responsive layout", completed: false },
          { title: "Deploy to production", completed: false },
        ],
      },
    },
  });
  void spanishProject;

  await prisma.journalEntry.create({
    data: {
      date: daysAgo(1),
      grateful: "A quiet morning coffee and no meetings before 10am.",
      wentWell: "Finally closed out the backlog of code reviews.",
      couldImprove: "Went to bed too late again — aim for 11pm tonight.",
      rating: 7,
    },
  });

  await prisma.inboxNote.createMany({
    data: [
      { content: "App idea: shared grocery list with recipe import" },
      { content: "Ask accountant about Q3 estimated taxes" },
      { content: "Gift idea for mom's birthday: pottery class" },
    ],
  });

  const budgetCategories = await Promise.all([
    prisma.budgetCategory.create({ data: { name: "Groceries", monthlyLimit: 500, icon: "ShoppingCart" } }),
    prisma.budgetCategory.create({ data: { name: "Entertainment", monthlyLimit: 150, icon: "Clapperboard" } }),
    prisma.budgetCategory.create({ data: { name: "Transport", monthlyLimit: 200, icon: "Car" } }),
    prisma.budgetCategory.create({ data: { name: "Dining Out", monthlyLimit: 250, icon: "UtensilsCrossed" } }),
  ]);

  await prisma.incomeCategory.createMany({
    data: [
      { name: "Salary" },
      { name: "Freelance" },
      { name: "Investments" },
      { name: "Gifts" },
      { name: "Other" },
    ],
  });

  await prisma.transaction.create({
    data: { amount: 4800, type: "INCOME", category: "Salary", date: daysAgo(11) },
  });
  await prisma.transaction.create({
    data: { amount: 650, type: "INCOME", category: "Freelance", date: daysAgo(4) },
  });

  const expenseSeed: Array<{ category: string; amount: number; daysBack: number; note?: string }> = [
    { category: "Groceries", amount: 84.2, daysBack: 9, note: "Weekly shop" },
    { category: "Groceries", amount: 112.5, daysBack: 5, note: "Costco run" },
    { category: "Groceries", amount: 46.1, daysBack: 1 },
    { category: "Entertainment", amount: 32, daysBack: 8, note: "Cinema tickets" },
    { category: "Entertainment", amount: 45, daysBack: 2, note: "Concert" },
    { category: "Transport", amount: 60, daysBack: 10, note: "Gas" },
    { category: "Transport", amount: 38, daysBack: 3 },
    { category: "Dining Out", amount: 58, daysBack: 7, note: "Date night" },
    { category: "Dining Out", amount: 24, daysBack: 2, note: "Lunch with Marta" },
    { category: "Dining Out", amount: 19.5, daysBack: 0 },
  ];

  for (const e of expenseSeed) {
    await prisma.transaction.create({
      data: {
        amount: e.amount,
        type: "EXPENSE",
        category: e.category,
        note: e.note,
        date: daysAgo(e.daysBack),
      },
    });
  }
  void budgetCategories;

  await prisma.savingsGoal.createMany({
    data: [
      { name: "Vacation Fund — Madrid", targetAmount: 2500, currentAmount: 1150, icon: "Plane" },
      { name: "Emergency Fund", targetAmount: 10000, currentAmount: 7200, icon: "ShieldCheck" },
      { name: "New Laptop", targetAmount: 1800, currentAmount: 420, icon: "Laptop" },
    ],
  });

  const learningPlan: Array<{ title: string; description: string; subtasks: string[] }> = [
    {
      title: "Months 1–2: Full-Stack Refresh + Base Project",
      description: "School + self-study, no full-time job.",
      subtasks: [
        "1.1. Refresh Next.js (App Router, Server Actions, Server Components) and Node/TS.",
        "1.2. Project: Build a full CRUD application with authentication (NextAuth/Auth.js), database (Postgres + Prisma), and deployment to Vercel/Railway.",
        "1.3. Write solid tests (Vitest/Jest) – to build the habit early on.",
        "1.4. Push to GitHub with a clean, readable README (this will be your first \"portfolio piece\").",
      ],
    },
    {
      title: "Month 2 (Parallel): Python Basics",
      description: "The AI ecosystem lives mostly in Python.",
      subtasks: [
        "2.1. Syntax, working with APIs, requests, async/await.",
        "2.2. This is necessary because the entire AI ecosystem (LangChain, LlamaIndex, OpenAI/Anthropic SDKs) lives mostly in Python.",
        "2.3. You don't need to be a master – a level of \"I can comfortably write scripts and integrations\" is enough.",
      ],
    },
    {
      title: "Month 3: LLM Fundamentals (Theory but Practical)",
      description: "Tokens, context windows, models, and prompting.",
      subtasks: [
        "3.1. How tokens, context windows, temperature, and embeddings work.",
        "3.2. Differences between models (cost/latency/quality) – when to use which.",
        "3.3. Prompt engineering: few-shot, chain-of-thought, structured outputs (JSON mode).",
        "3.4. Mini-project: A simple chatbot using an API (Anthropic/OpenAI) integrated into your Next.js app.",
      ],
    },
    {
      title: "Month 4: Integrating AI with a Web Application",
      description: "Streaming, tool use, and a real agent project.",
      subtasks: [
        "4.1. Streaming responses (SSE) in Next.js.",
        "4.2. Function calling / tool use – having the model call your APIs.",
        "4.3. Project: An app with an agent that does something specific (e.g., searches a database, makes reservations, generates a report).",
      ],
    },
    {
      title: "Months 5–6: RAG (Retrieval-Augmented Generation)",
      description: "Vector databases, chunking, and a document chat app.",
      subtasks: [
        "5.1. Vector databases: pgvector (since you already know SQL) + explore Pinecone/Weaviate for comparison.",
        "5.2. Document chunking, embedding strategies.",
        "5.3. LangChain or LlamaIndex – but also try building a simple RAG \"from scratch\" without a framework to understand what happens under the hood.",
        "5.4. Project: \"Chat with your documents/PDFs\" app.",
      ],
    },
    {
      title: "Month 7: Agents and Orchestration",
      description: "Multi-step agents and Model Context Protocol.",
      subtasks: [
        "6.1. Multi-step agents, task planning.",
        "6.2. Model Context Protocol (MCP) – worth mastering, as it's currently an industry standard.",
        "6.3. Project: An agent combining several tools (e.g., web search + database querying + document generation).",
      ],
    },
    {
      title: "Month 8: LLM Ops / Quality / Production",
      description: "Evaluation, guardrails, cost, and monitoring.",
      subtasks: [
        "7.1. Model response evaluation (how to measure if it works well).",
        "7.2. Guardrails, error handling, fallbacks.",
        "7.3. Costs and optimization (caching, choosing the right model for the task).",
        "7.4. Basics of monitoring (logs, tracing – e.g., LangSmith or a custom solution).",
      ],
    },
    {
      title: "Month 9: Fine-tuning and Open-source Models (Basics)",
      description: "When fine-tuning makes sense, plus open-source basics.",
      subtasks: [
        "8.1. When fine-tuning makes sense and when RAG/prompting is enough (it's enough in 90% of cases).",
        "8.2. Basics of working with open-source models (Ollama locally, Hugging Face).",
        "8.3. It doesn't have to be deep – just enough to understand the topic and discuss it during an interview.",
      ],
    },
    {
      title: "Month 10: Capstone Project",
      description: "The main highlight of your CV and portfolio.",
      subtasks: [
        "9.1. One larger, polished product combining everything: full-stack + RAG + agent + nice UI.",
        "9.2. Something that solves a real problem (not just another \"AI ToDo app\") – preferably related to your interests (e.g., a tool for analyzing financial reports/stocks).",
        "9.3. This will be the main highlight of your CV and portfolio.",
      ],
    },
    {
      title: "Continuous / Ongoing Throughout the Year",
      description: "English, Git flow, algorithms, and reading — every month.",
      subtasks: [
        "10.1. Technical English – reading documentation, watching talks, writing code/commits in English.",
        "10.2. Git/GitHub flow, code reviews, basics of CI/CD (GitHub Actions).",
        "10.3. Algorithms/Data Structures – kept light, just enough to pass recruitment tasks (LeetCode Easy/Medium, 2-3 times a week).",
        "10.4. Reading: 1-2 technical books/blogs on AI engineering per month (e.g., Anthropic, OpenAI, Simon Willison blogs).",
      ],
    },
    {
      title: "Months 11–12: Entering the Market",
      description: "CV, networking, applications, and interview prep.",
      subtasks: [
        "11.1. Polishing your CV and GitHub to highlight \"AI + full-stack\".",
        "11.2. Community activity (Twitter/X, AI devs Discords, local meetups) – networking opens doors faster than a CV.",
        "11.3. Applying for Junior/Mid Full-Stack positions with an AI component.",
        "11.4. Interview prep: live coding + questions regarding RAG/agent architecture.",
      ],
    },
  ];

  for (let i = 0; i < learningPlan.length; i++) {
    const module = learningPlan[i];
    await prisma.project.create({
      data: {
        title: module.title,
        description: module.description,
        category: "learning",
        order: i,
        subtasks: {
          create: module.subtasks.map((title, j) => ({ title, order: j })),
        },
      },
    });
  }

  await prisma.book.createMany({
    data: [
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        status: "READING",
        coverUrl: "https://picsum.photos/seed/hail-mary/300/450",
      },
      {
        title: "Deep Work",
        author: "Cal Newport",
        status: "READING",
        coverUrl: "https://picsum.photos/seed/deep-work/300/450",
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        status: "WANT_TO_READ",
        coverUrl: "https://picsum.photos/seed/atomic-habits/300/450",
      },
      { title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", status: "WANT_TO_READ" },
      {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        status: "READ",
        coverUrl: "https://picsum.photos/seed/sapiens/300/450",
      },
      {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        status: "READ",
        coverUrl: "https://picsum.photos/seed/hobbit/300/450",
      },
    ],
  });

  await prisma.visionImage.createMany({
    data: [
      { url: "https://picsum.photos/seed/vision-1/500/700", caption: "Morning hikes" },
      { url: "https://picsum.photos/seed/vision-2/500/350", caption: "Minimal workspace" },
      { url: "https://picsum.photos/seed/vision-3/500/650", caption: "Madrid trip" },
      { url: "https://picsum.photos/seed/vision-4/500/500", caption: "Home garden" },
      { url: "https://picsum.photos/seed/vision-5/500/750" },
      { url: "https://picsum.photos/seed/vision-6/500/400", caption: "New bike" },
      { url: "https://picsum.photos/seed/vision-7/500/600", caption: "Reading nook" },
      { url: "https://picsum.photos/seed/vision-8/500/450" },
    ],
  });

  await prisma.note.createMany({
    data: [
      {
        title: "Client call prep",
        content:
          "<p><strong>Q3 proposal call — 4pm</strong></p><ul><li>Confirm <em>pricing tiers</em> before the call</li><li>Bring up the <u>timeline slip</u> from last sprint</li><li>Ask about renewal terms</li></ul>",
      },
      {
        title: "Recipe: weeknight stir fry",
        content:
          "<p>Quick and easy, ready in <strong>20 minutes</strong>.</p><ol><li>Slice chicken thin, marinate in soy + garlic</li><li>Stir fry veg on <em>high heat</em></li><li>Add sauce, toss, serve over rice</li></ol>",
      },
      {
        title: "Book ideas for next quarter",
        content:
          "<p>Half-formed thoughts, not committing to anything yet.</p><p>Maybe worth a <u>proper outline</u> before Q4.</p>",
      },
    ],
  });

  console.log("Seed complete for", today().toDateString());
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
