import Header from "../components/Header";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-card shadow-lg border border-border px-8 py-10 space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            เข้าสู่ระบบ
          </h1>
          <p className="text-sm text-muted-foreground">
            ยินดีต้อนรับกลับมา เลือกวิธีการเข้าสู่ระบบของคุณ
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            เข้าสู่ระบบ
          </button>
        </form>

          <p className="text-center text-xs text-muted-foreground">
            ยังไม่มีบัญชี?{" "}
            <span className="font-medium text-foreground">สมัครสมาชิก</span>
          </p>
        </div>
      </div>
    </div>
  );
}