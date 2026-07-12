"use client";

import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function CalendarSyncMock() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
          <CalendarPlus className="h-3.5 w-3.5" />
          Connect calendar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>External calendar sync</DialogTitle>
          <DialogDescription>
            Google Calendar and Apple Calendar integrations are coming soon. Once connected,
            events from those calendars will appear directly on this timeline alongside your
            time-blocked tasks.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" disabled className="justify-start gap-2">
            Google Calendar
          </Button>
          <Button variant="secondary" disabled className="justify-start gap-2">
            Apple Calendar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
