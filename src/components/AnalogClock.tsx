import { useState, useEffect, useRef } from "react";
import { Clock as ClockIcon, Volume2, VolumeX, Moon, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AnalogClock = () => {
  const [time, setTime] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mode, setMode] = useState<'vintage' | 'futuristic'>('futuristic');
  const audioContextRef = useRef<AudioContext | null>(null);
  const tickToggleRef = useRef(false);

  useEffect(() => {
    // Initialize Web Audio Context
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      
      // Play realistic tick-tock sound if enabled
      if (soundEnabled && audioContextRef.current) {
        playClockTick();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [soundEnabled, mode]);

  const playClockTick = () => {
    if (!audioContextRef.current) return;
    
    const audioContext = audioContextRef.current;
    const currentTime = audioContext.currentTime;
    
    // Alternate between tick and tock for authentic pendulum clock sound
    const isTick = tickToggleRef.current;
    tickToggleRef.current = !tickToggleRef.current;
    
    // Create multiple oscillators for richer, more realistic clock sound
    if (mode === 'vintage') {
      // Vintage mechanical clock sound - deep, wooden tick-tock
      // Primary tone
      const osc1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();
      osc1.connect(gain1);
      gain1.connect(audioContext.destination);
      
      osc1.type = 'sine';
      osc1.frequency.value = isTick ? 1200 : 1000; // Tick higher, tock lower
      gain1.gain.setValueAtTime(0.15, currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.08);
      
      osc1.start(currentTime);
      osc1.stop(currentTime + 0.08);
      
      // Add mechanical click (higher frequency short burst)
      const clickOsc = audioContext.createOscillator();
      const clickGain = audioContext.createGain();
      clickOsc.connect(clickGain);
      clickGain.connect(audioContext.destination);
      
      clickOsc.type = 'square';
      clickOsc.frequency.value = isTick ? 2400 : 2000;
      clickGain.gain.setValueAtTime(0.08, currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.02);
      
      clickOsc.start(currentTime);
      clickOsc.stop(currentTime + 0.02);
      
      // Bass resonance for wooden case effect
      const bassOsc = audioContext.createOscillator();
      const bassGain = audioContext.createGain();
      bassOsc.connect(bassGain);
      bassGain.connect(audioContext.destination);
      
      bassOsc.type = 'sine';
      bassOsc.frequency.value = isTick ? 180 : 150;
      bassGain.gain.setValueAtTime(0.06, currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.12);
      
      bassOsc.start(currentTime);
      bassOsc.stop(currentTime + 0.12);
      
    } else {
      // Futuristic digital clock sound - crisp, precise, slightly electronic
      const osc1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();
      osc1.connect(gain1);
      gain1.connect(audioContext.destination);
      
      osc1.type = 'sine';
      osc1.frequency.value = isTick ? 1800 : 1600;
      gain1.gain.setValueAtTime(0.12, currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.06);
      
      osc1.start(currentTime);
      osc1.stop(currentTime + 0.06);
      
      // High frequency ping for digital feel
      const pingOsc = audioContext.createOscillator();
      const pingGain = audioContext.createGain();
      pingOsc.connect(pingGain);
      pingGain.connect(audioContext.destination);
      
      pingOsc.type = 'sine';
      pingOsc.frequency.value = isTick ? 3600 : 3200;
      pingGain.gain.setValueAtTime(0.06, currentTime);
      pingGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.03);
      
      pingOsc.start(currentTime);
      pingOsc.stop(currentTime + 0.03);
      
      // Subtle sub-bass for depth
      const subOsc = audioContext.createOscillator();
      const subGain = audioContext.createGain();
      subOsc.connect(subGain);
      subGain.connect(audioContext.destination);
      
      subOsc.type = 'sine';
      subOsc.frequency.value = isTick ? 220 : 200;
      subGain.gain.setValueAtTime(0.04, currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.08);
      
      subOsc.start(currentTime);
      subOsc.stop(currentTime + 0.08);
    }
  };

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  const hourDegrees = (hours * 30) + (minutes * 0.5) + (seconds * 0.00833);
  const minuteDegrees = minutes * 6 + (seconds * 0.1);
  const secondDegrees = seconds * 6 + (milliseconds * 0.006);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatDigitalTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

  return (
    <div className="w-full animate-scale-in">
      <div className="glass-card p-4 md:p-8 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-95 pointer-events-none" />
        <div className={`absolute inset-0 ${mode === 'futuristic' ? 'bg-gradient-to-br from-primary/10 via-transparent to-accent/10' : 'bg-gradient-to-br from-amber-900/20 via-transparent to-amber-700/20'} pointer-events-none`} />
        
        {/* Ambient particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${mode === 'futuristic' ? 'bg-primary' : 'bg-amber-500'}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.3 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          {/* Header with controls */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${mode === 'futuristic' ? 'bg-primary/20 border border-primary/40' : 'bg-amber-900/30 border border-amber-700/50'} backdrop-blur-sm`}>
                <ClockIcon className={`w-6 h-6 ${mode === 'futuristic' ? 'text-primary' : 'text-amber-500'}`} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white glow-text">Pendulum Clock</h2>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="outline"
                size="sm"
                className={`${mode === 'futuristic' ? 'border-primary/40 hover:bg-primary/20' : 'border-amber-700/50 hover:bg-amber-900/30'} backdrop-blur-sm`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              
              <Button
                onClick={() => setMode(mode === 'vintage' ? 'futuristic' : 'vintage')}
                variant="outline"
                size="sm"
                className={`${mode === 'futuristic' ? 'border-primary/40 hover:bg-primary/20' : 'border-amber-700/50 hover:bg-amber-900/30'} backdrop-blur-sm`}
              >
                {mode === 'futuristic' ? <Zap className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Main Clock Container */}
          <div className="flex flex-col items-center">
            {/* Clock with spotlight effect */}
            <div 
              className="relative group perspective-1000"
              style={{
                filter: `drop-shadow(0 0 80px ${mode === 'futuristic' ? 'hsl(var(--primary) / 0.4)' : 'rgba(217, 119, 6, 0.4)'})`,
              }}
            >
              {/* Clock Case */}
              <div 
                className={`relative ${mode === 'futuristic' ? 'bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90' : 'bg-gradient-to-br from-amber-950/90 via-amber-900/80 to-amber-950/90'} rounded-full p-8 shadow-2xl border-8 ${mode === 'futuristic' ? 'border-primary/30' : 'border-amber-700/50'} backdrop-blur-xl transition-all duration-700 hover:scale-105 hover:rotate-y-12`}
                style={{
                  width: '380px',
                  height: '380px',
                  boxShadow: `0 20px 80px ${mode === 'futuristic' ? 'hsl(var(--primary) / 0.3)' : 'rgba(217, 119, 6, 0.3)'}, inset 0 2px 20px rgba(255,255,255,0.05)`,
                }}
              >
                {/* Holographic rings */}
                {mode === 'futuristic' && (
                  <>
                    <div className="absolute inset-0 rounded-full border border-primary/20 animate-glow-pulse" />
                    <div className="absolute inset-4 rounded-full border border-primary/15" style={{ animationDelay: '0.3s' }} />
                    <div className="absolute inset-8 rounded-full border border-primary/10" style={{ animationDelay: '0.6s' }} />
                  </>
                )}
                
                {/* Clock Face */}
                <div 
                  className={`relative w-full h-full rounded-full ${mode === 'futuristic' ? 'bg-gradient-to-br from-gray-950/90 to-gray-900/90 border-4 border-primary/20' : 'bg-gradient-to-br from-amber-950/90 to-amber-900/90 border-4 border-amber-700/40'} backdrop-blur-xl shadow-inner`}
                  style={{
                    boxShadow: `inset 0 4px 30px ${mode === 'futuristic' ? 'hsl(var(--primary) / 0.2)' : 'rgba(217, 119, 6, 0.2)'}`,
                  }}
                >
                  {/* Decorative inner ring with metallic sheen */}
                  <div className={`absolute inset-8 rounded-full border-2 ${mode === 'futuristic' ? 'border-primary/30' : 'border-amber-600/40'}`} style={{
                    background: mode === 'futuristic' 
                      ? 'linear-gradient(135deg, transparent 0%, hsl(var(--primary) / 0.05) 50%, transparent 100%)'
                      : 'linear-gradient(135deg, transparent 0%, rgba(217, 119, 6, 0.1) 50%, transparent 100%)'
                  }} />
                  
                  {/* Roman Numerals with glow */}
                  {romanNumerals.map((numeral, i) => {
                    const angle = (i * 30 - 90) * (Math.PI / 180);
                    const radius = 42;
                    const x = 50 + radius * Math.cos(angle);
                    const y = 50 + radius * Math.sin(angle);
                    
                    return (
                      <div
                        key={i}
                        className={`absolute text-xl md:text-2xl font-bold ${mode === 'futuristic' ? 'text-primary glow-text' : 'text-amber-400'}`}
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)',
                          fontFamily: 'Georgia, serif',
                          textShadow: mode === 'futuristic' 
                            ? '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary) / 0.5)'
                            : '0 0 10px rgba(217, 119, 6, 0.8), 0 0 20px rgba(217, 119, 6, 0.4)',
                        }}
                      >
                        {numeral}
                      </div>
                    );
                  })}

                  {/* Hour markers */}
                  {[...Array(60)].map((_, i) => {
                    if (i % 5 === 0) return null; // Skip positions with numerals
                    const angle = (i * 6 - 90) * (Math.PI / 180);
                    const radius = 44;
                    const x = 50 + radius * Math.cos(angle);
                    const y = 50 + radius * Math.sin(angle);
                    
                    return (
                      <div
                        key={i}
                        className={`absolute w-0.5 h-1.5 ${mode === 'futuristic' ? 'bg-primary/40' : 'bg-amber-600/40'}`}
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: `translate(-50%, -50%) rotate(${i * 6}deg)`,
                        }}
                      />
                    );
                  })}

                  {/* Hour hand with glow */}
                  <div
                    className={`absolute left-1/2 bottom-1/2 origin-bottom rounded-full ${mode === 'futuristic' ? 'bg-gradient-to-t from-primary to-primary/80' : 'bg-gradient-to-t from-amber-500 to-amber-400'}`}
                    style={{
                      width: '6px',
                      height: '28%',
                      transform: `translateX(-50%) rotate(${hourDegrees}deg)`,
                      transition: 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
                      boxShadow: mode === 'futuristic' 
                        ? '0 0 15px hsl(var(--primary)), 0 0 30px hsl(var(--primary) / 0.5)'
                        : '0 0 15px rgba(217, 119, 6, 0.8), 0 0 30px rgba(217, 119, 6, 0.4)',
                    }}
                  />

                  {/* Minute hand with glow */}
                  <div
                    className={`absolute left-1/2 bottom-1/2 origin-bottom rounded-full ${mode === 'futuristic' ? 'bg-gradient-to-t from-secondary to-secondary/80' : 'bg-gradient-to-t from-amber-300 to-amber-200'}`}
                    style={{
                      width: '4px',
                      height: '38%',
                      transform: `translateX(-50%) rotate(${minuteDegrees}deg)`,
                      transition: 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
                      boxShadow: mode === 'futuristic' 
                        ? '0 0 12px hsl(var(--secondary)), 0 0 25px hsl(var(--secondary) / 0.5)'
                        : '0 0 12px rgba(252, 211, 77, 0.8), 0 0 25px rgba(252, 211, 77, 0.4)',
                    }}
                  />

                  {/* Second hand with pulse glow */}
                  <div
                    className={`absolute left-1/2 bottom-1/2 origin-bottom rounded-full ${mode === 'futuristic' ? 'bg-accent' : 'bg-red-500'}`}
                    style={{
                      width: '2px',
                      height: '42%',
                      transform: `translateX(-50%) rotate(${secondDegrees}deg)`,
                      transition: 'transform 0.05s linear',
                      boxShadow: mode === 'futuristic' 
                        ? '0 0 10px hsl(var(--accent)), 0 0 20px hsl(var(--accent) / 0.6)'
                        : '0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.5)',
                      animation: 'glow-pulse 1s ease-in-out infinite',
                    }}
                  />

                  {/* Center hub with metallic effect */}
                  <div 
                    className={`absolute left-1/2 top-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full ${mode === 'futuristic' ? 'bg-gradient-to-br from-primary via-primary/90 to-primary/70 border-2 border-primary/50' : 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 border-2 border-amber-300/50'}`}
                    style={{
                      boxShadow: mode === 'futuristic'
                        ? '0 0 20px hsl(var(--primary)), inset 0 2px 5px rgba(255,255,255,0.3)'
                        : '0 0 20px rgba(217, 119, 6, 0.8), inset 0 2px 5px rgba(255,255,255,0.3)',
                    }}
                  />
                </div>
              </div>

              {/* Pendulum mechanism below clock */}
              <div 
                className={`relative mt-8 h-48 w-32 mx-auto ${mode === 'futuristic' ? 'bg-gradient-to-b from-gray-900/60 via-gray-800/40 to-gray-900/60' : 'bg-gradient-to-b from-amber-950/60 via-amber-900/40 to-amber-950/60'} rounded-2xl border-2 ${mode === 'futuristic' ? 'border-primary/20' : 'border-amber-700/30'} backdrop-blur-xl overflow-hidden`}
                style={{
                  boxShadow: `inset 0 2px 20px ${mode === 'futuristic' ? 'hsl(var(--primary) / 0.1)' : 'rgba(217, 119, 6, 0.1)'}`,
                }}
              >
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                
                {/* Pendulum anchor */}
                <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${mode === 'futuristic' ? 'bg-primary border-2 border-primary/50' : 'bg-amber-500 border-2 border-amber-400/50'} shadow-lg z-10`} />
                
                {/* Pendulum rod with smooth sine wave motion */}
                <div
                  className={`absolute ${mode === 'futuristic' ? 'bg-gradient-to-b from-primary via-primary/90 to-primary/80' : 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600'} rounded-full`}
                  style={{
                    width: '3px',
                    height: '60%',
                    top: '12px',
                    left: '50%',
                    transformOrigin: 'top center',
                    transform: 'translateX(-50%)',
                    animation: `pendulum-smooth 2s ease-in-out infinite`,
                    boxShadow: mode === 'futuristic'
                      ? '0 0 10px hsl(var(--primary) / 0.6)'
                      : '0 0 10px rgba(217, 119, 6, 0.6)',
                  }}
                />
                
                {/* Pendulum bob (golden/chrome weight) */}
                <div
                  className={`absolute w-12 h-16 rounded-full ${mode === 'futuristic' ? 'bg-gradient-to-br from-primary via-accent to-primary' : 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600'} border-3 shadow-2xl`}
                  style={{
                    top: 'calc(12px + 60% - 32px)',
                    left: '50%',
                    transformOrigin: 'top center',
                    transform: 'translateX(-50%)',
                    animation: `pendulum-smooth 2s ease-in-out infinite`,
                    boxShadow: mode === 'futuristic'
                      ? '0 10px 40px hsl(var(--primary) / 0.5), inset 0 2px 10px rgba(255,255,255,0.3), inset 0 -2px 10px rgba(0,0,0,0.3)'
                      : '0 10px 40px rgba(217, 119, 6, 0.5), inset 0 2px 10px rgba(255,255,255,0.3), inset 0 -2px 10px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Decorative engravings */}
                  <div className={`absolute inset-2 border-2 ${mode === 'futuristic' ? 'border-primary/40' : 'border-amber-300/40'} rounded-full`} />
                  <div className={`absolute inset-4 border ${mode === 'futuristic' ? 'border-primary/30' : 'border-amber-300/30'} rounded-full`} />
                  
                  {/* Chrome reflection */}
                  <div className="absolute top-1 left-2 right-2 h-4 bg-gradient-to-b from-white/30 to-transparent rounded-full blur-sm" />
                </div>
              </div>
            </div>

            {/* Digital time and date display */}
            <div className="mt-10 flex flex-col items-center gap-4 w-full max-w-md">
              {/* Digital time */}
              <div className={`w-full p-4 rounded-2xl ${mode === 'futuristic' ? 'bg-primary/10 border border-primary/30' : 'bg-amber-900/20 border border-amber-700/40'} backdrop-blur-xl`}>
                <div className="text-center">
                  <div className={`digital-display text-3xl md:text-4xl font-bold ${mode === 'futuristic' ? 'text-primary glow-text' : 'text-amber-400'}`}>
                    {formatDigitalTime(time)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Digital Display</div>
                </div>
              </div>
              
              {/* Date display */}
              <div className={`w-full p-4 rounded-2xl ${mode === 'futuristic' ? 'bg-secondary/10 border border-secondary/30' : 'bg-amber-900/20 border border-amber-700/40'} backdrop-blur-xl`}>
                <p className={`text-center text-base md:text-lg ${mode === 'futuristic' ? 'text-secondary' : 'text-amber-300'} font-medium`}>
                  {formatDate(time)}
                </p>
              </div>
              
              {/* Mode indicator */}
              <div className="text-center text-sm text-muted-foreground">
                Mode: <span className={`font-semibold ${mode === 'futuristic' ? 'text-primary' : 'text-amber-400'}`}>
                  {mode === 'futuristic' ? 'Futuristic Holographic' : 'Vintage Mechanical'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
