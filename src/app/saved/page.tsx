"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Heart, Building2, MapPin, DollarSign, TrendingUp, Briefcase, X, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

export default function SavedPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [savedInvestors, setSavedInvestors] = useState<Investor[]>([]);
  const [savedFounders, setSavedFounders] = useState<Founder[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [selectedFounder, setSelectedFounder] = useState<Founder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }

    loadSavedData();
  }, [isAuthenticated, user]);

  const loadSavedData = () => {
    if (!user) return;

    if (user.role === 'founder') {
      // Load saved investors for founders
      const foundersData = JSON.parse(localStorage.getItem('founders') || '[]');
      const founder = foundersData.find((f: any) => f.email === user.email);
      const favoriteIds = founder?.favorites || [];

      const investorsData = JSON.parse(localStorage.getItem('investors') || '[]');
      const favorites = investorsData.filter((inv: Investor) => favoriteIds.includes(inv.id));
      setSavedInvestors(favorites);
    } else if (user.role === 'investor') {
      // Load saved founders for investors
      const investorsData = JSON.parse(localStorage.getItem('investors') || '[]');
      const investor = investorsData.find((inv: any) => inv.email === user.email);
      const favoriteIds = investor?.favorites || [];

      const foundersData = JSON.parse(localStorage.getItem('founders') || '[]');
      const favorites = foundersData.filter((founder: Founder) => favoriteIds.includes(founder.id));
      setSavedFounders(favorites);
    }
  };

  const removeFavorite = (id: number, type: 'investor' | 'founder') => {
    if (!user) return;

    if (type === 'investor') {
      const foundersData = JSON.parse(localStorage.getItem('founders') || '[]');
      const founderIndex = foundersData.findIndex((f: any) => f.email === user.email);
      if (founderIndex !== -1) {
        foundersData[founderIndex].favorites = foundersData[founderIndex].favorites.filter((fid: number) => fid !== id);
        localStorage.setItem('founders', JSON.stringify(foundersData));
        loadSavedData();
      }
    } else {
      const investorsData = JSON.parse(localStorage.getItem('investors') || '[]');
      const investorIndex = investorsData.findIndex((inv: any) => inv.email === user.email);
      if (investorIndex !== -1) {
        investorsData[investorIndex].favorites = investorsData[investorIndex].favorites.filter((fid: number) => fid !== id);
        localStorage.setItem('investors', JSON.stringify(investorsData));
        loadSavedData();
      }
    }
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
    setSelectedInvestor(null);
    setSelectedFounder(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/matchmaking"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Match Making
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Saved {user?.role === 'founder' ? 'Investors' : 'Startups'}
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Your curated list of potential {user?.role === 'founder' ? 'investment partners' : 'investment opportunities'}
          </p>
        </div>

        {/* Founder View - Saved Investors */}
        {user?.role === 'founder' && (
          <div>
            {savedInvestors.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No saved investors yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Browse the Match Making page to save investors you're interested in
                </p>
                <Link
                  href="/matchmaking"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Browse Investors
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedInvestors.map((investor) => (
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
                      <button
                        onClick={() => removeFavorite(investor.id, 'investor')}
                        className="text-red-500 hover:text-red-600 transition-colors"
                        title="Remove from saved"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {investor.bio}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-700 dark:text-gray-300 line-clamp-1">
                          {investor.industries.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
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

                    <button
                      onClick={() => openInvestorModal(investor)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                    >
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Investor View - Saved Founders */}
        {user?.role === 'investor' && (
          <div>
            {savedFounders.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No saved startups yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Browse the Match Making page to save startups you're interested in
                </p>
                <Link
                  href="/matchmaking"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Browse Startups
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedFounders.map((founder) => (
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
                      <button
                        onClick={() => removeFavorite(founder.id, 'founder')}
                        className="text-red-500 hover:text-red-600 transition-colors"
                        title="Remove from saved"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
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
                    </div>

                    <button
                      onClick={() => openFounderModal(founder)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                    >
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedInvestor ? 'Investor Profile' : 'Founder Profile'}
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
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                        >
                          {company}
                        </span>
                      ))}
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
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
              <button
                onClick={closeModal}
                className="w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
