var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_url = require("url");
var import_vite = require("vite");

// src/cakesData.ts
var INITIAL_CAKES = [
  {
    id: "strawberry-blush",
    name: "Strawberry Blush Mousse",
    description: "Our signature airy vanilla sponge covered in velvety fresh strawberry mousse, topped with glazed handpicked berries and white chocolate curls. Elegantly light and sweet.",
    price: 34.99,
    category: "Signature",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 142,
    sizes: ["0.5kg", "1kg", "2kg"],
    flavors: ["Strawberry Dream", "Strawberry Vanilla Twirl"],
    preparationTime: "3 hours",
    ingredients: ["Fresh Strawberries", "Organic Cream", "Vanilla Bean", "Pastry Flour", "Sugar Bloom"]
  },
  {
    id: "belgian-truffle",
    name: "Belgian Chocolate Truffle",
    description: "An indulgent three-layer rich Dutch cocoa sponge filled and frosted with gourmet Belgian dark chocolate ganache, topped with handmade chocolate truffles and dust.",
    price: 38.5,
    category: "Chocolate",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 218,
    sizes: ["0.5kg", "1kg", "2kg", "3kg"],
    flavors: ["Decadent Dark Truffle", "Milk Chocolate Fudge", "Mocha Hazelnut Twist"],
    preparationTime: "4 hours",
    ingredients: ["Belgian Dark Chocolate", "Dutch Cocoa", "Fresh Cream", "Grass-fed Butter", "Vanilla Extract"]
  },
  {
    id: "raspberry-rose",
    name: "Raspberry Rose Macaron Cake",
    description: "A gorgeous, modern pastry showpiece with layered almond dacquoise, delicate rosewater infused buttercream, fresh raspberries, and premium miniature pink macarons.",
    price: 45,
    category: "Signature",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80",
    rating: 5,
    reviewsCount: 88,
    sizes: ["1kg", "2kg"],
    flavors: ["Rosewater & Raspberry Infusion"],
    preparationTime: "5 hours",
    ingredients: ["Almond Flour", "Raspberry Compote", "Rosewater Essence", "Egg Whites", "French Buttercream"]
  },
  {
    id: "classic-red-velvet",
    name: "Red Velvet Elegance",
    description: "A timeless classic of velvety cocoa sponge with a striking deep crimson shade, balanced by thick layers of whipped Madagascar vanilla cream cheese frosting.",
    price: 32,
    category: "Classic",
    image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 164,
    sizes: ["0.5kg", "1kg", "2kg"],
    flavors: ["Traditional Cream Cheese", "White Chocolate Mousse Filling"],
    preparationTime: "3 hours",
    ingredients: ["Cocoa Powder", "Buttermilk", "Vanilla Bean", "Cream Cheese", "Beet Juice Extract"]
  },
  {
    id: "mango-passionfruit",
    name: "Mango Passionfruit Paradise",
    description: "A bright, summery treat layered with soft buttermilk sponge, luscious fresh Alphonso mango pur\xE9e, and sharp tangy passionfruit curd, frosted with mango whip.",
    price: 36,
    category: "Fruity",
    image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 95,
    sizes: ["0.5kg", "1kg", "2kg"],
    flavors: ["Mango Whip & Curd", "Tropical Coconut Base"],
    preparationTime: "3 hours",
    ingredients: ["Alphonso Mango", "Passionfruit Curd", "Heavy Cream", "Zesty Lime Juice", "Buttermilk Cake"]
  },
  {
    id: "matcha-sakura",
    name: "Matcha Sakura Bloom",
    description: "A delicate East Asian-inspired cake with premium ceremonial Japanese matcha green tea layers, offset by sweet sakura blossom Swiss meringue buttercream.",
    price: 42,
    category: "Vegan",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewsCount: 57,
    sizes: ["1kg", "2kg"],
    flavors: ["Matcha & Sakura", "Matcha & Sweet Red Bean"],
    preparationTime: "4 hours",
    ingredients: ["Uji Matcha Powder", "Sakura Buttercream", "Coconut Milk Cream", "Organic Raw Sugar", "Almond Milk"]
  },
  {
    id: "salted-caramel-pecan",
    name: "Salted Caramel Pecan Drip",
    description: "A warm, comforting brown butter cake layered with rich salted caramel sauce, toasted crunch pecans, and frosted with caramel buttercream and golden drips.",
    price: 39.99,
    category: "Classic",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 112,
    sizes: ["0.5kg", "1kg", "2kg"],
    flavors: ["Double Salted Caramel", "Caramel Pecan Blend"],
    preparationTime: "3 hours",
    ingredients: ["Brown Butter Cake", "Pecans", "Himalayan Pink Salt", "Caramel Drip", "Whipped Frosting"]
  },
  {
    id: "vanilla-orchid",
    name: "Vanilla Bean Orchid Blossom",
    description: "Exquisite pure vanilla bean sponge layers filled with vanilla custard, elegantly piped with pastel pink and white floral petals using high-quality Swiss buttercream.",
    price: 35,
    category: "Classic",
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 103,
    sizes: ["0.5kg", "1kg", "2kg"],
    flavors: ["Madagascar Vanilla Custard", "Vanilla Almond Blossom"],
    preparationTime: "3 hours",
    ingredients: ["Madagascar Vanilla Pods", "Swiss Buttercream", "Egg Yolks", "Cake Flour", "Whole Milk"]
  }
];

// server.ts
var import_meta = {};
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
var PORT = 3e3;
var DB_FILE = import_path.default.join(process.cwd(), "cake_shop_db.json");
function initDb() {
  const defaultProfile = {
    name: "Mukesh Kumar",
    email: "captainmukesh775@gmail.com",
    phone: "+1 (555) 019-2834",
    addresses: [
      {
        id: "addr-home",
        label: "Home",
        street: "456 Sakura Blossom Lane, Apt 2B",
        city: "Sweetwater",
        state: "California",
        zipCode: "90210",
        isDefault: true
      },
      {
        id: "addr-office",
        label: "Office",
        street: "789 Enterprise Blvd, Floor 12",
        city: "San Francisco",
        state: "California",
        zipCode: "94107",
        isDefault: false
      }
    ]
  };
  if (!import_fs.default.existsSync(DB_FILE)) {
    const initialData = {
      profile: defaultProfile,
      orders: []
    };
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }
  try {
    const raw = import_fs.default.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file, resetting...", err);
    const initialData = {
      profile: defaultProfile,
      orders: []
    };
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }
}
function saveDb(data) {
  try {
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}
async function startServer() {
  const app = (0, import_express.default)();
  app.use(import_express.default.json());
  const db = initDb();
  app.get("/api/cakes", (req, res) => {
    const { search, category } = req.query;
    let filtered = [...INITIAL_CAKES];
    if (category && category !== "All") {
      filtered = filtered.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (c) => c.name.toLowerCase().includes(term) || c.description.toLowerCase().includes(term) || c.ingredients.some((i) => i.toLowerCase().includes(term))
      );
    }
    res.json(filtered);
  });
  app.get("/api/profile", (req, res) => {
    res.json(db.profile);
  });
  app.put("/api/profile", (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email are required fields" });
    }
    db.profile.name = name;
    db.profile.email = email;
    db.profile.phone = phone || "";
    saveDb(db);
    res.json(db.profile);
  });
  app.post("/api/addresses", (req, res) => {
    const { label, street, city, state, zipCode, isDefault } = req.body;
    if (!label || !street || !city || !state || !zipCode) {
      return res.status(400).json({ error: "All address fields are required" });
    }
    const newAddress = {
      id: "addr-" + Date.now(),
      label,
      street,
      city,
      state,
      zipCode,
      isDefault: !!isDefault
    };
    if (newAddress.isDefault) {
      db.profile.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }
    db.profile.addresses.push(newAddress);
    saveDb(db);
    res.status(201).json(db.profile);
  });
  app.put("/api/addresses/:id", (req, res) => {
    const { id } = req.params;
    const { label, street, city, state, zipCode, isDefault } = req.body;
    const index = db.profile.addresses.findIndex((addr) => addr.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Address not found" });
    }
    if (isDefault) {
      db.profile.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }
    db.profile.addresses[index] = {
      ...db.profile.addresses[index],
      label: label || db.profile.addresses[index].label,
      street: street || db.profile.addresses[index].street,
      city: city || db.profile.addresses[index].city,
      state: state || db.profile.addresses[index].state,
      zipCode: zipCode || db.profile.addresses[index].zipCode,
      isDefault: isDefault !== void 0 ? !!isDefault : db.profile.addresses[index].isDefault
    };
    saveDb(db);
    res.json(db.profile);
  });
  app.delete("/api/addresses/:id", (req, res) => {
    const { id } = req.params;
    const index = db.profile.addresses.findIndex((addr) => addr.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Address not found" });
    }
    const wasDefault = db.profile.addresses[index].isDefault;
    db.profile.addresses.splice(index, 1);
    if (wasDefault && db.profile.addresses.length > 0) {
      db.profile.addresses[0].isDefault = true;
    }
    saveDb(db);
    res.json(db.profile);
  });
  app.get("/api/orders", (req, res) => {
    res.json(db.orders);
  });
  app.post("/api/orders", (req, res) => {
    const { items, shippingAddress, paymentMethod, paymentDetails, subtotal, deliveryFee, tax, total } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart cannot be empty" });
    }
    if (!shippingAddress) {
      return res.status(400).json({ error: "Shipping address is required" });
    }
    if (!paymentMethod) {
      return res.status(400).json({ error: "Payment method is required" });
    }
    const newOrder = {
      id: "SWEET-" + Math.floor(1e5 + Math.random() * 9e5),
      userEmail: db.profile.email,
      items,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      subtotal,
      deliveryFee,
      tax,
      total,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "Placed" /* PLACED */
    };
    db.orders.unshift(newOrder);
    saveDb(db);
    res.status(201).json(newOrder);
  });
  app.put("/api/orders/:id/cancel", (req, res) => {
    const { id } = req.params;
    const orderIndex = db.orders.findIndex((o) => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: "Order not found" });
    }
    const order = db.orders[orderIndex];
    if (order.status !== "Placed" /* PLACED */ && order.status !== "Preparing" /* PREPARING */) {
      return res.status(400).json({ error: "Only orders in 'Placed' or 'Preparing' status can be cancelled." });
    }
    db.orders[orderIndex].status = "Cancelled" /* CANCELLED */;
    saveDb(db);
    res.json(db.orders[orderIndex]);
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cake Shop server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
