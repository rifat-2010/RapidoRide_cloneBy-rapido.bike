
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Bike, DollarSign, Activity, AlertCircle, Shield } from 'lucide-react';

export const AdminPanel = () => {
  const { allUsers, promoteToCaptain } = useAppContext();

  // Mock data for charts
  const data = [
    { name: 'Mon', rides: 400, rev: 2400 },
    { name: 'Tue', rides: 300, rev: 1398 },
    { name: 'Wed', rides: 200, rev: 9800 },
    { name: 'Thu', rides: 278, rev: 3908 },
    { name: 'Fri', rides: 189, rev: 4800 },
    { name: 'Sat', rides: 239, rev: 3800 },
    { name: 'Sun', rides: 349, rev: 4300 },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500">System overview and analytics</p>
        </header>

        {/* --- USER MANAGEMENT (DB SIMULATOR) --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="flex justify-between items-center mb-4">
                <div>
                   <h3 className="font-bold text-lg flex items-center gap-2"><Shield size={20} className="text-blue-600"/> User Management</h3>
                   <p className="text-xs text-gray-400">Manually assign roles (Simulating MongoDB Edit)</p>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="px-4 py-3">User ID</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Current Role</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {allUsers.map(user => (
                            <tr key={user.id}>
                                <td className="px-4 py-3 font-mono text-gray-500">{user.id}</td>
                                <td className="px-4 py-3 font-bold">{user.phoneNumber}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                                        user.role === 'RIDER' ? 'bg-green-100 text-green-700' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {user.role === 'USER' && (
                                        <button 
                                            onClick={() => promoteToCaptain(user.id)}
                                            className="bg-black text-white px-3 py-1 rounded text-xs hover:bg-gray-800"
                                        >
                                            Promote to Captain
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-6">Weekly Rides</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="rides" fill="#FACC15" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg mb-6">Revenue Trend</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="rev" stroke="#16a34a" strokeWidth={3} dot={{r: 4}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
