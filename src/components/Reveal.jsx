// src/components/Reveal.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import rv from "./Reveal.module.css";

/* ----------------------------
  Reduced motion（1本化）
---------------------------- */
function getReduceNow() {
  return !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

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

/* ----------------------------
  InView（共通）
---------------------------- */
function useInView(ref, { once, threshold, rootMargin, disabled }) {
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (disabled) {
      setIsIn(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;

        if (e.isIntersecting) {
          setIsIn(true);
          if (once) io.disconnect();
        } else if (!once) {
          setIsIn(false);
        }
      },
      { threshold, rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, threshold, rootMargin, disabled]);

  return isIn;
}

function toDelay(delay) {
  return typeof delay === "number" ? `${delay}ms` : delay;
}

/* =========================================================
  RevealText
  文字：opacity + y + micro-scale
  - data-in を付与（子SVG/演出のトリガーに使える）
========================================================= */
export function RevealText({
  as: Tag = "div",
  className = "",
  delay = 0,
  once = true,
  threshold = 0.12,
  rootMargin = "0px 0px -18% 0px",
  children,
  style,
  ...props
}) {
  const reduce = usePrefersReducedMotion();
  const ref = useRef(null);

  // reduce は初回レンダで false の可能性があるので、同期判定も混ぜて事故を減らす
  const disabled = reduce || (typeof window !== "undefined" && getReduceNow());

  const isIn = useInView(ref, { once, threshold, rootMargin, disabled });

  const mergedStyle = useMemo(
    () => ({ ...(style || {}), ["--d"]: toDelay(delay) }),
    [style, delay]
  );

  return (
    <Tag
      ref={ref}
      data-in={isIn ? "1" : "0"}
      className={`${rv.base} ${rv.text} ${isIn ? rv.isIn : ""} ${className}`.trim()}
      style={mergedStyle}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* =========================================================
  RevealMedia
  画像/背景：opacity + micro-scale（yは基本0）
========================================================= */
export function RevealMedia({
  as: Tag = "div",
  className = "",
  delay = 0,
  once = true,
  threshold = 0.12,
  rootMargin = "0px 0px -16% 0px",
  children,
  style,
  ...props
}) {
  const reduce = usePrefersReducedMotion();
  const ref = useRef(null);

  const disabled = reduce || (typeof window !== "undefined" && getReduceNow());
  const isIn = useInView(ref, { once, threshold, rootMargin, disabled });

  const mergedStyle = useMemo(
    () => ({ ...(style || {}), ["--d"]: toDelay(delay) }),
    [style, delay]
  );

  return (
    <Tag
      ref={ref}
      data-in={isIn ? "1" : "0"}
      className={`${rv.base} ${rv.media} ${isIn ? rv.isIn : ""} ${className}`.trim()}
      style={mergedStyle}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* =========================================================
  RevealInk
  手書き/筆：maskを一度だけ走らせる（対応してなければ通常のfade）
========================================================= */
export function RevealInk({
  as: Tag = "span",
  className = "",
  delay = 0,
  once = true,
  threshold = 0.12,
  rootMargin = "0px 0px -18% 0px",
  children,
  style,
  ...props
}) {
  const reduce = usePrefersReducedMotion();
  const ref = useRef(null);

  const disabled = reduce || (typeof window !== "undefined" && getReduceNow());
  const isIn = useInView(ref, { once, threshold, rootMargin, disabled });

  const mergedStyle = useMemo(
    () => ({ ...(style || {}), ["--d"]: toDelay(delay) }),
    [style, delay]
  );

  return (
    <Tag
      ref={ref}
      data-in={isIn ? "1" : "0"}
      className={`${rv.base} ${rv.ink} ${isIn ? rv.isIn : ""} ${className}`.trim()}
      style={mergedStyle}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* =========================================================
  RevealImage（default）
  - inViewになっても “画像decode完了後” に出す（ガク殺し）
  - children内の img を拾う
  - deps を渡すと decode判定を作り直せる（差し替え対応）
========================================================= */
export default function RevealImage({
  as: Tag = "div",
  className = "",
  delay = 0,
  once = true,
  threshold = 0.12,
  rootMargin = "0px 0px -16% 0px",
  children,
  style,
  deps = [],
  ...props
}) {
  const reduce = usePrefersReducedMotion();

  const wrapRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(false);
  const [isIn, setIsIn] = useState(false);

  const mergedStyle = useMemo(
    () => ({ ...(style || {}), ["--d"]: toDelay(delay) }),
    // deps を style と同じ扱いにしてもいいが、まずは decode再評価用途に限定
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [style, delay, ...deps]
  );

  // 0) deps が変わったら decode状態を作り直す
  useEffect(() => {
    if (reduce) return;
    setReady(false);
    setSeen(false);
    setIsIn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, ...deps]);

  // 1) 画像decode待ち
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    if (reduce || getReduceNow()) {
      setReady(true);
      return;
    }

    const imgs = Array.from(el.querySelectorAll("img"));
    if (!imgs.length) {
      setReady(true);
      return;
    }

    let alive = true;

    const waitOne = (img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      if (img.decode) return img.decode().catch(() => {});
      return new Promise((res) => {
        const onDone = () => res();
        img.onload = onDone;
        img.onerror = onDone;
      });
    };

    Promise.all(imgs.map(waitOne)).then(() => {
      if (!alive) return;
      setReady(true);
    });

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, ...deps]);

  // 2) inView判定
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    if (reduce || getReduceNow()) {
      setSeen(true);
      setIsIn(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;

        if (e.isIntersecting) {
          setSeen(true);
          if (ready) {
            setIsIn(true);
            if (once) io.disconnect();
          }
        } else if (!once) {
          setIsIn(false);
        }
      },
      { threshold, rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduce, once, threshold, rootMargin, ready]);

  // 3) readyが後から来た時、seenなら出す
  useEffect(() => {
    if (reduce || getReduceNow()) return;
    if (seen && ready) setIsIn(true);
  }, [reduce, seen, ready]);

  return (
    <Tag
      ref={wrapRef}
      data-in={isIn ? "1" : "0"}
      className={`${rv.base} ${rv.media} ${isIn ? rv.isIn : ""} ${className}`.trim()}
      style={mergedStyle}
      {...props}
    >
      {children}
    </Tag>
  );
}