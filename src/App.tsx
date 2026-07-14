import { useState, useEffect } from "react";
import { Cake, CartItem, Order, UserProfile, UserAddress, OrderStatus } from "./types";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CakeGrid from "./components/CakeGrid";
import CakeDetailModal from "./components/CakeDetailModal";
import CartSidebar from "./components/CartSidebar";
import CheckoutFlow from "./components/CheckoutFlow";
import OrdersTab from "./components/OrdersTab";
import ProfileTab from "./components/ProfileTab";
import OrderConfirmedModal from "./components/OrderConfirmedModal";
import OrderCancelledModal from "./components/OrderCancelledModal";
import { Sparkles, ShoppingBag, ArrowRight, Star, LogIn } from "lucide-react";
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "./firebase";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, orderBy, getDocFromServer } from "firebase/firestore";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "orders" | "profile">("home");
  const [onCheckoutView, setOnCheckoutView] = useState<boolean>(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [lastCancelledOrder, setLastCancelledOrder] = useState<Order | null>(null);

  // Cakes Catalog State
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loadingCakes, setLoadingCakes] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Selected Cake details modal
  const [selectedCake, setSelectedCake] = useState<Cake | null>(null);

  // Profile State
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);

  // Cart / Bag State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  // 1. Fetch Cakes on Query changes
  useEffect(() => {
    const fetchCakes = async () => {
      try {
        setLoadingCakes(true);
        const url = `/api/cakes?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setCakes(data);
        }
      } catch (err) {
        console.error("Error loading cakes", err);
      } finally {
        setLoadingCakes(false);
      }
    };

    const timer = setTimeout(fetchCakes, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  // Firebase Auth & Cloud Storage State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Connection testing as per Firebase guidelines
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, "test", "connection"));
      } catch (error) {
        if (error instanceof Error && error.message.includes("the client is offline")) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  const refetchProfileAndAddresses = async (uid: string): Promise<UserProfile> => {
    const userDocRef = doc(db, "users", uid);
    try {
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        const addrColRef = collection(db, "users", uid, "addresses");
        const addrSnap = await getDocs(addrColRef);
        const addresses: UserAddress[] = [];
        addrSnap.forEach((doc) => {
          const d = doc.data();
          addresses.push({
            id: doc.id,
            label: d.label,
            street: d.street,
            city: d.city,
            state: d.state,
            zipCode: d.zipCode,
            isDefault: d.isDefault || false,
          });
        });
        const updatedProfile: UserProfile = {
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          addresses: addresses,
        };
        setProfile(updatedProfile);
        return updatedProfile;
      } else {
        throw new Error("UserProfile document does not exist in Firestore.");
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${uid}`);
      throw err;
    }
  };

  const refetchOrders = async (uid: string) => {
    try {
      const ordersColRef = collection(db, "users", uid, "orders");
      const ordersQuery = query(ordersColRef, orderBy("createdAt", "desc"));
      const ordersSnap = await getDocs(ordersQuery);
      const loadedOrders: Order[] = [];
      ordersSnap.forEach((doc) => {
        const o = doc.data();
        loadedOrders.push({
          id: doc.id,
          userEmail: o.userEmail,
          items: o.items,
          shippingAddress: o.shippingAddress,
          paymentMethod: o.paymentMethod,
          paymentDetails: o.paymentDetails,
          subtotal: o.subtotal,
          deliveryFee: o.deliveryFee,
          tax: o.tax,
          total: o.total,
          createdAt: o.createdAt,
          status: o.status,
        });
      });
      setOrders(loadedOrders);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${uid}/orders`);
    }
  };

  const syncUserProfile = async (currentUser: User) => {
    const userDocRef = doc(db, "users", currentUser.uid);
    try {
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) {
        const newProfile = {
          name: currentUser.displayName || "Sweet Customer",
          email: currentUser.email || "customer@sweetbloom.com",
          phone: currentUser.phoneNumber || "",
        };
        await setDoc(userDocRef, newProfile);
      }
      await refetchProfileAndAddresses(currentUser.uid);
      await refetchOrders(currentUser.uid);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
      setOrders([]);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        await syncUserProfile(currentUser);
      } else {
        setProfile(null);
        setOrders([]);
      }
    });

    // Recover Cart from LocalStorage
    const savedCart = localStorage.getItem("sweet_bloom_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error restoring cart", e);
      }
    }

    return () => unsubscribe();
  }, []);

  // Save Cart to local storage on changes
  useEffect(() => {
    localStorage.setItem("sweet_bloom_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 3. Cart handlers
  const handleAddToBag = (item: CartItem) => {
    // Check if identical cake config exists (same cake, size, flavor, customMessage)
    const existingIndex = cartItems.findIndex(
      (c) =>
        c.cake.id === item.cake.id &&
        c.selectedSize === item.selectedSize &&
        c.selectedFlavor === item.selectedFlavor &&
        c.customMessage === item.customMessage
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += item.quantity;
      setCartItems(updated);
    } else {
      setCartItems([...cartItems, item]);
    }
    setCartOpen(true); // Auto reveal bag sidebar!
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    const updated = [...cartItems];
    updated[index].quantity = newQty;
    setCartItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
  };

  // 4. Address actions linked to Firebase Firestore
  const handleAddAddress = async (newAddressData: Omit<UserAddress, "id">): Promise<UserProfile> => {
    if (!user) throw new Error("Please Sign In with Google to manage your shipping addresses.");
    const addressId = "addr-" + Date.now();
    const addrDocRef = doc(db, "users", user.uid, "addresses", addressId);

    try {
      if (newAddressData.isDefault) {
        const addrColRef = collection(db, "users", user.uid, "addresses");
        const addrSnap = await getDocs(addrColRef);
        for (const d of addrSnap.docs) {
          if (d.data().isDefault) {
            await updateDoc(doc(db, "users", user.uid, "addresses", d.id), { isDefault: false });
          }
        }
      }

      await setDoc(addrDocRef, {
        label: newAddressData.label,
        street: newAddressData.street,
        city: newAddressData.city,
        state: newAddressData.state,
        zipCode: newAddressData.zipCode,
        isDefault: !!newAddressData.isDefault,
      });

      return await refetchProfileAndAddresses(user.uid);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/addresses/${addressId}`);
      throw error;
    }
  };

  const handleDeleteAddress = async (id: string): Promise<UserProfile> => {
    if (!user) throw new Error("Please Sign In with Google to manage your shipping addresses.");
    const addrDocRef = doc(db, "users", user.uid, "addresses", id);

    try {
      const currentAddrSnap = await getDoc(addrDocRef);
      const wasDefault = currentAddrSnap.exists() && currentAddrSnap.data().isDefault;

      await deleteDoc(addrDocRef);

      if (wasDefault) {
        const addrColRef = collection(db, "users", user.uid, "addresses");
        const addrSnap = await getDocs(addrColRef);
        if (!addrSnap.empty) {
          const firstDoc = addrSnap.docs[0];
          await updateDoc(doc(db, "users", user.uid, "addresses", firstDoc.id), { isDefault: true });
        }
      }

      return await refetchProfileAndAddresses(user.uid);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/addresses/${id}`);
      throw error;
    }
  };

  const handleSetDefaultAddress = async (id: string): Promise<UserProfile> => {
    if (!user) throw new Error("Please Sign In with Google to manage your shipping addresses.");
    try {
      const addrColRef = collection(db, "users", user.uid, "addresses");
      const addrSnap = await getDocs(addrColRef);
      for (const d of addrSnap.docs) {
        const isTarget = d.id === id;
        await updateDoc(doc(db, "users", user.uid, "addresses", d.id), { isDefault: isTarget });
      }
      return await refetchProfileAndAddresses(user.uid);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/addresses/${id}`);
      throw error;
    }
  };

  // 5. Profile action
  const handleUpdateProfile = async (data: { name: string; email: string; phone: string }): Promise<UserProfile> => {
    if (!user) throw new Error("Please Sign In with Google to edit your profile.");
    const userDocRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userDocRef, {
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
      return await refetchProfileAndAddresses(user.uid);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      throw error;
    }
  };

  // 6. Order Placement & Cancellation
  const handlePlaceOrder = async (orderPayload: any): Promise<Order> => {
    if (!user) throw new Error("Please Sign In with Google to place an order.");
    const orderId = "SWEET-" + Math.floor(100000 + Math.random() * 900000);
    const orderDocRef = doc(db, "users", user.uid, "orders", orderId);

    try {
      const newOrder: Order = {
        id: orderId,
        userEmail: user.email || orderPayload.userEmail || "",
        items: orderPayload.items,
        shippingAddress: orderPayload.shippingAddress,
        paymentMethod: orderPayload.paymentMethod,
        paymentDetails: orderPayload.paymentDetails || {},
        subtotal: orderPayload.subtotal,
        deliveryFee: orderPayload.deliveryFee,
        tax: orderPayload.tax,
        total: orderPayload.total,
        createdAt: new Date().toISOString(),
        status: OrderStatus.PLACED,
      };

      await setDoc(orderDocRef, newOrder);
      setCartItems([]); // Clean shopping bag
      await refetchOrders(user.uid);
      return newOrder;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/orders/${orderId}`);
      throw error;
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!user) throw new Error("Please Sign In with Google to cancel an order.");
    const orderDocRef = doc(db, "users", user.uid, "orders", orderId);

    try {
      const orderSnap = await getDoc(orderDocRef);
      if (!orderSnap.exists()) {
        throw new Error("Order not found.");
      }
      const orderData = orderSnap.data();
      if (orderData.status !== "Placed" && orderData.status !== "Preparing") {
        throw new Error("Only orders in 'Placed' or 'Preparing' status can be cancelled.");
      }

      await updateDoc(orderDocRef, { status: "Cancelled" });
      await refetchOrders(user.uid);

      const updatedOrder = {
        ...orderData,
        id: orderId,
        status: "Cancelled",
      } as Order;

      setLastCancelledOrder(updatedOrder);
      return updatedOrder;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/orders/${orderId}`);
    }
  };

  const handleNavigateToCheckout = () => {
    setLastPlacedOrder(null);
    setOnCheckoutView(true);
  };

  const renderSignInPrompt = (title: string, description: string) => (
    <div className="max-w-md mx-auto my-16 p-8 bg-white border border-pink-100 rounded-3xl shadow-sm text-center">
      <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <LogIn className="w-8 h-8 text-pink-500" />
      </div>
      <h3 className="font-serif italic text-2xl text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-8">{description}</p>
      <button
        onClick={handleLogin}
        className="w-full py-3.5 px-6 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm shadow-md shadow-pink-500/10 hover:shadow-pink-500/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        Sign In with Google
      </button>
    </div>
  );

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfaf9] text-gray-800 antialiased font-sans">
      {/* Header component */}
      <Header
        activeTab={onCheckoutView ? "home" : activeTab}
        setActiveTab={(tab) => {
          setOnCheckoutView(false);
          setLastPlacedOrder(null);
          setActiveTab(tab);
        }}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Main Area */}
      <main className="flex-grow">
        {onCheckoutView ? (
          !user ? (
            renderSignInPrompt("Checkout Securely", "Please sign in with Google to choose a shipping address and complete your cake purchase.")
          ) : (
            <CheckoutFlow
              cartItems={cartItems}
              savedAddresses={profile?.addresses || []}
              onAddAddress={handleAddAddress}
              onPlaceOrder={handlePlaceOrder}
              onOrderPlacedSuccess={(order) => {
                setLastPlacedOrder(order);
                setOnCheckoutView(false);
                setActiveTab("home");
              }}
              onCancelCheckout={() => setOnCheckoutView(false)}
            />
          )
        ) : (
          <>
            {activeTab === "home" && (
              <div className="animate-fade-in">
                {/* Hero / Slogan / Search Header */}
                <Hero
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-8">
                  {/* Catalog Menu Grid */}
                  <div className="w-full">
                    <CakeGrid
                      cakes={cakes}
                      loading={loadingCakes}
                      onSelectCake={(cake) => setSelectedCake(cake)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="animate-fade-in">
                {!user ? (
                  renderSignInPrompt("Track Your Orders", "Please sign in with Google to view and manage your order history.")
                ) : (
                  <OrdersTab
                    orders={orders}
                    onCancelOrder={handleCancelOrder}
                    onRefreshOrders={() => refetchOrders(user.uid)}
                    setActiveTab={setActiveTab}
                  />
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <div className="animate-fade-in">
                {!user ? (
                  renderSignInPrompt("Your Sweet Profile", "Please sign in with Google to manage your contact details and shipping addresses.")
                ) : (
                  <ProfileTab
                    profile={profile}
                    onUpdateProfile={handleUpdateProfile}
                    onAddAddress={handleAddAddress}
                    onDeleteAddress={handleDeleteAddress}
                    onSetDefaultAddress={handleSetDefaultAddress}
                    onRefreshProfile={() => refetchProfileAndAddresses(user.uid)}
                    onLogout={handleLogout}
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Custom Detail modal */}
      <CakeDetailModal
        cake={selectedCake}
        onClose={() => setSelectedCake(null)}
        onAddToBag={handleAddToBag}
      />

      {/* Order Confirmed modal */}
      <OrderConfirmedModal
        order={lastPlacedOrder}
        onClose={() => setLastPlacedOrder(null)}
        onTrackOrders={() => {
          setLastPlacedOrder(null);
          setActiveTab("orders");
        }}
      />

      {/* Order Cancelled modal */}
      <OrderCancelledModal
        order={lastCancelledOrder}
        onClose={() => setLastCancelledOrder(null)}
        onBrowseMenu={() => {
          setLastCancelledOrder(null);
          setActiveTab("home");
        }}
      />

      {/* Cart sidebar */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleNavigateToCheckout}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-pink-100 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-pink-100 rounded-full flex items-center justify-center">
              <span className="text-pink-600 font-serif font-bold text-lg">S</span>
            </div>
            <div>
              <p className="font-serif italic text-lg tracking-tight text-gray-700 leading-none">Sweet Bloom Bakery</p>
              <p className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold mt-1">Freshly Baked Daily</p>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            © 2026 Sweet Bloom Bakery Inc. Handcrafted gourmet recipes made with love in Sweetwater.
          </p>

          <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
            <span className="text-pink-400 font-semibold cursor-pointer">Terms</span>
            <span className="text-pink-400 font-semibold cursor-pointer">Bake Guidelines</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
