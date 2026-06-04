"use client";

import { useState, useCallback } from "react";
import type { SceneConfig } from "@/lib/generate-3d";

interface ExportVideoProps {
  config: SceneConfig;
  disabled?: boolean;
}

export default function ExportVideo({ config, disabled = false }: ExportVideoProps) {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "rendering" | "done" | "error">("idle");

  const handleExport = useCallback(async (format: "mp4" | "gif") => {
    setExporting(true);
    setProgress(0);
    setStatus("rendering");

    // Simulate render progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 200));
      setProgress(i);
    }

    // In production this would call a real render API
    setTimeout(() => {
      setStatus("done");
      setExporting(false);
    }, 500);
  }, [config]);

  const resetStatus = () => {
    setStatus("idle");
    setProgress(0);
  };

  return (
    <div className="space-y-3">
      {status === "idle" && (
        <div>
          <p className="text-xs text-white/40 mb-3 uppercase tracking-wider font-medium">
            Export Video
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport("mp4")}
              disabled={disabled || exporting}
              className="btn-primary flex-1 text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Export MP4
            </button>
            <button
              onClick={() => handleExport("gif")}
              disabled={disabled || exporting}
              className="btn-primary flex-1 text-sm flex items-center justify-center gap-2 opacity-80 hover:opacity-100"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Export GIF
            </button>
          </div>
        </div>
      )}

      {status === "rendering" && (
        <div className="glass p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full spinner" />
              <span className="text-sm text-white/80">Rendering video…</span>
            </div>
            <span className="text-sm text-purple-400 font-mono">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-white/30">
            Resolution: 1080×1920 · Codec: H.264 · FPS: 30
          </p>
        </div>
      )}

      {status === "done" && (
        <div className="glass p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-white">Render selesai!</span>
            </div>
            <button className="text-xs text-purple-400 hover:text-purple-300" onClick={resetStatus}>
              Reset
            </button>
          </div>
          <div className="flex gap-2">
            <button className="btn-primary flex-1 text-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </button>
            <button className="btn-primary flex-1 text-sm flex items-center justify-center gap-2 opacity-80 hover:opacity-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="glass p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-white">Render gagal</span>
          </div>
          <p className="text-xs text-white/50 mb-3">Coba lagi atau gunakan format lain.</p>
          <button onClick={resetStatus} className="btn-primary text-sm w-full">
            Coba Lagi
          </button>
        </div>
      )}
    </div>
  );
}
