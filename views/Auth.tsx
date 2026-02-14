import React, { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import {
  Smartphone,
  ArrowRight,
  AlertCircle,
  Bike,
  User,
  Lock,
  Car,
  Hash,
  ShieldCheck,
  Wifi,
  WifiOff,
  Image,
} from "lucide-react";
import { db } from "../services/Database";

export const Auth = () => {
  const { login, signup } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debug State
  const [serverStatus, setServerStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");

  // Form State
  const [role, setRole] = useState<"USER" | "RIDER">("USER");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");

  // Rider Specific State
  const [vehicleType, setVehicleType] = useState<"BIKE" | "AUTO" | "CAR">(
    "BIKE",
  );
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  useEffect(() => {
    const check = async () => {
      const isUp = await db.healthCheck();
      setServerStatus(isUp ? "online" : "offline");
    };
    check();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!/^\d{11}$/.test(phone)) {
      setError("Phone number must be exactly 11 digits.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    if (!isLogin && !fullName) {
      setError("Full Name is required.");
      setLoading(false);
      return;
    }
    if (!isLogin && role === "RIDER" && (!vehicleNumber || !licenseNumber)) {
      setError("Vehicle and License details are required for Captains.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await login({ phoneNumber: phone, password });
      } else {
        const payload: any = {
          phoneNumber: phone,
          password,
          fullName,
          role,
          profileImage,
        };
        if (role === "RIDER") {
          payload.vehicleInfo = {
            vehicleType,
            vehicleNumber,
            drivingLicenseNumber: licenseNumber,
          };
        }
        await signup(payload);
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      // Give more helpful error if offline
      if (err.message.includes("Failed to fetch")) {
        setError(
          "Cannot connect to server. Please check if the backend is running.",
        );
      } else {
        setError(err.message || "An error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Changed layout to support scrolling for tall forms (like Signup with Rider details)
    <div className="h-full w-full bg-gray-900 overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center py-12 px-4">
        {/* STATUS BAR FOR DEBUGGING */}
        <div
          className={`mb-6 px-6 py-2 rounded-full flex items-center gap-2 text-sm font-bold border transition-colors duration-500 ${
            serverStatus === "online"
              ? "bg-green-900/50 text-green-400 border-green-800"
              : serverStatus === "offline"
                ? "bg-red-900/50 text-red-400 border-red-800 animate-pulse"
                : "bg-gray-800 text-gray-400 border-gray-700"
          }`}
        >
          {serverStatus === "online" ? (
            <Wifi size={16} />
          ) : (
            <WifiOff size={16} />
          )}
          {serverStatus === "online"
            ? "Backend Connected"
            : serverStatus === "offline"
              ? "Backend Offline (Check Terminal)"
              : "Checking Server..."}
        </div>

        <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col mb-8">
          {/* Header */}
          <div className="bg-yellow-400 p-8 text-center relative overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-yellow-300 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="inline-block p-3 bg-black rounded-xl mb-4 shadow-lg rotate-3">
                <Bike className="text-yellow-400" size={32} />
              </div>
              <h1 className="text-3xl font-black text-black tracking-tight">
                RapidoRide
              </h1>
              <p className="text-black/70 font-medium mt-1">
                Ride smarter, arrive faster.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Tab Switcher */}
            <div className="flex gap-4 mb-8 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                }}
                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${isLogin ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"}`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                }}
                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${!isLogin ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* SIGN UP ROLE SELECTOR */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div
                    onClick={() => setRole("USER")}
                    className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${role === "USER" ? "border-yellow-400 bg-yellow-50" : "border-gray-200"}`}
                  >
                    <User
                      size={24}
                      className={
                        role === "USER" ? "text-black" : "text-gray-400"
                      }
                    />
                    <span className="font-bold text-sm">Passenger</span>
                  </div>
                  <div
                    onClick={() => setRole("RIDER")}
                    className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${role === "RIDER" ? "border-yellow-400 bg-yellow-50" : "border-gray-200"}`}
                  >
                    <Bike
                      size={24}
                      className={
                        role === "RIDER" ? "text-black" : "text-gray-400"
                      }
                    />
                    <span className="font-bold text-sm">Captain</span>
                  </div>
                </div>
              )}

              {/* COMMON FIELDS */}
              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-yellow-400"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Smartphone
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-yellow-400"
                    placeholder="01712345678"
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                    Profile Image URL (Optional)
                  </label>
                  <div className="relative">
                    <Image
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-yellow-400"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-yellow-400"
                    placeholder="••••••"
                  />
                </div>
              </div>

              {/* RIDER ONLY FIELDS */}
              {!isLogin && role === "RIDER" && (
                <div className="space-y-4 pt-4 border-t border-gray-100 animate-slide-down">
                  <p className="text-sm font-bold text-yellow-600">
                    Captain Details
                  </p>

                  <div className="flex gap-2">
                    {["BIKE", "AUTO", "CAR"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setVehicleType(t as any)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border ${vehicleType === t ? "bg-black text-white border-black" : "bg-white text-gray-500 border-gray-200"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Vehicle Plate
                      </label>
                      <div className="relative">
                        <Hash
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          value={vehicleNumber}
                          onChange={(e) => setVehicleNumber(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-2 text-sm outline-none focus:border-yellow-400"
                          placeholder="DHK-1234"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        License No
                      </label>
                      <div className="relative">
                        <ShieldCheck
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-2 text-sm outline-none focus:border-yellow-400"
                          placeholder="DL-998877"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm font-medium animate-shake">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || serverStatus === "offline"}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading
                  ? "Processing..."
                  : isLogin
                    ? "Login"
                    : "Create Account"}
                {!loading && <ArrowRight size={20} />}
              </button>

              {serverStatus === "offline" && (
                <p className="text-xs text-red-500 text-center font-bold">
                  Start the backend to continue.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
