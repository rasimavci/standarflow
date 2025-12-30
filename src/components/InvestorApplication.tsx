"use client";

import { useState } from "react";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

type InvestmentStrategy = "vc" | "pe" | "both" | "";

export default function InvestorApplication() {
  const [step, setStep] = useState(1);
  const [investmentStrategy, setInvestmentStrategy] = useState<InvestmentStrategy>("");
  const [formData, setFormData] = useState({
    investorName: "",
    email: "",
    phone: "",
    organization: "",
    website: "",
    investorStructure: [] as string[],
    geography: "",
    linkedin: "",
    bio: "",
    // VC-specific fields
    vcStages: [] as string[],
    vcTicketSize: "",
    vcSectors: [] as string[],
    followOnStrategy: "",
    leadFollowPreference: "",
    // PE-specific fields
    peRevenueRange: "",
    peEbitdaRange: "",
    controlPreference: "",
    rollUpInterest: "",
    leverageTolerance: "",
    operationalInvolvement: "",
    holdingPeriod: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setStep(1);
      setInvestmentStrategy("");
      setFormData({
        investorName: "",
        email: "",
        phone: "",
        organization: "",
        website: "",
        investorStructure: [],
        geography: "",
        linkedin: "",
        bio: "",
        vcStages: [],
        vcTicketSize: "",
        vcSectors: [],
        followOnStrategy: "",
        leadFollowPreference: "",
        peRevenueRange: "",
        peEbitdaRange: "",
        controlPreference: "",
        rollUpInterest: "",
        leverageTolerance: "",
        operationalInvolvement: "",
        holdingPeriod: ""
      });
    }, 3000);
  };

  const toggleStructure = (structure: string) => {
    setFormData(prev => ({
      ...prev,
      investorStructure: prev.investorStructure.includes(structure)
        ? prev.investorStructure.filter(s => s !== structure)
        : [...prev.investorStructure, structure]
    }));
  };

  const toggleVCSector = (sector: string) => {
    setFormData(prev => ({
      ...prev,
      vcSectors: prev.vcSectors.includes(sector)
        ? prev.vcSectors.filter(s => s !== sector)
        : [...prev.vcSectors, sector]
    }));
  };

  const toggleVCStage = (stage: string) => {
    setFormData(prev => ({
      ...prev,
      vcStages: prev.vcStages.includes(stage)
        ? prev.vcStages.filter(s => s !== stage)
        : [...prev.vcStages, stage]
    }));
  };

  const handleStrategySelect = (strategy: InvestmentStrategy) => {
    setInvestmentStrategy(strategy);
    setStep(2);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SF</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">standarflow</span>
          </Link>
          <Link 
            href="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </nav>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Join as an Investor
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Connect with innovative founders and discover high-potential startups. 
                Complete your profile to start receiving curated deal flow.
              </p>
            </div>

            {submitted ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-12 text-center">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Application Submitted!
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                  Thank you for joining our investor network. We'll review your profile and send you access details within 24 hours.
                </p>
                <Link
                  href="/"
                  className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Return to Home
                </Link>
              </div>
            ) : step === 1 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                  What type of investments do you primarily make?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                  This helps us show you the most relevant opportunities
                </p>

                <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <button
                    onClick={() => handleStrategySelect("vc")}
                    className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-center group"
                  >
                    <div className="text-4xl mb-3">🚀</div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Venture Capital
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Early-stage startups with high growth potential
                    </p>
                  </button>

                  <button
                    onClick={() => handleStrategySelect("pe")}
                    className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-center group"
                  >
                    <div className="text-4xl mb-3">🏢</div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Private Equity
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Established companies with proven business models
                    </p>
                  </button>

                  <button
                    onClick={() => handleStrategySelect("both")}
                    className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-center group"
                  >
                    <div className="text-4xl mb-3">🔄</div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Both
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      I invest across different stages and company types
                    </p>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
                {/* Progress indicator */}
                <div className="mb-8">
                  <div className="flex items-center justify-center space-x-2 mb-6">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                    <div className="w-16 h-1 bg-blue-600"></div>
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm mb-4"
                  >
                    ← Change investment type ({investmentStrategy === "vc" ? "Venture Capital" : investmentStrategy === "pe" ? "Private Equity" : "Both"})
                  </button>
                </div>

                {/* Personal Information */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.investorName}
                        onChange={(e) => setFormData({...formData, investorName: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="jane@investment.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                </div>

                {/* Investment Profile */}
                <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Investment Profile</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Organization *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.organization}
                        onChange={(e) => setFormData({...formData, organization: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Investment Firm Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://yourfirm.com"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Which best describes you? (Optional, select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {/* Common options for all */}
                      {['Family Office', 'Fund of Funds', 'Investment Firm', 'Other'].map(structure => (
                        <button
                          key={structure}
                          type="button"
                          onClick={() => toggleStructure(structure)}
                          className={`px-4 py-2 rounded-lg border-2 font-medium transition ${
                            formData.investorStructure.includes(structure)
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {structure}
                        </button>
                      ))}
                      {/* VC-specific options */}
                      {(investmentStrategy === "vc" || investmentStrategy === "both") && (
                        <>
                          {['Angel Investor', 'Corporate VC'].map(structure => (
                            <button
                              key={structure}
                              type="button"
                              onClick={() => toggleStructure(structure)}
                              className={`px-4 py-2 rounded-lg border-2 font-medium transition ${
                                formData.investorStructure.includes(structure)
                                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                              }`}
                            >
                              {structure}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Geography Focus
                    </label>
                    <input
                      type="text"
                      value={formData.geography}
                      onChange={(e) => setFormData({...formData, geography: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., North America, Europe, Global"
                    />
                  </div>
                </div>

                {/* VC-specific fields */}
                {(investmentStrategy === "vc" || investmentStrategy === "both") && (
                  <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Venture Capital Preferences
                    </h3>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Preferred Investment Stages * (Select all that apply)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+'].map(stage => (
                          <button
                            key={stage}
                            type="button"
                            onClick={() => toggleVCStage(stage)}
                            className={`px-4 py-2 rounded-lg border-2 font-medium transition ${
                              formData.vcStages.includes(stage)
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {stage}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Typical Ticket Size *
                        </label>
                        <select
                          required={investmentStrategy === "vc"}
                          value={formData.vcTicketSize}
                          onChange={(e) => setFormData({...formData, vcTicketSize: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Range</option>
                          <option value="0-100k">$0 - $100K</option>
                          <option value="100k-500k">$100K - $500K</option>
                          <option value="500k-1m">$500K - $1M</option>
                          <option value="1m-5m">$1M - $5M</option>
                          <option value="5m-10m">$5M - $10M</option>
                          <option value="10m+">$10M+</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Lead vs Follow Preference
                        </label>
                        <select
                          value={formData.leadFollowPreference}
                          onChange={(e) => setFormData({...formData, leadFollowPreference: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Preference</option>
                          <option value="lead-only">Lead Only</option>
                          <option value="prefer-lead">Prefer to Lead</option>
                          <option value="either">Either Lead or Follow</option>
                          <option value="follow-only">Follow Only</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Sector Focus * (Select all that apply)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['FinTech', 'HealthTech', 'SaaS', 'E-commerce', 'AI/ML', 'CleanTech', 'EdTech', 'DeepTech'].map(sector => (
                          <button
                            key={sector}
                            type="button"
                            onClick={() => toggleVCSector(sector)}
                            className={`px-4 py-2 rounded-lg border-2 font-medium transition ${
                              formData.vcSectors.includes(sector)
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {sector}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Follow-on Strategy
                      </label>
                      <select
                        value={formData.followOnStrategy}
                        onChange={(e) => setFormData({...formData, followOnStrategy: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Strategy</option>
                        <option value="always">Always reserve for follow-ons</option>
                        <option value="selective">Selective follow-ons</option>
                        <option value="first-check-only">First check only</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* PE-specific fields */}
                {(investmentStrategy === "pe" || investmentStrategy === "both") && (
                  <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Private Equity Preferences
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Target Revenue Range *
                        </label>
                        <select
                          required={investmentStrategy === "pe"}
                          value={formData.peRevenueRange}
                          onChange={(e) => setFormData({...formData, peRevenueRange: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Range</option>
                          <option value="1m-5m">$1M - $5M</option>
                          <option value="5m-10m">$5M - $10M</option>
                          <option value="10m-25m">$10M - $25M</option>
                          <option value="25m-50m">$25M - $50M</option>
                          <option value="50m-100m">$50M - $100M</option>
                          <option value="100m+">$100M+</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Target EBITDA Range
                        </label>
                        <select
                          value={formData.peEbitdaRange}
                          onChange={(e) => setFormData({...formData, peEbitdaRange: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Range</option>
                          <option value="0-1m">$0 - $1M</option>
                          <option value="1m-5m">$1M - $5M</option>
                          <option value="5m-10m">$5M - $10M</option>
                          <option value="10m-25m">$10M - $25M</option>
                          <option value="25m+">$25M+</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Control Preference *
                        </label>
                        <select
                          required={investmentStrategy === "pe"}
                          value={formData.controlPreference}
                          onChange={(e) => setFormData({...formData, controlPreference: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Preference</option>
                          <option value="majority">Majority Control</option>
                          <option value="minority">Minority Stakes</option>
                          <option value="either">Either</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Holding Period
                        </label>
                        <select
                          value={formData.holdingPeriod}
                          onChange={(e) => setFormData({...formData, holdingPeriod: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Period</option>
                          <option value="3-5">3-5 years</option>
                          <option value="5-7">5-7 years</option>
                          <option value="7-10">7-10 years</option>
                          <option value="10+">10+ years</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Roll-up / Buy-and-Build Interest
                        </label>
                        <select
                          value={formData.rollUpInterest}
                          onChange={(e) => setFormData({...formData, rollUpInterest: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Interest</option>
                          <option value="primary">Primary Strategy</option>
                          <option value="opportunistic">Opportunistic</option>
                          <option value="not-interested">Not Interested</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Leverage Tolerance
                        </label>
                        <select
                          value={formData.leverageTolerance}
                          onChange={(e) => setFormData({...formData, leverageTolerance: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Tolerance</option>
                          <option value="low">Low (1-2x EBITDA)</option>
                          <option value="moderate">Moderate (3-4x EBITDA)</option>
                          <option value="high">High (5x+ EBITDA)</option>
                          <option value="none">No Leverage</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Operational Involvement Level
                      </label>
                      <select
                        value={formData.operationalInvolvement}
                        onChange={(e) => setFormData({...formData, operationalInvolvement: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Level</option>
                        <option value="hands-on">Hands-on / Operating Partner</option>
                        <option value="active-board">Active Board Member</option>
                        <option value="strategic">Strategic Advisor</option>
                        <option value="passive">Passive / Financial Investor</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Investment Thesis */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Investment Thesis</h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Tell us about your investment philosophy and what you look for
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your investment approach, areas of expertise, and what makes an opportunity compelling to you..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                >
                  Join Investor Network
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
