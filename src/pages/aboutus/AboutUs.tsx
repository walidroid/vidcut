import styles from './styles.module.less';
import { observer } from 'mobx-react';
import SubHeader from '@components/header/Header';
import Footer from '@components/footer/Footer';
import { language } from '@language/index';

export interface IProps {
  ssrRes?: any;
  location: { pathname: string; search: string; hash: string; state: any };
  history: History;
  match: { path: string; url: string; isExact: boolean; params: any };
  staticContext: { path: string; url: string; isExact: boolean; params: any };
  route: { path: string; ssr: boolean; exact: boolean; component: JSX.Element };
}

function AboutUs(props: IProps) {
  const lang = language.getLanguage();

  return (
    <div className={styles.about}>
      <SubHeader />
      <div className={styles.bg}></div>
      {lang === 'fr-FR' ? (
        <div className={styles.content}>
          <p>
            <strong>VidCut</strong> est un éditeur vidéo web open-source moderne, performant et respectueux de la vie privée.
            <br />
            Conçu pour permettre un montage vidéo complet directement dans le navigateur sans installation, sans dépendance à l'IA et sans compromis sur la rapidité.
          </p>
        </div>
      ) : lang === 'ar-SA' ? (
        <div className={styles.content} dir="rtl">
          <p>
            <strong>VidCut</strong> هو محرر فيديو احترافي، خفيف ومفتوح المصدر يعمل بالكامل داخل متصفح الويب.
            <br />
            صُمم لتمكين المستخدمين من إنجاز عمليات المونتاج المتكاملة مباشرة وبكل سرعة وأمان، دون الحاجة إلى تثبيت أي برامج وبدون أي وظائف ذكاء اصطناعي غير ضرورية.
          </p>
        </div>
      ) : (
        <div className={styles.content}>
          <p>
            <strong>VidCut</strong> is a modern, lightweight, open-source video editor built directly for the web browser.
            <br />
            Designed to bring desktop-grade multi-track video editing to creators without installation, without AI bloat, and with full privacy.
          </p>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default observer(AboutUs);
