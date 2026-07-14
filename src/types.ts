export interface Cake {
  id: string;
  name: string;
  description: string;
  price: number; // in USD or local currency
  category: "Classic" | "Signature" | "Fruity" | "Chocolate" | "Vegan";
  image: string; // URL of illustration or stock photo
  rating: number;
  reviewsCount: number;
  sizes: string[]; // e.g. ["0.5kg", "1kg", "2kg"]
  flavors: string[]; // e.g. ["Classic Vanilla", "Chocolate Mousse", "Raspberry Dream"]
  preparationTime: string; // e.g. "3 hours"
  ingredients: string[];
}

export interface UserAddress {
  id: string;
  label: string; // e.g. "Home", "Office"
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  addresses: UserAddress[];
}

export interface CartItem {
  cake: Cake;
  quantity: number;
  selectedSize: string;
  selectedFlavor: string;
  customMessage?: string; // e.g. "Happy Birthday Mukesh!"
}

export enum OrderStatus {
  PLACED = "Placed",
  PREPARING = "Preparing",
  OUT_FOR_DELIVERY = "Out for Delivery",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled"
}

export interface Order {
  id: string;
  userEmail: string;
  items: {
    cakeId: string;
    cakeName: string;
    cakeImage: string;
    quantity: number;
    size: string;
    flavor: string;
    priceAtPurchase: number;
    customMessage?: string;
  }[];
  shippingAddress: UserAddress;
  paymentMethod: "Card" | "Digital Wallet" | "Cash on Delivery";
  paymentDetails?: {
    cardLast4?: string;
    walletProvider?: string;
  };
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  createdAt: string; // ISO string
  status: OrderStatus;
}
