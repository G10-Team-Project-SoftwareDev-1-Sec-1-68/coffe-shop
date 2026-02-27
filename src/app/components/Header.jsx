export default function Header() {
  return (
    <header className="w-full border-b border-border bg-[#A17356] text-white">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-semibold tracking-[0.2em] uppercase">
              K A F U N G
            </span>
            <span className="text-sm text-white/80 -mt-1">
              coffee bar
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            type="button"
            className="rounded-2xl border border-border px-5 py-2 text-sm font-medium tracking-wide hover:bg-muted"
          >
            LOGIN
          </button>

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-90"
            aria-label="Cart"
          >
            {/* simple basket icon approximation */}
            <span className="block h-4 w-4 rounded-sm border-[2px] border-primary-foreground border-b-0" />
            <span className="absolute bottom-[10px] flex h-1 w-3 items-center justify-between">
              <span className="block h-1 w-[2px] rounded-full bg-primary-foreground" />
              <span className="block h-1 w-[2px] rounded-full bg-primary-foreground" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}