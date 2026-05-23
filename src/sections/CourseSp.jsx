// src/sections/Course.jsx （SP専用：中身差し替え）
import { useMemo } from "react";
import { RevealText, RevealMedia } from "../components/Reveal";
import styles from "./CourseSp.module.css";

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

export default function CourseSp({ id = "courseSp" }) {
  const items = useMemo(() => COURSES, []);

  return (
    <section id={id} className={styles.section} aria-label="コース">
      <div className={styles.wrap}>
        {/* head */}
        <header className={styles.head}>
          <RevealText as="div" className={styles.kicker} delay={0}>
            COURSE
          </RevealText>

<RevealText as="h2" className={styles.title} delay={70}>
  3つある。<br />
  迷うなら、定番。
</RevealText>

          <RevealText as="p" className={styles.lead} delay={140}>
            はじめての方は「定番」で決まる。
            <br />
            違いは量ではなく、部位です。
          </RevealText>

          {/* jump (SP用：迷いを殺す) */}
          <nav className={styles.jump} aria-label="コースへジャンプ">
            {items.map((c, i) => (
              <a
                key={c.key}
                className={`${styles.jumpA} ${c.pick ? styles.jumpPick : ""}`}
                href={`#courseSp-${c.key}`}
              >
                {c.name}
                <span className={styles.jumpSep} aria-hidden="true">
                  /
                </span>
                <span className={styles.jumpP}>{c.price}</span>
              </a>
            ))}
          </nav>
        </header>

        {/* cards */}
        <div className={styles.cards} aria-label="コース一覧">
          {items.map((c, idx) => {
            const base = 220 + idx * 140;

            return (
              <article
                key={c.key}
                id={`courseSp-${c.key}`}
                className={`${styles.card} ${c.pick ? styles.cardPick : ""}`}
                aria-label={`${c.name}コース`}
              >
                <RevealMedia as="figure" className={styles.media} delay={base}>
                  <img src={c.img} alt={c.alt} loading="lazy" decoding="async" draggable="false" />
                  <span className={styles.mediaVeil} aria-hidden="true" />
                  <span className={styles.mediaGrain} aria-hidden="true" />
                </RevealMedia>

                <div className={styles.body}>
                  <div className={styles.topRow}>
                    <RevealText as="div" className={styles.nameLine} delay={base + 70}>
                      <span className={styles.nameWrap}>
                        <img
                          className={`${styles.nameSvg} ${styles[`svg_${c.key}`]}`}
                          src={c.nameSvg}
                          alt=""
                          draggable="false"
                          decoding="async"
                        />
                        <span className={styles.srOnly}>{c.name}</span>
                      </span>

                      <span className={styles.kana}>{c.kana}</span>
                      {c.tag && <span className={styles.tag}>{c.tag}</span>}
                    </RevealText>

                    <RevealText as="div" className={styles.price} delay={base + 120}>
                      {c.price}
                    </RevealText>
                  </div>

                  <RevealText as="p" className={styles.copy} delay={base + 160}>
                    {c.copy}
                  </RevealText>

                  <RevealText as="ul" className={styles.lines} delay={base + 220}>
                    {c.lines.map((t) => (
                      <li key={t} className={styles.line}>
                        {t}
                      </li>
                    ))}
                  </RevealText>

                  <RevealText as="div" className={styles.metaRow} delay={base + 260}>
                    <span className={styles.metaK}>所要</span>
                    <span className={styles.metaV}>{c.time}</span>
                  </RevealText>
                </div>
              </article>
            );
          })}
        </div>

        {/* add-ons */}
        <section className={styles.addons} aria-label="追加メニュー">
          <div className={styles.addTop}>
            <RevealText as="div" className={styles.addKicker} delay={980}>
              ADD-ONS
            </RevealText>
            <span className={styles.addRule} aria-hidden="true" />
          </div>

          <RevealText as="p" className={styles.addLead} delay={1040}>
            追加は、必要な分だけ。
          </RevealText>

          <RevealText as="dl" className={styles.addList} delay={1100}>
            {ADDONS.map(([k, v]) => (
              <div key={k} className={styles.addRow}>
                <dt className={styles.addKey}>{k}</dt>
                <dd className={styles.addVal}>{v}</dd>
              </div>
            ))}
          </RevealText>

          <RevealText as="p" className={styles.note} delay={1180}>
            ※ 仕入れにより部位・野菜は当日少し入れ替わります（品質は同等以上）。
            <br />
            アレルギーは予約時に一言でOK。
          </RevealText>
        </section>
      </div>
    </section>
  );
}