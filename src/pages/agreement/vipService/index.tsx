import styles from "./styles.module.less";
import React from "react";

const VipService = () => {
  return (
    <div className={styles.vipService}>
      <div className={styles.contentBox}>
        <div className={styles.mainTitle}>VIP Service Agreement</div>
        <div className={styles.title}>1. Service Scope</div>
        <p className={styles.paragraph}>
          The VIP Service grants users access to optional premium features, higher resolution exports, and expanded tool presets.
        </p>

        <div className={styles.title}>2. Subscription & Validity</div>
        <p className={styles.paragraph}>
          VIP privileges are valid for the purchased subscription duration. Unused privileges during the subscription period will continue according to your selected plan terms.
        </p>

        <div className={styles.title}>3. Refund Policy</div>
        <p className={styles.paragraph}>
          Due to the digital nature of software subscriptions, requests for refunds are evaluated in accordance with consumer protection regulations and service usage history.
        </p>
      </div>
    </div>
  );
};

export default VipService;
