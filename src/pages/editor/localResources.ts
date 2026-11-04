/**
 * VidCut Local Offline Resources Catalog
 * Provides built-in offline assets (Audio, Filters, Effects, Transitions, Text Styles, Fonts)
 * with 0 remote network dependencies.
 */

export interface LocalResourceItem {
  id: string;
  name: string;
  type: string;
  url?: string;
  thumb?: string;
  urls: {
    url: string;
    thumb: string;
  };
  duration?: number;
  attrs?: Record<string, any>;
  jscript?: string;
  text?: string;
  textStyle?: Record<string, any>;
  category_id?: string;
  from?: 'system' | 'user';
  is_collected?: boolean;
}

// 1. Local Audio Resources (Sound Effects + Loops)
export const LOCAL_AUDIO_ITEMS: LocalResourceItem[] = [
  {
    id: 'audio_pop',
    name: 'Pop Bubble',
    type: 'audio',
    category_id: 'sfx',
    duration: 0.12,
    urls: { url: '/assets/audio/pop.wav', thumb: '/assets/audio/audio_thumb.svg' },
    attrs: { duration: 0.12 },
  },
  {
    id: 'audio_whoosh',
    name: 'Whoosh Transition',
    type: 'audio',
    category_id: 'sfx',
    duration: 0.45,
    urls: { url: '/assets/audio/whoosh.wav', thumb: '/assets/audio/audio_thumb.svg' },
    attrs: { duration: 0.45 },
  },
  {
    id: 'audio_chime',
    name: 'Bell Chime',
    type: 'audio',
    category_id: 'sfx',
    duration: 1.2,
    urls: { url: '/assets/audio/chime.wav', thumb: '/assets/audio/audio_thumb.svg' },
    attrs: { duration: 1.2 },
  },
  {
    id: 'audio_success',
    name: 'Success Fanfare',
    type: 'audio',
    category_id: 'sfx',
    duration: 1.5,
    urls: { url: '/assets/audio/success.wav', thumb: '/assets/audio/audio_thumb.svg' },
    attrs: { duration: 1.5 },
  },
  {
    id: 'audio_camera',
    name: 'Camera Shutter',
    type: 'audio',
    category_id: 'sfx',
    duration: 0.25,
    urls: { url: '/assets/audio/camera.wav', thumb: '/assets/audio/audio_thumb.svg' },
    attrs: { duration: 0.25 },
  },
  {
    id: 'audio_boom',
    name: 'Bass Impact Boom',
    type: 'audio',
    category_id: 'sfx',
    duration: 1.0,
    urls: { url: '/assets/audio/boom.wav', thumb: '/assets/audio/audio_thumb.svg' },
    attrs: { duration: 1.0 },
  },
  {
    id: 'audio_ding',
    name: 'Cash Ding',
    type: 'audio',
    category_id: 'sfx',
    duration: 0.8,
    urls: { url: '/assets/audio/ding.wav', thumb: '/assets/audio/audio_thumb.svg' },
    attrs: { duration: 0.8 },
  },
  {
    id: 'audio_tick',
    name: 'Clock Tick',
    type: 'audio',
    category_id: 'sfx',
    duration: 0.08,
    urls: { url: '/assets/audio/clock_tick.wav', thumb: '/assets/audio/audio_thumb.svg' },
    attrs: { duration: 0.08 },
  },
  {
    id: 'audio_glitch',
    name: 'Glitch Noise',
    type: 'audio',
    category_id: 'sfx',
    duration: 0.35,
    urls: { url: '/assets/audio/glitch_sfx.wav', thumb: '/assets/audio/audio_thumb.svg' },
    attrs: { duration: 0.35 },
  },
  {
    id: 'audio_retro_jump',
    name: 'Retro 8-Bit Jump',
    type: 'audio',
    category_id: 'sfx',
    duration: 0.22,
    urls: { url: '/assets/audio/retro_jump.wav', thumb: '/assets/audio/audio_thumb.svg' },
    attrs: { duration: 0.22 },
  },
  {
    id: 'audio_riser',
    name: 'Cinematic Tension Riser',
    type: 'audio',
    category_id: 'sfx',
    duration: 2.5,
    urls: { url: '/assets/audio/cinematic_riser.wav', thumb: '/assets/audio/audio_thumb.svg' },
    attrs: { duration: 2.5 },
  },
  {
    id: 'audio_ambient',
    name: 'Ambient Drone Atmosphere',
    type: 'audio',
    category_id: 'music',
    duration: 5.0,
    urls: { url: '/assets/audio/ambient_drone.wav', thumb: '/assets/audio/audio_thumb.svg' },
    attrs: { duration: 5.0 },
  },
  {
    id: 'audio_beat',
    name: 'Electronic Modern Beat',
    type: 'audio',
    category_id: 'music',
    duration: 4.0,
    urls: { url: '/assets/audio/electronic_beat.wav', thumb: '/assets/audio/audio_thumb.svg' },
    attrs: { duration: 4.0 },
  },
  {
    id: 'audio_lofi',
    name: 'Lo-Fi Chill Hop Beat',
    type: 'audio',
    category_id: 'music',
    duration: 6.0,
    urls: { url: '/assets/audio/lofi_chill.wav', thumb: '/assets/audio/audio_thumb.svg' },
    attrs: { duration: 6.0 },
  },
  {
    id: 'audio_acoustic',
    name: 'Acoustic Guitar Harmony',
    type: 'audio',
    category_id: 'music',
    duration: 6.0,
    urls: { url: '/assets/audio/acoustic_strum.wav', thumb: '/assets/audio/audio_thumb.svg' },
    attrs: { duration: 6.0 },
  },
  {
    id: 'audio_synthwave',
    name: 'Synthwave Night Groove',
    type: 'audio',
    category_id: 'music',
    duration: 5.0,
    urls: { url: '/assets/audio/synthwave_groove.wav', thumb: '/assets/audio/audio_thumb.svg' },
    attrs: { duration: 5.0 },
  },
];

// 2. Local Filter (LUT) Resources
const RAW_LUTS = [
  { name: 'Vintage Classic', file: 'vintage.png', cat: 'retro' },
  { name: 'Filmstock 50', file: 'filmstock_50.png', cat: 'cinema' },
  { name: 'Vivid Pop', file: 'vivid.png', cat: 'portrait' },
  { name: 'Urban Cool', file: 'urban.png', cat: 'scenery' },
  { name: 'Warm Sunset', file: 'sunset.png', cat: 'scenery' },
  { name: 'Forest Green', file: 'forest.png', cat: 'scenery' },
  { name: 'Clean Minimal', file: 'clean.png', cat: 'portrait' },
  { name: 'Moonlight Blue', file: 'moonlight.png', cat: 'cinema' },
  { name: 'Nature Breeze', file: 'nature.png', cat: 'scenery' },
  { name: 'Night From Day', file: 'night_from_day.png', cat: 'cinema' },
  { name: 'Pink Glow', file: 'pink.png', cat: 'portrait' },
  { name: 'Snow Winter', file: 'snow.png', cat: 'scenery' },
  { name: 'Sweet Peach', file: 'sweet.png', cat: 'portrait' },
  { name: 'Delicious Food', file: 'delicious.png', cat: 'scenery' },
  { name: 'Fresh Morning', file: 'fresh.png', cat: 'portrait' },
  { name: 'Crisp Warm', file: 'crisp_warm.png', cat: 'portrait' },
  { name: 'Foggy Night', file: 'foggy_night.png', cat: 'cinema' },
  { name: 'Teal & Orange', file: 'teal_orange_plus_contrast.png', cat: 'cinema' },
  { name: 'Horror Blue', file: 'horror_blue.png', cat: 'cinema' },
  { name: 'Futuristic Bleak', file: 'futuristic_bleak.png', cat: 'cinema' },
  { name: 'Late Sunset', file: 'late_sunset.png', cat: 'scenery' },
  { name: 'Beach Paradise', file: 'bearch.png', cat: 'scenery' },
  { name: 'Candlelight', file: 'candlelight.png', cat: 'retro' },
  { name: 'Kodak 5218', file: 'kodak_5218_kodak_2383.png', cat: 'cinema' },
  { name: 'Fuji Eterna', file: 'fuji_eterna_250d_kodak_2395.png', cat: 'cinema' },
  { name: 'VSCO A6', file: 'lookup_vscocam.A6.png', cat: 'retro' },
  { name: 'VSCO F2', file: 'lookup_vscocam.F2.png', cat: 'retro' },
  { name: 'Instagram Clarendon', file: 'lookup_INS_1clarendon.png', cat: 'portrait' },
  { name: 'Instagram Lark', file: 'lookup_INS_4lark.png', cat: 'portrait' },
  { name: 'Oxygen Breath', file: 'oxygen.png', cat: 'portrait' },
  { name: 'Macaron Pastel', file: 'makalong.png', cat: 'portrait' },
  { name: 'Solarize Art', file: 'solarize.png', cat: 'retro' },
  { name: 'Coral Reef', file: 'coral.png', cat: 'scenery' },
  { name: 'Tension Green', file: 'tension_green.png', cat: 'cinema' },
  { name: 'First Love', file: 'first_love.png', cat: 'portrait' },
  { name: 'Music Mood', file: 'music.png', cat: 'portrait' },
  { name: 'Origin Raw', file: 'origin.png', cat: 'portrait' },
  { name: 'Neutral Balance', file: 'neutral.png', cat: 'portrait' },
];

export const LOCAL_FILTER_ITEMS: LocalResourceItem[] = RAW_LUTS.map((lut, idx) => ({
  id: `filter_${idx + 1}`,
  name: lut.name,
  type: 'filter',
  category_id: lut.cat,
  urls: {
    url: `/assets/lut-images/${lut.file}`,
    thumb: `/assets/lut-images/${lut.file}`,
  },
  attrs: {
    width: 100,
    height: 100,
    intensity: 1,
  },
}));

// 3. Local Transitions (gl-transitions based)
const RAW_TRANSITIONS = [
  { id: 'trans_fade', name: 'Fade Dissolve', shader: 'fade', cat: 'basic' },
  { id: 'trans_crosszoom', name: 'Cross Zoom', shader: 'CrossZoom', cat: 'dynamic' },
  { id: 'trans_right', name: 'Wipe Right', shader: 'directional', cat: 'basic' },
  { id: 'trans_left', name: 'Wipe Left', shader: 'directionalwipe', cat: 'basic' },
  { id: 'trans_cube', name: '3D Cube', shader: 'cube', cat: 'dynamic' },
  { id: 'trans_circlecrop', name: 'Circle Crop', shader: 'circlecrop', cat: 'basic' },
  { id: 'trans_swirl', name: 'Vortex Swirl', shader: 'swirl', cat: 'distortion' },
  { id: 'trans_flyeye', name: 'Fly Eye Multi-view', shader: 'flyeye', cat: 'distortion' },
  { id: 'trans_linearblur', name: 'Motion Blur', shader: 'linearblur', cat: 'dynamic' },
  { id: 'trans_mosaic', name: 'Pixel Mosaic', shader: 'mosaic', cat: 'distortion' },
  { id: 'trans_radial', name: 'Radial Spin', shader: 'radial', cat: 'dynamic' },
  { id: 'trans_ripple', name: 'Water Ripple', shader: 'ripple', cat: 'distortion' },
  { id: 'trans_blinds', name: 'Window Blinds', shader: 'windowblinds', cat: 'basic' },
  { id: 'trans_glitch', name: 'Cyber Glitch', shader: 'glitchmemories', cat: 'distortion' },
];

export const LOCAL_TRANSITION_ITEMS: LocalResourceItem[] = RAW_TRANSITIONS.map(tr => ({
  id: tr.id,
  name: tr.name,
  type: 'transition',
  category_id: tr.cat,
  urls: {
    url: `/assets/transition-images/${tr.shader}.svg`,
    thumb: `/assets/transition-images/${tr.shader}.svg`,
  },
  attrs: {
    name: tr.shader,
    width: 100,
    height: 70,
    duration: 1,
  },
}));

// 4. Local Effects (from public/assets/effect-images)
const RAW_EFFECTS = [
  { name: 'Cyber Glitch', file: 'glitch.png', cat: 'distortion' },
  { name: 'Radiant Bloom', file: 'bloom.png', cat: 'color' },
  { name: 'Gaussian Blur', file: 'blur.png', cat: 'blur' },
  { name: 'Radial Blur', file: 'radial-blur.png', cat: 'blur' },
  { name: 'Zoom Blur', file: 'zoom-blur.png', cat: 'blur' },
  { name: 'Motion Blur', file: 'motion-blur.png', cat: 'blur' },
  { name: 'Old Film Vintage', file: 'old-film.png', cat: 'retro' },
  { name: 'RGB Channel Split', file: 'rgb.png', cat: 'distortion' },
  { name: 'Shockwave Pulse', file: 'shockwave.png', cat: 'distortion' },
  { name: 'Pixelate 8-Bit', file: 'pixelate.png', cat: 'retro' },
  { name: 'Godray Light', file: 'godray.png', cat: 'color' },
  { name: 'Film Grain Noise', file: 'noise.png', cat: 'retro' },
  { name: 'CRT Scanlines', file: 'crt.png', cat: 'retro' },
  { name: 'Twist Whirl', file: 'twist.png', cat: 'distortion' },
  { name: 'Neon Glow', file: 'glow.png', cat: 'color' },
  { name: 'Drop Shadow', file: 'drop-shadow.png', cat: 'color' },
  { name: 'Bevel 3D', file: 'bevel.png', cat: 'color' },
  { name: 'Color Gradient', file: 'color-gradient.png', cat: 'color' },
  { name: 'Grayscale B&W', file: 'grayscale.png', cat: 'color' },
  { name: 'ASCII Matrix Art', file: 'ascii.png', cat: 'retro' },
  { name: 'Emboss Relief', file: 'emboss.png', cat: 'retro' },
  { name: 'Water Reflection', file: 'reflection.png', cat: 'distortion' },
];

export const LOCAL_EFFECT_ITEMS: LocalResourceItem[] = RAW_EFFECTS.map((eff, idx) => ({
  id: `effect_${idx + 1}`,
  name: eff.name,
  type: 'effect',
  category_id: eff.cat,
  urls: {
    url: `/assets/effect-images/${eff.file}`,
    thumb: `/assets/effect-images/${eff.file}`,
  },
  attrs: {
    effectType: 'script',
    width: 100,
    height: 100,
  },
  jscript: '',
}));

// 5. Local Text Presets
export const LOCAL_TEXT_ITEMS: LocalResourceItem[] = [
  {
    id: 'text_basic_title',
    name: 'Basic Bold Title',
    type: 'text',
    category_id: 'title',
    text: 'VidCut Video Title',
    urls: { url: '', thumb: '/assets/text-images/basic_title.svg' },
    textStyle: {
      fontSize: 64,
      fontFamily: 'Arial, sans-serif',
      fill: '#ffffff',
      fontWeight: 'bold',
      align: 'center',
    },
    attrs: { width: 400, height: 100 },
  },
  {
    id: 'text_bold_header',
    name: 'Impact Header',
    type: 'text',
    category_id: 'title',
    text: 'BREAKING NEWS',
    urls: { url: '', thumb: '/assets/text-images/bold_header.svg' },
    textStyle: {
      fontSize: 72,
      fontFamily: 'Impact, Arial Black, sans-serif',
      fill: '#facc15',
      stroke: '#000000',
      strokeThickness: 5,
      align: 'center',
    },
    attrs: { width: 500, height: 120 },
  },
  {
    id: 'text_neon_glow',
    name: 'Electric Neon',
    type: 'text',
    category_id: 'creative',
    text: 'NEON LIGHTS',
    urls: { url: '', thumb: '/assets/text-images/neon_glow.svg' },
    textStyle: {
      fontSize: 68,
      fontFamily: 'Arial, sans-serif',
      fill: '#38bdf8',
      dropShadow: true,
      dropShadowColor: '#0284c7',
      dropShadowBlur: 14,
      align: 'center',
    },
    attrs: { width: 450, height: 110 },
  },
  {
    id: 'text_cyberpunk',
    name: 'Cyberpunk Duo',
    type: 'text',
    category_id: 'creative',
    text: 'CYBERPUNK',
    urls: { url: '', thumb: '/assets/text-images/cyberpunk.svg' },
    textStyle: {
      fontSize: 64,
      fontFamily: 'Arial Black, sans-serif',
      fill: '#ec4899',
      stroke: '#06b6d4',
      strokeThickness: 4,
      align: 'center',
    },
    attrs: { width: 450, height: 110 },
  },
  {
    id: 'text_outline_sub',
    name: 'Subtitle with Border',
    type: 'text',
    category_id: 'subtitle',
    text: 'Clear readable subtitle text here',
    urls: { url: '', thumb: '/assets/text-images/outline_sub.svg' },
    textStyle: {
      fontSize: 40,
      fontFamily: 'Arial, sans-serif',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center',
    },
    attrs: { width: 600, height: 80 },
  },
  {
    id: 'text_minimalist',
    name: 'Clean Minimalist',
    type: 'text',
    category_id: 'title',
    text: 'Simple & Elegant',
    urls: { url: '', thumb: '/assets/text-images/minimalist.svg' },
    textStyle: {
      fontSize: 52,
      fontFamily: 'Georgia, serif',
      fill: '#e4e4e7',
      fontWeight: 'normal',
      align: 'center',
    },
    attrs: { width: 400, height: 90 },
  },
  {
    id: 'text_retro_gradient',
    name: 'Retro Sunset Gradient',
    type: 'text',
    category_id: 'creative',
    text: 'RETRO VIBES',
    urls: { url: '', thumb: '/assets/text-images/retro_gradient.svg' },
    textStyle: {
      fontSize: 68,
      fontFamily: 'Impact, sans-serif',
      fill: ['#f43f5e', '#fb923c', '#facc15'],
      align: 'center',
    },
    attrs: { width: 450, height: 110 },
  },
  {
    id: 'text_comic_pop',
    name: 'Comic Pop Explosion',
    type: 'text',
    category_id: 'creative',
    text: 'BOOM!',
    urls: { url: '', thumb: '/assets/text-images/comic_pop.svg' },
    textStyle: {
      fontSize: 76,
      fontFamily: 'Arial Black, sans-serif',
      fill: '#f97316',
      stroke: '#ffffff',
      strokeThickness: 6,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      align: 'center',
    },
    attrs: { width: 400, height: 120 },
  },
  {
    id: 'text_lower_third',
    name: 'Lower Third Headline',
    type: 'text',
    category_id: 'subtitle',
    text: 'Presenter Name | Host',
    urls: { url: '', thumb: '/assets/text-images/lower_third.svg' },
    textStyle: {
      fontSize: 36,
      fontFamily: 'Arial, sans-serif',
      fill: '#ffffff',
      align: 'left',
    },
    attrs: { width: 450, height: 70 },
  },
  {
    id: 'text_vintage_serif',
    name: 'Vintage Cinema Serif',
    type: 'text',
    category_id: 'title',
    text: 'A FILM BY VIDCUT',
    urls: { url: '', thumb: '/assets/text-images/vintage_serif.svg' },
    textStyle: {
      fontSize: 48,
      fontFamily: 'Times New Roman, serif',
      fill: '#fed7aa',
      letterSpacing: 4,
      align: 'center',
    },
    attrs: { width: 500, height: 90 },
  },
  {
    id: 'text_subtitle_yellow',
    name: 'Yellow Subtitle',
    type: 'text',
    category_id: 'subtitle',
    text: 'Highlight subtitle in vivid yellow',
    urls: { url: '', thumb: '/assets/text-images/outline_sub.svg' },
    textStyle: {
      fontSize: 42,
      fontFamily: 'Arial, sans-serif',
      fill: '#facc15',
      stroke: '#000000',
      strokeThickness: 5,
      align: 'center',
    },
    attrs: { width: 600, height: 80 },
  },
  {
    id: 'text_subtitle_box',
    name: 'Cinema Box Subtitle',
    type: 'text',
    category_id: 'subtitle',
    text: 'Cinematic box subtitle caption',
    urls: { url: '', thumb: '/assets/text-images/outline_sub.svg' },
    textStyle: {
      fontSize: 38,
      fontFamily: 'Helvetica, Arial, sans-serif',
      fill: '#ffffff',
      stroke: '#18181b',
      strokeThickness: 3,
      align: 'center',
    },
    attrs: { width: 620, height: 80 },
  },
];

// 5b. Local Sticker Resources (SVGs / Badges / Reactions)
export const LOCAL_STICKER_ITEMS: LocalResourceItem[] = [
  {
    id: 'sticker_like',
    name: 'Thumbs Up',
    type: 'sticker',
    category_id: 'social',
    urls: { url: '/assets/stickers/like.svg', thumb: '/assets/stickers/like.svg' },
    attrs: { width: 200, height: 200, duration: 5 },
  },
  {
    id: 'sticker_fire',
    name: 'Fire Flame',
    type: 'sticker',
    category_id: 'reactions',
    urls: { url: '/assets/stickers/fire.svg', thumb: '/assets/stickers/fire.svg' },
    attrs: { width: 200, height: 200, duration: 5 },
  },
  {
    id: 'sticker_star',
    name: 'Golden Star',
    type: 'sticker',
    category_id: 'reactions',
    urls: { url: '/assets/stickers/star.svg', thumb: '/assets/stickers/star.svg' },
    attrs: { width: 200, height: 200, duration: 5 },
  },
  {
    id: 'sticker_heart',
    name: 'Neon Heart',
    type: 'sticker',
    category_id: 'social',
    urls: { url: '/assets/stickers/heart.svg', thumb: '/assets/stickers/heart.svg' },
    attrs: { width: 200, height: 200, duration: 5 },
  },
  {
    id: 'sticker_bell',
    name: 'Alert Bell',
    type: 'sticker',
    category_id: 'social',
    urls: { url: '/assets/stickers/bell.svg', thumb: '/assets/stickers/bell.svg' },
    attrs: { width: 200, height: 200, duration: 5 },
  },
  {
    id: 'sticker_trophy',
    name: 'Winner Trophy',
    type: 'sticker',
    category_id: 'badge',
    urls: { url: '/assets/stickers/trophy.svg', thumb: '/assets/stickers/trophy.svg' },
    attrs: { width: 200, height: 200, duration: 5 },
  },
  {
    id: 'sticker_verified',
    name: 'Verified Badge',
    type: 'sticker',
    category_id: 'badge',
    urls: { url: '/assets/stickers/verified.svg', thumb: '/assets/stickers/verified.svg' },
    attrs: { width: 200, height: 200, duration: 5 },
  },
  {
    id: 'sticker_sparkles',
    name: 'Magic Sparkles',
    type: 'sticker',
    category_id: 'reactions',
    urls: { url: '/assets/stickers/sparkles.svg', thumb: '/assets/stickers/sparkles.svg' },
    attrs: { width: 200, height: 200, duration: 5 },
  },
  {
    id: 'sticker_mic',
    name: 'Podcast Mic',
    type: 'sticker',
    category_id: 'tech',
    urls: { url: '/assets/stickers/mic.svg', thumb: '/assets/stickers/mic.svg' },
    attrs: { width: 200, height: 200, duration: 5 },
  },
  {
    id: 'sticker_gamepad',
    name: 'Gamepad Controller',
    type: 'sticker',
    category_id: 'gaming',
    urls: { url: '/assets/stickers/gamepad.svg', thumb: '/assets/stickers/gamepad.svg' },
    attrs: { width: 200, height: 200, duration: 5 },
  },
  {
    id: 'sticker_discount',
    name: 'Sale 50% Off',
    type: 'sticker',
    category_id: 'badge',
    urls: { url: '/assets/stickers/discount.svg', thumb: '/assets/stickers/discount.svg' },
    attrs: { width: 200, height: 200, duration: 5 },
  },
  {
    id: 'sticker_lightning',
    name: 'Lightning Bolt',
    type: 'sticker',
    category_id: 'reactions',
    urls: { url: '/assets/stickers/lightning.svg', thumb: '/assets/stickers/lightning.svg' },
    attrs: { width: 200, height: 200, duration: 5 },
  },
  {
    id: 'sticker_code',
    name: 'Code Window',
    type: 'sticker',
    category_id: 'tech',
    urls: { url: '/assets/stickers/code.svg', thumb: '/assets/stickers/code.svg' },
    attrs: { width: 200, height: 200, duration: 5 },
  },
  {
    id: 'sticker_music_note',
    name: 'Musical Note',
    type: 'sticker',
    category_id: 'music',
    urls: { url: '/assets/stickers/music_note.svg', thumb: '/assets/stickers/music_note.svg' },
    attrs: { width: 200, height: 200, duration: 5 },
  },
];

// 5c. Local Template Resources (Modèles de Projet)
export const LOCAL_TEMPLATE_ITEMS: LocalResourceItem[] = [
  {
    id: 'template_vlog_intro',
    name: 'Vlog Channel Intro',
    type: 'template',
    category_id: 'vlog',
    url: '/assets/templates/template_vlog_intro.json',
    thumb: '/assets/templates/thumb_vlog.svg',
    urls: {
      url: '/assets/templates/template_vlog_intro.json',
      thumb: '/assets/templates/thumb_vlog.svg',
    },
    attrs: { width: 1920, height: 1080, duration: 6 },
  },
  {
    id: 'template_social_story',
    name: 'Social Media Story',
    type: 'template',
    category_id: 'social',
    url: '/assets/templates/template_social_story.json',
    thumb: '/assets/templates/thumb_social.svg',
    urls: {
      url: '/assets/templates/template_social_story.json',
      thumb: '/assets/templates/thumb_social.svg',
    },
    attrs: { width: 1080, height: 1920, duration: 6 },
  },
  {
    id: 'template_cinematic_trailer',
    name: 'Cinematic Trailer',
    type: 'template',
    category_id: 'cinema',
    url: '/assets/templates/template_cinematic_trailer.json',
    thumb: '/assets/templates/thumb_cinematic.svg',
    urls: {
      url: '/assets/templates/template_cinematic_trailer.json',
      thumb: '/assets/templates/thumb_cinematic.svg',
    },
    attrs: { width: 1920, height: 1080, duration: 7 },
  },
  {
    id: 'template_podcast_show',
    name: 'Daily Tech Podcast',
    type: 'template',
    category_id: 'podcast',
    url: '/assets/templates/template_podcast_show.json',
    thumb: '/assets/templates/thumb_podcast.svg',
    urls: {
      url: '/assets/templates/template_podcast_show.json',
      thumb: '/assets/templates/thumb_podcast.svg',
    },
    attrs: { width: 1920, height: 1080, duration: 7 },
  },
  {
    id: 'template_gaming_stream',
    name: 'Gaming Highlights',
    type: 'template',
    category_id: 'gaming',
    url: '/assets/templates/template_gaming_stream.json',
    thumb: '/assets/templates/thumb_gaming.svg',
    urls: {
      url: '/assets/templates/template_gaming_stream.json',
      thumb: '/assets/templates/thumb_gaming.svg',
    },
    attrs: { width: 1920, height: 1080, duration: 6.5 },
  },
  {
    id: 'template_product_ad',
    name: 'Product Ad Promo',
    type: 'template',
    category_id: 'business',
    url: '/assets/templates/template_product_ad.json',
    thumb: '/assets/templates/thumb_product.svg',
    urls: {
      url: '/assets/templates/template_product_ad.json',
      thumb: '/assets/templates/thumb_product.svg',
    },
    attrs: { width: 1920, height: 1080, duration: 7 },
  },
  {
    id: 'template_quick_tips',
    name: 'Quick Tips Reel (9:16)',
    type: 'template',
    category_id: 'social',
    url: '/assets/templates/template_quick_tips.json',
    thumb: '/assets/templates/thumb_quick_tips.svg',
    urls: {
      url: '/assets/templates/template_quick_tips.json',
      thumb: '/assets/templates/thumb_quick_tips.svg',
    },
    attrs: { width: 1080, height: 1920, duration: 6 },
  },
  {
    id: 'template_fitness_workout',
    name: 'HIIT Workout (9:16)',
    type: 'template',
    category_id: 'lifestyle',
    url: '/assets/templates/template_fitness_workout.json',
    thumb: '/assets/templates/thumb_fitness.svg',
    urls: {
      url: '/assets/templates/template_fitness_workout.json',
      thumb: '/assets/templates/thumb_fitness.svg',
    },
    attrs: { width: 1080, height: 1920, duration: 6 },
  },
  {
    id: 'template_tech_tutorial',
    name: 'Code Tech Tutorial',
    type: 'template',
    category_id: 'education',
    url: '/assets/templates/template_tech_tutorial.json',
    thumb: '/assets/templates/thumb_tech.svg',
    urls: {
      url: '/assets/templates/template_tech_tutorial.json',
      thumb: '/assets/templates/thumb_tech.svg',
    },
    attrs: { width: 1920, height: 1080, duration: 7 },
  },
  {
    id: 'template_music_lyrics',
    name: 'Music Lyrics Video',
    type: 'template',
    category_id: 'music',
    url: '/assets/templates/template_music_lyrics.json',
    thumb: '/assets/templates/thumb_music.svg',
    urls: {
      url: '/assets/templates/template_music_lyrics.json',
      thumb: '/assets/templates/thumb_music.svg',
    },
    attrs: { width: 1920, height: 1080, duration: 7.5 },
  },
];

// 6. Local Font Families (for TextStyle font selector)
export const LOCAL_FONTS = [
  { id: 'font_jammono', name: 'JamMono', fontFamily: 'JamMono', url: '/assets/JamMono.ttf' },
  { id: 'font_zhanku', name: 'ZhanKu', fontFamily: 'ZhanKu', url: '/assets/zhanKu.woff' },
  { id: 'font_arial', name: 'Arial', fontFamily: 'Arial, sans-serif' },
  { id: 'font_helvetica', name: 'Helvetica', fontFamily: 'Helvetica, Arial, sans-serif' },
  { id: 'font_impact', name: 'Impact', fontFamily: 'Impact, Charcoal, sans-serif' },
  { id: 'font_georgia', name: 'Georgia', fontFamily: 'Georgia, serif' },
  { id: 'font_times', name: 'Times New Roman', fontFamily: '"Times New Roman", Times, serif' },
  { id: 'font_courier', name: 'Courier New', fontFamily: '"Courier New", Courier, monospace' },
  { id: 'font_trebuchet', name: 'Trebuchet MS', fontFamily: '"Trebuchet MS", sans-serif' },
  { id: 'font_verdana', name: 'Verdana', fontFamily: 'Verdana, Geneva, sans-serif' },
  { id: 'font_tahoma', name: 'Tahoma', fontFamily: 'Tahoma, Geneva, sans-serif' },
];

// 7. Categories for Source Tabs
export const LOCAL_MATERIAL_TYPES: Record<string, Array<{ id: string; name: string }>> = {
  audio: [
    { id: 'all', name: 'All' },
    { id: 'sfx', name: 'Sound Effects' },
    { id: 'music', name: 'Music Tracks' },
  ],
  filter: [
    { id: 'all', name: 'All' },
    { id: 'portrait', name: 'Portrait' },
    { id: 'cinema', name: 'Cinema' },
    { id: 'retro', name: 'Retro & Film' },
    { id: 'scenery', name: 'Scenery' },
  ],
  transition: [
    { id: 'all', name: 'All' },
    { id: 'basic', name: 'Basic' },
    { id: 'dynamic', name: 'Dynamic' },
    { id: 'distortion', name: 'Distortion' },
  ],
  effect: [
    { id: 'all', name: 'All' },
    { id: 'blur', name: 'Blur' },
    { id: 'color', name: 'Color & Glow' },
    { id: 'distortion', name: 'Distortion' },
    { id: 'retro', name: 'Retro' },
  ],
  text: [
    { id: 'all', name: 'All' },
    { id: 'title', name: 'Titles & Headers' },
    { id: 'subtitle', name: 'Subtitles' },
    { id: 'creative', name: 'Creative' },
  ],
  sticker: [
    { id: 'all', name: 'All' },
    { id: 'social', name: 'Social' },
    { id: 'reactions', name: 'Reactions' },
    { id: 'badge', name: 'Badges' },
    { id: 'tech', name: 'Tech & Code' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'music', name: 'Music' },
  ],
  lottie: [
    { id: 'all', name: 'All' },
    { id: 'social', name: 'Social' },
    { id: 'reactions', name: 'Reactions' },
    { id: 'badge', name: 'Badges' },
    { id: 'tech', name: 'Tech & Code' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'music', name: 'Music' },
  ],
  template: [
    { id: 'all', name: 'All' },
    { id: 'vlog', name: 'Vlog' },
    { id: 'social', name: 'Social & Reels' },
    { id: 'cinema', name: 'Cinematic' },
    { id: 'podcast', name: 'Podcast & Talk' },
    { id: 'gaming', name: 'Gaming & Stream' },
    { id: 'business', name: 'Business & Ads' },
    { id: 'lifestyle', name: 'Fitness & Lifestyle' },
    { id: 'education', name: 'Tech & Education' },
    { id: 'music', name: 'Music & Lyrics' },
  ],
};

/**
 * Filter and paginate local material items
 */
export function queryLocalMaterials(
  type: string,
  params: {
    page?: number;
    page_size?: number;
    keyword?: string;
    category_id?: string;
  } = {}
): { data: any[]; total: number } {
  let sourceList: LocalResourceItem[] = [];

  if (type === 'audio') sourceList = LOCAL_AUDIO_ITEMS;
  else if (type === 'filter') sourceList = LOCAL_FILTER_ITEMS;
  else if (type === 'transition') sourceList = LOCAL_TRANSITION_ITEMS;
  else if (type === 'effect') sourceList = LOCAL_EFFECT_ITEMS;
  else if (type === 'text') sourceList = LOCAL_TEXT_ITEMS;
  else if (type === 'font') sourceList = LOCAL_FONTS as any[];
  else if (type === 'sticker' || type === 'lottie') sourceList = LOCAL_STICKER_ITEMS;
  else if (type === 'template') sourceList = LOCAL_TEMPLATE_ITEMS;

  let filtered = [...sourceList];

  // Category filter
  if (params.category_id && params.category_id !== 'all' && params.category_id !== '') {
    filtered = filtered.filter(item => item.category_id === params.category_id);
  }

  // Keyword search
  if (params.keyword && params.keyword.trim() !== '') {
    const kw = params.keyword.trim().toLowerCase();
    filtered = filtered.filter(item => item.name.toLowerCase().includes(kw));
  }

  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.page_size || 50);
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return {
    data: paginated,
    total: filtered.length,
  };
}

