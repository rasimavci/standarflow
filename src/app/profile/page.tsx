"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, MapPin, Building2, Briefcase, TrendingUp, DollarSign, Globe, Edit, Save, X } from "lucide-react";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    loadProfileData();
  }, [user, isAuthenticated, router]);

  const loadProfileData = async () => {
    if (!user) return;

    if (user.role === "founder") {
      const res = await fetch('/api/founders');
      const founders = await res.json();
      const founder = founders.find((f: any) => f.email === user.email);
      setProfileData(founder);
      setEditedData(founder);
    } else if (user.role === "investor") {
      const res = await fetch('/api/investors');
      const investors = await res.json();
      const investor = investors.find((i: any) => i.email === user.email);
      setProfileData(investor);
      setEditedData(investor);
    }
  };

  // Load countries when editing starts
  useEffect(() => {
    if (isEditing && countries.length === 0) {
      fetch('https://restcountries.com/v3.1/all?fields=name')
        .then(res => res.json())
        .then(data => {
          const sortedCountries = data
            .map((country: any) => country.name.common)
            .sort();
          setCountries(sortedCountries);
        })
        .catch(err => console.error('Error loading countries:', err));
    }
  }, [isEditing]);

  // Load universities when country changes
  useEffect(() => {
    if (isEditing && editedData?.country) {
      setLoadingUniversities(true);
      fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(editedData.country)}?fields=cca2`)
        .then(res => res.json())
        .then(data => {
          const countryCode = data[0]?.cca2;
          if (countryCode) {
            return fetch(`/api/universities?country=${countryCode}`);
          }
          throw new Error('Country code not found');
        })
        .then(res => res.json())
        .then(data => {
          setUniversities(data);
          setLoadingUniversities(false);
        })
        .catch(err => {
          console.error('Error loading universities:', err);
          setUniversities([]);
          setLoadingUniversities(false);
        });
    }
  }, [isEditing, editedData?.country]);

  const handleSave = async () => {
    if (!editedData || !user) return;

    if (user.role === "founder") {
      const res = await fetch('/api/founders');
      const founders = await res.json();
      const index = founders.findIndex((f: any) => f.email === user.email);
      if (index >= 0) {
        founders[index] = editedData;
        await fetch('/api/founders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ founders }),
        });
        setProfileData(editedData);
        setIsEditing(false);
      }
    } else if (user.role === "investor") {
      const res = await fetch('/api/investors');
      const investors = await res.json();
      const index = investors.findIndex((i: any) => i.email === user.email);
      if (index >= 0) {
        investors[index] = editedData;
        await fetch('/api/investors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ investors }),
        });
        setProfileData(editedData);
        setIsEditing(false);
      }
    }
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  if (!user || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
            {/* Cover */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            
            {/* Profile Info */}
            <div className="px-8 pb-8">
              <div className="flex items-end justify-between -mt-16 mb-4">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                />
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData?.name || ""}
                      onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                      className="text-3xl font-bold text-gray-900 dark:text-white w-full border-b-2 border-blue-600 bg-transparent focus:outline-none"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {profileData?.name}
                    </h1>
                  )}
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-1 capitalize">
                    {user.role}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span>{user.email}</span>
                  </div>
                  {profileData?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Founder Profile Details */}
          {user.role === "founder" && (
            <div className="space-y-6">
              {/* Company Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  Company Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Company Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData?.companyName || ""}
                        onChange={(e) => setEditedData({ ...editedData, companyName: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData?.companyName || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={editedData?.website || ""}
                        onChange={(e) => setEditedData({ ...editedData, website: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      profileData?.website ? (
                        <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                          {profileData.website}
                          <Globe className="w-4 h-4" />
                        </a>
                      ) : (
                        <p className="text-gray-500">N/A</p>
                      )
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Industry
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData?.industry || ""}
                        onChange={(e) => setEditedData({ ...editedData, industry: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData?.industry || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Stage
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData?.stage || ""}
                        onChange={(e) => setEditedData({ ...editedData, stage: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData?.stage || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Funding Goal
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData?.fundingGoal || ""}
                        onChange={(e) => setEditedData({ ...editedData, fundingGoal: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData?.fundingGoal || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      University
                    </label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <select
                          value={editedData?.country || ""}
                          onChange={(e) => {
                            setEditedData({ ...editedData, country: e.target.value, university: "" });
                            setUniversities([]);
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                        {editedData?.country && (
                          <select
                            value={editedData?.university || ""}
                            onChange={(e) => setEditedData({ ...editedData, university: e.target.value })}
                            disabled={loadingUniversities}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                          >
                            <option value="">
                              {loadingUniversities ? "Loading universities..." : "Select University"}
                            </option>
                            {universities.map((uni: any) => (
                              <option key={uni.name} value={uni.name}>
                                {uni.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-900 dark:text-white">{profileData?.country || "N/A"}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{profileData?.university || "N/A"}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Description
                </h2>
                {isEditing ? (
                  <textarea
                    value={editedData?.description || ""}
                    onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    {profileData?.description || "No description provided."}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Investor Profile Details */}
          {user.role === "investor" && (
            <div className="space-y-6">
              {/* Firm Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  Firm Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Firm Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData?.firm || ""}
                        onChange={(e) => setEditedData({ ...editedData, firm: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData?.firm || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData?.location || ""}
                        onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData?.location || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Investment Range
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData?.investmentRange || ""}
                        onChange={(e) => setEditedData({ ...editedData, investmentRange: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., $5M-$20M"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData?.investmentRange || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Deals Completed
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedData?.dealsCompleted || 0}
                        onChange={(e) => setEditedData({ ...editedData, dealsCompleted: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData?.dealsCompleted || 0}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Investment Focus */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  Investment Focus
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Industries
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={Array.isArray(editedData?.industries) ? editedData.industries.join(", ") : ""}
                        onChange={(e) => setEditedData({ 
                          ...editedData, 
                          industries: e.target.value.split(",").map(s => s.trim()).filter(s => s) 
                        })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="AI/ML, SaaS, FinTech"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(profileData?.industries) && profileData.industries.length > 0 ? (
                          profileData.industries.map((industry: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                              {industry}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">N/A</p>
                        )}
                      </div>
                    )}
                    {isEditing && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Separate multiple industries with commas
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Investment Stages
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={Array.isArray(editedData?.stages) ? editedData.stages.join(", ") : ""}
                        onChange={(e) => setEditedData({ 
                          ...editedData, 
                          stages: e.target.value.split(",").map(s => s.trim()).filter(s => s) 
                        })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Seed, Series A, Series B"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(profileData?.stages) && profileData.stages.length > 0 ? (
                          profileData.stages.map((stage: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                              {stage}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">N/A</p>
                        )}
                      </div>
                    )}
                    {isEditing && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Separate multiple stages with commas
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Bio
                </h2>
                {isEditing ? (
                  <textarea
                    value={editedData?.bio || ""}
                    onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Tell us about your investment philosophy and background..."
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    {profileData?.bio || "No bio provided."}
                  </p>
                )}
              </div>

              {/* Portfolio */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  Portfolio Companies
                </h2>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={Array.isArray(editedData?.portfolio) ? editedData.portfolio.join(", ") : ""}
                      onChange={(e) => setEditedData({ 
                        ...editedData, 
                        portfolio: e.target.value.split(",").map(s => s.trim()).filter(s => s) 
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Company A, Company B, Company C"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Separate multiple companies with commas
                    </p>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(profileData?.portfolio) && profileData.portfolio.length > 0 ? (
                      profileData.portfolio.map((company: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg font-medium">
                          {company}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No portfolio companies listed.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
