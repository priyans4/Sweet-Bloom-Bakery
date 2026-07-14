import { Order } from "../types";
import { X, XCircle, ArrowLeft, RefreshCw, AlertTriangle, Calendar, MapPin, DollarSign } from "lucide-react";

interface OrderCancelledModalProps {
  order: Order | null;
  onClose: () => void;
  onBrowseMenu: () => void;
}

export default function OrderCancelledModal({ order, onClose, onBrowseMenu }: OrderCancelledModalProps) {
  if (!order) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl border border-red-50 p-6 sm:p-8 text-center animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cancellation Visual Header */}
        <div className="relative inline-block mb-5">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-md shadow-red-100 mx-auto">
            <XCircle className="w-10 h-10 fill-white text-red-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center animate-pulse shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Cancellation Message */}
        <h3 className="font-serif text-2xl font-bold text-gray-800 leading-tight">
          Cake Order Stopped
        </h3>
        <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
          Your booking for order <span className="font-mono font-bold text-red-600 bg-red-50/70 px-2 py-0.5 border border-red-100/50 rounded">#{order.id}</span> has been successfully cancelled. We've notified our bakery chef to stop the prep.
        </p>

        {/* Brief Details Box */}
        <div className="bg-[#fdfaf9] rounded-2xl border border-red-50/80 p-4.5 my-6 text-left space-y-3">
          <div className="flex gap-2.5 items-start text-xs text-gray-600">
            <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-bold">Original Destination</span>
              <p className="font-semibold text-gray-700 leading-tight mt-0.5">
                {order.shippingAddress.label} • {order.shippingAddress.street}
              </p>
            </div>
          </div>

          <div className="flex gap-2.5 items-start text-xs text-gray-600">
            <Calendar className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-bold">Cancellation Status</span>
              <p className="font-semibold text-red-500 leading-tight mt-0.5">
                Stopped • Pending Refund Processing
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-red-100/40 flex justify-between items-baseline">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Refund Amount</span>
            <span className="font-serif text-base font-bold text-gray-700">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-2.5">
          <button
            onClick={onBrowseMenu}
            className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg shadow-pink-100 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Other Pastries
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl text-xs uppercase tracking-widest font-bold transition-all cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
