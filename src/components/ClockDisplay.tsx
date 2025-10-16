import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock as ClockIcon, Calendar } from "lucide-react";

export const ClockDisplay = () => {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    let period = "";

    if (!is24Hour) {
      period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
    }

    return {
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
      period,
    };
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const { hours, minutes, seconds, period } = formatTime(time);

  return (
    <div className="w-full animate-scale-in">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
              <ClockIcon className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Current Time</h2>
          </div>

          <div className="flex items-center justify-center gap-3 md:gap-6 mb-10">
            <div className="relative">
              <div className="digital-display text-6xl md:text-8xl lg:text-9xl text-primary glow-text transition-all duration-300">
                {hours}
              </div>
            </div>
            <div className="digital-display text-6xl md:text-8xl lg:text-9xl text-primary/50 animate-pulse">
              :
            </div>
            <div className="relative">
              <div className="digital-display text-6xl md:text-8xl lg:text-9xl text-secondary glow-text transition-all duration-300">
                {minutes}
              </div>
            </div>
            <div className="digital-display text-6xl md:text-8xl lg:text-9xl text-secondary/50 animate-pulse">
              :
            </div>
            <div className="relative">
              <div className="digital-display text-6xl md:text-8xl lg:text-9xl text-accent glow-text transition-all duration-300">
                {seconds}
              </div>
            </div>
            {!is24Hour && (
              <div className="digital-display text-3xl md:text-4xl lg:text-5xl text-muted-foreground ml-2 md:ml-4">
                {period}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 mb-8 p-4 rounded-2xl bg-muted/20 border border-border/30 max-w-lg mx-auto">
            <Calendar className="w-5 h-5 text-primary" />
            <p className="text-lg md:text-xl text-foreground font-medium">
              {formatDate(time)}
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => setIs24Hour(!is24Hour)}
              variant="outline"
              size="lg"
              className="btn-glow border-2 font-semibold"
            >
              <ClockIcon className="w-4 h-4 mr-2" />
              {is24Hour ? "12" : "24"}-Hour Format
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
