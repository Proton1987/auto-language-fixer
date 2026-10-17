# Auto Language Fixer

พิมพ์ผิดภาษาไทย ⇄ อังกฤษ (ลืมสลับ Caps/ภาษา) แก้ได้ด้วยคีย์ลัดเดียว

เช่น พิมพ์ `l;ylfu` แล้วกดคีย์ลัด จะได้ `สวัสดี` และ `้ำสสน` จะกลับเป็น `hello`

[English summary below](#english)

## ข้อดี

- **ไทย → อังกฤษ และ อังกฤษ → ไทย** ตรวจทิศทางให้อัตโนมัติ
- **แปลงคำล่าสุด ไฮไลต์ข้อความ ทั้งบรรทัด หรือทั้งช่อง** ตามที่เลือก
- **กดซ้ำเพื่อสลับกลับได้** และ Ctrl+Z ย้อนกลับได้ตามปกติ
- ใช้ได้กับ input, textarea และช่องพิมพ์แบบ contentEditable (Gmail, Facebook, ChatGPT ฯลฯ)
- **แก้ Caps Lock ค้าง** เช่น `hELLO` → `Hello`
- ข้ามช่องรหัสผ่านเป็นค่าเริ่มต้น
- ไม่เก็บและไม่ส่งข้อมูลใดออกนอกเครื่อง

## วิธีติดตั้ง

1. กด **Code → Download ZIP** (หรือดาวน์โหลดไฟล์ zip จากหน้า Releases) แล้วแตกไฟล์
2. เปิด `chrome://extensions` แล้วเปิด **Developer mode** (มุมขวาบน)
3. กด **Load unpacked** แล้วเลือกโฟลเดอร์ที่แตกไฟล์ไว้

ใช้ได้กับ Chrome และน่าจะใช้ได้กับเบราว์เซอร์ตระกูล Chromium อื่น เช่น Edge, Brave (ยังไม่ได้ทดสอบ)

## วิธีใช้

1. คลิกในช่องข้อความแล้วพิมพ์ตามปกติ
2. กด `Ctrl+Shift+Space` (Mac: `Cmd+Shift+Space`) เพื่อแปลงคำล่าสุด
3. ไฮไลต์ข้อความก่อนกด จะแปลงเฉพาะส่วนที่ไฮไลต์
4. กด `Ctrl+Shift+Y` (Mac: `Cmd+Shift+Y`) เพื่อแปลงทั้งช่อง
5. หรือคลิกขวาในช่องข้อความ แล้วเลือก **แปลงภาษา**

คลิกไอคอน extension เพื่อเลือกโหมด (คำล่าสุด / ทั้งบรรทัด / ทั้งช่อง) เปิด-ปิดข้อความแจ้งผล ข้ามช่องรหัสผ่าน และเปลี่ยนคีย์ลัด

## ข้อจำกัด

- ใช้ไม่ได้ในหน้า New Tab, address bar, หน้า `chrome://` ทั้งหมด, Chrome Web Store และตัวดู PDF ในตัว (Chrome ไม่อนุญาตให้ extension เข้าถึง) เมื่อกดในหน้าเหล่านี้ไอคอนจะขึ้นป้าย "!"
- เว็บที่วาดข้อความเองบน canvas เช่น Google Docs ใช้ไม่ได้
- iframe ต่างโดเมนบางตัวอาจใช้ไม่ได้
- รองรับผังแป้นพิมพ์ไทยแบบเกษมณี (Kedmanee) เท่านั้น
- การแปลงหลายบรรทัดในช่องแบบ contentEditable อาจทำให้ตัวหนาหรือลิงก์ในข้อความหาย

## สิทธิ์ที่ใช้ (Permissions)

| สิทธิ์ | ใช้ทำอะไร |
|---|---|
| `activeTab`, `scripting` | ฝังสคริปต์แปลงข้อความในแท็บปัจจุบัน เฉพาะตอนกดคีย์ลัดหรือเมนูคลิกขวา |
| `contextMenus` | เมนูคลิกขวา "แปลงภาษา" |
| `storage` | จำค่าตั้งค่าของคุณ (โหมด ข้อความแจ้งผล ข้ามช่องรหัสผ่าน) |

## ความเป็นส่วนตัว

Extension นี้ไม่เก็บ ไม่ส่ง และไม่แชร์ข้อความที่คุณพิมพ์ การแปลงทำในเครื่องทั้งหมด และเก็บเฉพาะค่าตั้งค่าไว้ใน `chrome.storage.sync`

## โครงสร้างไฟล์

- `manifest.json` ตั้งค่า extension (Manifest V3)
- `background.js` รับคีย์ลัดและเมนูคลิกขวา
- `content.js` ตรรกะแปลงข้อความ
- `popup.html`, `popup.js` หน้าตั้งค่า
- `icons/` ไอคอน (`icon.svg` เป็นไฟล์ต้นฉบับ)

## ไลเซนส์

[MIT](LICENSE)

---

## English

Fix text typed with the wrong keyboard layout (Thai ⇄ English) with one shortcut. Typed `l;ylfu` instead of `สวัสดี`? Press the shortcut.

- Both directions, detected automatically (Thai Kedmanee layout)
- Converts the selection, or the last word / line / whole field (configurable)
- Press again to toggle back; Ctrl+Z works
- Works in inputs, textareas and contentEditable editors (Gmail, Facebook, ChatGPT, ...)
- Fixes stuck Caps Lock (`hELLO` → `Hello`)
- No data collected or sent anywhere

**Install:** download the ZIP and unzip → open `chrome://extensions` → enable Developer mode → Load unpacked → pick the folder.

**Shortcuts:** `Ctrl+Shift+Space` (convert), `Ctrl+Shift+Y` (whole field). Change them from the extension popup.

**Limits:** does not work on the New Tab page, the address bar, `chrome://` pages, the Chrome Web Store, or canvas-based editors such as Google Docs.

License: MIT