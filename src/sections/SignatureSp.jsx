// src/sections/SignatureSp.jsx
import { RevealText } from "../components/Reveal";
import styles from "./SignatureSp.module.css";

export default function SignatureSp({ id = "signatureSp" }) {
  return (
    <section id={id} className={styles.section} aria-label="出汁と豚（SP）">
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
              タレで足さない。<br></br>湯の中で、そのまま分かる味にします。
            </RevealText>

            <RevealText as="p" className={styles.pStrong} delay={310}>
              だから違いは量じゃない。<br></br>部位の格が、そのまま旨い。
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