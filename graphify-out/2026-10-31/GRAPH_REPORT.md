# Graph Report - unicut  (2026-10-31)

## Corpus Check
- Large corpus: 1090 files · ~234,185 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 2877 nodes · 6614 edges · 196 communities (110 shown, 86 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 221 edges (avg confidence: 0.85)
- Token cost: 450 input · 280 output

## Community Hubs (Navigation)
- Editor Effects & Options
- Timeline & Track Management
- Editor Effects & Options #2
- Timeline & Track Management #2
- Ffmpeg Core Module
- Core Utilities & Helpers
- Build & Configuration
- Core Utilities & Helpers #2
- Gif Worker Module
- Editor Effects & Options #3
- Editor Effects & Options #4
- Build & Configuration #2
- Core Utilities & Helpers #3
- Build & Configuration #3
- Editor Effects & Options #5
- Timeline & Track Management #3
- Index Module
- Core Utilities & Helpers #4
- Tsconfig Module
- User Profile & Account
- Service & API Layer
- User Profile & Account #2
- Audio Tracks & Processing
- Timeline & Track Management #4
- Local Storage & Persistence
- GitHub Actions CI/CD
- Editor Navigation & Header
- Local Storage & Persistence #2
- Editor State Store
- Sdk Module
- Lame Min Module
- Player Canvas & Rendering
- Media Export & Encoding
- Workspace Draft Management
- User Profile & Account #3
- Build & Configuration #4
- Webgl2D Module
- Timeline & Track Management #5
- Electron Desktop Integration
- Footer Module
- Local Storage & Persistence #3
- Local Storage & Persistence #4
- User Profile & Account #4
- Audio Tracks & Processing #2
- Local Storage & Persistence #5
- Core Utilities & Helpers #5
- Ffmpeg Core Module #2
- Lame Min Module #2
- Player Canvas & Rendering #2
- Editor Effects & Options #6
- Ffmpeg Core Module #3
- Lame Min Module #3
- Sourcelist Module
- Timeline & Track Management #6
- Audio Tracks & Processing #3
- Local Storage & Persistence #6
- Local Storage & Persistence #7
- Core Utilities & Helpers #6
- Build & Configuration #5
- Ffmpeg Module
- Ffmpeg Core Module #4
- Ffmpeg Core Module #5
- Authentication UI
- Uploaddecode Module
- User Profile & Account #5
- Ffmpeg Core Module #6
- Player Canvas & Rendering #3
- Core Utilities & Helpers #7
- Electron Desktop Integration #2
- Ffmpeg Core Module #7
- Ffmpeg Core Module #8
- Editor State Store #2
- Core Utilities & Helpers #8
- Timeline & Track Management #7
- Timeline & Track Management #8
- Build & Configuration #6
- UI Theme System
- Decode Worker Module
- Demuxer Worker Module
- Decode Worker Module #2
- Demuxer Worker Module #2
- Agreementlayout Module
- Audio Tracks & Processing #4
- Index Module #2
- Lame Min Module #4
- Mp4Box All Module #4
- Service & API Layer #2
- Index Module #3
- Decode Worker Webgl Module
- Colors Module
- Editor Effects & Options #7
- Service & API Layer #3
- User Profile & Account #6
- Build & Configuration #7
- Ffmpeg Core Module #9
- Index Module #4
- Index Min Module
- Verticalsortablelist Module
- UI Theme System #2
- Mask Module
- Lottie Module
- Core Utilities & Helpers #9
- Build & Configuration #8
- Build & Configuration #9
- Lame Min Module #5
- Mp4Box All Module #6
- Player Canvas & Rendering #4
- Editor Effects & Options #8
- Service & API Layer #4
- User Profile & Account #7
- Build & Configuration #10
- Lame Min Module #6
- Notfound Module
- Service & API Layer #5
- Core Utilities & Helpers #10
- Tsconfig Node Module
- Ffmpeg Core Module #10
- Index Module #5
- Index Module #6
- Lame Min Module #7
- Menus Module
- Caption Module
- Custom Module
- Core Utilities & Helpers #11
- Index Module #7
- Index Module #8
- Index Module #9
- Lame Min Module #8
- Editor Navigation & Header #2
- User Profile & Account #8
- Build & Configuration #11
- Build & Configuration #12
- Build & Configuration #13
- Internationalization (i18n)
- Core Utilities & Helpers #12
- Tdata2 Module
- UI Theme System #3
- Core Utilities & Helpers #13

## God Nodes (most connected - your core abstractions)
1. `react` - 169 edges
2. `@douyinfe/semi-ui` - 140 edges
3. `stores` - 130 edges
4. `mobx-react` - 126 edges
5. `language` - 120 edges
6. `video-core-sdk` - 114 edges
7. `@icon-park/react` - 87 edges
8. `Item()` - 74 edges
9. `Is()` - 64 edges
10. `Editor` - 60 edges

## Surprising Connections (you probably didn't know these)
- `abort()` --indirect_call--> `e()`  [INFERRED]
  public/assets/ffmpeg/ffmpeg-core.js → src/pages/editor/components/sources/my/recorder.js
- `F()` --indirect_call--> `o()`  [INFERRED]
  public/assets/medianinfo/index.min.js → src/utils/uploadInfo.es.js
- `D()` --indirect_call--> `le()`  [INFERRED]
  src/utils/uploadInfo.es.js → public/assets/medianinfo/index.min.js
- `ct()` --indirect_call--> `b()`  [INFERRED]
  public/assets/medianinfo/index.min.js → src/utils/uploadInfo.es.js
- `ct()` --indirect_call--> `C()`  [INFERRED]
  public/assets/medianinfo/index.min.js → src/utils/uploadInfo.es.js

## Import Cycles
- 2-file cycle: `src/pages/editor/components/options/components/element-data/FrameData.tsx -> src/pages/editor/components/options/components/index.ts -> src/pages/editor/components/options/components/element-data/FrameData.tsx`
- 4-file cycle: `src/pages/editor/SDK.tsx -> src/pages/editor/components/options/components/index.ts -> src/pages/editor/components/options/components/effects/index.ts -> src/pages/editor/components/options/components/effects/Effects.tsx -> src/pages/editor/SDK.tsx`
- 5-file cycle: `src/pages/editor/Editor.tsx -> src/pages/editor/plugins/index.ts -> src/pages/editor/plugins/qrcode/index.ts -> src/pages/editor/plugins/qrcode/Element.tsx -> src/pages/editor/SDK.tsx -> src/pages/editor/Editor.tsx`
- 5-file cycle: `src/pages/editor/Editor.tsx -> src/pages/editor/plugins/index.ts -> src/pages/editor/plugins/qrcode/index.ts -> src/pages/editor/plugins/qrcode/Options.tsx -> src/pages/editor/SDK.tsx -> src/pages/editor/Editor.tsx`
- 5-file cycle: `src/pages/editor/SDK.tsx -> src/utils/export.ts -> src/pages/editor/plugins/index.ts -> src/pages/editor/plugins/qrcode/index.ts -> src/pages/editor/plugins/qrcode/Element.tsx -> src/pages/editor/SDK.tsx`
- 5-file cycle: `src/pages/editor/SDK.tsx -> src/utils/export.ts -> src/pages/editor/plugins/index.ts -> src/pages/editor/plugins/qrcode/index.ts -> src/pages/editor/plugins/qrcode/Options.tsx -> src/pages/editor/SDK.tsx`

## Communities (196 total, 86 thin omitted)

### Community 0 - "Editor Effects & Options"
Cohesion: 0.04
Nodes (51): video-core-sdk, IProps, Align(), IProps, Flip(), GroupAlign(), IProps, GroupFast() (+43 more)

### Community 1 - "Timeline & Track Management"
Cohesion: 0.04
Nodes (40): Header(), IProps, IProps, User(), IProps, IState, LoginRegister(), config (+32 more)

### Community 2 - "Editor Effects & Options #2"
Cohesion: 0.03
Nodes (29): arSA, enUS, frFR, language, _window, IProps, BlendMode(), IProps (+21 more)

### Community 3 - "Timeline & Track Management #2"
Cohesion: 0.07
Nodes (43): classnames, @douyinfe/semi-ui, @icon-park/react, lodash, IProps, IProps, IProps, Props (+35 more)

### Community 4 - "Ffmpeg Core Module"
Cohesion: 0.04
Nodes (35): bigintToI53Checked(), doCallback(), done(), doReadv(), doWritev(), _emscripten_asm_const_int(), exec(), exitJS() (+27 more)

### Community 5 - "Core Utilities & Helpers"
Cohesion: 0.09
Nodes (61): w(), Is(), an(), ar(), b(), bn(), bt(), C() (+53 more)

### Community 6 - "Build & Configuration"
Cohesion: 0.03
Nodes (62): dependencies, apng-js@^1.1.5, axios@^0.24.0, classnames@^2.3.2, @douyinfe/semi-ui@^2.89.1, echarts@^5.5.0, gl-transitions@^1.43.0, howler@^2.2.4 (+54 more)

### Community 7 - "Core Utilities & Helpers #2"
Cohesion: 0.05
Nodes (34): a(), ae(), a(), ct(), deleteLater(), destructor(), fromWireType(), g() (+26 more)

### Community 8 - "Gif Worker Module"
Cohesion: 0.06
Nodes (22): ByteArray(), GIFEncoder(), LZWEncoder(), char_out(), cl_block(), cl_hash(), compress(), encode() (+14 more)

### Community 9 - "Editor Effects & Options #3"
Cohesion: 0.06
Nodes (5): VideoEditorSDKParams, LutFilterProps, VideoEditorSDK, Editor, sleep()

### Community 10 - "Editor Effects & Options #4"
Cohesion: 0.09
Nodes (18): FrameData(), AudioOptions(), CameraOptions(), CaptionOptions(), IProps, IProps, FilterOptions(), GroupOptions() (+10 more)

### Community 11 - "Build & Configuration #2"
Cohesion: 0.04
Nodes (47): devDependencies, @babel/plugin-proposal-class-properties@^7.18.6, @babel/plugin-proposal-decorators@^7.22.7, electron-builder@^25.1.8, husky@^8.0.1, less@^4.1.3, less-loader@^11.1.3, lint-staged@^12.4.2 (+39 more)

### Community 12 - "Core Utilities & Helpers #3"
Cohesion: 0.05
Nodes (9): da(), du(), Fs(), fu(), gu, la(), Ls(), lu() (+1 more)

### Community 13 - "Build & Configuration #3"
Cohesion: 0.05
Nodes (43): author, asset-require-hook@^1.2.0, dayjs@^1.11.10, dexie@^4.4.3, @ffmpeg/util@^0.12.1, gifuct-js@^2.1.2, pixi-color-effects@^1.0.0, pixi.js@^7.3.0 (+35 more)

### Community 14 - "Editor Effects & Options #5"
Cohesion: 0.07
Nodes (14): IProps, colors, Color(), effectImages, IProps, Filter(), IProps, GradualColor() (+6 more)

### Community 15 - "Timeline & Track Management #3"
Cohesion: 0.08
Nodes (18): mobx-react, react, Props, IProps, Props, IProps, IProps, IProps (+10 more)

### Community 16 - "Index Module"
Cohesion: 0.05
Nodes (7): RFC-2279, RFC-3629, leadingNulls(), leadingSomething(), onComplete(), registerType(), sharedRegisterType()

### Community 17 - "Core Utilities & Helpers #4"
Cohesion: 0.05
Nodes (8): Box, clearData(), cloneDeep(), dateFormatPreset, isIOSWechatBrowser(), joinURL(), mediaLazy(), timeToNum()

### Community 19 - "Tsconfig Module"
Cohesion: 0.05
Nodes (38): compilerOptions, allowJs, allowSyntheticDefaultImports, baseUrl, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, isolatedModules (+30 more)

### Community 20 - "User Profile & Account"
Cohesion: 0.09
Nodes (16): Props, AccountLogin(), IProps, CropUpload(), Sidebar(), CreateTTSParams, _window, SelectItem (+8 more)

### Community 24 - "Audio Tracks & Processing"
Cohesion: 0.12
Nodes (12): Source(), Audio(), Effect(), Filter(), Image(), IProps, Sources(), More() (+4 more)

### Community 25 - "Timeline & Track Management #4"
Cohesion: 0.11
Nodes (17): jquery, mobx, IProps, IProps, config, Element(), Props, ElementButton() (+9 more)

### Community 26 - "Local Storage & Persistence"
Cohesion: 0.13
Nodes (27): FolderGuardProps, useLocalStorage(), List(), QrcodeUpload(), Sources(), addMaterial(), base64ToBlob(), copyFileToLocal() (+19 more)

### Community 27 - "GitHub Actions CI/CD"
Cohesion: 0.07
Nodes (29): name, runs-on, steps, GH_TOKEN, GITHUB_TOKEN, jobs, build-windows, name (+21 more)

### Community 28 - "Editor Navigation & Header"
Cohesion: 0.09
Nodes (8): server, Server, Server, Server, BasicService, globalOptions, Method, Res

### Community 29 - "Local Storage & Persistence #2"
Cohesion: 0.11
Nodes (15): Content(), getItems(), IProps, UploadItem, Folders(), IProps, FolderIcon(), IconProps (+7 more)

### Community 30 - "Editor State Store"
Cohesion: 0.20
Nodes (15): APIServer, ElementOptionType, LayoutName, SourceType, Collect(), IProps, IProps, Search() (+7 more)

### Community 31 - "Sdk Module"
Cohesion: 0.10
Nodes (23): AiChatParams, AiImageParams, AiVideo2VideoParams, AiVideoParams, AppDetailRes, CollectParams, CreateAppParams, CreateTTSParams (+15 more)

### Community 32 - "Lame Min Module"
Cohesion: 0.13
Nodes (10): lamejs(), Ac(), da(), Gc(), Hc(), Ia(), rb(), sb() (+2 more)

### Community 33 - "Player Canvas & Rendering"
Cohesion: 0.12
Nodes (10): ColorBg(), IProps, DragItem(), DragItemCls, IProps, Loading(), ContextMenus(), EditorPage() (+2 more)

### Community 34 - "Media Export & Encoding"
Cohesion: 0.15
Nodes (11): plugins, config, QrcodeEl(), Params, QrcodeElement, conf, IOptionsProps, Options() (+3 more)

### Community 35 - "Workspace Draft Management"
Cohesion: 0.13
Nodes (11): react-router-dom, getInitData(), Draft(), IProps, DraftThumbImage(), IProps, MoreMenus(), routes (+3 more)

### Community 36 - "User Profile & Account #3"
Cohesion: 0.09
Nodes (9): Account(), BindEmail(), BindMobile(), BindWechat(), IProps, Item(), NickName(), Password() (+1 more)

### Community 37 - "Build & Configuration #4"
Cohesion: 0.09
Nodes (5): react-resize-detector@^9.1.0, swiper@^12.1.2, react-resize-detector, swiper, ILinksProps

### Community 39 - "Timeline & Track Management #5"
Cohesion: 0.15
Nodes (8): Separation(), useBackground(), AudioSVGWaveform, dataURLtoBlob(), parseArrayBufferResponse(), updateMaterialAttrs(), checkVideoUrlHasAudio(), getVideoFile()

### Community 40 - "Electron Desktop Integration"
Cohesion: 0.10
Nodes (19): appId, copyright, directories, buildResources, output, files, nsis, allowToChangeInstallationDirectory (+11 more)

### Community 41 - "Footer Module"
Cohesion: 0.13
Nodes (12): Footer(), IProps, AboutUs(), IProps, routes, aiFeatures, allFeatures, coreFeatures (+4 more)

### Community 42 - "Local Storage & Persistence #3"
Cohesion: 0.15
Nodes (17): CategoryRecord, FolderHandleRecord, localDB, MaterialRecord, ProjectRecord, UploadRecord, UseLocalStorageReturn, saveFileToLocal() (+9 more)

### Community 43 - "Local Storage & Persistence #4"
Cohesion: 0.21
Nodes (8): react-router-config, FolderGuard(), PageLoading(), ProgressData, HomeLayout(), IndexLayout(), UserLayout(), WorkspaceLayout()

### Community 44 - "User Profile & Account #4"
Cohesion: 0.14
Nodes (10): ContentUser(), IProps, actionMap, Credit(), creditStatusMap, formatDate(), formatTime(), sceneMap (+2 more)

### Community 45 - "Audio Tracks & Processing #2"
Cohesion: 0.18
Nodes (17): convertWavToMp3(), RecordAudioBox(), apngArr2FrameImage(), decoderVideo(), decoderVideoDrawFrameImage(), getUploadBeforeData(), gifArr2FrameImage(), imageThumb() (+9 more)

### Community 46 - "Local Storage & Persistence #5"
Cohesion: 0.15
Nodes (7): server, copyLocalProject(), createLocalProject(), deleteAllMaterialsByAppId(), deleteLocalProject(), getLocalProjectList(), updateLocalProjectMeta()

### Community 47 - "Core Utilities & Helpers #5"
Cohesion: 0.14
Nodes (14): F(), d(), i(), n(), ca(), Dr(), f(), fa() (+6 more)

### Community 48 - "Ffmpeg Core Module #2"
Cohesion: 0.16
Nodes (17): addOnInit(), addRunDependency(), asyncLoad(), createWasm(), receiveInstance(), receiveInstantiationResult(), _emscripten_get_heap_max(), emscripten_realloc_buffer() (+9 more)

### Community 49 - "Lame Min Module #2"
Cohesion: 0.18
Nodes (14): Bc(), c(), ca(), Cc(), dc(), Ec(), Fc(), Ic() (+6 more)

### Community 51 - "Player Canvas & Rendering #2"
Cohesion: 0.22
Nodes (12): Canvas(), Player(), TemplatePlayer(), addEffectItem(), addFilterItem(), addImageVideoAudioItem(), addItem(), addLottieItem() (+4 more)

### Community 52 - "Editor Effects & Options #6"
Cohesion: 0.17
Nodes (9): AnimateItem(), IProps, AnimateItem(), IProps, Animation(), IProps, eases, Animation() (+1 more)

### Community 53 - "Ffmpeg Core Module #3"
Cohesion: 0.16
Nodes (15): addDays(), arraySum(), __gmtime_js(), isLeapYear(), __localtime_js(), __mktime_js(), readI53FromI64(), _strftime() (+7 more)

### Community 54 - "Lame Min Module #3"
Cohesion: 0.15
Nodes (7): Jc(), Pb(), d(), E(), l(), m(), z()

### Community 55 - "Sourcelist Module"
Cohesion: 0.17
Nodes (6): ChildProps, IProps, IProps, WaterFall(), DanMuIcon(), IProps

### Community 56 - "Timeline & Track Management #6"
Cohesion: 0.17
Nodes (8): Props, Timeline(), IProps, Ruler(), Props, Tracks(), Props, TrackTime()

### Community 57 - "Audio Tracks & Processing #3"
Cohesion: 0.19
Nodes (3): AudioSVGWaveform, dataURLtoBlob(), parseArrayBufferResponse()

### Community 58 - "Local Storage & Persistence #6"
Cohesion: 0.14
Nodes (3): genId(), Server, getMaterialFileUrlCached()

### Community 59 - "Local Storage & Persistence #7"
Cohesion: 0.23
Nodes (15): getMaterialFile(), downloadBlob(), exportProjectZip(), ExportProjectZipOptions, ExportProjectZipResult, EXT_FOLDER_MAP, extFromMime(), getFieldValue() (+7 more)

### Community 60 - "Core Utilities & Helpers #6"
Cohesion: 0.16
Nodes (15): Ar(), be(), en(), ha(), ke(), n(), Ns(), pa() (+7 more)

### Community 61 - "Build & Configuration #5"
Cohesion: 0.13
Nodes (12): rollup-plugin-terser@^7.0.2, rollup-plugin-visualizer@^6.0.5, vite@^4.4.4, vite-plugin-imp@^2.4.0, vite-plugin-mkcert@^1.17.9, @vitejs/plugin-react@^4.0.3, rollup-plugin-terser, rollup-plugin-visualizer (+4 more)

### Community 63 - "Ffmpeg Core Module #4"
Cohesion: 0.15
Nodes (14): abort(), _dlopen(), ___dlsym(), getBinary(), getBinaryPromise(), getValue(), initRandomFill(), instantiateArrayBuffer() (+6 more)

### Community 64 - "Ffmpeg Core Module #5"
Cohesion: 0.18
Nodes (15): alignMemory(), getSocketAddress(), getSocketFromFD(), mmapAlloc(), ___syscall_accept4(), ___syscall_bind(), ___syscall_connect(), ___syscall_getpeername() (+7 more)

### Community 65 - "Authentication UI"
Cohesion: 0.21
Nodes (4): LoginEmail(), LoginMobile(), LoginQrcode, LoginRegisterBox()

### Community 66 - "Uploaddecode Module"
Cohesion: 0.26
Nodes (14): buildOutputArgs(), checkAndConvert(), ConvertOptions, ConvertResult, createFFmpeg(), destroyFFmpeg(), ensureFFmpeg(), execFFmpeg() (+6 more)

### Community 67 - "User Profile & Account #5"
Cohesion: 0.22
Nodes (7): Detail(), IProps, IProps, List(), IProps, Message(), Server

### Community 69 - "Player Canvas & Rendering #3"
Cohesion: 0.23
Nodes (8): CapturePoster(), Props, Export(), IProps, Export(), IProps, PosterCanvas, Props

### Community 70 - "Core Utilities & Helpers #7"
Cohesion: 0.21
Nodes (3): hu(), Mr, pu()

### Community 71 - "Electron Desktop Integration #2"
Cohesion: 0.15
Nodes (8): { app, BrowserWindow, shell, session, ipcMain, dialog }, fs, http, MIME_TYPES, path, { contextBridge, ipcRenderer }, electron@^33.2.1, electron

### Community 72 - "Ffmpeg Core Module #7"
Cohesion: 0.18
Nodes (13): assert(), ___assert_fail(), _getaddrinfo(), allocaddrinfo(), handleMessage(), inetNtop4(), inetNtop6(), inetPton4() (+5 more)

### Community 73 - "Ffmpeg Core Module #8"
Cohesion: 0.17
Nodes (9): _getnameinfo(), intArrayFromString(), LazyUint8Array(), lengthBytesUTF8(), stringToNewUTF8(), stringToUTF8(), stringToUTF8Array(), ___syscall_getdents64() (+1 more)

### Community 74 - "Editor State Store #2"
Cohesion: 0.17
Nodes (6): EventsName, Point, CustomShakeModal(), Props, Props, PreviewSourceParams

### Community 75 - "Core Utilities & Helpers #8"
Cohesion: 0.19
Nodes (4): EditorPage(), routes, routes, routes

### Community 76 - "Timeline & Track Management #7"
Cohesion: 0.22
Nodes (8): Clip(), ClipModal(), ClipProps, Props, ClipFrame(), dragFun(), Props, ClipVideo()

### Community 77 - "Timeline & Track Management #8"
Cohesion: 0.19
Nodes (9): ElementTransition(), IProps, transitionIcon, checkClickScrollbar(), Props, Trackbody(), TrackType(), ViewHide() (+1 more)

### Community 78 - "Build & Configuration #6"
Cohesion: 0.21
Nodes (7): fflate@^0.8.2, lottie-web@^5.12.2, fflate, lottie-web, fetchLottie(), IProps, Lottie()

### Community 79 - "UI Theme System"
Cohesion: 0.18
Nodes (8): terser@^5.24.0, terser, fs, fs, main(), { minify }, minscript(), path

### Community 80 - "Decode Worker Module"
Cohesion: 0.30
Nodes (10): debounce(), decodeClipTime(), decodeFrameByTime(), decodeFrameImage(), getFPS(), initDecodeVideo(), removeFrame(), removeFrameAll() (+2 more)

### Community 82 - "Decode Worker Module #2"
Cohesion: 0.30
Nodes (10): debounce(), decodeClipTime(), decodeFrameByTime(), decodeFrameImage(), getFPS(), initDecodeVideo(), removeFrame(), removeFrameAll() (+2 more)

### Community 84 - "Agreementlayout Module"
Cohesion: 0.26
Nodes (4): AgreementLayout(), Sidebar(), ColorBg(), IProps

### Community 86 - "Index Module #2"
Cohesion: 0.27
Nodes (3): isError(), MediaInfo, unknownToError()

### Community 87 - "Lame Min Module #4"
Cohesion: 0.27
Nodes (9): W(), a(), B(), f(), m(), n(), V(), z() (+1 more)

### Community 88 - "Mp4Box All Module #4"
Cohesion: 0.18
Nodes (3): ColorPoint(), pad(), Pixel()

### Community 89 - "Service & API Layer #2"
Cohesion: 0.24
Nodes (4): Agree(), routes, Privacy(), VipService()

### Community 90 - "Index Module #3"
Cohesion: 0.22
Nodes (10): addOnInit(), addRunDependency(), createWasm(), receiveInstance(), receiveInstantiationResult(), findWasmBinary(), getWasmImports(), locateFile() (+2 more)

### Community 91 - "Decode Worker Webgl Module"
Cohesion: 0.33
Nodes (8): debounce(), decodeClipTime(), decodeFrameByTime(), decodeFrameImage(), initDecodeVideo(), removeFrame(), removeFrameAll(), sleep()

### Community 92 - "Colors Module"
Cohesion: 0.24
Nodes (5): colors, EChart(), IProps, OptionItem(), OptionItemProps

### Community 93 - "Editor Effects & Options #7"
Cohesion: 0.33
Nodes (5): animateEmphasize, animateEnter, animateLeave, data, AnimationItem

### Community 94 - "Service & API Layer #3"
Cohesion: 0.24
Nodes (3): IProps, Product(), Server

### Community 96 - "Build & Configuration #7"
Cohesion: 0.22
Nodes (9): scripts, build, build:worker, clean, dev, dist:win, electron, lint (+1 more)

### Community 97 - "Ffmpeg Core Module #9"
Cohesion: 0.28
Nodes (9): addOnPostRun(), addOnPreRun(), callRuntimeCallbacks(), initRuntime(), postRun(), preRun(), run(), doRun() (+1 more)

### Community 98 - "Index Module #4"
Cohesion: 0.22
Nodes (8): _defineProperty(), mediaInfoFactory(), _objectSpread2(), _objectWithoutProperties(), _objectWithoutPropertiesLoose(), ownKeys(), _toPrimitive(), _toPropertyKey()

### Community 99 - "Index Min Module"
Cohesion: 0.36
Nodes (7): D(), qa(), B(), E(), f(), k(), u()

### Community 100 - "Verticalsortablelist Module"
Cohesion: 0.31
Nodes (4): SortableItem, SortableItemProps, VerticalSortableList(), VerticalSortableListProps

### Community 101 - "UI Theme System #2"
Cohesion: 0.28
Nodes (5): App(), AppProps, themeDark, themeLight, ThemeType

### Community 103 - "Mask Module"
Cohesion: 0.32
Nodes (4): calculateScaleFactor(), IProps, Mask(), mock

### Community 104 - "Lottie Module"
Cohesion: 0.43
Nodes (4): Lottie(), IProps, LottieEl(), LottieItem()

### Community 106 - "Build & Configuration #8"
Cohesion: 0.25
Nodes (7): ImportMeta, ImportMetaEnv, pixi-filters, PubSub, react-resize-detector, react-router-dom, simple-query-string

### Community 107 - "Build & Configuration #9"
Cohesion: 0.29
Nodes (5): @uiw/react-color@^2.4.0, @uiw/react-color, EyeDropperAPI, IProps, Window

### Community 108 - "Lame Min Module #5"
Cohesion: 0.33
Nodes (3): zb(), E(), V()

### Community 110 - "Player Canvas & Rendering #4"
Cohesion: 0.48
Nodes (4): getSizeFromTarget(), parseTransform(), CustomAnimationPath(), IProps

### Community 111 - "Editor Effects & Options #8"
Cohesion: 0.33
Nodes (4): CurveSpeed(), CurveSpeedItems(), Props, curveSpeedMock

### Community 113 - "User Profile & Account #7"
Cohesion: 0.33
Nodes (6): Multi-Track Timeline Specification, Video Editing Feature Specification, FFmpeg WebAssembly Core, VidCut Features & Capabilities, Quick Start Guide, VidCut Video Editor

### Community 114 - "Build & Configuration #10"
Cohesion: 0.33
Nodes (4): jszip@^3.10.1, jszip, IProps, PictureSplit()

### Community 115 - "Lame Min Module #6"
Cohesion: 0.47
Nodes (4): qb(), E(), u(), V()

### Community 118 - "Core Utilities & Helpers #10"
Cohesion: 0.53
Nodes (4): getChromeVersion(), isChromeVersionGreaterThan(), isEdgeBrowser(), isMobile()

### Community 119 - "Tsconfig Node Module"
Cohesion: 0.33
Nodes (5): compilerOptions, composite, module, moduleResolution, include

### Community 120 - "Ffmpeg Core Module #10"
Cohesion: 0.40
Nodes (5): _environ_get(), _environ_sizes_get(), getEnvStrings(), getExecutableName(), stringToAscii()

### Community 121 - "Index Module #5"
Cohesion: 0.40
Nodes (5): abort(), getBinaryPromise(), getBinarySync(), instantiateArrayBuffer(), instantiateAsync()

### Community 122 - "Index Module #6"
Cohesion: 0.40
Nodes (5): initRuntime(), postRun(), preRun(), run(), doRun()

### Community 126 - "Custom Module"
Cohesion: 0.50
Nodes (3): Custom(), Props, sides

### Community 128 - "Index Module #7"
Cohesion: 0.50
Nodes (3): compareByDay(), getFirstWeekStartDate(), getWeekBasedYear()

### Community 129 - "Index Module #8"
Cohesion: 0.67
Nodes (4): craftInvokerFunction(), createJsInvoker(), newFunc(), usesDestructorStack()

### Community 130 - "Index Module #9"
Cohesion: 0.50
Nodes (3): destructor(), getPointee(), RegisteredPointer_fromWireType()

### Community 140 - "User Profile & Account #8"
Cohesion: 0.67
Nodes (3): VidCut Architecture & Offline Strategy, Electron Desktop Integration, Local Storage & OPFS Engine

## Knowledge Gaps
- **13 isolated node(s):** `RFC-2279`, `RFC-3629`, `DARK`, `LIGHT`, `Quick Start Guide` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1110 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **86 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Timeline & Track Management #3` to `Editor Effects & Options`, `Timeline & Track Management`, `Editor Effects & Options #2`, `Timeline & Track Management #2`, `Build & Configuration`, `Editor Effects & Options #4`, `Build & Configuration #3`, `Editor Effects & Options #5`, `User Profile & Account`, `Timeline & Track Management #4`, `Local Storage & Persistence`, `Local Storage & Persistence #2`, `Editor State Store`, `Player Canvas & Rendering`, `Media Export & Encoding`, `Workspace Draft Management`, `Build & Configuration #4`, `Footer Module`, `Local Storage & Persistence #4`, `User Profile & Account #4`, `Editor Effects & Options #6`, `Sourcelist Module`, `Timeline & Track Management #6`, `Authentication UI`, `User Profile & Account #5`, `Player Canvas & Rendering #3`, `Editor State Store #2`, `Core Utilities & Helpers #8`, `Timeline & Track Management #7`, `Timeline & Track Management #8`, `Build & Configuration #6`, `Agreementlayout Module`, `Service & API Layer #2`, `Colors Module`, `Service & API Layer #3`, `Verticalsortablelist Module`, `UI Theme System #2`, `Mask Module`, `Lottie Module`, `Build & Configuration #9`, `Player Canvas & Rendering #4`, `Editor Effects & Options #8`, `Build & Configuration #10`, `Notfound Module`, `Caption Module`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **What connects `RFC-2279`, `RFC-3629`, `DARK` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Editor Effects & Options` be split into smaller, more focused modules?**
  _Cohesion score 0.042035029190992494 - nodes in this community are weakly interconnected._
- **Why does `Is()` connect `Core Utilities & Helpers` to `Core Utilities & Helpers #3`, `Core Utilities & Helpers #2`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Should `Timeline & Track Management` be split into smaller, more focused modules?**
  _Cohesion score 0.04137447405329593 - nodes in this community are weakly interconnected._
- **Why does `@douyinfe/semi-ui` connect `Timeline & Track Management #2` to `Editor Effects & Options`, `Timeline & Track Management`, `Editor Effects & Options #2`, `Build & Configuration`, `Editor Effects & Options #4`, `Build & Configuration #3`, `Editor Effects & Options #5`, `Timeline & Track Management #3`, `User Profile & Account`, `Timeline & Track Management #4`, `Local Storage & Persistence`, `Local Storage & Persistence #2`, `Editor State Store`, `Player Canvas & Rendering`, `Media Export & Encoding`, `Workspace Draft Management`, `Build & Configuration #4`, `Footer Module`, `Local Storage & Persistence #4`, `User Profile & Account #4`, `Player Canvas & Rendering #2`, `Editor Effects & Options #6`, `Sourcelist Module`, `Timeline & Track Management #6`, `Authentication UI`, `User Profile & Account #5`, `Player Canvas & Rendering #3`, `Editor State Store #2`, `Timeline & Track Management #7`, `Build & Configuration #6`, `Colors Module`, `Service & API Layer #3`, `Mask Module`, `Build & Configuration #9`, `Build & Configuration #10`, `Custom Module`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `Editor Effects & Options #2` be split into smaller, more focused modules?**
  _Cohesion score 0.0349292381812707 - nodes in this community are weakly interconnected._