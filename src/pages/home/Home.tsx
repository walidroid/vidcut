import { useEffect, useState } from 'react';
import styles from './home.module.less';
import { useHistory } from 'react-router';
import Header from '@components/header';
import Footer from '@components/footer';
import { Button } from '@douyinfe/semi-ui';
import { user } from '@stores/user';
import { pubsub } from '@utils/pubsub';
import VipRecharge from '@pages/editor/components/header/VipRecharge';

const aiFeatures = [
  {
    emoji: '/assets/images/ico1.png',
    title: 'Smart Material Recognition',
    desc: 'Automatically identify scenes, faces, and audio characteristics in uploaded assets with smart tagging.',
  },
  { emoji: '/assets/images/ico2.png', title: 'Intelligent Auto-Cut', desc: 'Generate highlight clips and rough cuts from raw footage with a single click.' },
  { emoji: '/assets/images/ico3.png', title: 'Auto Subtitles & Transcripts', desc: 'Multi-lingual audio transcription mapped precisely to timeline subtitles.' },
  { emoji: '/assets/images/ico4.png', title: 'Text-to-Speech Voiceover', desc: 'Convert text into natural, fluent speech with versatile voice profiles.' },
  { emoji: '/assets/images/ico5.png', title: 'AI Visual Generation', desc: 'Create high-resolution graphics and background elements directly inside your project.' },
  { emoji: '/assets/images/ico6.png', title: 'Creative Video Synthesis', desc: 'Turn ideas, scripts, and prompts into expressive video sequences effortlessly.' },
  { emoji: '/assets/images/ico7.png', title: 'Portrait & Subject Cutout', desc: 'Isolate subjects from backgrounds with precision edge detection and mask control.' },
  { emoji: '/assets/images/ico8.png', title: 'Continuous Feature Updates', desc: 'Continuously expanding with cutting-edge production and editing tools.' },
];

const allFeatures = [
  'Stylized Text',
  'Fonts',
  'Captions',
  'Video Tracks',
  'Images',
  'Audio',
  'Camera Motion',
  'Effects',
  'Stickers',
  'Transitions',
  'Filters',
  'Green Screen',
  'Masking',
  'Animation',
  'TTS',
  'Audio Mixer',
  'Voiceover',
  'Keyframes',
  'Chroma Key',
  'Portrait Cutout',
  'Pen Tool',
  'AI Video',
  'AI Image',
  'QR Generator',
  '4K Rendering',
  'Multi-Track',
  'Offline Storage',
];

const coreFeatures = [
  {
    label: 'Template',
    title: 'Smart Templates',
    desc: 'Instant video templates with quick-swap asset slots for rapid, professional turnaround.',
    emoji: '📋',
  },
  {
    label: 'Editor',
    title: 'Multi-Track Timeline',
    desc: 'Frame-accurate multi-track editing with non-destructive splitting, trimming, and snapping.',
    emoji: '⏱️',
  },
  {
    label: 'Camera',
    title: 'Dynamic Camera',
    desc: 'Complete camera motion control: pan, zoom, pedestal, and shake to bring scenes alive.',
    emoji: '📹',
  },
  {
    label: 'Animation',
    title: 'Keyframe Animation',
    desc: 'Fine-grained keyframe animation for scale, position, rotation, and opacity across all elements.',
    emoji: '🔑',
  },
  {
    label: 'Security',
    title: '100% Local & Private',
    desc: 'All project data and media files are stored locally on your device and never uploaded to servers.',
    emoji: '🛡️',
  },
  {
    label: 'Value',
    title: 'High Performance',
    desc: 'Hardware-accelerated WebGL engine supporting smooth real-time playback and fast 4K export.',
    emoji: '⚡',
  },
];

const faqList = [
  {
    q: 'Is UniCut free to use?',
    a: 'Yes! UniCut provides a comprehensive video editing suite, full multi-track timeline, transitions, filters, audio editing, and export completely free.',
  },
  {
    q: 'Does UniCut require installing software?',
    a: 'UniCut is available both as a standalone desktop app (Windows) and as a modern web application that runs directly in your browser without plugins.',
  },
  {
    q: 'Which browsers are recommended?',
    a: 'We recommend Google Chrome, Microsoft Edge, or any modern Chromium-based browser for optimal WebGL and File System performance.',
  },
  {
    q: 'Which media formats are supported?',
    a: 'UniCut supports all major video formats (MP4, MOV, WebM, MKV), audio formats (MP3, WAV, AAC), and image formats (JPG, PNG, WebP, SVG, APNG, GIF).',
  },
  {
    q: 'What resolution and formats can I export?',
    a: 'You can export in standard MP4 (H.264 / AAC) at 720p, 1080p, 2K, and up to 4K Ultra HD at smooth 30 or 60 frames per second.',
  },
  {
    q: 'Can I use videos made with UniCut commercially?',
    a: 'Yes! Any content you produce, edit, and export with UniCut belongs entirely to you and can be used for commercial projects without royalties.',
  },
];

const freeFeatures = [
  { text: 'Stylized Text / Captions / Stickers / Transitions', enabled: true },
  { text: 'Full Video / Image / Audio Multi-Track Editing', enabled: true },
  { text: 'Effects / LUT Filters / Keyframe Animation', enabled: true },
  { text: 'Green Screen / Masking / Chroma Keying', enabled: true },
  { text: 'Complete Offline Asset Library', enabled: true },
  { text: 'Precision Timeline Trimming & Snapping', enabled: true },
  { text: 'Dynamic Camera Pan & Zoom', enabled: true },
  { text: 'Audio Mixing & Speed Curves', enabled: true },
  { text: 'High-Definition Export (Up to 4K)', enabled: true },
  { text: 'Private Local Storage (OPFS / Disk)', enabled: true },
  { text: 'AI Portrait Cutout', enabled: false },
  { text: 'AI Automatic Subtitles', enabled: false },
  { text: 'AI Text-to-Speech Voiceover', enabled: false },
  { text: 'Cloud Rendering Cluster', enabled: false },
];

const vipFeatures = [
  { text: 'Stylized Text / Captions / Stickers / Transitions', enabled: true },
  { text: 'Full Video / Image / Audio Multi-Track Editing', enabled: true },
  { text: 'Effects / LUT Filters / Keyframe Animation', enabled: true },
  { text: 'Green Screen / Masking / Chroma Keying', enabled: true },
  { text: 'Complete Offline Asset Library', enabled: true, bold: true },
  { text: 'Precision Timeline Trimming & Snapping', enabled: true },
  { text: 'Dynamic Camera Pan & Zoom', enabled: true },
  { text: 'Audio Mixing & Speed Curves', enabled: true },
  { text: 'High-Definition Export (Up to 4K)', enabled: true },
  { text: 'Private Local Storage (OPFS / Disk)', enabled: true },
  { text: 'AI Portrait Cutout', enabled: true },
  { text: 'AI Automatic Subtitles', enabled: true },
  { text: 'AI Text-to-Speech Voiceover', enabled: true },
  { text: 'Cloud Rendering Cluster', enabled: true },
];

export default function Home() {
  const history = useHistory();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [pricingPeriod, setPricingPeriod] = useState<'month' | 'year'>('month');
  const [vipRechargeVisible, setVipRechargeVisible] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handlePricingClick = (action: 'free' | 'vip') => {
    if (!user.info) {
      pubsub.publish('showLoginModal');
      return;
    }
    if (action === 'free') {
      history.push('/workspace/draft');
    } else {
      setVipRechargeVisible(true);
    }
  };

  return (
    <div className={styles.home}>
      <Header componentName="Home" />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Professional Offline Video Creation Suite
          </div>
          <h1 className={styles.heroTitle}>
            UniCut Video Studio
            <br />
            <span className={styles.heroHighlight}>Fast & Private</span> Video Editor
          </h1>
          <p className={styles.heroSubtitle}>
            Full-featured multi-track timeline editing with zero cloud dependency. Run natively in your browser or desktop with complete data privacy.
          </p>
          <div className={styles.heroActions}>
            <Button
              theme="solid"
              size="large"
              className={styles.heroBtn}
              onClick={() => history.push('/workspace/draft')}
            >
              Start Creating →
            </Button>
            <Button
              theme="borderless"
              size="large"
              className={styles.heroBtnOutline}
              onClick={() => history.push('/workspace/draft')}
            >
              Open Workspace
            </Button>
          </div>

          {/* Product Showcase */}
          <div className={styles.heroShowcase}>
            <div className={styles.showcaseMain}>
              <div className={styles.productUI}>
                <div className={styles.sideBar}>
                  <div className={styles.iconBlock} />
                  <div className={styles.iconBlock} />
                  <div className={styles.iconBlock} />
                  <div className={styles.iconBlock} />
                  <div className={styles.iconBlock} />
                </div>
                <div className={styles.previewArea}>
                  <div className={styles.previewMain}>Video Preview Canvas</div>
                  <div className={styles.timelineBar}>
                    <div className={styles.clip} style={{ width: 100 }} />
                    <div className={styles.clip} style={{ width: 60, opacity: 0.5 }} />
                    <div className={styles.clip} style={{ width: 160, opacity: 0.7 }} />
                    <div className={styles.clip} style={{ width: 40, opacity: 0.3 }} />
                    <div className={styles.clip} style={{ width: 120, opacity: 0.6 }} />
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.floatCard} ${styles.fc1}`}>
              <div className={styles.fcLabel}>Engine</div>
              <div className={`${styles.fcValue} ${styles.fcValuePurple}`}>WebGL 2</div>
            </div>
            <div className={`${styles.floatCard} ${styles.fc2}`}>
              <div className={styles.fcLabel}>Track Elements</div>
              <div className={`${styles.fcValue} ${styles.fcValueGold}`}>12+</div>
              <div className={styles.fcBar}>
                <div className={styles.fcBarFill} style={{ width: '85%' }} />
              </div>
            </div>
            <div className={`${styles.floatCard} ${styles.fc3}`}>
              <div className={styles.fcLabel}>Max Resolution</div>
              <div className={`${styles.fcValue} ${styles.fcValuePurple}`}>4K UHD</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className={styles.trustBar}>
        <p>Built for modern creative workflows and privacy-conscious teams</p>
      </section>

      {/* AI Features */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.overline}>Platform Features</div>
            <h2 className={styles.sectionTitle}>Creative Capabilities</h2>
            <p className={styles.sectionDesc}>Comprehensive tools designed for seamless, high-speed video production</p>
          </div>
          <div className={styles.featuresGrid}>
            {aiFeatures.slice(0, 7).map((item, i) => (
              <div className={styles.featureCard} key={i}>
                <div className={styles.cardPreview}>
                  <img style={{ height: 60 }} src={item.emoji} alt={item.title} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
            <div className={`${styles.featureCard} ${styles.featureCardSpan2}`}>
              <div className={`${styles.cardPreview} ${styles.cardPreviewSmall}`}>
                <img style={{ height: 60 }} src={aiFeatures[7].emoji} alt={aiFeatures[7].title} />
              </div>
              <h3>{aiFeatures[7].title}</h3>
              <p>{aiFeatures[7].desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className={`${styles.section} ${styles.capabilitiesSection}`}>
        <div className={styles.container}>
          <div className={styles.overline}>Capabilities</div>
          <h2>Everything You Need in One Place</h2>
          <p className={styles.capabilitiesSubtitle}>Rich layer support, precise timeline controls, and full parameter customization</p>
          <div className={styles.tagsWrap}>
            {allFeatures.map((f, i) => {
              const rotate = (Math.random() * 6 - 3).toFixed(1);
              const paddingX = Math.floor(Math.random() * 8 + 14);
              const bgOpacity = (Math.random() * 0.09 + 0.03).toFixed(2);
              const colorIndex = Math.floor(Math.random() * 3);
              const colors = ['#c4b5fd', '#a78bfa', '#8b5cf6'];
              return (
                <span
                  className={styles.tag}
                  key={i}
                  style={{
                    transform: `rotate(${rotate}deg)`,
                    paddingLeft: `${paddingX}px`,
                    paddingRight: `${paddingX}px`,
                    backgroundColor: `rgba(139, 92, 246, ${bgOpacity})`,
                    color: colors[colorIndex],
                  }}
                >
                  <span className={styles.tagDot} />
                  {f}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.coreGrid}>
            {coreFeatures.map((item, i) => (
              <div className={styles.coreCard} key={i}>
                <div className={styles.coreEmoji}>{item.emoji}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={`${styles.section} ${styles.pricingSection}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.overline}>Plans & Editions</div>
            <h2 className={styles.sectionTitle}>Transparent Pricing</h2>
            <p className={styles.sectionDesc}>Choose the ideal plan for your creative needs</p>
          </div>

          <div className={styles.pricingToggle}>
            <span
              className={pricingPeriod === 'month' ? styles.activeToggle : ''}
              onClick={() => setPricingPeriod('month')}
            >
              Monthly
            </span>
            <span
              className={pricingPeriod === 'year' ? styles.activeToggle : ''}
              onClick={() => setPricingPeriod('year')}
            >
              Annual
            </span>
          </div>

          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div className={styles.planName}>Standard Edition</div>
              <div className={styles.planPrice}>
                $0<span className={styles.planUnit}>/forever</span>
              </div>
              <div className={styles.planDesc}>Full offline editing toolkit for everyday production</div>
              <ul className={styles.planFeatures}>
                {freeFeatures.map((f, j) => (
                  <li key={j} className={!f.enabled ? styles.planFeatureDisabled : ''}>
                    {f.enabled ? (
                      <span className={styles.planCheck}>✓</span>
                    ) : (
                      <span className={styles.planCross}>✕</span>
                    )}
                    {f.text}
                  </li>
                ))}
              </ul>
              <Button theme="borderless" className={styles.pricingBtn} onClick={() => handlePricingClick('free')}>
                Start Free
              </Button>
            </div>
            <div className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
              <div className={styles.planName}>Pro Edition</div>
              <div className={styles.planPrice}>
                {pricingPeriod === 'month' ? '$9.99' : '$89.99'}
                <span className={styles.planUnit}>{pricingPeriod === 'month' ? '/mo' : '/yr'}</span>
              </div>
              <div className={styles.planDesc}>
                {pricingPeriod === 'month' ? 'Advanced tools & cloud acceleration' : 'Best value for professional creators'}
              </div>
              <ul className={styles.planFeatures}>
                {vipFeatures.map((f, j) => (
                  <li key={j}>
                    <span className={styles.planCheck}>✓</span>
                    {f.bold ? <strong style={{ color: '#8b5cf6' }}>{f.text}</strong> : f.text}
                  </li>
                ))}
              </ul>
              <Button theme="solid" className={styles.pricingBtnPrimary} onClick={() => handlePricingClick('vip')}>
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.overline}>FAQ</div>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionDesc}>Quick answers to common questions about UniCut</p>
          </div>
          <div className={styles.faqList}>
            {faqList.map((item, i) => (
              <div className={`${styles.faqItem} ${activeFaq === i ? styles.faqActive : ''}`} key={i}>
                <div className={styles.faqQ} onClick={() => toggleFaq(i)}>
                  <span>{item.q}</span>
                  <span className={`${styles.faqToggle} ${activeFaq === i ? styles.faqToggleActive : ''}`}>+</span>
                </div>
                <div className={styles.faqA}>
                  <div className={styles.faqAInner}>{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.bottomCta}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <h2>Ready to Start Creating?</h2>
            <p className={styles.bottomCtaDesc}>No installation required. Jump straight into fast, private timeline editing.</p>
            <Button
              theme="solid"
              size="large"
              className={`${styles.heroBtn} ${styles.bottomCtaBtn}`}
              onClick={() => history.push('/workspace/draft')}
            >
              Launch Editor Now →
            </Button>
          </div>
        </div>
      </section>
      <Footer />
      <VipRecharge visible={vipRechargeVisible} onCancel={() => setVipRechargeVisible(false)} />
    </div>
  );
}
