import { useEffect, useState } from "react";

interface SandClockProps {
  progress: number; // 0-100, percentage of time elapsed
}

export const SandClock = ({ progress }: SandClockProps) => {
  const [sandParticles, setSandParticles] = useState<Array<{ id: number; delay: number }>>([]);

  useEffect(() => {
    // Generate sand particles for animation
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: i * 0.1,
    }));
    setSandParticles(particles);
  }, []);

  // Calculate sand levels
  const topSandLevel = 100 - progress; // Top bulb empties as time passes
  const bottomSandLevel = progress; // Bottom bulb fills as time passes

  return (
    <div className="relative w-64 h-80 mx-auto">
      {/* Hourglass frame */}
      <svg
        viewBox="0 0 200 300"
        className="w-full h-full drop-shadow-2xl"
        style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.3))" }}
      >
        {/* Top frame */}
        <path
          d="M 40 20 L 160 20 L 160 40 L 140 40 L 100 140 L 60 40 L 40 40 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          className="opacity-40"
        />
        
        {/* Bottom frame */}
        <path
          d="M 40 280 L 160 280 L 160 260 L 140 260 L 100 160 L 60 260 L 40 260 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          className="opacity-40"
        />

        {/* Glass effect - top bulb */}
        <path
          d="M 50 30 L 150 30 L 150 50 L 130 50 L 100 130 L 70 50 L 50 50 Z"
          fill="hsl(var(--card))"
          fillOpacity="0.2"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />

        {/* Glass effect - bottom bulb */}
        <path
          d="M 50 270 L 150 270 L 150 250 L 130 250 L 100 170 L 70 250 L 50 250 Z"
          fill="hsl(var(--card))"
          fillOpacity="0.2"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />

        {/* Sand in top bulb */}
        <defs>
          <clipPath id="topBulb">
            <path d="M 50 30 L 150 30 L 150 50 L 130 50 L 100 130 L 70 50 L 50 50 Z" />
          </clipPath>
          <clipPath id="bottomBulb">
            <path d="M 50 270 L 150 270 L 150 250 L 130 250 L 100 170 L 70 250 L 50 250 Z" />
          </clipPath>
          
          {/* Sand gradient */}
          <linearGradient id="sandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Top bulb sand */}
        <g clipPath="url(#topBulb)">
          <rect
            x="50"
            y={30 + (100 - topSandLevel)}
            width="100"
            height={topSandLevel}
            fill="url(#sandGradient)"
            className="transition-all duration-1000"
          />
          {/* Sand texture */}
          {topSandLevel > 0 && (
            <g opacity="0.3">
              {Array.from({ length: 30 }).map((_, i) => (
                <circle
                  key={i}
                  cx={60 + Math.random() * 80}
                  cy={30 + (100 - topSandLevel) + Math.random() * topSandLevel}
                  r="1"
                  fill="hsl(var(--primary))"
                />
              ))}
            </g>
          )}
        </g>

        {/* Falling sand particles in the neck */}
        {progress > 0 && progress < 100 && (
          <g>
            {sandParticles.map((particle) => (
              <circle
                key={particle.id}
                cx="100"
                cy="150"
                r="1.5"
                fill="hsl(var(--accent))"
                className="animate-sand-fall"
                style={{
                  animationDelay: `${particle.delay}s`,
                }}
              />
            ))}
          </g>
        )}

        {/* Bottom bulb sand */}
        <g clipPath="url(#bottomBulb)">
          <rect
            x="50"
            y={270 - bottomSandLevel}
            width="100"
            height={bottomSandLevel}
            fill="url(#sandGradient)"
            className="transition-all duration-1000"
          />
          {/* Sand texture */}
          {bottomSandLevel > 0 && (
            <g opacity="0.3">
              {Array.from({ length: 30 }).map((_, i) => (
                <circle
                  key={`bottom-${i}`}
                  cx={60 + Math.random() * 80}
                  cy={270 - bottomSandLevel + Math.random() * bottomSandLevel}
                  r="1"
                  fill="hsl(var(--primary))"
                />
              ))}
            </g>
          )}
        </g>

        {/* Center connecting piece */}
        <ellipse
          cx="100"
          cy="150"
          rx="4"
          ry="2"
          fill="hsl(var(--primary))"
          opacity="0.5"
        />

        {/* Decorative stand - top */}
        <rect
          x="30"
          y="15"
          width="140"
          height="8"
          rx="4"
          fill="hsl(var(--primary))"
          opacity="0.6"
        />

        {/* Decorative stand - bottom */}
        <rect
          x="30"
          y="277"
          width="140"
          height="8"
          rx="4"
          fill="hsl(var(--primary))"
          opacity="0.6"
        />
      </svg>

      {/* Progress percentage display */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-12">
        <div className="digital-display text-2xl text-accent font-bold text-center">
          {Math.floor(progress)}%
        </div>
      </div>
    </div>
  );
};
