import { CloudSun, Droplets, Wind } from "lucide-react";
import type { WeatherSnapshot } from "@/lib/types";

// TODO: replace with a live provider (e.g. Open-Meteo) once a location source is wired up.
const MOCK_WEATHER: WeatherSnapshot = {
  locationLabel: "Warsaw",
  temperatureC: 24,
  condition: "sunny",
  high: 27,
  low: 17,
};

export function WeatherWidget() {
  const w = MOCK_WEATHER;
  return (
    <div className="flex h-full items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary">
        <CloudSun className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums">{w.temperatureC}°C</span>
          <span className="text-sm text-muted-foreground">{w.locationLabel}</span>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Wind className="h-3.5 w-3.5" /> H:{w.high}° L:{w.low}°
          </span>
          <span className="flex items-center gap-1">
            <Droplets className="h-3.5 w-3.5" /> Clear skies
          </span>
        </div>
      </div>
    </div>
  );
}
