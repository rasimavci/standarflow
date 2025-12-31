"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Users, Building2, MapPin, DollarSign, TrendingUp, Briefcase, X, Mail, ExternalLink, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Investor {
  id: number;
  name: string;
  email: string;
  firm: string;
  avatar: string;
  industries: string[];
  stages: string[];
  investmentRange: string;
  location: string;
  bio: string;
  portfolio: string[];
  dealsCompleted: number;
}

interface Founder {
  id: number;
  name: string;
  email: string;
  company: string;
  avatar: string;
  industry: string;
  stage: string;
  fundingGoal: string;
  location: string;
  description: string;
  traction: string;
  team: string;
}

export default function MatchMaking() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"investors" | "founders">("investors");
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [founders, setFounders] = useState<Founder[]>([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [selectedFounder, setSelectedFounder] = useState<Founder | null>(null);
  
  // Filters for investors
  const [investorIndustry, setInvestorIndustry] = useState("");
  const [investorStage, setInvestorStage] = useState("");
  const [investorLocation, setInvestorLocation] = useState("");
  
  // Filters for founders
  const [founderIndustry, setFounderIndustry] = useState("");
  const [founderStage, setFounderStage] = useState("");
  const [founderLocation, setFounderLocation] = useState("");

  // Load data from localStorage
  useEffect(() => {
    const loadedInvestors = JSON.parse(localStorage.getItem('investors') || '[]');
    const loadedFounders = JSON.parse(localStorage.getItem('founders') || '[]');
    setInvestors(loadedInvestors);
    setFounders(loadedFounders);
  }, []);

  // Favorite functions
  const toggleInvestorFavorite = (investorId: number) => {
    if (!user) {
      alert('Please sign in to add favorites');
      return;
    }

    const foundersData = JSON.parse(localStorage.getItem('founders') || '[]');
    const founderIndex = foundersData.findIndex((f: any) => f.email === user.email);
    
    if (founderIndex === -1) {
      alert('Founder profile not found');
      return;
    }

    const currentFavorites = foundersData[founderIndex].favorites || [];
    const isFavorite = currentFavorites.includes(investorId);
    
    if (isFavorite) {
      foundersData[founderIndex].favorites = currentFavorites.filter((id: number) => id !== investorId);
    } else {
      foundersData[founderIndex].favorites = [...currentFavorites, investorId];
    }
    
    localStorage.setItem('founders', JSON.stringify(foundersData));
    
    // Refresh data
    const loadedFounders = JSON.parse(localStorage.getItem('founders') || '[]');
    setFounders(loadedFounders);
  };

  const toggleFounderFavorite = (founderId: number) => {
    if (!user) {
      alert('Please sign in to add favorites');
      return;
    }

    const investorsData = JSON.parse(localStorage.getItem('investors') || '[]');
    const investorIndex = investorsData.findIndex((inv: any) => inv.email === user.email);
    
    if (investorIndex === -1) {
      alert('Investor profile not found');
      return;
    }

    const currentFavorites = investorsData[investorIndex].favorites || [];
    const isFavorite = currentFavorites.includes(founderId);
    
    if (isFavorite) {
      investorsData[investorIndex].favorites = currentFavorites.filter((id: number) => id !== founderId);
    } else {
      investorsData[investorIndex].favorites = [...currentFavorites, founderId];
    }
    
    localStorage.setItem('investors', JSON.stringify(investorsData));
    
    // Refresh data
    const loadedInvestors = JSON.parse(localStorage.getItem('investors') || '[]');
    setInvestors(loadedInvestors);
  };

  const isInvestorFavorite = (investorId: number): boolean => {
    if (!user) return false;
    const foundersData = JSON.parse(localStorage.getItem('founders') || '[]');
    const founder = foundersData.find((f: any) => f.email === user.email);
    return founder?.favorites?.includes(investorId) || false;
  };

  const isFounderFavorite = (founderId: number): boolean => {
    if (!user) return false;
    const investorsData = JSON.parse(localStorage.getItem('investors') || '[]');
    const investor = investorsData.find((inv: any) => inv.email === user.email);
    return investor?.favorites?.includes(founderId) || false;
  };

  // Filter investors
  const filteredInvestors = useMemo(() => {
    return investors.filter(investor => {
      const industryMatch = !investorIndustry || 
        investor.industries.some(ind => ind.toLowerCase().includes(investorIndustry.toLowerCase()));
      
      const stageMatch = !investorStage || 
        investor.stages.some(s => s.toLowerCase().includes(investorStage.toLowerCase()));
      
      const locationMatch = !investorLocation || 
        investor.location.toLowerCase().includes(investorLocation.toLowerCase());
      
      return industryMatch && stageMatch && locationMatch;
    });
  }, [investors, investorIndustry, investorStage, investorLocation]);

  // Filter founders
  const filteredFounders = useMemo(() => {
    return founders.filter(founder => {
      const industryMatch = !founderIndustry || 
        founder.industry.toLowerCase().includes(founderIndustry.toLowerCase());
      
      const stageMatch = !founderStage || 
        founder.stage.toLowerCase().includes(founderStage.toLowerCase());
      
      const locationMatch = !founderLocation || 
        founder.location.toLowerCase().includes(founderLocation.toLowerCase());
      
      return industryMatch && stageMatch && locationMatch;
    });
  }, [founders, founderIndustry, founderStage, founderLocation]);

  const clearInvestorFilters = () => {
    setInvestorIndustry("");
    setInvestorStage("");
    setInvestorLocation("");
  };

  const clearFounderFilters = () => {
    setFounderIndustry("");
    setFounderStage("");
    setFounderLocation("");
  };

  const openInvestorModal = (investor: Investor) => {
    setSelectedInvestor(investor);
    setSelectedFounder(null);
    setIsModalOpen(true);
  };

  const openFounderModal = (founder: Founder) => {
    setSelectedFounder(founder);
    setSelectedInvestor(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedInvestor(null);
      setSelectedFounder(null);
    }, 300);
  };

  const handleConnect = () => {
    alert("Connection request sent!");
    closeModal();
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full mb-6">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              AI-Powered Matching
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Smart Match Making
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Find your perfect match. Connect with investors or discover promising startups 
            using our intelligent filtering system.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 p-1 bg-white dark:bg-gray-800">
            <button
              onClick={() => setViewMode("investors")}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                viewMode === "investors"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Find Investors
            </button>
            <button
              onClick={() => setViewMode("founders")}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                viewMode === "founders"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Find Founders
            </button>
          </div>
        </div>

        {viewMode === "investors" ? (
          <>
            {/* Investor Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filter Investors
                </h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={investorIndustry}
                    onChange={(e) => setInvestorIndustry(e.target.value)}
                    placeholder="e.g., AI/ML, FinTech, HealthTech"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stage
                  </label>
                  <input
                    type="text"
                    value={investorStage}
                    onChange={(e) => setInvestorStage(e.target.value)}
                    placeholder="e.g., Seed, Series A, Series B"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={investorLocation}
                    onChange={(e) => setInvestorLocation(e.target.value)}
                    placeholder="e.g., San Francisco, New York"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Found {filteredInvestors.length} investor{filteredInvestors.length !== 1 ? "s" : ""}
                </p>
                <button
                  onClick={clearInvestorFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Investors Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInvestors.map((investor) => (
                <div
                  key={investor.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={investor.avatar}
                      alt={investor.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {investor.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {investor.firm}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {investor.bio}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {investor.industries.join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {investor.stages.join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {investor.investmentRange}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {investor.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleInvestorFavorite(investor.id);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        isInvestorFavorite(investor.id)
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isInvestorFavorite(investor.id) ? 'fill-current' : ''}`} />
                      <span className="text-sm font-semibold">{isInvestorFavorite(investor.id) ? 'Saved' : 'Save'}</span>
                    </button>
                    <button 
                      onClick={() => openInvestorModal(investor)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Founder Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filter Founders
                </h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={founderIndustry}
                    onChange={(e) => setFounderIndustry(e.target.value)}
                    placeholder="e.g., AI/ML, FinTech, HealthTech"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stage
                  </label>
                  <input
                    type="text"
                    value={founderStage}
                    onChange={(e) => setFounderStage(e.target.value)}
                    placeholder="e.g., Seed, Series A, Series B"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={founderLocation}
                    onChange={(e) => setFounderLocation(e.target.value)}
                    placeholder="e.g., San Francisco, New York"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Found {filteredFounders.length} founder{filteredFounders.length !== 1 ? "s" : ""}
                </p>
                <button
                  onClick={clearFounderFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Founders Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFounders.map((founder) => (
                <div
                  key={founder.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={founder.avatar}
                      alt={founder.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {founder.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {founder.company}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {founder.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {founder.industry}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {founder.stage}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {founder.fundingGoal}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {founder.location}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Traction:</strong> {founder.traction}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                      <strong>Team:</strong> {founder.team}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFounderFavorite(founder.id);
                        }}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          isFounderFavorite(founder.id)
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFounderFavorite(founder.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                        onClick={() => openFounderModal(founder)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedInvestor ? "Investor Profile" : "Founder Profile"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content - Investor */}
            {selectedInvestor && (
              <div className="p-6">
                <div className="flex items-start gap-6 mb-6">
                  <img
                    src={selectedInvestor.avatar}
                    alt={selectedInvestor.name}
                    className="w-24 h-24 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedInvestor.name}
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5" />
                      {selectedInvestor.firm}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5" />
                      {selectedInvestor.email}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {selectedInvestor.location}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bio</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedInvestor.bio}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">Industries</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedInvestor.industries.map((industry, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                          >
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">Investment Stages</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedInvestor.stages.map((stage, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 rounded-full text-sm"
                          >
                            {stage}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">Investment Range</h4>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300">{selectedInvestor.investmentRange}</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Portfolio Companies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedInvestor.portfolio.map((company, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <strong className="text-gray-900 dark:text-white">{selectedInvestor.dealsCompleted}</strong> deals completed
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Content - Founder */}
            {selectedFounder && (
              <div className="p-6">
                <div className="flex items-start gap-6 mb-6">
                  <img
                    src={selectedFounder.avatar}
                    alt={selectedFounder.name}
                    className="w-24 h-24 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedFounder.name}
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5" />
                      {selectedFounder.company}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5" />
                      {selectedFounder.email}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {selectedFounder.location}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedFounder.description}</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Industry</h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{selectedFounder.industry}</p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Stage</h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{selectedFounder.stage}</p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Funding Goal</h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{selectedFounder.fundingGoal}</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Traction</h4>
                    <p className="text-gray-700 dark:text-gray-300">{selectedFounder.traction}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Team</h4>
                    <p className="text-gray-700 dark:text-gray-300">{selectedFounder.team}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex gap-4">
              <button
                onClick={closeModal}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleConnect}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Send Connection Request
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
