import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock as ClockIcon } from "lucide-react";

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
    <div className="w-full animate-fade-in">
      <div className="glass-card p-8 md:p-12">
        <div className="flex items-center justify-center gap-3 mb-8">
          <ClockIcon className="w-8 h-8 text-primary" />
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Current Time</h2>
        </div>

        <div className="flex items-center justify-center gap-2 md:gap-4 mb-6">
          <div className="digital-display text-6xl md:text-8xl text-primary glow-text">
            {hours}
          </div>
          <div className="digital-display text-6xl md:text-8xl text-primary glow-text animate-pulse">
            :
          </div>
          <div className="digital-display text-6xl md:text-8xl text-secondary glow-text">
            {minutes}
          </div>
          <div className="digital-display text-6xl md:text-8xl text-secondary glow-text animate-pulse">
            :
          </div>
          <div className="digital-display text-6xl md:text-8xl text-accent glow-text">
            {seconds}
          </div>
          {!is24Hour && (
            <div className="digital-display text-3xl md:text-4xl text-muted-foreground ml-2">
              {period}
            </div>
          )}
        </div>

        <div className="text-center mb-6">
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            {formatDate(time)}
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => setIs24Hour(!is24Hour)}
            variant="outline"
            className="btn-glow border-2"
          >
            Switch to {is24Hour ? "12" : "24"}-hour format
          </Button>
        </div>
      </div>
    </div>
  );
};
