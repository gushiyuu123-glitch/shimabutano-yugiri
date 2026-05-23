// src/sections/SpaceSp.jsx
import { useMemo, useId } from "react";
import { RevealText, RevealMedia } from "../components/Reveal";
import styles from "./SpaceSp.module.css";

/**
 * 3つの“紙マスク”形状（ほどよく歪んだ手触り）
 * ※ path は viewBox 1000x700 前提
 */
const BLOBS = [
  "M128,184 C184,92 322,64 468,88 C616,112 744,66 848,140 C940,206 952,326 888,412 C820,504 684,560 530,578 C380,596 248,560 160,474 C80,396 56,278 128,184 Z",
  "M156,168 C250,76 392,78 514,112 C644,148 780,102 874,176 C954,238 948,344 888,430 C816,532 674,610 518,614 C362,618 232,568 154,482 C84,406 70,250 156,168 Z",
  "M142,210 C222,108 374,92 522,118 C676,146 826,130 904,224 C980,316 946,434 862,522 C780,612 640,652 488,640 C334,628 210,568 140,476 C74,388 68,288 142,210 Z",
];

function safeId(id) {
  return String(id).replace(/[^a-zA-Z0-9_-]/g, "");
}

function BlobFigure({ src, alt, blobIndex = 0, delay = 0 }) {
  const uid = safeId(useId());
  const clipId = `clip-${blobIndex}-${uid}`;
  const d = BLOBS[blobIndex] ?? BLOBS[0];

  return (
    <RevealMedia as="figure" className={styles.blob} delay={delay}>
      <svg viewBox="0 0 1000 700" className={styles.blobSvg} role="img" aria-label={alt}>
        <title>{alt}</title>
        <defs>
          <clipPath id={clipId}>
            <path d={d} />
          </clipPath>
        </defs>

        <image
          href={src}
          x="0"
          y="0"
          width="1000"
          height="700"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
        />
      </svg>

      <span className={styles.blobVeil} aria-hidden="true" />
      <span className={styles.blobGrain} aria-hidden="true" />
    </RevealMedia>
  );
}

const ROOMS = [
  {
    key: "hall",
    title: "大広間",
    copy: ["にぎわいはある。", "声が割れない距離感。"],
    note: "席数が多い。はじめてはここでOK。",
    img: "/images/space-01.jpeg",
    alt: "大広間の店内写真",
    blob: 0,
  },
  {
    key: "semi",
    title: "半個室",
    copy: ["視線が外れる。", "落ち着いて食べられる。"],
    note: "会話の温度を保ちたい日に。",
    img: "/images/space-02.jpeg",
    alt: "半個室の店内写真",
    blob: 1,
  },
  {
    key: "counter",
    title: "カウンター",
    copy: ["鍋が近い。", "出汁の香りがいちばん分かる。"],
    note: "一人でも、静かに食べられる。",
    img: "/images/space-03.jpeg",
    alt: "カウンター席の店内写真",
    blob: 2,
  },
];

export default function SpaceSp({ id = "spaceSp" }) {
  const rooms = useMemo(() => ROOMS, []);

  return (
    <section id={id} className={styles.section} aria-label="空間（SP）">
      <div className={styles.wrap}>
        <header className={styles.head}>
          <RevealText as="h2" className={styles.title} delay={40}>
            くうかん。
          </RevealText>

          <RevealText as="p" className={styles.lead} delay={120}>
            大広間、半個室、カウンター。<br />
            席の雰囲気で選べる。
          </RevealText>
        </header>

        <div className={styles.list} role="list" aria-label="席の種類">
          {rooms.map((r, i) => {
            const base = 180 + i * 160;
            return (
              <article key={r.key} className={styles.item} role="listitem">
                <BlobFigure src={r.img} alt={r.alt} blobIndex={r.blob} delay={base} />

                <div className={styles.note}>
                  <RevealText as="div" className={styles.noteTop} delay={base + 90}>
                    <span className={styles.dash} aria-hidden="true" />
                    <span className={styles.noteTitle}>{r.title}</span>
                  </RevealText>

                  <RevealText as="p" className={styles.noteBody} delay={base + 140}>
                    {r.copy[0]}
                    <br />
                    {r.copy[1]}
                  </RevealText>

                  <RevealText as="p" className={styles.noteSub} delay={base + 210}>
                    {r.note}
                  </RevealText>
                </div>
              </article>
            );
          })}
        </div>

        <RevealText as="p" className={styles.foot} delay={760}>
          席の希望があれば、予約時に一言でOK。
        </RevealText>
      </div>
    </section>
  );
}