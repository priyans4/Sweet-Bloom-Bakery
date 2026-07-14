import { Star, Clock, Sparkles } from "lucide-react";
import { Cake } from "../types";

interface CakeGridProps {
  cakes: Cake[];
  loading: boolean;
  onSelectCake: (cake: Cake) => void;
}

export default function CakeGrid({ cakes, loading, onSelectCake }: CakeGridProps) {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-brand-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 mt-4 font-medium">Whisking up our sweet catalog...</p>
      </div>
    );
  }

  if (cakes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 bg-brand-pink-50 text-brand-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="font-display text-lg font-semibold text-gray-800 mb-1">No sweet treats found</h3>
        <p className="text-gray-500 max-w-md mx-auto text-sm">
          We couldn't find any cakes matching your search criteria. Try looking for other delectable flavors like chocolate, strawberry, or vanilla!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Today's Freshly Whisked Cakes
          </h2>
          <p className="text-sm text-gray-500 mt-1">Select a cake to customize your size, flavor, and written message.</p>
        </div>
        <span className="text-xs font-semibold text-brand-pink-600 bg-brand-pink-100/60 px-3 py-1.5 rounded-full">
          {cakes.length} {cakes.length === 1 ? "cake" : "cakes"} available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {cakes.map((cake) => (
          <div
            key={cake.id}
            id={`cake-card-${cake.id}`}
            className="group flex flex-col bg-white rounded-2xl border border-pink-100/50 shadow-xs hover:shadow-md hover:border-brand-pink-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Cake Image Box */}
            <div className="relative aspect-5/4 overflow-hidden bg-pink-50/20">
              <img
                src={cake.image}
                alt={cake.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-white/95 text-brand-pink-600 rounded-full shadow-xs">
                {cake.category}
              </span>
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-full shadow-xs text-[10px] font-bold text-yellow-600">
                <Star className="w-3.5 h-3.5 fill-yellow-400 stroke-yellow-500" />
                {cake.rating}
              </div>
            </div>

            {/* Cake Info Box */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-display text-lg font-bold text-gray-900 leading-tight group-hover:text-brand-pink-600 transition-colors duration-200 mb-1.5">
                {cake.name}
              </h3>
              <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4">
                {cake.description}
              </p>

              {/* Bottom Metadata */}
              <div className="mt-auto pt-4 border-t border-pink-50/75 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Starting at</span>
                  <span className="text-lg font-bold text-gray-900">${cake.price.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                    <Clock className="w-3 h-3 text-brand-pink-400" />
                    {cake.preparationTime}
                  </span>
                </div>
              </div>

              {/* View / Select Button */}
              <button
                onClick={() => onSelectCake(cake)}
                className="mt-4.5 w-full py-2.5 rounded-xl bg-brand-pink-50 text-brand-pink-600 hover:bg-brand-pink-500 hover:text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                Configure & Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
