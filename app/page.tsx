"use client";

import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiTwitterXFill } from "react-icons/ri";

// モックデータ
const mockThreads = [
  "動画で話した内容を、投稿にうつすだけの話。結局いちばん時間がかかるのは書くことでした。",
  "今回の動画は、作業量を減らす工夫よりも、投稿の形を先に決めるだけでラクになる話です。",
  "ポイントは3つ。話した内容を整理する。X用に整える。note用に整える。判断はぜんぶこちらで。",
  "動画の流れを壊さずに、SNSで読まれる形だけに写します。最後に動画リンクも自然に入れました。",
];

const mockNoteTitles = [
  "動画を、投稿にうつす",
  "話した内容を、そのまま投稿に変える方法",
  "発信が続く人だけが知っている「書かない」技術",
];

const mockNoteBody = `動画の内容をSNS向けに書き換えるのが大変で、結局投稿が止まる。そんな悩みを抱える人は多いです。

先に「投稿の形」を決める

話した内容を整理して、Xとnoteに合わせて整える。それだけで、迷いが消えます。

まとめ

動画の熱量はそのままに、読みやすい投稿だけを残す。そうすることで、発信が続きます。`;

type OutputData = {
  id: string;
  url: string;
  title: string;
  threads: string[];
  noteTitles: string[];
  noteBody: string;
  createdAt: Date;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [postType, setPostType] = useState("learning");
  const [tone, setTone] = useState("soft");
  const [emoji, setEmoji] = useState("off");
  const [selectedTitle, setSelectedTitle] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [history, setHistory] = useState<OutputData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPaid, setIsPaid] = useState(false); // モック: 課金状態
  const [usageCount, setUsageCount] = useState(0); // 今月の使用回数
  const outputRef = useRef<HTMLElement>(null);

  const output = history.find((h) => h.id === activeId) || null;
  const FREE_LIMIT = 1; // 無料で試せる回数
  const MONTHLY_LIMIT = 30;

  const loadingSteps = [
    "動画の内容を読み取っています",
    "話の流れを整理しています",
    "投稿用に整えています",
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyAllThreads = () => {
    if (!output) return;
    const allText = output.threads
      .map((t, i) => `${i + 1}/${output.threads.length} ${t}`)
      .join("\n\n");
    copyToClipboard(allText, "all-threads");
  };

  const handleSubmit = async () => {
    if (!url.trim()) return;

    // 無料枠を超えていて未課金ならPaywall表示
    if (!isPaid && usageCount >= FREE_LIMIT) {
      setShowPaywall(true);
      return;
    }

    const currentUrl = url;
    setIsLoading(true);
    setLoadingStep(0);

    for (let i = 0; i < loadingSteps.length; i++) {
      setLoadingStep(i);
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }

    const newId = Date.now().toString();
    const newOutput: OutputData = {
      id: newId,
      url: currentUrl,
      title: extractVideoTitle(currentUrl),
      threads: mockThreads,
      noteTitles: mockNoteTitles,
      noteBody: mockNoteBody,
      createdAt: new Date(),
    };

    setHistory((prev) => [newOutput, ...prev]);
    setActiveId(newId);
    setSelectedTitle(0);
    setUrl("");
    setUsageCount((prev) => prev + 1);
    setIsLoading(false);
  };

  const extractVideoTitle = (videoUrl: string): string => {
    const id = videoUrl.match(/[?&]v=([^&]+)/)?.[1] || videoUrl.split("/").pop() || "";
    return `動画 ${id.slice(0, 8)}`;
  };

  const handleRegenerate = async () => {
    if (!output) return;
    setIsLoading(true);
    setLoadingStep(2);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    if (activeId === id) {
      const remaining = history.filter((h) => h.id !== id);
      setActiveId(remaining[0]?.id || null);
    }
  };

  const handleNewConversion = () => {
    setActiveId(null);
    setUrl("");
  };

  const isValidUrl = url.includes("youtube.com") || url.includes("youtu.be");

  useEffect(() => {
    if (output && !isLoading && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [output, isLoading]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setSidebarOpen(mq.matches);
    sync();
    if (mq.addEventListener) {
      mq.addEventListener("change", sync);
      return () => mq.removeEventListener("change", sync);
    }
    mq.addListener(sync);
    return () => mq.removeListener(sync);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* サイドバー */}
      <aside
        className={`flex h-full flex-col border-r border-foreground/10 bg-foreground/[0.02] transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <div className={`flex h-full flex-col ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>
          {/* ロゴ */}
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Utsusu</p>
              <p className="text-[10px] text-muted-foreground">動画を、投稿にうつす。</p>
            </div>
          </div>

          {/* 新規作成ボタン */}
          <div className="px-3 pb-3">
            <button
              onClick={handleNewConversion}
              className="flex w-full items-center gap-2 rounded-md border border-foreground/10 px-3 py-2 text-sm transition-colors hover:bg-foreground/5"
            >
              <span>+</span>
              <span>新しく変換</span>
            </button>
          </div>

          {/* 履歴リスト */}
          <div className="flex-1 overflow-y-auto px-2">
            <p className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              履歴
            </p>
            <div className="space-y-1">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveId(item.id);
                    setSelectedTitle(0);
                  }}
                  className={`group flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    activeId === item.id
                      ? "bg-foreground/10 text-foreground"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  <span className="truncate">{item.title}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="ml-2 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                  >
                    ×
                  </span>
                </button>
              ))}
              {history.length === 0 && (
                <p className="px-3 py-4 text-xs text-muted-foreground/60">
                  まだ履歴がありません
                </p>
              )}
            </div>
          </div>

          {/* ユーザーアイコン */}
          <div className="border-t border-foreground/10 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/10 text-sm font-medium text-foreground/60">
                U
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm">ユーザー</p>
                {isPaid ? (
                  <p className="text-[10px] text-muted-foreground">
                    残り {MONTHLY_LIMIT - usageCount} / {MONTHLY_LIMIT} 動画
                  </p>
                ) : (
                  <button
                    onClick={() => setShowPaywall(true)}
                    className="text-[10px] text-muted-foreground transition-colors hover:text-foreground hover:underline"
                  >
                    {usageCount >= FREE_LIMIT ? "プランに登録" : `お試し ${FREE_LIMIT - usageCount} 回`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* サイドバートグル */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute left-2 top-4 z-10 rounded-md p-2 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground md:hidden"
      >
        {sidebarOpen ? "←" : "→"}
      </button>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto accent-veil">
        <div className="mx-auto max-w-3xl px-4 py-10 md:px-12 md:py-16">
          {/* 入力セクション - 常に表示 */}
          {!activeId && !isLoading && (
            <section className="animate-fade-up">
              <h1 className="text-3xl font-light leading-tight tracking-tight md:text-5xl">
                動画を、
                <br />
                <span className="font-normal accent-text">投稿</span>にうつす。
              </h1>

              <div className="mt-10 space-y-7 md:mt-12 md:space-y-8">
                <div className="group relative">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="YouTube URL"
                    className="w-full rounded-md border border-foreground/10 bg-white/80 px-4 py-4 text-base placeholder:text-foreground/25 focus:border-transparent focus:outline-none transition-colors duration-300 md:text-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-500 accent-gradient-soft group-focus-within:opacity-100" />
                </div>

                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  <Select value={postType} onValueChange={setPostType}>
                    <SelectTrigger className="h-auto w-auto gap-2 border-0 bg-transparent p-0 text-sm font-medium shadow-none transition-colors hover:text-foreground/70 focus:ring-0 focus:ring-offset-0 [&>svg]:opacity-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="learning">解説・学び</SelectItem>
                      <SelectItem value="story">体験談</SelectItem>
                      <SelectItem value="howto">ノウハウ共有</SelectItem>
                    </SelectContent>
                  </Select>

                  <span className="text-foreground/15">—</span>

                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="h-auto w-auto gap-2 border-0 bg-transparent p-0 text-sm font-medium shadow-none transition-colors hover:text-foreground/70 focus:ring-0 focus:ring-offset-0 [&>svg]:opacity-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soft">やわらか</SelectItem>
                      <SelectItem value="normal">普通</SelectItem>
                      <SelectItem value="biz">ビジネス</SelectItem>
                    </SelectContent>
                  </Select>

                  <span className="text-foreground/15">—</span>

                  <Select value={emoji} onValueChange={setEmoji}>
                    <SelectTrigger className="h-auto w-auto gap-2 border-0 bg-transparent p-0 text-sm font-medium shadow-none transition-colors hover:text-foreground/70 focus:ring-0 focus:ring-offset-0 [&>svg]:opacity-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on">絵文字あり</SelectItem>
                      <SelectItem value="off">絵文字なし</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!isValidUrl}
                  className="accent-fill accent-shadow w-full rounded-md px-8 py-4 text-sm font-medium tracking-wide transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
                >
                  投稿を作る
                </button>
                {url && !isValidUrl && (
                  <p className="text-xs text-muted-foreground">
                    YouTube の URL を入力してください
                  </p>
                )}
              </div>
            </section>
          )}

          {/* ローディング */}
          {isLoading && (
            <section className="flex min-h-[50vh] items-center justify-center">
              <div className="flex flex-col items-center gap-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground/15 border-t-[hsl(var(--accent-from))]" />
                <p className="text-sm text-muted-foreground">
                  {loadingSteps[loadingStep]}
                </p>
              </div>
            </section>
          )}

          {/* 出力セクション */}
          {output && !isLoading && (
            <section ref={outputRef} className="animate-fade-up scroll-mt-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full accent-gradient accent-shadow" />
                <p className="text-sm text-muted-foreground">
                  このまま投稿できます
                </p>
              </div>

              <div className="grid gap-12 md:gap-16">
                {/* X スレッド */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
                    <div className="flex items-center gap-3">
                      <RiTwitterXFill className="h-5 w-5" />
                      <span className="text-xs text-muted-foreground">スレッド形式</span>
                    </div>
                    <button
                      onClick={copyAllThreads}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {copied === "all-threads" ? (
                        <span className="accent-gradient bg-clip-text text-transparent">
                          コピーしました
                        </span>
                      ) : (
                        "まとめてコピー"
                      )}
                    </button>
                  </div>

                  <div className="space-y-1">
                    {output.threads.map((thread, index) => (
                      <div
                        key={index}
                        className="group relative grid grid-cols-[auto_1fr_auto] gap-3 py-4 transition-colors hover:bg-foreground/[0.02] md:gap-4"
                      >
                        <span className="pt-0.5 text-xs tabular-nums text-muted-foreground/60">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <p className="text-[15px] leading-7 text-foreground/85">{thread}</p>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              `${index + 1}/${output.threads.length} ${thread}`,
                              `thread-${index}`
                            )
                          }
                          className="self-start pt-0.5 text-xs text-transparent transition-colors group-hover:text-muted-foreground hover:text-foreground"
                        >
                          {copied === `thread-${index}` ? (
                            <span className="accent-gradient bg-clip-text text-transparent">済</span>
                          ) : (
                            "コピー"
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* note 要約記事 */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-medium tracking-tight accent-text">
                        note
                      </span>
                      <span className="text-xs text-muted-foreground">要約記事</span>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `# ${output.noteTitles[selectedTitle]}\n\n${output.noteBody}`,
                          "note-body"
                        )
                      }
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {copied === "note-body" ? (
                        <span className="accent-gradient bg-clip-text text-transparent">
                          コピーしました
                        </span>
                      ) : (
                        "本文コピー"
                      )}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">タイトル案</p>
                    <div className="flex flex-wrap gap-2">
                      {output.noteTitles.map((title, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTitle(index)}
                          className={`px-4 py-2 text-sm transition-all ${
                            selectedTitle === index
                              ? "accent-border bg-white text-foreground"
                              : "border border-foreground/15 text-foreground/70 hover:border-foreground/30 hover:text-foreground"
                          }`}
                        >
                          {title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-sm border border-foreground/10 bg-white p-5 md:p-6">
                    <article className="space-y-5">
                      <h3 className="text-lg font-medium leading-relaxed">
                        {output.noteTitles[selectedTitle]}
                      </h3>
                      <div className="space-y-4 text-[15px] leading-8 text-foreground/80">
                        {output.noteBody.split("\n\n").map((paragraph, index) => {
                          if (paragraph.length < 20 && !paragraph.includes("。")) {
                            return (
                              <p key={index} className="font-medium text-foreground">
                                {paragraph}
                              </p>
                            );
                          }
                          return <p key={index}>{paragraph}</p>;
                        })}
                      </div>
                    </article>
                  </div>
                </div>

                {/* 再作成 */}
                <div className="flex items-center gap-6 border-t border-foreground/10 pt-6">
                  <button
                    onClick={handleRegenerate}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    言い回しを少し変える
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Paywall モーダル */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md animate-fade-up rounded-sm border border-foreground/10 bg-background p-6 md:p-8">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                Utsusu
              </p>
              <h2 className="mt-4 text-2xl font-light tracking-tight">
                続けて使うには
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                無料のお試しは1回までです。
                <br />
                続けて投稿を作るにはプランに登録してください。
              </p>

              <div className="mt-8 rounded-sm border border-foreground/10 bg-foreground/[0.02] p-6">
                <p className="text-4xl font-extralight tracking-tight">
                  ¥1,480
                  <span className="text-sm font-normal text-muted-foreground">/月</span>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  月{MONTHLY_LIMIT}動画まで
                </p>
                <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <li>Xスレッド + note記事を一括作成</li>
                  <li>日本のSNSに最適化された表現</li>
                  <li>タイトル案を3つ提案</li>
                </ul>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => {
                    // モック: 課金処理
                    setIsPaid(true);
                    setShowPaywall(false);
                  }}
                  className="w-full rounded-md accent-fill accent-shadow py-3 text-sm font-medium transition-all hover:brightness-110"
                >
                  登録する
                </button>
                <button
                  onClick={() => setShowPaywall(false)}
                  className="w-full py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  あとで
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
