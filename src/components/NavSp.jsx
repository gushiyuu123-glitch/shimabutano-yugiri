// src/components/NavSp.jsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./NavSp.module.css";

const LOGO = [
  { key: "shima", src: "/calli/shima.svg", cls: styles.l1 },
  { key: "buta", src: "/calli/buta.svg", cls: styles.l2 },
  { key: "no",   src: "/calli/no.svg",   cls: `${styles.l3} ${styles.lNo}` },
  { key: "yu",   src: "/calli/yu.svg",   cls: styles.l4 },
  { key: "kiri", src: "/calli/kiri.svg", cls: styles.l5 },
];

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

export default function NavSp({
  items = [],
  heroId = "heroSp",
  footerId = "footerSp",
  offset, // 数値が来たら優先。無ければ nav 実寸で自動
}) {
  const reduce = usePrefersReducedMotion();
  const navRef = useRef(null);

  const [show, setShow] = useState(false);
  const [active, setActive] = useState(items?.[0]?.id ?? "");
  const [navOffset, setNavOffset] = useState(72);
  const [open, setOpen] = useState(false);

  const firstLinkRef = useRef(null);

  const activeLabel = useMemo(() => {
    const hit = items.find((it) => it.id === active);
    return hit?.label ?? "";
  }, [items, active]);

  // ✅ offset が無ければ nav 実寸（リサイズ追従）
  useLayoutEffect(() => {
    if (Number.isFinite(offset)) {
      setNavOffset(offset);
      return;
    }

    const measure = () => {
      const h = navRef.current?.getBoundingClientRect?.().height;
      setNavOffset(Math.round(h || 72));
    };

    measure();
    const raf = requestAnimationFrame(measure);

    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [offset]);

  // 1) 出番：Hero/Footer inViewでは隠す
  useEffect(() => {
    const hero = document.getElementById(heroId);
    const footer = document.getElementById(footerId);
    const targets = [hero, footer].filter(Boolean);

    if (!targets.length) {
      setShow(true);
      return;
    }

    let heroIn = false;
    let footerIn = false;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === hero) heroIn = e.isIntersecting;
          if (e.target === footer) footerIn = e.isIntersecting;
        }
        setShow(!(heroIn || footerIn));
      },
      { threshold: 0.001, rootMargin: "-58% 0px -34% 0px" }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [heroId, footerId]);

  // 2) Active：section監視
  useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter(Boolean);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) setActive(visible.target.id);
      },
      { threshold: [0.25, 0.35, 0.45, 0.55], rootMargin: "-18% 0px -62% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  // 3) スクロールジャンプ（navOffset考慮）
  const onJump = (id) => (e) => {
    e?.preventDefault?.();
    const el = document.getElementById(id);
    if (!el) return;

    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - navOffset);
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    setOpen(false);
  };

  // 4) open中：スクロールロック + ESCで閉じる + 初期フォーカス
  useEffect(() => {
    if (!open) return;

    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);

    const raf = requestAnimationFrame(() => {
      firstLinkRef.current?.focus?.();
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      ref={navRef}
      className={`${styles.nav} ${show ? styles.isOn : styles.isOff}`}
      aria-label="サイトナビ（SP）"
    >
      <div className={styles.inner}>
        <a className={styles.brand} href={`#${heroId}`} onClick={onJump(heroId)} aria-label="島豚の湯霧">
          <span className={styles.brandMark} aria-hidden="true">
            {LOGO.map((g) => (
              <img
                key={g.key}
                className={`${styles.logoGlyph} ${g.cls}`}
                src={g.src}
                alt=""
                draggable="false"
                decoding="async"
              />
            ))}
          </span>
          <span className={styles.srOnly}>島豚の湯霧</span>
        </a>

        <button
          type="button"
          className={styles.menuBtn}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="spMenu"
        >
          <span className={styles.menuTop}>
            <span className={styles.menuLabel}>目次</span>
            <span className={styles.menuNow} aria-hidden="true">
              {activeLabel}
            </span>
          </span>

          <span className={styles.menuIcon} aria-hidden="true">
            <i className={styles.i1} />
            <i className={styles.i2} />
            <i className={styles.i3} />
          </span>
        </button>
      </div>

      {/* sheet */}
      <div
        id="spMenu"
        className={`${styles.sheetWrap} ${open ? styles.sheetOn : ""}`}
        aria-hidden={!open}
      >
        <div className={styles.backdrop} onClick={() => setOpen(false)} />

        <div className={styles.sheet} role="dialog" aria-modal="true" aria-label="目次">
          <div className={styles.sheetHead}>
            <p className={styles.sheetK}>CONTENTS</p>
            <p className={styles.sheetMeta}>いま：{activeLabel || "—"}</p>
          </div>

          <nav className={styles.sheetNav} aria-label="ページ内リンク（SP）">
            <ul className={styles.sheetList}>
              {items.map((it, idx) => {
                const isAct = active === it.id;
                const isFirst = idx === 0;

                return (
                  <li key={it.id} className={styles.sheetItem}>
                    <span className={styles.vLine} aria-hidden="true" />
                    <a
                      ref={isFirst ? firstLinkRef : null}
                      href={`#${it.id}`}
                      onClick={onJump(it.id)}
                      className={`${styles.sheetLink} ${isAct ? styles.sheetActive : ""}`}
                      aria-current={isAct ? "page" : undefined}
                    >
                      <span className={styles.linkJa}>{it.label}</span>
                      <span className={styles.linkEn}>{String(it.id).replace(/Sp$/, "").toUpperCase()}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={styles.sheetFoot}>
            <button type="button" className={styles.closeBtn} onClick={() => setOpen(false)}>
              閉じる
            </button>
            <span className={styles.footRule} aria-hidden="true" />
          </div>
        </div>
      </div>
    </header>
  );
}