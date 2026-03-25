import { ShoppingBag, User, Search } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-16 py-10 absolute top-0 w-full z-50">
      <div className="text-4xl font-black text-coffee-dark italic tracking-tighter uppercase">
        KAFUNG<span className="text-coffee-gold ml-1">.</span>
      </div>
      
      <div className="hidden md:flex items-center gap-12 text-xl font-bold text-coffee-dark/70">
        <a href="#" className="hover:text-coffee-dark transition-colors">Home</a>
        <a href="#" className="text-coffee-dark border-b-4 border-coffee-gold pb-1">Menu</a>
        <a href="#" className="hover:text-coffee-dark transition-colors">About Us</a>
        <a href="#" className="hover:text-coffee-dark transition-colors">Contact</a>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-3 hover:bg-coffee-gold/10 rounded-full transition-all text-coffee-dark">
          <Search size={28} />
        </button>
        <button className="p-3 hover:bg-coffee-gold/10 rounded-full transition-all text-coffee-dark relative">
          <ShoppingBag size={28} />
          <span className="absolute top-0 right-0 bg-coffee-gold text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">2</span>
        </button>
        <button className="p-3 bg-coffee-dark text-white rounded-full shadow-lg hover:scale-110 transition-all ml-4">
          <User size={28} />
        </button>
      </div>
    </nav>
  );
}