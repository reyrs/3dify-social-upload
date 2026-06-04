"use client";

import dynamic from "next/dynamic";
import { SceneConfig } from "@/lib/generate-3d";

const Scene3D = dynamic(() => import("@/components/Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/50 rounded-2xl">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full spinner" />
        <p className="text-sm text-white/50">Loading 3D renderer…</p>
      </div>
    </div>
  ),
});

interface ScenePreviewProps {
  config: SceneConfig;
  className?: string;
}

export default function ScenePreview({ config, className = "" }: ScenePreviewProps) {
  return (
    <div className={`relative w-full aspect-[9/16] max-h-[600px] rounded-2xl overflow-hidden neon-glow ${className}`}>
      <Scene3D config={config} />

      {/* Overlay info */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <div className="glass px-4 py-2 rounded-xl">
          <p className="text-xs text-white/50 uppercase tracking-wider">Scene</p>
          <p className="text-sm font-semibold text-white truncate max-w-[180px]">
            {config.title}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="tag-pill text-[11px]">{config.type}</span>
          <span className="tag-pill text-[11px]">{config.animationType}</span>
        </div>
      </div>

      {/* Vibe indicator */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-white/60">{config.musicVibe}</span>
        </div>
        <span className="text-xs text-white/40">{config.duration}s</span>
      </div>
    </div>
  );
}
