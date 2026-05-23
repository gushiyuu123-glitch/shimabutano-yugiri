// src/sections/Reserve.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Reserve.module.css";

export default function Reserve({
  id = "reserve",
  photoSrc = "/images/store1.jpeg",
  photoAlt = "店舗の写真",
  phone = "03-1234-5678",
  hours = "受付時間：11:00–22:00（不定休）",
  onSubmit,
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
      { root: null, rootMargin: "0px 0px -18% 0px", threshold: 0.14 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const TIMES = useMemo(() => ["11:30", "17:30", "20:00"], []);
  const PEOPLE = useMemo(() => ["1", "2", "3", "4", "5", "6"], []);
  const SEATS = useMemo(
    () => [
      { v: "おまかせ", t: "おまかせ" },
      { v: "大広間", t: "大広間" },
      { v: "半個室", t: "半個室" },
      { v: "カウンター", t: "カウンター" },
    ],
    []
  );

  const [form, setForm] = useState({
    date: "",
    time: "",
    people: "2",
    seat: "おまかせ",
    name: "",
    tel: "",
    note: "",
  });

  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const telHref = useMemo(() => {
    const digits = (phone || "").replace(/[^\d+]/g, "");
    return digits ? `tel:${digits}` : undefined;
  }, [phone]);

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    if (!form.date || !form.time || !form.people || !form.name || !form.tel) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      if (onSubmit) await onSubmit(form);
      else await new Promise((r) => setTimeout(r, 420));
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id={id}
      ref={rootRef}
      className={`${styles.section} ${inView ? styles.in : ""}`}
      aria-label="予約"
    >
      <div className={styles.wrap}>
        <div className={styles.frame}>
          {/* LEFT = 画像 */}
          <div className={`${styles.panel} ${styles.left}`} style={{ "--d": "0ms" }}>
            <figure className={styles.visual}>
              <img className={styles.visualImg} src={photoSrc} alt={photoAlt} />
              <figcaption className={styles.visualCap}>
                <p className={styles.visualKicker}>店舗</p>
                <p className={styles.visualName}>島豚の湯霧</p>
              </figcaption>
            </figure>
          </div>

          {/* RIGHT = フォーム */}
          <div className={`${styles.panel} ${styles.right}`} style={{ "--d": "120ms" }}>
            <div className={styles.rightInner}>
              <header className={styles.head}>
                <p className={styles.kicker}>RESERVATION</p>
                <h2 className={styles.title}>席を取る。それだけ。</h2>
                <p className={styles.sub}>フォームは2分。急ぎは電話。</p>
                <p className={styles.meta}>当日枠：空き次第（埋まり次第終了）</p>
              </header>

              <form className={styles.form} onSubmit={submit}>
                <div className={styles.row3}>
                  <label className={styles.field}>
                    <span className={styles.label}>ご希望日</span>
                    <input
                      className={styles.input}
                      type="date"
                      value={form.date}
                      onChange={set("date")}
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.label}>開始時間</span>
                    <select
                      className={styles.select}
                      value={form.time}
                      onChange={set("time")}
                      required
                    >
                      <option value="" disabled>
                        --:--
                      </option>
                      {TIMES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={styles.field}>
                    <span className={styles.label}>人数</span>
                    <select
                      className={styles.select}
                      value={form.people}
                      onChange={set("people")}
                      required
                    >
                      {PEOPLE.map((p) => (
                        <option key={p} value={p}>
                          {p} 名様
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className={styles.row2}>
                  <label className={styles.field}>
                    <span className={styles.label}>お名前</span>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="例）山田 太郎"
                      value={form.name}
                      onChange={set("name")}
                      required
                      autoComplete="name"
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.label}>電話番号</span>
                    <input
                      className={styles.input}
                      type="tel"
                      placeholder="例）090-1234-5678"
                      value={form.tel}
                      onChange={set("tel")}
                      required
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </label>
                </div>

                {/* 任意：席の希望 */}
                <label className={styles.field}>
                  <span className={styles.label}>席の希望（任意）</span>
                  <select className={styles.select} value={form.seat} onChange={set("seat")}>
                    {SEATS.map((s) => (
                      <option key={s.v} value={s.v}>
                        {s.t}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>ひとこと（任意）</span>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="アレルギー・苦手な食材など"
                    value={form.note}
                    onChange={set("note")}
                  />
                </label>

                <button type="submit" className={styles.cta} disabled={status === "sending"}>
                  {status === "sending" ? (
                    "送信中…"
                  ) : (
                    <>
                      <span className={styles.ctaLabel}>この内容で送信する</span>
                      <span className={styles.ctaArrow} aria-hidden="true">
                        →
                      </span>
                    </>
                  )}
                </button>

                <p className={styles.help}>
                  {status === "done"
                    ? "送信しました。確認後、折り返して確定します。"
                    : "送信は仮受付。確認後、折り返して確定します。急ぎは電話へ。"}
                </p>

                {status === "error" && (
                  <p className={styles.error}>必須項目（日時/人数/お名前/電話）を確認してください。</p>
                )}
              </form>

              <div className={styles.call}>
                <p className={styles.callLead}>電話でも予約できます</p>
                {telHref ? (
                  <a className={styles.callNum} href={telHref}>
                    {phone}
                  </a>
                ) : (
                  <p className={styles.callNum}>{phone}</p>
                )}
                <p className={styles.hours}>{hours}</p>
              </div>

              <div className={styles.rule}>
                <p className={styles.ruleK}>お願い</p>
                <p className={styles.ruleT}>香りを守りたいので、強い香水は控えてください。</p>
              </div>
            </div>
          </div>

          {/* 中央の縦線 */}
          <span className={styles.midLine} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}