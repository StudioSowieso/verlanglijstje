// Versiering in de stijl van het kerstkaartje. Alles is puur decoratief.

type StarburstProps = { size: number; className?: string; flip?: boolean };

export function Starburst({ size, className, flip }: StarburstProps) {
  const rays = Array.from({ length: 16 }, (_, i) => i);
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
    >
      {rays.map((i) => {
        const long = i % 2 === 0;
        return (
          <line
            key={i}
            x1="50"
            y1={long ? 3 : 13}
            x2="50"
            y2="44"
            stroke={long !== Boolean(flip) ? "#c8202f" : "#f47fae"}
            strokeWidth={long ? 5 : 4}
            strokeLinecap="round"
            transform={`rotate(${i * 22.5} 50 50)`}
          />
        );
      })}
    </svg>
  );
}

export function Sparkle({
  size,
  color = "#d7ad62",
  className,
}: {
  size: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 0c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12z"
        fill={color}
      />
    </svg>
  );
}

// Een dennentakje: rechte steel met naaldparen die schuin naar de punt wijzen
// en kleiner worden richting het uiteinde.
const NEEDLE_PAIRS = Array.from({ length: 19 }, (_, i) => {
  const t = i / 18;
  return {
    x: 24 + i * 9.8,
    length: 36 - t * 20,
    angle: 40 - t * 6,
  };
});

function needle(length: number) {
  const w = length * 0.13;
  return `M0 0 C${length * 0.25} ${-w} ${length * 0.7} ${-w * 0.9} ${length} 0 C${length * 0.7} ${w * 0.9} ${length * 0.25} ${w} 0 0Z`;
}

export function PineBranch({
  className,
  width = 260,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <svg
      viewBox="0 0 230 90"
      width={width}
      height={(width * 90) / 230}
      aria-hidden="true"
      className={className}
    >
      {NEEDLE_PAIRS.map((n, i) => (
        <g key={n.x} transform={`translate(${n.x} 45)`}>
          <path
            d={needle(n.length)}
            fill={i % 2 === 0 ? "#2f6b3a" : "#3f8049"}
            transform={`rotate(${n.angle})`}
          />
          <path
            d={needle(n.length)}
            fill={i % 2 === 0 ? "#3f8049" : "#2f6b3a"}
            transform={`rotate(${-n.angle})`}
          />
        </g>
      ))}
      <path d={needle(20)} fill="#3f8049" transform="translate(206 45)" />
      <path
        d="M6 45 L210 45"
        stroke="#b3a553"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Peppermint({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          "repeating-conic-gradient(from 10deg, #c8202f 0deg 24deg, #f4ece0 24deg 36deg, #f47fae 36deg 60deg, #f4ece0 60deg 72deg)",
        boxShadow: "inset 0 0 0 5px #f4ece0",
      }}
    />
  );
}

// Het gat en touwtje van een hangend label.
export function TagHole({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 40 64"
        width="40"
        height="64"
        aria-hidden="true"
        className="absolute -top-12 left-1/2 -translate-x-1/2 overflow-visible"
      >
        <path
          d="M20 52 C 18 30, 30 14, 18 0"
          stroke="#d7ad62"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="relative block h-5 w-5 rounded-full bg-forest-deep shadow-[inset_0_2px_3px_rgb(0_0_0/0.5)]" />
    </span>
  );
}

// Achtergrond: vast achter de inhoud, zodat het als behang blijft staan.
export function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <Peppermint size={150} className="absolute -left-12 -top-14" />
      <Starburst size={230} className="absolute -right-16 -top-10 md:right-6" />
      <PineBranch
        width={300}
        className="absolute -left-20 top-28 hidden rotate-[28deg] md:block"
      />
      <Starburst
        size={150}
        flip
        className="absolute -left-10 bottom-24 hidden lg:block"
      />
      <PineBranch
        width={320}
        className="absolute -right-24 top-[55%] hidden rotate-[-32deg] md:block"
      />
      <PineBranch
        width={260}
        className="absolute -bottom-6 left-[12%] hidden rotate-[-8deg] lg:block"
      />
      <Peppermint size={130} className="absolute -bottom-12 -right-8" />
      <Sparkle
        size={34}
        color="#f4ece0"
        className="absolute left-[9%] top-[34%]"
      />
      <Sparkle size={26} className="absolute right-[12%] top-[40%]" />
      <Sparkle
        size={30}
        color="#f4ece0"
        className="absolute bottom-[18%] right-[22%]"
      />
      <Sparkle
        size={22}
        className="absolute bottom-[30%] left-[24%] hidden md:block"
      />
    </div>
  );
}
