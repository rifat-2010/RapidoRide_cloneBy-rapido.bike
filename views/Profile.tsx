
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { User, Camera, Shield, UserCircle, Car, Key, FileText, ArrowLeft } from 'lucide-react';

interface ProfileProps {
  onBack?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  const { currentUser, updateUserProfile, logout } = useAppContext();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.fullName || '');
  const [imgUrl, setImgUrl] = useState(currentUser?.profileImage || '');

  if (!currentUser) return null;

  const handleSave = async () => {
      await updateUserProfile(name, imgUrl);
      setIsEditing(false);
  };

  return (
    <div className="h-full w-full bg-gray-50 overflow-y-auto px-4 md:px-8 py-8">
        <div className="max-w-2xl mx-auto pb-24">
            
            {/* Header with Back Button */}
            <div className="flex items-center gap-4 mb-8">
                {onBack && (
                    <button 
                        onClick={onBack} 
                        className="p-3 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-100 transition-all active:scale-95"
                    >
                        <ArrowLeft size={24} className="text-gray-700" />
                    </button>
                )}
                <h1 className="text-3xl font-black text-gray-900 m-0">My Profile</h1>
            </div>
            
            {/* Identity Card Style */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                <div className="h-32 bg-yellow-400 relative">
                    <div className="absolute -bottom-16 left-8 p-1 bg-white rounded-full">
                        <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg relative group">
                            <img 
                                src={imgUrl || `https://ui-avatars.com/api/?name=${currentUser.fullName}&background=random`} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Camera className="text-white" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="pt-20 pb-8 px-8">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            {isEditing ? (
                                <div className="mb-2">
                                    <input 
                                        className="text-2xl font-bold border-b-2 border-yellow-400 outline-none w-full bg-transparent"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter Full Name"
                                    />
                                    <input 
                                        className="w-full bg-gray-50 border p-2 rounded mt-2 text-sm"
                                        value={imgUrl}
                                        onChange={(e) => setImgUrl(e.target.value)}
                                        placeholder="Profile Image URL"
                                    />
                                </div>
                            ) : (
                                <h2 className="text-3xl font-bold text-gray-900">{currentUser.fullName}</h2>
                            )}
                            <p className="text-gray-500 font-mono flex items-center gap-2 mt-1">
                                {currentUser.phoneNumber} 
                                {currentUser.role === 'RIDER' && <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold">Captain</span>}
                                {currentUser.role === 'USER' && <span className="bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded uppercase font-bold">Passenger</span>}
                            </p>
                        </div>
                        <button 
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className={`px-6 py-2 rounded-full font-bold text-sm shadow-lg transition-all ${isEditing ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-black text-white hover:bg-gray-800'}`}
                        >
                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Rider Details Section */}
            {currentUser.role === 'RIDER' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 mb-8 animate-slide-up">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Car size={24} className="text-yellow-500" /> Vehicle Information
                    </h3>
                    {currentUser.vehicleInfo ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Vehicle Type</p>
                                <p className="font-bold text-lg">{currentUser.vehicleInfo.vehicleType}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Plate Number</p>
                                <p className="font-bold text-lg font-mono">{currentUser.vehicleInfo.vehicleNumber}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Driving License</p>
                                <p className="font-bold text-lg font-mono flex items-center gap-2">
                                    <FileText size={16} /> {currentUser.vehicleInfo.drivingLicenseNumber}
                                </p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                <p className="text-xs text-green-600 font-bold uppercase mb-1">Status</p>
                                <p className="font-bold text-lg text-green-700 flex items-center gap-2">
                                    <Shield size={18} /> Verified Captain
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-red-50 text-red-500 rounded-xl">
                            Vehicle information missing. Please update.
                        </div>
                    )}
                </div>
            )}

            <button onClick={logout} className="w-full py-4 rounded-xl border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 transition-colors">
                Log Out
            </button>
        </div>
    </div>
  );
};
