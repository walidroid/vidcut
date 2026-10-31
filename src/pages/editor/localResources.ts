/**
 * VidCut Local Offline Resources Catalog
 * Provides built-in offline assets (Audio, Filters, Effects, Transitions, Text Styles, Fonts)
 * with 0 remote network dependencies.
 */

export interface LocalResourceItem {
  id: string;
  name: string;
  type: string;
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

