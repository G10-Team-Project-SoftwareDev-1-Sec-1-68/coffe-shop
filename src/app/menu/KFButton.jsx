import * as React from "react";
import { Heart } from "lucide-react";

export const KFButton = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center gap-2
        px-6 py-4 text-lg font-bold rounded-2xl whitespace-nowrap
        bg-[var(--primary)] text-[var(--primary-foreground)]
        shadow-md transition-all duration-300 ease-out
        hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg
        active:scale-95 disabled:opacity-50
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
});

export const FavoriteButton = React.forwardRef(({ className, ...props }, ref) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  return (
    <button
      ref={ref}
      onClick={() => setIsFavorite(!isFavorite)}
      className={`
        inline-flex items-center justify-center
        w-12 h-12 rounded-full
        bg-white/80 text-[#B87C4C] shadow-sm
        transition-all duration-300 hover:scale-110
        ${className}
      `}
      {...props}
    >
      <Heart size={24} strokeWidth={3} className={isFavorite ? "fill-[#B87C4C]" : "fill-none"} />
    </button>
  );
});