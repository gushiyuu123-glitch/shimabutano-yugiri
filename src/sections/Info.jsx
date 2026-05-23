// src/sections/Info.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Info.module.css";

export default function Info({
  id = "info",

  // 架空：実在誤認を避けるなら空でOK（TELリンクも消える）
  phone = "",

  // ピン住所じゃなく「牧志エリア検索」
  mapUrl =
    "https://www.google.com/maps/search/?api=1&query=%E9%82%A3%E8%A6%87%20%E7%89%A7%E5%BF%97%20%E5%9B%BD%E9%9A%9B%E9%80%9A%E3%82%8A",

  // 番地は出さない（架空安全）
  address = {
    postal: "",
    line1: "沖縄県那覇市 牧志（国際通り付近）",
    line2: "路地側の静かな位置",
  },

  hours = {
    weekday: "平日　　17:30 – 22:30（最終入店 20:30）",
    holiday1: "土日祝　11:30 – 14:30（最終入店 13:30）",
    holiday2: "　　　　17:30 – 22:30（最終入店 20:30）",
  },

  // ✅ ここは残す（営業時間ブロックに統合して使う）
  closed = "水曜日",

  access = ["ゆいレール 牧志駅より徒歩圏内", "那覇空港から車で約20分前後"],
  parking = ["専用駐車場はございません", "近隣コインPをご利用ください"],
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

  // 木陰ドリフト（軽量）
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
            {telHref ? (
              <a className={styles.action} href={telHref}>
                TEL <span className={styles.arrow}>→</span>
              </a>
            ) : (
              <span className={styles.action} aria-hidden="true">
                TEL <span className={styles.arrow}>→</span>
              </span>
            )}
            <span className={styles.pipe} aria-hidden="true" />
            <a className={styles.action} href={mapUrl} target="_blank" rel="noreferrer noopener">
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
              <p className={styles.kicker}>あんない</p>
              <h2 className={styles.titleVert}>場所と時間。</h2>
            </header>

            <div className={styles.diagramWrap} style={{ "--d": "140ms" }}>
              <div className={styles.diagram}>
                <svg
                  className={styles.wires}
                  viewBox="0 0 1000 520"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <line x1="320" y1="80" x2="320" y2="310" />
                  <circle cx="320" cy="90" r="3.2" />
                  <circle cx="320" cy="190" r="3.2" />
                  <circle cx="320" cy="290" r="3.2" />
                  <line x1="320" y1="90" x2="410" y2="90" />

                  {/* ✅ 削除：定休日ノードへの配線 */}
                  {/* <line x1="570" y1="135" x2="785" y2="135" /> */}
                  {/* <circle cx="785" cy="135" r="3.2" /> */}

                  <line x1="320" y1="190" x2="410" y2="190" />
                  <line x1="320" y1="290" x2="520" y2="290" />
                  <line x1="210" y1="430" x2="340" y2="430" />
                </svg>

                <div className={`${styles.node} ${styles.nodeAddr}`}>
                  <p className={styles.label}>場所</p>
                  {address.postal ? <p className={styles.text}>{address.postal}</p> : null}
                  <p className={styles.text}>{address.line1}</p>
                  {address.line2 ? <p className={styles.text}>{address.line2}</p> : null}
                </div>

                <div className={`${styles.node} ${styles.nodeHours}`}>
                  <p className={styles.label}>営業時間</p>
                  <p className={styles.textMono}>{hours.weekday}</p>
                  <p className={styles.textMono}>{hours.holiday1}</p>
                  <p className={styles.textMono}>{hours.holiday2}</p>
                  <p className={styles.textMono}>定休　{closed}</p>
                </div>

                {/* ✅ 削除：定休日ノード */}
                {/* <div className={`${styles.node} ${styles.nodeClosed}`}> ... </div> */}

                <div className={`${styles.node} ${styles.nodeAccess}`}>
                  <p className={styles.label}>アクセス</p>
                  {access.slice(0, 2).map((t) => (
                    <p key={t} className={styles.text}>
                      {t}
                    </p>
                  ))}
                </div>

                <div className={`${styles.node} ${styles.nodeParking}`}>
                  <p className={styles.label}>駐車場</p>
                  {parking.slice(0, 2).map((t) => (
                    <p key={t} className={styles.text}>
                      {t}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <aside className={styles.memoWrap} style={{ "--d": "200ms" }}>
              <p className={styles.memoSide}>目印</p>
              <div className={styles.memo}>
                <div className={styles.memoPaper}>
                  {marks.slice(0, 3).map((t) => (
                    <p key={t} className={styles.memoLine}>
                      {t}
                    </p>
                  ))}
                  <span className={styles.stamp} aria-hidden="true">
                    印
                  </span>
                </div>
              </div>
            </aside>
          </div>

          <div className={styles.bottom} style={{ "--d": "260ms" }}>
            <span className={styles.bottomLine} aria-hidden="true" />
            <span className={styles.bottomText}>SHIMABUTA NO YUGIRI</span>
          </div>
        </div>
      </div>
    </section>
  );
}