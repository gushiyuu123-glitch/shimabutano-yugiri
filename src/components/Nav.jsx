// src/components/Nav.jsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./Nav.module.css";

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

export default function Nav({
  items = [],
  heroId = "hero",
  footerId = "footer",
  offset, // 数値が来たら優先。無ければ nav 実寸で自動
}) {
  const reduce = usePrefersReducedMotion();
  const navRef = useRef(null);

  const [show, setShow] = useState(false);
  const [active, setActive] = useState(items?.[0]?.id ?? "");
  const [navOffset, setNavOffset] = useState(84);

  // ✅ offset が無ければ nav 実寸（リサイズ追従）
  useLayoutEffect(() => {
    if (Number.isFinite(offset)) {
      setNavOffset(offset);
      return;
    }

    const measure = () => {
      const h = navRef.current?.getBoundingClientRect?.().height;
      setNavOffset(Math.round(h || 84));
    };

    measure();
    const raf = requestAnimationFrame(measure);

    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [offset]);

  // 1) 出番：Hero/Footer inView では隠す。Heroが“中央帯”から外れたら出す。
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
      {
        threshold: 0.001,
        rootMargin: "-58% 0px -34% 0px",
      }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [heroId, footerId]);

  // 2) Active：section監視（下線だけ）
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
      {
        threshold: [0.25, 0.35, 0.45, 0.55],
        rootMargin: "-18% 0px -62% 0px",
      }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  const onJump = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - navOffset);
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <header
      ref={navRef}
      className={`${styles.nav} ${show ? styles.isOn : styles.isOff}`}
      aria-label="サイトナビ"
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

        <nav className={styles.links} aria-label="ページ内リンク">
          <ul className={styles.list}>
            {items.map((it, idx) => {
              const isLast = idx === items.length - 1;
              const isAct = active === it.id;

              return (
                <li key={it.id} className={styles.item}>
                  <a
                    href={`#${it.id}`}
                    onClick={onJump(it.id)}
                    className={`${styles.link} ${isAct ? styles.isActive : ""}`}
                    aria-current={isAct ? "page" : undefined}
                  >
                    {it.label}
                  </a>
                  {!isLast && <span className={styles.sep} aria-hidden="true">／</span>}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}