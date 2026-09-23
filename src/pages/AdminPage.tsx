import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Icon } from '../components/ui/icon';
import { api } from '../services/api';
import { formatCurrency } from '../lib/utils';

export const AdminPage: React.FC = () => {
  const {
    currentUser,
    setCurrentUserRole,
    packages,
    bookings,
    transactions,
    microservices,
    setIsAddPackageModalOpen,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'packages' | 'admins' | 'bookings'>('packages');

  // Admin management
  const [usersList, setUsersList] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');
  const [adminErrorMsg, setAdminErrorMsg] = useState('');

  const totalInstances = microservices.reduce((acc, s) => acc + s.instances.length, 0);
  const upInstances = microservices.reduce((acc, s) => acc + s.instances.filter(i => i.status === 'UP').length, 0);

  useEffect(() => {
    async function loadUsers() {
      const res = await api.getUsers();
      if (res.success && res.data) {
        setUsersList(res.data);
      }
    }
    loadUsers();
  }, [activeTab]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    setIsAddingAdmin(true);
    setAdminErrorMsg('');
    setAdminSuccessMsg('');

    try {
      const res = await api.addAdminUser(newAdminEmail.trim(), newAdminName.trim());
      setIsAddingAdmin(false);
      if (res.success && res.data) {
        setUsersList(prev => [res.data, ...prev.filter(u => u.email !== res.data.email)]);
        setNewAdminEmail('');
        setNewAdminName('');
        setAdminSuccessMsg(`Successfully granted Administrator privileges to ${res.data.email}!`);
        setTimeout(() => setAdminSuccessMsg(''), 4000);
      } else {
        setAdminErrorMsg(res.error || 'Failed to add administrator.');
      }
    } catch (err: any) {
      setIsAddingAdmin(false);
      setAdminErrorMsg(err?.message || 'Error granting admin privileges.');
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    await api.updateUserRole(userId, newRole);
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleSignOut = () => {
    localStorage.removeItem('vc_token');
    localStorage.removeItem('vc_user');
    setCurrentUserRole('TRAVELER');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 font-sans">
      {/* Plain White Card Container */}
      <div className="bg-white text-black p-6 sm:p-10 rounded-3xl border border-neutral-200 shadow-2xl space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                Admin Panel
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600">
              Manage tour packages, add administrators, view reservations, and inspect microservices.
            </p>
          </div>

          {/* User Status & Black Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs text-neutral-800 font-medium flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px]">
                {currentUser.avatar || currentUser.name.substring(0, 2).toUpperCase()}
              </div>
              <span>{currentUser.email}</span>
              <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-bold">
                {currentUser.role}
              </span>
            </div>

            <button
              onClick={() => setIsAddPackageModalOpen(true)}
              className="bg-black text-white font-bold text-xs px-5 py-2.5 rounded-2xl hover:bg-neutral-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Icon name="add" size={16} />
              <span>Add New Tour</span>
            </button>

            <Link to="/admin/manage">
              <button className="bg-black text-white font-bold text-xs px-5 py-2.5 rounded-2xl hover:bg-neutral-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm">
                <Icon name="terminal" size={16} />
                <span>Dev / Eureka View</span>
              </button>
            </Link>

            <button
              onClick={handleSignOut}
              className="border border-neutral-300 text-neutral-700 hover:text-black hover:border-black font-semibold text-xs px-4 py-2.5 rounded-2xl transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Quick Summary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="text-xs text-neutral-500 font-medium">Tour Packages</div>
            <div className="text-2xl sm:text-3xl font-black text-black">{packages.length}</div>
            <div className="text-[11px] text-neutral-600">Active in catalog</div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="text-xs text-neutral-500 font-medium">Total Bookings</div>
            <div className="text-2xl sm:text-3xl font-black text-black">{bookings.length}</div>
            <div className="text-[11px] text-neutral-600">Confirmed &amp; locked</div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="text-xs text-neutral-500 font-medium">Transactions</div>
            <div className="text-2xl sm:text-3xl font-black text-black">{transactions.length}</div>
            <div className="text-[11px] text-neutral-600">Settled payments</div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="text-xs text-neutral-500 font-medium">Eureka Microservices</div>
            <div className="text-2xl sm:text-3xl font-black text-black">{upInstances}/{totalInstances} UP</div>
            <div className="text-[11px] text-emerald-600 font-semibold">Cluster operational</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-200 gap-2">
          <button
            onClick={() => setActiveTab('packages')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'packages'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <Icon name="explore" size={16} />
            <span>Tour Packages ({packages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('admins')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'admins'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <Icon name="group" size={16} />
            <span>Admin Team &amp; Access</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <Icon name="confirmation_number" size={16} />
            <span>Reservations ({bookings.length})</span>
          </button>
        </div>

        {/* TAB 1: Tour Packages */}
        {activeTab === 'packages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-black">Active Tour Packages</h2>
              <button
                onClick={() => setIsAddPackageModalOpen(true)}
                className="bg-black text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-neutral-800 transition-all cursor-pointer flex items-center gap-1"
              >
                <Icon name="add" size={14} />
                <span>Create Tour</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-neutral-200 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-bold">
                    <th className="p-3">Tour Code</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Base Price</th>
                    <th className="p-3">Capacity</th>
                    <th className="p-3">Booked / Left</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {packages.map((pkg) => {
                    const availableSlots = Math.max(0, pkg.totalCapacity - pkg.bookedSlots - pkg.lockedSlots);
                    return (
                      <tr key={pkg.id} className="hover:bg-neutral-50">
                        <td className="p-3 font-mono font-bold">{pkg.code}</td>
                        <td className="p-3">
                          <div className="font-bold text-black">{pkg.title}</div>
                          <div className="text-neutral-500 text-[11px]">{pkg.subtitle}</div>
                        </td>
                        <td className="p-3 font-bold">{formatCurrency(pkg.basePrice)}</td>
                        <td className="p-3 font-mono">{pkg.totalCapacity} seats</td>
                        <td className="p-3 font-mono">
                          <span className="font-bold text-black">{pkg.bookedSlots} booked</span>
                          <span className="text-neutral-500"> ({availableSlots} left)</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {pkg.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <Link to={`/packages/${pkg.id}`}>
                            <button className="bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-xl hover:bg-neutral-800 cursor-pointer">
                              View Page
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Admins & Team Management */}
        {activeTab === 'admins' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
              <div>
                <h3 className="text-base font-bold text-black">Grant Administrator Access</h3>
                <p className="text-xs text-neutral-600">
                  Add team members who have permission to manage tours and system settings.
                </p>
              </div>

              {adminSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold">
                  {adminSuccessMsg}
                </div>
              )}

              {adminErrorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-semibold">
                  {adminErrorMsg}
                </div>
              )}

              <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin.email@gmail.com"
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-black"
                />
                <input
                  type="text"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="Full Name (optional)"
                  className="sm:w-60 px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  disabled={isAddingAdmin}
                  className="bg-black text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-neutral-800 transition-all cursor-pointer shrink-0 disabled:opacity-60"
                >
                  {isAddingAdmin ? "Adding..." : "+ Grant Admin Access"}
                </button>
              </form>
            </div>

            {/* Users Directory Table */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-black">Active User &amp; Staff Directory</h3>
              <div className="overflow-x-auto border border-neutral-200 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-bold">
                      <th className="p-3">User</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Current Role</th>
                      <th className="p-3 text-right">Assign Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-neutral-50">
                        <td className="p-3 font-bold flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-neutral-200 text-neutral-800 flex items-center justify-center font-bold text-xs">
                            {u.avatar || u.name?.substring(0, 2).toUpperCase() || 'U'}
                          </div>
                          <span>{u.name || 'User'}</span>
                        </td>
                        <td className="p-3 font-mono">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            u.role === 'ADMIN' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-800 border border-neutral-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="px-2 py-1 rounded-lg border border-neutral-300 bg-white text-xs font-semibold focus:outline-none"
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="AGENT">AGENT</option>
                            <option value="TRAVELER">TRAVELER</option>
                            <option value="DEVOPS">DEVOPS</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {usersList.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-neutral-500">
                          Loading registered users from database...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Reservations */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-black">Recent Reservations &amp; PNRs</h2>
            <div className="overflow-x-auto border border-neutral-200 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-bold">
                    <th className="p-3">PNR</th>
                    <th className="p-3">Traveler</th>
                    <th className="p-3">Tour</th>
                    <th className="p-3">Seats</th>
                    <th className="p-3">Total Paid</th>
                    <th className="p-3">Booking Status</th>
                    <th className="p-3">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-neutral-50">
                      <td className="p-3 font-mono font-bold">{b.pnr}</td>
                      <td className="p-3">
                        <div className="font-bold text-black">{b.travelerName}</div>
                        <div className="text-neutral-500 text-[11px]">{b.travelerEmail}</div>
                      </td>
                      <td className="p-3 font-medium">{b.packageName}</td>
                      <td className="p-3 font-mono">{b.seats} ({b.tier})</td>
                      <td className="p-3 font-bold">{formatCurrency(b.totalAmount)}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full bg-black text-white text-[10px] font-bold">
                          {b.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-neutral-500">
                        No active bookings yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;
