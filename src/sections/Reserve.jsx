// src/sections/Reserve.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Reserve.module.css";

export default function Reserve({
  id = "reserve",
  photoSrc = "/images/store1.jpeg",
  photoAlt = "店内の写真（イメージ）",

  // ✅ 架空のデフォルト（実在っぽい番号は避ける）
  phone = "098-000-1234",

  // ✅ ここで「デモ」を明示（世界観を壊さない最小）
  notice = "※架空サイトのデモです。送信内容は保存されません。",

  // ✅ 当日枠の文法（前に決めた運用ルールに近い）
  sameDay = "当日枠：空き次第（埋まり次第終了）",

  // ✅ 電話受付の“雰囲気”だけ残す（実運用では差し替える）
  hours = "受付目安：11:00–22:00",

  // 実運用にしたい時だけ渡す（デフォはデモ）
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

  // ✅ 営業時間に合わせて現実的な開始枠に寄せる（昼/夜）
  const TIMES = useMemo(() => ["11:30", "17:30", "19:30", "20:30"], []);
  const PEOPLE = useMemo(() => ["1", "2", "3", "4", "5", "6"], []);
  const SEATS = useMemo(
    () => [
      { v: "おまかせ", t: "おまかせ" },
      { v: "テーブル", t: "テーブル" },
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
  const [preview, setPreview] = useState(null); // デモ表示用

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    if (!form.date || !form.time || !form.people || !form.name || !form.tel) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      // ✅ 実運用：外から渡されたonSubmitがある時だけ呼ぶ
      if (onSubmit) {
        await onSubmit(form);
        setPreview(null);
        setStatus("done");
        return;
      }

      // ✅ デモ：送信した内容を画面に出して終わる（保存しない）
      await new Promise((r) => setTimeout(r, 360));
      setPreview({
        date: form.date,
        time: form.time,
        people: form.people,
        seat: form.seat,
        name: form.name,
        tel: form.tel,
        note: form.note,
      });
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
                <p className={styles.visualKicker}>店内</p>
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
                <p className={styles.meta}>{sameDay}</p>
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
                      <option value="" disabled>--:--</option>
                      {TIMES.map((t) => (
                        <option key={t} value={t}>{t}</option>
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
                        <option key={p} value={p}>{p} 名様</option>
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

                <label className={styles.field}>
                  <span className={styles.label}>席の希望（任意）</span>
                  <select className={styles.select} value={form.seat} onChange={set("seat")}>
                    {SEATS.map((s) => (
                      <option key={s.v} value={s.v}>{s.t}</option>
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
                      <span className={styles.ctaArrow} aria-hidden="true">→</span>
                    </>
                  )}
                </button>

                <p className={styles.help}>
                  {status === "done"
                    ? "送信内容を表示しました（デモ）。"
                    : "送信はデモ表示です。実際の予約にはつながりません。"}
                </p>

                {status === "error" && (
                  <p className={styles.error}>必須項目（日時/人数/お名前/電話）を確認してください。</p>
                )}

                {/* ✅ デモ時だけ：送信内容のプレビュー（世界観を壊さない薄さ） */}
                {preview && (
                  <div className={styles.preview} aria-label="送信内容（デモ表示）">
                    <p className={styles.previewK}>送信内容（デモ）</p>
                    <p className={styles.previewT}>
                      {preview.date} / {preview.time} / {preview.people}名 / {preview.seat}
                      <br />
                      {preview.name}（{preview.tel}）
                      {preview.note ? <><br />{preview.note}</> : null}
                    </p>
                  </div>
                )}
              </form>

              {/* ✅ 電話ブロックは“リンクなし”で残す（架空誤認を防ぐ） */}
              <div className={styles.call} aria-label="電話でのご案内（参考）">
                <p className={styles.callLead}>電話でも予約できます（参考）</p>
                <p className={styles.callNum}>{phone}</p>
                <p className={styles.hours}>{hours}</p>
                <p className={styles.notice}>{notice}</p>
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