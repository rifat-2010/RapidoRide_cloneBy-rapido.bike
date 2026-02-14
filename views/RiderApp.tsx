import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../contexts/AppContext";
import MapComponent from "../components/MapComponent";
import { INITIAL_LOCATION, RideStatus, Location, Suggestion } from "../types";
import {
  MapPin,
  Bike,
  ChevronLeft,
  Mic,
  Navigation,
  Home,
  Clock,
  Shield,
  AlertTriangle,
  Phone,
  FileText,
} from "lucide-react";

// Sub-components for Cleaner Code
const SafetyGuideTab = ({ onBack }: { onBack: () => void }) => (
  <div className="h-full bg-[#0f172a] text-white overflow-y-auto p-6 pb-24 animate-slide-up">
    {/* Header */}
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={onBack}
        className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-all"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>
      <h2 className="text-3xl font-black text-white m-0">Safety & Guide</h2>
    </div>

    {/* Emergency Section */}
    <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-2xl mb-8">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="text-red-500" size={28} />
        <h3 className="text-xl font-bold text-red-500">Emergency Help</h3>
      </div>
      <p className="text-gray-400 text-sm mb-4">
        If you feel unsafe or have an emergency during a ride, press the button
        below immediately.
      </p>
      <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
        <Phone size={20} /> Call SOS (999)
      </button>
    </div>

    <h3 className="font-bold text-lg mb-4 text-[#00E700]">How to Ride</h3>
    <div className="space-y-4">
      <div className="bg-[#1e293b] p-4 rounded-xl flex gap-4 items-start">
        <div className="bg-[#00E700] text-black w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
          1
        </div>
        <div>
          <h4 className="font-bold text-white">Select Destination</h4>
          <p className="text-sm text-gray-400 mt-1">
            Enter where you want to go. The app will calculate the fare.
          </p>
        </div>
      </div>
      <div className="bg-[#1e293b] p-4 rounded-xl flex gap-4 items-start">
        <div className="bg-[#00E700] text-black w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
          2
        </div>
        <div>
          <h4 className="font-bold text-white">Request Captain</h4>
          <p className="text-sm text-gray-400 mt-1">
            We will connect you to the nearest available captain.
          </p>
        </div>
      </div>
      <div className="bg-[#1e293b] p-4 rounded-xl flex gap-4 items-start">
        <div className="bg-[#00E700] text-black w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
          3
        </div>
        <div>
          <h4 className="font-bold text-white">Share OTP</h4>
          <p className="text-sm text-gray-400 mt-1">
            Provide the 4-digit OTP shown on your screen to the captain to
            start.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const ActivityTab = ({
  history,
  onBack,
}: {
  history: any[];
  onBack: () => void;
}) => (
  <div className="h-full bg-[#0f172a] text-white overflow-y-auto p-4 pb-24 animate-slide-up">
    {/* Header */}
    <div className="flex items-center gap-4 mb-6 px-2">
      <button
        onClick={onBack}
        className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-all"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>
      <h2 className="text-3xl font-black m-0">My Activity</h2>
    </div>

    {history.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Clock size={48} className="mb-4 opacity-50" />
        <p>No rides yet.</p>
      </div>
    ) : (
      <div className="space-y-4">
        {history.map((ride) => (
          <div
            key={ride.id}
            className="bg-[#1e293b] p-4 rounded-2xl border border-gray-800"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-gray-700 p-2 rounded-lg">
                  <Bike size={20} className="text-[#00E700]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">
                    {new Date(ride.createdAt).toLocaleDateString()} •{" "}
                    {new Date(ride.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="font-bold text-lg">₹{ride.fare}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                  ride.status === RideStatus.COMPLETED
                    ? "bg-green-900/50 text-green-400"
                    : ride.status === RideStatus.CANCELLED
                      ? "bg-red-900/50 text-red-400"
                      : "bg-yellow-900/50 text-yellow-400"
                }`}
              >
                {ride.status}
              </span>
            </div>
            <div className="relative pl-4 space-y-4">
              <div className="absolute left-[5px] top-2 bottom-6 w-0.5 bg-gray-700"></div>
              <div>
                <div className="w-3 h-3 rounded-full bg-[#00E700] absolute left-0 top-1.5"></div>
                <p className="text-xs text-gray-500">PICKUP</p>
                <p className="text-sm font-medium truncate">
                  {ride.pickup.address}
                </p>
              </div>
              <div>
                <div className="w-3 h-3 rounded-full bg-red-500 absolute left-0 top-[3.25rem]"></div>
                <p className="text-xs text-gray-500">DROP</p>
                <p className="text-sm font-medium truncate">
                  {ride.dropoff.address}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export const RiderApp = () => {
  const { currentRide, requestRide, cancelRide, allUsers, rideHistory } =
    useAppContext();

  // -- TAB STATE --
  const [activeTab, setActiveTab] = useState<"home" | "activity" | "guide">(
    "home",
  );

  // -- UI STATE (Map Interaction) --
  const [uiState, setUiState] = useState<
    "idle" | "searching" | "route_preview" | "ride_active"
  >("idle");

  // -- LOCATION STATE --
  const [pickup, setPickup] = useState<Location>(INITIAL_LOCATION);
  const [dropoff, setDropoff] = useState<Location | null>(null);

  // -- INPUT STATE --
  const [pickupInput, setPickupInput] = useState<string>("Current Location");
  const [dropoffInput, setDropoffInput] = useState<string>("");
  const [activeInputField, setActiveInputField] = useState<
    "pickup" | "dropoff"
  >("dropoff");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<any>(null);

  // -- ESTIMATES --
  const [fareEstimate, setFareEstimate] = useState<number>(0);
  const [distanceEstimate, setDistanceEstimate] = useState<number>(0);
  const [selectedVehicle, setSelectedVehicle] = useState<"bike" | "auto">(
    "bike",
  );

  const assignedCaptain = currentRide?.captainId
    ? allUsers.find((u) => u.id === currentRide.captainId)
    : null;

  // --- GEOLOCATION ON MOUNT ---
  useEffect(() => {
    if (!currentRide && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              {
                headers: { "User-Agent": "RapidoRide/1.0" },
              },
            );
            const data = await response.json();
            const addressName = data.display_name
              ? data.display_name.split(",")[0] +
                ", " +
                data.display_name.split(",")[1]
              : "My Location";

            const userLocation: Location = {
              lat: latitude,
              lng: longitude,
              address: addressName,
            };
            setPickup(userLocation);
            setPickupInput(addressName);
          } catch (e) {
            setPickup({
              lat: latitude,
              lng: longitude,
              address: "My Current Location",
            });
          }
        },
        (error) => console.error("Error getting location", error),
        { enableHighAccuracy: true },
      );
    }
  }, []);

  useEffect(() => {
    if (currentRide) {
      // If a ride is active, force Home tab
      setActiveTab("home");
      if (
        currentRide.status === RideStatus.COMPLETED ||
        currentRide.status === RideStatus.CANCELLED
      ) {
        setUiState("idle");
        setDropoff(null);
        setDropoffInput("");
      } else {
        setUiState("ride_active");
      }
    } else if (uiState === "ride_active") {
      setUiState("idle");
    }
  }, [currentRide]);

  // -- LOGIC --
  const handleSearchFocus = (field: "pickup" | "dropoff") => {
    setUiState("searching");
    setActiveInputField(field);
  };

  const handleInputChange = (text: string) => {
    if (activeInputField === "pickup") setPickupInput(text);
    else setDropoffInput(text);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (text.length > 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5&addressdetails=1`,
            {
              headers: { "User-Agent": "RapidoRide/1.0" },
            },
          );
          const data = await response.json();
          setSuggestions(
            data.map((item: any) => ({
              id: item.place_id.toString(),
              name: item.name || item.display_name.split(",")[0],
              address: item.display_name,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            })),
          );
        } catch (err) {
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      }, 500);
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (suggestion: Suggestion) => {
    const loc: Location = {
      lat: suggestion.lat,
      lng: suggestion.lng,
      address: suggestion.name,
    };

    if (activeInputField === "pickup") {
      setPickup(loc);
      setPickupInput(suggestion.name);
      if (!dropoff) {
        setActiveInputField("dropoff");
        setDropoffInput("");
        setSuggestions([]);
        return;
      }
    } else {
      setDropoff(loc);
      setDropoffInput(suggestion.name);
    }

    if (
      (activeInputField === "pickup" && dropoff) ||
      (activeInputField === "dropoff" && pickup)
    ) {
      calculateRoute(
        activeInputField === "pickup" ? loc : pickup,
        activeInputField === "dropoff" ? loc : dropoff!,
      );
      setUiState("route_preview");
    }
  };

  const calculateRoute = (start: Location, end: Location) => {
    const R = 6371;
    const dLat = (end.lat - start.lat) * (Math.PI / 180);
    const dLon = (end.lng - start.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(start.lat * (Math.PI / 180)) *
        Math.cos(end.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const dist = parseFloat(
      (R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))).toFixed(1),
    );
    setDistanceEstimate(dist > 0.5 ? dist : 1.2);
    setFareEstimate(Math.round(25 + dist * 15));
  };

  const handleRequestRide = async () => {
    if (dropoff)
      await requestRide(pickup, dropoff, fareEstimate, distanceEstimate);
  };

  // --- RENDERERS ---

  if (uiState === "searching") {
    return (
      <div className="fixed inset-0 bg-[#0f172a] z-50 flex flex-col text-white">
        <div className="p-4 bg-[#1e293b]">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setUiState(dropoff ? "route_preview" : "idle")}
              className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-lg font-bold">Select Location</h2>
          </div>
          <div className="flex flex-col gap-4 relative">
            <div className="absolute left-[1.3rem] top-10 bottom-10 w-0.5 bg-gray-600 border-l border-dashed border-gray-500 z-0"></div>
            <div className="relative z-10">
              <div className="w-3 h-3 rounded-full absolute left-4 top-1/2 -translate-y-1/2 bg-[#00E700] shadow-[0_0_10px_#00E700]"></div>
              <input
                value={pickupInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => handleSearchFocus("pickup")}
                placeholder="Pickup"
                className="w-full bg-[#334155] p-4 pl-12 rounded-xl outline-none border border-transparent focus:border-[#00E700] text-white placeholder-gray-400"
              />
            </div>
            <div className="relative z-10">
              <div className="w-3 h-3 bg-red-500 absolute left-4 top-1/2 -translate-y-1/2 rotate-45"></div>
              <input
                autoFocus={activeInputField === "dropoff"}
                value={dropoffInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => handleSearchFocus("dropoff")}
                placeholder="Where to?"
                className="w-full bg-[#334155] p-4 pl-12 rounded-xl outline-none border border-transparent focus:border-red-500 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-[#0f172a] p-4">
          {isSearching && (
            <div className="text-gray-400 text-center p-4">
              Searching places...
            </div>
          )}
          {suggestions.map((sug) => (
            <div
              key={sug.id}
              onClick={() => handleSelectLocation(sug)}
              className="p-4 border-b border-gray-800 flex items-center gap-4 cursor-pointer hover:bg-gray-800 rounded-lg"
            >
              <div className="bg-gray-800 p-2 rounded-full text-gray-400">
                <MapPin size={20} />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-gray-200 truncate">{sug.name}</h4>
                <p className="text-sm text-gray-500 truncate">{sug.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- MAIN STRUCTURE WITH TABS ---
  return (
    <div className="h-full w-full flex flex-col bg-black text-white font-sans overflow-hidden">
      {/* CONTENT AREA */}
      <div className="flex-1 relative overflow-hidden">
        {/* HOME TAB (Map & Booking) */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${activeTab === "home" ? "opacity-100 z-10" : "opacity-0 -z-10"}`}
        >
          <div className="h-full w-full relative">
            <div className="absolute inset-0 z-0">
              <MapComponent
                center={pickup}
                destination={dropoff || undefined}
                showRoute={!!dropoff}
              />
            </div>

            {uiState === "idle" && (
              <div className="absolute top-0 left-0 right-0 p-4 z-10 flex flex-col gap-4">
                <div
                  onClick={() => handleSearchFocus("dropoff")}
                  className="bg-[#1e293b]/90 backdrop-blur rounded-full p-3 px-5 flex items-center gap-3 shadow-lg pointer-events-auto border border-gray-700 cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full bg-[#00E700] animate-pulse"></div>
                  <span className="text-gray-400 font-medium">Where to?</span>
                  <Mic className="ml-auto text-gray-500" size={20} />
                </div>
              </div>
            )}

            {uiState === "route_preview" && (
              <div className="absolute bottom-0 left-0 right-0 bg-[#0f172a] rounded-t-3xl p-6 z-20 border-t border-gray-800 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-slide-up pb-24">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Choose a ride
                </h2>
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                  <div
                    onClick={() => setSelectedVehicle("bike")}
                    className={`min-w-[140px] p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedVehicle === "bike" ? "bg-[#00E700]/10 border-[#00E700]" : "bg-[#1e293b] border-transparent"}`}
                  >
                    <Bike
                      className={
                        selectedVehicle === "bike"
                          ? "text-[#00E700]"
                          : "text-gray-400"
                      }
                      size={28}
                    />
                    <h3 className="font-bold text-lg mt-2">Bike</h3>
                    <p className="text-xl font-bold mt-1">₹{fareEstimate}</p>
                  </div>
                </div>
                <button
                  onClick={handleRequestRide}
                  className="w-full bg-[#00E700] hover:bg-[#00c000] text-black py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2"
                >
                  CONFIRM NEUROX RIDE
                </button>
              </div>
            )}

            {uiState === "ride_active" && currentRide && (
              <div className="absolute bottom-0 left-0 right-0 z-20 pb-20">
                <div className="bg-[#0f172a] rounded-t-3xl p-6 border-t border-gray-800">
                  {/* DYNAMIC STATUS DISPLAY */}
                  <div className="mb-6 text-center">
                    {currentRide.status === RideStatus.SEARCHING && (
                      <div className="animate-pulse">
                        <h3 className="text-xl font-bold text-yellow-400 mb-1">
                          Searching for Captains...
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Please wait while we connect you.
                        </p>
                      </div>
                    )}
                    {(currentRide.status === RideStatus.ACCEPTED ||
                      currentRide.status === RideStatus.ARRIVING) && (
                      <div>
                        <h3 className="text-xl font-bold text-[#00E700] mb-1">
                          Rider on the way!
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Arriving in {currentRide.duration} mins
                        </p>
                      </div>
                    )}
                    {currentRide.status === RideStatus.IN_PROGRESS && (
                      <div>
                        <h3 className="text-xl font-bold text-blue-400 mb-1">
                          Ride in Progress
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Heading to destination
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CAPTAIN DETAILS */}
                  {(currentRide.status === RideStatus.ACCEPTED ||
                    currentRide.status === RideStatus.ARRIVING ||
                    currentRide.status === RideStatus.IN_PROGRESS) && (
                    <div className="flex items-center gap-4 mb-8 bg-[#1e293b] p-4 rounded-xl border border-gray-700">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#00E700] bg-gray-800">
                        <img
                          src={
                            assignedCaptain?.profileImage ||
                            `https://ui-avatars.com/api/?name=${assignedCaptain?.fullName || "Captain"}&background=random`
                          }
                          alt="Captain"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">
                          {assignedCaptain?.fullName || "Captain Found"}
                        </h3>
                        <p className="text-xs text-gray-400 font-mono">
                          {assignedCaptain?.vehicleInfo
                            ? `${assignedCaptain.vehicleInfo.vehicleType} • ${assignedCaptain.vehicleInfo.vehicleNumber}`
                            : "Vehicle Info Hidden"}
                        </p>
                      </div>
                      <div className="bg-[#00E700] px-2 py-1 rounded text-black font-bold text-xs">
                        OTP: {currentRide.otp}
                      </div>
                    </div>
                  )}

                  {currentRide.status === RideStatus.SEARCHING ||
                  currentRide.status === RideStatus.REQUESTED ? (
                    <button
                      onClick={cancelRide}
                      className="w-full bg-red-600/20 text-red-500 border border-red-600/50 py-4 rounded-xl font-bold"
                    >
                      Cancel Request
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ACTIVITY TAB */}
        {activeTab === "activity" && (
          <ActivityTab
            history={rideHistory}
            onBack={() => setActiveTab("home")}
          />
        )}

        {/* GUIDE TAB */}
        {activeTab === "guide" && (
          <SafetyGuideTab onBack={() => setActiveTab("home")} />
        )}
      </div>

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <div className="bg-[#0f172a] border-t border-gray-800 p-2 pb-6 flex justify-around items-center z-50 shrink-0">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === "home" ? "text-[#00E700]" : "text-gray-500 hover:text-gray-300"}`}
        >
          <Home size={24} strokeWidth={activeTab === "home" ? 3 : 2} />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button
          onClick={() => setActiveTab("activity")}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === "activity" ? "text-[#00E700]" : "text-gray-500 hover:text-gray-300"}`}
        >
          <Clock size={24} strokeWidth={activeTab === "activity" ? 3 : 2} />
          <span className="text-[10px] font-bold">Activity</span>
        </button>

        <button
          onClick={() => setActiveTab("guide")}
          className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === "guide" ? "text-[#00E700]" : "text-gray-500 hover:text-gray-300"}`}
        >
          <Shield size={24} strokeWidth={activeTab === "guide" ? 3 : 2} />
          <span className="text-[10px] font-bold">Safety</span>
        </button>
      </div>
    </div>
  );
};
