import { useState, FormEvent } from "react";
import { UserProfile, UserAddress } from "../types";
import { User, Phone, Mail, MapPin, Edit3, Trash2, CheckCircle, Plus, Check, LogOut } from "lucide-react";

interface ProfileTabProps {
  profile: UserProfile | null;
  onUpdateProfile: (data: { name: string; email: string; phone: string }) => Promise<UserProfile>;
  onAddAddress: (data: Omit<UserAddress, "id">) => Promise<UserProfile>;
  onDeleteAddress: (addressId: string) => Promise<UserProfile>;
  onSetDefaultAddress: (addressId: string) => Promise<UserProfile>;
  onRefreshProfile: () => void;
  onLogout: () => void;
}

export default function ProfileTab({
  profile,
  onUpdateProfile,
  onAddAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  onRefreshProfile,
  onLogout,
}: ProfileTabProps) {
  // Profile inputs state
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Address Form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressLabel, setAddressLabel] = useState("Home");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [addressDefault, setAddressDefault] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 mt-4 font-medium">Baking your sweet settings profile...</p>
      </div>
    );
  }

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Name and email are required fields.");
      return;
    }

    try {
      setProfileSaving(true);
      await onUpdateProfile({ name, email, phone });
      setProfileSuccess(true);
      setIsEditingProfile(false);
      setTimeout(() => setProfileSuccess(false), 2000);
    } catch (err: any) {
      alert(err?.message || "Could not save profile details.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSaveAddress = async (e: FormEvent) => {
    e.preventDefault();
    if (!addressStreet || !addressCity || !addressState || !addressZip) {
      alert("Please fill in all address parameters.");
      return;
    }

    try {
      setAddressSaving(true);
      await onAddAddress({
        label: addressLabel,
        street: addressStreet,
        city: addressCity,
        state: addressState,
        zipCode: addressZip,
        isDefault: addressDefault,
      });

      // Clear address inputs
      setAddressStreet("");
      setAddressCity("");
      setAddressState("");
      setAddressZip("");
      setAddressDefault(false);
      setShowAddressForm(false);
    } catch (err: any) {
      alert("Could not save address. Please try again.");
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddressClick = async (id: string) => {
    try {
      await onDeleteAddress(id);
      setDeletingAddressId(null);
    } catch (err: any) {
      alert("Could not remove address.");
    }
  };

  const handleSetDefaultAddressClick = async (id: string) => {
    try {
      await onSetDefaultAddress(id);
    } catch (err: any) {
      alert("Could not update default status.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 border-b border-pink-100 pb-5">
        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-800">My Bakery Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage personal contact card and shipping addresses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-pink-50 shadow-xs text-center relative">
            {/* Avatar */}
            <div className="w-20 h-20 bg-pink-100/70 border-2 border-white rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500 shadow-xs">
              <span className="font-serif font-bold text-3xl uppercase">{profile.name.charAt(0)}</span>
            </div>

            <h3 className="font-serif text-xl font-bold text-gray-800 truncate">{profile.name}</h3>
            <p className="text-[10px] text-pink-400 uppercase tracking-widest font-bold mt-1">
              Sweet Bloom Member
            </p>

            {/* Profile Fields List */}
            <div className="mt-6 pt-6 border-t border-pink-50/60 text-left space-y-3.5">
              <div className="flex items-center gap-2.5 text-xs text-gray-600">
                <Mail className="w-4.5 h-4.5 text-pink-400 shrink-0" />
                <span className="truncate">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-600">
                <Phone className="w-4.5 h-4.5 text-pink-400 shrink-0" />
                <span>{profile.phone || "No phone added"}</span>
              </div>
            </div>

            {/* Success message */}
            {profileSuccess && (
              <div className="bg-green-50 text-green-600 text-[11px] font-bold p-2.5 rounded-xl border border-green-100 mt-4 flex items-center justify-center gap-1.5 animate-fade-in">
                <Check className="w-4 h-4" /> Updated successfully!
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 space-y-2.5">
              {!isEditingProfile && (
                <button
                  onClick={() => {
                    setName(profile.name);
                    setEmail(profile.email);
                    setPhone(profile.phone);
                    setIsEditingProfile(true);
                  }}
                  className="w-full py-2.5 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile Card
                </button>
              )}

              <button
                type="button"
                onClick={onLogout}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          {/* Profile Edit Input Form (Floating or Block) */}
          {isEditingProfile && (
            <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4 animate-fade-in">
              <h4 className="font-serif text-sm font-bold text-gray-800 border-b border-pink-50 pb-2">Edit Details</h4>
              <div>
                <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfaf9] rounded-xl border border-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-200 text-xs text-gray-700"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfaf9] rounded-xl border border-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-200 text-xs text-gray-700"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fdfaf9] rounded-xl border border-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-200 text-xs text-gray-700"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-pink-50/50">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-4 py-1.5 bg-pink-400 hover:bg-pink-500 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm"
                >
                  {profileSaving ? "Saving..." : "Save Details"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Columns: Addresses management */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-pink-50 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-pink-50">
              <div className="flex items-center gap-2">
                <MapPin className="w-5.5 h-5.5 text-pink-400" />
                <h3 className="font-serif text-lg font-bold text-gray-800">My Address Book</h3>
              </div>
              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="text-xs font-bold text-pink-500 hover:text-pink-600 flex items-center gap-1 cursor-pointer bg-pink-50 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Address
                </button>
              )}
            </div>

            {/* Create Address Inline Form */}
            {showAddressForm && (
              <form onSubmit={handleSaveAddress} className="bg-[#fdfaf9] border border-pink-100 rounded-2xl p-5 mb-6 animate-fade-in space-y-4">
                <h4 className="font-serif text-sm font-bold text-gray-800">Create Address parameters</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                      Label
                    </label>
                    <div className="flex gap-2">
                      {["Home", "Office", "Friend's Place", "Other"].map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setAddressLabel(l)}
                          className={`px-3 py-1 border rounded-lg text-xs font-semibold transition-all cursor-pointer ${addressLabel === l
                            ? "bg-pink-100 border-pink-300 text-pink-600 font-semibold"
                            : "bg-white border-gray-150 text-gray-600"
                            }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 122 Baker St, Suite 4B"
                      value={addressStreet}
                      onChange={(e) => setAddressStreet(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-200 text-xs text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. London"
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-200 text-xs text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                      State / Region
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. California"
                      value={addressState}
                      onChange={(e) => setAddressState(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-200 text-xs text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                      Zip / Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 90210"
                      value={addressZip}
                      onChange={(e) => setAddressZip(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-pink-50 focus:outline-none focus:ring-1 focus:ring-pink-200 text-xs text-gray-700"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="addressDefaultProfile"
                      checked={addressDefault}
                      onChange={(e) => setAddressDefault(e.target.checked)}
                      className="accent-pink-500 rounded text-pink-500"
                    />
                    <label htmlFor="addressDefaultProfile" className="text-xs font-semibold text-gray-500 cursor-pointer">
                      Make default delivery location
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-pink-100/60">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addressSaving}
                    className="px-4 py-1.5 bg-pink-400 hover:bg-pink-500 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm"
                  >
                    {addressSaving ? "Saving..." : "Add Address"}
                  </button>
                </div>
              </form>
            )}

            {/* Saved addresses display cards */}
            {profile.addresses.length === 0 ? (
              <p className="text-xs text-gray-500 italic text-center py-6">
                You do not have any saved addresses. Your deliveries can be added using the "Add New Address" button above.
              </p>
            ) : (
              <div className="space-y-4">
                {profile.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all duration-200 ${addr.isDefault
                      ? "bg-[#fdfaf9] border-pink-200 shadow-3xs"
                      : "bg-white border-pink-50 hover:border-pink-200"
                      }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-800">{addr.label}</span>
                        {addr.isDefault ? (
                          <span className="bg-pink-100 text-pink-600 text-[9px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                            Default location
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetDefaultAddressClick(addr.id)}
                            className="text-[9px] text-pink-400 hover:text-pink-600 font-bold uppercase tracking-wider cursor-pointer hover:underline"
                          >
                            Set Default
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 truncate">{addr.street}</p>
                      <p className="text-[10px] text-gray-400">
                        {addr.city}, {addr.state} {addr.zipCode}
                      </p>
                    </div>

                    {/* Delete handler */}
                    {deletingAddressId === addr.id ? (
                      <div className="flex gap-1.5 shrink-0 animate-fade-in">
                        <button
                          type="button"
                          onClick={() => setDeletingAddressId(null)}
                          className="px-2.5 py-1 bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl text-[10px] font-bold cursor-pointer transition-colors"
                        >
                          Keep
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddressClick(addr.id)}
                          className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-bold cursor-pointer transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeletingAddressId(addr.id)}
                        className="text-gray-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                        title="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
