import { useState } from "react";
import { ClockDisplay } from "@/components/ClockDisplay";
import { Stopwatch } from "@/components/Stopwatch";
import { Timer } from "@/components/Timer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Clock, Timer as TimerIcon, Gauge, Sparkles } from "lucide-react";

type Tab = "clock" | "stopwatch" | "timer";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("clock");

  const tabs = [
    { id: "clock" as Tab, label: "Clock", icon: Clock, description: "Current time" },
    { id: "stopwatch" as Tab, label: "Stopwatch", icon: Gauge, description: "Track duration" },
    { id: "timer" as Tab, label: "Timer", icon: TimerIcon, description: "Countdown" },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Floating background shapes */}
      <div className="floating-shapes">
        <div className="shape w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <div className="shape w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />
        <div className="shape w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center p-4 md:p-8 min-h-screen">
        <ThemeToggle />
        
        <main className="w-full max-w-5xl">
          {/* Hero Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full glass-card border-2 border-primary/30">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">Professional Time Management</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-4 digital-display glow-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Digital Clock
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              Track time with precision, style, and elegance
            </p>
          </div>

          {/* Tab Navigation */}
          <nav className="flex flex-wrap justify-center gap-3 mb-10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group relative flex items-center gap-3 px-6 md:px-8 py-4 rounded-2xl font-semibold transition-all duration-300
                    ${
                      isActive
                        ? "glass-card text-foreground btn-glow scale-105 border-2"
                        : "glass-card text-muted-foreground hover:text-foreground hover:scale-105 border-2 border-transparent hover:border-border/50"
                    }
                  `}
                  style={{
                    borderColor: isActive ? "hsl(var(--primary))" : undefined,
                  }}
                >
                  <div className={`p-2 rounded-xl transition-colors ${
                    isActive 
                      ? "bg-primary/20 border border-primary/30" 
                      : "bg-muted/50 group-hover:bg-primary/10"
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-base font-bold">{tab.label}</div>
                    <div className="text-xs opacity-70">{tab.description}</div>
                  </div>
                  <div className="text-left sm:hidden">
                    <div className="text-sm font-bold">{tab.label}</div>
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Tab Content */}
          <div className="transition-all duration-500">
            {activeTab === "clock" && <ClockDisplay />}
            {activeTab === "stopwatch" && <Stopwatch />}
            {activeTab === "timer" && <Timer />}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card border border-border/30">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-sm text-muted-foreground font-medium">
              Built with precision and passion
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
