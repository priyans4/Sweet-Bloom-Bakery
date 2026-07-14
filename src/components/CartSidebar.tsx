import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { CartItem } from "../types";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartSidebarProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.cake.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in" onClick={onClose}>
      <div
        className="relative bg-white w-full max-w-md h-full shadow-2xl border-l border-pink-100 p-6 flex flex-col justify-between animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{ animationDuration: "0.25s" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-pink-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-800">Your Cake Bag</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Selected delicacies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-pink-50 text-gray-400 hover:text-pink-500 flex items-center justify-center border border-pink-50/50 cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 bg-pink-50/50 rounded-full flex items-center justify-center text-pink-300 mb-4 animate-bounce">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-serif text-base text-gray-700 font-semibold mb-1">Your bag is empty</p>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                Explore our catalog of custom strawberry mousses, decadent Belgian dark truffles, and delicate blossom cakes to start your order!
              </p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={`${item.cake.id}-${index}`}
                className="bg-[#fdfaf9] rounded-2xl p-4 border border-pink-50/70 flex gap-3.5 relative"
              >
                {/* Product Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-pink-100 bg-white">
                  <img
                    src={item.cake.image}
                    alt={item.cake.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm font-semibold text-gray-800 truncate leading-snug">
                    {item.cake.name}
                  </h4>
                  <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[10px] text-gray-500 font-medium">
                    <span className="bg-pink-100/60 text-pink-700 px-1.5 py-0.2 rounded-sm uppercase tracking-wide">
                      {item.selectedSize}
                    </span>
                    <span className="text-gray-400">/</span>
                    <span>{item.selectedFlavor}</span>
                  </div>

                  {item.customMessage && (
                    <p className="text-[10px] italic text-pink-500 font-semibold mt-1 truncate">
                      Message: "{item.customMessage}"
                    </p>
                  )}

                  {/* Qty & Trash controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-white border border-pink-100 rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 rounded-md hover:bg-pink-50 text-gray-500 flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="w-6 h-6 rounded-md hover:bg-pink-50 text-gray-500 flex items-center justify-center font-bold text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="block text-xs font-bold text-gray-800">
                        ${(item.cake.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => onRemoveItem(index)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-pink-50/50 cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-pink-50">
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>Items Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>Standard Delivery</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-pink-50">
                <span className="font-serif text-sm font-semibold text-gray-800">Total Bill</span>
                <span className="font-serif text-xl font-bold text-pink-600">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-pink-400 hover:bg-pink-500 text-white font-medium py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-pink-100 flex items-center justify-center gap-2 cursor-pointer"
            >
              Proceed to Checkout
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
