import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Plus, Minus, Sparkles, Moon, Zap } from "lucide-react";
import { toast } from "sonner";

type ThemeMode = 'classic' | 'futuristic' | 'minimal';

export const AnimatedSandTimer = () => {
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('futuristic');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const progressPercentage = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playCompletionSound();
            toast.success("Time's up! ⏰");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const playCompletionSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2); // E5
    oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.4); // G5
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.8);
  };

  const handleStart = () => {
    if (timeLeft === 0) {
      const total = minutes * 60 + seconds;
      if (total <= 0) {
        toast.error("Please set a valid time");
        return;
      }
      setTotalTime(total);
      setTimeLeft(total);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setTotalTime(0);
    setIsFlipping(true);
    setTimeout(() => setIsFlipping(false), 600);
  };

  const adjustTime = (type: 'minutes' | 'seconds', increment: boolean) => {
    if (isRunning) return;
    
    if (type === 'minutes') {
      setMinutes(prev => Math.max(0, Math.min(59, prev + (increment ? 1 : -1))));
    } else {
      setSeconds(prev => Math.max(0, Math.min(59, prev + (increment ? 1 : -1))));
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getThemeColors = () => {
    switch(theme) {
      case 'classic':
        return {
          frame: 'from-amber-700 via-amber-600 to-amber-800',
          glass: 'from-amber-100/20 to-amber-50/10',
          sand: 'from-amber-400 via-amber-500 to-amber-600',
          glow: 'rgba(217, 119, 6, 0.4)',
          bg: 'from-amber-950/80 to-amber-900/60'
        };
      case 'minimal':
        return {
          frame: 'from-gray-300 via-gray-200 to-gray-400',
          glass: 'from-white/30 to-white/10',
          sand: 'from-gray-400 via-gray-500 to-gray-600',
          glow: 'rgba(156, 163, 175, 0.3)',
          bg: 'from-gray-100/80 to-gray-50/60'
        };
      default: // futuristic
        return {
          frame: 'from-primary via-accent to-primary',
          glass: 'from-primary/20 to-primary/5',
          sand: 'from-primary via-secondary to-accent',
          glow: 'hsl(var(--primary) / 0.4)',
          bg: 'from-primary/10 to-accent/5'
        };
    }
  };

  const colors = getThemeColors();
  const isTimerActive = timeLeft > 0;
  const topSandLevel = isTimerActive ? 100 - progressPercentage : 100;
  const bottomSandLevel = isTimerActive ? progressPercentage : 0;

  return (
    <div className="w-full animate-scale-in">
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} pointer-events-none`} />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-current opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                color: theme === 'classic' ? '#d97706' : theme === 'minimal' ? '#9ca3af' : 'hsl(var(--primary))',
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          {/* Header with theme switcher */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-card-foreground">Sand Clock Timer</h2>
            
            <div className="flex gap-2">
              <Button
                onClick={() => setTheme('classic')}
                variant={theme === 'classic' ? 'default' : 'outline'}
                size="sm"
                className="backdrop-blur-sm"
              >
                <Moon className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setTheme('futuristic')}
                variant={theme === 'futuristic' ? 'default' : 'outline'}
                size="sm"
                className="backdrop-blur-sm"
              >
                <Zap className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setTheme('minimal')}
                variant={theme === 'minimal' ? 'default' : 'outline'}
                size="sm"
                className="backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isTimerActive ? (
            // Timer Setup View
            <div className="flex flex-col items-center space-y-6">
              <div className="flex gap-6 items-center">
                <div className="flex flex-col items-center">
                  <Button
                    onClick={() => adjustTime('minutes', true)}
                    variant="outline"
                    size="icon"
                    className="mb-2 backdrop-blur-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-20 text-center text-2xl font-bold backdrop-blur-sm"
                    min="0"
                    max="59"
                  />
                  <Button
                    onClick={() => adjustTime('minutes', false)}
                    variant="outline"
                    size="icon"
                    className="mt-2 backdrop-blur-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground mt-2">Minutes</span>
                </div>

                <span className="text-4xl font-bold">:</span>

                <div className="flex flex-col items-center">
                  <Button
                    onClick={() => adjustTime('seconds', true)}
                    variant="outline"
                    size="icon"
                    className="mb-2 backdrop-blur-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={seconds}
                    onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-20 text-center text-2xl font-bold backdrop-blur-sm"
                    min="0"
                    max="59"
                  />
                  <Button
                    onClick={() => adjustTime('seconds', false)}
                    variant="outline"
                    size="icon"
                    className="mt-2 backdrop-blur-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground mt-2">Seconds</span>
                </div>
              </div>

              <Button
                onClick={handleStart}
                size="lg"
                className="btn-glow"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Timer
              </Button>
            </div>
          ) : (
            // Active Timer View
            <div className="flex flex-col items-center space-y-8">
              {/* Hourglass Container */}
              <div className="relative" style={{
                filter: `drop-shadow(0 0 40px ${colors.glow})`,
              }}>
                <div 
                  className={`relative transition-transform duration-600 ${isFlipping ? 'rotate-180' : ''}`}
                  style={{
                    width: '280px',
                    height: '400px',
                  }}
                >
                  {/* Hourglass Frame */}
                  <svg
                    viewBox="0 0 200 300"
                    className="absolute inset-0 w-full h-full"
                    style={{
                      filter: timeLeft === 0 ? 'drop-shadow(0 0 20px currentColor)' : 'none',
                      animation: timeLeft === 0 ? 'shake 0.5s ease-in-out infinite' : 'none',
                    }}
                  >
                    {/* Glass outer shape */}
                    <path
                      d="M 50 20 L 150 20 L 150 80 L 100 150 L 150 220 L 150 280 L 50 280 L 50 220 L 100 150 L 50 80 Z"
                      fill="url(#glassGradient)"
                      stroke={theme === 'classic' ? '#d97706' : theme === 'minimal' ? '#9ca3af' : 'hsl(var(--primary))'}
                      strokeWidth="3"
                      opacity="0.3"
                    />
                    
                    {/* Frame decoration */}
                    <rect x="40" y="10" width="120" height="15" rx="5" fill={`url(#frameGradient)`} />
                    <rect x="40" y="275" width="120" height="15" rx="5" fill={`url(#frameGradient)`} />
                    
                    {/* Center neck decoration */}
                    <ellipse cx="100" cy="150" rx="15" ry="8" fill={`url(#frameGradient)`} opacity="0.8" />

                    {/* Gradients */}
                    <defs>
                      <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="white" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="white" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient id="frameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={theme === 'classic' ? '#f59e0b' : theme === 'minimal' ? '#d1d5db' : 'hsl(var(--primary))'} />
                        <stop offset="50%" stopColor={theme === 'classic' ? '#d97706' : theme === 'minimal' ? '#9ca3af' : 'hsl(var(--secondary))'} />
                        <stop offset="100%" stopColor={theme === 'classic' ? '#b45309' : theme === 'minimal' ? '#6b7280' : 'hsl(var(--accent))'} />
                      </linearGradient>
                      <linearGradient id="sandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={theme === 'classic' ? '#fbbf24' : theme === 'minimal' ? '#9ca3af' : 'hsl(var(--primary))'} />
                        <stop offset="50%" stopColor={theme === 'classic' ? '#f59e0b' : theme === 'minimal' ? '#6b7280' : 'hsl(var(--secondary))'} />
                        <stop offset="100%" stopColor={theme === 'classic' ? '#d97706' : theme === 'minimal' ? '#4b5563' : 'hsl(var(--accent))'} />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Top Sand */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 transition-all duration-1000 ease-linear"
                    style={{
                      top: '40px',
                      width: '120px',
                      height: `${(topSandLevel / 100) * 100}px`,
                      clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                    }}
                  >
                    <div className={`w-full h-full bg-gradient-to-b ${colors.sand} rounded-t-lg`}
                      style={{
                        boxShadow: `inset 0 -2px 10px rgba(0,0,0,0.3), 0 0 20px ${colors.glow}`,
                      }}
                    />
                    {/* Sand particles falling */}
                    {isRunning && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-20 animate-sand-fall"
                        style={{
                          background: `linear-gradient(to bottom, ${theme === 'classic' ? '#f59e0b' : theme === 'minimal' ? '#9ca3af' : 'hsl(var(--primary))'}, transparent)`,
                        }}
                      />
                    )}
                  </div>

                  {/* Bottom Sand */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 transition-all duration-1000 ease-linear"
                    style={{
                      bottom: '40px',
                      width: '120px',
                      height: `${(bottomSandLevel / 100) * 100}px`,
                      clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)',
                    }}
                  >
                    <div className={`w-full h-full bg-gradient-to-b ${colors.sand} rounded-b-lg`}
                      style={{
                        boxShadow: `inset 0 2px 10px rgba(0,0,0,0.3), 0 0 20px ${colors.glow}`,
                      }}
                    />
                  </div>

                  {/* Countdown Display Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`px-6 py-3 rounded-xl backdrop-blur-xl border-2 ${theme === 'classic' ? 'bg-amber-900/40 border-amber-500/50' : theme === 'minimal' ? 'bg-gray-800/40 border-gray-400/50' : 'bg-primary/20 border-primary/40'}`}>
                      <div className={`digital-display text-4xl font-bold ${theme === 'classic' ? 'text-amber-400' : theme === 'minimal' ? 'text-gray-300' : 'text-primary'} glow-text`}>
                        {formatTime(timeLeft)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md">
                <div className="h-2 bg-card-foreground/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className={`h-full bg-gradient-to-r ${colors.sand} transition-all duration-1000 ease-linear`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-center mt-2 text-sm text-muted-foreground">
                  {Math.round(progressPercentage)}% Complete
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                {isRunning ? (
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    size="lg"
                    className="backdrop-blur-sm"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button
                    onClick={handleStart}
                    variant="outline"
                    size="lg"
                    className="backdrop-blur-sm"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Resume
                  </Button>
                )}
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="backdrop-blur-sm"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Theme Label */}
              <div className="text-center text-sm text-muted-foreground">
                Theme: <span className="font-semibold capitalize">{theme}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};