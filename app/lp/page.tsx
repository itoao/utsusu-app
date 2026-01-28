"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RiTwitterXFill } from "react-icons/ri";

// スクロールアニメーション用フック
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// フェードインコンポーネント
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, isInView } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ナビゲーション */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 100
            ? "bg-background/90 backdrop-blur-sm border-b border-foreground/5"
            : ""
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12">
          <p className="text-sm font-medium tracking-wide">Utsusu</p>
          <Link
            href="/"
            className="rounded-sm bg-foreground px-5 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-foreground/90"
          >
            はじめる
          </Link>
        </div>
      </nav>

      {/* ヒーローセクション */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        {/* 縦書きアクセント */}
        <div className="pointer-events-none absolute right-8 top-1/4 hidden text-[11px] tracking-[0.5em] text-foreground/[0.08] md:block [writing-mode:vertical-rl]">
          話した内容を、投稿に写す
        </div>
        <div className="pointer-events-none absolute left-8 bottom-1/4 hidden text-[11px] tracking-[0.5em] text-foreground/[0.08] md:block [writing-mode:vertical-rl]">
          日本のSNSに最適化
        </div>

        <div className="text-center">
          <p
            className="mb-6 text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground opacity-0 animate-fade-in"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            Utsusu
          </p>
          <h1
            className="text-4xl font-extralight leading-[1.3] tracking-tight opacity-0 animate-fade-in md:text-7xl lg:text-8xl"
            style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
          >
            動画を、
            <br />
            <span className="font-normal">投稿</span>にうつす。
          </h1>
          <p
            className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-muted-foreground opacity-0 animate-fade-in md:text-base"
            style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
          >
            話した内容を、日本のSNSで
            <br className="md:hidden" />
            そのまま使える投稿に整えます。
          </p>
          <div
            className="mt-12 opacity-0 animate-fade-in"
            style={{ animationDelay: "800ms", animationFillMode: "forwards" }}
          >
            <Link
              href="/"
              className="inline-block bg-foreground px-10 py-4 text-sm font-medium tracking-wide text-primary-foreground transition-all hover:bg-foreground/90 active:scale-[0.98]"
            >
              無料ではじめる
            </Link>
          </div>
        </div>

        {/* スクロールインジケーター */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: "1200ms", animationFillMode: "forwards" }}>
          <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
            <span className="text-[10px] tracking-widest">SCROLL</span>
            <div className="h-8 w-px bg-foreground/20" />
          </div>
        </div>
      </section>

      {/* 課題セクション */}
      <section className="relative px-6 py-32 md:py-48">
        <div className="pointer-events-none absolute -left-4 top-32 hidden text-[180px] font-extralight leading-none text-foreground/[0.02] md:block">
          01
        </div>

        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Problem
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="text-2xl font-light leading-relaxed tracking-tight md:text-4xl">
              動画は作れる。
              <br />
              でも、<span className="font-normal">書く</span>のが苦痛。
            </h2>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="mt-12 space-y-6 text-[15px] leading-8 text-muted-foreground md:text-base">
              <p>
                話すのは得意。カメラの前なら、いくらでも言葉が出てくる。
              </p>
              <p>
                でも、それを文章にして投稿するとなると、途端に手が止まる。
                Xに書くには長すぎる。noteにまとめるには構成が必要。
                結局、動画だけ上げて、テキスト投稿は後回し。
              </p>
              <p>
                そのまま、投稿しないまま終わる。
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 解決策セクション */}
      <section className="relative bg-foreground/[0.02] px-6 py-32 md:py-48">
        <div className="pointer-events-none absolute -right-4 top-32 hidden text-[180px] font-extralight leading-none text-foreground/[0.02] md:block">
          02
        </div>

        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Solution
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="text-2xl font-light leading-relaxed tracking-tight md:text-4xl">
              選ぶのは、<span className="font-normal">3つ</span>だけ。
            </h2>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="mt-6 text-[15px] leading-8 text-muted-foreground md:text-base">
              Utsusuは、動画の内容を日本のSNS向けに整えます。
              <br />
              設定も調整も不要。あなたが選ぶのは、3つだけ。
            </p>
          </FadeIn>

          <div className="mt-16 grid gap-8 md:grid-cols-3 md:gap-6">
            <FadeIn delay={300}>
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground">01</p>
                <p className="text-lg font-medium">投稿タイプ</p>
                <p className="text-sm text-muted-foreground">
                  解説・学び / 体験談 / ノウハウ共有
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={400}>
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground">02</p>
                <p className="text-lg font-medium">トーン</p>
                <p className="text-sm text-muted-foreground">
                  やわらか / 普通 / ビジネス
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={500}>
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground">03</p>
                <p className="text-lg font-medium">絵文字</p>
                <p className="text-sm text-muted-foreground">
                  あり / なし
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 出力例セクション */}
      <section className="relative px-6 py-32 md:py-48">
        <div className="pointer-events-none absolute -left-4 top-32 hidden text-[180px] font-extralight leading-none text-foreground/[0.02] md:block">
          03
        </div>

        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Output
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="text-2xl font-light leading-relaxed tracking-tight md:text-4xl">
              このまま、<span className="font-normal">投稿</span>できる。
            </h2>
          </FadeIn>

          <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-8">
            {/* X スレッド例 */}
            <FadeIn delay={200}>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <RiTwitterXFill className="h-5 w-5" />
                  <span className="text-sm text-muted-foreground">スレッド形式</span>
                </div>
                <div className="space-y-3 rounded-sm bg-white p-6 shadow-sm">
                  {[
                    "動画で話した内容を、投稿にうつすだけの話。結局いちばん時間がかかるのは書くことでした。",
                    "今回の動画は、作業量を減らす工夫よりも、投稿の形を先に決めるだけでラクになる話です。",
                    "ポイントは3つ。話した内容を整理する。X用に整える。note用に整える。",
                  ].map((text, i) => (
                    <div key={i} className="flex gap-3 text-sm leading-relaxed">
                      <span className="text-muted-foreground/50">{i + 1}/4</span>
                      <span className="text-foreground/80">{text}</span>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground/50">...</p>
                </div>
              </div>
            </FadeIn>

            {/* note 例 */}
            <FadeIn delay={300}>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold tracking-tight text-[#41C9B4]">note</span>
                  <span className="text-sm text-muted-foreground">要約記事</span>
                </div>
                <div className="space-y-4 rounded-sm bg-white p-6 shadow-sm">
                  <h4 className="font-medium">動画を、投稿にうつす</h4>
                  <div className="space-y-3 text-sm leading-relaxed text-foreground/70">
                    <p>
                      動画の内容をSNS向けに書き換えるのが大変で、結局投稿が止まる。そんな悩みを抱える人は多いです。
                    </p>
                    <p className="font-medium text-foreground">
                      先に「投稿の形」を決める
                    </p>
                    <p>
                      話した内容を整理して、Xとnoteに合わせて整える。それだけで、迷いが消えます。
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="relative bg-foreground/[0.02] px-6 py-32 md:py-48">
        <div className="pointer-events-none absolute -right-4 top-32 hidden text-[180px] font-extralight leading-none text-foreground/[0.02] md:block">
          04
        </div>

        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              How it works
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="text-2xl font-light leading-relaxed tracking-tight md:text-4xl">
              貼る。選ぶ。押す。
            </h2>
          </FadeIn>

          <div className="mt-16 space-y-12">
            <FadeIn delay={200}>
              <div className="flex gap-8">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-foreground/10 text-sm font-light">
                  1
                </div>
                <div className="space-y-2 pt-2">
                  <p className="text-lg font-medium">YouTube URLを貼る</p>
                  <p className="text-sm text-muted-foreground">
                    変換したい動画のURLをコピーして貼り付けるだけ。
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="flex gap-8">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-foreground/10 text-sm font-light">
                  2
                </div>
                <div className="space-y-2 pt-2">
                  <p className="text-lg font-medium">3つの項目を選ぶ</p>
                  <p className="text-sm text-muted-foreground">
                    投稿タイプ、トーン、絵文字の有無。選択肢から選ぶだけ。
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="flex gap-8">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-foreground/10 text-sm font-light">
                  3
                </div>
                <div className="space-y-2 pt-2">
                  <p className="text-lg font-medium">「投稿を作る」を押す</p>
                  <p className="text-sm text-muted-foreground">
                    XスレッドとnoteのMagazine記事が完成。そのままコピーして投稿できます。
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 料金セクション */}
      <section className="relative px-6 py-32 md:py-48">
        <div className="pointer-events-none absolute -left-4 top-32 hidden text-[180px] font-extralight leading-none text-foreground/[0.02] md:block">
          05
        </div>

        <div className="mx-auto max-w-xl text-center">
          <FadeIn>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Pricing
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="text-2xl font-light leading-relaxed tracking-tight md:text-4xl">
              シンプルな料金
            </h2>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="mt-12 rounded-sm border border-foreground/10 bg-white p-8 md:p-12">
              <p className="text-5xl font-extralight tracking-tight md:text-6xl">
                ¥1,480
                <span className="text-lg font-normal text-muted-foreground">/月</span>
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                月30動画まで
              </p>
              <div className="mt-8 space-y-2 text-sm text-muted-foreground">
                <p>Xスレッド + note記事を一括で作成</p>
                <p>日本語SNSに最適化された表現</p>
                <p>タイトル案を3つ提案</p>
              </div>
              <div className="mt-10">
                <Link
                  href="/"
                  className="inline-block w-full bg-foreground px-10 py-4 text-sm font-medium tracking-wide text-primary-foreground transition-all hover:bg-foreground/90 active:scale-[0.98]"
                >
                  はじめる
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="relative bg-foreground px-6 py-32 text-primary-foreground md:py-48">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn>
            <h2 className="text-2xl font-light leading-relaxed tracking-tight md:text-4xl">
              動画を作ったら、
              <br />
              投稿も作る。
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="mt-6 text-sm text-primary-foreground/70 md:text-base">
              書くのが苦手でも、発信は続けられる。
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="mt-12">
              <Link
                href="/"
                className="inline-block border border-primary-foreground/20 bg-primary-foreground px-10 py-4 text-sm font-medium tracking-wide text-foreground transition-all hover:bg-primary-foreground/90 active:scale-[0.98]"
              >
                無料ではじめる
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-foreground/5 px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Utsusu
          </p>
          <p className="text-xs text-muted-foreground">
            動画を、投稿にうつす。
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
