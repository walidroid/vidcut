import styles from "./styles.module.less";
import React from "react";

const Agree = () => {
  return (
    <div className={styles.agree}>
      <div className={styles.contentBox}>
        <div className={styles.mainTitle}>User Agreement</div>
        <div className={styles.title}>1. Acceptance of Terms</div>
        <p className={styles.paragraph}>
          By accessing or using UniCut, you agree to be bound by this Agreement. If you do not agree to all terms and conditions, you must not access or use the application.
        </p>

        <div className={styles.title}>2. User Rights & Responsibilities</div>
        <p className={styles.paragraph}>
          You retain all rights to any video, audio, image, and text content you create, edit, or process using UniCut. You are responsible for ensuring that your content complies with applicable copyright and intellectual property laws.
        </p>

        <div className={styles.title}>3. Local Storage & Privacy</div>
        <p className={styles.paragraph}>
          UniCut operates as a client-side video editing environment. Your source materials and edited project data remain stored exclusively on your local device.
        </p>

        <div className={styles.title}>4. Disclaimer of Warranties</div>
        <p className={styles.paragraph}>
          UniCut is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied.
        </p>
      </div>
    </div>
  );
};

export default Agree;
