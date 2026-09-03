import React from "react";

type GlassButtonProps = {
  children: React.ReactNode;
  href: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
  target?: string;  // ✅ optional
  rel?: string;     // ✅ optional
};

const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  href,
  icon,
  variant = "primary",
  target,
  rel,
}) => {
  const base = `
    relative group inline-flex items-center justify-center gap-3
    px-8 py-4 rounded-2xl text-lg font-semibold overflow-hidden
    backdrop-blur-xl border transition-all duration-500
    hover:scale-[1.05] hover:-translate-y-1
  `;

  const styles = {
    primary: `
      text-white
      bg-gradient-to-br from-[var(--site-cta-from)] to-[var(--site-cta-to)]
      border-white/20
      shadow-[0_10px_30px_-5px_rgba(37,99,235,0.6)]
      hover:shadow-[0_20px_50px_-10px_rgba(37,99,235,0.9)]
    `,
    secondary: `
      text-white
      bg-gradient-to-br from-green-600 to-green-600
      border-white/40
      shadow-[0_10px_25px_-5px_rgba(34,197,94,0.3)]
      hover:bg-green-900
      hover:shadow-[0_20px_50px_-10px_rgba(34,197,94,0.9)]
    `,
  };

  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : rel} // ✅ smart handling
      className={`${base} ${styles[variant]}`}
    >
      {/* Glass Sweep */}
      <span className="absolute inset-0 overflow-hidden rounded-2xl">
        <span className="glass-sweep" />
      </span>

      {/* Glow */}
      <span
        className={`
          absolute inset-0 rounded-2xl blur-xl opacity-40
          ${variant === "primary" ? "bg-[rgb(var(--site-primary-rgb)_/_0.3)]" : "bg-green-400/30"}
          group-hover:opacity-70 transition duration-500
        `}
      />

      {/* Shine */}
      <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon && (
          <span className="text-xl transition-transform duration-300 group-hover:scale-110">
            {icon}
          </span>
        )}
        <span>{children}</span>
      </span>
    </a>
  );
};

export default GlassButton;