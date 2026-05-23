// src/sections/Info.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Info.module.css";

export default function Info({
  id = "info",
  phone = "098-917-2038",
  mapUrl = "https://www.google.com/maps?q=%E6%B2%96%E7%B8%84%E7%9C%8C%E9%82%A3%E8%A6%87%E5%B8%82%E7%89%A7%E5%BF%972-7-18",
  address = {
    postal: "〒900-0013",
    line1: "沖縄県那覇市牧志2丁目7-18 2F",
    line2: "国際通りから徒歩4分（路地側）",
  },
  hours = {
    weekday: "平日　　17:30 – 22:30（最終入店 20:30）",
    holiday1: "土日祝　11:30 – 14:30（最終入店 13:30）",
    holiday2: "　　　　17:30 – 22:30（最終入店 20:30）",
  },
  closed = "水曜日",
  access = ["ゆいレール 牧志駅より徒歩7分", "那覇空港から車で約18分"],
  parking = ["専用2台（満車時は近隣P）", "近隣コインP 徒歩2分圏内"],
  marks = ["入口は路地側", "看板は小さめ", "迷ったら電話"],
}) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const [inView, setInView] = useState(false);

  const telHref = useMemo(() => {
    const digits = (phone || "").replace(/[^\d+]/g, "");
    return digits ? `tel:${digits}` : "";
  }, [phone]);

  // inView
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin: "0px 0px -18% 0px", threshold: 0.12 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 木陰ドリフト（左右＋少し上下）
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce || !inView) return;

    let raf = 0;
    let last = 0;
    const start = performance.now();

    const tick = (now) => {
      if (now - last < 33) {
        raf = requestAnimationFrame(tick);
        return;
      }
      last = now;

      const t = (now - start) / 1000;

      const x1 = Math.sin(t * 0.22) * 1.25 + Math.sin(t * 0.57) * 0.26;
      const y1 = Math.sin(t * 0.18 + 1.4) * 0.52 + Math.sin(t * 0.41) * 0.16;
      const r1 = Math.sin(t * 0.12) * 0.18;

      const x2 = Math.sin(t * 0.16 + 2.1) * 0.92 + Math.sin(t * 0.43) * 0.18;
      const y2 = Math.sin(t * 0.14 + 0.6) * 0.40 + Math.sin(t * 0.33) * 0.12;
      const r2 = Math.sin(t * 0.09 + 0.9) * 0.14;

      stage.style.setProperty("--tx1", `${x1.toFixed(3)}%`);
      stage.style.setProperty("--ty1", `${y1.toFixed(3)}%`);
      stage.style.setProperty("--tr1", `${r1.toFixed(3)}deg`);

      stage.style.setProperty("--tx2", `${x2.toFixed(3)}%`);
      stage.style.setProperty("--ty2", `${y2.toFixed(3)}%`);
      stage.style.setProperty("--tr2", `${r2.toFixed(3)}deg`);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <section
      id={id}
      ref={rootRef}
      className={`${styles.section} ${inView ? styles.in : ""}`}
      aria-label="店舗情報"
    >
      <div className={styles.wrap}>
        <div className={styles.stage} ref={stageRef}>
          <span className={styles.shadow2} aria-hidden="true" />

          <div className={styles.actions} style={{ "--d": "0ms" }}>
            <a className={styles.action} href={telHref}>
              TEL <span className={styles.arrow}>→</span>
            </a>
            <span className={styles.pipe} aria-hidden="true" />
            <a className={styles.action} href={mapUrl} target="_blank" rel="noreferrer">
              MAP <span className={styles.arrow}>→</span>
            </a>
          </div>

          <div className={styles.layout}>
            <aside className={styles.rail} style={{ "--d": "40ms" }}>
              <div className={styles.railInner}>
                <p className={styles.railJa}>島豚の湯霧</p>
                <p className={styles.railEn}>SHIMABUTA NO YUGIRI</p>
              </div>
              <span className={styles.railLine} aria-hidden="true" />
            </aside>

            <header className={styles.titleBlock} style={{ "--d": "80ms" }}>
              <p className={styles.kicker}>INFO</p>
              <h2 className={styles.titleVert}>迷わず、辿り着く。</h2>
            </header>

            <div className={styles.diagramWrap} style={{ "--d": "140ms" }}>
              <div className={styles.diagram}>
                <svg className={styles.wires} viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">
                  <line x1="320" y1="80" x2="320" y2="310" />
                  <circle cx="320" cy="90" r="3.2" />
                  <circle cx="320" cy="190" r="3.2" />
                  <circle cx="320" cy="290" r="3.2" />
                  <line x1="320" y1="90" x2="410" y2="90" />
                  <line x1="570" y1="135" x2="785" y2="135" />
                  <circle cx="785" cy="135" r="3.2" />
                  <line x1="320" y1="190" x2="410" y2="190" />
                  <line x1="320" y1="290" x2="520" y2="290" />
                  <line x1="210" y1="430" x2="340" y2="430" />
                </svg>

                <div className={`${styles.node} ${styles.nodeAddr}`}>
                  <p className={styles.label}>住所</p>
                  <p className={styles.text}>{address.postal}</p>
                  <p className={styles.text}>{address.line1}</p>
                  <p className={styles.text}>{address.line2}</p>
                </div>

                <div className={`${styles.node} ${styles.nodeHours}`}>
                  <p className={styles.label}>営業時間</p>
                  <p className={styles.textMono}>{hours.weekday}</p>
                  <p className={styles.textMono}>{hours.holiday1}</p>
                  <p className={styles.textMono}>{hours.holiday2}</p>
                </div>

                <div className={`${styles.node} ${styles.nodeClosed}`}>
                  <p className={styles.label}>定休日</p>
                  <p className={styles.text}>{closed}</p>
                </div>

                <div className={`${styles.node} ${styles.nodeAccess}`}>
                  <p className={styles.label}>アクセス</p>
                  {access.slice(0, 2).map((t) => (
                    <p key={t} className={styles.text}>{t}</p>
                  ))}
                </div>

                <div className={`${styles.node} ${styles.nodeParking}`}>
                  <p className={styles.label}>駐車場</p>
                  {parking.slice(0, 2).map((t) => (
                    <p key={t} className={styles.text}>{t}</p>
                  ))}
                </div>
              </div>
            </div>

            <aside className={styles.memoWrap} style={{ "--d": "200ms" }}>
              <p className={styles.memoSide}>お越しの目印</p>
              <div className={styles.memo}>
                <div className={styles.memoPaper}>
                  {marks.slice(0, 3).map((t) => (
                    <p key={t} className={styles.memoLine}>{t}</p>
                  ))}
                  <span className={styles.stamp} aria-hidden="true">印</span>
                </div>
              </div>
            </aside>
          </div>

          <div className={styles.bottom} style={{ "--d": "260ms" }}>
            <span className={styles.bottomLine} aria-hidden="true" />
            <span className={styles.bottomText}>NAHA / MAKISHI</span>
          </div>
        </div>
      </div>
    </section>
  );
}