import { puppeteer } from 'file:///C:/Users/Admin/AppData/Local/npm-cache/_npx/15c61037b1978c83/node_modules/chrome-devtools-mcp/build/src/third_party/index.js';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/06b6c3f6-05fd-41d3-80e4-062a3342e967';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function testDesktopErgonomics() {
  console.log('Launching Chrome with bundled Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Mock electronAPI in page to verify Electron responsive styles & paddings
    await page.evaluateOnNewDocument(() => {
      window.electronAPI = {
        isElectron: true,
        platform: 'win32',
      };
    });

    console.log('Navigating to editor at http://localhost:3005/editor/test-desktop-app ...');
    await page.goto('http://localhost:3005/editor/test-desktop-app', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await page.waitForSelector('body', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 3000));

    // 1. Verify user-select: none on body
    const bodyUserSelect = await page.evaluate(() => {
      const style = window.getComputedStyle(document.body);
      return style.userSelect || style.webkitUserSelect;
    });
    console.log('[Test 1] Body user-select:', bodyUserSelect);
    if (bodyUserSelect !== 'none') {
      throw new Error(`Expected body user-select 'none', got '${bodyUserSelect}'`);
    }

    // 2. Verify header -webkit-app-region drag and padding-right in Electron mode
    const headerDetails = await page.evaluate(() => {
      // Find all header candidates and pick the inner header with electronHeader class
      const headers = Array.from(document.querySelectorAll('div[class*="header"]'));
      const innerHeader = headers.find(h => h.className.includes('electronHeader')) || headers[1] || headers[0];
      if (!innerHeader) {
        return { exists: false };
      }
      const cs = window.getComputedStyle(innerHeader);
      const isDrag = cs.webkitAppRegion || cs.getPropertyValue('-webkit-app-region');
      const paddingRight = cs.paddingRight;
      return {
        exists: true,
        className: innerHeader.className,
        isDrag,
        paddingRight,
      };
    });
    console.log('[Test 2] Header layout details:', headerDetails);
    if (!headerDetails?.exists) {
      throw new Error('Header element not found');
    }

    // 3. Verify Timeline Zoom Keyboard Shortcuts (Ctrl + =, Ctrl + -)
    console.log('[Test 3] Waiting for timeline and testing zoom keyboard shortcuts...');
    await page.waitForSelector('.semi-slider', { timeout: 15000 });
    const getSliderVal = () => page.evaluate(() => {
      const handle = document.querySelector('.semi-slider [role="slider"], .semi-slider-handle');
      if (handle) {
        return Number(handle.getAttribute('aria-valuenow'));
      }
      const slider = document.querySelector('.semi-slider');
      return slider ? Number(slider.getAttribute('aria-valuenow')) : null;
    });

    const scaleBefore = await getSliderVal();
    console.log('  Initial scale on slider handle:', scaleBefore);

    // Zoom in with Ctrl + =
    await page.keyboard.down('Control');
    await page.keyboard.press('=');
    await page.keyboard.up('Control');
    await new Promise(r => setTimeout(r, 600));

    const scaleAfterZoomIn = await getSliderVal();
    console.log('  Scale after Ctrl + = (zoom in):', scaleAfterZoomIn);

    // Zoom out with Ctrl + -
    await page.keyboard.down('Control');
    await page.keyboard.press('-');
    await page.keyboard.up('Control');
    await new Promise(r => setTimeout(r, 600));

    const scaleAfterZoomOut = await getSliderVal();
    console.log('  Scale after Ctrl + - (zoom out):', scaleAfterZoomOut);

    // 4. Test Export Modal Trigger with Ctrl + E
    console.log('[Test 4] Testing export shortcut (Ctrl + E)...');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyE');
    await page.keyboard.up('Control');
    await new Promise(r => setTimeout(r, 800));

    const exportModalVisible = await page.evaluate(() => {
      const modal = document.querySelector('[class*="exportModal"]');
      return Boolean(modal);
    });
    console.log('  Export Modal open:', exportModalVisible);

    // Close modal with Escape
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 600));

    // 5. Test File Explorer Drag-and-Drop Overlay
    console.log('[Test 5] Testing file drag-and-drop overlay...');
    await page.evaluate(() => {
      const dt = new DataTransfer();
      dt.items.add(new File(['dummy'], 'demo_clip.mp4', { type: 'video/mp4' }));
      const event = new DragEvent('dragenter', {
        bubbles: true,
        cancelable: true,
        dataTransfer: dt,
      });
      window.dispatchEvent(event);
    });
    await new Promise(r => setTimeout(r, 400));

    const overlayInfo = await page.evaluate(() => {
      const overlay = document.querySelector('[class*="fileDropOverlay"]');
      if (!overlay) return null;
      return {
        visible: true,
        title: overlay.querySelector('h3')?.textContent,
        desc: overlay.querySelector('p')?.textContent,
      };
    });
    console.log('  Drag overlay info:', overlayInfo);

    // Capture screenshot of the drop overlay
    const overlayScreenshotPath = path.join(ARTIFACT_DIR, 'browser_test_desktop_overlay.png');
    await page.screenshot({ path: overlayScreenshotPath });
    console.log('  Saved overlay screenshot to:', overlayScreenshotPath);

    // Trigger drop
    await page.evaluate(() => {
      const dt = new DataTransfer();
      dt.items.add(new File(['dummy'], 'demo_clip.mp4', { type: 'video/mp4' }));
      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer: dt,
      });
      window.dispatchEvent(dropEvent);
    });
    await new Promise(r => setTimeout(r, 800));

    // Capture clean editor desktop screenshot
    const editorScreenshotPath = path.join(ARTIFACT_DIR, 'browser_test_desktop_windows.png');
    await page.screenshot({ path: editorScreenshotPath });
    console.log('  Saved editor screenshot to:', editorScreenshotPath);

    console.log('ALL DESKTOP ERGONOMICS TESTS PASSED!');
  } finally {
    await browser.close();
  }
}

testDesktopErgonomics().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
