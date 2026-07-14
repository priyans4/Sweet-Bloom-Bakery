import { Order } from "../types";
import { CheckCircle, Cake, Sparkles, MapPin, Calendar, Gift, ShoppingBag, X, ChevronRight } from "lucide-react";

interface OrderConfirmedModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrders: () => void;
}

export default function OrderConfirmedModal({ order, onClose, onTrackOrders }: OrderConfirmedModalProps) {
  if (!order) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-pink-100 p-6 sm:p-8 text-center animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 hover:bg-pink-50 p-1.5 rounded-full transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebratory Icon Header */}
        <div className="relative inline-block mb-5">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 shadow-md shadow-pink-100 mx-auto">
            <CheckCircle className="w-10 h-10 fill-white text-pink-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center animate-bounce shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="absolute -bottom-1 -left-1.5 w-7 h-7 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center shadow-xs">
            <Cake className="w-4 h-4" />
          </div>
        </div>

        {/* Success Announcement */}
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
          Your Cake is Booked!
        </h3>
        <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
          Order <span className="font-mono font-bold text-gray-800 bg-pink-50/70 px-2 py-0.5 border border-pink-100/50 rounded">#{order.id}</span> has been confirmed. Our culinary artists are already preparing the baking trays!
        </p>

        {/* Receipt/Ticket Summary */}
        <div className="bg-[#fdfaf9] rounded-2xl border border-pink-50/80 p-5 my-6 text-left space-y-3.5">
          <div className="flex gap-2.5 items-start">
            <MapPin className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-bold">Delivery Address</span>
              <p className="text-xs font-bold text-gray-700 leading-snug">
                {order.shippingAddress.label} • {order.shippingAddress.street}
              </p>
              <p className="text-[10px] text-gray-400">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
            </div>
          </div>

          <div className="flex gap-2.5 items-start">
            <Calendar className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-bold">Handover Schedule</span>
              <p className="text-xs font-bold text-gray-700 leading-none mt-0.5">
                Freshly baked & cooled cargo delivery
              </p>
            </div>
          </div>

          <div className="flex gap-2.5 items-start">
            <Gift className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-bold">Your Treats Selection</span>
              <div className="text-xs text-gray-600 space-y-0.5 mt-0.5 max-h-24 overflow-y-auto pr-1">
                {order.items.map((item, index) => (
                  <p key={index} className="font-medium">
                    {item.quantity}x {item.cakeName} <span className="text-pink-500 font-semibold">({item.size})</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-pink-100/60 flex justify-between items-baseline">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Amount Paid</span>
            <span className="font-serif text-base font-bold text-pink-600">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Modal CTAs */}
        <div className="space-y-2.5">
          <button
            onClick={onClose}
            className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg shadow-pink-100 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Browsing Menu
          </button>
          <button
            onClick={onTrackOrders}
            className="w-full py-2.5 border border-pink-150 text-pink-500 hover:bg-pink-50 rounded-xl text-xs uppercase tracking-widest font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            Track in My Orders
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
