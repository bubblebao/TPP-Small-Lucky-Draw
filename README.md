# The Pavilions Phuket - Small Lucky Draw 2026 🎲✨

เว็บแอปพลิเคชันสำหรับกิจกรรมจับสลากของขวัญพนักงาน **Small Lucky Draw** ณ ห้องประชุม Board Room โรงแรม **The Pavilions Phuket**
พัฒนาโดยใช้ **Vite + React (TypeScript) + Tailwind CSS** ออกแบบตามอัตลักษณ์ CI ของโรงแรม พร้อมระบบความปลอดภัยและความโปร่งใสระดับสูง 100% Client-Side ไม่ต้องพึ่งพา Server

---

## 🎨 Brand Identity & Styling
- **Deep Pine Slate**: `#44595B` (ความหรูหรา สง่างาม สุขุม)
- **Ocean Slate Blue**: `#698A9A` (ความผ่อนคลาย พรีเมียม)
- **Luxury Gold**: `#D4AF37` / `#F3E5AB` (เทศกาลแห่งการเฉลิมฉลอง)
- **Typography**: Prompt (ภาษาไทย) & Montserrat (ภาษาอังกฤษ)

---

## 🌟 ฟีเจอร์หลัก (Key Features)

1. **โถสุ่มเลข 1–205 (Pool Numbers)**:
   - เริ่มต้นมีตัวเลขครบ 1 ถึง 205 รายการ
   - เมื่อสุ่มได้เลขใดแล้ว จะถูกตัดออกจากโถสุ่มทันที การันตีไม่มีการออกซ้ำ
2. **ระบบสุ่มโปร่งใสระดับฮาร์ดแวร์ (CSPRNG Verified Fair Draw)**:
   - ใช้ `window.crypto.getRandomValues()` ซึ่งเป็น Cryptographic Entropy ระดับระบบปฏิบัติการ
   - ไม่สามารถคาดเดาหรือเขียนสคริปต์ล็อคผลล่วงหน้าได้ พร้อมบันทึก Hash ตรวจสอบย้อนหลังได้ทุกครั้ง
3. **อนิเมชันลุ้นระทึก (Suspense Slot Reel & Web Audio API)**:
   - สับเปลี่ยนตัวเลขรัวเร็ว แล้วค่อยๆ ชะลอความเร็ว (Deceleration) ลุ้นทีละจังหวะ
   - เสียงสังเคราะห์ Web Audio API (ไม่ต้องโหลดไฟล์ภายนอก เล่นได้ 0ms ไม่มีสะดุด)
   - พลุกระดาษ Confetti ฉลองชัยชนะเมื่อออกรางวัล
4. **ปุ่มย้อนกลับ (Undo)**:
   - สามารถกดย้อนกลับดึงเลขล่าสุดคืนเข้าโถได้ทันทีในคลิกเดียว หากเกิดการกดพลาดหน้างาน
5. **ผังจัดการเลขรายตัว (Number Matrix Grid Modal 1-205)**:
   - แสดงสถานะของเลขทั้งหมด 205 หมายเลข
   - กรรมการสามารถคลิกที่เลขใดๆ เพื่อ "ดึงคืนเข้าโถ" หรือ "กำหนดว่าออกแล้ว" ได้อย่างอิสระ
6. **ระบบบันทึกออฟไลน์ (LocalStorage Persistence)**:
   - ข้อมูลบันทึกอัตโนมัติทุกครั้งที่มีการจับรางวัล แม้ไฟดับ รีเฟรชหน้าจอ (F5) หรืออินเทอร์เน็ตหลุด ข้อมูลก็ไม่สูญหาย
7. **ส่งออกข้อมูล (Export CSV & Print Report)**:
   - ดาวน์โหลดประวัติผลการจับรางวัลเป็นไฟล์ Excel (CSV)
   - สั่งพิมพ์ (Print) หน้าสรุปผลเพื่อใช้เป็นเอกสารให้ฝ่ายบุคคล (HR) และคณะกรรมการลงนามเป็นหลักฐาน
8. **โหมดนำเสนอบนจอใหญ่ (Fullscreen Presentation Mode)**:
   - ปุ่มขยายเต็มจอ รองรับการขึ้นจอ Projector หรือ TV ใน Board Room อย่างสวยงาม

---

## 🚀 วิธีการรันในเครื่อง (Local Development)

```bash
# ติดตั้ง dependencies
npm install

# รัน Development Server
npm run dev
```

เปิดบราวเซอร์ที่: `http://localhost:5173`

---

## 🌐 วิธีการ Deploy ขึ้น Netlify (2 วิธีง่ายๆ)

### วิธีที่ 1: ลากและวางโฟลเดอร์ `dist` (Netlify Drop - เร็วที่สุด 10 วินาที)
1. รันคำสั่ง `npm run build` จะได้โฟลเดอร์ `dist`
2. ไปที่ [app.netlify.com/drop](https://app.netlify.com/drop)
3. ลากโฟลเดอร์ `dist` ไปวางในช่องสีฟ้าบนหน้าเว็บ Netlify
4. ใช้งานเว็บ Lucky Draw ได้ทันทีฟรีตลอดชีพ พร้อมรับ URL เช่น `https://pavilions-luckydraw.netlify.app`

### วิธีที่ 2: เชื่อมต่อผ่าน Git (GitHub / GitLab)
1. Push โค้ดทั้งหมดขึ้น GitHub
2. เข้าสู่ระบบ Netlify แล้วเลือก **"Add new site" -> "Import an existing project"**
3. เลือก Repository
4. Netlify จะตรวจพบการตั้งค่าในไฟล์ `netlify.toml` โดยอัตโนมัติ:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. กด **Deploy Site**
