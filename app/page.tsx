"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import TemplateGallery from "@/components/TemplateGallery";
import ExportVideo from "@/components/ExportVideo";
import type { SceneConfig, GenerationResult } from "@/lib/generate-3d";

const ScenePreview = dynamic(() => import("@/components/ScenePreview"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[9/16] max-h-[600px] rounded-2xl bg-black/50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full spinner" />
        <p className="text-sm text-white/40">Loading 3D…</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [activeScene, setActiveScene] = useState<SceneConfig | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [prompt]);

  const handleGenerate = useCallback(async () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setResult(null);
    setSelectedVariant(0);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal generate scene");
      }

      const data: GenerationResult & { success: boolean } = await res.json();
      setResult(data);
      setActiveScene(data.scene);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [prompt]);

  const handleSelectVariant = useCallback(
    (idx: number) => {
      setSelectedVariant(idx);
      if (result && result.presets[idx]) {
        const base = result.scene;
        const preset = result.presets[idx];
        setActiveScene({ ...base, ...preset, title: prompt.slice(0, 40) + (prompt.length > 40 ? "…" : "") });
      }
    },
    [result, prompt]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleTemplateSelect = useCallback((config: SceneConfig) => {
    setActiveScene(config);
    setPrompt(`Template: ${config.title}`);
    setResult(null);
    setError("");
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-600/8 blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-orange-500/5 blur-[80px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
              3D
            </div>
            <div>
              <span className="text-lg font-bold gradient-text">3DifyAI</span>
              <span className="hidden sm:inline text-xs text-white/30 ml-2">AI Social Media Content Generator</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/30 hidden sm:block">✨ Free to try</span>
            <button className="text-xs text-white/50 hover:text-white transition-colors">GitHub</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-8 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 tag-pill mb-6 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            AI-powered 3D generation
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Buat Konten{" "}
            <span className="gradient-text">3D Viral</span>
            <br />
            dalam Detik
          </h1>
          <p className="text-white/40 text-base md:text-lg max-w-lg mx-auto">
            Tinggal ketik teks, AI generate 3D animation siap upload ke TikTok, Instagram & Reels.
            No design skills needed.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Input & Templates */}
            <div className="lg:col-span-2 space-y-6">
              {/* Input area */}
              <div className="glass rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-white/80">Prompt</label>
                  <span className="text-[11px] text-white/30">{prompt.length}/500</span>
                </div>

                <textarea
                  ref={inputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
                  onKeyDown={handleKeyDown}
                  placeholder='Coba: "Cyberpunk neon product showcase dengan asap ungu"'
                  className="input-glass min-h-[80px] resize-none"
                  rows={2}
                />

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-xl">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Scene
                    </>
                  )}
                </button>

                <p className="text-[11px] text-white/20 text-center">
                  Enter ↵ generate · Shift+Enter new line
                </p>
              </div>

              {/* Variants */}
              {result && result.presets.length > 0 && (
                <div className="glass rounded-2xl p-5 space-y-4 fade-in-up">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white/80">Variations</p>
                    <span className="text-[11px] text-purple-400">{result.presets.length} opsi</span>
                  </div>
                  <div className="space-y-2">
                    {result.presets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectVariant(idx)}
                        className={`w-full glass-card p-3 text-left transition-all ${
                          selectedVariant === idx
                            ? "border-purple-500/50 bg-purple-500/10"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-1 h-8 rounded-full ${
                              selectedVariant === idx ? "bg-purple-500" : "bg-white/10"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {preset.type} · {preset.animationType}
                            </p>
                            <div className="flex gap-1.5 mt-1.5">
                              {(preset.colors || []).slice(0, 4).map((c, ci) => (
                                <div key={ci} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                              ))}
                              <span className="text-[10px] text-white/30 ml-auto self-center">
                                {preset.musicVibe}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Templates */}
              <div className="glass rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white/80">Templates</p>
                  <span className="text-[11px] text-white/30">6 siap pakai</span>
                </div>
                <TemplateGallery onSelect={handleTemplateSelect} />
              </div>
            </div>

            {/* Right: Preview */}
            <div className="lg:col-span-3 space-y-6">
              {activeScene ? (
                <div className="space-y-4 fade-in-up">
                  <ScenePreview config={activeScene} />
                  <ExportVideo config={activeScene} disabled={loading} />
                </div>
              ) : (
                <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[500px] space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white/60">Belum ada scene</p>
                    <p className="text-sm text-white/30 mt-1 max-w-sm">
                      Ketik prompt di samping atau pilih template untuk mulai generate 3D animation.
                    </p>
                  </div>
                  <div className="flex gap-2 text-xs text-white/20">
                    <span className="tag-pill text-[10px]">product</span>
                    <span className="tag-pill text-[10px]">logo</span>
                    <span className="tag-pill text-[10px]">abstract</span>
                    <span className="tag-pill text-[10px]">cyber</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-white/20">
          <p>3DifyAI — Built with Next.js + Three.js + AI</p>
          <p>© 2026</p>
        </div>
      </footer>
    </main>
  );
}
