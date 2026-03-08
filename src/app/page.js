import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center p-8 bg-background text-foreground">
      <main className="flex flex-col gap-8 items-center text-center max-w-md">
        <h1 className="text-3xl font-semibold tracking-[0.2em] uppercase text-[#A17356]">
          KAFUNG
        </h1>
        <p className="text-muted-foreground">coffee bar</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/menu"
            className="rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
          >
            ดูเมนู
          </Link>
          <Link
            href="/login"
            className="rounded-2xl border border-border px-6 py-3 text-sm font-medium hover:bg-muted"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </main>
    </div>
  );
}
