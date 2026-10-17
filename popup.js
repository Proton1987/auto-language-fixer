const DEFAULTS = { mode: 'word', notify: true, skipPassword: true };

document.addEventListener('DOMContentLoaded', async () => {
  const cfg = await chrome.storage.sync.get(DEFAULTS);

  document.querySelectorAll('input[name="mode"]').forEach((r) => {
    r.checked = r.value === cfg.mode;
    r.addEventListener('change', () => chrome.storage.sync.set({ mode: r.value }));
  });

  const notify = document.getElementById('notify');
  notify.checked = cfg.notify;
  notify.addEventListener('change', () => chrome.storage.sync.set({ notify: notify.checked }));

  const skip = document.getElementById('skipPassword');
  skip.checked = cfg.skipPassword;
  skip.addEventListener('change', () => chrome.storage.sync.set({ skipPassword: skip.checked }));

  const cmds = await chrome.commands.getAll();
  const show = (name, id) => {
    const c = cmds.find((x) => x.name === name);
    document.getElementById(id).textContent = c && c.shortcut ? c.shortcut : 'ยังไม่ตั้ง';
  };
  show('fix-language', 'shortcut');
  show('fix-language-all', 'shortcutAll');

  document.getElementById('change').addEventListener('click', () => {
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  });
});