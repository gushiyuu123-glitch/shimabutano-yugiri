// src/sections/HeroSp.jsx
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./HeroSp.module.css";

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const onChange = () => setReduce(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return reduce;
}

const CALLI = [
  { key: "shima", src: "/calli/shima.svg", className: styles.c1 },
  { key: "buta", src: "/calli/buta.svg", className: styles.c2 },
  { key: "no", src: "/calli/no.svg", className: `${styles.c3} ${styles.cNo}` },
  { key: "yu", src: "/calli/yu.svg", className: styles.c4 },
  { key: "kiri", src: "/calli/kiri.svg", className: styles.c5 },
];

const YAMASOI_SRC = "/calli/dashidekimaru2.svg";
const HERO_IMG = "/images/herosp.jpeg";

export default function HeroSp({ id = "heroSp" }) {
  const reduce = usePrefersReducedMotion();
  const [inView, setInView] = useState(false);

  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const glyphRefs = useRef([]);
  const yamasoiRef = useRef(null);

  glyphRefs.current = [];
  const addGlyphRef = (el) => el && glyphRefs.current.push(el);

  // “像が整う”スイッチ（SPは即）
  useEffect(() => {
    if (reduce) {
      setInView(true);
      return;
    }
    const raf = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  useEffect(() => {
    const hero = sectionRef.current;
    const bg = bgRef.current;
    const glyphs = glyphRefs.current;
    const yamasoi = yamasoiRef.current;

    if (!hero || !bg || !glyphs.length) return;

    // 初期を「存在しない」に固定（チラつき殺し）
    glyphs.forEach((el) => {
      el.style.setProperty("--clip", "100%");
      el.style.setProperty("--m", "-80");
    });

    if (yamasoi) {
      yamasoi.style.opacity = "0";
      yamasoi.style.transform = "translate3d(0,10px,0) rotate(-6deg) scale(0.985)";
    }

    // Reduce motion：即表示
    if (reduce) {
      gsap.set(bg, { opacity: 1, scale: 1 });
      glyphs.forEach((el) => {
        el.style.setProperty("--clip", "0%");
        el.style.setProperty("--m", "0");
      });
      if (yamasoi) {
        yamasoi.style.opacity = "0.72";
        yamasoi.style.transform = "translate3d(0,0,0) rotate(-6deg) scale(1)";
      }
      return;
    }

    const ctx = gsap.context(() => {
      // bg：SPは“1回だけ整える”で終了（常時演出なし）
      gsap.set(bg, {
        opacity: 0,
        scale: 1.04,
        transformOrigin: "46% 52%",
        force3D: true,
        willChange: "opacity, transform",
      });

      // 背景の温度（CSS変数で）
      bg.style.setProperty("--bgB", "1.07");
      bg.style.setProperty("--bgC", "0.95");
      bg.style.setProperty("--bgS", "0.92");

// yamasoi 初期化：CSS transform に頼らず GSAPで中央固定
if (yamasoi) {
  gsap.set(yamasoi, {
    autoAlpha: 0,
    y: 10,
    rotate: -6,
    scale: 0.985,
    left: "50%",
    xPercent: -50,     // ✅ これが中央固定の本体
    transformOrigin: "50% 50%",
    force3D: true,
    willChange: "opacity, transform",
  });
}

      const byKey = new Map();
      glyphs.forEach((el) => byKey.set(el.dataset.key, el));

      // 画像デコード後に “背景→筆→署名” の順で一回だけ
      let alive = true;

      const play = () => {
        if (!alive) return;

        const tl = gsap.timeline({ delay: 0.08 });

        // 背景：像が整う（SPは少し速い）
        tl.to(bg, { opacity: 1, scale: 1, duration: 0.92, ease: "power2.out" }, 0);

        // 筆文字：SPはテンポ少し速め
        let t = 0.12;
        CALLI.forEach(({ key }) => {
          const el = byKey.get(key);
          if (!el) return;

          const isNo = key === "no";
          const dur = isNo ? 0.62 : 0.74;
          const extra = isNo ? 0.10 : 0;

          tl.to(el, { duration: dur, ease: "power3.out", "--clip": "0%", "--m": "0" }, t + extra);
          t += 0.14 + extra;
        });

        // 署名：最後に“乾いた墨”で置く
        if (yamasoi) {
          tl.to(yamasoi, { autoAlpha: 0.72, y: 0, scale: 1, duration: 0.72, ease: "power3.out" }, t + 0.12);
        }
      };

      const preload = new Image();
      preload.src = HERO_IMG;

      if (preload.decode) {
        preload.decode().then(play).catch(play);
      } else {
        preload.onload = play;
        preload.onerror = play;
      }

      return () => {
        alive = false;
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`${styles.hero} ${inView ? styles.isIn : ""} ${reduce ? styles.reduce : ""}`}
      style={{ "--heroImg": `url("${HERO_IMG}")` }}
      aria-label="Hero (SP)"
    >
      <div className={styles.bgWrap} aria-hidden="true">
        <div ref={bgRef} className={styles.bg} />
      </div>

      <h1 className={styles.srOnly}>島豚の湯霧</h1>

      <div className={styles.calli} role="img" aria-label="島豚の湯霧">
        {CALLI.map((g) => (
          <img
            key={g.key}
            ref={addGlyphRef}
            data-key={g.key}
            className={`${styles.cGlyph} ${g.className}`}
            src={g.src}
            alt=""
            aria-hidden="true"
            decoding="async"
            draggable="false"
            style={{ "--clip": "100%", "--m": "-80" }}
          />
        ))}
      </div>

      <img
        ref={yamasoiRef}
        className={styles.yamasoi}
        src={YAMASOI_SRC}
        alt=""
        aria-hidden="true"
        draggable="false"
        decoding="async"
      />

      {/* SPドック：1系統だけ（最大化） */}
      <div className={styles.dock}>
        <div className={`${styles.kicker} ${styles.reveal}`} style={{ "--d": "60ms" }}>
          OKINAWA / SHABU-SHABU
        </div>

        <p className={`${styles.sub} ${styles.reveal}`} style={{ "--d": "220ms" }}>
          島豚を、湯の中で。
          <span className={styles.dot} aria-hidden="true">・</span>
          一口目で、納得。
        </p>

        <div className={`${styles.metaRow} ${styles.reveal}`} style={{ "--d": "320ms" }}>
          <span className={styles.metaLabel}>Course</span>
          <span className={styles.metaNum}>¥4,200 — ¥7,800</span>
          <span className={styles.metaDivider} aria-hidden="true">／</span>
          <span className={styles.metaVal}>目安 90分前後</span>
        </div>
      </div>
    </section>
  );
}