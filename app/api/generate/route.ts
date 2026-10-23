import { NextResponse } from "next/server";

// 准备几段不同风格的测试视频
const DEMO_VIDEOS = [
  {
    tag: "cyberpunk",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
  {
    tag: "nature",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    tag: "default",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
];

export async function POST(req: Request) {
  try {
    const { prompt, ratio = "16:9", duration = 5 } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Please enter a prompt" }, { status: 400 });
    }

    // 模拟真实的 AI 视频生成排队与渲染时间（4秒）
    await new Promise((resolve) => setTimeout(resolve, 4000));

    // 根据输入词简单匹配对应的样片
    const lower = prompt.toLowerCase();
    let selected = DEMO_VIDEOS[2].url;
    if (lower.includes("cyber") || lower.includes("city") || lower.includes("tech")) {
      selected = DEMO_VIDEOS[0].url;
    } else if (lower.includes("animal") || lower.includes("forest") || lower.includes("nature")) {
      selected = DEMO_VIDEOS[1].url;
    }

    return NextResponse.json({
      success: true,
      videoUrl: selected,
      metadata: {
        prompt,
        ratio,
        duration: `${duration}s`,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate video" },
      { status: 500 }
    );
  }
}