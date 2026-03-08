import Link from "next/link";
import Header from "./components/Header";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Header />

      {/* Dark brown top band (เหมือนในรูป) */}
      <div className="relative bg-primary py-4">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-sm text-primary-foreground/80">
            เปิดบริการทุกวัน 07:00 – 18:00
          </p>
        </div>
      </div>

      {/* Main content — พื้นที่สีขาว/ครีม */}
      <main className="relative bg-card">
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-12 lg:px-8 lg:pt-16">
          {/* Hero: สองคอลัมน์ */}
          <section className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:pt-8">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Discover The Art
                <br />
                <span className="text-primary">Of Perfect Coffee.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
                Experience the difference as we meticulously select and roast the
                finest beans to create a truly unforgettable cup of coffee. Join us
                on a journey of taste and awaken your senses, one sip at a time.
              </p>
              <div className="mt-10">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
                >
                  Order Now
                  <span className="text-primary-foreground" aria-hidden>→</span>
                </Link>
              </div>
            </div>

            {/* ด้านขวา: ภาพถ้วยกาแฟ (placeholder — ใส่รูปใน /public ได้) */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative">
                {/* พื้นหลังตัวอักษร coffee ซ้ำ */}
                <div
                      className="absolute inset-0 select-none overflow-hidden opacity-[0.06]"
                      aria-hidden
                    >
                      <p className="text-[8rem] font-bold leading-none text-foreground whitespace-nowrap">
                        coffee coffee coffee coffee
                      </p>
                    </div>
                <div className="relative flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80 lg:h-96 lg:w-96">
                  <div className="flex h-full w-full items-center justify-center rounded-3xl bg-linear-to-br from-muted to-muted/50 shadow-xl">
                    <span className="text-8xl sm:text-9xl" aria-hidden>☕</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* สถิติ: 1K+ Reviews, 3K+ Best Sell, 150K+ Menu */}
          <section className="mt-20 grid grid-cols-3 gap-8 border-t border-border pt-16">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground sm:text-4xl">1K+</p>
              <p className="mt-1 text-sm text-muted-foreground">Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground sm:text-4xl">3K+</p>
              <p className="mt-1 text-sm text-muted-foreground">Best Sell</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground sm:text-4xl">150+</p>
              <p className="mt-1 text-sm text-muted-foreground">Menu</p>
            </div>
          </section>

          {/* เริ่มส่วน OUR DELICIOUS SERVICES */}
          <section id="services" className="mt-24 scroll-mt-20">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-foreground sm:text-3xl">
              Our Delicious Services
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              บริการของเราพร้อมเสิร์ฟความอร่อยให้คุณทุกวัน
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-semibold text-foreground">เมนูกาแฟ</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  คัดสรรเมล็ดกาแฟคุณภาพ  roasted แบบพิเศษ
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-semibold text-foreground">สั่งออนไลน์</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  สั่งล่วงหน้า รับที่ร้าน หรือจัดส่ง
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-semibold text-foreground">พื้นที่นั่งทำงาน</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  WiFi ฟรี โต๊ะสบาย เหมาะกับการนั่งทำงาน
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
