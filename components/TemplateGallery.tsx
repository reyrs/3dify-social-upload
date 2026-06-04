"use client";

import { useState } from "react";
import type { SceneConfig } from "@/lib/generate-3d";

const DEMO_TEMPLATES: { name: string; desc: string; config: Partial<SceneConfig>; icon: string }[] = [
  {
    name: "Product Showcase",
    desc: "3D product rotation with glass material & soft glow",
    icon: "📦",
    config: {
      type: "product", animationType: "rotate", colors: ["#a855f7", "#ec4899", "#f97316"],
      particleCount: 30, musicVibe: "upbeat", duration: 8, cameraDistance: 4, lightIntensity: 1.8,
      title: "Product Showcase",
    },
  },
  {
    name: "Logo Reveal",
    desc: "Cinematic logo reveal with particles & float effect",
    icon: "✨",
    config: {
      type: "logo", animationType: "float", colors: ["#fbbf24", "#f59e0b", "#d97706"],
      particleCount: 60, musicVibe: "epic", duration: 6, cameraDistance: 3.5, lightIntensity: 2.0,
      title: "Logo Reveal",
    },
  },
  {
    name: "Abstract Art",
    desc: "Fluid abstract shapes with wave animation & chill vibe",
    icon: "🎨",
    config: {
      type: "abstract", animationType: "wave", colors: ["#06b6d4", "#3b82f6", "#8b5cf6"],
      particleCount: 200, musicVibe: "chill", duration: 10, cameraDistance: 6, lightIntensity: 1.5,
      title: "Abstract Flow",
    },
  },
  {
    name: "Typography",
    desc: "3D text block with pulsing glow & minimal aesthetic",
    icon: "🔤",
    config: {
      type: "text", animationType: "pulse", colors: ["#22c55e", "#10b981", "#14b8a6"],
      particleCount: 40, musicVibe: "minimal", duration: 5, cameraDistance: 3, lightIntensity: 1.6,
      title: "Typography Moment",
    },
  },
  {
    name: "Character",
    desc: "Hero character with burst particles & epic mood",
    icon: "🦸",
    config: {
      type: "character", animationType: "explode", colors: ["#ef4444", "#f97316", "#f59e0b"],
      particleCount: 100, musicVibe: "epic", duration: 8, cameraDistance: 5, lightIntensity: 2.2,
      title: "Character Reveal",
    },
  },
  {
    name: "Cyber City",
    desc: "Futuristic cyberpunk grid with neon waves",
    icon: "🌆",
    config: {
      type: "cyber", animationType: "wave", colors: ["#ff00ff", "#00ffff", "#ffff00"],
      particleCount: 300, musicVibe: "upbeat", duration: 7, cameraDistance: 4.5, lightIntensity: 1.9,
      title: "Cyber City",
    },
  },
];

interface TemplateGalleryProps {
  onSelect: (config: SceneConfig) => void;
}

export default function TemplateGallery({ onSelect }: TemplateGalleryProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {DEMO_TEMPLATES.map((t, i) => (
        <button
          key={i}
          onClick={() => onSelect(t.config as SceneConfig)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          className="glass-card p-4 text-left cursor-pointer group relative overflow-hidden"
        >
          {/* Hover glow */}
          <div
            className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${
              hovered === i ? "opacity-100" : ""
            }`}
            style={{
              background: `radial-gradient(circle at 50% 0%, ${t.config.colors?.[0] || "#a855f7"}20, transparent 70%)`,
            }}
          />

          <div className="relative z-10">
            <span className="text-2xl mb-2 block">{t.icon}</span>
            <p className="text-sm font-semibold text-white mb-1">{t.name}</p>
            <p className="text-[11px] text-white/40 leading-relaxed">{t.desc}</p>
            <div className="flex gap-1.5 mt-3">
              {(t.config.colors || []).slice(0, 3).map((c, ci) => (
                <div key={ci} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          {/* Type badge */}
          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider text-white/20 font-medium z-10">
            {t.config.type}
          </span>
        </button>
      ))}
    </div>
  );
}
