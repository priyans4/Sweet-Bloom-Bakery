import { useState } from "react";
import { Order, OrderStatus } from "../types";
import { Calendar, MapPin, DollarSign, RefreshCw, XCircle, CheckCircle, Package, Truck, Info, Smile } from "lucide-react";

interface OrdersTabProps {
  orders: Order[];
  onCancelOrder: (orderId: string) => Promise<any>;
  onRefreshOrders: () => void;
  setActiveTab: (tab: "home" | "orders" | "profile") => void;
}

export default function OrdersTab({ orders, onCancelOrder, onRefreshOrders, setActiveTab }: OrdersTabProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmingCancelId, setConfirmingCancelId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<{ [key: string]: string }>({});

  const handleCancelClick = async (orderId: string) => {
    try {
      setCancellingId(orderId);
      await onCancelOrder(orderId);
    } catch (err: any) {
      setCancelError(prev => ({ ...prev, [orderId]: err?.message || "Could not cancel order." }));
      setTimeout(() => {
        setCancelError(prev => {
          const copy = { ...prev };
          delete copy[orderId];
          return copy;
        });
      }, 5000);
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PLACED:
        return "bg-blue-100 text-blue-700 border-blue-200";
      case OrderStatus.PREPARING:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case OrderStatus.OUT_FOR_DELIVERY:
        return "bg-purple-100 text-purple-700 border-purple-200";
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-700 border-green-200";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-pink-100 pb-5">
        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-800">My Cake Orders</h2>
          <p className="text-sm text-gray-500 mt-1">Track active baking orders, view history, or request cancellation</p>
        </div>
        <button
          onClick={onRefreshOrders}
          className="p-2 text-pink-500 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
          title="Refresh orders status"
        >
          <RefreshCw className="w-4 h-4 animate-spin-hover" />
          Sync
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-pink-50 shadow-xs max-w-xl mx-auto">
          <div className="w-16 h-16 bg-pink-50 text-pink-400 rounded-full flex items-center justify-center mx-auto mb-5">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">No bakery orders found</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            It looks like you haven't placed any gourmet cake orders yet. Head to our pastry menu and configure your strawberry blushing mousse or Belgian chocolate truffle!
          </p>
          <button
            onClick={() => setActiveTab("home")}
            className="px-6 py-3 bg-pink-400 hover:bg-pink-500 text-white font-medium rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-pink-100 transition-all cursor-pointer"
          >
            Browse Pastries
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-pink-50 shadow-xs overflow-hidden"
            >
              {/* Order Card Header */}
              <div className="bg-[#fdfaf9] px-6 py-5 border-b border-pink-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-sm font-bold text-gray-800 tracking-tight">
                      Order #{order.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">Grand Total</span>
                  <span className="font-serif text-xl font-bold text-pink-600">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order details body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Items column */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Cake Recipe details</h4>

                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start pb-4 border-b border-pink-50 last:border-0 last:pb-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-pink-50 bg-gray-50">
                        <img src={item.cakeImage} alt={item.cakeName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm font-bold text-gray-800 leading-tight">
                          {item.cakeName}
                        </p>
                        <div className="flex flex-wrap gap-x-2 text-[10px] text-gray-500 font-medium mt-1">
                          <span className="text-pink-600 font-semibold">{item.size}</span>
                          <span>•</span>
                          <span>{item.flavor}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                        {item.customMessage && (
                          <div className="mt-1.5 p-2 bg-pink-50/40 border border-pink-100/50 rounded-lg">
                            <p className="text-[10px] italic text-pink-500 font-semibold leading-tight">
                              🍰 " frosting: {item.customMessage} "
                            </p>
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-gray-700">
                        ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery details column */}
                <div className="bg-[#fdfaf9] rounded-2xl p-4 border border-pink-50 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-pink-400" /> Delivery To
                      </h4>
                      <p className="text-xs font-bold text-gray-700 leading-tight">
                        {order.shippingAddress.label} • {order.shippingAddress.street}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-pink-400" /> Payment & Fee
                      </h4>
                      <p className="text-xs font-bold text-gray-700">
                        {order.paymentMethod}
                      </p>
                      {order.paymentDetails?.cardLast4 && (
                        <p className="text-[10px] text-gray-500">
                          Card ending in •••• {order.paymentDetails.cardLast4}
                        </p>
                      )}
                      {order.paymentDetails?.walletProvider && (
                        <p className="text-[10px] text-gray-500">
                          Via {order.paymentDetails.walletProvider}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Cancel Button and confirmation custom render */}
                  {(order.status === OrderStatus.PLACED || order.status === OrderStatus.PREPARING) && (
                    <div className="mt-6 border-t border-pink-50/50 pt-4">
                      {confirmingCancelId === order.id ? (
                        <div className="bg-red-50/60 rounded-2xl p-3 border border-red-100 animate-fade-in text-center space-y-3">
                          <p className="text-[11px] font-medium text-red-600 leading-snug">
                            Confirm order cancellation? Our bakers will stop whisking immediately.
                          </p>
                          <div className="flex gap-2 justify-center">
                            <button
                              type="button"
                              onClick={() => setConfirmingCancelId(null)}
                              className="px-3 py-1 bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-3xs"
                            >
                              No, Keep Order
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmingCancelId(null);
                                handleCancelClick(order.id);
                              }}
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-3xs"
                            >
                              Yes, Cancel Order
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {cancelError[order.id] && (
                            <p className="text-[10px] text-red-500 font-semibold mb-2 text-center animate-fade-in">
                              ⚠️ {cancelError[order.id]}
                            </p>
                          )}
                          <button
                            onClick={() => setConfirmingCancelId(order.id)}
                            disabled={cancellingId === order.id}
                            className="w-full py-2 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-xl text-xs font-bold transition-all border border-red-100/70 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1"
                          >
                            <XCircle className="w-4 h-4" />
                            {cancellingId === order.id ? "Stopping Whisk..." : "Cancel cake order"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic bakery timeline */}
              {order.status !== OrderStatus.CANCELLED && (
                <div className="bg-[#fdfaf9]/50 border-t border-pink-50/40 p-5">
                  <span className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">
                    Chef Whisk Status Tracking
                  </span>

                  <div className="grid grid-cols-4 gap-2 relative">
                    {/* Stepper nodes */}
                    {[
                      {
                        title: "Order Placed",
                        desc: "Recipe confirmed",
                        icon: "✓",
                        done: true,
                      },
                      {
                        title: "Preparing Cake",
                        desc: "Baker is whisking",
                        icon: "2",
                        done: order.status !== OrderStatus.PLACED,
                      },
                      {
                        title: "Out for Delivery",
                        desc: "In chilled cargo",
                        icon: "3",
                        done: order.status === OrderStatus.OUT_FOR_DELIVERY || order.status === OrderStatus.DELIVERED,
                      },
                      {
                        title: "Delivered",
                        desc: "Sweetness enjoyed!",
                        icon: "✓",
                        done: order.status === OrderStatus.DELIVERED,
                      },
                    ].map((step, sIdx) => (
                      <div
                        key={sIdx}
                        className={`flex flex-col items-center text-center ${step.done ? "opacity-100" : "opacity-45"
                          }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${step.done ? "bg-pink-400 text-white shadow-xs" : "bg-gray-200 text-gray-500"
                            }`}
                        >
                          {step.icon}
                        </div>
                        <span className="text-xs font-bold text-gray-700 leading-tight">
                          {step.title}
                        </span>
                        <span className="text-[10px] text-gray-400 leading-normal hidden sm:inline-block mt-0.5">
                          {step.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
