import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlarmClock, Play, Pause, RotateCcw, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { SandClock } from "./SandClock";

export const Timer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [initialSeconds, setInitialSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            toast.success("Timer Complete! 🎉", {
              description: "Your countdown has finished!",
              duration: 5000,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, totalSeconds]);

  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    return {
      hours: String(h).padStart(2, "0"),
      minutes: String(m).padStart(2, "0"),
      seconds: String(s).padStart(2, "0"),
    };
  };

  const handleStart = () => {
    if (isEditing) {
      const total = hours * 3600 + minutes * 60 + seconds;
      if (total > 0) {
        setTotalSeconds(total);
        setInitialSeconds(total);
        setIsEditing(false);
        setIsRunning(true);
      } else {
        toast.error("Please set a valid time");
      }
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTotalSeconds(0);
    setInitialSeconds(0);
    setHours(0);
    setMinutes(5);
    setSeconds(0);
    setIsEditing(true);
  };

  const adjustTime = (type: "hours" | "minutes" | "seconds", increment: boolean) => {
    const change = increment ? 1 : -1;
    if (type === "hours") {
      setHours(Math.max(0, Math.min(23, hours + change)));
    } else if (type === "minutes") {
      setMinutes(Math.max(0, Math.min(59, minutes + change)));
    } else {
      setSeconds(Math.max(0, Math.min(59, seconds + change)));
    }
  };

  const displayTime = isEditing
    ? formatTime(hours * 3600 + minutes * 60 + seconds)
    : formatTime(totalSeconds);

  const progressPercentage = initialSeconds > 0 ? ((initialSeconds - totalSeconds) / initialSeconds) * 100 : 0;

  return (
    <div className="w-full animate-scale-in">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="p-3 rounded-2xl bg-accent/20 border border-accent/30">
              <AlarmClock className="w-7 h-7 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-card-foreground">Countdown Timer</h2>
          </div>

          {isEditing ? (
            <div className="space-y-8 mb-10">
              <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
                {[
                  { label: "Hours", value: hours, type: "hours" as const, max: 23 },
                  { label: "Minutes", value: minutes, type: "minutes" as const, max: 59 },
                  { label: "Seconds", value: seconds, type: "seconds" as const, max: 59 },
                ].map(({ label, value, type, max }) => (
                  <div key={type} className="space-y-3">
                    <label className="block text-sm font-semibold text-card-foreground/80 text-center uppercase tracking-wide">
                      {label}
                    </label>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => adjustTime(type, true)}
                        className="w-full btn-glow border-2"
                        disabled={value >= max}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        min="0"
                        max={max}
                        value={value}
                        onChange={(e) => {
                          const val = Math.max(0, Math.min(max, parseInt(e.target.value) || 0));
                          if (type === "hours") setHours(val);
                          else if (type === "minutes") setMinutes(val);
                          else setSeconds(val);
                        }}
                        className="text-center digital-display text-3xl md:text-4xl h-20 glass-card border-2 font-bold"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => adjustTime(type, false)}
                        className="w-full btn-glow border-2"
                        disabled={value <= 0}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mb-10">
              {/* Sand Clock Visualization */}
              <div className="mb-8">
                <SandClock progress={progressPercentage} />
              </div>

              {/* Time Display */}
              <div className="flex items-center gap-2 md:gap-3">
                <div className="digital-display text-5xl md:text-7xl text-primary glow-text">
                  {displayTime.hours}
                </div>
                <div className="digital-display text-5xl md:text-7xl text-primary/50">:</div>
                <div className="digital-display text-5xl md:text-7xl text-secondary glow-text">
                  {displayTime.minutes}
                </div>
                <div className="digital-display text-5xl md:text-7xl text-secondary/50">:</div>
                <div className="digital-display text-5xl md:text-7xl text-accent glow-text">
                  {displayTime.seconds}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={handleStart}
              className="btn-glow min-w-[140px]"
              size="lg"
            >
              {isEditing || !isRunning ? (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              )}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="btn-glow border-2 min-w-[140px]"
              size="lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
