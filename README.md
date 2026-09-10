# WH Daily Dashboard

เว็บแอปพลิเคชัน "WH Daily Dashboard" สำหรับคลังสินค้า เขียนด้วย **React + TypeScript + Vite + Tailwind CSS**
มี 2 หน้าหลัก:

1. **หน้ากรอกข้อมูล** (`กรอกข้อมูล`) — ฟอร์มกรอกข้อมูลประจำวัน: Manpower, Production Transfer, Yesterday
   Performance, OT Summary, Today's Plan และ Focus Today
2. **หน้า Dashboard** — สรุปข้อมูลทั้งหมดในรูปแบบบอร์ดสรุปผล พร้อม Executive Summary (KPI)

ข้อมูลจะถูกบันทึกไว้ใน `localStorage` ของเบราว์เซอร์ (แยกตามวันที่) จึงไม่ต้องมีฐานข้อมูลฝั่งเซิร์ฟเวอร์
เปิดแอปแล้วใช้งานได้ทันที ข้อมูลจะอยู่ครบเมื่อเปิดใหม่ในเบราว์เซอร์เครื่องเดิม

## วิธีติดตั้งและรันโปรเจกต์

ต้องมี [Node.js](https://nodejs.org/) เวอร์ชัน 18 ขึ้นไป

```bash
npm install
npm run dev
```

เปิดเบราว์เซอร์ไปที่ลิงก์ที่ Vite แสดง (ปกติคือ `http://localhost:5173`)

### สร้างไฟล์สำหรับ deploy จริง

```bash
npm run build
```

ไฟล์ที่ build เสร็จจะอยู่ในโฟลเดอร์ `dist/` สามารถอัปโหลดขึ้น static hosting ใดก็ได้ เช่น Vercel, Netlify,
GitHub Pages หรือเซิร์ฟเวอร์ของบริษัท

## โครงสร้างโปรเจกต์

```
src/
  lib/
    types.ts        โครงสร้างข้อมูล (TypeScript types) ของรายการประจำวัน
    storage.ts       จัดการบันทึก/โหลดข้อมูลจาก localStorage + ข้อมูลตัวอย่างเริ่มต้น
  components/
    Panel.tsx         กล่องเนื้อหาแบบมีหัวข้อสี (ใช้ซ้ำทั่วทั้งแอป)
    Fields.tsx         input พื้นฐานของฟอร์ม (ตัวเลข/ข้อความ/ปุ่มเพิ่ม-ลบแถว)
    Icons.tsx          ไอคอน SVG ที่ใช้ในแอป
    Dashboard.tsx      หน้าสรุปผล (Dashboard)
    EntryForm.tsx      หน้ากรอกข้อมูล
  App.tsx              โครงหลัก, แถบเมนูด้านบน, สลับวันที่/มุมมอง
```

## การใช้งาน

- กด **"บันทึกวันนี้"** มุมขวาบนเพื่อสร้างรายการของวันที่ปัจจุบัน (หรือเลือกวันที่จาก dropdown เพื่อแก้ไข
  ย้อนหลัง)
- กรอกข้อมูลในแต่ละหมวด แล้วกด **"บันทึกข้อมูลวันนี้"** ด้านล่าง ระบบจะพาไปหน้า Dashboard ให้อัตโนมัติ
- ในหน้า Dashboard เลือกดูข้อมูลของวันอื่นได้จาก dropdown วันที่บน header
- ปุ่ม **"ลบ"** ใช้ลบข้อมูลของวันที่ที่กำลังดูอยู่ (ต้องยืนยันก่อนลบ)

### Export เป็นรูปภาพ .jpg

- ในหน้า Dashboard กดปุ่ม **"Export JPG"** (สีเหลืองอำพัน มุมขวาบน) เพื่อบันทึกบอร์ดสรุปทั้งหมดเป็นไฟล์
  รูปภาพ `.jpg` ความละเอียดสูง (render ที่ scale 2x — คมชัดระดับจอ Retina) ไม่แตก เหมาะสำหรับส่งเข้า
  กลุ่มไลน์หรือพิมพ์ติดบอร์ด
- ไฟล์จะถูกตั้งชื่ออัตโนมัติตามวันที่ เช่น `WH-Daily-Dashboard-23-7-2569.jpg`
- ปุ่มนี้ใช้ไลบรารี [`html2canvas`](https://html2canvas.hertzen.com/) ซึ่งอ่านตำแหน่ง/ขนาดจาก DOM ที่
  render อยู่บนจอจริงโดยตรง (ไม่ได้ re-layout ข้อความใหม่แบบ SVG foreignObject) จึงได้ตำแหน่งข้อความและ
  การตัดบรรทัดตรงกับที่เห็นบนหน้าจอเป๊ะๆ ไม่มีปัญหาข้อความเคลื่อน/ทับกัน/ถูกตัด `...` ที่เคยเกิดกับไลบรารี
  ตัวเก่า (`html-to-image`)
- แปลงเฉพาะส่วนบอร์ด Dashboard (ไม่รวมแถบเมนู/ปุ่มต่างๆ) เป็นรูปภาพ ทำงานฝั่งเบราว์เซอร์ล้วน ไม่ต้องส่ง
  ข้อมูลขึ้นเซิร์ฟเวอร์

## หมายเหตุ

- แอปนี้เก็บข้อมูลไว้ในเบราว์เซอร์ของผู้ใช้แต่ละเครื่อง (`localStorage`) หากต้องการให้หลายคนเห็นข้อมูล
  ชุดเดียวกันแบบเรียลไทม์ จะต้องเพิ่มระบบฐานข้อมูล/Backend API ภายหลัง (โครงสร้างโค้ดใน `lib/storage.ts`
  ถูกแยกไว้ให้สลับไปเรียก API ได้ง่าย)

---

## วิธีเอาโปรเจกต์ขึ้น GitHub และ Deploy ให้ใช้งานได้จริง (แบบละเอียด — เริ่มนับหนึ่งใหม่)

วิธีนี้ใช้แพ็กเกจ `gh-pages` สั่ง deploy ตรงจากเครื่องของคุณ ไม่ต้องพึ่ง GitHub Actions และไม่มีปัญหา
โฟลเดอร์ที่ขึ้นต้นด้วยจุด (`.github`) หายตอนแตกไฟล์ zip อีกต่อไป

### ขั้นตอนที่ 0 — ล้างของเก่าทิ้งให้สะอาด

**ฝั่ง GitHub (ถ้าเคยสร้าง repo ไว้แล้วและอยากเริ่มใหม่):**
1. ไปที่ repo เดิม → **Settings** → เลื่อนลงล่างสุดจนเจอโซน **"Danger Zone"**
2. กด **Delete this repository** → พิมพ์ชื่อ repo ยืนยันตามที่ระบบขอ

**ฝั่งเครื่องตัวเอง:**
1. ลบโฟลเดอร์โปรเจกต์เดิมทิ้งทั้งหมด (หรือลบเฉพาะโฟลเดอร์ `.git` ที่ซ่อนอยู่ข้างในก็พอ ถ้าอยากเก็บโค้ดไว้)
2. แนะนำให้เริ่มจากโฟลเดอร์โปรเจกต์ที่แตก zip ใหม่ (ไฟล์ล่าสุดที่แนบมาด้านล่างนี้) เพื่อให้ชัวร์ว่าไฟล์ครบ

### ขั้นตอนที่ 1 — ติดตั้ง dependencies และลอง build ในเครื่องก่อน

```bash
cd path/to/wh-dashboard
npm install
npm run build
```

ถ้า build ผ่านโดยไม่มี error แดง จะเห็นโฟลเดอร์ `dist/` เกิดขึ้นใหม่ (ถ้ามี `dist/` เดิมค้างอยู่จากที่คุณ
build ไปแล้ว ไม่เป็นไร คำสั่งนี้จะ build ทับให้เป็นเวอร์ชันล่าสุดเอง)

### ขั้นตอนที่ 2 — สร้าง Repository ใหม่บน GitHub

1. ไปที่ [github.com/new](https://github.com/new)
2. ตั้งชื่อ repository เช่น `wh-daily-dashboard`
3. เลือก **Public**
4. **อย่าติ๊ก** ตัวเลือกใดๆ เช่น "Add a README file", ".gitignore", "license" (ปล่อยว่างไว้ทั้งหมด)
5. กด **Create repository** แล้วเก็บลิงก์ repo ไว้ เช่น
   `https://github.com/<username>/wh-daily-dashboard.git`

### ขั้นตอนที่ 3 — Push ซอร์สโค้ดขึ้น branch `main`

รันในโฟลเดอร์โปรเจกต์ (แทนที่ `<username>` เป็นชื่อบัญชีของคุณ):

```bash
git init
git add .
git commit -m "Initial commit: WH Daily Dashboard"
git branch -M main
git remote add origin https://github.com/<username>/wh-daily-dashboard.git
git push -u origin main
```

ตรวจสอบที่แท็บ **Code** บน GitHub ว่ามีไฟล์ `package.json`, `src/`, `vite.config.ts` ครบ (ไม่ต้องมี
`dist/` ตรงนี้ เพราะ `.gitignore` กันไว้อยู่แล้ว ปกติมาก)

### ขั้นตอนที่ 4 — Deploy ด้วยคำสั่งเดียว

```bash
npm run deploy
```

คำสั่งนี้จะ (1) สั่ง build โปรเจกต์ให้อัตโนมัติ แล้ว (2) เอาผลลัพธ์ในโฟลเดอร์ `dist/` ไป push ขึ้น branch
ใหม่ชื่อ `gh-pages` บน GitHub ให้เองทั้งหมด — รอจนคำสั่งรันเสร็จ (จะขึ้นข้อความ `Published`)

> ถ้าเจอ error ให้ล็อกอิน ระบบจะเปิดหน้าต่างให้ยืนยันตัวตนผ่านเบราว์เซอร์ หรือถ้าขึ้น prompt ใน terminal
> ให้ใช้ **Personal Access Token** แทนรหัสผ่าน (สร้างได้ที่ GitHub → Settings → Developer settings →
> Personal access tokens → Generate new token → เลือกสิทธิ์ `repo`)

### ขั้นตอนที่ 5 — เปิดใช้งาน GitHub Pages ให้ชี้ไปที่ branch `gh-pages`

1. ไปที่ repo บน GitHub → **Settings → Pages**
2. หัวข้อ **Build and deployment** → **Source** เลือก **"Deploy from a branch"**
3. **Branch** เลือก **`gh-pages`** และโฟลเดอร์เป็น **`/ (root)`**
4. กด **Save**

### ขั้นตอนที่ 6 — เช็คผลลัพธ์

1. รอประมาณ 1-2 นาที
2. กลับมาที่หน้า **Settings → Pages** จะเห็นข้อความ "Your site is live at ..." พร้อมลิงก์รูปแบบ:

   ```
   https://<username>.github.io/wh-daily-dashboard/
   ```

3. เปิดลิงก์นี้ในเบราว์เซอร์ — ควรเห็นหน้าแดชบอร์ดขึ้นตามปกติ

### ขั้นตอนที่ 7 — เวลาแก้โค้ดแล้วอยากอัปเดตเว็บในอนาคต

```bash
git add .
git commit -m "อธิบายสิ่งที่แก้ไข"
git push
npm run deploy
```

`git push` ไว้เก็บซอร์สโค้ดล่าสุดใน branch `main`, ส่วน `npm run deploy` คือคำสั่งที่ทำให้เว็บที่ใช้งานจริง
อัปเดตตาม (ต้องรันทุกครั้งที่แก้ไขแล้วอยากให้เว็บเปลี่ยนตาม)

### ทางเลือกอื่นในการ Deploy (ถ้าไม่อยากยุ่งกับ GitHub Pages เลย)

โปรเจกต์นี้เป็น static site ธรรมดา จึงนำไป deploy กับผู้ให้บริการอื่นได้ง่ายกว่าอีก โดยเชื่อมต่อ
repository เดียวกันนี้ (ไม่ต้องรัน `npm run deploy` เอง เพราะแพลตฟอร์มเหล่านี้ build ให้อัตโนมัติทุกครั้งที่
push):

- **Vercel** — เข้า [vercel.com](https://vercel.com) → "Add New Project" → เลือก repo จาก GitHub →
  ระบบตรวจพบว่าเป็นโปรเจกต์ Vite ให้อัตโนมัติ → กด Deploy
- **Netlify** — เข้า [netlify.com](https://netlify.com) → "Add new site" → "Import an existing project" →
  เลือก repo → Build command: `npm run build`, Publish directory: `dist` → Deploy

### แก้ปัญหาที่พบบ่อย

| อาการ | สาเหตุ/วิธีแก้ |
| --- | --- |
| หน้าเว็บขึ้นว่างเปล่า หรือ error ใน Console เรื่อง MIME type | เช็คว่า `vite.config.ts` มี `base: "./"` อยู่ (มีอยู่แล้วในโปรเจกต์นี้) แล้วรัน `npm run deploy` ใหม่ |
| `npm run deploy` ขึ้น error `gh-pages: command not found` | รัน `npm install` อีกครั้งก่อน (แพ็กเกจ `gh-pages` ต้องถูกติดตั้งก่อนใช้คำสั่งนี้) |
| ไม่เห็น branch `gh-pages` ให้เลือกในหน้า Settings → Pages | ต้องรัน `npm run deploy` ให้สำเร็จอย่างน้อย 1 ครั้งก่อน branch นี้ถึงจะถูกสร้างขึ้น |
| Push/Deploy แล้วขอ username/password ซ้ำๆ | ให้ตั้งค่า Personal Access Token หรือใช้ SSH key แทน HTTPS |
| แก้โค้ดแล้วเว็บไม่เปลี่ยน | ลืมรัน `npm run deploy` หลังแก้โค้ด (ต่างจาก `git push` ซึ่งแค่เก็บโค้ด ไม่ได้อัปเดตเว็บที่ใช้งานจริง) |
