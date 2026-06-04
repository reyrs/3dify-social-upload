export interface SceneConfig {
  type: "product" | "logo" | "abstract" | "text" | "character" | "cyber";
  title: string;
  colors: string[];
  backgroundColor: string;
  animationType: "rotate" | "float" | "pulse" | "wave" | "explode";
  particleCount: number;
  particleColor: string;
  fogColor: string;
  lightIntensity: number;
  cameraDistance: number;
  musicVibe: "upbeat" | "chill" | "epic" | "minimal";
  duration: number;
}

export interface GenerationResult {
  scene: SceneConfig;
  rawPrompt: string;
  presets: Partial<SceneConfig>[];
}

const SCENE_TEMPLATES: Record<string, Partial<SceneConfig>> = {
  product: {
    type: "product",
    animationType: "rotate",
    particleCount: 30,
    lightIntensity: 1.8,
    cameraDistance: 4,
    musicVibe: "upbeat",
    duration: 8,
  },
  logo: {
    type: "logo",
    animationType: "float",
    particleCount: 50,
    lightIntensity: 2.0,
    cameraDistance: 3.5,
    musicVibe: "epic",
    duration: 6,
  },
  abstract: {
    type: "abstract",
    animationType: "wave",
    particleCount: 200,
    lightIntensity: 1.5,
    cameraDistance: 6,
    musicVibe: "chill",
    duration: 10,
  },
  text: {
    type: "text",
    animationType: "pulse",
    particleCount: 40,
    lightIntensity: 1.6,
    cameraDistance: 3,
    musicVibe: "minimal",
    duration: 5,
  },
  character: {
    type: "character",
    animationType: "explode",
    particleCount: 100,
    lightIntensity: 2.2,
    cameraDistance: 5,
    musicVibe: "epic",
    duration: 8,
  },
  cyber: {
    type: "cyber",
    animationType: "wave",
    particleCount: 300,
    lightIntensity: 1.9,
    cameraDistance: 4.5,
    musicVibe: "upbeat",
    duration: 7,
  },
};

const THEME_COLORS: Record<string, string[]> = {
  neon: ["#a855f7", "#ec4899", "#f97316", "#22d3ee"],
  ocean: ["#06b6d4", "#3b82f6", "#8b5cf6", "#a855f7"],
  sunset: ["#f97316", "#ef4444", "#ec4899", "#a855f7"],
  forest: ["#22c55e", "#10b981", "#14b8a6", "#06b6d4"],
  cyberpunk: ["#ff00ff", "#00ffff", "#ffff00", "#ff0044"],
  gold: ["#fbbf24", "#f59e0b", "#d97706", "#eab308"],
  fire: ["#ef4444", "#f97316", "#f59e0b", "#dc2626"],
  ice: ["#e0f2fe", "#7dd3fc", "#38bdf8", "#0ea5e9"],
  valentine: ["#f43f5e", "#fb7185", "#fda4af", "#e11d48"],
  midnight: ["#6366f1", "#8b5cf6", "#a855f7", "#c084fc"],
};

function detectIntent(text: string): SceneConfig {
  const lower = text.toLowerCase();

  // Detect scene type
  let type: SceneConfig["type"] = "abstract";
  if (/produk|product|barang|jual|shop|item|showcase|baju|sepatu|gadget|botol/i.test(lower)) type = "product";
  else if (/logo|brand|merek|company|nama perusahaan/i.test(lower)) type = "logo";
  else if (/text|tulisan|kata|quote|typography|font|huruf/i.test(lower)) type = "text";
  else if (/character|karakter|orang|avatar|pemain|hero|maskot/i.test(lower)) type = "character";
  else if (/cyber|cyberpunk|futuristik|futuristic|neon|grid|hacker|digital/i.test(lower)) type = "cyber";
  else if (/abstract|art|seni|artistic|geometric|geometris/i.test(lower)) type = "abstract";

  // Detect theme/colors
  let themeColors = THEME_COLORS.neon;
  if (/ocean|blue|biru|laut|air|water/i.test(lower)) themeColors = THEME_COLORS.ocean;
  else if (/sunset|golden hour|matahari terbenam|orange/i.test(lower)) themeColors = THEME_COLORS.sunset;
  else if (/forest|green|hijau|alam|nature|pohon/i.test(lower)) themeColors = THEME_COLORS.forest;
  else if (/cyberpunk|neon|glow|vaporwave/i.test(lower)) themeColors = THEME_COLORS.cyberpunk;
  else if (/gold|emas|mewah|luxury|premium/i.test(lower)) themeColors = THEME_COLORS.gold;
  else if (/fire|api|merah|red|heat|panas/i.test(lower)) themeColors = THEME_COLORS.fire;
  else if (/ice|snow|salju|dingin|cold|white|putih/i.test(lower)) themeColors = THEME_COLORS.ice;
  else if (/valentine|love|cinta|pink|romantic|romantis/i.test(lower)) themeColors = THEME_COLORS.valentine;
  else if (/midnight|malam|night|dark|gelap|purple|ungu/i.test(lower)) themeColors = THEME_COLORS.midnight;

  // Detect mood → music
  let musicVibe: SceneConfig["musicVibe"] = "upbeat";
  if (/chill|relax|santai|tenang|calm|slow|lofi/i.test(lower)) musicVibe = "chill";
  else if (/epic|dramatic|hero|besar|grand|cinematic/i.test(lower)) musicVibe = "epic";
  else if (/minimal|simple|clean|bersih|elegan|elegant/i.test(lower)) musicVibe = "minimal";

  // Detect animation
  let animationType: SceneConfig["animationType"] = "rotate";
  if (/float|mengambang|melayang|hover/i.test(lower)) animationType = "float";
  else if (/pulse|denyut|berdenyut|heart/i.test(lower)) animationType = "pulse";
  else if (/wave|gelombang|flow|mengalir/i.test(lower)) animationType = "wave";
  else if (/explode|ledakan|burst|particle/i.test(lower)) animationType = "explode";

  const baseTemplate = SCENE_TEMPLATES[type] || SCENE_TEMPLATES.abstract;

  return {
    type,
    title: text.length > 40 ? text.slice(0, 40) + "…" : text,
    colors: themeColors,
    backgroundColor: "#0a0a0a",
    animationType,
    particleCount: baseTemplate.particleCount || 50,
    particleColor: themeColors[0],
    fogColor: themeColors[themeColors.length - 1],
    lightIntensity: baseTemplate.lightIntensity || 1.5,
    cameraDistance: baseTemplate.cameraDistance || 4,
    musicVibe,
    duration: baseTemplate.duration || 8,
  };
}

function generatePresets(text: string): Partial<SceneConfig>[] {
  const base = detectIntent(text);
  return [
    { ...base, colors: ["#ff00ff", "#00ffff", "#ffff00", "#ff0044"], musicVibe: "upbeat" },
    { ...base, colors: ["#06b6d4", "#3b82f6", "#8b5cf6", "#a855f7"], musicVibe: "chill" },
    { ...base, colors: ["#f97316", "#ef4444", "#ec4899", "#a855f7"], musicVibe: "epic" },
  ];
}

export async function generateScene(prompt: string): Promise<GenerationResult> {
  const scene = detectIntent(prompt);

  const systemPrompt = `Kamu adalah AI 3D scene designer. User memberikan teks, dan kamu output JSON scene config.
Output JSON array dengan 3 opsi variasi (masing-masing beda theme/color/mood).
Format JSON: { "variants": [{ "title": "...", "type": "...", "colors": [...], "animationType": "...", "particleCount": num, "musicVibe": "...", "duration": num }] }`;

  const userPrompt = `Buat 3 variasi scene untuk prompt: "${prompt}"
Scene type terdeteksi: ${scene.type}
Theme colors dasar: ${JSON.stringify(scene.colors)}`;

  // Try AI, fallback to local
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey !== "sk-your-openai-api-key-here") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          max_tokens: 1000,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const parsed = JSON.parse(data.choices[0].message.content);
        if (parsed.variants && Array.isArray(parsed.variants)) {
          return {
            scene,
            rawPrompt: prompt,
            presets: parsed.variants.map((v: SceneConfig) => ({
              ...detectIntent(prompt),
              ...v,
            })),
          };
        }
      }
    }
  } catch {
    // fallback
  }

  return {
    scene,
    rawPrompt: prompt,
    presets: generatePresets(prompt),
  };
}
