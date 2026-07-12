import { format } from "date-fns";

function getGreeting(hour: number) {
  if (hour < 5) return "Burning the midnight oil";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function GreetingHeader() {
  const now = new Date();
  const greeting = getGreeting(now.getHours());
  const dateLabel = format(now, "EEEE, MMMM d");

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium text-muted-foreground">{dateLabel}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {greeting}. Let&apos;s do something amazing.
      </h1>
    </div>
  );
}
