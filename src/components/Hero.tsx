
import { Search, Sparkles } from "lucide-react";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CATEGORIES = ["All", "Signature", "Chocolate", "Classic", "Fruity", "Vegan"];

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-brand-pink-50 to-white pt-12 pb-14 border-b border-pink-50">
      {/* Decorative floral elements backgrounds */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink-100/40 rounded-full blur-3xl -mr-20 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-100/30 rounded-full blur-3xl -ml-32 -mb-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Soft Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink-100/70 text-brand-pink-600 text-xs font-semibold tracking-wide uppercase mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          Freshly Baked Daily in Sweetwater
        </div>

        {/* Catchy Slogan */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight max-w-3xl mx-auto leading-[1.1] mb-6">
          Symphony of sweetness in <span className="text-brand-pink-500 font-display italic">every single slice</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed mb-10">
          Order gourmet birthday cakes, custom celebration masterpieces, and vegan delights crafted with organic berries and premium Belgian chocolate.
        </p>

        {/* Search Bar Container */}
        <div className="max-w-2xl mx-auto mb-10 relative">
          <div className="relative flex items-center bg-white rounded-2xl shadow-md border border-pink-100/80 p-1.5 focus-within:ring-2 focus-within:ring-brand-pink-300 focus-within:border-brand-pink-400 transition-all duration-300">
            <div className="pl-3.5 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by flavor, cake name, or ingredients (e.g. Strawberry, Gluten Free, Matcha)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 px-3 bg-transparent text-gray-800 text-sm focus:outline-none placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-3 text-xs font-medium text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 max-w-2xl mx-auto">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border ${selectedCategory === category
                  ? "bg-brand-pink-500 text-white border-brand-pink-500 shadow-sm shadow-brand-pink-200"
                  : "bg-white text-gray-600 border-gray-150 hover:border-brand-pink-300 hover:text-brand-pink-500 hover:bg-brand-pink-50/20"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
