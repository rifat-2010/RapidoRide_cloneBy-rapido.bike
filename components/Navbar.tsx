import React from "react";
import { useAppContext } from "../contexts/AppContext";
import {
  Smartphone,
  Bike,
  LayoutDashboard,
  Globe,
  LogOut,
  User as UserIcon,
} from "lucide-react";

interface NavbarProps {
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onWebsiteClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onProfileClick,
  onHomeClick,
  onWebsiteClick,
}) => {
  const { currentUser, logout } = useAppContext();

  if (!currentUser) return null;

  return (
    <div className="bg-slate-900 text-white p-2 flex justify-between items-center shadow-md z-50 relative shrink-0">
      <div
        className="flex items-center gap-2 px-2 cursor-pointer"
        onClick={onHomeClick}
      >
        <div className="font-bold text-yellow-400 text-lg tracking-wider">
          RapidoRide
        </div>
        <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300 hidden sm:inline-block">
          {currentUser.fullName.split(" ")[0]} ({currentUser.role})
        </span>
      </div>

      <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
        {currentUser.role === "USER" && (
          <button
            onClick={onHomeClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-yellow-400 text-black shadow-sm"
          >
            <Smartphone size={14} />{" "}
            <span className="hidden sm:inline">Book Ride</span>
          </button>
        )}

        {currentUser.role === "RIDER" && (
          <button
            onClick={onHomeClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-yellow-400 text-black shadow-sm"
          >
            <Bike size={14} />{" "}
            <span className="hidden sm:inline">Dashboard</span>
          </button>
        )}

        {currentUser.role === "ADMIN" && (
          <button
            onClick={onHomeClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-yellow-400 text-black shadow-sm"
          >
            <LayoutDashboard size={14} />{" "}
            <span className="hidden sm:inline">Admin</span>
          </button>
        )}

        <button
          onClick={onWebsiteClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:bg-slate-700 transition-all"
        >
          <Globe size={14} /> <span className="hidden sm:inline">Website</span>
        </button>

        <button
          onClick={onProfileClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:bg-slate-700 transition-all"
        >
          <UserIcon size={14} />{" "}
          <span className="hidden sm:inline">Profile</span>
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-red-400 hover:bg-red-900/30 transition-all"
        >
          <LogOut size={14} />
        </button>
      </div>
    </div>
  );
};
