import type { Metadata } from "next";
import { Fira_Sans, Fira_Code } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/nav/sidebar";
import { InboxCapture } from "@/components/modules/inbox/inbox-capture";
import { prisma } from "@/lib/prisma";

const firaSans = Fira_Sans({
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daybase — Personal Productivity Dashboard",
  description: "Tasks, calendar, habits, goals, and finances in one workspace.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const inboxNotes = await prisma.inboxNote.findMany({
    where: { resolved: false },
    orderBy: { createdAt: "desc" },
  });

  return (
    <html
      lang="en"
      className={`dark ${firaSans.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Sidebar />
        <div className="flex-1 pb-16 md:pb-0 md:pl-56">{children}</div>
        <InboxCapture notes={inboxNotes} />
      </body>
    </html>
  );
}
