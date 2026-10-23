"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Film,
  ShieldAlert,
  Download,
  RefreshCw,
  Smartphone,
  Monitor,
  Globe,
  LogIn,
} from "lucide-react";
import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

interface VideoHistoryItem {
  id: string;
  url: string;
  prompt: string;
  ratio: string;
  time: string;
}

// 多语言文案字典
const TRANSLATIONS = {
  en: {
    heroBadge: "Next-Gen Cinematic Video Engine",
    heroDesc: "Turn your prompts into high-framerate AI clips. Powered by state-of-the-art neural diffusion.",
    textareaPlaceholder: "Describe your scene in detail (e.g. Cyberpunk city in rain, neon lights, 4k cinematic)...",
    inspire: "Inspire:",
    ratio: "Ratio:",
    costInfo: "Cost: 10 Credits / 5s Clip",
    generateBtn: "Generate (10 Credits)",
    synthesizing: "Synthesizing (4s)...",
    historyTitle: "Generated Clips History",
    clearHistory: "Clear History",
    credits: "Credits",
    loginRequired: "Please sign in with Google to generate clips.",
    loginBtn: "Sign In",
    pricingTitle: "Subscription Plans",
    freeTrial: "Free Trial",
    freeTrialDesc: "50 Free Welcome Credits included to test quality",
    creator: "Creator",
    creatorDesc: "250 Credits/mo + No Watermark + Fast Queue",
    studio: "Pro Studio",
    studioDesc: "750 Credits/mo + 1080p Upscale + Commercial Rights",
    presets: [
      "A futuristic cyberpunk street with neon reflections in the rain, 4k cinematic",
      "A majestic eagle soaring over foggy pine mountains at golden hour, ultra-realistic",
      "A cozy Japanese coffee shop during a blizzard, warm interior lights, slow motion",
    ],
  },
  zh: {
    heroBadge: "下一代电影级 AI 视频引擎",
    heroDesc: "将你的文字创意直接转化为高帧率电影片段，基于前沿扩散模型驱动。",
    textareaPlaceholder: "详细描述你想要的画面（例如：赛博朋克雨夜街道、霓虹倒影、4K电影质感）...",
    inspire: "灵感提示：",
    ratio: "画面比例：",
    costInfo: "消耗：10 积分 / 5秒片段",
    generateBtn: "立即生成（扣除 10 积分）",
    synthesizing: "正在渲染中（预计4秒）...",
    historyTitle: "已生成的视频历史",
    clearHistory: "清空历史",
    credits: "点数余额",
    loginRequired: "请先通过 Google 登录后再开始生成视频。",
    loginBtn: "登录 / 注册",
    pricingTitle: "会员订阅计划",
    freeTrial: "体验版",
    freeTrialDesc: "免费赠送 50 积分，体验生成质感",
    creator: "创作者版",
    creatorDesc: "每月 250 积分 + 移除水印 + 极速通道",
    studio: "专业工作室",
    studioDesc: "每月 750 积分 + 1080p 超清放大 + 商业授权",
    presets: [
      "雨夜中反射着霓虹灯光的赛博朋克街道，4K 电影质感",
      "夕阳下翱翔在雾气缭绕的松林高山之上的雄鹰，超逼真",
      "暴风雪中的日式温馨咖啡馆，暖黄色内饰灯光，慢镜头",
    ],
  },
};

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const [lang, setLang] = useState<"en" | "zh">("en");
  const t = TRANSLATIONS[lang];

  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState<"16:9" | "9:16">("16:9");
  const [credits, setCredits] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [history, setHistory] = useState<VideoHistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("darkonla_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleGenerate = async () => {
    if (!isSignedIn) {
      setError(t.loginRequired);
      return;
    }
    if (!prompt.trim()) return;
    if (credits < 10) {
      setError(lang === "zh" ? "积分不足，请充值！" : "Insufficient credits!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, ratio, duration: 5 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      setCurrentVideo(data.videoUrl);
      setCredits((prev) => prev - 10);

      const newItem: VideoHistoryItem = {
        id: Date.now().toString(),
        url: data.videoUrl,
        prompt: prompt.trim(),
        ratio,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const updatedHistory = [newItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("darkonla_history", JSON.stringify(updatedHistory));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center px-4 py-8 selection:bg-purple-600/30">
      {/* 顶部导航 */}
      <nav className="w-full max-w-4xl flex items-center justify-between py-4 mb-8 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
            D
          </div>
          <span className="font-semibold tracking-wide text-zinc-100">Darkonla Studio</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {/* 中英双语切换器 */}
          <button
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === "en" ? "中文" : "English"}</span>
          </button>

          {/* 登录与用户信息 */}
          {!isLoaded ? (
            <div className="w-16 h-7 bg-zinc-900/60 rounded-lg animate-pulse" />
          ) : !isSignedIn ? (
            <SignInButton>
              <button className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.loginBtn}</span>
              </button>
            </SignInButton>
          ) : (
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
                {t.credits}: <span className="text-purple-400 font-semibold">{credits}</span>
              </div>
              <UserButton />
            </div>
          )}
        </div>
      </nav>

      {/* 标题 Hero */}
      <div className="max-w-3xl text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{t.heroBadge}</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          Darkonla Studio
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          {t.heroDesc}
        </p>
      </div>

      {/* 生成工作台 */}
      <div className="w-full max-w-3xl bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-2xl mb-12">
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.textareaPlaceholder}
            className="w-full h-28 bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4 text-sm text-zinc-200 focus:outline-none focus:border-purple-500/50 resize-none transition-all placeholder:text-zinc-600"
          />

          {/* 灵感快捷填词 */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-zinc-500">{t.inspire}</span>
            {t.presets.map((presetText, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(presetText)}
                className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 transition-colors truncate max-w-[200px]"
              >
                {presetText}
              </button>
            ))}
          </div>

          {/* 比例与生成按钮 */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-800/60">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">{t.ratio}</span>
              <button
                onClick={() => setRatio("16:9")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  ratio === "16:9"
                    ? "border-purple-500 bg-purple-500/10 text-purple-300"
                    : "border-zinc-800 text-zinc-400 hover:bg-zinc-800/40"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> 16:9
              </button>
              <button
                onClick={() => setRatio("9:16")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  ratio === "9:16"
                    ? "border-purple-500 bg-purple-500/10 text-purple-300"
                    : "border-zinc-800 text-zinc-400 hover:bg-zinc-800/40"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> 9:16
              </button>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.synthesizing}</span>
                </>
              ) : (
                <>
                  <Film className="w-4 h-4" />
                  <span>{t.generateBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/30 border border-red-900/50 flex items-center gap-2 text-xs text-red-400">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {currentVideo && (
          <div className="mt-6 rounded-xl overflow-hidden border border-zinc-800 bg-black">
            <video
              src={currentVideo}
              controls
              autoPlay
              loop
              className={`w-full mx-auto object-cover ${ratio === "9:16" ? "max-w-xs aspect-[9/16]" : "aspect-video"}`}
            />
          </div>
        )}
      </div>

      {/* 历史画廊 */}
      {history.length > 0 && (
        <section className="w-full max-w-3xl mb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-300">{t.historyTitle}</h2>
            <button
              onClick={() => {
                setHistory([]);
                localStorage.removeItem("darkonla_history");
              }}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {t.clearHistory}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-3 flex flex-col gap-2 overflow-hidden"
              >
                <video src={item.url} controls className="w-full aspect-video rounded-lg object-cover bg-black" />
                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="truncate max-w-[180px] text-zinc-400">{item.prompt}</span>
                  <a
                    href={item.url}
                    download="render.mp4"
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 hover:text-purple-400 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 订阅价格区 */}
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-zinc-900">
        <div className="p-6 rounded-xl border border-zinc-800/60 bg-zinc-900/20 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-300">{t.freeTrial}</h3>
          <div className="text-2xl font-bold">$0</div>
          <p className="text-xs text-zinc-500">{t.freeTrialDesc}</p>
        </div>
        <div className="p-6 rounded-xl border border-purple-500/50 bg-purple-950/10 space-y-3 relative">
          <div className="absolute -top-2.5 right-4 bg-purple-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
            Popular
          </div>
          <h3 className="text-sm font-semibold text-purple-200">{t.creator}</h3>
          <div className="text-2xl font-bold">$19 <span className="text-xs font-normal text-zinc-500">/mo</span></div>
          <p className="text-xs text-zinc-400">{t.creatorDesc}</p>
        </div>
        <div className="p-6 rounded-xl border border-zinc-800/60 bg-zinc-900/20 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-300">{t.studio}</h3>
          <div className="text-2xl font-bold">$49 <span className="text-xs font-normal text-zinc-500">/mo</span></div>
          <p className="text-xs text-zinc-500">{t.studioDesc}</p>
        </div>
      </section>
    </main>
  );
}