"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { saveJournalEntry } from "@/lib/actions/journal";
import type { JournalEntry } from "@/lib/types";

export function EveningReflectionForm({ existingEntry }: { existingEntry: JournalEntry | null }) {
  const [grateful, setGrateful] = useState(existingEntry?.grateful ?? "");
  const [wentWell, setWentWell] = useState(existingEntry?.wentWell ?? "");
  const [couldImprove, setCouldImprove] = useState(existingEntry?.couldImprove ?? "");
  const [rating, setRating] = useState(existingEntry?.rating ?? 7);
  const [isPending, startTransition] = useTransition();
  const [savedJustNow, setSavedJustNow] = useState(false);

  function handleSave() {
    startTransition(async () => {
      await saveJournalEntry({ grateful, wentWell, couldImprove, rating });
      setSavedJustNow(true);
      setTimeout(() => setSavedJustNow(false), 2000);
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="grateful">What am I grateful for today?</Label>
        <Textarea id="grateful" value={grateful} onChange={(e) => setGrateful(e.target.value)} className="min-h-[70px]" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="went-well">What went well?</Label>
        <Textarea id="went-well" value={wentWell} onChange={(e) => setWentWell(e.target.value)} className="min-h-[70px]" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="could-improve">What could I have done better?</Label>
        <Textarea id="could-improve" value={couldImprove} onChange={(e) => setCouldImprove(e.target.value)} className="min-h-[70px]" />
      </div>
      <div className="space-y-3">
        <Label>
          Daily rating: <span className="font-semibold text-primary">{rating}/10</span>
        </Label>
        <Slider
          value={[rating]}
          min={1}
          max={10}
          step={1}
          onValueChange={([v]) => setRating(v)}
          className="mt-4"
        />
        <Button onClick={handleSave} disabled={isPending} className="w-full gap-2">
          {savedJustNow ? <Check className="h-4 w-4" /> : null}
          {savedJustNow ? "Saved" : "Save reflection"}
        </Button>
      </div>
    </div>
  );
}
