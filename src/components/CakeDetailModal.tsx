import { useState } from "react";
import { X, Star, Clock, Sparkles, MessageSquare, Check, ShoppingBag } from "lucide-react";
import { Cake, CartItem } from "../types";

interface CakeDetailModalProps {
  cake: Cake | null;
  onClose: () => void;
  onAddToBag: (item: CartItem) => void;
}

export default function CakeDetailModal({ cake, onClose, onAddToBag }: CakeDetailModalProps) {
  if (!cake) return null;

  const [selectedSize, setSelectedSize] = useState<string>(cake.sizes[0] || "1kg");
  const [selectedFlavor, setSelectedFlavor] = useState<string>(cake.flavors[0] || "Standard");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Simple sizing price multiplier
  let priceMultiplier = 1.0;
  if (selectedSize === "0.5kg") priceMultiplier = 0.8;
  if (selectedSize === "2kg") priceMultiplier = 1.7;
  if (selectedSize === "3kg") priceMultiplier = 2.4;

  const currentPrice = cake.price * priceMultiplier;

  const handleAdd = () => {
    onAddToBag({
      cake: {
        ...cake,
        price: currentPrice
      },
      quantity,
      selectedSize,
      selectedFlavor,
      customMessage: customMessage.trim() || undefined,
    });

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="relative bg-[#fdfaf9] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-100 flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-pink-500 flex items-center justify-center border border-pink-50 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Gorgeous Image Container */}
        <div className="md:w-1/2 relative bg-pink-50/20 flex items-center justify-center overflow-hidden min-h-[280px] md:min-h-full">
          <img
            src={cake.image}
            alt={cake.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover min-h-[280px] absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden"></div>

          {/* Overlay Tag */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
            <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-white/95 text-pink-500 rounded-full shadow-xs">
              {cake.category} Cake
            </span>
          </div>

          <div className="absolute bottom-4 left-4 text-white md:hidden">
            <h2 className="font-serif text-2xl font-bold">{cake.name}</h2>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-pink-200">
              <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-500" />
              <span className="text-white font-semibold">{cake.rating}</span>
              <span>({cake.reviewsCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Configuration & Details */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-white rounded-r-3xl">
          <div>
            <div className="hidden md:block">
              <div className="flex items-center gap-1 text-xs text-yellow-600 font-bold mb-1.5">
                <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-500" />
                <span>{cake.rating} rating</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 font-normal">{cake.reviewsCount} gourmet feedback</span>
              </div>
              <h2 className="font-serif text-3xl font-semibold text-gray-800 leading-tight mb-2">
                {cake.name}
              </h2>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-6 mt-2 md:mt-0">
              {cake.description}
            </p>

            <div className="grid grid-cols-2 gap-4 pb-6 mb-6 border-b border-pink-50">
              <div className="bg-[#fdfaf9] p-3 rounded-2xl border border-pink-50">
                <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-bold">Preparation</span>
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-4 h-4 text-pink-400" />
                  {cake.preparationTime}
                </span>
              </div>
              <div className="bg-[#fdfaf9] p-3 rounded-2xl border border-pink-50">
                <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-bold">Serving Scale</span>
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  {selectedSize === "0.5kg" ? "Serves 4-6" : selectedSize === "1kg" ? "Serves 8-12" : "Serves 15-20"}
                </span>
              </div>
            </div>

            {/* Step 1: Select Size */}
            <div className="mb-5">
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">
                1. Select Size (Sponge weight)
              </label>
              <div className="flex flex-wrap gap-2">
                {cake.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${selectedSize === size
                        ? "bg-pink-400 text-white border-pink-400 shadow-xs"
                        : "bg-[#fdfaf9] text-gray-600 border-pink-100 hover:border-pink-300"
                      }`}
                  >
                    {size}
                    {size === "0.5kg" && " (-20%)"}
                    {size === "2kg" && " (+70%)"}
                    {size === "3kg" && " (+140%)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Choose Gourmet Flavor */}
            <div className="mb-5">
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">
                2. Select Your Sponge & Filling Flavor
              </label>
              <div className="flex flex-col gap-2">
                {cake.flavors.map((flavor) => (
                  <button
                    key={flavor}
                    type="button"
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-medium text-left border flex items-center justify-between transition-all duration-200 cursor-pointer ${selectedFlavor === flavor
                        ? "bg-pink-50 border-pink-300 text-pink-700 font-semibold"
                        : "bg-white border-gray-150 text-gray-600 hover:border-pink-200"
                      }`}
                  >
                    <span>{flavor}</span>
                    {selectedFlavor === flavor && <Check className="w-4 h-4 text-pink-500" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Custom Frosting Message */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 flex items-center justify-between">
                <span>3. Written message on Cake (Optional)</span>
                <span className="text-[10px] text-gray-400 font-normal">Max 40 chars</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-3 text-gray-400">
                  <MessageSquare className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  maxLength={40}
                  placeholder="e.g. 'Happy Birthday David!' or 'Best Mom Ever ❤️'"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#fdfaf9] rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 text-sm placeholder:text-gray-400 text-gray-800"
                />
              </div>
            </div>

            {/* Step 4: Ingredients Checklist */}
            <div className="mb-6">
              <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1.5">
                Primary organic ingredients
              </span>
              <div className="flex flex-wrap gap-1.5">
                {cake.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-1 rounded-md"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-5 border-t border-pink-50 flex items-center justify-between gap-4">
            {/* Quantity */}
            <div className="flex items-center gap-2 border border-pink-100 rounded-xl bg-[#fdfaf9] p-1 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-pink-50 hover:text-pink-600 font-bold transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="w-6 text-center text-sm font-bold text-gray-800">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-pink-50 hover:text-pink-600 font-bold transition-colors cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Price & Checkout Button */}
            <div className="flex-1 text-right md:text-left">
              <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-bold leading-none mb-1">
                Total Price
              </span>
              <span className="text-2xl font-bold text-gray-800 leading-none">
                ${(currentPrice * quantity).toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleAdd}
              disabled={addedSuccess}
              className={`px-6 py-3.5 rounded-2xl font-medium flex items-center justify-center gap-2 text-white shadow-lg transition-all duration-300 min-w-[150px] cursor-pointer ${addedSuccess
                  ? "bg-green-500 shadow-green-100"
                  : "bg-pink-400 shadow-pink-100 hover:bg-pink-500"
                }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4.5 h-4.5" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4.5 h-4.5" />
                  Add to Bag
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
