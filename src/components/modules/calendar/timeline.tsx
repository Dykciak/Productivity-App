import { HourSlot } from "@/components/modules/calendar/hour-slot";
import { CalendarSyncMock } from "@/components/modules/calendar/calendar-sync-mock";
import type { TaskWithTimeBlock } from "@/lib/types";

const START_HOUR = 6;
const END_HOUR = 22;

export function Timeline({ tasks }: { tasks: TaskWithTimeBlock[] }) {
  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
  const scheduled = tasks.filter((t) => t.timeBlock);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Drag a task here to time-block it</p>
        <CalendarSyncMock />
      </div>
      <div className="max-h-72 flex-1 overflow-y-auto no-scrollbar">
        {hours.map((hour) => (
          <HourSlot
            key={hour}
            hour={hour}
            tasks={scheduled.filter((t) => t.timeBlock?.startHour === hour)}
          />
        ))}
      </div>
    </div>
  );
}
