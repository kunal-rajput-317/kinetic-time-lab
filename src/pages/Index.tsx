import { useState } from "react";
import { ClockDisplay } from "@/components/ClockDisplay";
import { Stopwatch } from "@/components/Stopwatch";
import { Timer } from "@/components/Timer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Clock, Timer as TimerIcon, Gauge } from "lucide-react";

type Tab = "clock" | "stopwatch" | "timer";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("clock");

  const tabs = [
    { id: "clock" as Tab, label: "Clock", icon: Clock },
    { id: "stopwatch" as Tab, label: "Stopwatch", icon: Gauge },
    { id: "timer" as Tab, label: "Timer", icon: TimerIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <ThemeToggle />
      
      <main className="w-full max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 digital-display glow-text">
          Digital Clock
        </h1>
        <p className="text-center text-muted-foreground mb-8 text-lg">
          Track time with precision and style
        </p>

        {/* Tab Navigation */}
        <nav className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                  ${
                    activeTab === tab.id
                      ? "glass-card text-primary btn-glow scale-105 border-2 border-primary"
                      : "glass-card text-muted-foreground hover:text-foreground hover:scale-105 border border-border/50"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === "clock" && <ClockDisplay />}
          {activeTab === "stopwatch" && <Stopwatch />}
          {activeTab === "timer" && <Timer />}
        </div>
      </main>

      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>Built with precision and passion</p>
      </footer>
    </div>
  );
};

export default Index;
