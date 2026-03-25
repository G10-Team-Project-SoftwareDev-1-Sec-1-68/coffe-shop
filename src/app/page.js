import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";

const SERVICES = [
  {
    image: "/menu-images/hot-espresso.png",
    title: "เมนูกาแฟอาราบิก้า",
    desc: "คัดสรรเมล็ดกาแฟ Arabica คุณภาพสูง คั่วแบบพิเศษเฉพาะร้าน กลิ่นหอมเข้มข้น รสชาติที่ไม่เหมือนใคร",
    tag: "☕ คาเฟ่",
  },
  {
    image: "/menu-images/iced-matcha.png",
    title: "ชาพรีเมียมนำเข้า",
    desc: "ชาเขียวมัทฉะจากญี่ปุ่น ชาไทยสูตรต้นตำรับ และชาผลไม้ให้เลือกหลากหลาย ดื่มได้ทั้งร้อนและเย็น",
    tag: "🍃 ชา",
  },
  {
    image: "/menu-images/pancake.png",
    title: "เบเกอรี่อบสดใหม่",
    desc: "แพนเค้ก บราวนี่ ครัวซองต์ และครอฟเฟิล อบสดทุกวัน หอมกรุ่น เข้ากันได้กับทุกเมนูเครื่องดื่ม",
    tag: "🥐 เบเกอรี่",
  },
];

const REVIEWS = [
  {
    name: "คุณปลา",
    avatar: "https://i.pravatar.cc/80?img=47",
    rating: 5,
    text: "กาแฟอร่อยมากค่ะ บรรยากาศร้านสวยงาม นั่งทำงานได้ทั้งวัน WiFi แรงด้วย ชอบมากเลยค่ะ!",
    item: "Hot Latte",
  },
  {
    name: "คุณเอิร์ธ",
    avatar: "https://i.pravatar.cc/80?img=12",
    rating: 5,
    text: "ชาไทยนมสดสูตรนี้ดีที่สุดที่เคยดื่มมาเลยครับ หวานพอดี ไม่มัน หอมกลิ่นชาแท้ๆ สั่งซ้ำทุกวัน",
    item: "Thai Tea",
  },
  {
    name: "คุณมิ้น",
    avatar: "https://i.pravatar.cc/80?img=32",
    rating: 5,
    text: "ระบบสั่งออนไลน์สะดวกมากค่ะ สั่งแล้วไปรับได้เลย ไม่ต้องรอนาน เครื่องดื่มอร่อยทุกแก้วเลย",
    item: "Iced Cocoa",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Header />

      {/* Announcement Band */}
      <div className="relative bg-primary py-3">
        <p className="text-center text-sm text-primary-foreground/90 font-medium">
          ☕ เปิดบริการทุกวัน 07:00 – 18:00 น. &nbsp;|&nbsp; สั่งออนไลน์ รับที่ร้าน สะดวก รวดเร็ว
        </p>
      </div>

      <main className="relative bg-card">
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-12 lg:px-8 lg:pt-16">

          {/* ─── Hero Section ─── */}
          <section className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:pt-8">
            <div className="flex flex-col justify-center">
              <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
                KAFUNG Coffee Bar
              </span>
              <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                ค้นพบศิลปะ
                <br />
                <span className="text-primary">แห่งกาแฟที่สมบูรณ์แบบ</span>
              </h1>
              <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg leading-relaxed">
                เราคัดสรรเมล็ดกาแฟคุณภาพสูงจากแหล่งปลูกชั้นนำทั่วโลก
                คั่วแบบพิเศษเพื่อสร้างกาแฟแก้วสมบูรณ์แบบที่คุณจะจดจำได้
                มาร่วมเดินทางในโลกแห่งรสชาติไปด้วยกัน
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
                >
                  สั่งเครื่องดื่มเลย
                  <span aria-hidden>→</span>
                </Link>
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  ดูบริการของเรา
                </a>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative h-72 w-72 sm:h-96 sm:w-96 lg:h-[420px] lg:w-[420px]">
                <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-amber-100 to-amber-50 shadow-2xl" />
                <Image
                  src="/menu-images/orange-coffee.png"
                  alt="KAFUNG Signature Coffee"
                  fill
                  className="rounded-[3rem] object-cover object-center"
                  priority
                />
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white px-4 py-3 shadow-xl border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">เปิดทุกวัน</p>
                  <p className="text-lg font-bold text-foreground">07:00 – 18:00</p>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Stats ─── */}
          <section className="mt-20 grid grid-cols-3 gap-8 border-t border-border pt-16">
            {[
              { num: "1,000+", label: "รีวิวดีเยี่ยม" },
              { num: "3,000+", label: "แก้วที่เสิร์ฟทุกเดือน" },
              { num: "20+", label: "เมนูให้เลือก" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-foreground sm:text-4xl">{s.num}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </section>

          {/* ─── Services ─── */}
          <section id="services" className="mt-24 scroll-mt-20">
            <div className="mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">บริการของเรา</span>
              <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                เมนูอร่อย บริการครบครัน
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                ไม่ว่าจะมาพักผ่อน นัดประชุม หรือทำงาน KAFUNG มีทุกอย่างพร้อมสำหรับคุณ
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((s) => (
                <div key={s.title} className="group rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-48 w-full bg-muted overflow-hidden">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-foreground shadow-sm">
                      {s.tag}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-foreground text-base">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Reviews ─── */}
          <section className="mt-24">
            <div className="mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">รีวิวจากลูกค้า</span>
              <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                ลูกค้าพูดถึงเราว่าอย่างไร?
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {REVIEWS.map((r) => (
                <div key={r.name} className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src={r.avatar} alt={r.name} className="h-12 w-12 rounded-full object-cover border-2 border-border" />
                    <div>
                      <p className="font-bold text-foreground text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground">สั่ง: {r.item}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <span key={i} className="text-amber-400 text-sm">★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">"{r.text}"</p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── CTA ─── */}
          <section className="mt-24 rounded-3xl bg-primary p-10 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl">พร้อมลิ้มรสกาแฟแก้วโปรดแล้วหรือยัง?</h2>
            <p className="mt-3 text-primary-foreground/80 max-w-md mx-auto">
              สั่งออนไลน์ผ่านระบบของเรา สะดวก รวดเร็ว รับที่ร้านได้เลยโดยไม่ต้องรอนาน
            </p>
            <Link
              href="/menu"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-primary shadow-sm transition hover:bg-white/90"
            >
              ดูเมนูและสั่งได้เลย →
            </Link>
          </section>

        </div>
      </main>
    </div>
  );
}
