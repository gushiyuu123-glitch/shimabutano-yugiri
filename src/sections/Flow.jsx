// src/sections/Flow.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Flow.module.css";

const FLOW = [
  {
    key: "reserve",
    no: "01",
    title: "予約",
    lead: "人数と開始時間。席の希望は備考に。",
    meta: "1分",
    point: "アレルギー・苦手も備考に。",
    note: "当日も空きがあれば案内。",
  },
  {
    key: "arrival",
    no: "02",
    title: "来店",
    lead: "お名前確認 → 席へ。鍋の準備をします。",
    meta: "5〜10分",
    point: "遅れる時は、連絡だけでOK。",
    note: "お車は近隣コインPへ。",
  },
  {
    key: "nabe",
    no: "03",
    title: "鍋",
    lead: "湯霧が立ったら、しゃぶしゃぶ。",
    meta: "約70分",
    point: "最初は、何もつけずに。",
    note: "足りない分だけ、あとから追加。",
    hot: true,
  },
  {
    key: "exit",
    no: "04",
    title: "退店",
    lead: "会計して、帰るだけ。",
    meta: "5分",
    point: "忘れ物だけ、確認。",
    note: "次は、定番で。",
  },
];

export default function FlowSection({
  id = "flow",
  durationMs = 680,
  staggerMs = 120,
}) {
  const rootRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin: "0px 0px -18% 0px", threshold: 0.12 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const metaRight = useMemo(
    () => "所要 約90分　｜　予約 1分　｜　席の希望は備考でOK",
    []
  );

  return (
    <section
      id={id}
      ref={rootRef}
      className={`${styles.section} ${inView ? styles.in : ""}`}
      style={{
        "--dur": `${durationMs}ms`,
        "--stagger": `${staggerMs}ms`,
      }}
      aria-label="流れ"
    >
      <div className={styles.wrap}>
        <div className={styles.frame}>
          <header className={styles.head} style={{ "--d": "0ms" }}>
            <div className={styles.headLeft}>
              <p className={styles.kicker}>流れ</p>
          <h2 className={styles.title}>順番は、決まってる。</h2>
              <p className={styles.sub}>予約 → 来店 → 鍋 → 退店。</p>
            </div>
            <p className={styles.meta}>{metaRight}</p>
          </header>

          <div className={styles.list} role="list" aria-label="当日の流れ">
            {FLOW.map((s, i) => {
              const d = 120 + i * staggerMs;
              return (
                <article
                  key={s.key}
                  className={`${styles.item} ${s.hot ? styles.hot : ""}`}
                  style={{ "--d": `${d}ms` }}
                  role="listitem"
                >
                  <div className={styles.left}>
                    <p className={styles.no}>{s.no}</p>
                    <p className={styles.name}>{s.title}</p>
                  </div>

                  <div className={styles.right}>
                    <p className={styles.lead}>{s.lead}</p>

                    <dl className={styles.dl}>
                      <div className={styles.dlRow}>
                        <dt className={styles.dt}>目安</dt>
                        <dd className={styles.dd}>{s.meta}</dd>
                      </div>
                      <div className={styles.dlRow}>
                        <dt className={styles.dt}>ポイント</dt>
                        <dd className={styles.dd}>{s.point}</dd>
                      </div>
                      <div className={styles.dlRow}>
                        <dt className={styles.dt}>備考</dt>
                        <dd className={styles.dd}>{s.note}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              );
            })}
          </div>

          <div
            className={styles.note}
            style={{ "--d": `${120 + FLOW.length * staggerMs + 120}ms` }}
          >
            <p className={styles.noteK}>お願い</p>
            <p className={styles.noteT}>香りのため、強い香水は控えてください。</p>
          </div>
        </div>
      </div>
    </section>
  );
}