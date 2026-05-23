// src/sections/Space.jsx
import { useMemo, useId } from "react";
import { RevealText, RevealMedia } from "../components/Reveal";
import styles from "./Space.module.css";

/**
 * 3つの“紙マスク”形状（ほどよく歪んだ手触り）
 * ※ path は viewBox 1000x700 前提
 */
const BLOBS = [
  // A: 上（大広間）
  "M128,184 C184,92 322,64 468,88 C616,112 744,66 848,140 C940,206 952,326 888,412 C820,504 684,560 530,578 C380,596 248,560 160,474 C80,396 56,278 128,184 Z",
  // B: 右（半個室）
  "M156,168 C250,76 392,78 514,112 C644,148 780,102 874,176 C954,238 948,344 888,430 C816,532 674,610 518,614 C362,618 232,568 154,482 C84,406 70,250 156,168 Z",
  // C: 下（カウンター）
  "M142,210 C222,108 374,92 522,118 C676,146 826,130 904,224 C980,316 946,434 862,522 C780,612 640,652 488,640 C334,628 210,568 140,476 C74,388 68,288 142,210 Z",
];

function safeId(id) {
  // useId() は ":" を含むことがある → SVGの url(#id) で環境によって壊れるのを回避
  return String(id).replace(/[^a-zA-Z0-9_-]/g, "");
}

function BlobFigure({ src, alt, blobIndex = 0, delay = 0, className = "", float = 0 }) {
  const uid = safeId(useId());
  const clipId = `clip-${blobIndex}-${uid}`;
  const d = BLOBS[blobIndex] ?? BLOBS[0];

  return (
    <RevealMedia
      as="figure"
      className={`${styles.blob} ${className}`}
      delay={delay}
      style={{ ["--floatDelay"]: `${float}s` }}
    >
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

      {/* 写真の上に“紙の膜”を薄く */}
      <span className={styles.blobVeil} aria-hidden="true" />
    </RevealMedia>
  );
}

const ROOMS = [
  {
    key: "hall",
    title: "大広間",
    copy: ["にぎわいはある。", "声が割れない距離感。"],
    img: "/images/space-01.jpeg",
    alt: "大広間の店内写真",
    blob: 0,
  },
  {
    key: "semi",
    title: "半個室",
    copy: ["視線が外れる。", "落ち着いて食べられる。"],
    img: "/images/space-02.jpeg",
    alt: "半個室の店内写真",
    blob: 1,
  },
  {
    key: "counter",
    title: "カウンター",
    copy: ["鍋が近い。", "出汁の香りがいちばん分かる。"],
    img: "/images/space-03.jpeg",
    alt: "カウンター席の店内写真",
    blob: 2,
  },
];

export default function Space() {
  const rooms = useMemo(() => ROOMS, []);

  return (
    <section id="space" className={styles.section} aria-label="空間">
      <div className={styles.wrap}>
        <div className={styles.stage}>
          {/* 右上：タイトル塊 */}
          <header className={styles.head}>
            <RevealText as="h2" className={styles.title} delay={40}>
              くうかん。
            </RevealText>

            <RevealText as="p" className={styles.lead} delay={120}>
              大広間、半個室、カウンター。<br />
              席の雰囲気で選べる。
            </RevealText>
          </header>

          {/* 3つの“部屋” */}
          <div className={styles.items}>
            {/* 大広間 */}
            <div className={`${styles.item} ${styles.iHall}`}>
              <RevealText as="div" className={styles.note} delay={220}>
                <div className={styles.noteTop}>
                  <span className={styles.dash} aria-hidden="true" />
                  <span className={styles.noteTitle}>{rooms[0].title}</span>
                </div>
                <p className={styles.noteBody}>
                  {rooms[0].copy[0]}
                  <br />
                  {rooms[0].copy[1]}
                </p>
              </RevealText>

              <BlobFigure
                src={rooms[0].img}
                alt={rooms[0].alt}
                blobIndex={rooms[0].blob}
                delay={180}
                float={0.2}
              />
            </div>

            {/* 半個室 */}
            <div className={`${styles.item} ${styles.iSemi}`}>
              <BlobFigure
                src={rooms[1].img}
                alt={rooms[1].alt}
                blobIndex={rooms[1].blob}
                delay={360}
                float={0.6}
              />

              <RevealText as="div" className={`${styles.note} ${styles.noteRight}`} delay={420}>
                <div className={styles.noteTop}>
                  <span className={styles.dash} aria-hidden="true" />
                  <span className={styles.noteTitle}>{rooms[1].title}</span>
                </div>
                <p className={styles.noteBody}>
                  {rooms[1].copy[0]}
                  <br />
                  {rooms[1].copy[1]}
                </p>
              </RevealText>
            </div>

            {/* カウンター */}
            <div className={`${styles.item} ${styles.iCounter}`}>
              <RevealText as="div" className={styles.note} delay={560}>
                <div className={styles.noteTop}>
                  <span className={styles.dash} aria-hidden="true" />
                  <span className={styles.noteTitle}>{rooms[2].title}</span>
                </div>
                <p className={styles.noteBody}>
                  {rooms[2].copy[0]}
                  <br />
                  {rooms[2].copy[1]}
                </p>
              </RevealText>

              <BlobFigure
                src={rooms[2].img}
                alt={rooms[2].alt}
                blobIndex={rooms[2].blob}
                delay={520}
                float={1.0}
              />
            </div>
          </div>

          <RevealText as="p" className={styles.foot} delay={760}>
            席の希望があれば、予約時に一言でOK。
          </RevealText>
        </div>
      </div>
    </section>
  );
}