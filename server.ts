import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { INITIAL_CAKES } from "./src/cakesData";
import { UserProfile, Order, OrderStatus, UserAddress } from "./src/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "cake_shop_db.json");

// Helper to initialize and read/write DB
interface DatabaseSchema {
  profile: UserProfile;
  orders: Order[];
}

function initDb(): DatabaseSchema {
  const defaultProfile: UserProfile = {
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
        isDefault: true,
      },
      {
        id: "addr-office",
        label: "Office",
        street: "789 Enterprise Blvd, Floor 12",
        city: "San Francisco",
        state: "California",
        zipCode: "94107",
        isDefault: false,
      }
    ]
  };

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      profile: defaultProfile,
      orders: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file, resetting...", err);
    const initialData: DatabaseSchema = {
      profile: defaultProfile,
      orders: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }
}

function saveDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize DB
  const db = initDb();

  // API Endpoints
  // Get all cakes
  app.get("/api/cakes", (req, res) => {
    const { search, category } = req.query;
    let filtered = [...INITIAL_CAKES];

    if (category && category !== "All") {
      filtered = filtered.filter(c => c.category.toLowerCase() === (category as string).toLowerCase());
    }

    if (search) {
      const term = (search as string).toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.ingredients.some(i => i.toLowerCase().includes(term))
      );
    }

    res.json(filtered);
  });

  // Get current user profile
  app.get("/api/profile", (req, res) => {
    res.json(db.profile);
  });

  // Update profile
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

  // Add a new shipping address
  app.post("/api/addresses", (req, res) => {
    const { label, street, city, state, zipCode, isDefault } = req.body;
    if (!label || !street || !city || !state || !zipCode) {
      return res.status(400).json({ error: "All address fields are required" });
    }

    const newAddress: UserAddress = {
      id: "addr-" + Date.now(),
      label,
      street,
      city,
      state,
      zipCode,
      isDefault: !!isDefault
    };

    if (newAddress.isDefault) {
      db.profile.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    db.profile.addresses.push(newAddress);
    saveDb(db);
    res.status(201).json(db.profile);
  });

  // Update address
  app.put("/api/addresses/:id", (req, res) => {
    const { id } = req.params;
    const { label, street, city, state, zipCode, isDefault } = req.body;

    const index = db.profile.addresses.findIndex(addr => addr.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Address not found" });
    }

    if (isDefault) {
      db.profile.addresses.forEach(addr => {
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
      isDefault: isDefault !== undefined ? !!isDefault : db.profile.addresses[index].isDefault
    };

    saveDb(db);
    res.json(db.profile);
  });

  // Delete address
  app.delete("/api/addresses/:id", (req, res) => {
    const { id } = req.params;
    const index = db.profile.addresses.findIndex(addr => addr.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Address not found" });
    }

    const wasDefault = db.profile.addresses[index].isDefault;
    db.profile.addresses.splice(index, 1);

    // If we deleted the default address, make the first one default
    if (wasDefault && db.profile.addresses.length > 0) {
      db.profile.addresses[0].isDefault = true;
    }

    saveDb(db);
    res.json(db.profile);
  });

  // Get orders
  app.get("/api/orders", (req, res) => {
    res.json(db.orders);
  });

  // Place a new order
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

    const newOrder: Order = {
      id: "SWEET-" + Math.floor(100000 + Math.random() * 900000),
      userEmail: db.profile.email,
      items,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      subtotal,
      deliveryFee,
      tax,
      total,
      createdAt: new Date().toISOString(),
      status: OrderStatus.PLACED
    };

    db.orders.unshift(newOrder); // Add to the beginning of the list
    saveDb(db);
    res.status(201).json(newOrder);
  });

  // Cancel order
  app.put("/api/orders/:id/cancel", (req, res) => {
    const { id } = req.params;
    const orderIndex = db.orders.findIndex(o => o.id === id);

    if (orderIndex === -1) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = db.orders[orderIndex];
    if (order.status !== OrderStatus.PLACED && order.status !== OrderStatus.PREPARING) {
      return res.status(400).json({ error: "Only orders in 'Placed' or 'Preparing' status can be cancelled." });
    }

    db.orders[orderIndex].status = OrderStatus.CANCELLED;
    saveDb(db);
    res.json(db.orders[orderIndex]);
  });

  // Vite Integration for asset serving and index.html routing
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cake Shop server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
