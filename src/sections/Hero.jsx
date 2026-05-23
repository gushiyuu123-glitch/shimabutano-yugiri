// src/sections/Hero.jsx
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

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
  { key: "kiri", src: "/calli/kiri.svg", className: styles.c5 }, // 霧だけ右寄せはCSS側
];

// 右下：出汁で決まる（SVG）
const YAMASOI_SRC = "/calli/dashidekimaru2.svg";

// ✅ 画像パスはここ1箇所に集約（CSSにもJSにも同じ値が入る）
const HERO_IMG = "/images/hero.jpeg";

export default function Hero() {
  const reduce = usePrefersReducedMotion();
  const [inView, setInView] = useState(false);

  const sectionRef = useRef(null);
  const bgWrapRef = useRef(null); // スクロール担当
  const bgRef = useRef(null); // 呼吸(scale/露光)担当
  const glyphRefs = useRef([]);
  const yamasoiRef = useRef(null);

  // refs reset each render
  glyphRefs.current = [];
  const addGlyphRef = (el) => {
    if (el) glyphRefs.current.push(el);
  };

  // 左下テキスト（像が整う）開始スイッチ
  useEffect(() => {
    if (reduce) {
      setInView(true);
      return;
    }
    const raf = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  useEffect(() => {
    const glyphs = glyphRefs.current;
    if (!glyphs.length) return;

    // 初期を確実に「存在しない」にする（最初から見える事故を殺す）
    glyphs.forEach((el) => {
      el.style.setProperty("--clip", "100%");
      el.style.setProperty("--m", "-80");
    });

    // 山ソイも初期は消す
    if (yamasoiRef.current) {
      yamasoiRef.current.style.opacity = "0";
      yamasoiRef.current.style.transform =
        "translate3d(0,10px,0) rotate(-6deg) scale(0.985)";
    }

    // Reduce motion：即表示
    if (reduce) {
      glyphs.forEach((el) => {
        el.style.setProperty("--clip", "0%");
        el.style.setProperty("--m", "0");
      });

      if (bgRef.current) gsap.set(bgRef.current, { opacity: 1, scale: 1 });

      if (yamasoiRef.current) {
        yamasoiRef.current.style.opacity = "0.72";
        yamasoiRef.current.style.transform =
          "translate3d(0,0,0) rotate(-6deg) scale(1)";
      }
      return;
    }

    const ctx = gsap.context(() => {
      const hero = sectionRef.current;
      const bgWrap = bgWrapRef.current;
      const bg = bgRef.current;
      const yamasoi = yamasoiRef.current;

      if (!hero || !bgWrap || !bg) return;

      // ✅ ガク殺し：bgは「数値で固定」して intro で整える
      gsap.set(bgWrap, { yPercent: 0, force3D: true, willChange: "transform" });
      gsap.set(bg, {
        opacity: 0,
        scale: 1.035,
        transformOrigin: "46% 52%",
        force3D: true,
        willChange: "opacity, transform",
      });

      // “温度”の呼吸用（CSSが対応していれば効く）
      bg.style.setProperty("--bgB", "1.08");
      bg.style.setProperty("--bgC", "0.95");
      bg.style.setProperty("--bgS", "0.92");

      // 山ソイ初期
      if (yamasoi) {
        gsap.set(yamasoi, {
          autoAlpha: 0,
          y: 10,
          rotate: -6,
          scale: 0.985,
          transformOrigin: "50% 50%",
          force3D: true,
          willChange: "opacity, transform",
        });
      }

      // 背景：像が整うフェード
      const introTl = gsap.timeline({ paused: true });
      introTl.to(bg, { opacity: 1, scale: 1, duration: 1.22, ease: "power2.out" }, 0);

      // 背景：生きてる呼吸（scale + “温度”だけ）
      let breathTween = null;
      const startBreath = () => {
        const isPC = window.matchMedia?.("(min-width: 861px)")?.matches;
        if (!isPC || breathTween) return;

        breathTween = gsap.to(bg, {
          scale: 1.006,
          duration: 7.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          overwrite: false,
        });

        gsap.to(bg, {
          "--bgB": 1.09,
          "--bgS": 0.90,
          duration: 7.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          overwrite: false,
        });
      };

      // 画像が“デコード後”に intro する（初期ちらつき・座標ズレ事故を潰す）
      let alive = true;
      const playIntro = () => {
        if (!alive) return;

        introTl.play(0);

        // refreshを同フレームで叩かない（ガク回避）
        requestAnimationFrame(() => {
          if (!alive) return;
          ScrollTrigger.refresh();
        });

        // フェードが落ち着いてから呼吸開始
        gsap.delayedCall(0.35, () => {
          if (!alive) return;
          startBreath();
        });
      };

      const preload = new Image();
      preload.src = HERO_IMG;
      if (preload.decode) {
        preload.decode().then(playIntro).catch(playIntro);
      } else {
        preload.onload = playIntro;
        preload.onerror = playIntro;
      }

      // 筆文字：順番に“墨が走る”
      const tl = gsap.timeline({ delay: 0.18 });

      const byKey = new Map();
      glyphs.forEach((el) => byKey.set(el.dataset.key, el));

      let t = 0;
      CALLI.forEach(({ key }) => {
        const el = byKey.get(key);
        if (!el) return;

        const isNo = key === "no";
        const dur = isNo ? 0.78 : 0.92;
        const extra = isNo ? 0.14 : 0;

        tl.to(
          el,
          { duration: dur, ease: "power3.out", "--clip": "0%", "--m": "0" },
          t + extra
        );

        t += 0.18 + extra;
      });

      // 山ソイ：筆文字が整った後に“乾いた墨”で出す
      if (yamasoi) {
        tl.to(
          yamasoi,
          { autoAlpha: 0.72, y: 0, scale: 1, duration: 0.9, ease: "power3.out" },
          t + 0.18
        );
      }

      // ✅ ScrollTrigger：スクロール連動は bgWrap だけ（transform奪い合いゼロ）
      const st = gsap.to(bgWrap, {
        yPercent: -3.2,
        ease: "none",
        immediateRender: false,
        invalidateOnRefresh: true,
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      return () => {
        alive = false;
        introTl.kill();
        tl.kill();
        st.scrollTrigger?.kill();
        st.kill();
        if (breathTween) breathTween.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`${styles.hero} ${inView ? styles.isIn : ""} ${reduce ? styles.reduce : ""}`}
      style={{ "--heroImg": `url("${HERO_IMG}")` }}
    >
      {/* 背景：スクロール担当 wrapper + 呼吸担当 bg */}
      <div ref={bgWrapRef} className={styles.bgWrap} aria-hidden="true">
        <div ref={bgRef} className={styles.bg} />
      </div>

      {/* 意味はH1で残す（見た目はSVG） */}
      <h1 className={styles.srOnly}>
        OKINAWA / SHABU-SHABU　島豚の湯霧　出汁で、決まる。　沖縄豚 しゃぶしゃぶ　目安 90分
      </h1>

      {/* 右上：筆文字（SVG1文字ずつ） */}
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

      {/* 右下：出汁で決まる（SVG） */}
      <img
        ref={yamasoiRef}
        className={styles.yamasoi}
        src={YAMASOI_SRC}
        alt=""
        aria-hidden="true"
        draggable="false"
        decoding="async"
      />

      {/* 左下：PCだけ（kicker + meta のみ） */}
      <div className={styles.dock}>
        <div className={styles.pc}>
          <div className={`${styles.kicker} ${styles.reveal}`} style={{ "--d": "40ms" }}>
            OKINAWA / SHABU-SHABU
          </div>
<p className={`${styles.sub} ${styles.reveal}`} style={{ "--d": "210ms" }}>
  出汁は一種。最初の一口は、そのまま。
</p>
          <div className={`${styles.metaRow} ${styles.reveal}`} style={{ "--d": "290ms" }}>
            <span className={styles.metaLabel}>沖縄豚 しゃぶしゃぶ</span>
            <span className={styles.metaDivider} aria-hidden="true">
              ／
            </span>
            <span className={styles.metaVal}>目安 90分</span>
          </div>
        </div>
      </div>
    </section>
  );
}