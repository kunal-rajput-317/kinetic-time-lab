import { useState, useEffect } from "react";
import { Clock as ClockIcon } from "lucide-react";

export const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDegrees = (hours * 30) + (minutes * 0.5);
  const minuteDegrees = minutes * 6;
  const secondDegrees = seconds * 6;

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="w-full animate-scale-in">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-primary/20 border border-primary/30">
              <ClockIcon className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-card-foreground">Analog Clock</h2>
          </div>

          {/* Clock Container */}
          <div className="flex flex-col items-center gap-8">
            {/* Clock Face */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-primary/30 bg-card/50 shadow-2xl backdrop-blur-sm">
              {/* Clock center decorative ring */}
              <div className="absolute inset-4 rounded-full border-2 border-secondary/20" />
              
              {/* Hour markers */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x = 50 + 38 * Math.cos(angle);
                const y = 50 + 38 * Math.sin(angle);
                return (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-primary"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                );
              })}

              {/* Hour numbers */}
              {[12, 3, 6, 9].map((num) => {
                const angle = ((num === 12 ? 0 : num) * 30 - 90) * (Math.PI / 180);
                const x = 50 + 42 * Math.cos(angle);
                const y = 50 + 42 * Math.sin(angle);
                return (
                  <div
                    key={num}
                    className="absolute text-xl md:text-2xl font-bold text-card-foreground digital-display"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {num}
                  </div>
                );
              })}

              {/* Hour hand */}
              <div
                className="absolute left-1/2 bottom-1/2 origin-bottom w-2 bg-primary rounded-full transition-transform duration-1000 shadow-lg"
                style={{
                  height: '25%',
                  transform: `translateX(-50%) rotate(${hourDegrees}deg)`,
                }}
              />

              {/* Minute hand */}
              <div
                className="absolute left-1/2 bottom-1/2 origin-bottom w-1.5 bg-secondary rounded-full transition-transform duration-1000 shadow-lg"
                style={{
                  height: '35%',
                  transform: `translateX(-50%) rotate(${minuteDegrees}deg)`,
                }}
              />

              {/* Second hand */}
              <div
                className="absolute left-1/2 bottom-1/2 origin-bottom w-1 bg-accent rounded-full transition-transform duration-1000 shadow-lg"
                style={{
                  height: '38%',
                  transform: `translateX(-50%) rotate(${secondDegrees}deg)`,
                }}
              />

              {/* Center dot */}
              <div className="absolute left-1/2 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary border-2 border-card shadow-lg" />
            </div>

            {/* Pendulum */}
            <div className="relative w-32 h-40 flex justify-center">
              <div
                className="absolute top-0 w-1 h-32 bg-gradient-to-b from-card-foreground to-primary rounded-full origin-top animate-pendulum"
                style={{
                  animation: 'pendulum 2s ease-in-out infinite',
                }}
              />
              <div
                className="absolute w-8 h-8 rounded-full bg-primary border-4 border-primary/50 shadow-lg animate-pendulum"
                style={{
                  top: '120px',
                  animation: 'pendulum 2s ease-in-out infinite',
                }}
              />
            </div>

            {/* Date Display */}
            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-card-foreground/10 border border-card-foreground/20 max-w-lg">
              <p className="text-lg md:text-xl text-card-foreground font-medium">
                {formatDate(time)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
