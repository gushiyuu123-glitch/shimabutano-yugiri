import { useEffect, useMemo, useRef, useState } from "react";
import rv from "./Reveal.module.css";

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

function toDelay(delay) {
  return typeof delay === "number" ? `${delay}ms` : delay;
}

/**
 * RevealImage
 * - 画像用：inView になっても、画像 decode 完了してから出す（ガク防止）
 * - デフォは rv.media（scale中心）
 */
export default function RevealImage({
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

  const wrapRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(false);
  const [isIn, setIsIn] = useState(false);

  const mergedStyle = useMemo(
    () => ({ ...(style || {}), ["--d"]: toDelay(delay) }),
    [style, delay]
  );

  // 1) 画像decode待ち
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    if (reduce) {
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
        img.onload = () => res();
        img.onerror = () => res();
      });
    };

    Promise.all(imgs.map(waitOne)).then(() => {
      if (!alive) return;
      setReady(true);
    });

    return () => {
      alive = false;
    };
  }, [reduce]);

  // 2) inView判定
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    if (reduce) {
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
    if (reduce) return;
    if (seen && ready) setIsIn(true);
  }, [reduce, seen, ready]);

  return (
    <Tag
      ref={wrapRef}
      className={`${rv.base} ${rv.media} ${isIn ? rv.isIn : ""} ${className}`.trim()}
      style={mergedStyle}
      {...props}
    >
      {children}
    </Tag>
  );
}