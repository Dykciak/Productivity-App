import type {
  Task as PrismaTask,
  TimeBlock as PrismaTimeBlock,
  HabitDef as PrismaHabitDef,
  HabitEntry as PrismaHabitEntry,
  Project as PrismaProject,
  Subtask as PrismaSubtask,
  JournalEntry as PrismaJournalEntry,
  InboxNote as PrismaInboxNote,
  Transaction as PrismaTransaction,
  BudgetCategory as PrismaBudgetCategory,
  SavingsGoal as PrismaSavingsGoal,
  Book as PrismaBook,
  VisionImage as PrismaVisionImage,
} from "@prisma/client";

export const TIMEFRAMES = ["TODAY", "WEEK", "SOMEDAY"] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];

export const TRANSACTION_TYPES = ["INCOME", "EXPENSE"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const PROJECT_CATEGORIES = ["general", "learning"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const BOOK_STATUSES = ["READING", "WANT_TO_READ", "READ"] as const;
export type BookStatus = (typeof BOOK_STATUSES)[number];

export type Task = PrismaTask;
export type TimeBlock = PrismaTimeBlock;
export type HabitDef = PrismaHabitDef;
export type HabitEntry = PrismaHabitEntry;
export type Project = PrismaProject;
export type Subtask = PrismaSubtask;
export type JournalEntry = PrismaJournalEntry;
export type InboxNote = PrismaInboxNote;
export type Transaction = PrismaTransaction;
export type BudgetCategory = PrismaBudgetCategory;
export type SavingsGoal = PrismaSavingsGoal;
export type Book = PrismaBook;
export type VisionImage = PrismaVisionImage;

export type TaskWithTimeBlock = Task & { timeBlock: TimeBlock | null };
export type ProjectWithSubtasks = Project & { subtasks: Subtask[] };
export type HabitWithEntries = HabitDef & { entries: HabitEntry[] };

export interface EisenhowerQuadrants {
  urgentImportant: TaskWithTimeBlock[];
  notUrgentImportant: TaskWithTimeBlock[];
  urgentNotImportant: TaskWithTimeBlock[];
  notUrgentNotImportant: TaskWithTimeBlock[];
}

export interface WeatherSnapshot {
  locationLabel: string;
  temperatureC: number;
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "snowy" | "windy";
  high: number;
  low: number;
}
