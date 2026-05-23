// src/sections/Course.jsx
import { useMemo } from "react";
import { RevealText, RevealMedia } from "../components/Reveal";
import styles from "./Course.module.css";

const COURSES = [
  {
    key: "kaze",
    name: "風",
    kana: "かぜ",
    copy: "軽く始める。ロース中心。",
    lines: ["島豚：ロース中心", "島野菜：季節の盛り", "甘味：黒糖のひと口"],
    time: "目安 90分",
    price: "¥4,200",
    img: "/images/1.jpeg",
    alt: "鍋と具材のコース写真",
    nameSvg: "/calli/course-kaze.svg",
  },
  {
    key: "teiban",
    name: "定番",
    kana: "ていばん",
    copy: "迷ったら、これが正解。",
    lines: ["島豚：2部位（ロース＋肩ロース）", "島野菜：薬味を一段", "甘味：黒糖＋柑橘"],
    time: "目安 90分",
    price: "¥5,800",
    img: "/images/2.jpeg",
    alt: "豚肉のコース写真",
    pick: true,
    tag: "迷うならこれ",
    nameSvg: "/calli/course-teiban1.svg",
  },
  {
    key: "yugiri",
    name: "湯霧",
    kana: "ゆぎり",
    copy: "特別な日に。希少部位まで。",
    lines: ["島豚：希少部位を含む3部位", "島野菜：きのこ強化", "甘味：黒糖＋季節果実"],
    time: "目安 100分",
    price: "¥7,800",
    img: "/images/3.jpeg",
    alt: "コースの締めと甘味の写真",
    nameSvg: "/calli/course-yugiri.svg",
  },
];

const ADDONS = [
  ["追加肉", "ロース / 肩ロース / 希少部位（当日）"],
  ["野菜", "島野菜盛り"],
  ["〆", "雑炊 / 沖縄そば（細麺）"],
  ["甘味", "黒糖＋季節"],
];

export default function Course() {
  const items = useMemo(() => COURSES, []);

  return (
    <section id="course" className={styles.section} aria-label="コース">
      <div className={styles.wrap}>
        {/* head */}
        <header className={styles.head}>
          <RevealText as="div" className={styles.kicker} delay={0}>
            COURSE
          </RevealText>

          <RevealText as="h2" className={styles.title} delay={80}>
            3つある。迷うなら、定番。
          </RevealText>

          <RevealText as="p" className={styles.lead} delay={150}>
            はじめての方は「定番」で決まる。
            <br />
            違いは量ではなく、部位です。
          </RevealText>
        </header>

        <div className={styles.grid}>
          {/* left: photos */}
          <div className={styles.photos} aria-label="コース写真">
            {items.map((c, idx) => {
              const d = 160 + idx * 120;
              const sizeCls = idx === 0 ? styles.p1 : idx === 1 ? styles.p2 : styles.p3;

              return (
                <RevealMedia
                  key={c.key}
                  as="figure"
                  className={`${styles.photo} ${sizeCls}`}
                  delay={d}
                >
                  <img src={c.img} alt={c.alt} loading="lazy" decoding="async" draggable="false" />
                  <span className={styles.photoVeil} aria-hidden="true" />
                </RevealMedia>
              );
            })}
          </div>

          {/* right: menu ticket */}
          <aside className={styles.ticket} aria-label="コースメニュー票">
            <div className={styles.ticketInner}>
              <div className={styles.ticketTop}>
                <RevealText as="div" className={styles.ticketKicker} delay={220}>
                  MENU
                </RevealText>
                <div className={styles.ticketRule} aria-hidden="true" />
              </div>

              <div className={styles.ticketList} role="list">
                {items.map((c, idx) => {
                  const d0 = 280 + idx * 140;

                  return (
                    <div
                      key={c.key}
                      role="listitem"
                      className={`${styles.tRow} ${c.pick ? styles.tPick : ""}`}
                    >
                      <div className={styles.tLeft}>
                        <RevealText as="div" className={styles.tNameLine} delay={d0}>
                          <span className={styles.tNameWrap}>
                            <img
                              className={`${styles.tNameSvg} ${styles[`svg_${c.key}`]}`}
                              src={c.nameSvg}
                              alt=""
                              draggable="false"
                              decoding="async"
                            />
                            <span className={styles.srOnly}>{c.name}</span>
                          </span>

                          <span className={styles.tKana}>{c.kana}</span>
                          {c.tag && <span className={styles.tTag}>{c.tag}</span>}
                        </RevealText>

                        <RevealText as="p" className={styles.tCopy} delay={d0 + 70}>
                          {c.copy}
                        </RevealText>

                        <RevealText as="ul" className={styles.tLines} delay={d0 + 120}>
                          {c.lines.map((t) => (
                            <li key={t} className={styles.tLine}>
                              {t}
                            </li>
                          ))}
                        </RevealText>

                        <RevealText as="div" className={styles.tTime} delay={d0 + 170}>
                          {c.time}
                        </RevealText>
                      </div>

                      <RevealText as="div" className={styles.tPrice} delay={d0 + 90}>
                        {c.price}
                      </RevealText>
                    </div>
                  );
                })}
              </div>

              {/* ✅ 追加（ここに挿入） */}
              <div className={styles.addons} aria-label="追加メニュー">
                <div className={styles.addonsTop}>
                  <RevealText as="div" className={styles.addonsKicker} delay={720}>
                    ADD-ONS
                  </RevealText>
                  <div className={styles.addonsRule} aria-hidden="true" />
                </div>

                <RevealText as="p" className={styles.addonsLead} delay={780}>
                  追加は、必要な分だけ。
                </RevealText>

                <RevealText as="dl" className={styles.addonsList} delay={840}>
                  {ADDONS.map(([k, v]) => (
                    <div key={k} className={styles.addonsRow}>
                      <dt className={styles.addonsKey}>{k}</dt>
                      <dd className={styles.addonsVal}>{v}</dd>
                    </div>
                  ))}
                </RevealText>

                <RevealText as="p" className={styles.addonsNote} delay={920}>
                  ※ 価格は当日メニューに記載（仕入れで少し変わります）。
                </RevealText>
              </div>

              <RevealText as="p" className={styles.note} delay={1020}>
                ※ 仕入れにより、部位・野菜は当日少し入れ替わります（品質は同等以上）。アレルギーは予約時に一言でOK。
              </RevealText>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}