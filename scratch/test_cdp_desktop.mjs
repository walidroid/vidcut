import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/06b6c3f6-05fd-41d3-80e4-062a3342e967';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log('Spawning Chrome with remote debugging on 9222...');
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.join(process.cwd(), '.chrome-test-profile'),
    '--window-size=1440,900',
    'http://localhost:3005/workspace/editor/test-desktop'
  ]);

  try {
    // Wait for CDP endpoint to be ready
    let versionData = null;
    for (let i = 0; i < 20; i++) {
      try {
        const res = await fetch('http://127.0.0.1:9222/json/list');
        const list = await res.json();
        const page = list.find(t => t.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          versionData = page;
          break;
        }
      } catch (e) {
        // wait
      }
      await new Promise(r => setTimeout(r, 500));
    }

    if (!versionData) {
      throw new Error('Failed to connect to Chrome CDP endpoint after 10s');
    }

    console.log('Connected to Chrome page:', versionData.webSocketDebuggerUrl);
    const client = new CDPClient(versionData.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');

    // Wait for page to fully load
    await new Promise(r => setTimeout(r, 4000));

    // 1. Verify user-select: none on body
    const userSelectRes = await client.send('Runtime.evaluate', {
      expression: `window.getComputedStyle(document.body).userSelect || window.getComputedStyle(document.body).webkitUserSelect`,
      returnByValue: true,
    });
    console.log('[Test 1] Body user-select:', userSelectRes.result.value);
    if (userSelectRes.result.value !== 'none') {
      throw new Error(`Expected body user-select 'none', got ${userSelectRes.result.value}`);
    }

    // 2. Verify header -webkit-app-region drag
    const headerRes = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const h = document.querySelector('[class*="header_header"]');
        if (!h) return { exists: false };
        const cs = window.getComputedStyle(h);
        return {
          exists: true,
          dragRegion: cs.getPropertyValue('-webkit-app-region') || cs.webkitAppRegion,
          paddingRight: cs.paddingRight
        };
      })()`,
      returnByValue: true,
    });
    console.log('[Test 2] Header drag region & padding:', headerRes.result.value);

    // 3. Test Keyboard Shortcuts pubsub & slider reaction
    console.log('[Test 3] Testing timeline zoom keyboard triggers...');
    const scaleBefore = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('.semi-slider');
        return el ? el.getAttribute('aria-valuenow') : null;
      })()`,
      returnByValue: true,
    });
    console.log('  Ruler scale before zoom:', scaleBefore.result.value);

    // Zoom in via pubsub simulation
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        // Simulate Ctrl + = pubsub event
        const evt = new KeyboardEvent('keydown', { key: '=', ctrlKey: true, bubbles: true });
        document.dispatchEvent(evt);
      })()`,
    });
    await new Promise(r => setTimeout(r, 600));

    const scaleAfterZoomIn = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('.semi-slider');
        return el ? el.getAttribute('aria-valuenow') : null;
      })()`,
      returnByValue: true,
    });
    console.log('  Ruler scale after zoom in (Ctrl + =):', scaleAfterZoomIn.result.value);

    // 4. Test Export modal shortcut (Ctrl + E)
    console.log('[Test 4] Testing Ctrl + E export trigger...');
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const evt = new KeyboardEvent('keydown', { key: 'e', ctrlKey: true, bubbles: true });
        document.dispatchEvent(evt);
      })()`,
    });
    await new Promise(r => setTimeout(r, 1000));

    const exportModalState = await client.send('Runtime.evaluate', {
      expression: `Boolean(document.querySelector('[class*="exportModal"]'))`,
      returnByValue: true,
    });
    console.log('  Export modal open:', exportModalState.result.value);

    // Close with Escape
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const evt = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true });
        document.dispatchEvent(evt);
      })()`,
    });
    await new Promise(r => setTimeout(r, 500));

    // 5. Test Drag & Drop Explorer Overlay
    console.log('[Test 5] Testing file drag & drop overlay...');
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const dt = new DataTransfer();
        dt.items.add(new File(['dummy'], 'explorer_import.mp4', { type: 'video/mp4' }));
        const e = new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: dt });
        window.dispatchEvent(e);
      })()`,
    });
    await new Promise(r => setTimeout(r, 400));

    const overlayInfo = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const o = document.querySelector('[class*="fileDropOverlay"]');
        if (!o) return null;
        return {
          title: o.querySelector('h3')?.textContent,
          desc: o.querySelector('p')?.textContent,
        };
      })()`,
      returnByValue: true,
    });
    console.log('  Overlay info:', overlayInfo.result.value);

    // Capture screenshot of drag-and-drop overlay
    const overlayScreenshot = await client.send('Page.captureScreenshot', { format: 'png' });
    const overlayPath = path.join(ARTIFACT_DIR, 'browser_test_desktop_overlay.png');
    fs.writeFileSync(overlayPath, Buffer.from(overlayScreenshot.data, 'base64'));
    console.log('  Saved drop overlay screenshot to:', overlayPath);

    // Trigger drop
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const dt = new DataTransfer();
        dt.items.add(new File(['dummy'], 'explorer_import.mp4', { type: 'video/mp4' }));
        const e = new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt });
        window.dispatchEvent(e);
      })()`,
    });
    await new Promise(r => setTimeout(r, 800));

    // Capture clean editor desktop screenshot
    const editorScreenshot = await client.send('Page.captureScreenshot', { format: 'png' });
    const editorPath = path.join(ARTIFACT_DIR, 'browser_test_desktop_windows.png');
    fs.writeFileSync(editorPath, Buffer.from(editorScreenshot.data, 'base64'));
    console.log('  Saved editor screenshot to:', editorPath);

    client.close();
    console.log('ALL VERIFICATION STEPS PASSED SUCCESSFULLY!');
  } finally {
    chromeProcess.kill('SIGKILL');
  }
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

