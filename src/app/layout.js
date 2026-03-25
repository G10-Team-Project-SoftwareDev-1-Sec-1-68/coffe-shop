import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 🟢 1. Import Header เข้ามาใช้งาน
import Header from "./components/Header";; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "KAFUNG Coffee Bar",
  description: "ร้านกาแฟ KAFUNG coffee bar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#FDF8F1]`}
      >
        {/* 🟢 2. วาง Header ไว้ตรงนี้ เพื่อให้ปรากฏในทุกหน้าของเว็บไซต์ */}
        <Header />

        {/* 🟢 3. ใส่ Padding Top (pt-24) เพื่อไม่ให้เนื้อหาในแต่ละหน้าโดน Header บัง */}
        <div className="pt-24">
          {children}
        </div>
      </body>
    </html>
  );
}