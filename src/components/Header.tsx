import { ShoppingBag, Cake as CakeIcon, User, History, ShoppingCart, LogIn, LogOut } from "lucide-react";

interface HeaderProps {
  activeTab: "home" | "orders" | "profile";
  setActiveTab: (tab: "home" | "orders" | "profile") => void;
  cartCount: number;
  onCartClick: () => void;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Header({ activeTab, setActiveTab, cartCount, onCartClick, user, onLogin, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-pink-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        {/* Logo and Brand in Natural Tones design */}
        <button
          onClick={() => setActiveTab("home")}
          className="flex items-center gap-3.5 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-11 h-11 bg-pink-100 group-hover:bg-pink-200 rounded-full flex items-center justify-center transition-all duration-300">
            <span className="text-pink-600 font-serif font-bold text-2xl group-hover:scale-110 transition-transform">S</span>
          </div>
          <div className="hidden sm:block">
            <span className="block font-serif italic text-2xl tracking-tight text-gray-700">
              Sweet Bloom Bakery
            </span>
            <span className="block text-[10px] uppercase tracking-widest font-semibold text-pink-400 leading-none mt-1">
              Gourmet Cake Boutique
            </span>
          </div>
        </button>

        {/* Navigation Links using the Natural Tones styling */}
        <nav className="flex items-center gap-4 sm:gap-7">
          <button
            onClick={() => setActiveTab("home")}
            className={`pb-1 text-xs sm:text-sm uppercase tracking-widest font-medium transition-all duration-200 cursor-pointer ${activeTab === "home"
                ? "text-pink-500 border-b-2 border-pink-300 font-semibold"
                : "text-gray-500 hover:text-pink-400 hover:border-b hover:border-pink-200"
              }`}
          >
            Shop
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-1 text-xs sm:text-sm uppercase tracking-widest font-medium transition-all duration-200 cursor-pointer ${activeTab === "orders"
                ? "text-pink-500 border-b-2 border-pink-300 font-semibold"
                : "text-gray-500 hover:text-pink-400 hover:border-b hover:border-pink-200"
              }`}
          >
            My Orders
          </button>

          {user ? (
            <div className="flex items-center">
              <button
                onClick={() => setActiveTab("profile")}
                className={`relative rounded-full p-0.5 transition-all duration-300 focus:outline-none cursor-pointer ${activeTab === "profile"
                    ? "ring-2 ring-pink-400 ring-offset-2 scale-105"
                    : "hover:ring-1 hover:ring-pink-200 hover:ring-offset-1"
                  }`}
                title="View Profile"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border border-pink-100 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xs">
                    {user.displayName ? user.displayName[0] : "U"}
                  </div>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-50 hover:bg-pink-100 border border-pink-100 text-pink-600 font-semibold text-[10px] sm:text-xs transition-colors uppercase tracking-wider cursor-pointer"
            >
              <LogIn className="w-3 h-3" />
              Sign In
            </button>
          )}

          {/* Cart Icon using Natural Tones style */}
          <button
            onClick={onCartClick}
            className="relative w-10 h-10 rounded-full border border-pink-100 hover:border-pink-300 flex items-center justify-center text-pink-400 hover:text-pink-500 hover:bg-pink-50/50 transition-all duration-300 cursor-pointer"
            aria-label="View Cart"
          >
            <ShoppingCart className="w-4.5 h-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
