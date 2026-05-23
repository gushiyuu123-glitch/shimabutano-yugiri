// src/components/FooterSp.jsx
import styles from "./FooterSp.module.css";

const LOGO = [
  { key: "shima", src: "/calli/shima.svg", cls: styles.l1 },
  { key: "buta", src: "/calli/buta.svg", cls: styles.l2 },
  { key: "no",   src: "/calli/no.svg",   cls: `${styles.l3} ${styles.lNo}` },
  { key: "yu",   src: "/calli/yu.svg",   cls: styles.l4 },
  { key: "kiri", src: "/calli/kiri.svg", cls: styles.l5 },
];

function isDemoPhone(phone) {
  const raw = String(phone || "");
  if (!raw) return true;
  if (raw.includes("デモ")) return true;

  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return true;

  if (/^0+$/.test(digits)) return true;
  return false;
}

export default function FooterSp({
  id = "footerSp",

  phone = "（デモ）000-0000-0000",
  mapUrl = "https://www.google.com/maps/search/?api=1&query=%E9%82%A3%E8%A6%87%20%E7%89%A7%E5%BF%97",
  instaUrl = "https://www.instagram.com/",

  address = "沖縄県那覇市 牧志（国際通り付近）",
  hours = "17:30–22:30（最終入店 20:30） / 水曜休",

  creditUrl = "https://gushikendesign.com/",

  // ✅ フッターは常に最小のデモ注記（ReserveSpとここだけ）
  demoNote = "※ このサイトは架空のデモです。実際の店舗・予約とはつながっていません。",
}) {
  const demo = isDemoPhone(phone);
  const digits = String(phone || "").replace(/[^\d+]/g, "");
  const telHref = !demo && digits ? `tel:${digits}` : "";

  return (
    <footer id={id} className={styles.footer} aria-label="フッター（SP）">
      <div className={styles.inner}>
        <span className={styles.topRule} aria-hidden="true" />

        <div className={styles.stack}>
          {/* Brand */}
          <div className={styles.brand} aria-label="屋号">
            <span className={styles.srOnly}>島豚の湯霧</span>

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

            <p className={styles.brandEn}>SHIMABUTA NO YUGIRI</p>
          </div>

          {/* Links（線は作らず、下線の気配だけ） */}
          <nav className={styles.links} aria-label="フッターリンク">
            {telHref ? (
              <a className={styles.link} href={telHref}>TEL</a>
            ) : (
              <span className={styles.link} aria-hidden="true">TEL</span>
            )}

            <span className={styles.sep} aria-hidden="true">／</span>

            <a className={styles.link} href={mapUrl} target="_blank" rel="noreferrer noopener">
              MAP
            </a>

            <span className={styles.sep} aria-hidden="true">／</span>

            <a className={styles.link} href={instaUrl} target="_blank" rel="noreferrer noopener">
              INSTA
            </a>
          </nav>

          {/* Meta（線で区切らず、呼吸で区切る） */}
          <div className={styles.meta} aria-label="所在地と営業時間">
            <p className={styles.metaLine}>{address}</p>
            <p className={styles.metaLine}>{hours}</p>
          </div>

          {/* Bottom */}
          <div className={styles.bottom} aria-label="クレジット">
            <span className={styles.bottomRule} aria-hidden="true" />

            <div className={styles.bottomRow}>
              <p className={styles.copy}>
                © {new Date().getFullYear()} SHIMABUTA NO YUGIRI. All rights reserved.
              </p>

              <a className={styles.credit} href={creditUrl} target="_blank" rel="noreferrer noopener">
                Site by GUSHIKEN DESIGN
              </a>

              <span className={styles.stamp} aria-hidden="true">印</span>
            </div>

            <p className={styles.demoNote}>{demoNote}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}