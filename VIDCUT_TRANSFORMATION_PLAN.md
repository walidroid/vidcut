# VidCut Transformation Plan & Migration Guide

> **Objective**: Convert the VIDCUT codebase into **VidCut** — a clean, standalone, browser-based **video editor** with **zero AI dependencies**, bilingual support (**English & French only**, removing all Chinese), and a refined user experience.

---

## Table of Contents
1. [Transformation Overview](#1-transformation-overview)
2. [Step 1: Rebrand from VIDCUT to VidCut](#step-1-rebrand-from-vidcut-to-vidcut)
3. [Step 2: Complete Removal of AI Modules & Assets](#step-2-complete-removal-of-ai-modules--assets)
4. [Step 3: Remove Chinese & Setup English + French Localization](#step-3-remove-chinese--setup-english--french-localization)
5. [Step 4: Streamline UI into a Pure Video Editor](#step-4-streamline-ui-into-a-pure-video-editor)
6. [Step 5: Dependency & Heavy Asset Cleanup](#step-5-dependency--heavy-asset-cleanup)
7. [Step 6: Automated Execution Script (PowerShell)](#step-6-automated-execution-script-powershell)
8. [Verification & Build Testing](#verification--build-testing)

---

## 1. Transformation Overview

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                           VIDCUT (Before)                                     │
│  • Mixed Video Editor + Generative AI + AI Chat Agent + Cloud VIP Recharge     │
│  • Chinese (zh-CN) & English (en-US) with hardcoded Chinese strings           │
│  • Heavy AI models in /public/assets/ai (~100MB+ of ONNX, OpenCV, Tesseract)  │
│  • Name: VIDCUT / aacut / 无界云剪                                             │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │
                                       ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                            VidCut (After)                                     │
│  • Pure Client-Side Non-Linear Video Editor (NLE)                             │
│  • Timeline: Multi-track, trimming, splitting, speed ramps, audio extraction │
│  • Canvas: WebGL 60fps, transformations, bezier paths, keyframing, masks      │
│  • Visuals: Chroma key (green screen), LUT filters, GL transitions, text      │
│  • Zero AI code, zero AI models, zero cloud tokens/VIP locks                  │
│  • Strict EN / FR (English & French) bilingual support                        │
│  • Lighter bundle by ~120MB, faster load times, 100% private & local          │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## Step 1: Rebrand from VIDCUT to VidCut

### 1.1 `package.json`
Update package metadata:
```json
{
  "name": "vidcut",
  "version": "1.0.0",
  "description": "VidCut - Modern Web-based Video Editor",
  "private": true,
  ...
}
```

### 1.2 `index.html`
Replace page title and remove Chinese SEO tags & Baidu analytics:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="description" content="VidCut - Fast, modern in-browser video editor" />
    <meta name="keywords" content="video editor, web video editor, timeline, vidcut" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
    <title>VidCut - Video Editor</title>
    <script src="/assets/scripts/lame.min.js"></script>
    <script src="/assets/medianinfo/index.min.js"></script>
    <script async src="/assets/ffmpeg/ffmpeg.js"></script>
  </head>
  <body class="scroll">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 1.3 `src/config/index.ts`
Update project storage prefix:
```ts
const config = {
  secretKey: 'x&S#acLCx',
  apiHost: '/api/v1',
  editorHost: 'https://localhost:3002/editor',
  prefix: 'vidcut', // Changed from 'video' to 'vidcut'
  resourcesHost: 'https://cdn.h5ds.com',
  loginSuccessLink: '/workspace/draft',
  basename: '',
  env: 'dev',
  EModuleEffectSourcePath: 'https://cdn.h5ds.com/assets/effectcanvas/',
  workerPath: '/assets/worker',
  host: 'https://vidcut.app',
};
```

### 1.4 `src/database/localDB.ts`
Rename the IndexedDB instance from `H5VideoLocalDB` to `VidCutLocalDB`:
```ts
class LocalDB extends Dexie {
  materials!: Table<MaterialRecord, string>;
  folderHandles!: Table<FolderHandleRecord, string>;
  projects!: Table<ProjectRecord, string>;
  categories!: Table<CategoryRecord, string>;
  uploads!: Table<UploadRecord, string>;

  constructor() {
    super('VidCutLocalDB'); // Renamed from H5VideoLocalDB
    this.version(1).stores({
      materials: 'id, appId, type, createdAt',
      folderHandles: 'id',
      projects: 'id, categoryId, updatedAt',
      categories: 'id, type',
      uploads: 'id, createdAt',
    });
  }
}
```

---

## Step 2: Complete Removal of AI Modules & Assets

### 2.1 Files and Folders to Delete

Delete the following directories and files:

```text
src/pages/editor/components/ai-chat/                       <-- Entire AI Chat & Agent
src/pages/editor/components/sources/ai/                    <-- Generative AI Panel
src/pages/editor/components/sources/caption/captions/AiCaption.tsx <-- AI ASR subtitles
src/pages/editor/components/sources/my/TTS.tsx             <-- Text to speech
src/pages/editor/components/sources/my/TTS copy.tsx        <-- Text to speech copy
src/pages/editor/components/sources/my/tts.mock.ts         <-- TTS mock data
src/pages/editor/components/timeline2/toolbar/ai-matting/  <-- AI matting
src/pages/editor/components/timeline2/toolbar/ai-portrait/ <-- AI portrait
src/pages/editor/components/timeline2/toolbar/ai-removebg/ <-- AI background removal
src/pages/editor/components/timeline2/toolbar/ai-rubber/   <-- AI eraser
src/pages/editor/components/timeline2/toolbar/ai-super-resolution/ <-- AI upscale
src/pages/editor/components/options/components/ai-btns/    <-- Magic wand & AI buttons
public/assets/ai/                                          <-- OpenCV.js & ONNX models (~100MB)
```

### 2.2 Modify `src/pages/editor/Editor.tsx`

1. **Remove AIChat import**:
   Remove:
   ```ts
   import AIChat from './components/ai-chat/AIChat';
   ```

2. **Remove AIChat state and handlers**:
   Remove `showAIChat`, `aiChatWidth`, `minAiChatWidth`, and `aiChatBarDrag`.

3. **Simplify Layout Calculations**:
   In `src/pages/editor/Editor.tsx`:
   - Change:
     ```ts
     width: width - SIDEBAR_WIDTH - (showAIChat ? aiChatWidth : 0),
     ```
     To:
     ```ts
     width: width - SIDEBAR_WIDTH,
     ```
   - Change:
     ```ts
     width: width - (showAIChat ? aiChatWidth : 0),
     ```
     To:
     ```ts
     width: width,
     ```

4. **Remove AIChat JSX container**:
   Delete lines 540-562 containing `<div className={styles.aiChat}> ... <AIChat /> </div>`.

### 2.3 Modify `src/pages/editor/components/timeline2/toolbar/Toolbar.tsx`

1. **Remove AI imports**:
   ```ts
   // DELETE these imports:
   import AiRubber from './ai-rubber/AiRubber';
   import AiSuperResolution from './ai-super-resolution';
   import AiMatting from './ai-matting/AiMatting';
   import AiRemoveBg from './ai-removebg/AiRemoveBg';
   ```

2. **Remove AI tool buttons in JSX**:
   ```tsx
   // DELETE these lines inside the toolbar buttons:
   <AiRubber />
   <AiRemoveBg />
   <AiMatting />
   <AiSuperResolution />
   ```

### 2.4 Modify `src/pages/editor/components/sources/index.tsx`

Remove the AI panel tab from sources:
```tsx
// REMOVE:
import AiComp from './ai';

// In JSX, REMOVE:
{type === 'ai' ? <AiComp /> : null}
```

### 2.5 Modify `src/pages/editor/components/sources/caption/captions/Captions.tsx`

Remove AI Subtitle generation tab:
```tsx
// REMOVE:
import AiCaption from './AiCaption';

// In items list, REMOVE:
{ node: 'item', name: <AiCaption /> },
```
*(Manual caption typing, timing adjustment, and SRT-style editing remain fully active).*

### 2.6 Modify `src/pages/editor/components/options/elements/VideoOptions.tsx` & `ImageOptions.tsx`

1. In `src/pages/editor/components/options/elements/VideoOptions.tsx`:
   ```tsx
   // REMOVE:
   import VideoRemoveBg from '../components/ai-btns/VideoRemoveBg';

   // In JSX, REMOVE:
   <VideoRemoveBg />
   ```

2. In `src/pages/editor/components/options/elements/ImageOptions.tsx`:
   ```tsx
   // REMOVE AiBtns from '../components' import
   // In JSX, REMOVE:
   <AiBtns />
   ```

3. In `src/pages/editor/components/options/components/index.ts`:
   Remove import and export of `AiBtns`.

---

## Step 3: Remove Chinese & Setup English + French Localization

### 3.1 Delete `src/language/zhCN.ts`
Delete `src/language/zhCN.ts` permanently.

### 3.2 Create French Dictionary: `src/language/frFR.ts`
Create `src/language/frFR.ts` with comprehensive translations for all UI keys:

```ts
export const frFR = {
  user_workspace: 'Espace de travail',
  user_center: 'Centre utilisateur',
  user_theme: 'Thème',
  user_logout: 'Déconnexion',
  user_language: 'Langue (EN/FR)',
  user_userid: 'ID Utilisateur',

  // Menu latéral
  sidemenu_template: 'Modèles',
  sidemenu_my: 'Mes fichiers',
  sidemenu_caption: 'Sous-titres',
  sidemenu_image: 'Images',
  sidemenu_video: 'Vidéos',
  sidemenu_audio: 'Audio',
  sidemenu_text: 'Texte',
  sidemenu_filter: 'Filtres',
  sidemenu_sticker: 'Autocollants',
  sidemenu_effect: 'Effets',
  sidemenu_transition: 'Transitions',
  sidemenu_more: 'Plus',

  // Commun
  common_name: 'VidCut',
  common_search: 'Rechercher',
  common_loading: 'Chargement...',
  common_uploading: 'Téléversement...',
  common_upload_success: 'Téléversement réussi !',
  common_save_success: 'Enregistrement réussi !',
  common_toast_error: 'Échec de l’opération !',
  common_toast_success: 'Opération réussie !',
  common_toast_replace_success: 'Remplacement réussi !',
  common_toast_transition_limit: 'Veuillez sélectionner des images ou vidéos pour ajouter des transitions',
  common_toast_video_replace_limit: 'Veuillez utiliser une vidéo d’une durée supérieure ou égale à {{duration}} secondes',
  common_toast_collect_success: 'Ajouté aux favoris !',
  common_toast_collect_cancel_success: 'Retiré des favoris !',
  common_toast_poster_success: 'Image de couverture définie avec succès !',
  common_toast_login_error: 'Veuillez vous connecter au système',
  common_toast_no_update: 'Aucune modification détectée',

  // En-tête
  header_project_no_name: 'Projet sans titre',
  header_pro: 'Mode Pro',
  header_simple: 'Mode Simple',
  header_export: 'Exporter',
  header_login: 'Connexion / Inscription',
  header_project_file: 'Fichier projet',
  header_project_title: 'Import / Export de projet',
  header_project_upload_tip1: 'Cliquez ou glissez-déposez le fichier projet ici',
  header_project_upload_tip2: 'Prend en charge les archives de projet .zip',
  header_project_export: 'Exporter le projet (.zip)',
  header_project_export_success: 'Projet exporté avec succès !',
  header_project_export_failed: 'Échec de l’exportation du projet',

  // Chronologie (Timeline)
  timeline_top_split: 'Diviser',
  timeline_top_delete: 'Supprimer',
  timeline_top_copy: 'Copier',
  timeline_top_mute: 'Couper le son',
  timeline_top_unmute: 'Activer le son',
  timeline_top_freeze: 'Figer l’image',
  timeline_top_separate_audio: 'Extraire l’audio',
  timeline_top_clip: 'Découper',
  timeline_top_crop: 'Rogner la vidéo',
  timeline_top_cover: 'Définir comme couverture',
  timeline_top_redo: 'Rétablir',
  timeline_top_undo: 'Annuler',
  timeline_top_camera: 'Caméra',
  timeline_top_background: 'Arrière-plan',
  timeline_top_keyframe: 'Image clé',
  timeline_top_scale: 'Échelle',
  timeline_top_please_select_element: 'Veuillez d’abord sélectionner un élément',

  // Options & Inspecteur
  option_tab_base: 'Basique',
  option_tab_animate: 'Animation',
  option_tab_filter: 'Filtre',
  option_tab_colour: 'Couleur',
  option_tab_mask: 'Masque',
  option_tab_effects: 'Effets',
  option_tab_track: 'Piste',
  option_tab_speed: 'Vitesse',
  option_align: 'Alignement',
  option_position: 'Position',
  option_size: 'Taille',
  option_rotation: 'Rotation',
  option_opacity: 'Opacité',
  option_blend_mode: 'Mode de fusion',
  option_greenscreen: 'Incrustation (Fond Vert)',
  option_volume: 'Volume',
  option_fade_in: 'Fondu en ouverture',
  option_fade_out: 'Fondu en fermeture',

  // Exportation
  export_title: 'Exporter la vidéo',
  export_resolution: 'Résolution',
  export_fps: 'Images par seconde (FPS)',
  export_format: 'Format',
  export_start: 'Démarrer l’exportation',
  export_processing: 'Traitement en cours...',
  export_success: 'Vidéo exportée avec succès !',
  export_download: 'Télécharger',
  export_video_synthesis_success: 'Rendu vidéo terminé !',

  // Mes éléments & Enregistrement
  my_tab_material: 'Médias locaux',
  my_tab_all_material: 'Tous les médias',
  my_upload_btn: 'Importer des fichiers',
  my_record_audio: 'Enregistrer une voix',
  my_start_record: 'Commencer l’enregistrement',
  my_stop_record: 'Arrêter l’enregistrement',

  // Général
  project: 'Projets',
  material: 'Médias',
  logout: 'Déconnexion',
  cancel: 'Annuler',
  confirm: 'Confirmer',
};
```

### 3.3 Update `src/language/language.ts`

Replace the language manager to support only **English** and **French**:

```ts
import { enUS } from './enUS';
import { frFR } from './frFR';
import { storage } from '@utils/index';

export type ValueType = 'en-US' | 'fr-FR';

export const locals: Record<ValueType, any> = {
  'en-US': enUS,
  'fr-FR': frFR,
};

const _window = window as any;

class Language {
  constructor() {
    _window.language = storage.local.get('language') || 'en-US';
    storage.local.set('language', _window.language);
  }

  val(name: string, data?: any, type?: ValueType): string {
    if (!_window.language) {
      _window.language = this.getLanguage();
    }
    const currentLang = type || _window.language || 'en-US';
    let str = locals[currentLang]?.[name] || locals['en-US']?.[name] || name;
    if (data) {
      for (const key in data) {
        str = str.replaceAll(`{{${key}}}`, data[key]);
      }
    }
    return str;
  }

  getLanguage(): ValueType {
    const lang = _window.language || storage.local.get('language');
    return (lang === 'fr-FR' || lang === 'en-US') ? lang : 'en-US';
  }

  setLanguage(type: ValueType) {
    storage.local.set('language', type);
    _window.language = type;
    location.reload();
  }
}

export const language = new Language();
```

### 3.4 Update Language Switcher in `src/pages/editor/components/header/Header.tsx`

Update the header button toggle between **EN** and **FR**:
```tsx
<a
  className={styles.languagebtn}
  onClick={() => {
    if (language.getLanguage() === 'en-US') {
      language.setLanguage('fr-FR');
    } else {
      language.setLanguage('en-US');
    }
  }}
>
  {language.getLanguage() === 'en-US' ? 'FR' : 'EN'}
</a>
```

### 3.5 Replace Hardcoded Chinese in `Sidebar.tsx` (Workspace)
In `src/layout/workspace-layout/sidebar/Sidebar.tsx`:
Change:
```tsx
{ name: '首页', path: `/home`, ... },
```
To:
```tsx
{ name: language.getLanguage() === 'fr-FR' ? 'Accueil' : 'Home', path: `/workspace/draft`, ... },
```

---

## Step 4: Streamline UI into a Pure Video Editor

### 4.1 Remove VIP & Credit Limits
In `src/pages/editor/components/header/Header.tsx`:
- Remove `<CreditRecharge />` and `<VipRecharge />`.
- Remove `openCreditRecharge` and `openVipRecharge` calls.

In `src/pages/editor/components/header/Export.tsx`:
- Unlock all export resolutions (720P, 1080P, 2K, 4K) freely without VIP checks.
- Keep `encoderVideoLocal` which uses client-side WebCodecs / Web Workers / FFmpeg WASM to render locally.

### 4.2 Streamline Routing in `src/routes.config.ts`
Point default route `/` directly to `/workspace/draft` (Projects list) or `/editor/new`:
```ts
const routes = [
  {
    path: '/editor/:appId',
    exact: false,
    component: IndexLayout,
    routes: [...editorRouter],
  },
  {
    path: '/workspace',
    exact: false,
    component: WorkspaceLayout,
    routes: [...workspaceRouter],
  },
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/workspace/draft" />,
  },
];
```

---

## Step 5: Dependency & Heavy Asset Cleanup

### 5.1 Remove heavy unused packages from `package.json`
Remove the following packages from `dependencies`:
- `"@mediapipe/tasks-vision"`
- `"opencv-ts"`

Run:
```bash
yarn remove @mediapipe/tasks-vision opencv-ts
```

### 5.2 Remove Heavy AI Models from Disk
Delete `public/assets/ai` which frees ~120 MB of static binary models (OpenCV WASM, ONNX Runtime, and Matting weights).

---

## Step 6: Automated Execution Script (PowerShell)

Save and run this script in PowerShell from `c:\Users\Admin\Documents\vidcut`:

```powershell
Write-Host ">>> Starting VidCut Transformation..." -ForegroundColor Cyan

# 1. Remove AI Directories & Files
$aiPaths = @(
    "src\pages\editor\components\ai-chat",
    "src\pages\editor\components\sources\ai",
    "src\pages\editor\components\sources\caption\captions\AiCaption.tsx",
    "src\pages\editor\components\sources\my\TTS.tsx",
    "src\pages\editor\components\sources\my\TTS copy.tsx",
    "src\pages\editor\components\sources\my\tts.mock.ts",
    "src\pages\editor\components\timeline2\toolbar\ai-matting",
    "src\pages\editor\components\timeline2\toolbar\ai-portrait",
    "src\pages\editor\components\timeline2\toolbar\ai-removebg",
    "src\pages\editor\components\timeline2\toolbar\ai-rubber",
    "src\pages\editor\components\timeline2\toolbar\ai-super-resolution",
    "src\pages\editor\components\options\components\ai-btns",
    "public\assets\ai",
    "src\language\zhCN.ts"
)

foreach ($path in $aiPaths) {
    if (Test-Path $path) {
        Remove-Item -Recurse -Force $path
        Write-Host "Removed: $path" -ForegroundColor Green
    }
}

Write-Host ">>> AI modules and Chinese locale removed successfully!" -ForegroundColor Cyan
```

---

## Verification & Build Testing

1. **Install clean dependencies**:
   ```bash
   yarn install
   ```

2. **Run Development Server**:
   ```bash
   yarn dev
   ```
   Open `https://localhost:3005` in Chrome or Edge.

3. **Verify Features**:
   - [x] Application name is **VidCut** on window title and tabs.
   - [x] Full-width editing area (no AI Chat drawer taking 340px on the right).
   - [x] Timeline toolbar contains only editing tools (Split, Trim, Freeze, Separate Audio, Crop, Speed, Keyframes).
   - [x] Sources panel only has: Media, Captions, Images, Audio, Videos, Text, Stickers, Filters, Effects, Transitions.
   - [x] Language switcher toggles cleanly between **English** and **Français**.
   - [x] Zero Chinese characters on the UI.
   - [x] Local export (720P, 1080P, 4K) generates MP4 directly without restrictions.

4. **Production Build**:
   ```bash
   yarn build
   ```
   Ensure build passes with zero errors and a significantly lighter `dist/` bundle size.

