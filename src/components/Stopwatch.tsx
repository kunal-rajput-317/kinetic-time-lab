import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Timer, Play, Pause, RotateCcw, Flag } from "lucide-react";
import sandClockImage from "@/assets/sand-clock.jpeg";

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
      setLaps([time, ...laps]);
    }
  };

  const { hours, minutes, seconds, milliseconds } = formatTime(time);
  const progressPercentage = ((time % 60000) / 60000) * 100;

  return (
    <div className="w-full animate-scale-in">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="p-3 rounded-2xl bg-secondary/20 border border-secondary/30">
              <Timer className="w-7 h-7 text-secondary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-card-foreground">Stopwatch</h2>
          </div>

          <div className="flex flex-col items-center justify-center mb-10">
            <div className="relative mb-8">
              <img 
                src={sandClockImage} 
                alt="Sand Clock" 
                className="w-48 h-48 object-contain drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.3))'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <div className="digital-display text-2xl text-secondary font-bold">
                    {seconds}
                  </div>
                  <div className="text-xs text-muted-foreground">seconds</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <div className="digital-display text-4xl md:text-6xl text-primary glow-text">
                {hours}
              </div>
              <div className="digital-display text-4xl md:text-6xl text-primary/50">:</div>
              <div className="digital-display text-4xl md:text-6xl text-secondary glow-text">
                {minutes}
              </div>
              <div className="digital-display text-4xl md:text-6xl text-secondary/50">:</div>
              <div className="digital-display text-4xl md:text-6xl text-accent glow-text">
                {seconds}
              </div>
              <div className="digital-display text-2xl md:text-3xl text-muted-foreground ml-2">
                .{milliseconds}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Button
              onClick={handleStartPause}
              className="btn-glow min-w-[140px]"
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
              className="btn-glow min-w-[140px]"
              size="lg"
              disabled={!isRunning}
            >
              <Flag className="w-5 h-5 mr-2" />
              Lap
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

          {laps.length > 0 && (
            <div className="glass-card p-5 max-h-80 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-card-foreground">Lap Times</h3>
                <span className="text-sm text-card-foreground/70 font-medium">
                  {laps.length} {laps.length === 1 ? "lap" : "laps"}
                </span>
              </div>
              <div className="space-y-2">
                {laps.map((lapTime, index) => {
                  const { hours, minutes, seconds, milliseconds } = formatTime(lapTime);
                  const lapDiff = index < laps.length - 1 ? lapTime - laps[index + 1] : lapTime;
                  const diffFormatted = formatTime(lapDiff);
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 bg-card-foreground/10 rounded-xl hover:bg-card-foreground/20 transition-all animate-slide-in border border-card-foreground/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {laps.length - index}
                          </span>
                        </div>
                        <span className="font-semibold text-card-foreground">
                          Lap {laps.length - index}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="digital-display text-lg text-secondary font-bold">
                          {hours}:{minutes}:{seconds}.{milliseconds}
                        </div>
                        <div className="digital-display text-xs text-card-foreground/60">
                          +{diffFormatted.minutes}:{diffFormatted.seconds}.{diffFormatted.milliseconds}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
