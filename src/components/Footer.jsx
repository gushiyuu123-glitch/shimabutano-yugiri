// src/components/Footer.jsx
import styles from "./Footer.module.css";

const LOGO = [
  { key: "shima", src: "/calli/shima.svg", cls: styles.l1 },
  { key: "buta", src: "/calli/buta.svg", cls: styles.l2 },
  { key: "no",   src: "/calli/no.svg",   cls: `${styles.l3} ${styles.lNo}` },
  { key: "yu",   src: "/calli/yu.svg",   cls: styles.l4 },
  { key: "kiri", src: "/calli/kiri.svg", cls: styles.l5 },
];

export default function Footer({
  // ✅ 架空なら「実在番号っぽいもの」は避ける
  phone = "098-000-1234",

  // ✅ 番地ピンではなく “牧志エリア検索” にする（誤認防止）
  mapUrl = "https://www.google.com/maps/search/?api=1&query=%E9%82%A3%E8%A6%87%20%E7%89%A7%E5%BF%97",

  instaUrl = "https://www.instagram.com/",

  // ✅ 番地は出さない。粒度は「那覇・牧志」まで。
  address = "沖縄県那覇市 牧志（国際通り付近）",

  hours = "17:30–22:30（最終入店 20:30） / 水曜休",
  creditUrl = "https://gushikendesign.com/",
}) {
  const digits = String(phone || "").replace(/[^\d+]/g, "");
  const telHref = digits ? `tel:${digits}` : "";

  return (
    <footer id="footer" className={styles.footer} aria-label="フッター">
      <div className={styles.inner}>
        <div className={styles.topRule} aria-hidden="true" />

        <div className={styles.row}>
          <div className={styles.brand}>
            <span className={styles.srOnly}>島豚の湯霧</span>

            <div className={styles.brandText}>
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
          </div>

          <div className={styles.meta}>
            <p className={styles.metaLine}>{address}</p>
            <p className={styles.metaLine}>{hours}</p>
          </div>

          <nav className={styles.links} aria-label="フッターリンク">
            {telHref ? (
              <a className={styles.link} href={telHref}>TEL</a>
            ) : (
              <span className={styles.link} aria-hidden="true">TEL</span>
            )}
            <span className={styles.sep} aria-hidden="true">／</span>

            <a
              className={styles.link}
              href={mapUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              MAP
            </a>
            <span className={styles.sep} aria-hidden="true">／</span>

            <a
              className={styles.link}
              href={instaUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              INSTAGRAM
            </a>
          </nav>
        </div>

        <div className={styles.bottom}>
          <span className={styles.bottomRule} aria-hidden="true" />

          <p className={styles.copy}>
            © {new Date().getFullYear()} SHIMABUTA NO YUGIRI. All rights reserved.
          </p>

          <a
            className={styles.credit}
            href={creditUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            Site by GUSHIKEN DESIGN →
          </a>

          <span className={styles.stamp} aria-hidden="true">印</span>
        </div>
      </div>
    </footer>
  );
}