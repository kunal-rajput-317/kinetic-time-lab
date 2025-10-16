import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Timer, Play, Pause, RotateCcw, Flag } from "lucide-react";

export const Stopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return {
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
      milliseconds: String(milliseconds).padStart(2, "0"),
    };
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps([...laps, time]);
    }
  };

  const { hours, minutes, seconds, milliseconds } = formatTime(time);

  return (
    <div className="w-full animate-fade-in">
      <div className="glass-card p-8 md:p-12">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Timer className="w-8 h-8 text-primary" />
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Stopwatch</h2>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="digital-display text-5xl md:text-7xl text-primary glow-text">
            {hours}
          </div>
          <div className="digital-display text-5xl md:text-7xl text-primary">:</div>
          <div className="digital-display text-5xl md:text-7xl text-secondary glow-text">
            {minutes}
          </div>
          <div className="digital-display text-5xl md:text-7xl text-secondary">:</div>
          <div className="digital-display text-5xl md:text-7xl text-accent glow-text">
            {seconds}
          </div>
          <div className="digital-display text-3xl md:text-4xl text-muted-foreground ml-2">
            .{milliseconds}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Button
            onClick={handleStartPause}
            className="btn-glow min-w-[120px]"
            size="lg"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start
              </>
            )}
          </Button>
          <Button
            onClick={handleLap}
            variant="secondary"
            className="btn-glow min-w-[120px]"
            size="lg"
            disabled={!isRunning}
          >
            <Flag className="w-5 h-5 mr-2" />
            Lap
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

        {laps.length > 0 && (
          <div className="glass-card p-4 max-h-64 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Laps</h3>
            <div className="space-y-2">
              {laps.map((lapTime, index) => {
                const { hours, minutes, seconds, milliseconds } = formatTime(lapTime);
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
                  >
                    <span className="font-medium text-foreground">Lap {index + 1}</span>
                    <span className="digital-display text-lg text-primary">
                      {hours}:{minutes}:{seconds}.{milliseconds}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
