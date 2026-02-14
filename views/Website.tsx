import React, { useState } from "react";
import {
  Bike,
  Shield,
  Clock,
  MapPin,
  Menu,
  X,
  Instagram,
  Twitter,
  Facebook,
  ArrowRight,
  Smartphone,
  Wallet,
  Star,
  Zap,
  Navigation,
  CheckCircle,
  TrendingUp,
  Package,
  Users,
  HeartHandshake,
  Map,
  ArrowUpRight,
} from "lucide-react";

interface WebsiteProps {
  onNavigateToAuth?: () => void;
  isAuthenticated?: boolean;
  onNavigateToDashboard?: () => void;
}

export const Website: React.FC<WebsiteProps> = ({
  onNavigateToAuth,
  isAuthenticated,
  onNavigateToDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState<"RIDER" | "CAPTAIN">(
    "RIDER",
  );

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAction = () => {
    if (isAuthenticated && onNavigateToDashboard) {
      onNavigateToDashboard();
    } else if (onNavigateToAuth) {
      onNavigateToAuth();
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-white text-gray-900 scroll-smooth font-sans selection:bg-yellow-400 selection:text-black">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: scroll 30s linear infinite;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => scrollToSection("home")}
            >
              <div className="bg-yellow-400 p-2 rounded-xl shadow-[3px_3px_0px_black] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all border-2 border-black">
                <Bike size={24} className="text-black fill-black" />
              </div>
              <span className="font-black text-2xl tracking-tighter italic">
                Rapido<span className="text-yellow-500">Ride</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8 font-bold text-sm tracking-wide">
              {["About", "Services", "How it Works", "Blog"].map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    scrollToSection(item.toLowerCase().replace(/\s+/g, "-"))
                  }
                  className="hover:text-yellow-600 transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
                </button>
              ))}

              <button
                onClick={handleAction}
                className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all shadow-[4px_4px_0px_#facc15] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] flex items-center gap-2"
              >
                {isAuthenticated ? "Dashboard" : "Download App"}
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-black"
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 absolute w-full shadow-2xl animate-slide-down z-50">
            <div className="flex flex-col p-6 space-y-6 font-bold text-lg text-center">
              {["About", "Services", "How it Works", "Blog"].map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    scrollToSection(item.toLowerCase().replace(/\s+/g, "-"))
                  }
                  className="hover:text-yellow-500"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => {
                  handleAction();
                  setMobileMenuOpen(false);
                }}
                className="bg-yellow-400 text-black px-5 py-4 rounded-xl shadow-md font-black"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get the App"}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section
        id="home"
        className="relative bg-[#FACC15] overflow-hidden pt-12 pb-24 lg:pt-32 lg:pb-48"
      >
        {/* Background Patterns */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(#000 1.5px, transparent 1.5px)",
            backgroundSize: "30px 30px",
          }}
        ></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[150px] opacity-40 mix-blend-overlay"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-black text-yellow-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 animate-pulse">
                <Zap size={14} fill="currentColor" /> India's #1 Bike Taxi
              </div>
              <h1 className="text-6xl lg:text-8xl font-black text-black leading-[0.9] mb-8 tracking-tighter">
                BEAT THE <br />
                <span className="text-white drop-shadow-xl stroke-black">
                  TRAFFIC.
                </span>
              </h1>
              <p className="text-xl text-black/80 mb-10 max-w-lg mx-auto lg:mx-0 font-bold leading-relaxed">
                The fastest way to travel in the city. Affordable, safe, and
                always on time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleAction}
                  className="bg-black text-white px-8 py-5 rounded-full font-bold text-lg hover:bg-gray-900 transition-all shadow-2xl flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isAuthenticated ? "Go to Dashboard" : "Download App"}{" "}
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                  <div className="absolute inset-0 bg-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </button>
                <button
                  onClick={
                    isAuthenticated
                      ? handleAction
                      : () => scrollToSection("captain")
                  }
                  className="bg-white text-black border-2 border-black px-8 py-5 rounded-full font-bold text-lg hover:bg-black hover:text-white transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  Sign up as Captain
                </button>
              </div>
            </div>

            {/* Hero Image / Visuals */}
            <div className="lg:w-1/2 relative mt-12 lg:mt-0">
              <div className="relative z-10 hover:scale-[1.02] transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1558981806-ec527fa84f3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                  alt="Bike Taxi"
                  className="rounded-[3rem] shadow-[20px_20px_0px_rgba(0,0,0,1)] border-4 border-black w-full max-w-lg mx-auto grayscale hover:grayscale-0 transition-all duration-700"
                />

                {/* Floating UI Cards */}
                <div className="absolute -bottom-10 -left-6 bg-white p-5 rounded-2xl shadow-[8px_8px_0px_black] border-2 border-black flex items-center gap-4 animate-bounce-slow">
                  <div className="bg-green-100 p-3 rounded-xl border-2 border-black text-green-700">
                    <Shield size={28} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">
                      Safety Status
                    </p>
                    <p className="font-black text-lg">100% Insured</p>
                  </div>
                </div>

                <div className="absolute top-10 -right-6 bg-black text-white p-5 rounded-2xl shadow-[8px_8px_0px_white] flex items-center gap-4">
                  <div className="bg-yellow-400 p-3 rounded-xl border-2 border-white text-black">
                    <Clock size={28} />
                  </div>
                  <div>
                    <p className="text-xs text-yellow-400 font-bold uppercase">
                      Pickup Time
                    </p>
                    <p className="font-black text-lg">~2 Mins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT US --- */}
      <section
        id="about"
        className="py-24 bg-black text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500 rounded-full blur-[150px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-end gap-12 mb-16">
            <div className="lg:w-1/2">
              <span className="text-yellow-400 font-bold tracking-widest uppercase text-xs">
                About Us
              </span>
              <h2 className="text-4xl lg:text-6xl font-black mt-4 leading-tight">
                We move India, <br />{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                  one ride at a time.
                </span>
              </h2>
            </div>
            <div className="lg:w-1/2">
              <p className="text-gray-400 text-lg leading-relaxed border-l-4 border-yellow-500 pl-6">
                Founded in 2015, RapidoRide is India's largest bike taxi
                platform. We are on a mission to solve the last-mile commute
                problem by connecting passengers with captains for a faster,
                cheaper, and safer ride.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Downloads", val: "10M+" },
              { label: "Cities", val: "100+" },
              { label: "Captains", val: "1M+" },
              { label: "Happy Rides", val: "500M+" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-gray-900 p-8 rounded-3xl border border-gray-800 hover:border-yellow-400 transition-colors"
              >
                <h3 className="text-4xl font-black text-white mb-2">
                  {stat.val}
                </h3>
                <p className="text-gray-500 uppercase text-xs font-bold tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- OUR SERVICES --- */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              Our Services
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              More than just a bike taxi. We provide comprehensive mobility
              solutions tailored for the urban rush.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Bike */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 bg-yellow-100 w-32 h-32 rounded-full group-hover:bg-yellow-400 transition-colors"></div>
              <div className="relative z-10">
                <div className="bg-black w-14 h-14 rounded-full flex items-center justify-center text-yellow-400 mb-6">
                  <Bike size={28} />
                </div>
                <h3 className="text-2xl font-black mb-3">Bike Taxi</h3>
                <p className="text-gray-500 mb-6">
                  Beat the traffic with the fastest and most affordable way to
                  travel in the city.
                </p>
                <ul className="space-y-2 text-sm font-bold text-gray-700">
                  <li className="flex gap-2">
                    <CheckCircle size={16} className="text-green-500" /> Helmet
                    Provided
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle size={16} className="text-green-500" /> Insured
                    Rides
                  </li>
                </ul>
              </div>
            </div>

            {/* Auto */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 bg-green-100 w-32 h-32 rounded-full group-hover:bg-green-400 transition-colors"></div>
              <div className="relative z-10">
                <div className="bg-black w-14 h-14 rounded-full flex items-center justify-center text-green-400 mb-6">
                  <Users size={28} />
                </div>
                <h3 className="text-2xl font-black mb-3">Auto Rickshaw</h3>
                <p className="text-gray-500 mb-6">
                  No haggling, no waiting. Get an auto at your doorstep with
                  meter-based pricing.
                </p>
                <ul className="space-y-2 text-sm font-bold text-gray-700">
                  <li className="flex gap-2">
                    <CheckCircle size={16} className="text-green-500" />{" "}
                    Doorstep Pickup
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle size={16} className="text-green-500" /> Fixed
                    Pricing
                  </li>
                </ul>
              </div>
            </div>

            {/* Parcel */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 bg-blue-100 w-32 h-32 rounded-full group-hover:bg-blue-400 transition-colors"></div>
              <div className="relative z-10">
                <div className="bg-black w-14 h-14 rounded-full flex items-center justify-center text-blue-400 mb-6">
                  <Package size={28} />
                </div>
                <h3 className="text-2xl font-black mb-3">Parcel Delivery</h3>
                <p className="text-gray-500 mb-6">
                  Send packages, keys, or food to friends and family instantly
                  within the city.
                </p>
                <ul className="space-y-2 text-sm font-bold text-gray-700">
                  <li className="flex gap-2">
                    <CheckCircle size={16} className="text-green-500" />{" "}
                    Real-time Tracking
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle size={16} className="text-green-500" /> Secure
                    Handling
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE ECOSYSTEM (CONNECTION) --- */}
      <section
        id="how-it-works"
        className="py-24 bg-white relative overflow-hidden"
      >
        {/* Connecting Line Graphic */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 hidden md:block"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <span className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              The Ecosystem
            </span>
            <h2 className="text-4xl font-black mt-4">How We Connect</h2>
            <p className="text-gray-500 mt-2">
              A seamless bond between those who need a ride and those who
              provide it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 items-center gap-12">
            {/* USER SIDE */}
            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-200 text-center relative group hover:bg-black hover:text-white transition-all duration-500">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-gray-100 relative z-10 group-hover:scale-110 transition-transform">
                <Smartphone size={32} className="text-black" />
              </div>
              <h3 className="text-2xl font-black mb-2">The Passenger</h3>
              <p className="text-gray-500 text-sm group-hover:text-gray-400">
                Requests a ride, sets destination, and gets an instant fare
                estimate.
              </p>

              {/* Connection Dot */}
              <div className="absolute top-1/2 -right-6 w-12 h-12 bg-white rounded-full border-4 border-yellow-400 z-20 hidden md:flex items-center justify-center">
                <ArrowRight size={20} className="text-black" />
              </div>
            </div>

            {/* THE ALGORITHM / BRIDGE */}
            <div className="text-center relative">
              <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(250,204,21,0.6)] animate-pulse">
                <HeartHandshake size={48} className="text-black" />
              </div>
              <h3 className="font-black text-xl mt-6 uppercase tracking-widest">
                The Match
              </h3>
              <p className="text-xs font-bold text-gray-400 mt-2">
                Smart Allocation Algorithm
              </p>
            </div>

            {/* RIDER SIDE */}
            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-200 text-center relative group hover:bg-black hover:text-white transition-all duration-500">
              {/* Connection Dot */}
              <div className="absolute top-1/2 -left-6 w-12 h-12 bg-white rounded-full border-4 border-yellow-400 z-20 hidden md:flex items-center justify-center">
                <ArrowRight size={20} className="text-black" />
              </div>

              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-gray-100 relative z-10 group-hover:scale-110 transition-transform">
                <Bike size={32} className="text-black" />
              </div>
              <h3 className="text-2xl font-black mb-2">The Captain</h3>
              <p className="text-gray-500 text-sm group-hover:text-gray-400">
                Receives request, accepts ride, and navigates to pickup
                location.
              </p>
            </div>
          </div>

          {/* Ride Complete Banner */}
          <div className="mt-16 bg-black text-yellow-400 p-6 rounded-2xl flex items-center justify-center gap-4 shadow-xl max-w-2xl mx-auto border-2 border-yellow-400">
            <Map size={24} />
            <span className="font-bold text-lg">
              Together, they complete the journey safely.
            </span>
          </div>
        </div>
      </section>

      {/* --- ROLE SELECTION (Existing but tweaked) --- */}
      <section id="roles" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              Join the Community
            </h2>
            <div className="inline-flex bg-white p-2 rounded-full shadow-sm">
              <button
                onClick={() => setActiveRoleTab("RIDER")}
                className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${activeRoleTab === "RIDER" ? "bg-black text-white shadow-lg" : "text-gray-500 hover:text-black"}`}
              >
                Passenger
              </button>
              <button
                onClick={() => setActiveRoleTab("CAPTAIN")}
                className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${activeRoleTab === "CAPTAIN" ? "bg-yellow-400 text-black shadow-lg" : "text-gray-500 hover:text-black"}`}
              >
                Captain
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-8 lg:p-16 border border-gray-100 shadow-2xl overflow-hidden relative">
            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              <div className="lg:w-1/2">
                <h3 className="text-3xl font-black mb-6">
                  {activeRoleTab === "RIDER"
                    ? "Everyday Commute, Made Easy."
                    : "Earn on your own terms."}
                </h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {activeRoleTab === "RIDER"
                    ? "Skip the traffic and reach your office, college or home on time. Book a bike taxi in seconds and travel at the most affordable rates in the city."
                    : "Turn your bike into a money making machine. Join our community of 1M+ captains who are earning daily with zero commission on their first 50 rides."}
                </p>
                <div className="space-y-4 mb-8">
                  {(activeRoleTab === "RIDER"
                    ? [
                        "Doorstep Pickup",
                        "Affordable Fares",
                        "Insured Rides",
                        "Helmet Provided",
                      ]
                    : [
                        "Zero Joining Fees",
                        "Instant Payouts",
                        "Flexible Timings",
                        "Insurance Support",
                      ]
                  ).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`p-1 rounded-full ${activeRoleTab === "RIDER" ? "bg-blue-100 text-blue-600" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        <CheckCircle size={20} />
                      </div>
                      <span className="font-bold text-gray-800">{item}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAction}
                  className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 ${activeRoleTab === "RIDER" ? "bg-black text-white" : "bg-yellow-400 text-black"}`}
                >
                  {activeRoleTab === "RIDER"
                    ? "Book a Ride Now"
                    : "Join as Captain"}{" "}
                  <ArrowRight size={20} />
                </button>
              </div>
              <div className="lg:w-1/2">
                <div
                  className={`rounded-3xl overflow-hidden border-4 shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500 ${activeRoleTab === "RIDER" ? "border-black" : "border-yellow-400"}`}
                >
                  <img
                    src={
                      activeRoleTab === "RIDER"
                        ? "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                        : "https://p1.hiclipart.com/preview/792/645/143/online-shopping-money-sales-youtube-ecommerce-payment-online-and-offline-daraz-png-clipart.jpg"
                    }
                    alt="Role"
                    className="w-full h-80 lg:h-96 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SAFETY SECTION --- */}
      <section id="safety" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wide">
              Safety First
            </span>
            <h2 className="text-4xl font-black mt-6 mb-6">
              We care about your safety. Seriously.
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Every trip is tracked, insured, and monitored. We have implemented
              industry-leading safety standards to ensure every ride is secure.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-blue-100 p-3 rounded-full h-fit">
                  <Shield className="text-blue-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Insurance Cover</h4>
                  <p className="text-gray-500 text-sm">
                    Every ride comes with insurance coverage for accidental
                    medical expenses.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-purple-100 p-3 rounded-full h-fit">
                  <Users className="text-purple-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Verified Captains</h4>
                  <p className="text-gray-500 text-sm">
                    All captains undergo strict background verification and
                    training.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-red-100 p-3 rounded-full h-fit">
                  <MapPin className="text-red-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Live Tracking & SOS</h4>
                  <p className="text-gray-500 text-sm">
                    Share live location with loved ones. Emergency button
                    available 24/7.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="absolute inset-0 bg-yellow-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <img
              src="https://miro.medium.com/v2/0*Teq7R0fTc-tNbIcF.jpg"
              alt="Safe Helmet"
              className="relative rounded-3xl shadow-2xl border-4 border-white z-10 hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* --- MARQUEE TESTIMONIALS --- */}
      <section className="py-20 bg-black overflow-hidden">
        <div className="text-center mb-12">
          <span className="text-yellow-400 font-bold tracking-widest uppercase text-xs">
            Community Love
          </span>
          <h2 className="text-4xl font-black text-white mt-2">
            What people say
          </h2>
        </div>
        <div className="relative w-full">
          <div className="flex animate-marquee gap-8 w-[200%]">
            {[...Array(2)].map((_, setIndex) => (
              <React.Fragment key={setIndex}>
                {[
                  {
                    name: "Rahul S.",
                    text: "Saved me from Bangalore traffic! Best app ever.",
                    role: "Commuter",
                  },
                  {
                    name: "Priya M.",
                    text: "Feeling safe with the tracking feature. Highly recommend.",
                    role: "Student",
                  },
                  {
                    name: "Amit K.",
                    text: "Earning 20k/month part time. Great for students.",
                    role: "Captain",
                  },
                  {
                    name: "Sneha D.",
                    text: "Cheaper than auto, faster than bus.",
                    role: "Office Goer",
                  },
                  {
                    name: "Vikram R.",
                    text: "The helmet policy is strict and good.",
                    role: "User",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="w-[350px] shrink-0 bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-yellow-400 transition-colors group"
                  >
                    <div className="flex gap-1 text-yellow-400 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                      "{item.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-black">
                        {item.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500">{item.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* --- BLOG SECTION (REDESIGNED) --- */}
      <section id="blog" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black mb-4">The Feed</h2>
              <p className="text-gray-500">
                Stories, updates, and news from the road.
              </p>
            </div>
            <button className="hidden md:flex items-center gap-2 font-bold text-black border-b-2 border-black pb-1 hover:text-yellow-600 hover:border-yellow-600 transition-all">
              View all posts <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Blog Card 1 */}
            <a
              target="_blank"
              href="https://inductusgcc.com/global-capability-centers-gccs-in-india-the-rise-of-tier-2-cities/#:~:text=As%20per%20a%20recent%20report%20by%20NASSCOM%2C,three%20years%20have%20been%20in%20tier%2D2%20cities."
              className="group cursor-pointer"
            >
              <div className="rounded-[2rem] overflow-hidden mb-6 relative shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Blog 1"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase">
                  News
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase mb-2">
                <span>Dec 12, 2024</span> • <span>5 min read</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-600 transition-colors flex items-center gap-2">
                Expansion to 50 New Tier-2 Cities{" "}
                <ArrowUpRight
                  size={20}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </h3>
              <p className="text-gray-500 line-clamp-2">
                We are thrilled to announce that RapidoRide is now available in
                50 more cities across India, bringing affordable mobility to
                millions.
              </p>
            </a>

            {/* Blog Card 2 */}
            <a
              target="_blank"
              href="https://www.uber.com/en-IN/newsroom/uber-introduces-new-features-to-elevate-safety/"
              className="group cursor-pointer"
            >
              <div className="rounded-[2rem] overflow-hidden mb-6 relative shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1593950315186-76a92975b60c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Blog 2"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Safety
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase mb-2">
                <span>Nov 28, 2024</span> • <span>3 min read</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                New SOS Features for Night Rides{" "}
                <ArrowUpRight
                  size={20}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </h3>
              <p className="text-gray-500 line-clamp-2">
                Your safety is our priority. Introducing enhanced live tracking
                and one-tap emergency response for rides post 10 PM.
              </p>
            </a>

            {/* Blog Card 3 */}
            <a
              target="_blank"
              href="https://medium.com/@rapidobike/a-professor-turned-part-time-rapido-captain-know-what-drives-him-to-ride-at-62-f7766b336d3d"
              className="group cursor-pointer"
            >
              <div className="rounded-[2rem] overflow-hidden mb-6 relative shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1526725702345-bdda2b97ef73?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Blog 3"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Captain
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase mb-2">
                <span>Oct 15, 2024</span> • <span>4 min read</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-green-600 transition-colors flex items-center gap-2">
                Captain of the Month: Rajesh's Story{" "}
                <ArrowUpRight
                  size={20}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </h3>
              <p className="text-gray-500 line-clamp-2">
                Meet Rajesh, who completed 5000 rides with a 5-star rating. Read
                about his journey and how he supports his family.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* --- JOIN US / CTA SECTION (REPLACED "READY TO RIDE") --- */}
      <section id="join" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-yellow-400 skew-y-3 transform origin-bottom-right translate-y-24 z-0"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="bg-black text-white rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-gray-800 rounded-full blur-[100px] opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-500 rounded-full blur-[100px] opacity-20"></div>

            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
              JOIN THE <span className="text-yellow-400">REVOLUTION.</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
              Be part of India's largest mobility community. Whether you want to
              ride or drive, we have a place for you.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button
                onClick={handleAction}
                className="bg-yellow-400 text-black px-10 py-5 rounded-full font-black text-xl hover:bg-yellow-300 transition-all hover:scale-105 shadow-[0_0_30px_rgba(250,204,21,0.4)] flex items-center justify-center gap-3"
              >
                Download App <Smartphone />
              </button>
              <button
                onClick={() => scrollToSection("captain")}
                className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-full font-black text-xl hover:bg-white hover:text-black transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                Become a Captain <Bike />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black text-white pt-24 pb-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-black mb-2">Ready to Ride?</h2>
              <p className="text-gray-400">
                Download the app and get your first ride free.
              </p>
            </div>
            <div className="flex gap-4">
              <a
                target="_blank"
                href="https://apps.apple.com/kw/app/rapido-bike-taxi-auto-cabs/id1198464606"
                className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2"
              >
                <Smartphone size={20} /> App Store
              </a>
              <a
                target="_blank"
                href="https://play.google.com/store/apps/details?id=com.rapido.passenger&hl=en"
                className="bg-gray-800 text-white border border-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Smartphone size={20} /> Google Play
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-gray-800 pt-12">
            <div>
              <div className="flex items-center gap-2 mb-6 text-yellow-400">
                <Bike size={24} />
                <span className="font-black text-xl italic">RapidoRide</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Solving the last mile commute problem, one bike ride at a time.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/"
                  className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://www.x.com/"
                  className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="https://www.facbook.com/"
                  className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all"
                >
                  <Facebook size={18} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Explore</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                {["About", "Services", "How it Works", "Blog"].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() =>
                        scrollToSection(item.toLowerCase().replace(/\s+/g, "-"))
                      }
                      className="hover:text-yellow-400 transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Support</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <a
                    target="_blank"
                    href="https://en.wikipedia.org/wiki/Wikipedia:Help_desk"
                    className="hover:text-yellow-400 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://en.wikipedia.org/wiki/Safety"
                    className="hover:text-yellow-400 transition-colors"
                  >
                    Safety Policy
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://en.wikipedia.org/wiki/Terms_of_service"
                    className="hover:text-yellow-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Contact</h4>
              <p className="text-gray-500 text-sm mb-2">
                support@rapidoride.com
              </p>
              <p className="text-gray-500 text-sm">Bangalore, India</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-900 text-center text-white hover:text-gray-500 text-xs">
            © {new Date().getFullYear()} RapidoRide Technologies Pvt Ltd. All
            rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
