import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
const JWT_SECRET = "super_secret_rapido_key_12345"; // In production, use process.env

// Enable CORS allowing all origins with credentials
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// Handle Preflight requests explicitly
app.options("*", cors());

app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- MONGODB CONNECTION ---
const DB_CONNECT = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.PASSWORD}@cluster0.qwnp7az.mongodb.net/rapido-db?appName=Cluster0`;
// const DB_CONNECT = `mongodb+srv://rapido-website:aYCo7mrBsmCbNJhi@cluster0.qwnp7az.mongodb.net/rapido-db?appName=Cluster0`;

mongoose
  .connect(DB_CONNECT)
  .then(() => console.log("✅ Connected to Real MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// --- SCHEMAS ---

const UserSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      minlength: 11,
      maxlength: 11,
    },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    role: { type: String, default: "USER", enum: ["USER", "RIDER", "ADMIN"] },
    profileImage: { type: String, default: "" },
    vehicleInfo: {
      vehicleType: { type: String, enum: ["BIKE", "AUTO", "CAR"] },
      vehicleNumber: String,
      drivingLicenseNumber: String,
    },
    createdAt: { type: Number, default: Date.now },
  },
  { collection: "userCollection" },
);

const RideSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    riderId: { type: String, required: true },
    captainId: { type: String },
    status: { type: String, default: "SEARCHING" },
    pickup: { type: Object, required: true },
    dropoff: { type: Object, required: true },
    fare: Number,
    distance: Number,
    duration: Number,
    otp: String,
    createdAt: { type: Number, default: Date.now },
  },
  { collection: "rideCollection" },
);

const CaptainProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    vehicleNumber: String,
    vehicleModel: String,
    isOnline: { type: Boolean, default: false },
    currentLocation: Object,
    totalEarnings: { type: Number, default: 0 },
    ridesCompleted: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
  },
  { collection: "captainCollection" },
);

const User = mongoose.model("User", UserSchema);
const Ride = mongoose.model("Ride", RideSchema);
const CaptainProfile = mongoose.model("CaptainProfile", CaptainProfileSchema);

// --- MIDDLEWARE ---

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};

// --- ROUTES ---

const apiRouter = express.Router();

// Root check inside /api
apiRouter.get("/", (req, res) => {
  res.json({ status: "ok", message: "RapidoRide API is Running!" });
});

// Explicit Health Check
apiRouter.get("/health", (req, res) => {
  console.log("✅ Health check ping received");
  res.json({ status: "ok", timestamp: Date.now() });
});

// --- AUTH ROUTES ---

// Signup
apiRouter.post("/auth/signup", async (req, res) => {
  console.log("📝 Signup Request:", req.body.phoneNumber);
  try {
    const { phoneNumber, password, fullName, role, vehicleInfo, profileImage } =
      req.body;

    // Validation
    if (!phoneNumber || !password || !fullName) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (phoneNumber.length !== 11) {
      return res
        .status(400)
        .json({ message: "Phone number must be 11 digits" });
    }

    // Check existing
    const exist = await User.findOne({ phoneNumber });
    if (exist) return res.status(400).json({ message: "User already exists" });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = new User({
      phoneNumber,
      password: hashedPassword,
      fullName,
      role: role || "USER",
      vehicleInfo: role === "RIDER" ? vehicleInfo : undefined,
      profileImage: profileImage || "",
      createdAt: Date.now(),
    });

    await newUser.save();
    console.log("✅ User Saved:", newUser._id);

    // Auto Login (Generate Token)
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    const u = newUser.toObject();
    delete u.password;
    u.id = u._id.toString();

    res.json({ user: u, token });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Login
apiRouter.post("/auth/login", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const u = user.toObject();
    delete u.password;
    u.id = u._id.toString();

    res.json({ user: u, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Current User (Session Persistence)
apiRouter.get("/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    const u = user.toObject();
    u.id = u._id.toString();
    res.json(u);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Profile
apiRouter.put("/users/profile", authenticateToken, async (req, res) => {
  try {
    const { fullName, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, profileImage },
      { new: true },
    ).select("-password");

    const u = user.toObject();
    u.id = u._id.toString();
    res.json(u);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- RIDE ROUTES ---

apiRouter.get("/rides", async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json(rides.map((r) => ({ ...r.toObject(), _id: undefined })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

apiRouter.post("/rides", async (req, res) => {
  try {
    const newRide = new Ride(req.body);
    await newRide.save();
    console.log("🚖 New Ride Request:", newRide.id);
    res.json(newRide);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

apiRouter.put("/rides/:id", async (req, res) => {
  try {
    const { status, captainId } = req.body;
    const update = { status };
    if (captainId) update.captainId = captainId;

    const ride = await Ride.findOneAndUpdate({ id: req.params.id }, update, {
      new: true,
    });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- CAPTAIN ROUTES ---

apiRouter.get("/captains/:userId", async (req, res) => {
  try {
    let profile = await CaptainProfile.findOne({ userId: req.params.userId });

    // Auto-create profile logic if rider doesn't have one yet
    if (!profile) {
      // Fetch user to get vehicle details
      const user = await User.findById(req.params.userId);

      profile = new CaptainProfile({
        userId: req.params.userId,
        vehicleModel: user?.vehicleInfo?.vehicleType || "Bike",
        vehicleNumber: user?.vehicleInfo?.vehicleNumber || "Unknown",
        isOnline: false,
        currentLocation: {
          lat: 23.1634,
          lng: 89.2182,
          address: "Current Location",
        },
      });
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

apiRouter.put("/captains/:userId", async (req, res) => {
  try {
    const profile = await CaptainProfile.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true },
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Route
apiRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users.map((u) => ({ ...u.toObject(), id: u._id.toString() })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mount Router at /api
// This is the correct prefix.
// Frontend -> Proxy (/api) -> Backend (/api)
app.use("/api", apiRouter);

// Fallback for root 4000 access
app.get("/", (req, res) => {
  res.send("RapidoRide Backend is Running on Port 4000. Endpoints are at /api");
});

// Fallback 404 handler
app.use((req, res) => {
  console.log(`❌ 404 Not Found: ${req.url}`);
  res
    .status(404)
    .json({ message: `Backend 404: Route ${req.method} ${req.url} not found` });
});

const PORT = 4000; // Use Port 4000
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`),
);
