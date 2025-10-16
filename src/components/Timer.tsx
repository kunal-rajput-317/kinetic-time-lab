import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlarmClock, Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const Timer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            toast.success("Timer Complete!", {
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
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setIsEditing(true);
  };

  const displayTime = isEditing
    ? formatTime(hours * 3600 + minutes * 60 + seconds)
    : formatTime(totalSeconds);

  return (
    <div className="w-full animate-fade-in">
      <div className="glass-card p-8 md:p-12">
        <div className="flex items-center justify-center gap-3 mb-8">
          <AlarmClock className="w-8 h-8 text-primary" />
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Countdown Timer</h2>
        </div>

        {isEditing ? (
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Hours
                </label>
                <Input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                  className="text-center digital-display text-2xl h-16 glass-card border-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Minutes
                </label>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="text-center digital-display text-2xl h-16 glass-card border-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Seconds
                </label>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="text-center digital-display text-2xl h-16 glass-card border-2"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="digital-display text-5xl md:text-7xl text-primary glow-text">
              {displayTime.hours}
            </div>
            <div className="digital-display text-5xl md:text-7xl text-primary">:</div>
            <div className="digital-display text-5xl md:text-7xl text-secondary glow-text">
              {displayTime.minutes}
            </div>
            <div className="digital-display text-5xl md:text-7xl text-secondary">:</div>
            <div className="digital-display text-5xl md:text-7xl text-accent glow-text">
              {displayTime.seconds}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={handleStart}
            className="btn-glow min-w-[120px]"
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
            className="btn-glow border-2 min-w-[120px]"
            size="lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};
