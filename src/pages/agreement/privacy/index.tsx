import styles from "./styles.module.less";
import React from "react";

const Privacy = () => {
  return (
    <div className={styles.privacy}>
      <div className={styles.contentBox}>
        <div className={styles.mainTitle}>Privacy Policy</div>
        <div className={styles.title}>1. Overview</div>
        <p className={styles.paragraph}>
          We take your personal privacy seriously. This Privacy Policy explains how information is handled when you use VidCut.
        </p>

        <div className={styles.title}>2. Data We Do Not Collect</div>
        <p className={styles.paragraph}>
          VidCut does not upload, copy, store, or transmit your video files, audio tracks, images, or project timelines to external servers. All rendering and media file operations occur entirely within your local browser or desktop application environment.
        </p>

        <div className={styles.title}>3. Local Storage</div>
        <p className={styles.paragraph}>
          Application settings, project indices, and cached files are stored on your device using browser local storage, IndexedDB, or Origin Private File System (OPFS).
        </p>

        <div className={styles.title}>4. Security</div>
        <p className={styles.paragraph}>
          Because your content stays on your computer, your data is protected by your local system security without risk of third-party cloud data breaches.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
