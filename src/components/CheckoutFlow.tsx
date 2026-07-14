import { useState, FormEvent } from "react";
import { UserAddress, CartItem, Order, OrderStatus } from "../types";
import { MapPin, Plus, Check, CreditCard, ChevronRight, ShoppingBag, Truck, Calendar, Sparkles } from "lucide-react";

interface CheckoutFlowProps {
  cartItems: CartItem[];
  savedAddresses: UserAddress[];
  onAddAddress: (addr: Omit<UserAddress, "id">) => Promise<any>;
  onPlaceOrder: (orderData: any) => Promise<Order>;
  onOrderPlacedSuccess: (order: Order) => void;
  onCancelCheckout: () => void;
}

export default function CheckoutFlow({
  cartItems,
  savedAddresses,
  onAddAddress,
  onPlaceOrder,
  onOrderPlacedSuccess,
  onCancelCheckout,
}: CheckoutFlowProps) {
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    savedAddresses.find((a) => a.isDefault)?.id || savedAddresses[0]?.id || ""
  );

  // Address Form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressLabel, setAddressLabel] = useState("Home");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [addressDefault, setAddressDefault] = useState(true);
  const [addressSubmitting, setAddressSubmitting] = useState(false);

  // Delivery Time state
  const [deliveryDate, setDeliveryDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0] // tomorrow
  );
  const [deliverySlot, setDeliverySlot] = useState("1:00 PM - 4:00 PM (Afternoon)");

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"Card" | "Digital Wallet" | "Cash on Delivery">("Card");
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [cardName, setCardName] = useState("Mukesh Kumar");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [walletProvider, setWalletProvider] = useState("Apple Pay");

  // General state
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const subtotal = cartItems.reduce((acc, item) => acc + item.cake.price * item.quantity, 0);
  const deliveryFee = subtotal > 35 ? 0 : 5.00;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handleSaveAddress = async (e: FormEvent) => {
    e.preventDefault();
    if (!addressLabel || !addressStreet || !addressCity || !addressState || !addressZip) {
      alert("Please fill in all address fields.");
      return;
    }

    try {
      setAddressSubmitting(true);
      const updatedProfile = await onAddAddress({
        label: addressLabel,
        street: addressStreet,
        city: addressCity,
        state: addressState,
        zipCode: addressZip,
        isDefault: addressDefault,
      });

      // Find the newly added address ID
      const latestAddress = updatedProfile.addresses[updatedProfile.addresses.length - 1];
      if (latestAddress) {
        setSelectedAddressId(latestAddress.id);
      }
      setShowAddressForm(false);
      // Reset form
      setAddressStreet("");
      setAddressCity("");
      setAddressState("");
      setAddressZip("");
    } catch (err) {
      console.error(err);
    } finally {
      setAddressSubmitting(false);
    }
  };

  const handleCompleteOrder = async () => {
    const selectedAddress = savedAddresses.find((a) => a.id === selectedAddressId);
    if (!selectedAddress) {
      setCheckoutError("Please select a delivery address or add a new one.");
      return;
    }

    if (paymentMethod === "Card" && (!cardNumber || !cardName || !cardExpiry || !cardCvv)) {
      setCheckoutError("Please fill out your credit card details.");
      return;
    }

    setCheckoutError("");
    setIsPlacingOrder(true);

    try {
      const itemsPayload = cartItems.map((item) => {
        const payloadItem: any = {
          cakeId: item.cake.id,
          cakeName: item.cake.name,
          cakeImage: item.cake.image,
          quantity: item.quantity,
          size: item.selectedSize,
          flavor: item.selectedFlavor,
          priceAtPurchase: item.cake.price,
        };
        if (item.customMessage !== undefined && item.customMessage !== null) {
          payloadItem.customMessage = item.customMessage;
        }
        return payloadItem;
      });

      const paymentDetailsPayload: any = {};
      if (paymentMethod === "Card") {
        paymentDetailsPayload.cardLast4 = cardNumber.slice(-4) || "4242";
      } else if (paymentMethod === "Digital Wallet") {
        paymentDetailsPayload.walletProvider = walletProvider;
      }

      const orderPayload = {
        items: itemsPayload,
        shippingAddress: selectedAddress,
        paymentMethod,
        paymentDetails: paymentDetailsPayload,
        subtotal,
        deliveryFee,
        tax,
        total,
      };

      const placedOrder = await onPlaceOrder(orderPayload);
      onOrderPlacedSuccess(placedOrder);
    } catch (err: any) {
      setCheckoutError(err?.message || "Something went wrong while placing your order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 border-b border-pink-100 pb-5">
        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-800">Complete Your Order</h2>
          <p className="text-sm text-gray-500 mt-1">Gourmet delivery details and secure payment checkout</p>
        </div>
        <button
          onClick={onCancelCheckout}
          className="text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-pink-500 transition-colors cursor-pointer"
        >
          Back to Shop
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Address Selection */}
          <div className="bg-white rounded-3xl p-6 border border-pink-50 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 font-bold font-serif text-sm">
                  1
                </div>
                <h3 className="font-serif text-lg font-bold text-gray-800">Delivery Address</h3>
              </div>
              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="text-xs font-bold text-pink-500 hover:text-pink-600 flex items-center gap-1 cursor-pointer bg-pink-50 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Address
                </button>
              )}
            </div>

            {/* Address Input Form */}
            {showAddressForm && (
              <form onSubmit={handleSaveAddress} className="bg-[#fdfaf9] rounded-2xl p-5 mb-5 border border-pink-100/70 animate-fade-in">
                <h4 className="font-serif text-sm font-bold text-gray-700 mb-4">New Shipping Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                      Label Name
                    </label>
                    <div className="flex gap-2">
                      {["Home", "Work / Office", "Friend's Place", "Other"].map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setAddressLabel(l)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${addressLabel === l
                              ? "bg-pink-100 border-pink-300 text-pink-600"
                              : "bg-white border-gray-150 text-gray-600"
                            }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 122 Baker St, Suite 4B"
                      value={addressStreet}
                      onChange={(e) => setAddressStreet(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-200 text-sm text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sweetwater"
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-200 text-sm text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                      State / Region
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. California"
                      value={addressState}
                      onChange={(e) => setAddressState(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-200 text-sm text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                      Zip / Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 90210"
                      value={addressZip}
                      onChange={(e) => setAddressZip(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-200 text-sm text-gray-700"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="addressDefault"
                      checked={addressDefault}
                      onChange={(e) => setAddressDefault(e.target.checked)}
                      className="accent-pink-500 rounded text-pink-500"
                    />
                    <label htmlFor="addressDefault" className="text-xs font-semibold text-gray-500 cursor-pointer">
                      Set as Default address
                    </label>
                  </div>
                </div>

                <div className="flex gap-2.5 justify-end mt-5 border-t border-pink-100/50 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 hover:bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addressSubmitting}
                    className="px-4.5 py-2 bg-pink-400 hover:bg-pink-500 text-white rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    {addressSubmitting ? "Saving..." : "Save and Select"}
                  </button>
                </div>
              </form>
            )}

            {/* Saved Addresses List */}
            {savedAddresses.length === 0 ? (
              <p className="text-xs text-gray-500 italic bg-[#fdfaf9] p-4 rounded-xl border border-pink-100/50">
                You have no shipping addresses saved yet. Please add a shipping address using the "Add New Address" form above to receive your delectable pastries.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedAddresses.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    type="button"
                    className={`p-4 rounded-2xl border text-left flex justify-between relative transition-all duration-200 cursor-pointer ${selectedAddressId === addr.id
                        ? "bg-pink-50/50 border-pink-300 ring-1 ring-pink-200"
                        : "bg-white border-pink-50 hover:border-pink-200"
                      }`}
                  >
                    <div className="min-w-0 pr-6">
                      <span className="inline-block text-[10px] font-bold text-pink-500 uppercase tracking-wider mb-1">
                        {addr.label} {addr.isDefault && "• Default"}
                      </span>
                      <p className="text-xs font-bold text-gray-700 truncate">{addr.street}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {addr.city}, {addr.state} {addr.zipCode}
                      </p>
                    </div>
                    {selectedAddressId === addr.id && (
                      <div className="w-5 h-5 rounded-full bg-pink-400 flex items-center justify-center text-white absolute top-4 right-4">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Delivery Scheduling */}
          <div className="bg-white rounded-3xl p-6 border border-pink-50 shadow-xs">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 font-bold font-serif text-sm">
                2
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-800">Fresh Bake Schedule</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-pink-400" /> Choose Delivery Date
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#fdfaf9] rounded-xl border border-pink-100 focus:outline-none focus:ring-1 focus:ring-pink-200 text-sm text-gray-700"
                />
                <span className="text-[10px] text-gray-400 mt-1.5 block">
                  All cakes require at least 24h bake preparation.
                </span>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-pink-400" /> Choose Handover Time
                </label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#fdfaf9] rounded-xl border border-pink-100 focus:outline-none focus:ring-1 focus:ring-pink-200 text-sm text-gray-700"
                >
                  <option>9:00 AM - 12:00 PM (Morning freshness)</option>
                  <option>1:00 PM - 4:00 PM (Afternoon)</option>
                  <option>5:00 PM - 8:00 PM (Evening dinner party)</option>
                </select>
                <span className="text-[10px] text-gray-400 mt-1.5 block">
                  Delivered in active refrigerated boxes.
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Secure Payment */}
          <div className="bg-white rounded-3xl p-6 border border-pink-50 shadow-xs">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 font-bold font-serif text-sm">
                3
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-800">Secure Payment</h3>
            </div>

            {/* Select method */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { id: "Card", label: "Credit Card", desc: "Visa, MC, Amex", icon: <CreditCard className="w-4 h-4" /> },
                { id: "Digital Wallet", label: "Wallet", desc: "Apple & GPay", icon: <Sparkles className="w-4 h-4" /> },
                { id: "Cash on Delivery", label: "Cash (COD)", desc: "Pay on handover", icon: <Truck className="w-4 h-4" /> },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${paymentMethod === m.id
                      ? "bg-pink-50/50 border-pink-300 text-pink-700"
                      : "bg-white border-pink-50 hover:border-pink-200 text-gray-600"
                    }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-gray-800">
                    <span className="text-pink-500">{m.icon}</span>
                    <span>{m.label}</span>
                  </div>
                  <span className="block text-[10px] text-gray-400 mt-1">{m.desc}</span>
                </button>
              ))}
            </div>

            {/* Payment Fields conditional rendering */}
            {paymentMethod === "Card" && (
              <div className="bg-[#fdfaf9] rounded-2xl p-5 border border-pink-100/70 space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4111 2222 3333 4444"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-200 text-sm text-gray-700"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mukesh Kumar"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-200 text-sm text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-200 text-sm text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                      CVV / CVN
                    </label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-200 text-sm text-gray-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "Digital Wallet" && (
              <div className="bg-[#fdfaf9] rounded-2xl p-5 border border-pink-100/70 text-center animate-fade-in">
                <p className="text-xs text-gray-600 mb-4 font-semibold">Select your dynamic wallet provider:</p>
                <div className="flex justify-center gap-3">
                  {["Apple Pay", "Google Pay", "PayPal"].map((provider) => (
                    <button
                      key={provider}
                      type="button"
                      onClick={() => setWalletProvider(provider)}
                      className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${walletProvider === provider
                          ? "bg-pink-100 border-pink-300 text-pink-700"
                          : "bg-white border-pink-50 text-gray-500"
                        }`}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentMethod === "Cash on Delivery" && (
              <div className="bg-[#fdfaf9] rounded-2xl p-4 border border-pink-100/70 text-center animate-fade-in text-gray-600 text-xs leading-relaxed">
                🍰 You will pay on handover when your refrigerator box arrives. Please keep exactly{" "}
                <strong className="text-pink-600">${total.toFixed(2)}</strong> ready in cash or card. Thank you!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Bill summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm sticky top-24">
            <h3 className="font-serif text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-pink-50">
              Cake Bag Summary
            </h3>

            {/* Selected Cakes List */}
            <div className="space-y-3 max-h-[250px] overflow-y-auto mb-5 pr-1.5">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-2.5 items-center">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-pink-50">
                    <img src={item.cake.image} alt={item.cake.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-700 truncate">{item.cake.name}</p>
                    <p className="text-[10px] text-gray-400">
                      Qty: {item.quantity} • {item.selectedSize}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-gray-700">
                    ${(item.cake.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Info */}
            <div className="space-y-2 border-t border-pink-50 pt-4 mb-6">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Cakes Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="text-green-600 font-bold">FREE</span>
                ) : (
                  <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-pink-50">
                <span className="font-serif text-sm font-bold text-gray-800">Total Spent</span>
                <span className="font-serif text-2xl font-bold text-pink-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout errors */}
            {checkoutError && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 font-medium mb-4">
                {checkoutError}
              </div>
            )}

            {/* Place Order Button */}
            <button
              onClick={handleCompleteOrder}
              disabled={isPlacingOrder || cartItems.length === 0}
              className="w-full py-4 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl text-sm transition-all duration-300 shadow-lg shadow-pink-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlacingOrder ? "Preparing Order..." : "Place Order & Pay"}
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="block text-[10px] text-center text-gray-400 mt-3 leading-normal">
              By placing order, you agree to Sweet Bloom's daily baked freshness guidelines.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
