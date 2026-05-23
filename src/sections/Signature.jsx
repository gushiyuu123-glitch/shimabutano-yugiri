// src/sections/Signature.jsx
import { RevealText } from "../components/Reveal";
import styles from "./Signature.module.css";

export default function Signature() {
  return (
    <section id="signature" className={styles.section} aria-label="出汁と豚">
      <div className={styles.wrap}>
        <div className={styles.stack}>
          <RevealText as="div" className={styles.kicker} delay={0}>
            SIGNATURE
          </RevealText>

          <RevealText as="h2" className={styles.h2} delay={80}>
            出汁で、豚が決まる。
          </RevealText>

          <div className={styles.body}>
            <RevealText as="p" className={styles.p} delay={170}>
              出汁は一種。島豚の脂に合わせて引きます。
            </RevealText>

            <RevealText as="p" className={styles.p} delay={240}>
              タレで足さない。湯の中で、そのまま分かる味にします。
            </RevealText>

            <RevealText as="p" className={styles.pStrong} delay={310}>
              だから違いは量じゃない。部位の格が、そのまま旨い。
            </RevealText>
          </div>

          <RevealText as="div" className={styles.closer} delay={420}>
            最後は、出汁で締める。
          </RevealText>
        </div>
      </div>
    </section>
  );
}