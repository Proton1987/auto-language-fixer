const MENU_ID = 'fix-language';

async function runFix(tabId, forceMode) {
  if (tabId == null) return;
  try {
    // Hand the one-off mode (or null) to content.js before it runs.
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: true },
      func: (m) => { globalThis.__alfForce = m; },
      args: [forceMode || null]
    });
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: true },
      files: ['content.js']
    });
  } catch (err) {
    // Restricted pages (chrome://, Web Store, ...) cannot be scripted.
    console.warn('Auto Language Fixer: cannot run on this page.', err);
    flagUnsupported(tabId);
  }
}

// Show a short red "!" on the toolbar icon when the page can't be scripted.
function flagUnsupported(tabId) {
  chrome.action.setBadgeBackgroundColor({ tabId, color: '#D93025' });
  chrome.action.setBadgeText({ tabId, text: '!' });
  setTimeout(() => chrome.action.setBadgeText({ tabId, text: '' }), 2500);
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: 'แปลงภาษา (ไทย ⇄ อังกฤษ)',
      contexts: ['editable']
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === MENU_ID) runFix(tab && tab.id);
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command !== 'fix-language' && command !== 'fix-language-all') return;
  let tabId = tab && tab.id;
  if (tabId == null) {
    const [active] = await chrome.tabs.query({ active: true, currentWindow: true });
    tabId = active && active.id;
  }
  runFix(tabId, command === 'fix-language-all' ? 'all' : null);
});